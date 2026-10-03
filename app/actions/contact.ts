"use server";

import { after } from "next/server";
import { redirect } from "@/i18n/navigation";
import { sendContactEmails } from "@/lib/email/forms";
import { PRIVACY_NOTICE_VERSION } from "@/lib/legal";
import { paths } from "@/lib/routes";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validation/contact";
import {
  ARRAY_FIELDS,
  LINK_LIMIT,
  countLinks,
  formDataToRecord,
  toFieldErrors,
  valuesForState,
  type FormState,
} from "@/lib/validation/shared";
import { findBySubmissionId, guardSubmission, logFormFailure, trackSubmit } from "./_shared";

/**
 * Contactbericht (spec 07 §5.5). Zonder linkcontrole in de guard: een bericht
 * met LINK_LIMIT of meer links komt binnen als spam, zonder mail.
 */
export async function submitContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = formDataToRecord(formData, ARRAY_FIELDS);
  const values = valuesForState(raw);

  if ((await guardSubmission(raw, [])) === "blocked") {
    logFormFailure("contact", "blocked");
    return { status: "error", error: "blocked", values };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { status: "invalid", fieldErrors: toFieldErrors(parsed.error), values };
  const data = parsed.data;
  const submissionId = data.submissionId ?? crypto.randomUUID();
  const locale = data.locale;

  let duplicate = false;
  try {
    duplicate = (await findBySubmissionId("contact_messages", submissionId)) !== null;
  } catch {
    // Geen database: de insert hieronder geeft dan de algemene fout.
  }

  if (!duplicate) {
    const spam = countLinks(data.message) >= LINK_LIMIT;
    try {
      const { data: row, error } = await createSupabaseAdminClient()
        .from("contact_messages")
        .insert({
          name: data.name,
          email: data.email ?? null,
          phone_e164: data.phone ?? null,
          topic: data.topic,
          message: data.message ?? null,
          locale,
          privacy_notice_version: PRIVACY_NOTICE_VERSION,
          submission_id: submissionId,
          ...(spam ? { status: "spam" as const } : {}),
        })
        .select("id")
        .single();
      if (error) {
        if (error.code !== "23505") {
          logFormFailure("contact", "insert", { pgCode: error.code });
          return { status: "error", error: "generic", values };
        }
      } else if (!spam) {
        const contactMessageId = row.id;
        after(async () => {
          await sendContactEmails({ contactMessageId });
          await trackSubmit({ form: "contact" });
        });
      }
    } catch {
      logFormFailure("contact", "insert");
      return { status: "error", error: "generic", values };
    }
  }

  redirect({ href: paths.bedankt("contact"), locale });
  return { status: "idle" };
}
