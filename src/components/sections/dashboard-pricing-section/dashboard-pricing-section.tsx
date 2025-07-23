'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

import { createClient } from '@/lib/supabase/client'
import useSidebar from '@/hooks/use-sidebar'
import { PricingPrice, PricingProduct } from '@/constants/pricing'
import { useSession } from '@/containers/SessionProvider'
import PricingTabs from '@/components/general/pricing-tabs'
import SectionHeader from '@/components/general/section-header'
import { toast } from '@/components/ui/toast/toast'
import PricingCard from '@/components/general/pricing-card'
import { SidebarTrigger } from '@/components/general/sidebar/sidebar'

import { buildTiersFromStripe } from '../pricing-section/pricing-section'

const DashboardPricingPage = ({
  prices,
  products,
  currency,
  isModal = false
}: {
  prices: Array<PricingPrice>
  products: Array<PricingProduct>
  currency: 'usd' | 'eur'
  isModal?: boolean
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const { user } = useSession()
  const { open, isMobile } = useSidebar()

  const stripeTiers = buildTiersFromStripe(products, prices, currency)

  const proTier = stripeTiers.find((t) => t.name === 'Pro')
  const unlimitedTier = stripeTiers.find((t) => t.name === 'Unlimited')

  const tiers = [proTier, unlimitedTier].filter((tier) => tier !== undefined)

  useEffect(() => {
    const getSelectedPlan = async () => {
      if (!user?.id) return

      const supabase = createClient()

      const { data, error } = await supabase
        .from('subscriptions')
        .select('stripe_price_id')
        .eq('user_id', user.id)
        .single()

      if (error) {
        toast({
          type: 'error',
          description: 'Failed to get selected plan'
        })

        return
      }

      setSelectedPlanId(data?.stripe_price_id ?? null)
    }

    getSelectedPlan()
  }, [user?.id])

  const handlePublicCheckout = async (
    price: { currency: string; amount: number },
    priceId?: string
  ) => {
    try {
      const res = await fetch('/api/stripe/public-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, price })
      })
      const data = await res.json()

      if (!data.sessionUrl) throw new Error('No session URL returned')

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

      if (stripe) {
        window.location.href = data.sessionUrl
      } else {
        window.location.href = data.sessionUrl
      }
    } catch (err) {
      alert(`Failed to start checkout. Please try again: ${err}`)
    }
  }

  return (
    <section
      id="pricing"
      className={`flex flex-col items-center justify-center gap-10 pb-10 w-full relative ${isModal ? 'px-0' : ''}`}>
      {!isModal && (!open || isMobile) && (
        <div className="absolute top-0 left-0 p-2">
          <SidebarTrigger />
        </div>
      )}
      {!isModal && (
        <SectionHeader>
          <Image src="/logo.png" alt="Pricing" width={100} height={100} className="size-15" />
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance mt-4">
            Pricing that grows with you
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
            No hidden fees, no surprises.
          </p>
        </SectionHeader>
      )}
      <div className="relative w-full h-full">
        <div
          className={
            isModal ? 'flex justify-center mb-6' : 'absolute -top-14 left-1/2 -translate-x-1/2'
          }>
          <PricingTabs
            activeTab={billingCycle}
            setActiveTab={setBillingCycle}
            className="mx-auto"
          />
        </div>

        <div
          className={`grid min-[650px]:grid-cols-2 gap-4 w-full mx-auto ${isModal ? 'max-w-none md:px-6' : 'max-w-3xl px-6'}`}>
          {tiers.map((tier) => {
            const priceId =
              billingCycle === 'yearly' ? tier.stripePriceIdYearly : tier.stripePriceIdMonthly
            const isSelected = selectedPlanId === priceId

            return (
              <PricingCard
                key={tier.id}
                tier={tier}
                isSelected={isSelected}
                activeTab={billingCycle}
                onCheckout={() =>
                  user?.is_anonymous
                    ? handlePublicCheckout({ currency: currency, amount: tier.price }, priceId)
                    : undefined
                }
              />
            )
          })}
        </div>
        <p className="text-center text-gray-400 mt-4 w-[80%] mx-auto text-sm">
          100% risk-free. <br />
          Cancel anytime within 14 days for a full refund.
        </p>
      </div>
    </section>
  )
}

export default DashboardPricingPage
