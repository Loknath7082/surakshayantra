import Hero from "@/components/marketing/hero";
import ServicesOverview from "@/components/marketing/services-overview";
import MethodologyPreview from "@/components/marketing/methodology-preview";
import TrustIndicators from "@/components/marketing/trust-indicators";
import ClosingCta from "@/components/marketing/closing-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <MethodologyPreview />
      <TrustIndicators />
      <ClosingCta />
    </>
  );
}
