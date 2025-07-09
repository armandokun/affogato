import Marquee from '@/components/ui/marquee'
import Image from 'next/image'

const companies = [
  { name: 'ChatGPT', subtitle: 'General use' },
  { name: 'Claude', subtitle: 'Creativity' },
  { name: 'Gemini', subtitle: 'Data & Research' },
  { name: 'Grok', subtitle: 'Truth Seeking' },
  { name: 'DeepSeek', subtitle: 'Coding' },
  { name: 'Perplexity', subtitle: 'Research' }
]

const ExtendedUspSection = () => {
  return (
    <section id="companies" className="pt-14">
      <div className="container mx-auto">
        <h3 className="text-center text-sm font-semibold text-gray-500 uppercase">And more</h3>
        <div className="relative">
          <Marquee className="max-w-full [--duration:40s]">
            {companies.map((company, idx) => (
              <div key={idx} className="flex flex-col items-center px-6 py-4 min-w-[120px]">
                <Image
                  src={`/provider-icons/${company.name}.png`}
                  className="h-12 w-30 object-contain brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300 mb-2"
                  alt={company.name}
                  width={100}
                  height={100}
                />
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-400 uppercase">
                    For {company.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-white to-transparent dark:from-black"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-white to-transparent dark:from-black"></div>
        </div>
      </div>
    </section>
  )
}

export default ExtendedUspSection
