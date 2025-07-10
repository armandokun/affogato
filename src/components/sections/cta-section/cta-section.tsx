import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import Icons from '@/components/general/icons'
import Button from '@/components/ui/button'
import { LOGIN } from '@/constants/routes'

const CtaSection = () => {
  return (
    <section id="cta" className="w-full max-w-4xl mx-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          <div className="flex justify-center md:justify-end md:w-1/2 md:order-2">
            <Icons.logo className="size-50 md:size-80" />
          </div>
          <div className="flex flex-col items-center md:items-start md:w-1/2 text-center md:text-left md:order-1">
            <h2 className="text-4xl font-medium mb-4 text-balance max-w-3xl tracking-tighter">
              Ready to ditch multiple subscriptions?
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-4 ">
              <Link href={LOGIN}>
                <Button className="bg-secondary text-primary hover:bg-secondary/80">
                  Buy now <ArrowTopRightIcon className="size-4" />
                </Button>
              </Link>
              <p className="text-muted-foreground text-sm font-normal leading-tight flex items-center gap-1">
                <span className="text-muted-foreground text-sm font-normal leading-tight">
                  14-day money back guarantee. <br /> Cancel anytime.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
