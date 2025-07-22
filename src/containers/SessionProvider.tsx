'use client'

import { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import { User } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/client'

export type SessionContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log({ event, session })

      if (event === 'SIGNED_OUT') setUser(null)
      else if (session?.user) setUser(session.user)

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SessionContext.Provider value={{ user, loading, setUser }}>{children}</SessionContext.Provider>
  )
}

const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }

  return context
}

export { SessionProvider, useSession }
