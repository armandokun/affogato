import { redirect } from 'next/navigation'
import { SearchParams } from 'next/dist/server/request/search-params'

import { getServerSession } from '@/lib/auth'
import { DASHBOARD } from '@/constants/routes'
import LoginSection from '@/components/sections/login-section'
import LoginTestimonialSection from '@/components/sections/login-testimonial-section'
import { Message } from '@/components/general/form-message/form-message'

const LoginPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const user = await getServerSession()
  const params = await searchParams

  let formMessage: Message | undefined

  const successParam = params.success
  const errorParam = params.error

  if (successParam) {
    formMessage = { success: Array.isArray(successParam) ? successParam[0] : successParam }
  } else if (errorParam) {
    formMessage = { error: Array.isArray(errorParam) ? errorParam[0] : errorParam }
  }

  const signup = params?.signup as string | undefined

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
