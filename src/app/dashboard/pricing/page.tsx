import { getStripeProducts } from "@/lib/payments/stripe";
import { getStripePrices } from "@/lib/payments/stripe";
import DashboardPricingSection from "@/components/sections/dashboard-pricing-section";

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  return <DashboardPricingSection prices={prices} products={products} />;
}
