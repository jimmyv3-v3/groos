# Samenvatting context/11

## Feiten

Voorstel, niets gebouwd (oktober 2026). Aanbeveling: Supabase Pro in Frankfurt, eigen beheer onder `/beheer` in dezelfde Next.js-app, Resend (EU, ook SMTP voor Auth), BotID Basic, Vercel Cron; tweede keus Payload 3. Voorwaarden: Pro, EU-regio, eigen SMTP, geen Studio-toegang. Kosten 45 tot 65 dollar per maand.

Datamodel (concept; uuid, tijdstempels, enums, `retain_until` via trigger):

|Tabel|Velden|
|---|---|
|admin_profiles|naam, display_name, e-mail, telefoon, whatsapp, foto, role, is_active, meldingsvoorkeuren|
|settings (één rij)|bedrijfsgegevens, registratienummer, adres, contact, openingstijden, meldingsontvangers, bewaartermijnen 28/365, sluitdatum 60 dagen, minimumloon, e-mailteksten, feeds|
|occupations|slug, naam, meervoud en intro nl/en, standaardbeeld, volgorde, actief|
|locations|plaats, slug, provincie, actief|
|qualifications|kind, code, naam nl/en, volgorde, actief|
|vacancies|number vanaf 1001, status, beroep, locatie, plekken, contract_type, uren, shifts[], salaris (modus, min, max, eenheid, cao), opleiding, ervaring, start, publish_at, closes_at, published_at, close_reason, is_featured, is_urgent, contactpersoon, afbeelding, allow_whatsapp_apply|
|vacancy_translations|locale, title, slug, summary, intro, tasks[], requirements[], offer[], extra, seo-velden, is_complete|
|vacancy_qualifications|vacancy_id, qualification_id, is_required|
|vacancy_internal|opdrachtgever, notitie, staff_request_id|
|vacancy_templates|occupation_id, name, content|
|applications|reference, vacancy_id, status, source, naam, email, phone_e164, woonplaats, preferred_contact, rijbewijs B, available_from, message, cv-metadata, locale, assigned_to, retention_consent, completed_at, retain_until, submission_id|
|staff_requests|reference, status, bedrijf, kvk, contactpersoon, email, phone_e164, occupation_ids[], headcount, start, duration, uren, shifts[], werklocatie, description, is_urgent, assigned_to, retain_until|
|contact_messages|naam, email, telefoon, topic, message, status, handled_by, retain_until|
|activities|entity_type, entity_id, kind, body, payload, actor_id|
|email_log|template, to_hash, entity, provider_message_id, status, error|
|privacy_requests|type, requester_email_hash, received_at, due_at, status, handled_by, notes|
|audit_log (alleen invoegen)|occurred_at, actor_id, actor_type, action, entity, changes, ip_hash|

Verder `candidates` en `job_alerts` (fase 2), view `public_vacancies`, buckets `cvs` (privé, 10 MB) en `public-media`.

Statusflows. Vacature: draft, scheduled, published, closed, archived; gesloten blijft met noindex, archief geeft 404. Sollicitatie: new, in_progress, invited, placed, rejected, withdrawn. Aanvraag: new, in_progress, quote_sent, started, completed, cancelled. Bericht: new, answered, archived, spam.

Beheer: Nederlands, noindex, mobiel eerst met actiebalk Bellen, WhatsApp, E-mailen, Status; schermen voor inloggen met TOTP, dashboard, vacatures, sollicitaties, aanvragen, berichten, instellingen, gebruikers, privacy, logboek; sectie 5 is een tekstcatalogus in je-vorm.

E-mail: 19 templates, 15 in de MVP; subdomein met SPF, DKIM, DMARC; nooit cv of vrije tekst meesturen.

Beveiliging: drie clients (publishable, sessie, secret server-only); RLS per rol met MFA-eis; aanmelden uit, alleen uitnodigen; magic link afgewezen; logboek bij cv-weergave en export.

AVG: 4 weken na eindstatus, 1 jaar met toestemming; afsluiten na 12 weken; aanvragen 2 jaar, berichten 6 maanden, audit_log 2 jaar; vier cron-routes met `CRON_SECRET`.

Fasering: fundament 2 tot 3 dagen, MVP 12 tot 18, fase 2 8 tot 12 (Engels, jobalerts, talentpool, feeds).

## Besluiten en voorstellen (met wie moet bevestigen)

- Supabase met eigen beheer, wachtwoord plus authenticator-app, URL `/vacatures/{slug}-{nummer}`, alleen BotID Basic, `hiringOrganization` Groos: team.
- Accounts op naam van Groos met verwerkersovereenkomst: Jimmy, Lorenzo, team.
- Cv optioneel, e-mail verplicht, altijd salaris, je voor werkzoekenden en beheer, u voor werkgevers, Engels pas fase 2, archiveren na 90 dagen: Jimmy en Lorenzo.
- Bewaartermijnen: Jimmy, Lorenzo en jurist.

## Aannames in het document

Pro-abonnementen worden betaald. Grondslag voor solliciteren is het sollicitatieproces, niet toestemming. Openingstijden en 24/7 telefonie gelden als voorbeeld. Het kantooradres is bezoekbaar.

## Open vragen (sectie "Te verifiëren" en wat je zelf ziet)

Uit het document: DPA en regio bij Marketplace; EU-regio Resend gratis; Indeed-beleid Nederland; `revalidateTag` in Next.js 16; passkeys uit bèta; termijnen voor inschrijvingen; domein; registratienummer; minimumloon.

Eigen observaties: beheerteksten tegenover gespiegelde `messages/`; CSV-export staat in MVP-schermen en in de fase 2-tabel; welke Supabase-organisatie.

## Relevant voor specs (per modulenummer uit docs/HANDOVER.md §4)

- 01: `/beheer`, `/api`, `/feeds` buiten de proxy.
- 06: vacatureflow, view, gesloten en archief.
- 07: formuliervelden, signed upload, spamlagen.
- 08: schermen, acties, rollen, tekstcatalogus.
- 09: bewaartermijnen, toestemming, verzoekenregister.
- 10: enums, tabellen, RLS, buckets, cron.
- 11: templates, Resend, `email_log`.
- 12: JobPosting-mapping, sitemap.
- 13: Pro-abonnementen, fra1, mailsubdomein.
- 15: Engels, jobalerts, feeds, talentpool.

## Tegenstrijdigheden (met docs/HANDOVER.md, docs/HANDOVER-2.md, CLAUDE.md of andere contextbestanden die je kent)

- Routes: §1.8 `/personeel-aanvragen` en §2.6 `/vacatures/{beroep}` tegenover context/03 (leidend): `/werkgevers/personeel-aanvragen` en `/werken-als/[beroep]`.
- Talen: HANDOVER-2 noemt NL en EN bij lancering, later meer talen; §2.5 houdt vacatures Nederlands.
- Privacyvinkje: §6.1 geen vinkje; context/09 verplicht kennisnamevinkje.
- Kosten: §1.6 rekent met het Pro-team van het ontwikkelteam; CLAUDE.md legt Vercel bij Jimmy.
- Adres en openingstijden in voorbeelden botsen met context/09 (woning) en HANDOVER-2 (letterlijk Wilk).
- Domein: §6.5 open; HANDOVER-2 wijst op de variant met s.
