import { Timeline } from '@/components/ui/timeline'

const HowItWorksSection = () => {
  const BrowserMockup = ({ type }: { type: string }) => {
    return (
      <div className="relative max-w-lg ml-auto">
        {/* Browser Window */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Browser Header */}
          <div className="bg-gray-700 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 min-h-[300px]">
            {type === 'signup' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-gray-600 rounded"></div>
                  <div className="flex-1 h-4 bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-blue-900 rounded w-1/3"></div>
                </div>
              </div>
            )}

            {type === 'chat' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  <div className="flex-1 h-4 bg-gray-600 rounded"></div>
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <div className="h-3 bg-blue-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-blue-700 rounded w-2/3"></div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="h-3 bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            )}

            {type === 'switch' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-700 rounded"></div>
                    <div className="h-4 bg-gray-600 rounded w-20"></div>
                  </div>
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-purple-900/20 rounded">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <div className="h-3 bg-purple-700 rounded w-16"></div>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <div className="h-3 bg-gray-600 rounded w-16"></div>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <div className="h-3 bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const timelineData = [
    {
      title: '01 Sign up once',
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xl text-gray-400 leading-relaxed">
              Create one account. No need for separate ChatGPT, Claude, or Gemini subscriptions.
            </p>
          </div>
          <div>
            <BrowserMockup type="signup" />
          </div>
        </div>
      )
    },
    {
      title: '02 Start chatting',
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xl text-gray-400 leading-relaxed">
              Pick any AI from the dropdown. Ask your question like you normally would.
            </p>
          </div>
          <div>
            <BrowserMockup type="chat" />
          </div>
        </div>
      )
    },
    {
      title: '03 One price for all',
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xl text-gray-400 leading-relaxed">
              Not happy with the answer? Switch to a different AI in the same conversation.
            </p>
          </div>
          <div>
            <BrowserMockup type="switch" />
          </div>
        </div>
      )
    }
  ]

  return (
    <section id="how-it-works">
      <Timeline data={timelineData} />
    </section>
  )
}

export default HowItWorksSection
