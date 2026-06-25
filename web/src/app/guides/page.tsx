import { Container } from "@/components/layout/Container";

export const metadata = {
  title: "Guide",
  description:
    "A single, step-by-step path to learn social media management and content creation — one channel to follow, prompt-writing theory with examples, and how the tools actually fit together.",
};

const STEPS = [
  {
    title: "Pick one channel and stop browsing for more",
    body:
      "Follow Hootsuite Academy's free \"Social Marketing Certification\" course start to finish before touching anything else. Most people stall out by jumping between five YouTube channels and three paid courses at once — pick one, finish it, then decide if you need another.",
  },
  {
    title: "Learn the platform rules before the creative work",
    body:
      "Inside that course, do the modules on platform algorithms and content formats first. Posting consistently without understanding why the algorithm favors certain formats wastes the next three steps.",
  },
  {
    title: "Build a 2-week content calendar, not a content idea list",
    body:
      "Block out 14 days of post slots before writing a single caption. A calendar with dates forces you to actually publish; an idea list just grows forever.",
  },
  {
    title: "Draft with AI, edit with your own voice",
    body:
      "Use the prompt patterns below to get a first draft fast, then rewrite the first and last lines yourself. AI-written hooks and AI-written endings are the easiest thing for readers to spot — your edit only needs to touch those two spots.",
  },
  {
    title: "Post, track three numbers, repeat",
    body:
      "Track save rate, reply rate, and follower growth weekly — ignore likes. After two weeks, go back to the course's analytics module and adjust only one variable (format, posting time, or hook style) before the next two-week block.",
  },
];

const PROMPT_EXAMPLES = [
  {
    label: "Caption draft",
    prompt:
      "Write a 60-word Instagram caption for a [your niche] post about [topic]. Hook in the first line, one practical tip, end with a question to drive replies. Casual tone, no emojis.",
  },
  {
    label: "Content calendar",
    prompt:
      "Give me 14 social post ideas for [your niche] over the next two weeks, mixing educational, behind-the-scenes, and promotional posts in a 3:2:1 ratio. One line per idea, no captions yet.",
  },
  {
    label: "Hook rewrite",
    prompt:
      "Here is a caption: [paste caption]. Rewrite just the first line as a hook using a curiosity gap or a specific number, keep everything else the same.",
  },
  {
    label: "Repurposing",
    prompt:
      "Turn this blog paragraph into 3 short-form video scripts under 30 seconds each: [paste paragraph]. Each script needs a spoken hook in the first 3 seconds.",
  },
];

export default function GuidePage() {
  return (
    <Container className="flex flex-col gap-16 py-12 md:py-20">
      <header className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">Guide</span>
        <h1 className="font-display text-3xl text-ink md:text-4xl">
          The One-Channel Guide to Social Media &amp; Content Creation
        </h1>
        <p className="max-w-2xl text-ink-soft">
          One course, five steps, no tool-hopping. Finish this before you add anything else to
          your stack.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl text-ink md:text-3xl">Step-by-step process</h2>
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="glass flex gap-4 rounded-2xl p-6">
              <span className="font-display shrink-0 text-2xl text-accent">{i + 1}</span>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-lg text-ink">{step.title}</h3>
                <p className="text-sm text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl text-ink md:text-3xl">How to write a prompt</h2>
        <p className="max-w-2xl text-ink-soft">
          A good content prompt has four parts: the format (caption, script, calendar), the
          context (your niche and topic), the constraint (length, tone, structure), and the goal
          (replies, saves, watch time). Leave any part out and you get a generic draft you have to
          rewrite from scratch anyway.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {PROMPT_EXAMPLES.map((example) => (
            <article key={example.label} className="glass flex flex-col gap-2 rounded-2xl p-6">
              <span className="text-xs font-medium uppercase tracking-wide text-accent">
                {example.label}
              </span>
              <p className="font-mono text-sm text-ink">{example.prompt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl text-ink md:text-3xl">
          How the tools actually fit together
        </h2>
        <p className="max-w-2xl text-ink-soft">
          Every AI content tool sits in one of three stages: input, generation, and output. Most
          confusion about &quot;which tool do I need&quot; comes from not knowing which stage
          you&apos;re stuck at.
        </p>

        <div className="glass flex flex-col gap-4 rounded-2xl p-6 md:p-10">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-xl bg-black/5 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">Input</p>
                <p className="mt-1 text-sm text-ink">Topic, brief, or research</p>
              </div>
              <p className="text-xs text-ink-soft">Notion AI, your own notes</p>
            </div>

            <span className="font-display text-2xl text-accent md:rotate-0">→</span>

            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-xl bg-black/5 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  Generation
                </p>
                <p className="mt-1 text-sm text-ink">Drafting the content</p>
              </div>
              <p className="text-xs text-ink-soft">Jasper, Copy.ai, Claude</p>
            </div>

            <span className="font-display text-2xl text-accent md:rotate-0">→</span>

            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-xl bg-black/5 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">Output</p>
                <p className="mt-1 text-sm text-ink">Polish &amp; publish</p>
              </div>
              <p className="text-xs text-ink-soft">Canva, Surfer SEO, scheduler</p>
            </div>
          </div>
        </div>

        <p className="max-w-2xl text-ink-soft">
          If your posts feel generic, the problem is almost always at the input stage — a vague
          brief produces a vague draft no matter how good the generation tool is. If your posts
          read well but don&apos;t rank or get found, the gap is at the output stage — generation
          tools don&apos;t optimize for search or platform format on their own. Diagnose which
          stage is weak before adding a new tool to the stack.
        </p>
      </section>
    </Container>
  );
}
