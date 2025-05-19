import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import Navbar from "@/components/sections/navbar";
import HeroSection from "@/components/sections/hero-section";
import PricingSection from "@/components/sections/pricing-section";
import ProviderShowcase from "@/components/sections/provider-showcase";
import FeatureSection from "@/components/sections/feature-section";
import FAQ from "@/components/sections/faq-section";
import { Footer } from "@/components/sections/footer-section/footer-section";

const Home = async () => {
  const user = await getServerSession();

  if (user) redirect("/dashboard");

  return (
    <>
      <div className="flex flex-col p-4 md:max-w-4xl lg:max-w-7xl md:mx-auto">
        <Navbar />
        <HeroSection />
        <div className="max-w-7xl mx-auto w-full">
          <main className="flex flex-col items-center justify-center w-full">
            <ProviderShowcase />
            <FeatureSection />
            <PricingSection />
            <FAQ />
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
