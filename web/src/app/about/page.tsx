import Link from "next/link";
import { Container } from "@/components/layout/Container";

export const metadata = {
  title: "About",
  description: "Who's behind the coverage — Smaran Basnet's background and how to get in touch.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="flex flex-col gap-12 py-12 md:py-20">
      <header className="flex flex-col gap-3 max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">About</span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">Who&apos;s writing this</h1>
        <p className="text-ink-soft">
          Independent coverage of AI tools, products, and the people building them — written
          by one person, not a content farm.
        </p>
      </header>

      <Link
        href="/about/profile"
        className="glass group flex max-w-2xl items-center gap-5 rounded-2xl p-6 transition-opacity hover:opacity-90"
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-paper font-display text-xl">
          SB
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-display text-xl text-ink">Smaran Basnet</span>
          <span className="text-sm text-ink-soft">
            Business development &amp; Agentic AI builder
          </span>
          <span className="mt-1 text-sm text-accent underline-offset-2 group-hover:underline">
            View full profile →
          </span>
        </div>
      </Link>
    </Container>
  );
}
