"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { saveVacancy } from "@/app/beheer/_actions/vacancies";
import { beheerPaths } from "@/app/beheer/_lib/paths";
import { FORM_QUALIFICATIONS } from "@/app/beheer/_lib/status";
import type { PublishErrorCode } from "@/app/beheer/_lib/types";
import { vacancyWarnings, type VacancyFormValues } from "@/app/beheer/_lib/validation/vacancy";
import { S } from "@/app/beheer/_strings";
import {
  CONTRACT_TYPES,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  MIN_AGE_REASONS,
  PROVINCES,
  SHIFTS,
  type OccupationSlug,
  type VacancyStatus,
} from "@/lib/data/options";
import { isClaimConfirmed } from "@/lib/claims";
import { BeheerField } from "@/components/beheer/beheer-field";
import { ConfirmDialog } from "@/components/beheer/confirm-dialog";
import { ErrorSummary } from "@/components/beheer/error-summary";
import { useActionForm } from "@/components/beheer/use-action-form";
import { Alert } from "@/components/ui/alert";
import { CheckboxField } from "@/components/ui/checkbox";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import type { ActionResult } from "@/app/beheer/_lib/result";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { FormBlock } from "./form-block";
import { ListField } from "./list-field";

const F = S.vacancies.form.fields;
const B = S.vacancies.form.blocks;
const BLOCKS = ["basis", "tekst", "voorwaarden", "eisen", "publicatie", "vindbaarheid"] as const;

/** Labels van de foutlijst in de volgorde van het formulier. */
const FIELD_ORDER = [
  "occupation_slug",
  "title",
  "city",
  "postal_code",
  "location_label",
  "positions_count",
  "summary",
  "intro",
  "tasks",
  "requirements",
  "offer",
  "extra",
  "hours_min",
  "hours_max",
  "salary_min",
  "salary_max",
  "salary_note",
  "start_date",
  "experience_months",
  "preferred_qualifications",
  "min_age_reason",
  "contact_admin_id",
  "closes_at",
  "seo_title",
  "seo_description",
];

/**
 * Vacatureformulier in zes blokken (spec 08 §4.7). Op mobiel onder elkaar, vanaf
 * lg met een inhoudsopgave rechts. Waarschuwt bij niet-opgeslagen wijzigingen.
 */
export function VacancyForm({
  mode,
  id,
  number,
  initial,
  occupations,
  admins,
  status,
  publishErrors,
  updatedAt,
}: {
  mode: "create" | "edit";
  id: string | null;
  number: number | null;
  initial: VacancyFormValues;
  occupations: { slug: OccupationSlug; nameNl: string }[];
  admins: { id: string; displayName: string }[];
  status: VacancyStatus | null;
  publishErrors: PublishErrorCode[];
  updatedAt: string | null;
}) {
  const router = useRouter();
  const toast = useToast();
  const [dirty, setDirty] = useState(false);
  // Na een gelukte opslag is het formulier weer schoon; het resultaat komt als toast.
  const { state, formAction, onSubmit, pending } = useActionForm(async (prev: ActionResult | null, fd: FormData) => {
    const result = await saveVacancy(prev, fd);
    if (result.ok) {
      setDirty(false);
      toast.add({ title: result.toast, type: "success" });
    } else {
      toast.add({ title: result.message, type: "error" });
    }
    return result;
  });
  const [leaveTo, setLeaveTo] = useState<string | null>(null);
  const [startAsap, setStartAsap] = useState(initial.start_asap);
  const [minAge, setMinAge] = useState(initial.min_age_18);
  const [experience, setExperience] = useState(initial.experience_level);
  const [salaryMin, setSalaryMin] = useState(initial.salary_min);

  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const e = (field: string) => errors[field];
  const warnings = useMemo(() => vacancyWarnings({ salary_min: salaryMin }), [salaryMin]);
  const contractTypes = isClaimConfirmed("serviceForms") ? CONTRACT_TYPES : (["temp_agency"] as const);

  // Niet-opgeslagen wijzigingen: bevestiging bij sluiten en bij links binnen het beheer.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (ev: BeforeUnloadEvent) => {
      ev.preventDefault();
    };
    const onClick = (ev: MouseEvent) => {
      const anchor = (ev.target as HTMLElement | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/beheer") || href.startsWith("#")) return;
      ev.preventDefault();
      ev.stopPropagation();
      setLeaveTo(href);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  const summary = Object.entries(errors)
    .filter(([field]) => !field.startsWith("_"))
    .sort(([a], [b]) => FIELD_ORDER.indexOf(a) - FIELD_ORDER.indexOf(b))
    .flatMap(([field, msgs]) => msgs.map((message) => ({ field, message })));

  const publishRequired = (field: string) =>
    ["title", "city", "hours_min", "hours_max", "salary_min", "salary_max", "intro", "contact_admin_id"].includes(field)
      ? ("publish" as const)
      : undefined;

  const checkboxGroup = (
    name: "shifts" | "required_qualifications" | "preferred_qualifications" | "training_offered",
    label: string,
    hint: string,
    options: { value: string; label: string }[],
    selected: string[],
  ) => (
    <fieldset id={`veld-${name}`} className="grid min-w-0 gap-1">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      {hint && <p className="mb-1 text-sm text-muted-foreground">{hint}</p>}
      <div className="grid gap-x-6 sm:grid-cols-2">
        {options.map((o) => (
          <CheckboxField
            key={o.value}
            id={`${name}-${o.value}`}
            name={name}
            value={o.value}
            label={o.label}
            defaultChecked={selected.includes(o.value)}
          />
        ))}
      </div>
      {e(name) && <FieldError id={`${name}-fout`}>{e(name)!.join(" ")}</FieldError>}
    </fieldset>
  );

  const qualificationOptions = FORM_QUALIFICATIONS.map((q) => ({ value: q, label: S.options.qualification[q] }));
  const isDraft = !status || status === "draft";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-start">
      <form
        action={formAction}
        onSubmit={onSubmit}
        onChange={() => setDirty(true)}
        noValidate
        className="grid min-w-0 gap-6 pb-36 lg:pb-0"
      >
        <input type="hidden" name="id" value={id ?? ""} />
        <input type="hidden" name="updated_at" value={updatedAt ?? ""} />
        <ErrorSummary errors={summary} />

        <FormBlock id="basis" title={B.basis.title} description={B.basis.description}>
          <BeheerField id="occupation_slug" label={F.occupation_slug.label} hint={F.occupation_slug.hint} error={e("occupation_slug")} required="always">
            <NativeSelect name="occupation_slug" defaultValue={initial.occupation_slug} required>
              <NativeSelectOption value="" disabled>
                {F.occupation_slug.label}
              </NativeSelectOption>
              {occupations.map((o) => (
                <NativeSelectOption key={o.slug} value={o.slug}>
                  {o.nameNl}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </BeheerField>
          <BeheerField id="title" label={F.title.label} hint={F.title.hint} error={e("title")} required="always">
            <Input name="title" defaultValue={initial.title} maxLength={80} required />
          </BeheerField>
          <div className="grid gap-5 sm:grid-cols-2">
            <BeheerField id="city" label={F.city.label} hint={F.city.hint} error={e("city")} required="publish">
              <Input name="city" defaultValue={initial.city} maxLength={80} autoComplete="off" />
            </BeheerField>
            <BeheerField id="postal_code" label={F.postal_code.label} hint={F.postal_code.hint} error={e("postal_code")}>
              <Input name="postal_code" defaultValue={initial.postal_code} maxLength={7} autoComplete="off" />
            </BeheerField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <BeheerField id="province" label={F.province.label} error={e("province")} required="always">
              <NativeSelect name="province" defaultValue={initial.province}>
                {PROVINCES.map((p) => (
                  <NativeSelectOption key={p} value={p}>
                    {p}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </BeheerField>
            <BeheerField id="positions_count" label={F.positions_count.label} hint={F.positions_count.hint} error={e("positions_count")} required="always">
              <Input name="positions_count" type="number" inputMode="numeric" min={1} max={99} defaultValue={initial.positions_count} />
            </BeheerField>
          </div>
          <BeheerField id="location_label" label={F.location_label.label} hint={F.location_label.hint} error={e("location_label")}>
            <Input name="location_label" defaultValue={initial.location_label} maxLength={60} />
          </BeheerField>
        </FormBlock>

        <FormBlock id="tekst" title={B.tekst.title} description={B.tekst.description}>
          <BeheerField id="summary" label={F.summary.label} hint={F.summary.hint} error={e("summary")}>
            <Textarea name="summary" defaultValue={initial.summary} maxLength={200} rows={2} className="min-h-20" />
          </BeheerField>
          <BeheerField id="intro" label={F.intro.label} hint={F.intro.hint} error={e("intro")} required={publishRequired("intro")}>
            <Textarea name="intro" defaultValue={initial.intro} maxLength={1200} rows={4} />
          </BeheerField>
          <ListField name="tasks" label={F.tasks.label} hint={F.tasks.hint} addLabel={F.tasks.add} removeLabel={F.removeItem} initial={initial.tasks} min={3} max={10} error={e("tasks")} required />
          <ListField name="requirements" label={F.requirements.label} hint={F.requirements.hint} addLabel={F.requirements.add} removeLabel={F.removeItem} initial={initial.requirements} min={1} max={10} error={e("requirements")} required />
          <ListField name="offer" label={F.offer.label} hint={F.offer.hint} addLabel={F.offer.add} removeLabel={F.removeItem} initial={initial.offer} min={1} max={10} error={e("offer")} required />
          <BeheerField id="extra" label={F.extra.label} hint={F.extra.hint} error={e("extra")}>
            <Textarea name="extra" defaultValue={initial.extra} maxLength={1200} rows={3} />
          </BeheerField>
        </FormBlock>

        <FormBlock id="voorwaarden" title={B.voorwaarden.title} description={B.voorwaarden.description}>
          <RadioGroup legend={F.contract_type.label} description={F.contract_type.hint}>
            {contractTypes.map((c) => (
              <RadioCard key={c} id={`contract_type-${c}`} name="contract_type" value={c} label={S.options.contractType[c]} defaultChecked={initial.contract_type === c || contractTypes.length === 1} />
            ))}
          </RadioGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <BeheerField id="hours_min" label={F.hours_min.label} hint={F.hours_min.hint} error={e("hours_min")} required="publish">
              <Input name="hours_min" type="number" inputMode="numeric" min={1} max={60} defaultValue={initial.hours_min} />
            </BeheerField>
            <BeheerField id="hours_max" label={F.hours_max.label} error={e("hours_max")} required="publish">
              <Input name="hours_max" type="number" inputMode="numeric" min={1} max={60} defaultValue={initial.hours_max} />
            </BeheerField>
          </div>
          {checkboxGroup("shifts", F.shifts.label, F.shifts.hint, SHIFTS.map((s) => ({ value: s.id, label: S.options.shift[s.id] })), initial.shifts)}
          <div className="grid gap-5 sm:grid-cols-2">
            <BeheerField id="salary_min" label={F.salary_min.label} hint={F.salary_min.hint} error={e("salary_min")} required="publish">
              <Input name="salary_min" inputMode="decimal" defaultValue={initial.salary_min} onChange={(ev) => setSalaryMin(ev.target.value)} />
            </BeheerField>
            <BeheerField id="salary_max" label={F.salary_max.label} hint={F.salary_max.hint} error={e("salary_max")} required="publish">
              <Input name="salary_max" inputMode="decimal" defaultValue={initial.salary_max} />
            </BeheerField>
          </div>
          {warnings.length > 0 && (
            <Alert tone="warning" role="status">
              {warnings[0]}
            </Alert>
          )}
          <BeheerField id="salary_note" label={F.salary_note.label} hint={F.salary_note.hint} error={e("salary_note")}>
            <Input name="salary_note" defaultValue={initial.salary_note} maxLength={200} />
          </BeheerField>
          <CheckboxField id="start_asap" name="start_asap" label={F.start_asap.label} description={F.start_asap.hint} defaultChecked={initial.start_asap} />
          <StartAsapWatcher onChange={setStartAsap} />
          {!startAsap && (
            <BeheerField id="start_date" label={F.start_date.label} error={e("start_date")} required="publish">
              <Input name="start_date" type="date" defaultValue={initial.start_date} />
            </BeheerField>
          )}
        </FormBlock>

        <FormBlock id="eisen" title={B.eisen.title} description={B.eisen.description}>
          <div className="grid gap-5 sm:grid-cols-2">
            <BeheerField id="education_level" label={F.education_level.label} hint={F.education_level.hint} error={e("education_level")} required="always">
              <NativeSelect name="education_level" defaultValue={initial.education_level}>
                {EDUCATION_LEVELS.map((l) => (
                  <NativeSelectOption key={l} value={l}>
                    {S.options.education[l]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </BeheerField>
            <BeheerField id="experience_level" label={F.experience_level.label} error={e("experience_level")} required="always">
              <NativeSelect name="experience_level" defaultValue={initial.experience_level} onChange={(ev) => setExperience(ev.target.value)}>
                {EXPERIENCE_LEVELS.map((l) => (
                  <NativeSelectOption key={l} value={l}>
                    {S.options.experience[l]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </BeheerField>
          </div>
          {experience === "required" && (
            <BeheerField id="experience_months" label={F.experience_months.label} error={e("experience_months")}>
              <Input name="experience_months" type="number" inputMode="numeric" min={1} max={120} defaultValue={initial.experience_months} className="max-w-40" />
            </BeheerField>
          )}
          {checkboxGroup("required_qualifications", F.required_qualifications.label, F.required_qualifications.hint, qualificationOptions, initial.required_qualifications)}
          {checkboxGroup("preferred_qualifications", F.preferred_qualifications.label, F.preferred_qualifications.hint, qualificationOptions, initial.preferred_qualifications)}
          {checkboxGroup("training_offered", F.training_offered.label, F.training_offered.hint, qualificationOptions, initial.training_offered)}
          <MinAgeWatcher onChange={setMinAge} />
          <CheckboxField id="min_age_18" name="min_age_18" label={F.min_age_18.label} description={F.min_age_18.hint} defaultChecked={initial.min_age_18} />
          {minAge && (
            <BeheerField id="min_age_reason" label={F.min_age_reason.label} hint={F.min_age_reason.hint} error={e("min_age_reason")} required="always">
              <NativeSelect name="min_age_reason" defaultValue={initial.min_age_reason}>
                <NativeSelectOption value="">{F.min_age_reason.label}</NativeSelectOption>
                {MIN_AGE_REASONS.map((r) => (
                  <NativeSelectOption key={r} value={r}>
                    {S.options.minAgeReason[r]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </BeheerField>
          )}
        </FormBlock>

        <FormBlock id="publicatie" title={B.publicatie.title} description={B.publicatie.description}>
          <BeheerField id="contact_admin_id" label={F.contact_admin_id.label} hint={F.contact_admin_id.hint} error={e("contact_admin_id")} required="publish">
            <NativeSelect name="contact_admin_id" defaultValue={initial.contact_admin_id}>
              <NativeSelectOption value="">{S.common.nobody}</NativeSelectOption>
              {admins.map((a) => (
                <NativeSelectOption key={a.id} value={a.id}>
                  {a.displayName}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </BeheerField>
          <BeheerField
            id="closes_at"
            label={F.closes_at.label}
            hint={F.closes_at.hint}
            error={e("closes_at")}
            required={isDraft ? undefined : "always"}
          >
            <Input name="closes_at" type="date" defaultValue={initial.closes_at} className="max-w-56" />
          </BeheerField>
          <div className="grid gap-1">
            <CheckboxField id="is_featured" name="is_featured" label={F.is_featured.label} description={F.is_featured.hint} defaultChecked={initial.is_featured} />
            <CheckboxField id="is_urgent" name="is_urgent" label={F.is_urgent.label} description={F.is_urgent.hint} defaultChecked={initial.is_urgent} />
            <CheckboxField id="allow_whatsapp_apply" name="allow_whatsapp_apply" label={F.allow_whatsapp_apply.label} description={F.allow_whatsapp_apply.hint} defaultChecked={initial.allow_whatsapp_apply} />
          </div>
        </FormBlock>

        <details id="vindbaarheid" className="group rounded-2xl border border-border bg-card">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 p-4 sm:px-6">
            <span className="grid gap-0.5">
              <span className="font-display text-[1.25rem] leading-snug font-semibold">{B.vindbaarheid.title}</span>
              <span className="text-sm text-muted-foreground">{B.vindbaarheid.description}</span>
            </span>
            <span aria-hidden="true" className="text-xl text-muted-foreground transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none">
              +
            </span>
          </summary>
          <div className="grid gap-5 px-4 pb-6 sm:px-6">
            <BeheerField id="seo_title" label={F.seo_title.label} hint={F.seo_title.hint} error={e("seo_title")}>
              <Input name="seo_title" defaultValue={initial.seo_title} maxLength={60} />
            </BeheerField>
            <BeheerField id="seo_description" label={F.seo_description.label} hint={F.seo_description.hint} error={e("seo_description")}>
              <Textarea name="seo_description" defaultValue={initial.seo_description} maxLength={160} rows={3} className="min-h-24" />
            </BeheerField>
          </div>
        </details>

        <div
          data-actiebalk
          className="fixed inset-x-0 bottom-0 z-40 flex flex-wrap items-center gap-2 border-t border-border bg-background px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:sticky lg:bottom-0 lg:-mx-1 lg:rounded-xl lg:border lg:px-4 lg:pb-3 lg:shadow-md"
        >
          {isDraft && (
            <>
              <IntentButton intent="save" variant="secondary" disabled={pending} className="flex-1 sm:flex-none">
                {S.vacancies.form.saveDraft}
              </IntentButton>
              <IntentButton intent="publish" disabled={pending} className="flex-1 sm:flex-none">
                {S.vacancies.form.publish}
              </IntentButton>
            </>
          )}
          {status === "scheduled" && (
            <>
              <IntentButton intent="save" variant="secondary" disabled={pending} className="flex-1 sm:flex-none">
                {S.vacancies.form.save}
              </IntentButton>
              <IntentButton intent="publish" disabled={pending} className="flex-1 sm:flex-none">
                {S.vacancies.form.publishNow}
              </IntentButton>
            </>
          )}
          {(status === "published" || status === "closed") && (
            <IntentButton intent="save" disabled={pending} className="flex-1 sm:flex-none">
              {S.vacancies.form.publishChanges}
            </IntentButton>
          )}
          {status === "archived" && (
            <IntentButton intent="save" disabled={pending} className="flex-1 sm:flex-none">
              {S.vacancies.form.save}
            </IntentButton>
          )}
          {mode === "edit" && number !== null && (
            <Link href={beheerPaths.vacancyPreview(number)} className={ctaButtonVariants({ variant: "ghost", className: "w-full sm:w-auto" })}>
              <Eye aria-hidden="true" />
              {S.vacancies.form.preview}
            </Link>
          )}
        </div>
      </form>

      <nav aria-label={S.vacancies.form.toc} className="sticky top-20 hidden lg:block">
        <p className="mb-2 text-sm font-semibold">{S.vacancies.form.toc}</p>
        <ul className="grid gap-1 border-l border-border">
          {BLOCKS.map((b) => (
            <li key={b}>
              <a href={`#${b}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-sm text-muted-foreground hover:border-brand hover:text-foreground">
                {B[b].title}
              </a>
            </li>
          ))}
        </ul>
        {publishErrors.length > 0 && (
          <p className="mt-4 text-sm text-warning-strong">{S.vacancies.form.checklistTitle}</p>
        )}
      </nav>

      <ConfirmDialog
        open={leaveTo !== null}
        onOpenChange={(o) => !o && setLeaveTo(null)}
        title={S.dialogs.unsaved.title}
        body={S.dialogs.unsaved.body}
        confirmLabel={S.dialogs.unsaved.confirm}
        tone="destructive"
        onConfirm={() => {
          const to = leaveTo;
          setDirty(false);
          setLeaveTo(null);
          if (to) router.push(to);
        }}
      />
    </div>
  );
}

/** Verzendknop met name="intent"; de FormData neemt de waarde via de submitter mee. */
function IntentButton({
  intent,
  children,
  variant = "primary",
  disabled,
  className,
}: {
  intent: "save" | "publish";
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button type="submit" name="intent" value={intent} disabled={disabled} className={ctaButtonVariants({ variant, className })}>
      {children}
    </button>
  );
}

/** Volgt het vakje Per direct beginnen, zodat de startdatum verschijnt of verdwijnt. */
function StartAsapWatcher({ onChange }: { onChange: (v: boolean) => void }) {
  useCheckboxWatcher("start_asap", onChange);
  return null;
}

function MinAgeWatcher({ onChange }: { onChange: (v: boolean) => void }) {
  useCheckboxWatcher("min_age_18", onChange);
  return null;
}

function useCheckboxWatcher(id: string, onChange: (v: boolean) => void) {
  useEffect(() => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) return;
    const handler = () => onChange(el.checked);
    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, [id, onChange]);
}
