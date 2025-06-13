import { headers } from "next/headers";

import { getStripeProducts } from "@/lib/payments/stripe";
import { getStripePrices } from "@/lib/payments/stripe";
import { getCurrencyFromCountry } from "@/lib/payments/currency";
import DashboardPricingSection from "@/components/sections/dashboard-pricing-section";

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const headersList = await headers();
  const countryCode = headersList.get("x-vercel-ip-country") || undefined;
  const currency = getCurrencyFromCountry(countryCode);

  return (
    <DashboardPricingSection
      prices={prices}
      products={products}
      currency={currency}
    />
  );
}
