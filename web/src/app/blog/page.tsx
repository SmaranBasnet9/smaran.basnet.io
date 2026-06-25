import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getAllArticles } from "@/lib/queries";

export const metadata = {
  title: "Blog",
  description: "Hands-on tool comparisons, real usage notes, and recommendations.",
};

export default async function BlogPage() {
  const articles = await getAllArticles();

  return (
    <Container className="flex flex-col gap-8 py-12 md:py-20">
      <header className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">Blog</span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">From the Blog</h1>
        <p className="max-w-2xl text-ink-soft">
          Hands-on comparisons, real usage notes, and straight recommendations on the tools we
          actually use.
        </p>
      </header>

      {articles.length === 0 && <p className="text-ink-soft">No posts published yet — check back soon.</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="glass flex flex-col gap-3 rounded-2xl p-6 transition hover:-translate-y-0.5"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {article.category}
            </span>
            <h2 className="font-display text-xl leading-snug text-ink">{article.title}</h2>
            <p className="text-sm text-ink-soft">{article.excerpt}</p>
            <span className="mt-auto text-xs text-ink-soft">{article.date}</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
