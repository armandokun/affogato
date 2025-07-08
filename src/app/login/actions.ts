'use server'

import { redirect } from 'next/navigation'

import { encodedRedirect } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { DASHBOARD, LOGIN } from '@/constants/routes'
import { toast } from '@/components/ui/toast/toast'

export const signOut = async () => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) return toast({ description: error.message, type: 'error' })

  redirect(LOGIN)
}

export const signInWithEmail = async (formData: FormData) => {
  const supabase = await createClient()

  const email = formData.get('email')?.toString() || ''

  const redirectToUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL : 'http://127.0.0.1:3000'

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectToUrl
    }
  })

  if (error) return encodedRedirect('error', LOGIN, error.message)

  return encodedRedirect('success', LOGIN, 'Please check your email for a confirmation link.', {
    signup: 'true'
  })
}

export const signInWithOAuth = async (formData: FormData) => {
  const provider = formData.get('provider') as 'google' | 'github'
  const ref = formData.get('ref')?.toString() || DASHBOARD

  const supabase = await createClient()

  const redirectToUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(ref)}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectToUrl
    }
  })

  if (error) return encodedRedirect('error', LOGIN, error.message)

  if (data.url) return redirect(data.url)

  return encodedRedirect('error', LOGIN, 'No redirect URL from provider.')
}
