import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { getNewsSummaryById } from "@/lib/ai";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getNewsSummaryById(id);
  if (!item) return {};

  const url = `/news/trending/${id}`;

  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary,
      url,
      publishedTime: item.generatedAt,
    },
    twitter: { card: "summary_large_image", title: item.title, description: item.summary },
  };
}

export default async function TrendingNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getNewsSummaryById(id);
  if (!item) notFound();

  const date = new Date(item.generatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    datePublished: item.generatedAt,
    author: { "@type": "Person", name: item.byline },
    publisher: { "@type": "Organization", name: item.sourceName },
    isBasedOn: item.sourceLink,
  };

  return (
    <Container className="flex flex-col gap-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="flex flex-col gap-3 max-w-3xl">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {item.sourceName}
        </span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">{item.title}</h1>
        <p className="text-sm text-ink-soft">{date} · By {item.byline}</p>
      </header>

      <article className="glass max-w-3xl rounded-2xl p-6 md:p-10 flex flex-col gap-6">
        <p className="text-ink leading-relaxed">{item.summary}</p>

        <a
          href={item.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-sm text-accent underline-offset-2 hover:underline"
        >
          Source: {item.sourceName}
        </a>
      </article>

      <Link href="/news" className="text-sm text-accent underline-offset-2 hover:underline">
        ← Back to all news
      </Link>
    </Container>
  );
}
