import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-bewuste vervangers voor next/link en next/navigation. Gebruik deze
// `Link`, `useRouter`, `usePathname` en `redirect` in plaats van die uit Next
// zelf, zodat interne links automatisch de juiste taal-prefix krijgen.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
