/**
 * Nep-Supabase-client voor de eenheidstests van lib/data (spec 10, spec 14 §4.4).
 * Elke querybouwer geeft zichzelf terug en wordt bij `await` het antwoord dat de
 * test per tabel of view opgeeft.
 */
export type MockAnswer = { data: unknown; error: { message: string; code?: string } | null };

export function mockSupabaseClient(answer: (table: string) => MockAnswer) {
  const calls: string[] = [];
  const client = {
    from(table: string) {
      calls.push(table);
      const result = answer(table);
      const builder: Record<string, unknown> = {};
      for (const method of ["select", "eq", "order", "overrideTypes", "limit", "in", "is", "lte"]) {
        builder[method] = () => builder;
      }
      builder.maybeSingle = () => Promise.resolve(result);
      builder.then = (resolve: (value: MockAnswer) => unknown, reject: (reason: unknown) => unknown) =>
        Promise.resolve(result).then(resolve, reject);
      return builder;
    },
  };
  return { client, calls };
}
