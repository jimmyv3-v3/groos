import { createElement } from "react";
import { render, toPlainText } from "@react-email/components";
import { EMAIL_TEMPLATES } from "@/emails";
import { PREVIEW_VARIANTS, previewProps, type PreviewVariant } from "@/emails/previews";
import type { EmailLocale } from "@/emails/types";
import { EMAIL_TEMPLATE_NAMES, type EmailTemplateName } from "@/lib/email/types";

/**
 * Voorbeeldroute voor de mailtemplates (spec 11 §4.12), alleen in next dev.
 * Leest de database niet en verstuurt niets.
 */
export const dynamic = "force-dynamic";

const PLAIN_TEXT_OPTIONS = {
  selectors: ["h1", "h2", "h3"].map((selector) => ({ selector, options: { uppercase: false } })),
};

function notFound() {
  return new Response(null, { status: 404 });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
}

function indexPage(): string {
  const rows = EMAIL_TEMPLATE_NAMES.map((name) => {
    const links = EMAIL_TEMPLATES[name].locales
      .map((locale) => {
        const base = `?template=${name}&locale=${locale}`;
        const variants = PREVIEW_VARIANTS.filter((v) => v !== "default")
          .map((v) => `<a href="${base}&variant=${v}">${v}</a>`)
          .join(" ");
        return `<li>${locale}: <a href="${base}">HTML</a> · <a href="${base}&format=text">tekst</a> · varianten: ${variants}</li>`;
      })
      .join("");
    return `<h2>${escapeHtml(name)}</h2><ul>${links}</ul>`;
  }).join("");
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>E-mailvoorbeelden</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:32px auto;padding:0 16px;line-height:1.5}h2{font-size:18px;margin:24px 0 4px}</style>
</head><body><h1>E-mailvoorbeelden</h1><p>Alle templates met voorbeelddata. Interne meldingen bestaan alleen in het Nederlands.</p>${rows}</body></html>`;
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") return notFound();

  const url = new URL(request.url);
  const template = url.searchParams.get("template");
  if (!template) {
    return new Response(indexPage(), { headers: { "content-type": "text/html; charset=utf-8" } });
  }

  if (!(EMAIL_TEMPLATE_NAMES as readonly string[]).includes(template)) return notFound();
  const entry = EMAIL_TEMPLATES[template as EmailTemplateName];
  const locale = (url.searchParams.get("locale") ?? "nl") as EmailLocale;
  if (!entry.locales.includes(locale)) return notFound();
  const variantParam = url.searchParams.get("variant") ?? "default";
  if (!(PREVIEW_VARIANTS as readonly string[]).includes(variantParam)) return notFound();

  const props = previewProps(template as EmailTemplateName, locale, variantParam as PreviewVariant, url.origin);
  const html = await render(createElement(entry.Component, props));
  if (url.searchParams.get("format") === "text") {
    const text = `Onderwerp: ${entry.subject(props)}\n\n${toPlainText(html, PLAIN_TEXT_OPTIONS)}`;
    return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
