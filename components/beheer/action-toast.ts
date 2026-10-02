"use client";

import { useToast } from "@/components/ui/toast";
import type { ActionResult } from "@/app/beheer/_lib/result";

/** Toont het resultaat van een beheeractie als toast; geeft het resultaat door. */
export function useActionToast() {
  const toast = useToast();
  return function show<T>(result: ActionResult<T> | undefined | null): ActionResult<T> | undefined | null {
    if (!result) return result;
    if (result.ok) {
      if (result.toast) toast.add({ title: result.toast, type: "success" });
    } else {
      toast.add({ title: result.message, type: "error" });
    }
    return result;
  };
}
