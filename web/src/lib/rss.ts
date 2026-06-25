import Parser from "rss-parser";
import { getOrCreateNewsSummary, newsSummaryId } from "@/lib/ai";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  date: string;
  summary: string;
  byline: string;
};

const FEEDS = [
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch" },
  { url: "https://venturebeat.com/category/ai/feed/", source: "VentureBeat" },
  { url: "https://www.marketingaiinstitute.com/blog/rss.xml", source: "Marketing AI Institute" },
  { url: "https://techcrunch.com/tag/china/feed/", source: "TechCrunch" },
  { url: "https://www.scmp.com/rss/36/feed", source: "SCMP Tech" },
];

const TOPIC_KEYWORDS = [
  // marketing/business use of AI
  "marketing",
  "advertis",
  "brand",
  "campaign",
  "content creation",
  "seo",
  "customer",
  "social media",
  // booming tech / making money with AI
  "startup",
  "funding",
  "valuation",
  "ipo",
  "revenue",
  "acquisition",
  "acquire",
  "deal",
  "partnership",
  "billion",
  "investment",
  "monetiz",
  // everyday AI use
  "chatbot",
  "assistant",
  "productivity",
  "daily life",
  "everyday",
  "consumer",
  // new AI launches / models
  "launch",
  "release",
  "model",
  "agent",
  "gpt",
  "claude",
  "gemini",
  "llm",
  // Chinese AI
  "china",
  "chinese",
  "alibaba",
  "baidu",
  "tencent",
  "deepseek",
  "byte dance",
  "bytedance",
  "moonshot",
  "qwen",
];

const parser = new Parser();

function isRelevant(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();
  return TOPIC_KEYWORDS.some((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}`, "i").test(text);
  });
}

export async function getTrendingMarketingNews(limit = 6): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return (parsed.items ?? []).map((item) => ({
        title: item.title ?? "",
        link: item.link ?? "",
        source: feed.source,
        date: item.pubDate ?? "",
        summary: item.contentSnippet ?? "",
      }));
    })
  );

  const candidates = results
    .filter((r): r is PromiseFulfilledResult<Array<{ title: string; link: string; source: string; date: string; summary: string }>> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((item) => item.title && item.link && isRelevant(item.title, item.summary))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  const items = await Promise.all(
    candidates.map(async (item) => {
      const { summary, byline } = await getOrCreateNewsSummary({
        title: item.title,
        link: item.link,
        source: item.source,
        snippet: item.summary,
      });
      return {
        id: newsSummaryId(item.link),
        title: item.title,
        link: item.link,
        source: item.source,
        date: item.date
          ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "",
        summary,
        byline,
      };
    })
  );

  return items;
}
