import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import {
  ArrowRight,
  Briefcase,
  Droplets,
  Forklift,
  HardHat,
  MessageCircle,
  Phone,
  SprayCan,
  Truck,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LogoMark } from "@/components/brand/logo-mark";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxField } from "@/components/ui/checkbox";
import { ColumnLines } from "@/components/ui/column-lines";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Chip } from "@/components/ui/chip";
import { CtaButton } from "@/components/ui/cta-button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { IconTile } from "@/components/ui/icon-tile";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationStatus,
} from "@/components/ui/pagination";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ctaButtonVariants } from "@/components/ui/cta-button";

/**
 * Stijlgids (spec 02 §4.14): alleen in ontwikkeling, 404 in productie, nooit
 * indexeerbaar en niet in sitemap of llms.txt. Tekst staat bewust hier en niet
 * in messages.
 */
export const metadata: Metadata = {
  title: "Stijlgids",
  robots: { index: false, follow: false },
};

const COLORS = [
  ["background", "bg-background"],
  ["foreground", "bg-foreground"],
  ["muted-foreground", "bg-muted-foreground"],
  ["brand", "bg-brand"],
  ["brand-strong", "bg-brand-strong"],
  ["brand-subtle", "bg-brand-subtle"],
  ["brand-tint", "bg-brand-tint"],
  ["ice", "bg-ice"],
  ["border", "bg-border"],
  ["border-strong", "bg-border-strong"],
  ["input", "bg-input"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["destructive", "bg-destructive"],
  ["info", "bg-info"],
  ["neutral-tint", "bg-neutral-tint"],
] as const;

const SCALE = [
  ["text-hero", "Werk dat gewoon goed gaat"],
  ["text-h1", "Personeel voor schoonmaak en logistiek"],
  ["text-h2", "Zo werken wij samen"],
  ["text-h3", "Glazenwasser in de regio"],
  ["text-lead", "Wij zoeken mensen die van aanpakken houden en zorgen dat het werk op tijd klaar is."],
  ["text-base", "Lopende tekst staat op 17 px in Onest, met ruime regelafstand, zodat hij op een telefoon in de zon goed leesbaar blijft."],
  ["text-sm", "Labels, navigatie en meta"],
  ["text-xs", "Badges en de juridische regel"],
] as const;

const PROFESSIONS = [
  { icon: Droplets, title: "Glazenwasser" },
  { icon: SprayCan, title: "Schoonmaker" },
  { icon: Forklift, title: "Logistiek medewerker" },
  { icon: Truck, title: "Verhuizer" },
  { icon: HardHat, title: "Hulpkracht bouw en sloop" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section-tight border-t border-border">
      <h2>{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function Stijlgids({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { locale: raw } = await params;
  setRequestLocale(resolveLocale(raw));

  return (
    <main className="container pb-24">
      <header className="section-tight">
        <Logo />
        <h1 className="mt-10">Stijlgids van Groos</h1>
        <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">
          Alle tokens, lettergroottes en bouwstenen op één pagina. Deze pagina bestaat alleen in ontwikkeling.
        </p>
      </header>

      <Block title="Kleuren">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {COLORS.map(([name, cls]) => (
            <li key={name} className="grid gap-2">
              <span className={`h-16 rounded-lg border border-border ${cls}`} />
              <span className="text-xs text-muted-foreground">{name}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Typografie">
        <div className="grid gap-6">
          {SCALE.map(([cls, sample]) => (
            <div key={cls} className="grid gap-1 md:grid-cols-[8rem_1fr] md:items-baseline">
              <code className="text-xs text-muted-foreground">{cls}</code>
              <p className={`${cls} ${cls.startsWith("text-h") || cls === "text-hero" ? "font-display font-semibold" : ""}`}>
                {sample}
              </p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Knoppen">
        <div className="flex flex-wrap items-center gap-3">
          <CtaButton href="#knoppen">Personeel aanvragen</CtaButton>
          <CtaButton variant="secondary" href="tel:+31612345678">
            <Phone className="text-brand" aria-hidden />
            Bel ons
          </CtaButton>
          <CtaButton variant="tint">
            <MessageCircle aria-hidden />
            WhatsApp
          </CtaButton>
          <CtaButton variant="ghost">Annuleren</CtaButton>
          <CtaButton variant="destructive">Verwijderen</CtaButton>
          <CtaButton variant="link">Bekijk alle vacatures</CtaButton>
          <CtaButton pending pendingLabel="Bezig met laden">
            Versturen
          </CtaButton>
          <CtaButton disabled>Niet beschikbaar</CtaButton>
          <CtaButton variant="secondary" href="https://wa.me/31612345678" external newTabLabel="(opent in een nieuw venster)">
            <MessageCircle className="text-brand" aria-hidden />
            WhatsApp
          </CtaButton>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CtaButton size="sm">Klein</CtaButton>
          <CtaButton>Standaard</CtaButton>
          <CtaButton size="lg">Groot</CtaButton>
          <CtaButton size="icon" variant="ghost" ariaLabel="Bellen">
            <Phone aria-hidden />
          </CtaButton>
        </div>
      </Block>

      <Block title="Zo ziet een formulier van Groos eruit">
        <p className="max-w-[60ch] text-muted-foreground">
          Elk veld heeft een label en een duidelijke foutmelding. Je kunt het formulier ook zonder JavaScript gebruiken.
        </p>
        <form method="get" className="mt-8 max-w-xl">
          <FieldGroup>
            <FieldSet>
              <FieldLegend variant="group">Jouw gegevens</FieldLegend>
              <Field>
                <FieldLabel htmlFor="sg-naam">Naam</FieldLabel>
                <Input id="sg-naam" name="naam" autoComplete="name" />
              </Field>
              <Field invalid>
                <FieldLabel htmlFor="sg-tel">Telefoonnummer</FieldLabel>
                <Input id="sg-tel" name="telefoon" type="tel" aria-invalid aria-describedby="sg-tel-fout" />
                <FieldError id="sg-tel-fout">Vul je telefoonnummer in, dan kunnen wij je bellen.</FieldError>
              </Field>
            </FieldSet>
            <Field>
              <FieldLabel htmlFor="sg-beroep">Beroep</FieldLabel>
              <NativeSelect id="sg-beroep" name="beroep" defaultValue="">
                <NativeSelectOption value="" disabled>
                  Kies een beroep
                </NativeSelectOption>
                {PROFESSIONS.map((p) => (
                  <NativeSelectOption key={p.title} value={p.title}>
                    {p.title}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="sg-bericht">Bericht (niet verplicht)</FieldLabel>
              <Textarea id="sg-bericht" name="bericht" aria-describedby="sg-bericht-hulp" />
              <FieldDescription id="sg-bericht-hulp">Vertel kort wat je zoekt.</FieldDescription>
            </Field>
            <RadioGroup legend="Mag je in Nederland werken?" orientation="horizontal">
              <RadioCard id="sg-ja" name="werkvergunning" value="ja" label="Ja" defaultChecked />
              <RadioCard id="sg-nee" name="werkvergunning" value="nee" label="Nee" />
            </RadioGroup>
            <Field>
              <FieldLabel htmlFor="sg-cv">Cv (niet verplicht)</FieldLabel>
              <FileInput
                id="sg-cv"
                name="cv"
                accept=".pdf,.doc,.docx"
                labels={{
                  choose: "Kies bestand",
                  change: "Ander bestand kiezen",
                  remove: "Verwijder",
                  hint: "Een pdf of Word-bestand van hoogstens 10 MB.",
                }}
              />
            </Field>
            <CheckboxField
              id="sg-akkoord"
              name="akkoord"
              value="ja"
              label="Ik ga akkoord met het privacybeleid"
              description="Wij gebruiken je gegevens alleen om contact met je op te nemen."
            />
            <CtaButton type="submit" size="lg">
              Versturen
            </CtaButton>
          </FieldGroup>
        </form>
        <div className="mt-8 grid max-w-xl gap-3">
          <Alert tone="success" role="status">
            Gelukt, wij hebben je gegevens ontvangen. Ons team belt je om kennis te maken.
          </Alert>
          <section aria-labelledby="sg-melding-kop">
            <Alert tone="warning" title="Deze vacature is gesloten" titleAs="h2" titleId="sg-melding-kop">
              Bekijk de andere vacatures of schrijf je in, dan bellen wij je bij nieuw werk.
            </Alert>
          </section>
          <Alert tone="info">Deze vacaturetekst is alleen in het Nederlands beschikbaar.</Alert>
          <Alert tone="warning">Deze vacature is gesloten.</Alert>
          <Alert tone="danger" role="alert">
            Er ging iets mis bij het versturen. Probeer het opnieuw of bel ons.
          </Alert>
          <Alert>Een neutrale melding.</Alert>
        </div>
      </Block>

      <Block title="Badges en chips">
        <div className="flex flex-wrap gap-2">
          <Badge tone="neutral">Concept</Badge>
          <Badge tone="brand">Nieuw</Badge>
          <Badge tone="info">In behandeling</Badge>
          <Badge tone="success">Geplaatst</Badge>
          <Badge tone="warning">Gesloten</Badge>
          <Badge tone="danger">Afgewezen</Badge>
          <Badge tone="brand" size="md" icon={Briefcase}>
            Fulltime
          </Badge>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip href="/stijlgids" selected count={12}>
            Schoonmaker
          </Chip>
          <Chip href="/stijlgids" count={4}>
            Verhuizer
          </Chip>
          <Chip removeLabel="Verwijder filter Glazenwasser">Glazenwasser</Chip>
        </div>
      </Block>

      <Block title="Kaarten en icoontegels">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {PROFESSIONS.slice(0, 3).map((p, i) => (
            <Card key={p.title} variant={i === 0 ? "interactive" : i === 1 ? "muted" : "tint"}>
              <IconTile icon={p.icon} size={i === 0 ? "lg" : "md"} tone={i === 2 ? "brand" : "tint"} />
              <CardHeader>
                <CardTitle>
                  {i === 0 ? (
                    <a href="#kaarten" className="after:absolute after:inset-0">
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </CardTitle>
                <CardDescription>Vast werk in de regio, met een vaste contactpersoon.</CardDescription>
              </CardHeader>
              <CardFooter className="text-sm font-medium text-brand">
                Meer over dit beroep
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </CardFooter>
            </Card>
          ))}
        </div>
      </Block>

      <Block title="Uitklaplijst">
        <Accordion className="max-w-3xl">
          <AccordionItem name="sg-faq" title="Hoe snel kan ik beginnen?" defaultOpen>
            Vaak al binnen een week. Wij bellen je na je aanmelding om de mogelijkheden door te nemen.
          </AccordionItem>
          <AccordionItem name="sg-faq" title="Heb ik een diploma nodig?">
            Voor de meeste functies niet. Wij leren je het werk op de werkplek.
          </AccordionItem>
        </Accordion>
      </Block>

      <Block title="Navigatie">
        <Breadcrumb label="Kruimelpad">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/stijlgids">Vacatures</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Schoonmaker in Rotterdam</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination label="Paginering" className="mt-8 justify-start">
          <PaginationContent>
            <PaginationPrevious href="/stijlgids?pagina=1" label="Vorige" />
            <PaginationStatus>Pagina 2 van 5</PaginationStatus>
            <PaginationItem>
              <PaginationLink href="/stijlgids?pagina=1">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/stijlgids?pagina=2" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/stijlgids?pagina=3">3</PaginationLink>
            </PaginationItem>
            <PaginationEllipsis label="Meer pagina's" />
            <PaginationNext href="/stijlgids?pagina=3" label="Volgende" />
          </PaginationContent>
        </Pagination>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Tabs defaultValue="werkzoekenden">
            <TabsList>
              <TabsTrigger value="werkzoekenden">Werkzoekenden</TabsTrigger>
              <TabsTrigger value="werkgevers">Werkgevers</TabsTrigger>
            </TabsList>
            <TabsContent value="werkzoekenden">Inhoud voor werkzoekenden.</TabsContent>
            <TabsContent value="werkgevers">Inhoud voor werkgevers.</TabsContent>
          </Tabs>
          <Tabs defaultValue="open">
            <TabsList variant="segmented">
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="gesloten">Gesloten</TabsTrigger>
            </TabsList>
            <TabsContent value="open">Openstaande vacatures.</TabsContent>
            <TabsContent value="gesloten">Gesloten vacatures.</TabsContent>
          </Tabs>
        </div>
        <div className="mt-8">
          <Sheet>
            <SheetTrigger className={ctaButtonVariants({ variant: "secondary" })} data-slot="cta-button">
              Filters
            </SheetTrigger>
            <SheetContent side="bottom" closeLabel="Sluiten">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Kies een beroep en een regio.</SheetDescription>
              </SheetHeader>
              <div className="grid p-5">
                <CheckboxField id="sg-f-schoonmaker" name="f-beroep" value="schoonmaker" label="Schoonmaker" />
                <CheckboxField id="sg-f-verhuizer" name="f-beroep" value="verhuizer" label="Verhuizer" />
              </div>
              <SheetFooter>
                <CtaButton className="w-full">Toon 12 vacatures</CtaButton>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </Block>

      <Block title="Tabel en laden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naam</TableHead>
              <TableHead>Beroep</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Uren</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Sanne de Vries</TableCell>
              <TableCell>Schoonmaker</TableCell>
              <TableCell>
                <Badge tone="brand">Nieuw</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">32</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mehmet Yilmaz</TableCell>
              <TableCell>Verhuizer</TableCell>
              <TableCell>
                <Badge tone="success">Geplaatst</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">40</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-6 grid max-w-md gap-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-24" />
        </div>
      </Block>

      <Block title="Fotoplekken">
        <div className="grid gap-4 sm:grid-cols-3">
          <PhotoSlot
            alt=""
            ratio="4/5"
            sizes="(min-width: 640px) 33vw, 100vw"
            fallback={
              <span className="grid size-14 place-items-center rounded-full bg-background font-display text-h3 font-semibold text-brand-strong">
                J
              </span>
            }
          />
          <PhotoSlot alt="" ratio="3/2" sizes="(min-width: 640px) 33vw, 100vw" />
          <PhotoSlot src="/brand/logo.png" alt="Logo van Groos" ratio="1/1" sizes="(min-width: 640px) 33vw, 100vw" />
        </div>
      </Block>

      <Block title="Logo">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid place-items-center gap-6 rounded-2xl border border-border p-6 sm:p-10">
            <Logo />
            <Logo variant="lockup" />
          </div>
          <div className="surface-brand grid place-items-center gap-6 rounded-2xl p-6 sm:p-10" data-testid="logo-on-brand">
            <Logo />
            <Logo variant="lockup" />
          </div>
          <div className="grid place-items-center gap-6 rounded-2xl border border-border p-6 sm:p-10">
            <Logo tone="mono" className="text-ink" />
            <Logo tone="mono" variant="lockup" className="text-ink" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border p-6 sm:p-10">
            <LogoMark variant="tile" />
            <LogoMark variant="tile" className="size-8" />
            <LogoMark variant="tile" className="size-4" />
            <LogoMark optical={false} className="h-20 w-auto" />
            <LogoMark tone="mono" optical={false} className="h-20 w-auto" />
          </div>
          <div className="grid place-items-center rounded-2xl border border-border p-6 sm:p-10">
            <Logo layout="stacked" variant="lockup" optical={false} className="h-24 w-auto sm:h-36" />
          </div>
          <div className="surface-brand grid place-items-center rounded-2xl p-6 sm:p-10">
            <Logo layout="stacked" variant="lockup" optical={false} className="h-24 w-auto sm:h-36" />
          </div>
        </div>
      </Block>

      <Block title="Decoratie">
        <div className="grid gap-4 md:grid-cols-3">
          <ColumnLines className="grid h-56 place-items-center rounded-2xl border border-border">
            <p className="text-sm text-muted-foreground">ColumnLines</p>
          </ColumnLines>
          <div className="relative isolate grid h-56 place-items-center rounded-2xl border border-border">
            <GridPattern variant="grid" fade="top-right" />
            <p className="text-sm text-muted-foreground">GridPattern grid</p>
          </div>
          <div className="relative isolate grid h-56 place-items-center rounded-2xl border border-border">
            <GridPattern variant="dots" fade="top-right" />
            <p className="text-sm text-muted-foreground">GridPattern dots</p>
          </div>
        </div>
      </Block>

      <Block title="Blauwe afsluiter">
        <ColumnLines
          columnWidth={56}
          columnCount={40}
          radialFadeStart={0}
          radialFadeEnd={62}
          className="surface-brand rounded-2xl p-8 [--cl-at:100%_0%] md:p-12"
        >
          <h2 className="max-w-[28ch]">Personeel nodig dat morgen kan beginnen?</h2>
          <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">
            Bel of app ons. Wij denken mee en sturen mensen die het werk kennen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton href="#afsluiter">Personeel aanvragen</CtaButton>
            <CtaButton variant="secondary" href="tel:+31612345678">
              <Phone aria-hidden />
              Bel ons
            </CtaButton>
          </div>
        </ColumnLines>
      </Block>
    </main>
  );
}
