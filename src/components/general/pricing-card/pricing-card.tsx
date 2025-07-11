'use client'

import { AnimatePresence, motion } from 'motion/react'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { PricingTier } from '@/constants/pricing'
import { checkoutAction, customerPortalAction } from '@/lib/payments/actions'
import { useSession } from '@/containers/SessionProvider'

type Props = {
  tier: PricingTier
  activeTab: 'yearly' | 'monthly'
  showOldPrice?: boolean
  isSelected?: boolean
  onCheckout?: (price: { currency: string; amount: number }, priceId?: string) => void
}

const PricingCard = ({ tier, activeTab, isSelected, onCheckout, showOldPrice = false }: Props) => {
  const { user } = useSession()

  const getFeatureTitle = () => {
    switch (tier.name) {
      case 'Pro':
        return 'Plan includes'
      case 'Unlimited':
        return 'Everything in Pro +'
    }
  }

  return (
    <div
      key={tier.name}
      className={cn(
        'rounded-xl grid grid-rows-[180px_auto_1fr] relative h-fit min-[650px]:h-full min-[900px]:h-fit transition-all',
        tier.isPopular
          ? 'md:shadow-[0px_61px_24px_-10px_rgba(0,0,0,0.01),0px_34px_20px_-8px_rgba(0,0,0,0.05),0px_15px_15px_-6px_rgba(0,0,0,0.09),0px_4px_8px_-2px_rgba(0,0,0,0.10),0px_0px_0px_1px_rgba(0,0,0,0.08)] bg-accent'
          : 'bg-[#F9FAFB]/[0.02] border border-border'
      )}>
      <div className="flex flex-col gap-4 p-4">
        <p className="text-sm">
          <span className="font-semibold">{tier.name}</span>
          {tier.isPopular && (
            <span
              className="h-6 inline-flex w-fit items-center justify-center px-2 rounded-full text-sm ml-2 font-semibold shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.08),0px_3px_3px_-1.5px_rgba(0,0,0,0.08),0px_1px_1px_-0.5px_rgba(0,0,0,0.08),0px_0px_0px_1px_rgba(255,255,255,0.12)_inset,0px_1px_0px_0px_rgba(255,255,255,0.12)_inset]"
              style={{
                background: 'linear-gradient(90deg, #FF8A00 0%, #FF6F91 50%, #4F8CFF 100%)',
                color: 'white'
              }}>
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
                  x: activeTab === 'yearly' ? -10 : 10,
                  filter: 'blur(5px)'
                }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  x: activeTab === 'yearly' ? 10 : -10,
                  filter: 'blur(5px)'
                }}
                transition={{
                  duration: 0.15,
                  ease: [0.4, 0, 0.2, 1]
                }}>
                <div className="flex flex-col">
                  {showOldPrice && (
                    <span className="text-lg line-through text-muted-foreground">
                      {tier.currency === 'eur' ? '€' : '$'}
                      {activeTab === 'yearly'
                        ? (Math.round((tier.yearlyPrice / 12) * 100) / 100) * 2
                        : tier.price * 2}
                    </span>
                  )}
                  <span>
                    <span className="text-4xl font-semibold">
                      {tier.currency === 'eur' ? '€' : '$'}
                      {activeTab === 'yearly'
                        ? Math.round((tier.yearlyPrice / 12) * 100) / 100
                        : tier.price}
                    </span>
                    <span className="ml-2">/month</span>
                  </span>
                </div>
              </motion.span>
            </AnimatePresence>
          </div>
          <div
            className={
              activeTab === 'yearly'
                ? 'text-xs text-muted-foreground font-normal min-h-[20px] mt-1'
                : 'text-xs text-muted-foreground font-normal min-h-[20px] mt-1 opacity-0 pointer-events-none'
            }>
            Billed as {tier.currency === 'eur' ? '€' : '$'}180/year
          </div>
        </div>
        <p className="text-sm">{tier.description}</p>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <form
          action={(formData) => {
            if (!user?.id) return

            checkoutAction(formData, user?.id)
          }}>
          <input
            type="hidden"
            name="priceId"
            value={activeTab === 'yearly' ? tier.stripePriceIdYearly : tier.stripePriceIdMonthly}
          />
          <button
            className={cn(
              'h-10 w-full flex items-center justify-center text-sm font-normal tracking-wide rounded-full px-4 transition-all ease-out mt-2 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 cursor-pointer',
              isSelected && 'border-primary border bg-transparent hover:bg-background'
            )}
            formAction={(formData) => {
              if (!user?.id) {
                if (onCheckout) {
                  const priceId =
                    activeTab === 'yearly' ? tier.stripePriceIdYearly : tier.stripePriceIdMonthly
                  onCheckout(
                    {
                      currency: tier.currency,
                      amount: tier.price
                    },
                    priceId
                  )
                }

                return
              }

              if (isSelected) {
                customerPortalAction(user.id)
              } else {
                checkoutAction(formData, user.id)
              }
            }}
            tabIndex={0}>
            {isSelected ? 'Manage Subscription' : tier.buttonText}
          </button>
        </form>
      </div>
      <hr className="border-white/20" />
      <div className="p-4">
        <p className="text-sm mb-4">{getFeatureTitle()}</p>
        <ul className="space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <div
                className={cn(
                  'size-5 rounded-full border border-primary/20 flex items-center justify-center',
                  tier.isPopular && 'bg-muted-foreground/40 border-border'
                )}>
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
  )
}

export default PricingCard
