'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import Button from '@/components/ui/button'
import { event } from '@/lib/fpixel'
import { DASHBOARD, LOGIN } from '@/constants/routes'
import { useSession } from '@/containers/SessionProvider'

type Props = {
  fbpValue: string | undefined
  fbpCurrency: string | undefined
}

const ClientCheckoutSuccessPage = ({ fbpValue, fbpCurrency }: Props) => {
  const { user } = useSession()

  useEffect(() => {
    const isTracked = localStorage.getItem('fbp_tracked')

    if (!fbpValue || !fbpCurrency || isTracked) return

    event('Purchase', {
      currency: fbpCurrency,
      value: fbpValue
    })

    localStorage.setItem('fbp_tracked', 'true')
  }, [fbpCurrency, fbpValue])

  return (
    <div className="flex flex-col items-center justify-center size-full py-12 px-4">
      <div className="mb-6">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="logo-gradient"
              x1="0"
              y1="0"
              x2="64"
              y2="64"
              gradientUnits="userSpaceOnUse">
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
      <h1 className="text-2xl font-semibold mb-2 text-center">Thank you for subscribing!</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Your payment was successful and your subscription is now active. To enjoy all the paid plan
        features, link your account to your email.
      </p>
      {user?.is_anonymous ? (
        <Button asChild className="rounded-full">
          <Link href={`${LOGIN}?signup=true`}>Link Account</Link>
        </Button>
      ) : (
        <Button asChild className="rounded-full">
          <Link href={DASHBOARD}>Go to Dashboard</Link>
        </Button>
      )}
    </div>
  )
}

export default ClientCheckoutSuccessPage
