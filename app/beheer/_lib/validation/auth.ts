import { z } from "zod";
import { S } from "../../_strings";

/** Schema's voor inloggen, code en wachtwoord (spec 08 §5.5). */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email(S.validation.email)),
  password: z.string().min(1, S.validation.required),
  volgende: z.string().optional(),
});

export const otpSchema = z.object({
  code: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{6}$/, S.validation.otp)),
});

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email(S.validation.email)),
});

export const passwordSchema = z
  .object({
    password: z.string().min(12, S.auth.errors.passwordTooShort).max(72),
    passwordConfirm: z.string(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: S.auth.errors.passwordsDiffer,
  });
