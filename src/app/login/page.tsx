import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/auth'
import LoginSection from '@/components/sections/login-section'
import LoginTestimonialSection from '@/components/sections/login-testimonial-section'
import { Message } from '@/components/general/form-message/form-message'
import { DASHBOARD } from '@/constants/routes'

const LoginPage = async ({ searchParams }: { searchParams: Promise<Message> }) => {
  const user = await getServerSession()
  const formMessage = await searchParams

  if (user) redirect(DASHBOARD)

  return (
    <div className="flex-row flex items-stretch justify-center bg-background min-h-screen">
      <div className="w-full lg:w-1/2">
        <LoginSection formMessage={formMessage} />
      </div>
      <LoginTestimonialSection />
    </div>
  )
}

export default LoginPage
