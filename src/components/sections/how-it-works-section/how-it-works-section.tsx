import Image from 'next/image'
import { Fragment } from 'react'
import { Trash2, Check, ChevronDown, Send, User } from 'lucide-react'

const PROVIDER_ICONS = ['chatgpt.png', 'claude.png', 'gemini.png', 'grok.png', 'meta.png']

const SUBSCRIPTION_PROVIDERS = [
  { id: 'chatgpt', icon: '/llm-icons/chatgpt.png', name: 'ChatGPT Plus' },
  { id: 'claude', icon: '/llm-icons/claude.png', name: 'Claude Pro' },
  { id: 'gemini', icon: '/llm-icons/gemini.png', name: 'Gemini Advanced' }
]

const STEPS = [
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

const TrashIcon = () => <Trash2 className="w-4 h-4 text-red-400" />
const CheckIcon = () => <Check className="w-3 h-3 text-green-400" />
const ChevronDownIcon = () => <ChevronDown className="w-4 h-4 text-gray-400" />
const SendIcon = () => <Send className="w-3 h-3 text-white" />

const SignupMockup = () => (
  <div className="relative flex items-center justify-center h-full">
    <div className="relative w-40 h-40">
      {/* Central user avatar */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[#2979FF] via-[#FF80AB] to-[#FF6D00] rounded-full flex items-center justify-center shadow-lg z-10">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-gray-600" />
        </div>
      </div>

      {/* Provider icons in circular arrangement */}
      {PROVIDER_ICONS.map((icon, index) => {
        const angle = (index * 360) / PROVIDER_ICONS.length
        const radius = 70
        const x = Math.cos(((angle - 90) * Math.PI) / 180) * radius
        const y = Math.sin(((angle - 90) * Math.PI) / 180) * radius

        const isDarkIcon = icon === 'grok.png'
        const bgClass = isDarkIcon ? 'bg-gray-800' : 'bg-white'
        const borderClass = isDarkIcon ? 'border-gray-600' : 'border-gray-200'

        return (
          <div
            key={icon}
            className={`absolute w-8 h-8 ${bgClass} rounded-lg p-1 shadow-md border ${borderClass} z-10`}
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
            }}>
            <Image
              src={`/llm-icons/${icon}`}
              alt={icon}
              className="w-full h-full object-contain"
              width={32}
              height={32}
            />
          </div>
        )
      })}
    </div>

    {/* Connecting lines animation effect */}
    <div className="absolute inset-0 flex items-center justify-center z-0">
      <div className="w-32 h-32 border border-dashed border-gray-500 rounded-full opacity-30 animate-pulse"></div>
    </div>
  </div>
)

const ChatBubble = ({ isUser, children }: { isUser: boolean; children: React.ReactNode }) => {
  const alignment = isUser ? 'justify-end' : 'justify-start'
  const bgColor = isUser ? 'bg-blue-600' : 'bg-gray-700'
  const roundedCorner = isUser ? 'rounded-br-md' : 'rounded-bl-md'

  return (
    <div className={`flex ${alignment}`}>
      <div
        className={`${bgColor} text-white p-4 rounded-2xl ${roundedCorner} min-w-[60%] max-w-[90%] shadow-sm`}>
        {children}
      </div>
    </div>
  )
}

const ChatMockup = () => (
  <div className="h-full flex flex-col gap-3">
    {/* AI Model Dropdown */}
    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl border border-gray-600">
      <div className="flex items-center gap-3">
        <img src="/llm-icons/chatgpt.png" alt="ChatGPT" className="w-5 h-5 object-contain" />
        <span className="text-xs text-gray-300 font-medium">ChatGPT</span>
      </div>
      <ChevronDownIcon />
    </div>

    {/* Chat Messages Area */}
    <div className="flex-1 space-y-4 p-2">
      <ChatBubble isUser={true}>
        <div className="space-y-2">
          <div className="bg-blue-500/30 h-3 rounded w-full"></div>
          <div className="bg-blue-500/30 h-3 rounded w-4/5"></div>
          <div className="bg-blue-500/30 h-3 rounded w-3/5"></div>
        </div>
      </ChatBubble>

      <ChatBubble isUser={false}>
        <div className="space-y-2">
          <div className="bg-gray-600 h-3 rounded w-full"></div>
          <div className="bg-gray-600 h-3 rounded w-5/6"></div>
          <div className="bg-gray-600 h-3 rounded w-3/4"></div>
          <div className="bg-gray-600 h-3 rounded w-4/5"></div>
          <div className="bg-gray-600 h-3 rounded w-2/3"></div>
        </div>
      </ChatBubble>
    </div>

    {/* Input Area */}
    <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-xl border border-gray-600">
      <div className="flex-1 bg-gray-600 h-3 rounded-full"></div>
      <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
        <SendIcon />
      </div>
    </div>
  </div>
)

const ProviderRow = ({ provider }: { provider: (typeof SUBSCRIPTION_PROVIDERS)[0] }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg flex-1">
      <div className="flex items-center gap-3">
        <img src={provider.icon} alt={provider.name} className="w-5 h-5 object-contain" />
        <span className="text-xs text-gray-400">{provider.name}</span>
      </div>
      <span className="text-xs text-gray-400">$$</span>
    </div>
    <div className="w-8 h-8 flex items-center justify-center bg-red-500/20 rounded-lg">
      <TrashIcon />
    </div>
  </div>
)

const SwitchMockup = () => (
  <div className="space-y-3 h-full flex flex-col p-2">
    {/* Provider subscription list */}
    <div className="flex-1 space-y-3">
      {SUBSCRIPTION_PROVIDERS.map((provider) => (
        <ProviderRow key={provider.id} provider={provider} />
      ))}
    </div>

    {/* Affogato - successful payment */}
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#2979FF]/20 via-[#FF80AB]/20 to-[#FF6D00]/20 rounded-lg border border-green-500/50">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Affogato.chat logo"
          className="object-contain"
          width={20}
          height={20}
        />
        <span className="text-xs text-green-400 font-medium">Affogato</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-green-400 font-medium">$15</span>
        <div className="w-3 h-3 text-green-400">
          <CheckIcon />
        </div>
      </div>
    </div>
  </div>
)

const BrowserMockup = ({ type }: { type: string | null }) => {
  if (type === null) return null

  const mockupContent = {
    signup: <SignupMockup />,
    chat: <ChatMockup />,
    switch: <SwitchMockup />
  }[type]

  return (
    <div className="relative size-72">
      <div className="bg-background rounded-lg shadow-xl overflow-hidden border border-border w-full h-full flex flex-col">
        {/* Browser Header */}
        <div className="bg-accent px-4 py-3 flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
        </div>
        {/* Content Area */}
        <div className="p-4 flex-1 overflow-hidden">{mockupContent}</div>
      </div>
    </div>
  )
}

const StepLayout = ({
  children,
  isDesktop
}: {
  children: React.ReactNode
  isDesktop?: boolean
}) => {
  if (isDesktop) {
    return (
      <div className="hidden md:grid md:grid-cols-[10%_1fr_1fr] max-w-4xl mx-auto">{children}</div>
    )
  }
  return (
    <div className="block md:hidden">
      <div className="grid grid-cols-[15%_1fr] gap-4">{children}</div>
    </div>
  )
}

const HowItWorksSection = () => {
  const renderStep = (step: (typeof STEPS)[0], index: number, isDesktop = false) => (
    <Fragment key={index}>
      {/* Step number with connecting line */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex-shrink-0 text-center relative z-10">
          <span
            className={`text-white font-medium flex items-center justify-center mb-4 ${
              isDesktop ? 'text-lg md:text-3xl' : 'text-lg w-8 h-8 bg-black rounded-full'
            }`}>
            {(index + 1).toString().padStart(2, '0')}
          </span>
        </div>
        {index < STEPS.length - 1 && (
          <div
            className={`w-[2px] flex-1 bg-gradient-to-b from-[#2979FF] via-[#FF80AB] to-[#FF6D00] mt-0 ${
              isDesktop ? 'min-h-[400px]' : 'min-h-[320px]'
            }`}></div>
        )}
      </div>

      {/* Content wrapper for mobile - combines title/description and mockup */}
      {isDesktop ? (
        <>
          {/* Title and description */}
          <div className="flex flex-col mb-10 mr-10">
            <h3 className="font-medium text-white mb-4 text-lg md:text-3xl">{step.title}</h3>
            <p className="text-gray-400 text-base md:text-md">{step.description}</p>
          </div>

          {/* Browser mockup */}
          <div className="mb-20 mx-auto">
            <BrowserMockup type={step.mockupType} />
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          {/* Title and description */}
          <div className="flex flex-col mb-6">
            <h3 className="font-medium text-white mb-3 text-xl">{step.title}</h3>
            <p className="text-gray-400 text-base mb-6">{step.description}</p>
          </div>

          {/* Browser mockup */}
          <div className="mb-20">
            <BrowserMockup type={step.mockupType} />
          </div>
        </div>
      )}
    </Fragment>
  )

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
          <StepLayout>{STEPS.map((step, index) => renderStep(step, index, false))}</StepLayout>

          {/* Desktop Layout */}
          <StepLayout isDesktop>
            {STEPS.map((step, index) => renderStep(step, index, true))}
          </StepLayout>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
