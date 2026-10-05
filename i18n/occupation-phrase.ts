/**
 * Beroepsnaam voor midden in een zin (spec 03 §6.17): kleine beginletter en in
 * het Engels met het lidwoord erbij ("an excavator operator", "a mover"). De
 * Engelse messages schrijven het lidwoord daarom niet zelf uit; geef een
 * beroepsnaam altijd via deze functie door.
 */
export function occupationPhrase(name: string, locale: string): string {
  if (!name) return name;
  const lower = name.charAt(0).toLocaleLowerCase(locale) + name.slice(1);
  if (locale !== "en") return lower;
  return `${/^[aeiou]/i.test(lower) ? "an" : "a"} ${lower}`;
}
