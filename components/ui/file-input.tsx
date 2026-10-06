"use client";

import * as React from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { IconTile } from "@/components/ui/icon-tile";

/**
 * Bestandskeuze voor één cv (spec 02 §4.7). Opbouw van label, hulptekst en fout
 * naar 21st.dev 25108 (cnippet-dev, File Upload Field); vlak en gedrag eigen.
 * Het native veld blijft focusbaar (sr-only). Het component valideert type en
 * grootte en meldt dat via onFileChange; de upload zelf is van spec 07.
 */
type FileInputProps = {
  id: string;
  /** Zonder name komt het bestand niet in de FormData (upload via signed URL, spec 07). */
  name?: string;
  accept: string;
  maxSizeMb?: number;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  labels: { choose: string; change: string; remove: string; hint: string };
  onFileChange?: (file: File | null, problem: "type" | "size" | null) => void;
  className?: string;
};

const sizeFormat = new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 1 });

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${sizeFormat.format(Math.max(bytes / 1024, 0.1))} kB`;
  return `${sizeFormat.format(bytes / (1024 * 1024))} MB`;
}

function matchesAccept(file: File, accept: string) {
  const rules = accept
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

function FileInput({
  id,
  name,
  accept,
  maxSizeMb = 10,
  required,
  disabled,
  invalid,
  describedBy,
  labels,
  onFileChange,
  className,
}: FileInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const hintId = `${id}-hint`;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    if (!next) {
      onFileChange?.(null, null);
      return;
    }
    const problem = !matchesAccept(next, accept)
      ? "type"
      : next.size > maxSizeMb * 1024 * 1024
        ? "size"
        : null;
    onFileChange?.(next, problem);
  }

  function handleRemove() {
    if (inputRef.current) inputRef.current.value = "";
    setFile(null);
    onFileChange?.(null, null);
    inputRef.current?.focus();
  }

  return (
    <div
      data-slot="file-input"
      className={cn(
        "relative flex min-h-20 items-center gap-4 rounded-xl border-2 border-dashed border-border-strong bg-muted/60 p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        file && "border-solid border-brand bg-brand-tint",
        invalid && "border-destructive",
        disabled && "opacity-60",
        className,
      )}
    >
      <IconTile icon={file ? FileText : Upload} tone={file ? "brand" : "tint"} />
      {/* Zonder bestand is de hele zone het tikdoel (after: over de container). */}
      <label
        htmlFor={id}
        className={cn(
          "flex min-w-0 flex-1 cursor-pointer flex-col gap-1 sm:flex-row sm:items-center sm:gap-4",
          !file && "after:absolute after:inset-0 after:rounded-xl",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={[hintId, describedBy].filter(Boolean).join(" ")}
          onChange={handleChange}
          className="sr-only"
        />
        {file ? (
          <span className="grid min-w-0 gap-0.5">
            <span className="line-clamp-2 text-base font-medium wrap-anywhere text-foreground">{file.name}</span>
            <span className="text-sm tabular-nums text-muted-foreground">
              {formatSize(file.size)} · <span className="text-brand underline underline-offset-4">{labels.change}</span>
            </span>
          </span>
        ) : (
          <>
            <span
              aria-hidden="true"
              className={ctaButtonVariants({ variant: "secondary", size: "sm", className: "self-start sm:self-auto" })}
            >
              {labels.choose}
            </span>
            <span id={hintId} className="text-sm text-muted-foreground">
              {labels.hint}
            </span>
          </>
        )}
        {file && (
          <span id={hintId} className="sr-only">
            {labels.hint}
          </span>
        )}
      </label>
      {file && (
        <button
          type="button"
          onClick={handleRemove}
          aria-label={labels.remove}
          data-slot="cta-button"
          className={ctaButtonVariants({ variant: "ghost", size: "icon" })}
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export { FileInput };
