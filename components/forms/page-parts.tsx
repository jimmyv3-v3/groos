import { ServiceSteps } from "@/components/service/service-steps";

/**
 * Kleine gedeelde stukken van de formulierpagina's. De stappen gaan naar
 * ServiceSteps van spec 05; de items dragen zowel `body` (StepItem van spec 05)
 * als `description` (huidige ServiceStep), zodat beide vormen werken.
 */
export function FormSteps({
  heading,
  accent,
  items,
}: {
  heading: string;
  accent: string;
  items: { title: string; body: string }[];
}) {
  const steps = items.map((item) => ({ title: item.title, body: item.body, description: item.body }));
  return <ServiceSteps id="zo-gaat-het" heading={heading} accent={accent} steps={steps} />;
}
