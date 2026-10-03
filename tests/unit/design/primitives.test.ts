import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckboxField } from "@/components/ui/checkbox";
import { CtaButton, ctaButtonVariants } from "@/components/ui/cta-button";
import { FieldLegend } from "@/components/ui/field";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";

// Primitives van spec 02 §4.7: de API's uit de kruiscontroles.

// next-intl-navigatie heeft de Next-runtime nodig; hier volstaat een gewone link.
vi.mock("@/i18n/navigation", async () => {
  const { createElement } = await import("react");
  return { Link: (props: Record<string, unknown>) => createElement("a", props) };
});
const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

describe("cn (AC-02-08)", () => {
  it("houdt eigen tekstgroottes naast een tekstkleur", () => {
    expect(cn("text-h2", "text-foreground")).toBe("text-h2 text-foreground");
    expect(cn("text-sm", "text-h3")).toBe("text-h3");
  });
});

describe("ctaButtonVariants", () => {
  it("laat de className van de aanroeper winnen", () => {
    const classes = ctaButtonVariants({ variant: "primary", size: "default", className: "px-2.5" }).split(" ");
    expect(classes).toContain("px-2.5");
    expect(classes).not.toContain("px-5");
  });

  it("geeft de linkvariant geen knophoogte, wel 44 px doelgrootte", () => {
    const classes = ctaButtonVariants({ variant: "link" }).split(" ");
    expect(classes).toContain("h-auto");
    expect(classes).toContain("min-h-11");
    expect(classes).not.toContain("h-12");
    expect(classes).not.toContain("px-5");
  });
});

describe("CtaButton", () => {
  it("toont bij pending een verborgen spinner en een statustekst", () => {
    const out = html(h(CtaButton, { pending: true, pendingLabel: "Bezig met laden", children: "Versturen" }));
    expect(out).toContain('data-slot="cta-button"');
    expect(out).toContain('aria-busy="true"');
    expect(out).toMatch(/<button[^>]* disabled=""/);
    const svg = out.match(/<svg[^>]*>/)?.[0] ?? "";
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).toContain("motion-safe:animate-spin");
    expect(out).toContain('<span role="status" class="sr-only">Bezig met laden</span>');
  });

  it("zet bij external target, rel en de tekst voor een nieuw venster", () => {
    const out = html(
      h(CtaButton, {
        href: "https://wa.me/31612345678",
        external: true,
        newTabLabel: "(opent in een nieuw venster)",
        children: "WhatsApp",
      }),
    );
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('<span class="sr-only"> (opent in een nieuw venster)</span>');
  });

  it("zet op een uitgeschakelde link aria-disabled en tabindex -1", () => {
    const out = html(h(CtaButton, { href: "tel:+31612345678", disabled: true, children: "Bel ons" }));
    expect(out).toContain('aria-disabled="true"');
    expect(out).toContain('tabindex="-1"');
  });
});

describe("Badge", () => {
  it("heeft altijd een stip vóór de tekst", () => {
    const out = html(h(Badge, { tone: "success", children: "Geplaatst" }));
    expect(out).toMatch(/<span data-slot="badge-dot"[^>]*aria-hidden="true"[^>]*><\/span>Geplaatst/);
    expect(out).toContain("bg-success-tint");
  });

  it("toont met een icoon het icoon in plaats van de stip", () => {
    const out = html(h(Badge, { tone: "brand", icon: Briefcase, children: "Fulltime" }));
    expect(out).not.toContain("badge-dot");
    expect(out).toContain("lucide-briefcase");
  });
});

describe("FieldLegend", () => {
  it("ziet er standaard uit als een label", () => {
    const out = html(h(FieldLegend, { children: "Mag je in Nederland werken?" }));
    expect(out).toContain('data-variant="label"');
    expect(out).toContain("text-sm font-medium text-foreground");
    expect(out).not.toContain("text-h3");
  });

  it("is als groepstitel een h3-maat", () => {
    const out = html(h(FieldLegend, { variant: "group", children: "Jouw gegevens" }));
    expect(out).toContain("font-display text-h3 font-semibold");
  });
});

describe("RadioGroup en RadioCard", () => {
  it("rendert de legend als FieldLegend in labelmaat", () => {
    const out = html(h(RadioGroup, { legend: "Mag je in Nederland werken?", children: null }));
    expect(out).toMatch(/<fieldset[^>]*><legend data-slot="field-legend" data-variant="label"/);
  });

  it("geeft aria-invalid en aria-describedby door aan het rondje", () => {
    const out = html(
      h(RadioCard, { id: "r-ja", name: "werk", value: "ja", label: "Ja", invalid: true, describedBy: "werk-fout" }),
    );
    expect(out).toMatch(/<input[^>]*type="radio"[^>]*aria-invalid="true"[^>]*aria-describedby="werk-fout"/);
  });
});

describe("CheckboxField", () => {
  it("kan uitgeschakeld worden", () => {
    const out = html(h(CheckboxField, { id: "c", name: "akkoord", label: "Akkoord", disabled: true }));
    expect(out).toMatch(/<input[^>]*type="checkbox"[^>]*disabled=""/);
  });
});

describe("Alert", () => {
  it("rendert de titel standaard als alinea", () => {
    const out = html(h(Alert, { tone: "info", title: "Let op", children: "Tekst" }));
    expect(out).toMatch(/<p[^>]*class="[^"]*font-semibold[^"]*">Let op<\/p>/);
  });

  it("rendert met titleAs en titleId een kop met id", () => {
    const out = html(
      h(Alert, { tone: "warning", title: "Deze vacature is gesloten", titleAs: "h2", titleId: "kop", children: "Tekst" }),
    );
    expect(out).toMatch(/<h2 id="kop"[^>]*>Deze vacature is gesloten<\/h2>/);
    expect(out).not.toMatch(/<p[^>]*><h2/);
  });
});
