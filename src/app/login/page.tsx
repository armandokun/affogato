import { redirect } from 'next/navigation'
import { SearchParams } from 'next/dist/server/request/search-params'

import { getServerSession } from '@/lib/auth'
import LoginSection from '@/components/sections/login-section'
import LoginTestimonialSection from '@/components/sections/login-testimonial-section'
import { Message } from '@/components/general/form-message/form-message'
import { DASHBOARD } from '@/constants/routes'

const LoginPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const user = await getServerSession()
  const params = await searchParams

  const formMessage: Message | undefined = params?.message || params.error || params.success

  const signup = params?.signup as string | undefined
  const sessionId = params?.session_id as string | undefined

  if (user) redirect(DASHBOARD)

  return (
    <div className="flex-row flex items-stretch justify-center bg-background min-h-screen">
      <div className="w-full lg:w-1/2">
        <LoginSection formMessage={formMessage} showSignup={signup === 'true'} />
      </div>
      <LoginTestimonialSection />
    </div>
  )
}

export default LoginPage
