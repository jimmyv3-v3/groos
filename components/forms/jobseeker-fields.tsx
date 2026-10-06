"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { addDays, MESSAGE_MAX, todayAmsterdam, type FormValues } from "@/lib/validation/shared";
import { ChoiceField } from "./fields/choice-field";
import { CvUpload, type CvUploadState } from "./fields/cv-upload";
import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";
import { useHydrated } from "./use-form-behaviour";

/** Velden die solliciteren en inschrijven delen (spec 07 §4.4, §4.6). */

type Common = {
  formId: string;
  values: FormValues;
  error: (name: string) => string | undefined;
  autoFocusName?: string;
  onFieldChange: (name: string) => void;
};

function str(values: FormValues, name: string): string | undefined {
  const v = values[name];
  return typeof v === "string" ? v : undefined;
}

export function JobseekerPersonalFields({ formId, values, error, autoFocusName, onFieldChange }: Common) {
  const t = useTranslations("forms.jobseeker.fields");
  const hydrated = useHydrated();
  const [mayWork, setMayWork] = useState<string | undefined>(str(values, "mayWorkInNl"));
  const field = (name: string) => ({
    formId,
    name,
    error: error(name),
    defaultValue: str(values, name),
    autoFocus: autoFocusName === name,
    onChange: () => onFieldChange(name),
  });

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          {...field("firstName")}
          label={t("firstName.label")}
          required
          autoComplete="given-name"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={80}
        />
        <TextField
          {...field("lastName")}
          label={t("lastName.label")}
          hint={t("lastName.hint")}
          required
          autoComplete="family-name"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={120}
        />
      </div>
      <TextField
        {...field("phone")}
        label={t("phone.label")}
        hint={t("phone.hint")}
        required
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        maxLength={30}
      />
      <TextField
        {...field("email")}
        label={t("email.label")}
        hint={t("email.hint")}
        required
        type="email"
        autoComplete="email"
        inputMode="email"
        maxLength={254}
      />
      <TextField
        {...field("city")}
        label={t("city.label")}
        hint={t("city.hint")}
        required
        autoComplete="address-level2"
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={80}
      />
      <ChoiceField
        formId={formId}
        name="mayWorkInNl"
        legend={t("mayWorkInNl.legend")}
        hint={hydrated && mayWork === "no" ? t("mayWorkInNl.noHint") : undefined}
        error={error("mayWorkInNl")}
        required
        defaultValue={str(values, "mayWorkInNl")}
        options={[
          { value: "yes", label: t("mayWorkInNl.yes") },
          { value: "no", label: t("mayWorkInNl.no") },
        ]}
        onValueChange={(v) => {
          setMayWork(v);
          onFieldChange("mayWorkInNl");
        }}
      />
    </>
  );
}

export function DrivingLicenseField({ formId, values, error, onFieldChange }: Common) {
  const t = useTranslations("forms.jobseeker.fields.hasDrivingLicenseB");
  return (
    <ChoiceField
      formId={formId}
      name="hasDrivingLicenseB"
      legend={t("legend")}
      error={error("hasDrivingLicenseB")}
      defaultValue={str(values, "hasDrivingLicenseB")}
      options={[
        { value: "yes", label: t("yes") },
        { value: "no", label: t("no") },
      ]}
      onValueChange={() => onFieldChange("hasDrivingLicenseB")}
    />
  );
}

export function AvailableFromField({ formId, values, error, autoFocusName, onFieldChange }: Common) {
  const t = useTranslations("forms.jobseeker.fields.availableFrom");
  const hydrated = useHydrated();
  const today = hydrated ? todayAmsterdam() : undefined;
  return (
    <TextField
      formId={formId}
      name="availableFrom"
      label={t("label")}
      hint={t("hint")}
      type="date"
      autoComplete="off"
      min={today}
      max={today ? addDays(today, 365) : undefined}
      defaultValue={str(values, "availableFrom")}
      error={error("availableFrom")}
      autoFocus={autoFocusName === "availableFrom"}
      onChange={() => onFieldChange("availableFrom")}
      className="sm:max-w-xs"
    />
  );
}

export function CvAndMessageFields({
  formId,
  form,
  values,
  error,
  autoFocusName,
  onFieldChange,
  onCvStateChange,
}: Common & { form: "apply" | "register"; onCvStateChange: (s: CvUploadState) => void }) {
  const t = useTranslations("forms.jobseeker");
  return (
    <>
      <div className="grid gap-2">
        <CvUpload
          formId={formId}
          form={form}
          error={error("cv")}
          onStateChange={(s) => {
            onCvStateChange(s);
            if (s.status !== "uploading") onFieldChange("cv");
          }}
        />
        <p className="text-sm text-muted-foreground">{t("cv.noCv")}</p>
      </div>
      <TextareaField
        formId={formId}
        name="message"
        label={t("fields.message.label")}
        hint={t("fields.message.hint")}
        maxLength={MESSAGE_MAX}
        defaultValue={str(values, "message")}
        error={error("message")}
        autoFocus={autoFocusName === "message"}
        onChange={() => onFieldChange("message")}
      />
    </>
  );
}
