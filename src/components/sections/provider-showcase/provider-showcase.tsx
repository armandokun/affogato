import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip/tooltip";

const PROVIDERS = [
  {
    name: "OpenAI",
    available: true,
  },
  {
    name: "Google",
    available: true,
  },
  {
    name: "Anthropic",
    available: true,
  },
  {
    name: "Meta",
    available: false,
  },
  {
    name: "Mistral",
    available: false,
  },
  {
    name: "Perplexity",
    available: false,
  },
  {
    name: "DeepSeek",
    available: false,
  },
  {
    name: "Groq",
    available: false,
  },
];

const ProviderShowcase = () => {
  return (
    <section id="companies">
      <div className="container mx-auto">
        <h3 className="text-center text-sm font-semibold text-gray-500 uppercase">
          Supported Large Language Model Providers
        </h3>
        <div className="relative mt-10 w-full flex justify-center px-4">
          <div className="gap-x-8 px-4 flex flex-wrap justify-center md:gap-x-16 gap-y-11 py-9 lg:gap-x-[5.625rem] lg:px-12 w-full">
            {PROVIDERS.map((provider) =>
              provider.available ? (
                <Image
                  key={provider.name}
                  src={`/provider-icons/${provider.name.toLowerCase()}.png`}
                  alt={provider.name}
                  width={128}
                  height={48}
                  className={cn("w-32 h-12 object-contain brightness-0 invert")}
                />
              ) : (
                <Tooltip key={provider.name} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Image
                      src={`/provider-icons/${provider.name.toLowerCase()}.png`}
                      alt={provider.name}
                      width={128}
                      height={48}
                      className={cn(
                        "w-32 h-12 object-contain brightness-0 invert opacity-50"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    Coming soon
                  </TooltipContent>
                </Tooltip>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderShowcase;
