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
      "Almost! Affogato gives you the same easy-to-use chat interface but instead of just ChatGPT, you can chat with the top AI models in the world from ChatGPT, Claude, Gemini, and dozens of others. Give you the ultimate fleet of AI models at your disposal. The only difference is that Affogato only supports messages, with image generation coming soon.",
  },
  {
    question: "How is this the same price as ChatGPT?",
    answer:
      "That’s a great question! Some people might think “this is too good to be true!” The truth is, we have a developer relationship with all of the AI vendors through something called an API. Every time a user generates a message, we get billed for that usage. Our pricing plans are designed in such a way to maximize the amount of usage without costing us more than you’re paying. This is how we are able to give open access to all AI models for a flat monthly fee.",
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
      "You can use Affogato for 20 messages a day for free, if you need more, feel free to upgrade. If you're not happy with our product, we do offer a generous 30-day money back guarantee. If you give Affogato a genuine test run and haven’t found it useful in the first 30 days, we’ll refund your payment no questions asked.",
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

const FaqSection = () => {
  return (
    <section
      id="faq"
      className="max-w-2xl w-full mx-auto overflow-x-hidden min-w-0"
    >
      <div className="container mx-auto px-4 py-16 max-w-2xl w-full overflow-x-hidden min-w-0">
        <div className="text-center space-y-4 py-6 mx-auto max-w-2xl w-full min-w-0">
          <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="w-full max-w-2xl mx-auto min-w-0 overflow-x-hidden">
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-2xl mx-auto min-w-0"
          >
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left break-words">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="break-words">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="text-center text-sm mt-6">
          Still have questions? <br /> Email us at{" "}
          <a href={`mailto:${siteConfig.links.mail}`} className="underline">
            {siteConfig.links.mail}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
