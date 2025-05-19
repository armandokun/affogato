import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion/accordion";
import { siteConfig } from "@/lib/config";

const FAQS = [
  {
    question: "Is Affogato the same as ChatGPT?",
    answer:
      "Yes! But better. Affogato gives you the same easy-to-use chat interface but instead of just ChatGPT, you can chat with the top AI models in the world from ChatGPT, Claude, Gemini, and dozens of others. Give you the ultimate fleet of AI models at your disposal.",
  },
  {
    question: "How is this the same price as ChatGPT?",
    answer:
      "That’s a great question! Some people might think “this is too good to be true!” The truth is, we have a developer relationship with all of the AI vendors through something called an API. Every time a user generates a message something we get billed for that usage. Our pricing plans are designed in such a way to maximize the amount of usage without costing us more than you’re paying. This is how we are able to give open access to all AI models for a flat monthly fee.",
  },
  {
    question: "Do I need a ChatGPT account to use Affogato?",
    answer:
      "Nope! Affogato is a standalone app that gives you the full power of ChatGPT inside of a beautiful interface with additional features that you can’t get with OpenAI’s native ChatGPT app.",
  },
  {
    question: "What AI models are available in Affogato?",
    answer:
      "Currently Affogato gives all users access to the leading AI chat models. It includes the latest models from ChatGPT, Claude, Gemini, Perplexity and more.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Currently Affogato does not offer a free trial. However we do offer a generous 30-day money back guarantee. If you give Affogato a genuine test run and haven’t found it useful in the first 30 days, we’ll refund your payment no questions asked.",
  },
  {
    question: "How often does Affogato update the AI models available?",
    answer:
      "We’re keeping a close eye on everything happening in the fast-paced AI space. When a model we support releases an upgrade, we’ll be implementing it as quickly as possible—typically within a day—so Affogato users will always be on the cutting edge.",
  },
  {
    question: "Are there any limits on usage?",
    answer:
      "All plans have limits on usage except for the Unlimited plan. The Unlimited plan is a flat monthly fee that gives you access to all AI models and features without any limits.",
  },
  {
    question: "What happens if I reach my plan’s message limit?",
    answer:
      "If you reach your plan’s message limit, you can upgrade to the Unlimited plan to continue using Affogato without any limits.",
  },
];

export default function FAQ() {
  return (
    <section id="faq">
      <h2 className="text-4xl font-semibold text-center my-6">FAQ</h2>
      <div className="min-w-[50vw]">
        <Accordion
          type="single"
          collapsible
          className="px-10 w-full max-w-2xl mx-auto py-10"
        >
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
        Still have questions? <br />
        Email us at{" "}
        <a href={`mailto:${siteConfig.links.email}`} className="underline">
          {siteConfig.links.email}
        </a>
      </h4>
    </section>
  );
}
