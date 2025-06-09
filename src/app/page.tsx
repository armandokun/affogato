import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import Navbar from "@/components/sections/navbar";
import HeroSection from "@/components/sections/hero-section";
import PricingSection from "@/components/sections/pricing-section";
import LlmShowcase from "@/components/sections/llm-showcase";
import FeatureSection from "@/components/sections/feature-section";
import FAQ from "@/components/sections/faq-section";
import { Footer } from "@/components/sections/footer-section/footer-section";
import { DASHBOARD } from "@/constants/routes";
import CtaSection from "@/components/sections/cta-section";
import { getStripePrices } from "@/lib/payments/stripe";
import { getStripeProducts } from "@/lib/payments/stripe";

const Home = async () => {
  const user = await getServerSession();

  if (user) redirect(DASHBOARD);

  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  return (
    <>
      <div className="flex flex-col p-4 md:max-w-4xl lg:max-w-7xl md:mx-auto">
        <Navbar />
        <HeroSection />
        <div className="max-w-7xl mx-auto w-full mt-30">
          <main className="flex flex-col items-center justify-center w-full gap-30 md:gap-50">
            <LlmShowcase />
            <FeatureSection />
            <PricingSection prices={prices} products={products} />
            <FAQ />
            <CtaSection />
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
