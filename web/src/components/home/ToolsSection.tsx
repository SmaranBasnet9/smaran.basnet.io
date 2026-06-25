import Link from "next/link";
import type { SanityTool } from "@/lib/queries";

export function ToolsSection({ tools }: { tools: SanityTool[] }) {
  if (tools.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-ink md:text-3xl">Trending AI Tools</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool._id}
            href={`/tools/${tool.slug.current}`}
            className="glass group flex flex-col gap-3 rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {tool.focus}
            </span>
            <h3 className="font-display text-lg leading-snug text-ink group-hover:underline">
              {tool.name}
            </h3>
            <p className="text-sm text-ink-soft">{tool.description}</p>
            {tool.insight && (
              <p className="text-xs italic text-ink-soft">{tool.insight} — Smaran</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
