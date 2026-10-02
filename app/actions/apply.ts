"use server";

import { after } from "next/server";
import { redirect } from "@/i18n/navigation";
import { getVacancyByNumber } from "@/lib/data/vacancies";
import { sendApplicationEmails } from "@/lib/email/forms";
import { PRIVACY_NOTICE_VERSION } from "@/lib/legal";
import { paths } from "@/lib/routes";
import { CvUploadError, finalizeCvUpload, removeApplicationFiles } from "@/lib/supabase/cv-storage";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { applicationSchema } from "@/lib/validation/application";
import {
  ARRAY_FIELDS,
  formDataToRecord,
  toFieldErrors,
  valuesForState,
  type FormState,
} from "@/lib/validation/shared";
import { buildUtm, findBySubmissionId, guardSubmission, logFormFailure, trackSubmit } from "./_shared";

const CV_ERRORS: Record<CvUploadError["code"], string> = {
  invalid_path: "cvUploadExpired",
  not_found: "cvUploadExpired",
  too_large: "cvTooLarge",
  type_mismatch: "cvType",
  storage: "cvUploadFailed",
};

/** Sollicitatie op een vacature (spec 07 §5.5). Het nummer komt via bind binnen. */
export async function submitApplication(vacancyNumber: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formDataToRecord(formData, ARRAY_FIELDS);
  const values = valuesForState(raw);

  if ((await guardSubmission(raw, [raw.message as string | undefined])) === "blocked") {
    logFormFailure("apply", "blocked");
    return { status: "error", error: "blocked", values };
  }

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) return { status: "invalid", fieldErrors: toFieldErrors(parsed.error), values };
  const data = parsed.data;
  const submissionId = data.submissionId ?? crypto.randomUUID();
  const locale = data.locale;

  let reference: string | null = null;
  try {
    const existing = await findBySubmissionId("applications", submissionId);
    if (existing) reference = existing.reference;
  } catch {
    // Geen database: de insert hieronder geeft dan de algemene fout.
  }

  if (!reference) {
    const vacancy = await getVacancyByNumber(vacancyNumber);
    if (!vacancy || vacancy.state !== "open") return { status: "error", error: "vacancyClosed", values };

    const applicationId = crypto.randomUUID();
    let cv: Awaited<ReturnType<typeof finalizeCvUpload>> | null = null;
    if (data.cvPath) {
      try {
        cv = await finalizeCvUpload({ pendingPath: data.cvPath, applicationId, originalName: data.cvFilename });
      } catch (error) {
        const code = error instanceof CvUploadError ? CV_ERRORS[error.code] : "cvUploadFailed";
        logFormFailure("apply", `cv_${code}`);
        return { status: "invalid", fieldErrors: { cv: code }, values };
      }
    }

    try {
      const { data: row, error } = await createSupabaseAdminClient()
        .from("applications")
        .insert({
          id: applicationId,
          kind: "vacancy",
          vacancy_id: vacancy.id,
          vacancy_number: vacancy.number,
          vacancy_title_snapshot: vacancy.title.slice(0, 80),
          occupation_slugs: [vacancy.occupation.slug],
          source: "website",
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_e164: data.phone,
          city: data.city,
          may_work_in_nl: data.mayWorkInNl,
          available_from: data.availableFrom ?? null,
          has_driving_license_b: vacancy.asksDrivingLicenseB ? (data.hasDrivingLicenseB ?? null) : null,
          message: data.message ?? null,
          cv_path: cv?.cvPath ?? null,
          cv_filename: cv?.cvFilename ?? null,
          cv_mime: cv?.cvMime ?? null,
          cv_size: cv?.cvSize ?? null,
          locale,
          utm: buildUtm(data),
          retention_consent: data.retentionConsent,
          privacy_notice_version: PRIVACY_NOTICE_VERSION,
          submission_id: submissionId,
        })
        .select("reference")
        .single();
      if (error) {
        if (cv) await removeApplicationFiles([applicationId]);
        if (error.code === "23505") {
          const existing = await findBySubmissionId("applications", submissionId);
          reference = existing?.reference ?? null;
        }
        if (!reference) {
          logFormFailure("apply", "insert", { pgCode: error.code });
          return { status: "error", error: "generic", values };
        }
      } else {
        reference = row.reference;
        const occupation = vacancy.occupation.slug;
        after(async () => {
          await sendApplicationEmails({ applicationId });
          await trackSubmit({ form: "apply", beroep: occupation, vacature: vacancy.number });
        });
      }
    } catch {
      if (cv) await removeApplicationFiles([applicationId]).catch(() => undefined);
      logFormFailure("apply", "insert");
      return { status: "error", error: "generic", values };
    }
  }

  redirect({ href: { pathname: paths.bedankt("sollicitatie"), query: reference ? { ref: reference } : {} }, locale });
  return { status: "idle" };
}
