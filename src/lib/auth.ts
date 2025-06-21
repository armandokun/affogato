import { redirect } from 'next/navigation'

import { createClient } from './supabase/server'

export const getServerSession = async () => {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()

  return data?.user
}

export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string,
  params?: Record<string, string>
) {
  const queryString = new URLSearchParams(params).toString()
  return redirect(`${path}?${type}=${encodeURIComponent(message)}&${queryString}`)
}
