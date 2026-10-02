"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { FieldError } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { Label } from "@/components/ui/label";
import { CV_MAX_BYTES } from "@/lib/data/options";
import { useHydrated } from "../use-form-behaviour";
import { FieldLabelText, fieldIds } from "./field-label";

/**
 * Cv-upload buiten de Server Action om (spec 07 §4.8): eerst een signed upload
 * URL van /api/upload/cv, dan een PUT met XMLHttpRequest voor de voortgang.
 * Zonder JavaScript toont het blok alleen een uitleg. Voortgang als dunne balk
 * onder de bestandsregel, naar 21st.dev 29444 (sean0205).
 */

export type CvUploadState =
  | { status: "idle" }
  | { status: "uploading"; name: string; percent: number }
  | { status: "done"; name: string; path: string }
  | { status: "error"; code: string };

const ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const EXTENSIONS = ["pdf", "doc", "docx"] as const;

export function CvUpload({
  formId,
  form,
  error,
  onStateChange,
}: {
  formId: string;
  form: "apply" | "register";
  error?: string;
  onStateChange?: (s: CvUploadState) => void;
}) {
  const t = useTranslations("forms.jobseeker");
  const hydrated = useHydrated();
  const ids = fieldIds(formId, "cv");
  const [state, setStateRaw] = useState<CvUploadState>({ status: "idle" });
  const [fileName, setFileName] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function setState(next: CvUploadState) {
    setStateRaw(next);
    onStateChange?.(next);
  }

  useEffect(
    () => () => {
      xhrRef.current?.abort();
      abortRef.current?.abort();
    },
    [],
  );

  function cancel() {
    xhrRef.current?.abort();
    abortRef.current?.abort();
    xhrRef.current = null;
    abortRef.current = null;
  }

  function fail(code: string) {
    cancel();
    setFileName(null);
    setInputKey((k) => k + 1);
    setState({ status: "error", code });
  }

  async function upload(file: File) {
    const ext = file.name.toLowerCase().split(".").pop() ?? "";
    if (!(EXTENSIONS as readonly string[]).includes(ext)) return fail("cvType");
    if (file.size < 1 || file.size > CV_MAX_BYTES) return fail(file.size < 1 ? "cvType" : "cvTooLarge");

    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "uploading", name: file.name, percent: 0 });

    let target: { path: string; signedUrl: string; contentType: string };
    try {
      const response = await fetch("/api/upload/cv", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ext, size: file.size }),
        signal: controller.signal,
      });
      if (response.status === 400) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        return fail(body.error === "cvTooLarge" ? "cvTooLarge" : "cvType");
      }
      if (!response.ok) return fail("cvUploadFailed");
      target = await response.json();
    } catch {
      if (controller.signal.aborted) return;
      return fail("cvUploadFailed");
    }

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("PUT", target.signedUrl);
    xhr.setRequestHeader("content-type", target.contentType);
    xhr.setRequestHeader("x-upsert", "false");
    const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (apiKey) xhr.setRequestHeader("apikey", apiKey);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      setState({ status: "uploading", name: file.name, percent: Math.round((event.loaded / event.total) * 100) });
    };
    xhr.onload = () => {
      xhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        setState({ status: "done", name: file.name, path: target.path });
        try {
          track("cv_upload", { form });
        } catch {
          // Analytics mag de upload nooit raken.
        }
      } else {
        fail("cvUploadFailed");
      }
    };
    xhr.onerror = () => fail("cvUploadFailed");
    xhr.send(file);
  }

  function handleFileChange(file: File | null, problem: "type" | "size" | null) {
    cancel();
    if (!file) {
      setFileName(null);
      setState({ status: "idle" });
      return;
    }
    if (problem) return fail(problem === "type" ? "cvType" : "cvTooLarge");
    setFileName(file.name);
    void upload(file);
  }

  const localError = state.status === "error" ? t(`errors.${state.code}` as "errors.cvType") : undefined;
  const shownError = localError ?? error;
  const percent = state.status === "uploading" ? state.percent : 0;
  // Schermlezers horen de voortgang in stappen van 25 procent.
  const spokenPercent = Math.floor(percent / 25) * 25;

  return (
    <div className="grid gap-2" data-slot="cv-upload">
      <Label htmlFor={hydrated ? ids.id : undefined} id={`${ids.id}-label`}>
        <FieldLabelText label={t("cv.label")} />
      </Label>
      {!hydrated ? (
        <p className="text-sm text-muted-foreground">{t("cv.noJs")}</p>
      ) : (
        <>
          <FileInput
            key={inputKey}
            id={ids.id}
            name=""
            accept={ACCEPT}
            maxSizeMb={10}
            invalid={Boolean(shownError)}
            describedBy={shownError ? ids.errorId : undefined}
            labels={{
              choose: t("cv.choose"),
              change: t("cv.change"),
              remove: fileName ? t("cv.removeAria", { name: fileName }) : t("cv.remove"),
              hint: t("cv.hint"),
            }}
            onFileChange={handleFileChange}
          />
          {state.status === "uploading" && (
            <div className="grid gap-1.5">
              <progress
                max={100}
                value={percent}
                aria-labelledby={`${ids.id}-label`}
                className="h-1.5 w-full overflow-hidden rounded-full bg-muted motion-reduce:transition-none [&::-moz-progress-bar]:bg-brand [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-brand [&::-webkit-progress-value]:transition-[width] motion-reduce:[&::-webkit-progress-value]:transition-none"
              />
              <p className="text-sm tabular-nums text-muted-foreground" aria-hidden="true">
                {t("cv.uploading", { name: state.name, percent })}
              </p>
            </div>
          )}
          <p className="sr-only" aria-live="polite">
            {state.status === "uploading"
              ? t("cv.uploading", { name: state.name, percent: spokenPercent })
              : state.status === "done"
                ? t("cv.uploaded", { name: state.name })
                : ""}
          </p>
          {state.status === "done" && (
            <>
              <p className="text-sm text-success-strong">{t("cv.uploaded", { name: state.name })}</p>
              <input type="hidden" name="cvPath" value={state.path} />
              <input type="hidden" name="cvFilename" value={state.name.slice(0, 200)} />
            </>
          )}
        </>
      )}
      <FieldError id={ids.errorId}>{shownError}</FieldError>
    </div>
  );
}
