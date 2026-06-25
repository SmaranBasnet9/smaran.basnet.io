import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getAllTools, type SanityToolFull } from "@/lib/queries";

const CATEGORY_ORDER = [
  "SEO & Content",
  "Social Media",
  "Email Marketing",
  "Paid Ads",
  "Analytics",
  "Design",
  "AI Writing & Automation",
];

function groupByCategory(tools: SanityToolFull[]) {
  const groups = new Map<string, SanityToolFull[]>();
  for (const tool of tools) {
    const list = groups.get(tool.category) ?? [];
    list.push(tool);
    groups.set(tool.category, list);
  }
  return CATEGORY_ORDER.map((category) => ({
    category,
    tools: groups.get(category) ?? [],
  })).filter((group) => group.tools.length > 0);
}

export const metadata = {
  title: "Digital Marketing Tools",
  description: "A practical catalog of digital marketing tools and how to actually use each one.",
};

export default async function ToolsPage() {
  const tools = await getAllTools();
  const groups = groupByCategory(tools);

  return (
    <Container className="flex flex-col gap-12 py-12 md:py-20">
      <header className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">Tools</span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">Digital Marketing Tools</h1>
        <p className="max-w-2xl text-ink-soft">
          A working catalog of the tools we actually recommend for marketing — and, for each one,
          how to put it to use day-to-day.
        </p>
      </header>

      {groups.length === 0 && (
        <p className="text-ink-soft">No tools published yet — check back soon.</p>
      )}

      {groups.map(({ category, tools: groupTools }) => (
        <section key={category} className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-ink md:text-3xl">{category}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {groupTools.map((tool) => (
              <Link
                key={tool._id}
                href={`/tools/${tool.slug.current}`}
                className="glass group flex flex-col gap-3 rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
              >
                <h3 className="font-display text-lg leading-snug text-ink group-hover:underline">
                  {tool.name}
                </h3>
                <p className="text-sm text-ink-soft">{tool.description}</p>
                <div className="rounded-xl bg-black/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                    How to use it
                  </p>
                  <p className="mt-1 text-sm text-ink">{tool.howToUse}</p>
                </div>
                {tool.insight && (
                  <p className="text-xs italic text-ink-soft">{tool.insight} — Smaran</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </Container>
  );
}
