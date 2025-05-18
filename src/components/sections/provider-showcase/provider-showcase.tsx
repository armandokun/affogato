import Image from "next/image";

import Marquee from "@/components/ui/marquee";

const providers = [
  "OpenAI",
  "Google",
  "Anthropic",
  "Meta",
  "Mistral",
  "Perplexity",
  "DeepSeek",
];

const ProviderShowcase = () => {
  return (
    <section id="companies" className="py-20">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="text-center text-sm font-semibold text-gray-500 uppercase">
            Supported Large Language Model Providers
          </h3>
          <div className="relative mt-6">
            <Marquee className="max-w-full [--duration:40s]">
              {providers.map((logo, idx) => (
                <Image
                  key={idx}
                  src={`/provider-icons/${logo}.png`}
                  className="h-10 w-28 object-contain brightness-0 invert"
                  alt={logo}
                  width={100}
                  height={30}
                />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-black"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-black"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderShowcase;
