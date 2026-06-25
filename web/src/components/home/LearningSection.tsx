import type { SanityLearningPlatform } from "@/lib/queries";

export function LearningSection({ platforms }: { platforms: SanityLearningPlatform[] }) {
  if (platforms.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-ink md:text-3xl">Demo Projects &amp; Learning Platforms</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {platforms.map((platform) => (
          <a
            key={platform._id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass group flex flex-col gap-3 rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
          >
            <h3 className="font-display text-lg leading-snug text-ink group-hover:underline">
              {platform.name}
            </h3>
            <p className="text-sm text-ink-soft">{platform.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
