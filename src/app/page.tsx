import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { getServerSession } from '@/lib/auth'
import { getStripePrices } from '@/lib/payments/stripe'
import { getStripeProducts } from '@/lib/payments/stripe'
import { getCurrencyFromCountry } from '@/lib/payments/currency'

import Navbar from '@/components/sections/navbar'
import HeroSection from '@/components/sections/hero-section'
import PricingSection from '@/components/sections/pricing-section'
import LlmShowcase from '@/components/sections/llm-showcase'
import FeatureSection from '@/components/sections/feature-section'
import FAQ from '@/components/sections/faq-section'
import { Footer } from '@/components/sections/footer-section/footer-section'
import { DASHBOARD } from '@/constants/routes'
import CtaSection from '@/components/sections/cta-section'
import ComparisonSection from '@/components/sections/comparison-section'
import TestimonialSection from '@/components/sections/testimonial-section'
import UspSection from '@/components/sections/usp-section'

const Home = async () => {
  const user = await getServerSession()

  if (user) redirect(DASHBOARD)

  const [prices, products] = await Promise.all([getStripePrices(), getStripeProducts()])

  const headersList = await headers()
  const countryCode = headersList.get('x-vercel-ip-country') || 'US'
  const currency = getCurrencyFromCountry(countryCode)

  return (
    <>
      <div className="flex flex-col p-4 md:max-w-4xl lg:max-w-7xl md:mx-auto">
        <Navbar />
        <HeroSection currency={currency} />
        <div className="max-w-7xl mx-auto w-full mt-30">
          <main className="flex flex-col items-center justify-center w-full gap-30 md:gap-50">
            <LlmShowcase />
            <UspSection />
            <FeatureSection />
            <ComparisonSection currency={currency} />
            <PricingSection prices={prices} products={products} currency={currency} />
            <TestimonialSection />
            <FAQ />
            <CtaSection />
            <Footer />
          </main>
        </div>
      </div>
    </>
  )
}

export default Home
