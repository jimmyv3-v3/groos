"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Archive,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  CircleCheck,
  CircleX,
  Copy,
  Eye,
  ExternalLink,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Send,
  Star,
  Trash2,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { duplicateVacancy, restoreVacancy, setVacancyFlag } from "@/app/beheer/_actions/vacancies";
import { beheerPaths, publicVacancyPath } from "@/app/beheer/_lib/paths";
import { VACANCY_ACTIONS } from "@/app/beheer/_lib/status";
import type { VacancyActionKey, VacancyActionTarget } from "@/app/beheer/_lib/types";
import { S, fill } from "@/app/beheer/_strings";
import { useActionToast } from "@/components/beheer/action-toast";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/beheer/ui/menu";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { useToast } from "@/components/ui/toast";
import { VacancyDialogs, type VacancyDialogKey } from "./vacancy-dialogs";

type Entry =
  | { kind: "link"; key: VacancyActionKey; label: string; icon: LucideIcon; href: string; external?: boolean }
  | { kind: "run"; key: VacancyActionKey; label: string; icon: LucideIcon; run: () => void; destructive?: boolean };

/** Acties per status uit VACANCY_ACTIONS (spec 08 §5.3 tabel 2): menu in de lijst, knoppen op de bewerkpagina. */
export function VacancyActions({
  vacancy,
  isOwner,
  variant,
}: {
  vacancy: VacancyActionTarget;
  isOwner: boolean;
  variant: "menu" | "buttons";
}) {
  const [dialog, setDialog] = useState<VacancyDialogKey | null>(null);
  const [, startTransition] = useTransition();
  const show = useActionToast();
  const toast = useToast();
  const A = S.vacancies.actions;
  const publicPath = publicVacancyPath(vacancy.slug);
  const shareText = () =>
    fill(A.shareWhatsappText, {
      titel: vacancy.title,
      plaats: vacancy.city ?? "",
      link: `${window.location.origin}${publicPath}`,
    });

  const entries: Entry[] = [];
  for (const key of VACANCY_ACTIONS[vacancy.status]) {
    switch (key) {
      case "edit":
        if (variant === "menu") entries.push({ kind: "link", key, label: A.edit, icon: Pencil, href: beheerPaths.vacancy(vacancy.number) });
        break;
      case "preview":
        entries.push({ kind: "link", key, label: A.preview, icon: Eye, href: beheerPaths.vacancyPreview(vacancy.number) });
        break;
      case "viewOnSite":
        if (vacancy.publicState)
          entries.push({ kind: "link", key, label: A.viewOnSite, icon: ExternalLink, href: publicPath, external: true });
        break;
      case "copyLink":
        entries.push({
          kind: "run",
          key,
          label: A.copyLink,
          icon: Link2,
          run: () =>
            void navigator.clipboard
              ?.writeText(`${window.location.origin}${publicPath}`)
              .then(() => toast.add({ title: S.toasts.linkCopied, type: "success" })),
        });
        break;
      case "shareWhatsapp":
        entries.push({
          kind: "run",
          key,
          label: A.shareWhatsapp,
          icon: MessageCircle,
          run: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText())}`, "_blank", "noopener,noreferrer"),
        });
        break;
      case "publish":
      case "publishNow":
        entries.push({ kind: "run", key, label: key === "publish" ? A.publish : A.publishNow, icon: Send, run: () => setDialog("publish") });
        break;
      case "schedule":
      case "reschedule":
        entries.push({ kind: "run", key, label: key === "schedule" ? A.schedule : A.reschedule, icon: CalendarClock, run: () => setDialog("schedule") });
        break;
      case "unschedule":
        entries.push({ kind: "run", key, label: A.unschedule, icon: CalendarX, run: () => setDialog("unschedule") });
        break;
      case "extend":
        entries.push({ kind: "run", key, label: A.extend, icon: CalendarPlus, run: () => setDialog("extend") });
        break;
      case "closeFilled":
        entries.push({ kind: "run", key, label: A.closeFilled, icon: CircleCheck, run: () => setDialog("closeFilled") });
        break;
      case "close":
        entries.push({ kind: "run", key, label: A.close, icon: CircleX, run: () => setDialog("close") });
        break;
      case "takeOffline":
        entries.push({ kind: "run", key, label: A.takeOffline, icon: CalendarX, run: () => setDialog("takeOffline") });
        break;
      case "feature":
        entries.push({
          kind: "run",
          key,
          label: vacancy.isFeatured ? A.unfeature : A.feature,
          icon: Star,
          run: () =>
            startTransition(async () => {
              show(await setVacancyFlag({ id: vacancy.id, flag: "is_featured", value: !vacancy.isFeatured }));
            }),
        });
        break;
      case "urgent":
        entries.push({
          kind: "run",
          key,
          label: vacancy.isUrgent ? A.urgentOff : A.urgentOn,
          icon: Zap,
          run: () =>
            startTransition(async () => {
              show(await setVacancyFlag({ id: vacancy.id, flag: "is_urgent", value: !vacancy.isUrgent }));
            }),
        });
        break;
      case "reopen":
        entries.push({ kind: "run", key, label: A.reopen, icon: RotateCcw, run: () => setDialog("reopen") });
        break;
      case "archive":
        entries.push({ kind: "run", key, label: A.archive, icon: Archive, run: () => setDialog("archive") });
        break;
      case "restore":
        entries.push({
          kind: "run",
          key,
          label: A.restore,
          icon: RotateCcw,
          run: () => startTransition(async () => void show(await restoreVacancy({ id: vacancy.id }))),
        });
        break;
      case "duplicate":
        entries.push({
          kind: "run",
          key,
          label: A.duplicate,
          icon: Copy,
          run: () => startTransition(async () => void show(await duplicateVacancy({ id: vacancy.id }))),
        });
        break;
      case "delete":
        if (isOwner && vacancy.applicationCount === 0)
          entries.push({ kind: "run", key, label: A.delete, icon: Trash2, run: () => setDialog("delete"), destructive: true });
        break;
      case "viewApplications":
        entries.push({
          kind: "link",
          key,
          label: A.viewApplications,
          icon: Users,
          href: `${beheerPaths.applications}?vacature=${vacancy.number}&tab=alle`,
        });
        break;
    }
  }

  const PRIMARY: VacancyActionKey[] = ["publish", "publishNow", "preview", "viewOnSite", "restore"];
  const buttons = variant === "buttons" ? entries.filter((e) => PRIMARY.includes(e.key)).slice(0, 3) : [];
  const menuEntries = entries.filter((e) => !buttons.includes(e));

  const renderMenu = (list: Entry[]) =>
    list.length > 0 && (
      <Menu>
        <MenuTrigger
          aria-label={fill(A.menu, { titel: vacancy.title })}
          className={ctaButtonVariants({ variant: variant === "menu" ? "ghost" : "secondary", size: variant === "menu" ? "icon" : "default" })}
        >
          <MoreHorizontal aria-hidden="true" />
          {variant === "buttons" && S.common.actions}
        </MenuTrigger>
        <MenuContent>
          {list.map((e, i) => {
            const separator = e.kind === "run" && e.destructive && i > 0 ? <MenuSeparator key={`sep-${e.key}`} /> : null;
            const content = (
              <>
                <e.icon aria-hidden="true" />
                {e.label}
              </>
            );
            if (e.kind === "link") {
              return (
                <MenuItem
                  key={e.key}
                  render={
                    e.external ? (
                      <a href={e.href} target="_blank" rel="noopener noreferrer" />
                    ) : (
                      <Link href={e.href} />
                    )
                  }
                >
                  {content}
                </MenuItem>
              );
            }
            return [
              separator,
              <MenuItem key={e.key} onClick={e.run} className={e.destructive ? "text-destructive [&_svg]:text-destructive" : undefined}>
                {content}
              </MenuItem>,
            ];
          })}
        </MenuContent>
      </Menu>
    );

  return (
    <>
      {variant === "buttons" ? (
        <div className="flex flex-wrap gap-2">
          {/* Op een telefoon staan alle acties in één menu, zodat het formulier direct onder de kop begint. */}
          <div className="sm:hidden">{renderMenu(entries)}</div>
          <div className="hidden sm:contents">
            {buttons.map((e) =>
              e.kind === "link" ? (
                e.external ? (
                  <a key={e.key} href={e.href} target="_blank" rel="noopener noreferrer" className={ctaButtonVariants({ variant: "secondary" })}>
                    <e.icon aria-hidden="true" />
                    {e.label}
                  </a>
                ) : (
                  <Link key={e.key} href={e.href} className={ctaButtonVariants({ variant: "secondary" })}>
                    <e.icon aria-hidden="true" />
                    {e.label}
                  </Link>
                )
              ) : (
                <button
                  key={e.key}
                  type="button"
                  onClick={e.run}
                  className={ctaButtonVariants({ variant: e.key === "publish" || e.key === "publishNow" ? "primary" : "secondary" })}
                >
                  <e.icon aria-hidden="true" />
                  {e.label}
                </button>
              ),
            )}
            {renderMenu(menuEntries)}
          </div>
        </div>
      ) : (
        renderMenu(menuEntries)
      )}
      <VacancyDialogs vacancy={vacancy} open={dialog} onOpenChange={setDialog} />
    </>
  );
}
