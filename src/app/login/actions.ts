'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { encodedRedirect } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { DASHBOARD, LOGIN } from '@/constants/routes'
import { constructUrlWithParams } from '@/lib/utils/url/url'

export const signInWithEmail = async (formData: FormData) => {
  const supabase = await createClient()

  const email = formData.get('email')?.toString() || ''

  if (!email) return encodedRedirect('error', LOGIN, 'Email is required')

  const { data: userData } = await supabase.auth.getUser()

  const redirectToUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL : 'http://127.0.0.1:3000'

  if (userData.user?.is_anonymous) {
    const { error: updateEmailError } = await supabase.auth.updateUser({
      email
    })

    if (updateEmailError) {
      return encodedRedirect('error', LOGIN, `Email linking failed: ${updateEmailError.message}`)
    }

    return encodedRedirect('success', LOGIN, 'Please check your email to verify and complete your account setup.', {
      signup: 'true'
    })
  }

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

  const redirectToUrl = constructUrlWithParams(`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, {
    next: encodeURIComponent(ref)
  })

  const { data: userData } = await supabase.auth.getUser()

  if (userData.user?.is_anonymous) {
    const { data, error } = await supabase.auth.linkIdentity({
      provider,
      options: {
        redirectTo: redirectToUrl
      }
    })

    if (error) {
      return encodedRedirect('error', LOGIN, `OAuth linking failed: ${error.message}`)
    }

    if (data.url) {
      revalidatePath(data.url, 'layout')

      return redirect(data.url)
    }

    return encodedRedirect('error', LOGIN, 'No redirect URL from provider.')
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectToUrl
    }
  })

  if (error) return encodedRedirect('error', LOGIN, error.message)

  if (data.url) {
    revalidatePath(data.url, 'layout')

    return redirect(data.url)
  }

  return encodedRedirect('error', LOGIN, 'No redirect URL from provider.')
}
