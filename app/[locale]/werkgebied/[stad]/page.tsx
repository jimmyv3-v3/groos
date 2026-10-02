import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { cities, getCity } from "@/content/werkgebied";
import { CityPage } from "@/components/werkgebied/city-page";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ stad: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; stad: string }>;
}): Promise<Metadata> {
  const { locale, stad } = await params;
  const city = getCity(stad, locale);
  if (!city) return {};
  return pageMetadata({
    locale,
    path: `/werkgebied/${city.slug}`,
    title: city.metaTitle,
    description: city.metaDescription,
    keywords: city.keywords,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; stad: string }>;
}) {
  const { locale, stad } = await params;
  setRequestLocale(locale);
  const city = getCity(stad, locale);
  if (!city) notFound();
  return <CityPage city={city} locale={locale} />;
}
