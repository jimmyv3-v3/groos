"use client";

import { useState, useTransition } from "react";
import { assignApplication } from "@/app/beheer/_actions/applications";
import { assignStaffRequest } from "@/app/beheer/_actions/staff-requests";
import { S } from "@/app/beheer/_strings";
import { CtaButton } from "@/components/ui/cta-button";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useActionToast } from "./action-toast";

/** Toewijzen aan een beheerder of niemand, met de snelknop Aan mij toewijzen (spec 08 §4.3). */
export function AssignForm({
  kind,
  id,
  current,
  admins,
  meId,
}: {
  kind: "application" | "staffRequest";
  id: string;
  current: string | null;
  admins: { id: string; displayName: string }[];
  meId: string;
}) {
  const [value, setValue] = useState(current ?? "");
  const [pending, startTransition] = useTransition();
  const show = useActionToast();
  const selectId = `toewijzen-${id}`;

  const assign = (adminId: string | null) =>
    startTransition(async () => {
      const result =
        kind === "application" ? await assignApplication({ id, adminId }) : await assignStaffRequest({ id, adminId });
      show(result);
      if (result.ok) setValue(adminId ?? "");
    });

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        assign(value || null);
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor={selectId}>{S.assign.label}</Label>
        <NativeSelect id={selectId} value={value} onChange={(e) => setValue(e.target.value)}>
          <NativeSelectOption value="">{S.common.nobody}</NativeSelectOption>
          {admins.map((a) => (
            <NativeSelectOption key={a.id} value={a.id}>
              {a.displayName}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex flex-wrap gap-2">
        <CtaButton type="submit" variant="secondary" size="sm" pending={pending} pendingLabel={S.common.saving} disabled={value === (current ?? "")}>
          {S.assign.submit}
        </CtaButton>
        {current !== meId && (
          <CtaButton variant="tint" size="sm" onClick={() => assign(meId)} disabled={pending}>
            {S.common.assignToMe}
          </CtaButton>
        )}
      </div>
    </form>
  );
}
