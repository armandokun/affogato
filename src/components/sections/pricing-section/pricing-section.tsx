"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { LOGIN } from "@/constants/routes";
import { PRICING_PLANS } from "@/constants/pricing";
import PricingTabs from "@/components/general/pricing-tabs";

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState<"yearly" | "monthly">("yearly");

  const router = useRouter();

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4">
            Pricing that grows with you
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            No hidden fees, no surprises.
          </p>
        </div>

        <div className="flex justify-center my-5">
          <PricingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="grid min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 gap-4 w-full max-w-6xl mx-auto px-6">
          {PRICING_PLANS.map((tier) => {
            return (
              <div
                key={tier.name}
                className={cn(
                  "rounded-xl grid grid-rows-[180px_auto_1fr] relative h-fit min-[650px]:h-full min-[900px]:h-fit transition-all",
                  tier.isPopular
                    ? "md:shadow-[0px_61px_24px_-10px_rgba(0,0,0,0.01),0px_34px_20px_-8px_rgba(0,0,0,0.05),0px_15px_15px_-6px_rgba(0,0,0,0.09),0px_4px_8px_-2px_rgba(0,0,0,0.10),0px_0px_0px_1px_rgba(0,0,0,0.08)] bg-accent"
                    : "bg-[#F9FAFB]/[0.02] border border-border"
                )}
              >
                <div className="flex flex-col gap-4 p-4">
                  <p className="text-sm">
                    <span className="font-semibold">{tier.name}</span>
                    {tier.isPopular && (
                      <span
                        className="h-6 inline-flex w-fit items-center justify-center px-2 rounded-full text-sm ml-2 font-semibold shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.08),0px_3px_3px_-1.5px_rgba(0,0,0,0.08),0px_1px_1px_-0.5px_rgba(0,0,0,0.08),0px_0px_0px_1px_rgba(255,255,255,0.12)_inset,0px_1px_0px_0px_rgba(255,255,255,0.12)_inset]"
                        style={{
                          background:
                            "linear-gradient(90deg, #FF8A00 0%, #FF6F91 50%, #4F8CFF 100%)",
                          color: "white",
                        }}
                      >
                        Popular
                      </span>
                    )}
                  </p>
                  <div>
                    <div className="flex items-baseline mt-2">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={activeTab}
                          className="flex items-baseline"
                          initial={{
                            opacity: 0,
                            x: activeTab === "yearly" ? -10 : 10,
                            filter: "blur(5px)",
                          }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{
                            opacity: 0,
                            x: activeTab === "yearly" ? 10 : -10,
                            filter: "blur(5px)",
                          }}
                          transition={{
                            duration: 0.15,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        >
                          <span className="text-4xl font-semibold">
                            €
                            {activeTab === "yearly"
                              ? Math.round((tier.yearlyPrice / 12) * 100) / 100
                              : tier.price}
                          </span>
                          <span className="ml-2">/month</span>
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div
                      className={
                        activeTab === "yearly"
                          ? "text-xs text-muted-foreground font-normal min-h-[20px] mt-1"
                          : "text-xs text-muted-foreground font-normal min-h-[20px] mt-1 opacity-0 pointer-events-none"
                      }
                    >
                      Billed as €{tier.yearlyPrice}/year
                    </div>
                  </div>
                  <p className="text-sm">{tier.description}</p>
                </div>

                <div className="flex flex-col gap-2 p-4">
                  <button
                    className={cn(
                      "h-10 w-full flex items-center justify-center text-sm font-normal tracking-wide rounded-full px-4 transition-all ease-out mt-2 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 cursor-pointer"
                    )}
                    onClick={() => router.push(LOGIN)}
                    tabIndex={0}
                  >
                    {tier.buttonText}
                  </button>
                </div>
                <hr className="border-border dark:border-white/20" />
                <div className="p-4">
                  {tier.name !== "Free" && (
                    <p className="text-sm mb-4">
                      Everything in {tier.name === "Pro" ? "Free" : "Pro"} +
                    </p>
                  )}
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <div
                          className={cn(
                            "size-5 rounded-full border border-primary/20 flex items-center justify-center",
                            tier.isPopular &&
                              "bg-muted-foreground/40 border-border"
                          )}
                        >
                          <div className="size-3 flex items-center justify-center">
                            <svg
                              width="8"
                              height="7"
                              viewBox="0 0 8 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="block dark:hidden"
                            >
                              <path
                                d="M1.5 3.48828L3.375 5.36328L6.5 0.988281"
                                stroke="#101828"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                            <svg
                              width="8"
                              height="7"
                              viewBox="0 0 8 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="hidden dark:block"
                            >
                              <path
                                d="M1.5 3.48828L3.375 5.36328L6.5 0.988281"
                                stroke="#FAFAFA"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
