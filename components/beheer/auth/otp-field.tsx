"use client";

import { useState } from "react";
import { BeheerField } from "@/components/beheer/beheer-field";
import { Input } from "@/components/ui/input";

/**
 * Eén invoerveld voor de code van zes cijfers (spec 08 §4.3, SA-08-5: eigen
 * primitive). Plakken mag; spaties en andere tekens gaan eruit. De vakjes
 * zijn alleen opmaak (letterafstand en monospace) op dat ene veld.
 */
export function OtpField({ name, label, hint, error }: { name: string; label: string; hint: string; error?: string[] }) {
  const [value, setValue] = useState("");
  return (
    <BeheerField id={`otp-${name}`} label={label} hint={hint} error={error} required="always">
      <Input
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        required
        className="h-14 max-w-56 text-center font-mono text-[1.5rem] tracking-[0.5em] tabular-nums"
      />
    </BeheerField>
  );
}
