import { getTranslations } from "next-intl/server";
import { getNavModel } from "@/lib/navigation";
import { ActionBar } from "@/components/sections/header/action-bar";

/** Vaste actiebalk onder lg (spec 01 §4.6). Lost de acties op de server op. */
export async function SiteActionBar() {
  const [model, t] = await Promise.all([getNavModel(), getTranslations("header")]);
  return <ActionBar ariaLabel={t("actionBar")} actions={model.actions} />;
}
