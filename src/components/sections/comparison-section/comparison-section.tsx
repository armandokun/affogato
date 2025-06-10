import Link from "next/link";
import Image from "next/image";

import Card from "@/components/ui/card";
import Icons from "@/components/general/icons";
import { LOGIN } from "@/constants/routes";

const LLM_SUBSCRIPTION_SERVICES = [
  { icon: "chatgpt", name: "ChatGPT Plus", price: "€23/mo" },
  { icon: "claude", name: "Claude Pro", price: "€22/mo" },
  { icon: "gemini", name: "Gemini Advanced", price: "€22/mo" },
  { icon: "grok", name: "xAI SuperGrok", price: "€30/mo" },
];

const total = LLM_SUBSCRIPTION_SERVICES.reduce((sum, s) => {
  const match = s.price.match(/€(\d+)/);

  return sum + (match ? parseInt(match[1], 10) : 0);
}, 0);

const ComparisonSection = () => {
  return (
    <section id="comparison" className="text-center">
      <div className="container">
        <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
          Saving you money, <br />
          all day, everyday.
        </h2>
        <p className="text-gray-400 text-center w-[80%] mx-auto">
          We directly access model APIs, which means we pay the actual cost per
          use, not the subscription markup, and pass those savings to you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-10">
          <Card tilt className="rounded-xl">
            <div className="p-6 flex flex-col h-full w-full justify-between items-center">
              <div className="w-full">
                <h3 className="text-xl font-medium mb-4 text-center">
                  Other AI Subscriptions
                </h3>
                <ul className="text-left w-full space-y-2">
                  {LLM_SUBSCRIPTION_SERVICES.map((service) => (
                    <li
                      key={service.name}
                      className="flex items-center gap-2 justify-between text-base md:text-lg"
                    >
                      <span className="flex items-center gap-2">
                        <Image
                          src={`/llm-icons/${service.icon}.png`}
                          alt={`${service.name} icon`}
                          width={20}
                          height={20}
                          className="size-5 object-contain"
                        />
                        {service.name}
                      </span>
                      <span className="font-medium">{service.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="w-full border-t border-gray-200 my-4" />
                <div className="flex justify-between w-full text-lg font-semibold">
                  <span>Total</span>
                  <span>€{total}/mo</span>
                </div>
              </div>
              <p className="mt-6 text-gray-400 text-sm text-center">
                Separate subscriptions required for each model.
              </p>
            </div>
          </Card>
          <Card tilt className="rounded-xl">
            <div className="p-6 flex flex-col h-full w-full justify-between items-center">
              <div className="flex items-center flex-row gap-1.5 justify-center mb-4">
                <Icons.logo className="size-7" />
                <h3 className="text-xl font-semibold text-primary text-center">
                  Affogato
                </h3>
              </div>
              <div className="w-full flex flex-col items-center justify-center">
                <div className="flex items-end gap-2 mb-2 justify-center">
                  <span className="text-3xl md:text-4xl font-semibold">
                    €15
                  </span>
                  <span className="text-base md:text-lg text-muted-foreground">
                    /mo
                  </span>
                </div>
                <p className="text-base md:text-lg mb-4 text-balance text-center">
                  All models, one price.
                </p>
                <div className="bg-gradient-to-r from-blue-500 via-pink-400 to-orange-400 text-white rounded-full px-4 py-1 text-sm font-semibold mb-2 shadow">
                  Save up to 85%
                </div>
              </div>
              <p className="mt-6 text-gray-400 text-sm text-center">
                Access to all listed models - included in Affogato.
              </p>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-center mt-10">
          <Link
            href={LOGIN}
            className="bg-secondary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-secondary-foreground w-fit px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
          >
            Start New Chat
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
