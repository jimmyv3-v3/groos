import { z } from "zod";
import { CV_MAX_BYTES } from "@/lib/data/options";

/** Verzoek om een signed upload URL voor een cv (spec 07 §5.4, §5.6). */
export const cvUploadRequestSchema = z.object({
  ext: z.enum(["pdf", "doc", "docx"], { error: "cvType" }),
  size: z
    .number({ error: "cvType" })
    .int({ error: "cvType" })
    .min(1, { error: "cvType" })
    .max(CV_MAX_BYTES, { error: "cvTooLarge" }),
});

export type CvUploadRequest = z.output<typeof cvUploadRequestSchema>;
