"use client";

import { useTransition } from "react";
import { Download, FileText } from "lucide-react";
import { openCv } from "@/app/beheer/_actions/applications";
import { formatFileSize } from "@/app/beheer/_lib/format";
import { S, fill } from "@/app/beheer/_strings";
import { CtaButton } from "@/components/ui/cta-button";
import { useToast } from "@/components/ui/toast";

/** Cv bekijken of downloaden via een signed URL van 60 seconden (spec 08 §4.3). */
export function CvButtons({
  applicationId,
  filename,
  mime,
  sizeBytes,
}: {
  applicationId: string;
  filename: string | null;
  mime: string | null;
  sizeBytes: number | null;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const isPdf = mime === "application/pdf";

  const open = (download: boolean) =>
    startTransition(async () => {
      const result = await openCv({ applicationId, download });
      if (result.ok && result.data) window.location.assign(result.data.url);
      else toast.add({ title: result.ok ? S.errors.cvFailed : result.message, type: "error" });
    });

  return (
    <div className="grid gap-3">
      {filename && (
        <p className="flex items-center gap-2 text-base break-all">
          <FileText className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          {sizeBytes ? fill(S.applications.cv.meta, { bestand: filename, grootte: formatFileSize(sizeBytes) }) : filename}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {isPdf && (
          <CtaButton size="sm" onClick={() => open(false)} pending={pending} pendingLabel={S.applications.cv.opening}>
            <FileText aria-hidden="true" />
            {S.applications.cv.view}
          </CtaButton>
        )}
        <CtaButton size="sm" variant={isPdf ? "secondary" : "primary"} onClick={() => open(true)} disabled={pending}>
          <Download aria-hidden="true" />
          {S.applications.cv.download}
        </CtaButton>
      </div>
    </div>
  );
}
