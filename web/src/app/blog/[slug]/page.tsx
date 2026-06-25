import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Container } from "@/components/layout/Container";
import { getArticleBySlug } from "@/lib/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const url = `/blog/${slug}`;

  return {
    title,
    description,
    keywords: article.tags ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: article.publishedAtISO,
      tags: article.tags ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-2xl text-ink mt-10 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl text-ink mt-8 mb-2">{children}</h3>
    ),
    normal: ({ children }) => <p className="text-ink-soft leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-4 italic text-ink my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 text-ink-soft mb-4 flex flex-col gap-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 text-ink-soft mb-4 flex flex-col gap-1">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-ink font-semibold">{children}</strong>,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAtISO,
    author: { "@type": "Person", name: "Smaran" },
    articleSection: article.category,
    keywords: article.tags?.join(", "),
  };

  return (
    <Container className="flex flex-col gap-8 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="flex flex-col gap-3 max-w-3xl">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">
          {article.category}
        </span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">{article.title}</h1>
        <p className="text-sm text-ink-soft">{article.date} · By Smaran</p>
      </header>

      <article className="glass max-w-3xl rounded-2xl p-6 md:p-10">
        <PortableText value={article.body as never} components={components} />
      </article>
    </Container>
  );
}
