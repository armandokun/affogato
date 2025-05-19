"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { PRICING_PLANS } from "@/constants/pricing";
import { useSession } from "@/containers/SessionProvider";
import PricingTabs from "@/components/general/pricing-tabs";
import SectionHeader from "@/components/general/section-header";
import { toast } from "@/components/ui/toast/toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { user } = useSession();

  useEffect(() => {
    const getSelectedPlan = async () => {
      if (!user?.id) return;

      const supabase = createClient();

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        toast({
          type: "error",
          description: "Failed to get selected plan",
        });

        return;
      }

      setSelectedPlan(data?.plan_code ?? null);
    };

    getSelectedPlan();
  }, [user?.id]);

  async function handleCheckout(stripePriceId: string) {
    setLoadingPlan(stripePriceId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: stripePriceId, userId: user?.id }),
      });

      const data = await res.json();

      if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        toast({
          type: "error",
          description: data.error || "Failed to create checkout session",
        });
      }
    } catch {
      toast({
        type: "error",
        description: "Failed to create checkout session",
      });
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative"
    >
      <SectionHeader>
        <Image
          src="/logo.png"
          alt="Pricing"
          width={100}
          height={100}
          className="size-15"
        />
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance mt-4">
          Pricing that grows with you
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          No hidden fees, no surprises.
        </p>
      </SectionHeader>
      <div className="relative w-full h-full">
        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
          <PricingTabs
            activeTab={billingCycle}
            setActiveTab={setBillingCycle}
            className="mx-auto"
          />
        </div>

        <div className="grid min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 gap-4 w-full max-w-6xl mx-auto px-6">
          {PRICING_PLANS.map((tier) => {
            const priceId =
              billingCycle === "yearly"
                ? tier.stripePriceIdYearly
                : tier.stripePriceIdMonthly;
            const isPaidPlan = Boolean(priceId);
            const isSelected = selectedPlan === tier.id;

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
                          key={billingCycle}
                          className="flex items-baseline"
                          initial={{
                            opacity: 0,
                            x: billingCycle === "yearly" ? -10 : 10,
                            filter: "blur(5px)",
                          }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{
                            opacity: 0,
                            x: billingCycle === "yearly" ? 10 : -10,
                            filter: "blur(5px)",
                          }}
                          transition={{
                            duration: 0.15,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        >
                          <span className="text-4xl font-semibold">
                            €
                            {billingCycle === "yearly"
                              ? Math.round((tier.yearlyPrice / 12) * 100) / 100
                              : tier.price}
                          </span>
                          <span className="ml-2">/month</span>
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div
                      className={
                        billingCycle === "yearly"
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
                      "h-10 w-full flex items-center justify-center text-sm font-normal tracking-wide rounded-full px-4 transition-all ease-out mt-2",
                      isSelected
                        ? "bg-muted text-muted-foreground opacity-70 cursor-not-allowed pointer-events-none"
                        : "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 cursor-pointer"
                    )}
                    onClick={() => {
                      if (isSelected) return;

                      if (isPaidPlan && priceId) {
                        setLoadingPlan(priceId);

                        handleCheckout(priceId);
                      } else {
                        setSelectedPlan(tier.id);
                      }
                    }}
                    disabled={
                      isSelected || (isPaidPlan && loadingPlan === priceId)
                    }
                    tabIndex={isSelected ? -1 : 0}
                  >
                    {isSelected
                      ? "Currently selected"
                      : isPaidPlan && loadingPlan === priceId
                      ? "Redirecting…"
                      : tier.buttonText}
                  </button>
                </div>
                <hr className="border-white/20" />
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
                          <div className="size-5 flex items-center justify-center">
                            <CheckIcon className="size-3" />
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

export default PricingPage;
