"use client";

import { Component, type ReactNode } from "react";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { CtaButton } from "@/components/ui/cta-button";
import { contact } from "@/lib/site";
import type { FormId } from "@/lib/validation/shared";
import { FormAlert } from "./fields/form-alert";

/**
 * Vangt fouten van een mislukt verzoek (429 van de WAF, netwerkfout of een
 * verouderde Server Action na een deploy) en toont een melding met bellen
 * (spec 07 §4.11). De ingevulde waarden zijn na opnieuw proberen weg.
 */
export class FormErrorBoundary extends Component<{ form: FormId; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    console.error(`[formulier] ${this.props.form} verzoek mislukt`);
  }

  render() {
    if (this.state.failed) return <BoundaryFallback onRetry={() => this.setState({ failed: false })} />;
    return this.props.children;
  }
}

function BoundaryFallback({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("forms.common");
  const tc = useTranslations("common");
  return (
    <FormAlert
      message={t("networkError")}
      contactLinks={
        <>
          <CtaButton variant="primary" size="sm" onClick={onRetry}>
            {t("retry")}
          </CtaButton>
          <CtaButton variant="secondary" size="sm" href={contact.phoneHref} ariaLabel={tc("a11y.callPerson", { name: contact.shortName, phone: contact.phone })}>
            <Phone aria-hidden="true" />
            {tc("cta.call")}
          </CtaButton>
        </>
      }
    />
  );
}
