'use client'

import { useState } from 'react'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Label, Separator } from 'radix-ui'
import { useSearchParams } from 'next/navigation'

import Button from '@/components/ui/button'
import Icons from '@/components/general/icons'
import { signInWithEmail, signInWithOAuth } from '@/app/login/actions'
import AuthSubmitButton from '@/components/general/auth-submit-button'
import FormMessage, { Message } from '@/components/general/form-message/form-message'
import { DASHBOARD } from '@/constants/routes'

const LoginSection = ({
  formMessage,
  showSignup
}: {
  formMessage: Message | undefined
  showSignup?: boolean
}) => {
  const [isSignUp, setIsSignUp] = useState(showSignup || false)

  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') || DASHBOARD

  return (
    <div className="flex flex-col justify-center mx-auto px-6 py-12 gap-8 max-w-md h-full">
      <div className="flex flex-col items-start gap-8">
        <Link href="/">
          <Icons.logo className="size-10" />
        </Link>
        <h1 className="text-3xl font-bold">
          The start of <br />
          something great.
        </h1>
      </div>
      <div className="flex flex-col gap-3 w-full mt-2">
        <form className="w-full">
          <input type="hidden" name="provider" value="google" />
          {ref && <input type="hidden" name="ref" value={ref} />}
          <AuthSubmitButton
            title="Continue with Google"
            pendingTitle="Continuing with Google..."
            formAction={signInWithOAuth}>
            <Icons.google className="size-4" />
          </AuthSubmitButton>
        </form>
        <form className="w-full">
          <input type="hidden" name="provider" value="github" />
          {ref && <input type="hidden" name="ref" value={ref} />}
          <AuthSubmitButton
            title="Continue with GitHub"
            pendingTitle="Continuing with GitHub..."
            formAction={signInWithOAuth}>
            <GitHubLogoIcon className="size-4" />
          </AuthSubmitButton>
        </form>
      </div>
      <div className="flex items-center gap-2 my-2 w-full">
        <Separator.Root className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator.Root className="flex-1 h-px bg-border" />
      </div>
      <form className="flex flex-col gap-4 w-full">
        <div>
          <Label.Root htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </Label.Root>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ada@lovelace.com"
          />
        </div>
        {isSignUp ? (
          <>
            <AuthSubmitButton
              title="Sign up"
              pendingTitle="Signing up..."
              formAction={signInWithEmail}
            />
          </>
        ) : (
          <AuthSubmitButton
            title="Sign in"
            pendingTitle="Signing in..."
            formAction={signInWithEmail}
          />
        )}
        {ref && <input type="hidden" name="ref" value={ref} />}
        {formMessage && <FormMessage message={formMessage} />}
      </form>
      <div className="flex justify-center text-sm text-muted-foreground w-full">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <Button
              variant="link"
              className="text-primary underline ml-1 p-0 h-auto text-sm"
              type="button"
              onClick={() => setIsSignUp(false)}>
              Sign in
            </Button>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              className="text-primary underline ml-1 p-0 h-auto text-sm"
              type="button"
              onClick={() => setIsSignUp(true)}>
              Sign up
            </Button>
          </>
        )}
      </div>
      <div className="mt-2 text-xs text-muted-foreground w-full text-center">
        By using Affogato, you agree to our{' '}
        <Link href="/terms" className="text-primary underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-primary underline">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  )
}

export default LoginSection
