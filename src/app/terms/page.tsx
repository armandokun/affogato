import { siteConfig } from "@/lib/config";

import Navbar from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer-section/footer-section";

const TermsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <main className="prose prose-invert max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-semibold mb-2">Terms of Service</h1>
        <p className="mb-8 text-muted-foreground">Last Updated: June 6, 2025</p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Introduction</h2>
        <p className="mb-8">
          These Terms of Service (&quot;Terms&quot;) are a legal agreement
          between you and Sobeck MB (&quot;Affogato&quot;, &quot;we&quot;,
          &quot;us&quot;). By using affogato.chat (the &quot;Site&quot;) and our
          services, you agree to these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">What We Do</h2>
        <p className="mb-8">
          Affogato puts multiple large language model providers (like ChatGPT,
          Claude, and Gemini) into one chat interface, so you can use them all
          in one place.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Who Can Use Affogato
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>You must be at least 16 years old.</li>
          <li>You must create an account to use the service.</li>
          <li>There are no other restrictions on who can use Affogato.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Your Content</h2>
        <p className="mb-8">
          You own all text, code, images, and files you upload or create with
          Affogato. We do not claim any rights to your content.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Our Content &amp; Rights
        </h2>
        <p className="mb-8">
          We own all rights to our website, branding, code, and platform
          content. You may not copy, use, or distribute our materials without
          permission.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Acceptable Use</h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>Do not break the law or violate anyone&apos;s rights.</li>
          <li>Do not upload or share illegal, harmful, or abusive content.</li>
          <li>Do not reverse engineer, hack, or abuse the service.</li>
          <li>Do not spam, use bots, or try to disrupt the platform.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Payments &amp; Subscriptions
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>Affogato offers both free and paid subscription plans.</li>
          <li>All payments are non-refundable.</li>
          <li>Subscriptions renew automatically unless you cancel.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Termination</h2>
        <p className="mb-8">
          We may terminate your account if you do not follow these Terms. After
          termination, your data will be kept for 30 days and then either
          anonymized or deleted.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Changes to These Terms
        </h2>
        <p className="mb-8">
          We may update these Terms from time to time. If we do, we will notify
          you by email. Changes take effect when we send the email.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Third-Party Services
        </h2>
        <p className="mb-8">
          Affogato uses third-party AI models (like OpenAI, Google, xAI, and
          Anthropic). We are not responsible for the content or services
          provided by these third parties.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Indemnification</h2>
        <p className="mb-8">
          You agree to protect and indemnify us from any legal claims, damages,
          or costs that arise from your misuse of Affogato, your content, or
          your violation of these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          DMCA &amp; Copyright Complaints
        </h2>
        <p className="mb-8">
          If you believe your copyright has been infringed, please email us at{" "}
          <a
            href={`mailto:${siteConfig.links.mail}`}
            className="text-blue-500 underline"
          >
            {siteConfig.links.mail}
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Data Retention &amp; Deletion
        </h2>
        <p className="mb-8">
          We keep your data for 30 days after account closure, then delete or
          anonymize it. You can request deletion by emailing us.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Beta Features</h2>
        <p className="mb-8">
          Beta and experimental features are available to unlimited plan
          members.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Force Majeure</h2>
        <p className="mb-8">
          We are not responsible for failures or delays caused by events outside
          our control (like natural disasters, war, or internet outages).
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Assignment</h2>
        <p className="mb-8">
          We may transfer our rights and obligations under these Terms to
          another company (for example, if we are acquired).
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Governing Law</h2>
        <p className="mb-8">
          These Terms are governed by the laws of Lithuania. Any disputes will
          be resolved in Lithuanian courts.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Privacy</h2>
        <p className="mb-8">
          Please read our{" "}
          <a href="/privacy" className="text-blue-500 underline">
            Privacy Policy
          </a>{" "}
          to learn how we handle your data.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Contact</h2>
        <p className="mb-8">
          If you have questions, contact us at{" "}
          <a
            href={`mailto:${siteConfig.links.mail}`}
            className="text-blue-500 underline"
          >
            {siteConfig.links.mail}
          </a>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
