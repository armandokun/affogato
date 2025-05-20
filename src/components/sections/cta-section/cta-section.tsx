import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import Icons from "@/components/general/icons";
import Button from "@/components/ui/button";
import { LOGIN } from "@/constants/routes";

const CtaSection = () => {
  return (
    <section id="cta" className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          {/* Logo: Top on mobile, right on desktop */}
          <div className="flex justify-center md:justify-end md:w-1/2 md:order-2">
            <Icons.logo className="size-50 md:size-80" />
          </div>
          {/* Text and CTA: Bottom on mobile, left on desktop */}
          <div className="flex flex-col items-center md:items-start md:w-1/2 text-center md:text-left md:order-1">
            <h2 className="text-4xl font-medium mb-4 text-balance max-w-3xl tracking-tighter">
              Try Affogato Now
            </h2>
            <Link href={LOGIN}>
              <Button className="bg-secondary text-primary hover:bg-secondary/80">
                Get Started <ArrowTopRightIcon className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
