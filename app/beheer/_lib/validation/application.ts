import { z } from "zod";
import {
  APPLICATION_STATUSES,
  MESSAGE_STATUSES,
  STAFF_REQUEST_STATUSES,
} from "@/lib/data/options";
import { S } from "../../_strings";
import { amsterdamDateKey } from "../format";
import { uuid } from "./common";

/** Schema's voor statussen en toewijzen (spec 08 §5.3 tabel 3). */
export const applicationStatusSchema = z
  .object({
    id: uuid,
    status: z.enum(APPLICATION_STATUSES),
    /** true: stuur de kandidaat de e-mail die bij de status hoort. */
    notify: z.boolean().optional(),
    meetingDate: z.string().optional(),
    meetingTime: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    // Alleen de uitnodiging heeft een datum en tijd nodig.
    if (!value.notify || value.status !== "invited") return;
    const date = value.meetingDate ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
      ctx.addIssue({ code: "custom", path: ["meetingDate"], message: S.validation.meetingDate });
    } else if (date < amsterdamDateKey(new Date())) {
      ctx.addIssue({ code: "custom", path: ["meetingDate"], message: S.validation.meetingInPast });
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value.meetingTime ?? "")) {
      ctx.addIssue({ code: "custom", path: ["meetingTime"], message: S.validation.meetingTime });
    }
  });
export const staffRequestStatusSchema = z.object({ id: uuid, status: z.enum(STAFF_REQUEST_STATUSES) });
export const messageStatusSchema = z.object({ id: uuid, status: z.enum(MESSAGE_STATUSES) });
export const assignSchema = z.object({ id: uuid, adminId: uuid.nullable() });
export const openCvSchema = z.object({ applicationId: uuid, download: z.boolean() });

export const APPLICATION_REFERENCE = /^S-\d{4}-\d{4,}$/;
export const STAFF_REQUEST_REFERENCE = /^P-\d{4}-\d{4,}$/;
