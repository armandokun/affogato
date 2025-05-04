import { redirect } from "next/navigation";

import AnimatedGradientBackground from "@/components/general/animated-gradient-background";
import HeroSection from "@/components/sections/hero-section";
import Navbar from "@/components/sections/navbar";
import { createClient } from "@/lib/supabase/server";

const Home = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <>
      <div className="absolute inset-0">
        <AnimatedGradientBackground />
      </div>
      <div className="max-w-7xl mx-auto min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <main className="flex flex-col items-center justify-center divide-y divide-border w-full">
            <HeroSection />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
