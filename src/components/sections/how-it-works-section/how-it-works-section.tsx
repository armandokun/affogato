import { Fragment } from 'react'

const HowItWorksSection = () => {
  const BrowserMockup = ({ type }: { type: string | null }) => {
    if (type === null) return null

    return (
      <div className="relative size-72">
        {/* Browser Window */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 w-full h-full flex flex-col">
          {/* Browser Header */}
          <div className="bg-gray-700 px-4 py-3 flex items-center gap-2 flex-shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 flex-1 overflow-hidden">
            {type === 'signup' && (
              <div className="space-y-4">
                {/* Search bar */}
                <div className="flex items-center gap-3 p-3 bg-gray-600 rounded-lg">
                  <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 h-4 bg-gray-500 rounded"></div>
                </div>
                {/* Content preview */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-12 bg-gray-600 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === 'chat' && (
              <div className="space-y-4">
                {/* Mobile-like interface */}
                <div className="space-y-3">
                  <div className="bg-gray-700 p-4 rounded-lg relative">
                    <div className="h-3 bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-2/3 mb-4"></div>
                    {/* Swipe indicators */}
                    <div className="flex justify-between items-center">
                      <div className="w-8 h-8 border-2 border-red-500 rounded-full flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-red-500"></div>
                      </div>
                      <div className="w-8 h-8 border-2 border-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-2 border-b-2 border-r-2 border-green-500 rotate-45 -mt-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {type === 'switch' && (
              <div className="space-y-4">
                {/* Editor interface */}
                <div className="space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>

                  {/* Editing tools */}
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg mt-4">
                    <div className="flex gap-2">
                      <div className="w-8 h-6 bg-blue-600 rounded"></div>
                      <div className="w-8 h-6 bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    {
      title: 'Sign up once.',
      description:
        'Create one account and immediately access ChatGPT, Claude, Gemini, and more - no separate logins needed.',
      mockupType: 'signup'
    },
    {
      title: 'Pick your AI and chat.',
      description: 'Select the best AIs from the dropdown, and get your answer instantly.',
      mockupType: 'chat'
    },
    {
      title: 'Pay one flat monthly fee.',
      description: 'Get rid of extra subscriptions. Pay a single one for all AI models.',
      mockupType: 'switch'
    }
  ]

  return (
    <section id="how-it-works">
      <div className="container mx-auto w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 pb-10">
          <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter text-center">
            How Affogato works?
          </h2>
          <p className="text-gray-400 text-center">Easier than you think.</p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="grid grid-cols-[15%_1fr] gap-4">
              {steps.map((step, index) => (
                <Fragment key={index}>
                  {/* Step number with connecting line */}
                  <div className="flex flex-col items-center">
                    {/* Step number circle */}
                    <div className="flex-shrink-0 text-center relative z-10">
                      <span className="text-white text-lg font-medium flex items-center justify-center w-8 h-8 bg-black rounded-full mb-4">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-[2px] flex-1 bg-gradient-to-b from-[#2979FF] via-[#FF80AB] to-[#FF6D00] mt-0 min-h-[320px]"></div>
                    )}
                  </div>

                  <div className="mb-20">
                    <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-base mb-6">{step.description}</p>
                    <BrowserMockup type={step.mockupType} />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-[10%_1fr_1fr] max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <Fragment key={index}>
                {/* Step number with connecting line */}
                <div className="flex flex-col items-center mb-4">
                  {/* Step number circle */}
                  <div className="flex-shrink-0 text-center relative z-10">
                    <span className="text-white text-lg md:text-3xl font-medium flex items-center justify-center mb-4">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Connecting line to next step */}
                  {index < steps.length - 1 && (
                    <div className="w-[2px] flex-1 bg-gradient-to-b from-[#2979FF] via-[#FF80AB] to-[#FF6D00] mt-0 min-h-[400px]"></div>
                  )}
                </div>

                {/* Title and description */}
                <div className="flex flex-col mb-10 mr-10">
                  <h3 className="text-lg md:text-3xl font-medium text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-base md:text-md">{step.description}</p>
                </div>

                {/* Browser mockup */}
                <div className="mb-20 mx-auto">
                  <BrowserMockup type={step.mockupType} />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
