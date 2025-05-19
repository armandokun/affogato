import Image from "next/image";

const providers = [
  "OpenAI",
  "Google",
  "Anthropic",
  "Meta",
  "Mistral",
  "Perplexity",
  "DeepSeek",
  "Groq",
];

const ProviderShowcase = () => {
  return (
    <section id="companies">
      <div className="py-14">
        <div className="container mx-auto">
          <h3 className="text-center text-sm font-semibold text-gray-500 uppercase">
            Supported Large Language Model Providers
          </h3>
          <div className="relative mt-10 w-full flex justify-center px-4">
            <div className="gap-x-8 px-4 flex flex-wrap justify-center md:gap-x-16 gap-y-11 py-9 lg:gap-x-[5.625rem] lg:px-12 w-full">
              {providers.map((logo) => (
                <Image
                  key={logo}
                  src={`/provider-icons/${logo}.png`}
                  alt={logo}
                  width={128}
                  height={48}
                  className="w-32 h-12 object-contain brightness-0 invert"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderShowcase;
