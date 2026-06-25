import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Get in Touch",
  description: "Connect with Smaran for marketing and AI tooling consulting.",
};

export default function ContactPage() {
  return (
    <Container className="flex flex-col gap-8 py-12 md:py-20">
      <header className="flex flex-col gap-3 max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">Contact</span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">Let&apos;s talk consulting</h1>
        <p className="text-ink-soft">
          Tell me a bit about what you&apos;re working on — marketing strategy, AI tooling, or
          content systems — and I&apos;ll follow up to set up a call.
        </p>
      </header>

      <div className="max-w-2xl">
        <ContactForm />
      </div>
    </Container>
  );
}
