"use client";

import { useEffect } from "react";
import Link from "next/link";

import Button from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/containers/SessionProvider";
import { PlanCode } from "@/constants/user";

const CheckoutSuccessPage = () => {
  const { user } = useSession();

  useEffect(() => {
    const makeCurrentUserPremium = async () => {
      if (!user?.id) return;

      const supabase = createClient();

      const { error } = await supabase
        .from("subscriptions")
        .update({
          plan_code: PlanCode.PRO,
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .eq("user_id", user?.id);

      if (error) {
        console.error(error);
      }
    };

    makeCurrentUserPremium();
  }, [user?.id]);

  return (
    <div className="flex flex-col items-center justify-center size-full py-12">
      <div className="mb-6">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="logo-gradient"
              x1="0"
              y1="0"
              x2="64"
              y2="64"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF8A00" />
              <stop offset="0.5" stopColor="#FF6F91" />
              <stop offset="1" stopColor="#4F8CFF" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="32" fill="url(#logo-gradient)" />
          <path
            d="M20 34L28 42L44 26"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-center">
        Thank you for subscribing!
      </h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Your payment was successful and your subscription is now active. You can
        now enjoy all premium features.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
};

export default CheckoutSuccessPage;
