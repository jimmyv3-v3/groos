"use client";

import { Check, Link2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CtaButton } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";

type Props = { url: string; labels: { copy: string; copied: string; failed: string; linkLabel: string } };

/** Kopieert de vacaturelink; meldt het resultaat in role="status" (spec 06 §4.10). */
export function CopyLinkButton({ url, labels }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === "copied") {
      const id = window.setTimeout(() => setState("idle"), 2000);
      return () => window.clearTimeout(id);
    }
    if (state === "failed") inputRef.current?.select();
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="grid gap-1">
      <CtaButton variant="secondary" onClick={copy}>
        {state === "copied" ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
        {labels.copy}
      </CtaButton>
      <p role="status" className="text-sm text-muted-foreground">
        {state === "copied" ? labels.copied : state === "failed" ? labels.failed : ""}
      </p>
      {state === "failed" && (
        <Input ref={inputRef} readOnly value={url} aria-label={labels.linkLabel} onFocus={(e) => e.currentTarget.select()} />
      )}
    </div>
  );
}
