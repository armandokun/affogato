'use client'

import { useState } from 'react'

import {
  STRIPE_PRICING_TIERS,
  PricingPrice,
  PricingProduct,
  PricingTier
} from '@/constants/pricing'
import PricingTabs from '@/components/general/pricing-tabs'
import PricingCard from '@/components/general/pricing-card'

export function buildTiersFromStripe(
  products: Array<PricingProduct>,
  prices: Array<PricingPrice>,
  currency: 'usd' | 'eur'
): Array<PricingTier> {
  return products.map((product) => {
    const meta = STRIPE_PRICING_TIERS.find((plan) => plan.name === product.name)
    const monthly = prices.find(
      (p) => p.productId === product.id && p.interval === 'month' && p.currency === currency
    )
    const yearly = prices.find(
      (p) => p.productId === product.id && p.interval === 'year' && p.currency === currency
    )

    return {
      id: product.id,
      name: product.name,
      features: meta?.features || [],
      description: product.description || meta?.description || '',
      buttonText: meta?.buttonText || 'Choose Plan',
      buttonColor: meta?.buttonColor || 'bg-accent text-primary',
      isPopular: meta?.isPopular || false,
      price: monthly?.unitAmount ? monthly.unitAmount / 100 : 0,
      currency: currency,
      yearlyPrice: yearly?.unitAmount ? yearly.unitAmount / 100 : 0,
      stripePriceIdMonthly: monthly?.id || '',
      stripePriceIdYearly: yearly?.id || ''
    }
  })
}

const PricingSection = ({
  prices,
  products,
  currency
}: {
  prices: Array<PricingPrice>
  products: Array<PricingProduct>
  currency: 'usd' | 'eur'
}) => {
  const [activeTab, setActiveTab] = useState<'yearly' | 'monthly'>('monthly')

  const stripeTiers = buildTiersFromStripe(products, prices, currency)

  const proTier = stripeTiers.find((t) => t.name === 'Pro')
  const unlimitedTier = stripeTiers.find((t) => t.name === 'Unlimited')

  const tiers = [proTier, unlimitedTier].filter((tier) => tier !== undefined)

  return (
    <section id="pricing">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
            Pricing that grows with you
          </h2>
          <p className="text-gray-400">No hidden fees, no surprises.</p>
        </div>
        <div className="flex justify-center my-5">
          <PricingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="grid min-[650px]:grid-cols-2 gap-4 w-full max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard key={tier!.id} tier={tier!} activeTab={activeTab} />
          ))}
        </div>
        <p className="text-center text-gray-400 mt-4 w-[80%] mx-auto text-sm">
          100% risk-free. <br />
          Cancel anytime within 14 days for a full refund.
        </p>
      </div>
    </section>
  )
}

export default PricingSection
