import { Container } from "@/components/layout/Container";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { ArticleCard, type Article } from "@/components/home/ArticleCard";
import { NewsSection } from "@/components/home/NewsSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { LearningSection } from "@/components/home/LearningSection";
import {
  getFeaturedArticle,
  getLatestArticles,
  getFeaturedTools,
  getFeaturedLearningPlatforms,
} from "@/lib/queries";
import { getTrendingMarketingNews } from "@/lib/rss";

const PLACEHOLDER_FEATURED: Article = {
  slug: "placeholder-featured",
  title: "The state of AI tooling in 2026, and what actually matters",
  excerpt:
    "A look at which AI products are earning their place in real workflows, and which are noise.",
  category: "Analysis",
  date: "Jun 25, 2026",
};

const PLACEHOLDER_ARTICLES: Article[] = [
  {
    slug: "placeholder-1",
    title: "Five coding agents we'd actually pay for",
    excerpt: "Hands-on notes from a month of daily use across real projects.",
    category: "Tools",
    date: "Jun 20, 2026",
  },
  {
    slug: "placeholder-2",
    title: "What changed in the latest model releases",
    excerpt: "A practical rundown, skipping the benchmark theater.",
    category: "News",
    date: "Jun 18, 2026",
  },
  {
    slug: "placeholder-3",
    title: "A field guide to evaluating AI vendors",
    excerpt: "Questions worth asking before you sign anything.",
    category: "Guides",
    date: "Jun 12, 2026",
  },
];

export default async function Home() {
  const featured = (await getFeaturedArticle()) ?? PLACEHOLDER_FEATURED;
  const [articles, news, tools, learningPlatforms] = await Promise.all([
    getLatestArticles(featured.slug),
    getTrendingMarketingNews(),
    getFeaturedTools(5),
    getFeaturedLearningPlatforms(3),
  ]);
  const gridArticles = articles.length > 0 ? articles : PLACEHOLDER_ARTICLES;

  return (
    <Container className="flex flex-col gap-12 py-12 md:py-20">
      <FeaturedArticle article={featured} />
      <div className="grid gap-6 md:grid-cols-3">
        {gridArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      <NewsSection items={news} />
      <ToolsSection tools={tools} />
      <LearningSection platforms={learningPlatforms} />
    </Container>
  );
}
