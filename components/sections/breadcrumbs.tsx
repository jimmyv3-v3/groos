import { Fragment } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { AppPath } from "@/lib/routes";
import { breadcrumbLd, localizedPath } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type Crumb = { label: string; href: AppPath };
export type BreadcrumbsProps = {
  /** Het spoor na Home; het laatste item is de huidige pagina. */
  items: Crumb[];
  className?: string;
  /** Standaard true: rendert ook BreadcrumbList via breadcrumbLd() uit lib/seo.ts. */
  jsonLd?: boolean;
};

/**
 * Kruimelpad (spec 01 §4.9) op de delen van components/ui/breadcrumb (spec 02).
 * Zet zelf Home vooraan; zichtbaar spoor en BreadcrumbList komen uit dezelfde gegevens.
 */
export async function Breadcrumbs({ items, className, jsonLd = true }: BreadcrumbsProps) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("common.breadcrumbs")]);
  const trail: Crumb[] = [{ label: t("home"), href: "/" }, ...items];

  return (
    <>
      <Breadcrumb label={t("label")} className={className}>
        <BreadcrumbList>
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <Fragment key={`${crumb.href}-${i}`}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem className={cn(last && "min-w-0")}>
                  {last ? (
                    <BreadcrumbPage title={crumb.label}>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {jsonLd && (
        <JsonLd data={breadcrumbLd(trail.map((c) => ({ name: c.label, path: localizedPath(locale, c.href) })))} />
      )}
    </>
  );
}
