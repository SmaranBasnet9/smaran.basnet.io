import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getTrendingMarketingNews } from "@/lib/rss";

export const metadata = {
  title: "News",
  description:
    "Tech and AI news: booming AI businesses and deals, new model launches, everyday AI use, and what's happening in Chinese AI.",
};

export default async function NewsPage() {
  const items = await getTrendingMarketingNews(18);

  return (
    <Container className="flex flex-col gap-8 py-12 md:py-20">
      <header className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">News</span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">Tech &amp; AI News</h1>
        <p className="max-w-2xl text-ink-soft">
          AI deals and funding, how people are making money with AI tools, new model launches,
          everyday AI use, and what&apos;s happening in Chinese AI.
        </p>
      </header>

      {items.length === 0 && <p className="text-ink-soft">No news available right now — check back soon.</p>}

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/news/trending/${item.id}`}
            className="glass group flex flex-col gap-3 rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {item.source}
            </span>
            <h2 className="font-display text-lg leading-snug text-ink group-hover:underline">
              {item.title}
            </h2>
            <p className="text-sm text-ink-soft">{item.summary}</p>
            <span className="mt-auto text-xs text-ink-soft">
              By {item.byline} · {item.date}
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
