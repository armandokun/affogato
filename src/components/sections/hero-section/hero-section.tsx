"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { LOGIN } from "@/constants/routes";
import AnimatedLlmList from "@/components/general/animated-llm-list";
import AnimatedGradientBackground from "@/components/general/animated-gradient-background";

const llmListVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } },
};

const headingVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.5 } },
};

const HeroSection = () => {
  return (
    <section id="hero" className="flex items-center justify-center mt-4">
      <div className="relative w-full h-[85vh] rounded-3xl overflow-hidden flex items-center justify-center">
        <AnimatedGradientBackground containerClassName="size-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center w-full px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={llmListVariants}
              className="w-full flex justify-center"
            >
              <AnimatedLlmList />
            </motion.div>
            <div className="relative z-10 max-w-3xl mx-auto h-full w-full flex flex-col gap-10 items-center justify-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={headingVariants}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center text-primary">
                  <span>Your AI models,</span>
                  <span className="block">one subscription price</span>
                </h1>
              </motion.div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={descriptionVariants}
              >
                <p className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight">
                  Skip extra subscriptions. Use the best Large Language Models
                  in a single, unified chat with Affogato.
                </p>
              </motion.div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={buttonVariants}
              >
                <div className="flex items-center gap-2.5 flex-wrap justify-center">
                  <Link
                    href={LOGIN}
                    className="bg-secondary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-secondary-foreground w-32 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
