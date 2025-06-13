import Stripe from "stripe";

export const STRIPE_PRICING_TIERS = [
  {
    id: "pro",
    name: "Pro",
    features: [
      "1,500 messages per month",
      "Access to all available models",
      "Unlimited access to web search, file uploads and more",
    ],
    description: "Perfect for daily use.",
    buttonText: "Start Pro",
    buttonColor: "bg-accent text-primary",
    isPopular: true,
  },
  {
    id: "unlimited",
    name: "Unlimited",
    features: [
      "Unlimited messages",
      "Unlimited access to web search, file uploads and more",
      "Access to new features before they're released",
    ],
    description: "Perfect for AI prosumers.",
    buttonText: "Start Unlimited",
    buttonColor: "bg-accent text-primary",
    isPopular: false,
  },
];

export type PricingPrice = {
  id: string,
  productId: string
  unitAmount: number | null,
  currency: string,
  interval: Stripe.Price.Recurring.Interval | undefined,
  trialPeriodDays: number | null | undefined
}

export type PricingProduct = {
  id: string,
  name: string,
  description: string | null,
  defaultPriceId: string | undefined
}

export type PricingTier = {
  id: string,
  name: string,
  features: string[],
  description: string,
  buttonText: string,
  buttonColor: string,
  isPopular: boolean,
  price: number,
  yearlyPrice: number,
  stripePriceIdMonthly: string,
  stripePriceIdYearly: string,
}
