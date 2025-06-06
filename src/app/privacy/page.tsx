import { Footer } from "@/components/sections/footer-section/footer-section";
import Navbar from "@/components/sections/navbar";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <main className="prose prose-invert max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-semibold mb-2">Privacy Policy</h1>
        <p className="mb-8 text-muted-foreground">Last Updated: June 6, 2025</p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Introduction</h2>
        <p className="mb-8">
          This Privacy Policy explains how Sobeck MB ("Affogato", "we", "us")
          collects, uses, and protects your information when you use
          affogato.chat (the "Site") and our services.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          What Data We Collect
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>Account information (name, email, password)</li>
          <li>Content you upload or create (text, code, images, files)</li>
          <li>
            Usage data (how you use the service, logs, device/browser info)
          </li>
          <li>
            Payment information (for paid plans, processed by our payment
            provider)
          </li>
          <li>Cookies and similar technologies</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          How We Use Your Data
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>To provide and improve our services</li>
          <li>To manage your account and subscriptions</li>
          <li>
            To communicate with you (service updates, support, marketing if you
            opt in)
          </li>
          <li>To analyze usage and improve our platform</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          How We Share Your Data
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>
            With service providers (e.g., payment processors, hosting,
            analytics)
          </li>
          <li>
            With third-party AI model providers (e.g., OpenAI, Google, xAI,
            Anthropic) when you use their models
          </li>
          <li>As required by law or to protect our rights</li>
          <li>We do not sell your personal data</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Cookies & Tracking
        </h2>
        <p className="mb-8">
          We use cookies and similar technologies to operate our site, remember
          your preferences, and analyze usage. You can control cookies through
          your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Your Rights & Choices
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          <li>Access, update, or delete your account information</li>
          <li>Request deletion of your data by emailing us</li>
          <li>Opt out of marketing emails at any time</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Data Retention</h2>
        <p className="mb-8">
          We keep your data as long as needed to provide our services and for up
          to 30 days after account closure, after which it is deleted or
          anonymized. Some data may be kept longer if required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          How We Protect Your Data
        </h2>
        <p className="mb-8">
          We use industry-standard security measures to protect your data.
          However, no system is 100% secure, so we cannot guarantee absolute
          security.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Children's Privacy
        </h2>
        <p className="mb-8">
          Affogato is not intended for children under 16. We do not knowingly
          collect data from children.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">
          Changes to This Policy
        </h2>
        <p className="mb-8">
          We may update this Privacy Policy from time to time. If we make
          changes, we will notify you by email or on the site.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-2">Contact</h2>
        <p className="mb-8">
          If you have questions or requests about your privacy, contact us at{" "}
          <a
            href="mailto:armandas@affogato.chat"
            className="text-blue-500 underline"
          >
            armandas@affogato.chat
          </a>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}
