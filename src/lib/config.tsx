import { cn } from "@/lib/utils";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "p-1 py-0.5 font-medium dark:font-semibold text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
};

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Affogato",
  description: "LLMs in one place. For one subscription price.",
  cta: "Get Started",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://affogato.chat",
  keywords: [
    "LLMs",
    "AI",
    "ChatGPT",
    "Claude",
    "Gemini",
    "Perplexity",
    "AI Chat",
    "AI Chat Models",
  ],
  links: {
    mail: "armandas@affogato.chat",
    instagram: "https://instagram.com/affogato.chat",
  },
  nav: {
    links: [{ id: 1, name: "Home", href: "#hero" }],
  },
};

export type SiteConfig = typeof siteConfig;
