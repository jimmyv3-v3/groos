import "server-only";
import { CV_MAX_BYTES, CV_TYPES, RETENTION_DAYS } from "@/lib/data/options";
import { createSupabaseAdminClient } from "./admin";
import type { SupabaseServerClient } from "./server";

/**
 * Storage-helpers voor cv's in de privébucket `cvs` (spec 10 §4.5). Bestanden
 * worden altijd via de Storage API verwijderd, nooit met SQL op
 * storage.objects (dan blijft het bestand bestaan).
 */

const BUCKET = "cvs";
const PENDING_PATH = /^pending\/[0-9a-f-]{36}\.(pdf|doc|docx)$/;
const SIGNED_READ_SECONDS = 60;
const FILENAME_MAX = 200;

export type CvExtension = keyof typeof CV_TYPES;

export class CvUploadError extends Error {
  code: "invalid_path" | "not_found" | "too_large" | "type_mismatch" | "storage";

  constructor(code: CvUploadError["code"], message?: string) {
    super(message ?? code);
    this.name = "CvUploadError";
    this.code = code;
  }
}

/** Eerste bytes per bestandstype (pdf, doc als OLE2, docx als zip). */
const MAGIC: Record<CvExtension, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46, 0x2d],
  doc: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
  docx: [0x50, 0x4b, 0x03, 0x04],
};

function isCvExtension(value: string): value is CvExtension {
  return Object.hasOwn(CV_TYPES, value);
}

/**
 * Signed upload URL voor één nieuw pad onder pending/ (twee uur geldig). De
 * browser uploadt met uploadToSignedUrl(path, token, file, { contentType }) en
 * gebruikt contentType uit deze functie, niet file.type (Android geeft bij
 * docx soms een leeg type).
 */
export async function createCvUploadTarget(ext: CvExtension): Promise<{
  path: string;
  token: string;
  signedUrl: string;
  contentType: string;
}> {
  if (!isCvExtension(ext)) throw new CvUploadError("invalid_path");
  const path = `pending/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await createSupabaseAdminClient().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new CvUploadError("storage", error?.message);
  return { path: data.path, token: data.token, signedUrl: data.signedUrl, contentType: CV_TYPES[ext] };
}

/** Controleert een upload en verplaatst hem naar applications/<id>/<uuid>.<ext>. */
export async function finalizeCvUpload(input: {
  pendingPath: string;
  applicationId: string;
  originalName?: string;
}): Promise<{ cvPath: string; cvFilename: string | null; cvMime: string; cvSize: number }> {
  const match = PENDING_PATH.exec(input.pendingPath);
  if (!match || !/^[0-9a-f-]{36}$/.test(input.applicationId)) throw new CvUploadError("invalid_path");
  const ext = match[1] as CvExtension;
  const storage = createSupabaseAdminClient().storage.from(BUCKET);

  const { data: blob, error: downloadError } = await storage.download(input.pendingPath);
  if (downloadError || !blob) throw new CvUploadError("not_found", downloadError?.message);
  if (blob.size > CV_MAX_BYTES) {
    await storage.remove([input.pendingPath]);
    throw new CvUploadError("too_large");
  }

  const magic = MAGIC[ext];
  const head = new Uint8Array(await blob.slice(0, magic.length).arrayBuffer());
  if (head.length < magic.length || magic.some((byte, i) => head[i] !== byte)) {
    await storage.remove([input.pendingPath]);
    throw new CvUploadError("type_mismatch");
  }

  const cvPath = `applications/${input.applicationId}/${crypto.randomUUID()}.${ext}`;
  const { error: moveError } = await storage.move(input.pendingPath, cvPath);
  if (moveError) throw new CvUploadError("storage", moveError.message);

  const baseName = input.originalName?.split(/[\\/]/).pop()?.trim() ?? "";
  const cvFilename = baseName ? baseName.slice(0, FILENAME_MAX) : null;
  return { cvPath, cvFilename, cvMime: CV_TYPES[ext], cvSize: blob.size };
}

/**
 * Signed URL van 60 seconden voor een beheerder, met een regel in activities
 * en audit_log. Word-bestanden openen altijd als download.
 */
export async function createCvReadUrl(input: {
  supabase: SupabaseServerClient;
  applicationId: string;
  download?: boolean;
}): Promise<string> {
  const { supabase, applicationId } = input;
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || !isAdmin) throw new Error("not_admin");

  const { data: application, error } = await supabase
    .from("applications")
    .select("cv_path, cv_filename")
    .eq("id", applicationId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!application?.cv_path) throw new CvUploadError("not_found");

  const isWord = /\.(doc|docx)$/.test(application.cv_path);
  const admin = createSupabaseAdminClient();
  const { data: signed, error: signError } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(
      application.cv_path,
      SIGNED_READ_SECONDS,
      isWord || input.download ? { download: application.cv_filename ?? true } : undefined,
    );
  if (signError || !signed) throw new CvUploadError("storage", signError?.message);

  const { data: claimsData } = await supabase.auth.getClaims();
  const actorId = typeof claimsData?.claims?.sub === "string" ? claimsData.claims.sub : null;

  const { error: activityError } = await supabase
    .from("activities")
    .insert({ entity_type: "application", entity_id: applicationId, kind: "cv_viewed", actor_id: actorId });
  if (activityError) console.error(`[cv-storage] activiteit cv_viewed niet opgeslagen: ${activityError.message}`);

  const { error: auditError } = await admin.from("audit_log").insert({
    actor_id: actorId,
    actor_type: "admin",
    action: "application.cv_viewed",
    entity_type: "application",
    entity_id: applicationId,
  });
  if (auditError) console.error(`[cv-storage] audit_log cv_viewed niet opgeslagen: ${auditError.message}`);

  return signed.signedUrl;
}

/** Verwijdert alle bestanden onder applications/<id>/. Ids met een Storage-fout komen niet in removedIds. */
export async function removeApplicationFiles(applicationIds: string[]): Promise<{ removedIds: string[] }> {
  const storage = createSupabaseAdminClient().storage.from(BUCKET);
  const removedIds: string[] = [];
  for (const id of applicationIds) {
    const folder = `applications/${id}`;
    const { data: files, error } = await storage.list(folder, { limit: 100 });
    if (error) {
      console.error(`[cv-storage] lijst van ${folder} mislukt: ${error.message}`);
      continue;
    }
    const paths = (files ?? []).filter((f) => f.id !== null).map((f) => `${folder}/${f.name}`);
    if (paths.length > 0) {
      const { error: removeError } = await storage.remove(paths);
      if (removeError) {
        console.error(`[cv-storage] verwijderen in ${folder} mislukt: ${removeError.message}`);
        continue;
      }
    }
    removedIds.push(id);
  }
  return { removedIds };
}

/** Verwijdert uploads onder pending/ die ouder zijn dan olderThanHours (standaard 24). */
export async function removeStalePendingUploads(
  olderThanHours: number = RETENTION_DAYS.pendingUploadHours,
): Promise<{ removed: number }> {
  const storage = createSupabaseAdminClient().storage.from(BUCKET);
  const { data: files, error } = await storage.list("pending", {
    limit: 1000,
    sortBy: { column: "created_at", order: "asc" },
  });
  if (error) throw new CvUploadError("storage", error.message);
  const cutoff = Date.now() - olderThanHours * 60 * 60 * 1000;
  const stale = (files ?? [])
    .filter((f) => f.id !== null && f.created_at && Date.parse(f.created_at) < cutoff)
    .map((f) => `pending/${f.name}`);
  if (stale.length === 0) return { removed: 0 };
  const { error: removeError } = await storage.remove(stale);
  if (removeError) throw new CvUploadError("storage", removeError.message);
  return { removed: stale.length };
}
