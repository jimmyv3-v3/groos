/** Cache-tags voor de vacaturedata (spec 10 §4.4, B-35). */
export const VACANCIES_TAG = "vacatures";
export const vacancyTag = (number: number) => `vacature:${number}` as const;
