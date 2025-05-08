"use client";

import Image from "next/image";
import { cubicBezier, motion } from "framer-motion";

const AnimatedLlmItem = ({
  variant,
  llmName,
}: {
  variant: unknown;
  llmName: "chatgpt" | "claude" | "meta" | "gemini";
}) => {
  return (
    <motion.div
      variants={variant as undefined}
      className="z-[3] flex flex-col items-center justify-between rounded-xl border transition-all duration-100 ease-linear border-neutral-80"
    >
      <div className="size-20 rounded-xl items-center justify-center flex p-4 bg-black">
        <Image
          src={`/llm-icons/${llmName}.png`}
          alt={llmName}
          width={48}
          height={48}
          priority
        />
      </div>
    </motion.div>
  );
};

const AnimatedLlmList = () => {
  const variant1 = {
    initial: {
      x: 35,
      y: 5,
      scale: 0.8,
      rotate: -3,
      zIndex: 1,
      transition: {
        delay: 0.05,
        duration: 0.1,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      boxShadow: "0 8px 32px 0 rgba(255,255,255,0.25)",
      transition: {
        delay: 0.05,
        duration: 0.1,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };
  const variant2 = {
    initial: {
      scale: 1.1,
      zIndex: 2,
      transition: {
        delay: 0.05,
        duration: 0.1,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      scale: 1,
      boxShadow: "0 8px 32px 0 rgba(255,179,0,0.25)",
      transition: {
        delay: 0.05,
        duration: 0.1,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };
  const variant3 = {
    initial: {
      x: -35,
      y: 5,
      scale: 0.8,
      rotate: 3,
      zIndex: 1,
      transition: {
        delay: 0.05,
        duration: 0.1,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      boxShadow: "0 8px 32px 0 rgba(66,133,244,0.25)",
      transition: {
        delay: 0.05,
        duration: 0.1,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  const containerVariants = {
    initial: {},
    whileHover: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileHover="whileHover"
      className="flex h-full w-full flex-col items-start justify-between"
    >
      <div className="flex h-full w-full items-center justify-center rounded-t-xl bg-transparent pb-4">
        <motion.div className="flex items-center justify-between gap-x-4">
          <AnimatedLlmItem variant={variant1} llmName="chatgpt" />
          <AnimatedLlmItem variant={variant2} llmName="claude" />
          <AnimatedLlmItem variant={variant3} llmName="gemini" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedLlmList;
