'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { StarFilledIcon } from '@radix-ui/react-icons'

import AnimatedLlmList from '@/components/general/animated-llm-list'
import AnimatedGradientBackground from '@/components/general/animated-gradient-background'
import Icons from '@/components/general/icons'

const llmListVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }
}

const headingVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }
}

const descriptionVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } }
}

const buttonVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.5 } }
}

type Props = {
  currency: 'usd' | 'eur'
}

const HeroSection = ({ currency }: Props) => {
  return (
    <section id="hero" className="flex items-center justify-center mt-4">
      <div className="relative w-full h-[85vh] rounded-3xl overflow-hidden flex items-center justify-center">
        <AnimatedGradientBackground containerClassName="size-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center w-full px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={llmListVariants}
              className="w-full flex justify-center">
              <AnimatedLlmList />
            </motion.div>
            <div className="relative z-10 max-w-3xl mx-auto h-full w-full flex flex-col gap-10 items-center justify-center">
              <motion.div initial="hidden" animate="visible" variants={headingVariants}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center text-primary">
                  <span>All AI models, for a lower price</span>
                  <span className="block">than ChatGPT Plus</span>
                </h1>
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={descriptionVariants}>
                <p className="text-base md:text-lg text-center text-muted-foreground text-balance leading-relaxed tracking-tight">
                  Stop paying for multiple subscriptions. <br />
                  Access all top models from {currency === 'usd' ? '$' : '€'}
                  12/mo.
                </p>
              </motion.div>
              <motion.div initial="hidden" animate="visible" variants={buttonVariants}>
                <div className="flex items-center gap-2.5 flex-wrap justify-center">
                  <Link
                    href="#pricing"
                    className="bg-secondary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-secondary-foreground w-32 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95">
                    Buy Now
                  </Link>
                </div>
                <div className="flex items-center mt-4">
                  <Icons.leftLaurel className="size-10 invert brightness-0" />
                  <div className="flex flex-col items-center mx-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarFilledIcon key={i} className="size-4 text-yellow-400" />
                      ))}
                      <span className="ml-1 text-white text-base font-medium">4.8</span>
                    </div>
                    <span className="text-white text-sm font-normal leading-tight mt-1">
                      Join 50,000+ Users
                    </span>
                  </div>
                  <Icons.rightLaurel className="size-10 invert brightness-0" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
