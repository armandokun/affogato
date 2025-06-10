import Image from "next/image";
import { CheckCircle } from "lucide-react";

import Badge from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselControls,
} from "@/components/ui/carousel/carousel";
import { Card } from "@/components/ui/card";

const MODELS = [
  {
    icon: "chatgpt",
    provider: "OpenAI",
    name: "ChatGPT o3",
    oneliner: "For complex/important problem solving.",
    description:
      "Excels at breaking down complex problems step-by-step. Perfect for research, strategic planning, and tasks requiring deep logical reasoning.",
    available: true,
    badges: ["Deep reasoning", "Multi-step problems"],
  },
  {
    icon: "claude",
    provider: "Anthropic",
    name: "Claude Sonnet 4.0",
    oneliner: "For creative and general tasks.",
    description:
      "Balances creativity with thoughtful analysis. Best for writing projects, brainstorming, coding assistance, and conversations requiring nuanced understanding.",
    available: true,
    badges: ["Natural conversation", "Nuanced writing"],
  },
  {
    icon: "gemini",
    provider: "Google",
    name: "Gemini 2.5 Flash",
    oneliner: "Ideal for document/data analysis.",
    description:
      "Processes large amounts of information quickly. Ideal for document summarization, data analysis, and when you need fast insights from lengthy content.",
    available: true,
    badges: ["Document analysis", "Real-time processing"],
  },
  {
    icon: "chatgpt",
    provider: "OpenAI",
    name: "ChatGPT 4o",
    oneliner: "Reliable choice for most everyday tasks.",
    description:
      "Well-balanced model that handles writing, analysis, and problem-solving efficiently. Your go-to option for general productivity and creative work.",
    available: true,
    badges: ["Balanced", "Versatile", "Friendly"],
  },
  {
    icon: "claude",
    provider: "Anthropic",
    name: "Sonnet 4 Thinking",
    oneliner: "Shows step-by-step reasoning process.",
    description:
      "Transparent problem-solving that walks you through its thinking. Ideal when you need to understand the logic behind complex answers or learn from the process.",
    available: true,
    badges: ["Step-by-step", "Transparent", "Educational"],
  },
  {
    icon: "grok",
    provider: "xAI",
    name: "Grok 3 Mini",
    oneliner: "Quick answers and casual chat.",
    description:
      "Fast and lightweight responses for casual conversations and simple tasks. Perfect when you need something quick without the complexity.",
    available: true,
    badges: ["Quick", "Casual", "Lightweight"],
  },
];

const ProviderShowcase = () => {
  return (
    <section id="companies">
      <div className="container mx-auto">
        <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter text-center">
          Available AI models
        </h2>
        <p className="text-gray-400 text-center">
          And that&apos;s just the tip of the iceberg.
        </p>
        <div className="relative mt-10 w-full flex justify-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/5 bg-gradient-to-r from-black z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/5 bg-gradient-to-l from-black z-10"></div>
          <Carousel
            opts={{ align: "center", loop: true }}
            className="w-full max-w-screen md:max-w-max"
          >
            <CarouselContent className="select-none">
              {MODELS.map((model) => (
                <CarouselItem
                  key={model.name}
                  className="basis-[350px] md:basis-1/2 lg:basis-1/3 flex-shrink-0"
                >
                  <Card
                    key={model.name}
                    className="rounded-xl p-6 flex flex-col min-h-[400px]"
                  >
                    <div className="rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/20 size-16">
                      <Image
                        src={`/llm-icons/${model.icon}.png`}
                        alt={model.name}
                        width={40}
                        height={40}
                        className="object-contain size-10"
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      {model.provider}
                    </div>
                    <div className="text-lg font-medium mb-1">{model.name}</div>
                    <div className="flex flex-row gap-2 flex-wrap">
                      {model.badges.map((badge) => (
                        <Badge variant="outline" key={badge}>
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <div className="w-full mt-6 font-medium">
                      {model.oneliner}
                    </div>
                    <ul className="w-full mt-2 space-y-2">
                      {(model.description.match(/[^.]+\./g) || []).map(
                        (sentence, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-300"
                          >
                            <CheckCircle
                              className="text-green-400 mt-0.5 size-4 shrink-0"
                              size={16}
                            />
                            <span>{sentence.trim()}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselControls />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ProviderShowcase;
