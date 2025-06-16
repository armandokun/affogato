import { useEffect, useState } from 'react'

import { useSession } from '@/containers/SessionProvider'
import { createClient } from '@/lib/supabase/client'

export function useSubscription() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { user } = useSession()

  useEffect(() => {
    if (!user?.id) return

    const fetchCurrentPlan = async () => {
      setLoading(true)

      const supabase = createClient()

      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_name')
        .eq('user_id', user.id)
        .single()

      if (error) {
        setError(error)
        setLoading(false)

        return
      }

      setCurrentPlan(data?.plan_name)
      setLoading(false)
    }

    fetchCurrentPlan()
  }, [user?.id])

  return {
    currentPlan,
    loading,
    error
  }
}
