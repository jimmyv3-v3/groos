type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/**
 * Rendert een blok structured data. `<` wordt ge-escaped zodat tekst uit de
 * content de script-tag nooit kan afbreken.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
