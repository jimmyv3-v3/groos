"use client";

import type { ReactNode } from "react";
import { Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { logContactAttempt } from "@/app/beheer/_actions/activities";
import { formatPhoneNl, mailtoHref, telHref, whatsappHref } from "@/app/beheer/_lib/format";
import type { EntityType } from "@/app/beheer/_lib/types";
import { S, fill } from "@/app/beheer/_strings";
import { ctaButtonVariants } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";

type Channel = "call" | "whatsapp" | "email";

/**
 * Telefoonnummer of e-mailadres als tel:- of mailto:-link in een gegevenslijst,
 * zodat je op een telefoon met één tik belt of mailt. Legt de contactpoging
 * vast, net als de knoppen van ContactActions.
 */
export function ContactLink({
  entityType,
  entityId,
  channel,
  href,
  children,
}: {
  entityType: Exclude<EntityType, "vacancy">;
  entityId: string;
  channel: "call" | "email";
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={() => void logContactAttempt({ entityType, entityId, channel }).catch(() => undefined)}
      className="link -my-2 inline-flex min-h-11 max-w-full items-center wrap-anywhere"
    >
      {children}
    </a>
  );
}

/**
 * Bellen, WhatsApp en e-mailen als gewone links (spec 08 §4.3). onClick legt
 * de contactpoging vast zonder de navigatie te blokkeren.
 */
export function ContactActions({
  entityType,
  entityId,
  phoneE164,
  email,
  whatsappText,
  mailSubject,
  layout,
  name = "",
}: {
  entityType: Exclude<EntityType, "vacancy">;
  entityId: string;
  phoneE164: string | null;
  email: string | null;
  whatsappText: string;
  mailSubject: string;
  layout: "inline" | "bar";
  name?: string;
}) {
  const log = (channel: Channel) => {
    void logContactAttempt({ entityType, entityId, channel }).catch(() => undefined);
  };

  const links: { channel: Channel; href: string; label: string; aria: string; icon: LucideIcon; external?: boolean }[] = [];
  if (phoneE164) {
    links.push({
      channel: "call",
      href: telHref(phoneE164),
      label: S.contact.call,
      aria: fill(S.contact.callAria, { naam: name, telefoon: formatPhoneNl(phoneE164) }),
      icon: Phone,
    });
    links.push({
      channel: "whatsapp",
      href: whatsappHref(phoneE164, whatsappText),
      label: S.contact.whatsapp,
      aria: fill(S.contact.whatsappAria, { naam: name }),
      icon: MessageCircle,
      external: true,
    });
  }
  if (email) {
    links.push({
      channel: "email",
      href: mailtoHref(email, mailSubject),
      label: S.contact.email,
      aria: fill(S.contact.emailAria, { naam: name }),
      icon: Mail,
    });
  }

  if (layout === "bar") {
    return (
      <>
        {links.map((l) => (
          <a
            key={l.channel}
            href={l.href}
            aria-label={name ? l.aria : undefined}
            onClick={() => log(l.channel)}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex min-h-11 flex-col items-center justify-center gap-1 text-xs font-medium text-foreground hover:text-brand-strong"
          >
            <l.icon className="size-5 text-brand" aria-hidden="true" />
            {l.label}
          </a>
        ))}
      </>
    );
  }

  return (
    <div className="relative z-10 flex flex-wrap gap-2">
      {links.map((l, i) => (
        <a
          key={l.channel}
          href={l.href}
          aria-label={name ? l.aria : undefined}
          onClick={() => log(l.channel)}
          {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={cn(ctaButtonVariants({ variant: i === 0 ? "primary" : "secondary", size: "sm" }))}
        >
          <l.icon aria-hidden="true" />
          {l.label}
        </a>
      ))}
    </div>
  );
}
