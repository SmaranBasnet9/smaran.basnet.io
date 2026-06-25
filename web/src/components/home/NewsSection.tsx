import Link from "next/link";
import type { NewsItem } from "@/lib/rss";

export function NewsSection({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-ink md:text-3xl">Trending News</h2>
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
            <h3 className="font-display text-lg leading-snug text-ink group-hover:underline">
              {item.title}
            </h3>
            <p className="text-sm text-ink-soft">{item.summary}</p>
            <span className="mt-auto text-xs text-ink-soft">
              By {item.byline} · {item.date}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
