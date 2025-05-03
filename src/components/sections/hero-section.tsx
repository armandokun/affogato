import Link from "next/link";

import { siteConfig } from "@/lib/config";

import AnimatedGradientBackground from "../animated-gradient-background";
import AnimatedLlmList from "../animated-llm-list";

export function HeroSection() {
  const { hero } = siteConfig;

  return (
    <>
      <div className="absolute inset-0">
        <AnimatedGradientBackground />
      </div>
      <section id="hero" className="w-full relative">
        <div className="relative flex flex-col items-center w-full px-6">
          <div className="relative z-10 max-w-3xl mx-auto h-full w-full flex flex-col gap-10 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-5">
              <AnimatedLlmList />
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center text-primary">
                {hero.title}
              </h1>
              <p className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight">
                {hero.description}
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <Link
                href={hero.cta.primary.href}
                className="bg-secondary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground w-32 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
              >
                {hero.cta.primary.text}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
