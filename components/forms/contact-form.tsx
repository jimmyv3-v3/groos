"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitContactMessage } from "@/app/actions/contact";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/data/options";
import { ROUTES } from "@/lib/routes";
import { contactSchema } from "@/lib/validation/contact";
import { MESSAGE_MAX, initialFormState, type FormValues } from "@/lib/validation/shared";
import { ChoiceField } from "./fields/choice-field";
import { ErrorSummary } from "./fields/error-summary";
import { FormAlert } from "./fields/form-alert";
import { FormContactLinks } from "./fields/form-contact-links";
import { FormMeta } from "./fields/form-meta";
import { Honeypot } from "./fields/honeypot";
import { PrivacyNotice } from "./fields/privacy-notice";
import { SubmitButton } from "./fields/submit-button";
import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";
import { useFormBehaviour, useHydrated, useSearchParam } from "./use-form-behaviour";

const FORM_ID = "contact";
const FIELD_ORDER = ["name", "phone", "email", "topic", "message"];
/** ?onderwerp= in de URL naar de enumwaarde (spec 07 §4.9). */
const TOPIC_PARAMS: Record<string, ContactTopic> = {
  werk: "job_seeker",
  personeel: "employer",
  "bel-mij-terug": "callback",
  anders: "other",
};

function str(values: FormValues, name: string): string | undefined {
  const v = values[name];
  return typeof v === "string" ? v : undefined;
}

/** Contactformulier met "bel mij terug" als onderwerp (spec 07 §4.9). */
export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations("forms");
  const tf = useTranslations("forms.contactForm.fields");
  const tc = useTranslations("common");
  const hydrated = useHydrated();
  const [state, formAction, pending] = useActionState(submitContactMessage, initialFormState);
  const param = useSearchParam("onderwerp");
  const values = state.status === "idle" ? {} : state.values;
  const fromUrl = param ? TOPIC_PARAMS[param] : undefined;
  const initialTopic = (str(values, "topic") as ContactTopic | undefined) ?? (state.status === "idle" ? fromUrl : undefined);
  const [chosenTopic, setTopic] = useState<ContactTopic | undefined>(undefined);
  const topic = chosenTopic ?? initialTopic;
  const { formRef, errors, onSubmit, onFieldChange, onFirstInteraction } = useFormBehaviour({
    formId: "contact",
    schema: contactSchema,
    state,
    analytics: { form: "contact" },
  });

  const errorText = (name: string) => {
    const code = errors[name];
    if (!code) return undefined;
    const key = `contactForm.errors.${code}`;
    return t.has(key as "contactForm.errors.generic") ? t(key as "contactForm.errors.generic") : t("contactForm.errors.generic");
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

  const callback = hydrated && topic === "callback";
  const topicHint = hydrated && topic ? topicHintFor(topic) : undefined;

  function topicHintFor(value: ContactTopic): React.ReactNode {
    switch (value) {
      case "job_seeker":
        return t.rich("contactForm.topicHints.jobseeker", {
          link: (chunks) => <Link href={ROUTES.inschrijven} className="underline underline-offset-4">{chunks}</Link>,
        });
      case "employer":
        return t.rich("contactForm.topicHints.employer", {
          link: (chunks) => <Link href={ROUTES.personeelAanvragen} className="underline underline-offset-4">{chunks}</Link>,
        });
      case "callback":
        return t("contactForm.topicHints.callback");
      case "other":
        return t("contactForm.topicHints.other");
    }
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      onFocus={onFirstInteraction}
      noValidate
      aria-labelledby="contactformulier-titel"
      className="relative grid max-w-[36rem] gap-6"
    >
      <ErrorSummary count={errorCount} text={t("common.errorSummary", { count: errorCount })} />
      <TextField {...field("name")} label={tf("name.label")} required autoComplete="name" maxLength={120} />
      <TextField
        {...field("phone")}
        label={tf("phone.label")}
        hint={tf("phone.hint")}
        required={callback}
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        maxLength={30}
      />
      <TextField
        {...field("email")}
        label={tf("email.label")}
        type="email"
        autoComplete="email"
        inputMode="email"
        maxLength={254}
      />
      <ChoiceField
        key={initialTopic ?? "geen"}
        formId={FORM_ID}
        name="topic"
        legend={tf("topic.legend")}
        hint={topicHint}
        error={errorText("topic")}
        required
        layout="stack"
        gridFromSm
        defaultValue={initialTopic}
        options={CONTACT_TOPICS.map((value) => ({ value, label: tf(`topic.options.${value}`) }))}
        onValueChange={(v) => {
          setTopic(v as ContactTopic);
          onFieldChange("topic");
        }}
      />
      <TextareaField
        {...field("message")}
        label={tf("message.label")}
        hint={callback ? tf("message.hintCallback") : undefined}
        required={hydrated && topic !== undefined && !callback}
        maxLength={MESSAGE_MAX}
      />
      <Honeypot label={t("common.honeypotLabel")} />
      <FormMeta locale={locale} />
      {state.status === "error" && (
        <FormAlert
          message={t(`contactForm.errors.${state.error === "vacancyClosed" ? "generic" : state.error}`)}
          contactLinks={<FormContactLinks form="contact" whatsappText={tc("whatsapp.algemeen")} />}
        />
      )}
      <PrivacyNotice
        text={t.rich("privacy.contactNotice", {
          link: (chunks) => <Link href="/privacyverklaring#berichten">{chunks}</Link>,
        })}
      />
      <div>
        <SubmitButton label={t("contactForm.submit")} pendingLabel={t("contactForm.submitting")} pending={pending} />
      </div>
    </form>
  );
}
