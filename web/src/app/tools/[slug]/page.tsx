import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { getToolBySlug } from "@/lib/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};

  const title = `${tool.name}: ${tool.category} tool review`;
  const description = tool.description;
  const url = `/tools/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    url: tool.url,
    review: tool.insight
      ? {
          "@type": "Review",
          author: { "@type": "Person", name: "Smaran" },
          reviewBody: tool.insight,
        }
      : undefined,
  };

  return (
    <Container className="flex flex-col gap-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="flex flex-col gap-3 max-w-3xl">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {tool.category}
        </span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">{tool.name}</h1>
        <p className="text-ink-soft">{tool.description}</p>
      </header>

      <article className="glass max-w-3xl rounded-2xl p-6 md:p-10 flex flex-col gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            How to use it
          </p>
          <p className="mt-2 text-ink leading-relaxed">{tool.howToUse}</p>
        </div>

        {tool.insight && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Smaran&apos;s take
            </p>
            <p className="mt-2 italic text-ink-soft">{tool.insight} — Smaran</p>
          </div>
        )}

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 self-start text-sm text-accent underline-offset-2 hover:underline"
        >
          Source: {tool.name}
        </a>
      </article>

      <Link href="/tools" className="text-sm text-accent underline-offset-2 hover:underline">
        ← Back to all tools
      </Link>
    </Container>
  );
}
