"use client";

import Link from "next/link";
import { Building2, ChevronRight, ExternalLink, Inbox, LogOut, MonitorSmartphone } from "lucide-react";
import { signOut } from "@/app/beheer/_actions/auth";
import { beheerPaths } from "@/app/beheer/_lib/paths";
import { S, fill } from "@/app/beheer/_strings";
import { ConfirmDialog } from "./confirm-dialog";

const row =
  "flex min-h-14 w-full cursor-pointer items-center gap-3 px-4 text-left text-base text-foreground transition-colors hover:bg-muted [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:text-muted-foreground";

/** Grote knoppen voor de pagina Meer (spec 08 §4.4, SA-08-1: eigen primitives). */
export function MoreList({ messagesNew, requestsNew }: { messagesNew: number; requestsNew: number }) {
  const badge = (n: number) =>
    n > 0 && (
      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold tabular-nums text-primary-foreground">
        <span aria-hidden="true">{n}</span>
        <span className="sr-only">{fill(S.nav.newBadge, { aantal: n })}</span>
      </span>
    );

  const signOutGlobal = () => {
    const fd = new FormData();
    fd.set("scope", "global");
    return signOut(fd);
  };

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      <li>
        <Link href={beheerPaths.messages} className={row}>
          <Inbox aria-hidden="true" />
          <span className="flex-1">{S.nav.messages}</span>
          {badge(messagesNew)}
          <ChevronRight aria-hidden="true" />
        </Link>
      </li>
      <li>
        <Link href={beheerPaths.requests} className={row}>
          <Building2 aria-hidden="true" />
          <span className="flex-1">{S.nav.requestsLong}</span>
          {badge(requestsNew)}
          <ChevronRight aria-hidden="true" />
        </Link>
      </li>
      <li>
        <a href="/" target="_blank" rel="noopener noreferrer" className={row}>
          <ExternalLink aria-hidden="true" />
          <span className="flex-1">{S.app.viewSite}</span>
        </a>
      </li>
      <li>
        <form action={signOut}>
          <input type="hidden" name="scope" value="local" />
          <button type="submit" className={row}>
            <LogOut aria-hidden="true" />
            <span className="flex-1">{S.app.signOut}</span>
          </button>
        </form>
      </li>
      <li>
        <ConfirmDialog
          title={S.dialogs.signOutEverywhere.title}
          body={S.dialogs.signOutEverywhere.body}
          confirmLabel={S.dialogs.signOutEverywhere.confirm}
          tone="destructive"
          onConfirm={signOutGlobal}
          trigger={
            <button type="button" className={row}>
              <MonitorSmartphone aria-hidden="true" />
              <span className="flex-1">{S.app.signOutEverywhere}</span>
            </button>
          }
        />
      </li>
    </ul>
  );
}
