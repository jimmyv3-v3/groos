import { z } from "zod";
import {
  APPLICATION_STATUSES,
  MESSAGE_STATUSES,
  STAFF_REQUEST_STATUSES,
} from "@/lib/data/options";
import { uuid } from "./common";

/** Schema's voor statussen en toewijzen (spec 08 §5.3 tabel 3). */
export const applicationStatusSchema = z.object({ id: uuid, status: z.enum(APPLICATION_STATUSES) });
export const staffRequestStatusSchema = z.object({ id: uuid, status: z.enum(STAFF_REQUEST_STATUSES) });
export const messageStatusSchema = z.object({ id: uuid, status: z.enum(MESSAGE_STATUSES) });
export const assignSchema = z.object({ id: uuid, adminId: uuid.nullable() });
export const openCvSchema = z.object({ applicationId: uuid, download: z.boolean() });

export const APPLICATION_REFERENCE = /^S-\d{4}-\d{4,}$/;
export const STAFF_REQUEST_REFERENCE = /^P-\d{4}-\d{4,}$/;
