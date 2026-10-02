"use client";

import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { submitRegistration } from "@/app/actions/register";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { OCCUPATION_SLUGS, type OccupationSlug } from "@/lib/data/options";
import { contact } from "@/lib/site";
import { registrationSchema } from "@/lib/validation/registration";
import { initialFormState } from "@/lib/validation/shared";
import { CheckboxGroupField } from "./fields/checkbox-group-field";
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
import { useFormBehaviour, useSearchParam } from "./use-form-behaviour";

type RegisterFormProps = { locale: Locale; occupationOptions: { value: OccupationSlug; label: string }[] };

const FORM_ID = "inschrijven";
const FIELD_ORDER = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "city",
  "mayWorkInNl",
  "occupations",
  "hasDrivingLicenseB",
  "availableFrom",
  "cv",
  "message",
  "retentionConsent",
];

/** Inschrijfformulier zonder vacature (spec 07 §4.6). */
export function RegisterForm({ locale, occupationOptions }: RegisterFormProps) {
  const t = useTranslations("forms");
  const tc = useTranslations("common");
  const [state, formAction, pending] = useActionState(submitRegistration, initialFormState);
  const cvState = useRef<CvUploadState>({ status: "idle" });
  const [cvBusy, setCvBusy] = useState(false);
  const beroepParam = useSearchParam("beroep");
  const { formRef, errors, onSubmit, onFieldChange, onFirstInteraction } = useFormBehaviour({
    formId: "register",
    schema: registrationSchema,
    state,
    analytics: { form: "register" },
    isBusy: () => cvState.current.status === "uploading",
    onBusy: () => setCvBusy(true),
  });

  const values = state.status === "idle" ? {} : state.values;
  const errorText = (name: string) => {
    const code = name === "cv" && cvBusy ? "cvUploading" : errors[name];
    if (!code) return undefined;
    if (code === "registerConsentRequired") return t("privacy.registerConsent.error");
    const key = `jobseeker.errors.${code}`;
    return t.has(key as "jobseeker.errors.generic") ? t(key as "jobseeker.errors.generic") : t("jobseeker.errors.generic");
  };
  const errorCount = Object.keys(errors).length;
  const firstInvalid = state.status === "invalid" ? FIELD_ORDER.find((n) => state.fieldErrors[n]) : undefined;
  const common = { formId: FORM_ID, values, error: errorText, autoFocusName: firstInvalid, onFieldChange };

  const chosen = Array.isArray(values.occupations) ? values.occupations : [];
  const preset =
    state.status === "idle" && beroepParam && (OCCUPATION_SLUGS as readonly string[]).includes(beroepParam)
      ? [beroepParam]
      : chosen;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      onFocus={onFirstInteraction}
      noValidate
      aria-labelledby="inschrijven-titel"
      className="relative grid max-w-[36rem] gap-6"
    >
      <ErrorSummary count={errorCount} text={t("common.errorSummary", { count: errorCount })} />
      <JobseekerPersonalFields {...common} />
      <CheckboxGroupField
        key={preset.join(",")}
        formId={FORM_ID}
        name="occupations"
        legend={t("register.fields.occupations.legend")}
        hint={t("register.fields.occupations.hint")}
        error={errorText("occupations")}
        options={occupationOptions}
        defaultValue={preset}
        onValuesChange={() => onFieldChange("occupations")}
      />
      <DrivingLicenseField {...common} />
      <AvailableFromField {...common} />
      <CvAndMessageFields
        {...common}
        form="register"
        onCvStateChange={(s) => {
          cvState.current = s;
          if (s.status !== "uploading") setCvBusy(false);
        }}
      />
      <ConsentField
        formId={FORM_ID}
        name="retentionConsent"
        label={t("privacy.registerConsent.label")}
        hint={t("privacy.registerConsent.hint", { email: contact.email })}
        error={errorText("retentionConsent")}
        required
        defaultChecked={values.retentionConsent === "on"}
        onChange={() => onFieldChange("retentionConsent")}
      />
      <Honeypot label={t("common.honeypotLabel")} />
      <FormMeta locale={locale} />
      {state.status === "error" && (
        <FormAlert
          message={t(`jobseeker.errors.${state.error}`)}
          contactLinks={<FormContactLinks form="register" whatsappText={tc("whatsapp.werkzoekende")} />}
        />
      )}
      <PrivacyNotice
        text={t.rich("privacy.registerNotice", {
          link: (chunks) => <Link href="/privacyverklaring#inschrijven">{chunks}</Link>,
        })}
      />
      <div>
        <SubmitButton label={t("register.submit")} pendingLabel={t("register.submitting")} pending={pending} />
      </div>
    </form>
  );
}
