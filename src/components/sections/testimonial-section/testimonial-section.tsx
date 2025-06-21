import { TESTIMONIALS } from '@/constants/testimonials'
import SocialProofTestimonials from '@/components/general/testimonial-scroll'

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="flex flex-col items-center justify-center w-full">
      <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter text-center">
        Built by AI geeks to unleash its power to all.
      </h2>
      <p className="text-gray-400 text-center">
        With 50,000+ customers already using Affogato, we&apos;re confident that you&apos;ll love it
        too.
      </p>
      <SocialProofTestimonials testimonials={TESTIMONIALS} />
    </section>
  )
}

export default TestimonialSection
