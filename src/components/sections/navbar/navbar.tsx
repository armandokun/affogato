'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll } from 'motion/react'

import { cn } from '@/lib/utils'
import Icons from '@/components/general/icons'
import NavMenu from '@/components/general/nav-menu'

const Navbar = () => {
  const [hasScrolled, setHasScrolled] = useState(false)

  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setHasScrolled(latest > 10)
    })

    return unsubscribe
  }, [scrollY])

  return (
    <header
      className={cn(
        'sticky z-50 flex justify-center transition-all duration-300 container mx-auto',
        hasScrolled ? 'top-6' : 'top-4'
      )}>
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: hasScrolled ? '95%' : '100%' }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
        <div
          className={cn(
            'mx-auto max-w-7xl rounded-2xl transition-all duration-300  xl:px-0',
            hasScrolled ? 'border border-border backdrop-blur-lg bg-background/75' : 'shadow-none'
          )}>
          <div
            className={cn(
              'flex h-[56px] items-center justify-between py-4',
              hasScrolled ? 'px-4' : 'px-0'
            )}>
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="size-7 md:size-8" />
              <p className="text-lg font-semibold text-primary">Affogato</p>
            </Link>

            <NavMenu />

            <div className="flex flex-row items-center gap-1 md:gap-3 shrink-0">
              <div className="flex items-center space-x-6">
                <Link
                  href="/login"
                  className="h-10 flex items-center justify-center w-24 px-5 text-sm font-normal tracking-wide text-primary rounded-full transition-all ease-out active:scale-95 bg-background border border-[#27272A] hover:bg-background/80">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  )
}

export default Navbar
