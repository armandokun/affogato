'use client'

import { useState, useImperativeHandle, forwardRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import DashboardPricingPage from '@/components/sections/dashboard-pricing-section'
import { PricingPrice, PricingProduct } from '@/constants/pricing'

export type PricingModalRef = {
  show: () => void
}

type PricingData = {
  prices: Array<PricingPrice>
  products: Array<PricingProduct>
  currency: 'usd' | 'eur'
}

const PricingModal = forwardRef<PricingModalRef>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchPricingData = async () => {
    if (pricingData || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/pricing')

      if (!response.ok) {
        throw new Error('Failed to fetch pricing data')
      }

      const data = await response.json()

      setPricingData(data)
    } catch (error) {
      console.error('Failed to fetch pricing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const show = async () => {
    await fetchPricingData()

    setIsOpen(true)
  }

  const hide = () => {
    setIsOpen(false)
  }

  useImperativeHandle(ref, () => ({
    show
  }))

  if (!pricingData && !isLoading) return null

  return (
    <Dialog open={isOpen} onOpenChange={hide}>
      <DialogContent
        className="!w-[95vw] !max-w-[900px] sm:!max-w-[900px] max-h-[90vh] overflow-y-auto !p-0 !gap-0"
        showCloseButton={true}
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="p-6 pb-4 w-full">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-medium text-center">
              You&apos;ve reached your daily message limit
            </DialogTitle>
            <DialogDescription className="text-base text-center mt-2">
              Upgrade to a paid plan for unlimited messages and access to all premium features
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="w-full px-6 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading pricing...</div>
            </div>
          ) : pricingData ? (
            <DashboardPricingPage
              prices={pricingData.prices}
              products={pricingData.products}
              currency={pricingData.currency}
              isModal={true}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
})

PricingModal.displayName = 'PricingModal'

export default PricingModal
