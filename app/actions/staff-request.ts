"use server";

import { after } from "next/server";
import { redirect } from "@/i18n/navigation";
import { sendStaffRequestEmails } from "@/lib/email/forms";
import { PRIVACY_NOTICE_VERSION } from "@/lib/legal";
import { paths } from "@/lib/routes";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  ARRAY_FIELDS,
  formDataToRecord,
  toFieldErrors,
  valuesForState,
  type FormState,
} from "@/lib/validation/shared";
import { staffRequestSchema } from "@/lib/validation/staff-request";
import { buildUtm, findBySubmissionId, guardSubmission, logFormFailure, trackSubmit } from "./_shared";

/** Personeelsaanvraag (spec 07 §5.5). */
export async function submitStaffRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formDataToRecord(formData, ARRAY_FIELDS);
  const values = valuesForState(raw);

  const texts = [raw.description, raw.occupationOther] as (string | undefined)[];
  if ((await guardSubmission(raw, texts)) === "blocked") {
    logFormFailure("staffRequest", "blocked");
    return { status: "error", error: "blocked", values };
  }

  const parsed = staffRequestSchema.safeParse(raw);
  if (!parsed.success) return { status: "invalid", fieldErrors: toFieldErrors(parsed.error), values };
  const data = parsed.data;
  const submissionId = data.submissionId ?? crypto.randomUUID();
  const locale = data.locale;

  let reference: string | null = null;
  try {
    const existing = await findBySubmissionId("staff_requests", submissionId);
    if (existing) reference = existing.reference;
  } catch {
    // Geen database: de insert hieronder geeft dan de algemene fout.
  }

  if (!reference) {
    try {
      const { data: row, error } = await createSupabaseAdminClient()
        .from("staff_requests")
        .insert({
          company_name: data.companyName,
          contact_name: data.contactName,
          email: data.email,
          phone_e164: data.phone,
          kvk_number: data.kvkNumber ?? null,
          occupation_slugs: data.occupations,
          occupation_other: data.occupationOther ?? null,
          headcount: data.headcount,
          start_asap: data.start === "asap",
          start_date: data.start === "date" ? (data.startDate ?? null) : null,
          duration: data.duration,
          hours_per_week: data.hoursPerWeek ?? null,
          work_city: data.workCity,
          description: data.description ?? null,
          locale,
          utm: buildUtm(data),
          privacy_notice_version: PRIVACY_NOTICE_VERSION,
          submission_id: submissionId,
        })
        .select("id, reference")
        .single();
      if (error) {
        if (error.code === "23505") {
          const existing = await findBySubmissionId("staff_requests", submissionId);
          reference = existing?.reference ?? null;
        }
        if (!reference) {
          logFormFailure("staffRequest", "insert", { pgCode: error.code });
          return { status: "error", error: "generic", values };
        }
      } else {
        reference = row.reference;
        const staffRequestId = row.id;
        const beroep = data.occupations.length === 1 ? data.occupations[0] : undefined;
        after(async () => {
          await sendStaffRequestEmails({ staffRequestId });
          await trackSubmit({ form: "staffRequest", beroep });
        });
      }
    } catch {
      logFormFailure("staffRequest", "insert");
      return { status: "error", error: "generic", values };
    }
  }

  redirect({ href: { pathname: paths.bedankt("aanvraag"), query: reference ? { ref: reference } : {} }, locale });
  return { status: "idle" };
}
