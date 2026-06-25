import Link from "next/link";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="glass group flex flex-col gap-3 rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-accent">
        {article.category}
      </span>
      <h3 className="font-display text-xl leading-snug text-ink group-hover:underline">
        {article.title}
      </h3>
      <p className="text-sm text-ink-soft">{article.excerpt}</p>
      <time className="mt-auto text-xs text-ink-soft">{article.date}</time>
    </Link>
  );
}
