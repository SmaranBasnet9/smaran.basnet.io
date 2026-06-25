import Link from "next/link";
import type { Article } from "./ArticleCard";

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="glass group flex flex-col justify-end gap-4 rounded-3xl p-10 min-h-[420px] transition-transform hover:-translate-y-0.5 md:p-14"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-accent">
        {article.category}
      </span>
      <h2 className="font-display text-3xl leading-tight text-ink group-hover:underline md:text-5xl">
        {article.title}
      </h2>
      <p className="max-w-xl text-base text-ink-soft md:text-lg">{article.excerpt}</p>
      <time className="text-xs text-ink-soft">{article.date}</time>
    </Link>
  );
}
