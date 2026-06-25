import { createHash } from "crypto";
import OpenAI from "openai";
import { sanityClient, sanityFreshClient } from "@/lib/sanity";
import { sanityWriteClient } from "@/lib/sanityWrite";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function fallbackSummary(title: string, snippet?: string) {
  const base = snippet?.trim() || title;
  return base.slice(0, 280).trim() + (base.length > 280 ? "…" : "");
}

async function generateText(prompt: string, fallback: string) {
  if (!openai) return fallback;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "You are Smaran, an editor writing short, original, human-sounding takes for a marketing/tech AI news site. Never copy phrasing from the source. Write in first person plural or neutral editorial voice, 2-3 sentences, no fluff.",
        },
        { role: "user", content: prompt },
      ],
    });
    return response.choices[0]?.message?.content?.trim() || fallback;
  } catch {
    return fallback;
  }
}

export type NewsSummary = {
  summary: string;
  byline: string;
};

export function newsSummaryId(link: string) {
  return createHash("sha1").update(link).digest("hex");
}

export async function getOrCreateNewsSummary(item: {
  title: string;
  link: string;
  source: string;
  snippet?: string;
}): Promise<NewsSummary> {
  const cached = await sanityClient.fetch<{ summary: string; byline: string } | null>(
    `*[_type == "newsSummary" && sourceLink == $link][0]{ summary, byline }`,
    { link: item.link }
  );
  if (cached) return cached;

  const summary = await generateText(
    `Write Smaran's original summary of this article for our homepage. Title: "${item.title}". Source: ${item.source}. Snippet: ${item.snippet ?? "n/a"}.`,
    fallbackSummary(item.title, item.snippet)
  );

  if (sanityWriteClient) {
    await sanityWriteClient.createOrReplace({
      _id: `newsSummary.${createHash("sha1").update(item.link).digest("hex")}`,
      _type: "newsSummary",
      sourceLink: item.link,
      sourceName: item.source,
      title: item.title,
      summary,
      byline: "Smaran",
      generatedAt: new Date().toISOString(),
    });
  }

  return { summary, byline: "Smaran" };
}

export type NewsSummaryDoc = {
  title: string;
  summary: string;
  byline: string;
  sourceLink: string;
  sourceName: string;
  generatedAt: string;
};

export async function getNewsSummaryById(id: string): Promise<NewsSummaryDoc | null> {
  return sanityFreshClient.fetch<NewsSummaryDoc | null>(
    `*[_type == "newsSummary" && _id == $id][0]{ title, summary, byline, sourceLink, sourceName, generatedAt }`,
    { id: `newsSummary.${id}` }
  );
}

export async function getOrCreateToolInsight(tool: {
  _id: string;
  name: string;
  description: string;
  focus: string;
  insight?: string | null;
}): Promise<string> {
  if (tool.insight) return tool.insight;

  const insight = await generateText(
    `Write Smaran's one-sentence insight on why "${tool.name}" (${tool.focus} focus, described as: ${tool.description}) is worth watching right now for marketers and technologists.`,
    tool.description
  );

  if (sanityWriteClient) {
    await sanityWriteClient.patch(tool._id).set({ insight }).commit({ autoGenerateArrayKeys: true }).catch(() => {});
  }

  return insight;
}
