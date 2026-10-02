"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { contact } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

/**
 * Offerte-/contactsectie: links de intro en contactkanalen, rechts het
 * formulier. Verstuurt via Web3Forms (geen eigen backend nodig); de access key
 * staat in NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY en is per ontwerp publiek.
 * De opties voor "type opdrachtgever" staan in messages `home.contactForm.clientTypes`.
 */

type FormState = {
  naam: string;
  bedrijf: string;
  email: string;
  telefoon: string;
  plaats: string;
  opdrachtgever: string;
  bericht: string;
  akkoord: boolean;
  /** Honeypot: mensen zien dit veld niet, bots vullen het in. */
  botcheck: boolean;
};

const INITIAL: FormState = {
  naam: "",
  bedrijf: "",
  email: "",
  telefoon: "",
  plaats: "",
  opdrachtgever: "",
  bericht: "",
  akkoord: false,
  botcheck: false,
};

const INPUT_CLASS =
  "mt-1.5 w-full rounded-md border border-input bg-card/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-ring";

const LABEL_CLASS = "text-sm text-muted-foreground";

type ClientType = { value: string; label: string };

export function OfferteForm() {
  const t = useTranslations("home.contactForm");
  const clientTypes = t.raw("clientTypes") as ClientType[];
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.naam.trim()) next.naam = t("errors.name");
    if (!form.email.trim()) next.email = t("errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = t("errors.emailInvalid");
    if (!form.akkoord) next.akkoord = t("errors.consent");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setSubmitError(t("errorNotConfigured"));
      return;
    }

    const clientTypeLabel =
      clientTypes.find((o) => o.value === form.opdrachtgever)?.label ?? "";

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Nieuwe aanvraag van ${form.naam || "de website"}`,
          from_name: `${contact.shortName} website`,
          replyto: form.email,
          botcheck: form.botcheck,
          Naam: form.naam,
          Bedrijf: form.bedrijf,
          "E-mail": form.email,
          Telefoon: form.telefoon,
          "Plaats of locatie": form.plaats,
          "Type opdrachtgever": clientTypeLabel,
          Bericht: form.bericht,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setSubmitError(t("errorGeneric"));
      }
    } catch {
      setSubmitError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-24 py-16 sm:py-20"
    >
      {/* Zachte gloed achter het formulier */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[800px] max-w-full rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Links: intro en contactkanalen */}
          <RevealGroup>
            <RevealItem>
              <h2
                id="contact-heading"
                className="font-display text-2xl font-light tracking-tight sm:text-3xl"
              >
                {t.rich("heading", {
                  accent: (chunks) => (
                    <span className="accent-text font-normal">{chunks}</span>
                  ),
                })}
              </h2>
            </RevealItem>

            <RevealItem>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                {t("intro")}
              </p>
            </RevealItem>

            <RevealItem>
              <ul className="mt-8 space-y-4" role="list">
                <li>
                  <a
                    href={contact.phoneHref}
                    className="group inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                    <span>{contact.phone}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={contact.emailHref}
                    className="group inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                    <span>{contact.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                    <span>WhatsApp</span>
                  </a>
                </li>
              </ul>
            </RevealItem>

            <RevealItem>
              <dl className="mt-8 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                  <dt className="sr-only">{t("srResponseTime")}</dt>
                  <dd>{t("benefitResponse")}</dd>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                  <dt className="sr-only">{t("srCosts")}</dt>
                  <dd>{t("benefitFree")}</dd>
                </div>
              </dl>
            </RevealItem>
          </RevealGroup>

          {/* Rechts: formulierkaart */}
          <Reveal delay={0.1}>
            <div className="glass-panel rounded-lg p-6 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center" role="status">
                  <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-brand-strong" />
                  <p className="font-display text-lg font-light text-foreground">
                    {t("successTitle")}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("successBody")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <fieldset className="contents">
                    <legend className="sr-only">{t("legend")}</legend>

                    {/* Honeypot, onzichtbaar voor mensen en schermlezers */}
                    <input
                      type="checkbox"
                      name="botcheck"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                      checked={form.botcheck}
                      onChange={(e) => set("botcheck", e.target.checked)}
                    />

                    <div className="space-y-5">
                      {/* Naam */}
                      <div>
                        <label htmlFor="offerte-naam" className={LABEL_CLASS}>
                          {t("labels.name")}{" "}
                          <span aria-hidden="true" className="text-muted-foreground/40">*</span>
                        </label>
                        <input
                          id="offerte-naam"
                          type="text"
                          autoComplete="name"
                          required
                          value={form.naam}
                          onChange={(e) => set("naam", e.target.value)}
                          placeholder={t("placeholders.name")}
                          className={cn(INPUT_CLASS, errors.naam && "border-destructive/60")}
                          aria-describedby={errors.naam ? "err-naam" : undefined}
                          aria-invalid={!!errors.naam}
                        />
                        {errors.naam && (
                          <p id="err-naam" role="alert" className="mt-1 text-xs text-destructive">
                            {errors.naam}
                          </p>
                        )}
                      </div>

                      {/* Bedrijf */}
                      <div>
                        <label htmlFor="offerte-bedrijf" className={LABEL_CLASS}>
                          {t("labels.company")}{" "}
                          <span className="text-muted-foreground/40">{t("optional")}</span>
                        </label>
                        <input
                          id="offerte-bedrijf"
                          type="text"
                          autoComplete="organization"
                          value={form.bedrijf}
                          onChange={(e) => set("bedrijf", e.target.value)}
                          placeholder={t("placeholders.company")}
                          className={INPUT_CLASS}
                        />
                      </div>

                      {/* E-mail */}
                      <div>
                        <label htmlFor="offerte-email" className={LABEL_CLASS}>
                          {t("labels.email")}{" "}
                          <span aria-hidden="true" className="text-muted-foreground/40">*</span>
                        </label>
                        <input
                          id="offerte-email"
                          type="email"
                          autoComplete="email"
                          required
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder={t("placeholders.email")}
                          className={cn(INPUT_CLASS, errors.email && "border-destructive/60")}
                          aria-describedby={errors.email ? "err-email" : undefined}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p id="err-email" role="alert" className="mt-1 text-xs text-destructive">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Telefoon */}
                      <div>
                        <label htmlFor="offerte-telefoon" className={LABEL_CLASS}>
                          {t("labels.phone")}
                        </label>
                        <input
                          id="offerte-telefoon"
                          type="tel"
                          autoComplete="tel"
                          value={form.telefoon}
                          onChange={(e) => set("telefoon", e.target.value)}
                          placeholder={t("placeholders.phone")}
                          className={INPUT_CLASS}
                        />
                      </div>

                      {/* Plaats of locatie */}
                      <div>
                        <label htmlFor="offerte-plaats" className={LABEL_CLASS}>
                          {t("labels.place")}
                        </label>
                        <input
                          id="offerte-plaats"
                          type="text"
                          value={form.plaats}
                          onChange={(e) => set("plaats", e.target.value)}
                          placeholder={t("placeholders.place")}
                          className={INPUT_CLASS}
                        />
                      </div>

                      {/* Type opdrachtgever */}
                      <div>
                        <label htmlFor="offerte-opdrachtgever" className={LABEL_CLASS}>
                          {t("labels.clientType")}
                        </label>
                        <select
                          id="offerte-opdrachtgever"
                          value={form.opdrachtgever}
                          onChange={(e) => set("opdrachtgever", e.target.value)}
                          className={cn(INPUT_CLASS, "appearance-none")}
                        >
                          <option value="">{t("clientTypePlaceholder")}</option>
                          {clientTypes.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Bericht */}
                      <div>
                        <label htmlFor="offerte-bericht" className={LABEL_CLASS}>
                          {t("labels.message")}
                        </label>
                        <textarea
                          id="offerte-bericht"
                          rows={4}
                          value={form.bericht}
                          onChange={(e) => set("bericht", e.target.value)}
                          placeholder={t("placeholders.message")}
                          className={cn(INPUT_CLASS, "resize-y")}
                        />
                      </div>

                      {/* AVG-akkoord */}
                      <div>
                        <div className="flex items-start gap-3">
                          <input
                            id="offerte-akkoord"
                            type="checkbox"
                            required
                            checked={form.akkoord}
                            onChange={(e) => set("akkoord", e.target.checked)}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-current focus:ring-2 focus:ring-ring"
                            aria-describedby={errors.akkoord ? "err-akkoord" : undefined}
                            aria-invalid={!!errors.akkoord}
                          />
                          <label
                            htmlFor="offerte-akkoord"
                            className={cn(LABEL_CLASS, "cursor-pointer leading-snug")}
                          >
                            {t("labels.consent")}{" "}
                            <span aria-hidden="true" className="text-muted-foreground/40">*</span>
                          </label>
                        </div>
                        {errors.akkoord && (
                          <p id="err-akkoord" role="alert" className="mt-1 text-xs text-destructive">
                            {errors.akkoord}
                          </p>
                        )}
                      </div>

                      {/* Versturen */}
                      <div className="pt-1">
                        <CtaButton
                          type="submit"
                          size="lg"
                          className="w-full justify-center"
                          disabled={submitting}
                        >
                          {submitting ? t("submitting") : t("submit")}
                        </CtaButton>
                        {submitError && (
                          <p role="alert" className="mt-3 text-sm text-destructive">
                            {submitError}
                          </p>
                        )}
                      </div>
                    </div>
                  </fieldset>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
