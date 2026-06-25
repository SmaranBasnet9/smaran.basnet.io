import { sanityClient } from "./sanity";
import { getOrCreateToolInsight } from "@/lib/ai";
import type { Article } from "@/components/home/ArticleCard";

type SanityArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  featured: boolean;
  category: { title: string } | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const PUBLISHED_FILTER = `(status == "published" || !defined(status))`;

function toArticle(doc: SanityArticle): Article {
  return {
    slug: doc.slug.current,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category?.title ?? "Uncategorized",
    date: new Date(doc.publishedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

const ARTICLE_PROJECTION = `{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  featured,
  category->{title}
}`;

export async function getFeaturedArticle(): Promise<Article | null> {
  const doc = await sanityClient.fetch<SanityArticle | null>(
    `*[_type == "article" && featured == true && ${PUBLISHED_FILTER}] | order(publishedAt desc)[0] ${ARTICLE_PROJECTION}`
  );
  return doc ? toArticle(doc) : null;
}

export async function getLatestArticles(excludeSlug?: string, limit = 3): Promise<Article[]> {
  const docs = await sanityClient.fetch<SanityArticle[]>(
    `*[_type == "article" && slug.current != $excludeSlug && ${PUBLISHED_FILTER}] | order(publishedAt desc)[0...$limit] ${ARTICLE_PROJECTION}`,
    { excludeSlug: excludeSlug ?? "", limit }
  );
  return docs.map(toArticle);
}

export async function getAllArticles(): Promise<Article[]> {
  const docs = await sanityClient.fetch<SanityArticle[]>(
    `*[_type == "article" && ${PUBLISHED_FILTER}] | order(publishedAt desc) ${ARTICLE_PROJECTION}`
  );
  return docs.map(toArticle);
}

export type SanityArticleFull = Article & {
  body: unknown[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAtISO: string;
  tags?: string[] | null;
};

export async function getArticleBySlug(slug: string): Promise<SanityArticleFull | null> {
  const doc = await sanityClient.fetch<
    | (SanityArticle & {
        body: unknown[];
        seoTitle?: string | null;
        seoDescription?: string | null;
        tags?: string[] | null;
      })
    | null
  >(
    `*[_type == "article" && slug.current == $slug && ${PUBLISHED_FILTER}][0]{
      _id, title, slug, excerpt, publishedAt, featured, body, seoTitle, seoDescription, tags, category->{title}
    }`,
    { slug }
  );
  if (!doc) return null;
  return {
    ...toArticle(doc),
    body: doc.body ?? [],
    seoTitle: doc.seoTitle,
    seoDescription: doc.seoDescription,
    publishedAtISO: doc.publishedAt,
    tags: doc.tags,
  };
}

export type SanityTool = {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  url: string;
  focus: string;
  insight: string;
};

export async function getFeaturedTools(limit = 5): Promise<SanityTool[]> {
  const docs = await sanityClient.fetch<Array<Omit<SanityTool, "insight"> & { insight?: string | null }>>(
    `*[_type == "tool" && featured == true] | order(order asc)[0...$limit]{
      _id, name, slug, description, url, focus, insight
    }`,
    { limit }
  );

  return Promise.all(
    docs.map(async (doc) => ({
      ...doc,
      insight: await getOrCreateToolInsight(doc),
    }))
  );
}

export type SanityToolFull = SanityTool & {
  category: string;
  howToUse: string;
};

export async function getAllTools(): Promise<SanityToolFull[]> {
  const docs = await sanityClient.fetch<
    Array<Omit<SanityToolFull, "insight"> & { insight?: string | null }>
  >(
    `*[_type == "tool"] | order(category asc, order asc){
      _id, name, slug, description, url, focus, category, howToUse, insight
    }`
  );

  return Promise.all(
    docs.map(async (doc) => ({
      ...doc,
      insight: await getOrCreateToolInsight(doc),
    }))
  );
}

export async function getToolBySlug(slug: string): Promise<SanityToolFull | null> {
  const doc = await sanityClient.fetch<
    (Omit<SanityToolFull, "insight"> & { insight?: string | null }) | null
  >(
    `*[_type == "tool" && slug.current == $slug][0]{
      _id, name, slug, description, url, focus, category, howToUse, insight
    }`,
    { slug }
  );
  if (!doc) return null;
  return { ...doc, insight: await getOrCreateToolInsight(doc) };
}

export type SanityLearningPlatform = {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  url: string;
};

export async function getFeaturedLearningPlatforms(limit = 3): Promise<SanityLearningPlatform[]> {
  return sanityClient.fetch<SanityLearningPlatform[]>(
    `*[_type == "learningPlatform" && featured == true] | order(order asc)[0...$limit]{
      _id, name, slug, description, url
    }`,
    { limit }
  );
}
