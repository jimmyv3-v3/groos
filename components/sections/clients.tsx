import { useTranslations } from "next-intl";
import { clients } from "@/lib/site";
import { Marquee } from "@/components/ui/marquee";

/**
 * Logoband met opdrachtgevers, direct onder de hero. Logo's krijgen één
 * uniforme tint via .logo-mono (app/globals.css), zodat merkkleuren het thema
 * niet breken. Zonder logo-bestand wordt de naam als tekst getoond.
 */
export function Clients() {
  const t = useTranslations("home");
  if (clients.length === 0) return null;

  return (
    <section
      aria-label={t("clientsAriaLabel")}
      className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-4"
    >
      <Marquee className="items-center" duration={36} pauseOnHover fadeAmount={10}>
        {clients.map((client) => (
          <div key={client.name} className="mx-10 flex items-center sm:mx-14">
            {client.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.src}
                alt={client.name}
                loading="lazy"
                className="logo-mono h-7 w-auto transition-opacity duration-500 hover:opacity-100 sm:h-8"
              />
            ) : (
              <span className="whitespace-nowrap font-display text-lg font-medium tracking-tight text-muted-foreground">
                {client.name}
              </span>
            )}
          </div>
        ))}
      </Marquee>
    </section>
  );
}
