"use client";

import { useTransition } from "react";
import { extendVacancy } from "@/app/beheer/_actions/vacancies";
import { S } from "@/app/beheer/_strings";
import { CtaButton } from "@/components/ui/cta-button";
import { useActionToast } from "./action-toast";

/** Snelknop "30 dagen verlengen" in Vandaag te doen. */
export function ExtendButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const show = useActionToast();
  return (
    <CtaButton
      size="sm"
      variant="secondary"
      pending={pending}
      pendingLabel={S.common.saving}
      onClick={() => startTransition(async () => void show(await extendVacancy({ id })))}
    >
      {S.vacancies.actions.extend}
    </CtaButton>
  );
}
