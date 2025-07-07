import Marquee from '@/components/ui/marquee'

const companies = ['ChatGPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'Perplexity']

const ExtendedUspSection = () => {
  return (
    <section id="companies">
      <div className="py-14">
        <div className="container mx-auto">
          <h3 className="text-center text-sm font-semibold text-gray-500 uppercase">And more</h3>
          <div className="relative mt-6">
            <Marquee className="max-w-full [--duration:40s]">
              {companies.map((logo, idx) => (
                <img
                  key={idx}
                  src={`/provider-icons/${logo}.png`}
                  className="h-15 max-w-40 px-2 object-contain brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300"
                  alt={logo}
                />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-white to-transparent dark:from-black"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-white to-transparent dark:from-black"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExtendedUspSection
