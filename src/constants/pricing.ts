import Stripe from 'stripe'

export const STRIPE_PRICING_TIERS = [
  {
    id: 'pro',
    name: 'Pro',
    features: [
      'Unlimited messages',
      'Access to top models, like Sonnet 4, Gemini Flash, and more',
      'Unlimited access to web search and file uploads',
      'Cancel anytime'
    ],
    description: 'Perfect for daily use.',
    buttonText: 'Start Pro',
    buttonColor: 'bg-accent text-primary',
    isPopular: true
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    features: [
      'Access to all available models',
      'Priority support',
      "Access to new features before they're released"
    ],
    description: 'Perfect for AI prosumers.',
    buttonText: 'Start Unlimited',
    buttonColor: 'bg-accent text-primary',
    isPopular: false
  }
]

export type PricingPrice = {
  id: string
  productId: string
  unitAmount: number | null
  currency: string
  interval: Stripe.Price.Recurring.Interval | undefined
  trialPeriodDays: number | null | undefined
}

export type PricingProduct = {
  id: string
  name: string
  description: string | null
  defaultPriceId: string | undefined
}

export type PricingTier = {
  id: string
  name: string
  features: string[]
  description: string
  buttonText: string
  buttonColor: string
  isPopular: boolean
  price: number
  currency: string
  yearlyPrice: number
  stripePriceIdMonthly: string
  stripePriceIdYearly: string
}

export const EU_COUNTRIES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE'
]
