import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import Navbar from "@/components/sections/navbar";
import HeroSection from "@/components/sections/hero-section";
import PricingSection from "@/components/sections/pricing-section";
import AnimatedGradientBackground from "@/components/general/animated-gradient-background";
import ProviderShowcase from "@/components/sections/provider-showcase";
import FeatureSection from "@/components/sections/feature-section";
import FAQ from "@/components/sections/faq-section";
import { Footer } from "@/components/sections/footer-section/footer-section";

const Home = async () => {
  const user = await getServerSession();

  if (user) redirect("/dashboard");

  return (
    <>
      <div className="flex flex-col">
        <Navbar />
        <div className="w-full flex items-center justify-center p-4 min-h-[80vh] mt-5">
          <div className="relative w-[80vw] h-[80vh] rounded-3xl overflow-hidden flex items-center justify-center">
            <AnimatedGradientBackground containerClassName="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HeroSection />
            </div>
          </div>
        </div>
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
