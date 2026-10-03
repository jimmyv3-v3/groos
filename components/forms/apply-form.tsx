"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { submitApplication } from "@/app/actions/apply";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { OccupationSlug } from "@/lib/data/options";
import { contact } from "@/lib/site";
import { applicationSchema } from "@/lib/validation/application";
import { initialFormState } from "@/lib/validation/shared";
import { ConsentField } from "./fields/consent-field";
import type { CvUploadState } from "./fields/cv-upload";
import { ErrorSummary } from "./fields/error-summary";
import { FormAlert } from "./fields/form-alert";
import { FormContactLinks } from "./fields/form-contact-links";
import { FormMeta } from "./fields/form-meta";
import { Honeypot } from "./fields/honeypot";
import { PrivacyNotice } from "./fields/privacy-notice";
import { SubmitButton } from "./fields/submit-button";
import { AvailableFromField, CvAndMessageFields, DrivingLicenseField, JobseekerPersonalFields } from "./jobseeker-fields";
import { useFormBehaviour } from "./use-form-behaviour";

export type ApplyFormVacancy = {
  number: number;
  title: string;
  occupationSlug: OccupationSlug;
  asksDrivingLicenseB: boolean;
};
type ApplyFormProps = { vacancy: ApplyFormVacancy; locale: Locale };

const FORM_ID = "solliciteren";
const FIELD_ORDER = ["firstName", "lastName", "phone", "email", "city", "mayWorkInNl", "hasDrivingLicenseB", "availableFrom", "cv", "message"];

/** Sollicitatieformulier op de vacaturepagina (spec 07 §4.4). */
export function ApplyForm({ vacancy, locale }: ApplyFormProps) {
  const t = useTranslations("forms");
  const tc = useTranslations("common");
  const action = useMemo(() => submitApplication.bind(null, vacancy.number), [vacancy.number]);
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const cvState = useRef<CvUploadState>({ status: "idle" });
  const [cvBusy, setCvBusy] = useState(false);
  const { formRef, errors, onSubmit, onFieldChange, onFirstInteraction } = useFormBehaviour({
    formId: "apply",
    schema: applicationSchema,
    state,
    analytics: { form: "apply", beroep: vacancy.occupationSlug, vacature: vacancy.number },
    isBusy: () => cvState.current.status === "uploading",
    onBusy: () => setCvBusy(true),
  });

  const values = state.status === "idle" ? {} : state.values;
  const errorText = (name: string) => {
    const code = name === "cv" && cvBusy ? "cvUploading" : errors[name];
    if (!code) return undefined;
    const key = `jobseeker.errors.${code}`;
    return t.has(key as "jobseeker.errors.generic") ? t(key as "jobseeker.errors.generic") : t("jobseeker.errors.generic");
  };
  const errorCount = Object.keys(errors).length;
  const firstInvalid = state.status === "invalid" ? FIELD_ORDER.find((n) => state.fieldErrors[n]) : undefined;
  const common = { formId: FORM_ID, values, error: errorText, autoFocusName: firstInvalid, onFieldChange };

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      onFocus={onFirstInteraction}
      noValidate
      aria-labelledby="solliciteren-titel"
      className="relative grid max-w-[36rem] gap-6"
    >
      <ErrorSummary count={errorCount} text={t("common.errorSummary", { count: errorCount })} />
      <JobseekerPersonalFields {...common} />
      {vacancy.asksDrivingLicenseB && <DrivingLicenseField {...common} />}
      <AvailableFromField {...common} />
      <CvAndMessageFields
        {...common}
        form="apply"
        onCvStateChange={(s) => {
          cvState.current = s;
          if (s.status !== "uploading") setCvBusy(false);
        }}
      />
      <ConsentField
        formId={FORM_ID}
        name="retentionConsent"
        label={t("privacy.talentPool.label")}
        hint={t("privacy.talentPool.hint", { email: contact.email })}
        defaultChecked={values.retentionConsent === "on"}
      />
      <Honeypot label={t("common.honeypotLabel")} />
      <FormMeta locale={locale} />
      {state.status === "error" && (
        <FormAlert
          message={t(`jobseeker.errors.${state.error}`)}
          contactLinks={
            <FormContactLinks
              form="apply"
              whatsappText={tc("whatsapp.vacatureSolliciteren", { title: vacancy.title, number: vacancy.number })}
            />
          }
        />
      )}
      <PrivacyNotice
        text={t.rich("privacy.applyNotice", {
          link: (chunks) => <Link href="/privacyverklaring#solliciteren">{chunks}</Link>,
        })}
      />
      <div>
        <SubmitButton label={t("apply.submit")} pendingLabel={t("apply.submitting")} pending={pending} />
      </div>
    </form>
  );
}
