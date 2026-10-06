"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitStaffRequest } from "@/app/actions/staff-request";
import { FieldSet } from "@/components/ui/field";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { OCCUPATION_SLUGS, REQUEST_DURATIONS, type OccupationSlug } from "@/lib/data/options";
import { MESSAGE_MAX, initialFormState, todayAmsterdam, type FormValues } from "@/lib/validation/shared";
import { staffRequestSchema } from "@/lib/validation/staff-request";
import { CheckboxGroupField } from "./fields/checkbox-group-field";
import { ChoiceField } from "./fields/choice-field";
import { ErrorSummary } from "./fields/error-summary";
import { FormAlert } from "./fields/form-alert";
import { FormContactLinks } from "./fields/form-contact-links";
import { FormMeta } from "./fields/form-meta";
import { Honeypot } from "./fields/honeypot";
import { PrivacyNotice } from "./fields/privacy-notice";
import { SelectField } from "./fields/select-field";
import { SubmitButton } from "./fields/submit-button";
import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";
import { useFormBehaviour, useHydrated, useSearchParam } from "./use-form-behaviour";

type StaffRequestFormProps = { locale: Locale; occupationOptions: { value: OccupationSlug; label: string }[] };

const FORM_ID = "aanvragen";
const FIELD_ORDER = [
  "companyName",
  "contactName",
  "phone",
  "email",
  "kvkNumber",
  "occupations",
  "occupationOther",
  "headcount",
  "start",
  "startDate",
  "duration",
  "hoursPerWeek",
  "workCity",
  "description",
];

function str(values: FormValues, name: string): string | undefined {
  const v = values[name];
  return typeof v === "string" ? v : undefined;
}

const legendClasses = "mb-2 font-display text-h3 font-semibold text-foreground";

/** Personeelsaanvraag in twee groepen op één pagina (spec 07 §4.7). */
export function StaffRequestForm({ locale, occupationOptions }: StaffRequestFormProps) {
  const t = useTranslations("forms");
  const tf = useTranslations("forms.staffRequest.fields");
  const tc = useTranslations("common");
  const hydrated = useHydrated();
  const [state, formAction, pending] = useActionState(submitStaffRequest, initialFormState);
  const beroepParam = useSearchParam("beroep");
  const values = state.status === "idle" ? {} : state.values;
  const [start, setStart] = useState<string | undefined>(str(values, "start"));
  const { formRef, errors, onSubmit, onFieldChange, onFirstInteraction } = useFormBehaviour({
    formId: "staffRequest",
    schema: staffRequestSchema,
    state,
    analytics: { form: "staffRequest" },
  });

  const errorText = (name: string) => {
    const code = errors[name];
    if (!code) return undefined;
    const key = `staffRequest.errors.${code}`;
    return t.has(key as "staffRequest.errors.generic") ? t(key as "staffRequest.errors.generic") : t("staffRequest.errors.generic");
  };
  const errorCount = Object.keys(errors).length;
  const firstInvalid = state.status === "invalid" ? FIELD_ORDER.find((n) => state.fieldErrors[n]) : undefined;
  const field = (name: string) => ({
    formId: FORM_ID,
    name,
    error: errorText(name),
    defaultValue: str(values, name),
    autoFocus: firstInvalid === name,
    onChange: () => onFieldChange(name),
  });

  const chosen = Array.isArray(values.occupations) ? values.occupations : [];
  const preset =
    state.status === "idle" && beroepParam && (OCCUPATION_SLUGS as readonly string[]).includes(beroepParam)
      ? [beroepParam]
      : chosen;
  const showDate = !hydrated || start === "date";

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      onFocus={onFirstInteraction}
      noValidate
      aria-labelledby="aanvragen-titel"
      className="relative grid max-w-[36rem] grid-cols-[minmax(0,1fr)] gap-10"
    >
      <ErrorSummary count={errorCount} text={t("common.errorSummary", { count: errorCount })} />

      <FieldSet className="min-w-0 gap-6">
        <legend className={legendClasses}>{t("staffRequest.groups.company")}</legend>
        <TextField
          {...field("companyName")}
          label={tf("companyName.label")}
          required
          autoComplete="organization"
          autoCorrect={false}
          maxLength={120}
        />
        <TextField
          {...field("contactName")}
          label={tf("contactName.label")}
          required
          autoComplete="name"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={120}
        />
        <TextField
          {...field("phone")}
          label={tf("phone.label")}
          hint={tf("phone.hint")}
          required
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={30}
        />
        <TextField
          {...field("email")}
          label={tf("email.label")}
          hint={tf("email.hint")}
          required
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
        />
        <TextField
          {...field("kvkNumber")}
          label={tf("kvkNumber.label")}
          hint={tf("kvkNumber.hint")}
          autoComplete="off"
          inputMode="numeric"
          maxLength={12}
          className="sm:max-w-xs"
        />
      </FieldSet>

      <FieldSet className="min-w-0 gap-6">
        <legend className={legendClasses}>{t("staffRequest.groups.request")}</legend>
        <CheckboxGroupField
          key={preset.join(",")}
          formId={FORM_ID}
          name="occupations"
          legend={tf("occupations.legend")}
          hint={tf("occupations.hint")}
          error={errorText("occupations")}
          options={occupationOptions}
          defaultValue={preset}
          onValuesChange={() => onFieldChange("occupations")}
        />
        <TextField
          {...field("occupationOther")}
          label={tf("occupationOther.label")}
          hint={tf("occupationOther.hint")}
          autoComplete="off"
          maxLength={120}
        />
        <TextField
          {...field("headcount")}
          defaultValue={str(values, "headcount") ?? "1"}
          label={tf("headcount.label")}
          required
          type="number"
          inputMode="numeric"
          autoComplete="off"
          min="1"
          max="500"
          className="sm:max-w-xs"
        />
        <ChoiceField
          formId={FORM_ID}
          name="start"
          legend={tf("start.legend")}
          error={errorText("start")}
          required
          // Onder elkaar op een telefoon: naast elkaar breken deze labels in drie regels.
          layout="stack"
          gridFromSm
          defaultValue={str(values, "start")}
          options={[
            { value: "asap", label: tf("start.asap") },
            { value: "date", label: tf("start.date") },
          ]}
          onValueChange={(v) => {
            setStart(v);
            onFieldChange("start");
          }}
        />
        {showDate && (
          <TextField
            {...field("startDate")}
            label={tf("startDate.label")}
            required={start === "date"}
            type="date"
            autoComplete="off"
            min={hydrated ? todayAmsterdam() : undefined}
            className="sm:max-w-xs"
          />
        )}
        <SelectField
          formId={FORM_ID}
          name="duration"
          label={tf("duration.label")}
          error={errorText("duration")}
          defaultValue={str(values, "duration") ?? "unknown"}
          options={REQUEST_DURATIONS.map((d) => ({ value: d, label: tf(`duration.options.${d}`) }))}
          onChange={() => onFieldChange("duration")}
        />
        <TextField
          {...field("hoursPerWeek")}
          label={tf("hoursPerWeek.label")}
          hint={tf("hoursPerWeek.hint")}
          type="number"
          inputMode="numeric"
          autoComplete="off"
          min="1"
          max="60"
          className="sm:max-w-xs"
        />
        <TextField
          {...field("workCity")}
          label={tf("workCity.label")}
          required
          autoComplete="off"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={80}
        />
        <TextareaField
          {...field("description")}
          label={tf("description.label")}
          hint={tf("description.hint")}
          maxLength={MESSAGE_MAX}
        />
      </FieldSet>

      <div className="grid gap-6">
        <Honeypot label={t("common.honeypotLabel")} />
        <FormMeta locale={locale} />
        {state.status === "error" && (
          <FormAlert
            message={t(`staffRequest.errors.${state.error === "vacancyClosed" ? "generic" : state.error}`)}
            contactLinks={<FormContactLinks form="staffRequest" whatsappText={tc("whatsapp.werkgever")} />}
          />
        )}
        <PrivacyNotice
          text={t.rich("privacy.staffRequestNotice", {
            link: (chunks) => <Link href="/privacyverklaring#opdrachtgevers">{chunks}</Link>,
          })}
        />
        <div>
          <SubmitButton label={t("staffRequest.submit")} pendingLabel={t("staffRequest.submitting")} pending={pending} />
        </div>
      </div>
    </form>
  );
}
