import Image from 'next/image'

import ExtendedUspSection from './extended-usp-section'

const UspSection = () => {
  return (
    <section id="how-it-works" className="flex flex-col items-center justify-center w-full">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter text-center">
          Meet your AI team.
        </h2>
        <p className="text-gray-400 text-center">
          Each one&apos;s great at different things. Pick the right brain for the job.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[1fr_1.5fr] gap-6 mt-10 md:mt-5 w-full">
          {/* Card 1: ChatGPT */}
          <div className="rounded-3xl p-8 bg-gradient-to-b from-[#000000] to-[#be00fe] flex flex-col md:col-span-2 md:flex-row md:items-center gap-8 min-h-[320px]">
            <div className="flex-1 flex flex-col items-start justify-center text-left gap-4">
              <h3 className="text-2xl lg:text-3xl text-white tracking-tight">
                <span className="text-white font-semibold">ChatGPT</span>, plan my
                <br />
                meals for the week.
              </h3>
              <p className="text-white/80 text-base lg:text-md max-w-lg tracking-tight">
                From meals to errands to travel planning, your everyday AI assistant helps you stay
                on top of life with quick, reliable support for whatever&apos;s next.
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center max-w-[300px] mx-auto">
              <Image
                src="/llm-explain-images/chatgpt.png"
                alt="ChatGPT meal planner example"
                width={300}
                height={300}
                className="rounded-xl w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
          {/* Card 2: Claude */}
          <div className="rounded-3xl bg-gradient-to-br from-[#FC7010] to-[#ffb300] flex flex-col min-h-[320px] items-center justify-between">
            <div className="flex flex-col items-start justify-center text-left gap-4 w-full p-8">
              <h3 className="text-2xl lg:text-3xl text-white tracking-tight">
                <span className="text-white font-semibold">Claude</span>, write a creative
                <br />
                social media post.
              </h3>
              <p className="text-white/80 text-base lg:text-md max-w-lg tracking-tight">
                Get smart, tailored writing for scripts, blog posts, brand stories, and more—powered
                by AI that understands your voice and goals.
              </p>
            </div>
            <div className="flex flex-col items-center justify-end w-full max-w-[250px] mx-auto mt-6">
              <Image
                src="/llm-explain-images/claude.png"
                alt="Claude social media post example"
                width={200}
                height={220}
                className="rounded-xl w-full h-auto object-contain"
              />
            </div>
          </div>
          {/* Card 3: Gemini */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-[#2a7cff] to-[#8301e6] flex flex-col min-h-[320px] items-center justify-between">
            <div className="flex flex-col items-start justify-center text-left gap-4 w-full">
              <h3 className="text-2xl lg:text-3xl text-white tracking-tight">
                <span className="text-white font-semibold">Gemini</span>, make sense
                <br />
                of this data.
              </h3>
              <p className="text-white/80 text-base lg:text-md max-w-lg tracking-tight">
                Turn complex spreadsheets into clear insights. Your AI-powered data analyst reads
                your files, finds patterns, and gives you real answers—instantly and intuitively.
              </p>
            </div>
            <div className="flex flex-col items-center justify-end w-full mx-auto mt-6">
              <Image
                src="/llm-explain-images/gemini.png"
                alt="Gemini spreadsheet analysis example"
                width={220}
                height={100}
                className="rounded-xl w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
        <ExtendedUspSection />
      </div>
    </section>
  )
}

export default UspSection
