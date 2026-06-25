import Link from "next/link";
import { Container } from "@/components/layout/Container";

export const metadata = {
  title: "Smaran Basnet — Profile",
  description:
    "Full profile and background of Smaran Basnet: experience, skills, and education.",
  alternates: { canonical: "/about/profile" },
};

const EXPERIENCE = [
  {
    role: "Independent Writer & Consultant",
    org: "Self-employed",
    period: "2024 — Present",
    description:
      "Publishing independent coverage of AI tools and products, while building agentic AI systems and case studies that turn business data into operating decisions.",
  },
  {
    role: "Sales & Marketing Administrative",
    org: "B.Mai Automobile (BYD Bhaktapur)",
    period: "3 years",
    description:
      "Worked across the four-wheeler automotive dealership with the finance department on inventory and logistics, planned marketing strategy, ran PR collaborations with agencies, and organized events — part of growing the dealership from scratch.",
  },
  {
    role: "Sales & Marketing Executive",
    org: "Helmets Nepal",
    period: "1 year",
    description:
      "Consulted with customers one-on-one, kept inventory records on the system, and handled day-to-day bookkeeping, billing, and invoicing.",
  },
  {
    role: "IT Support Technician (Intern)",
    org: "Classic Tech",
    period: "3 months",
    description:
      "Used ticketing and record-keeping tools to log support requests and consulted with people to debug router issues.",
  },
];

const SKILLS = [
  "Business development",
  "Case study & data-driven decision making",
  "Operations planning",
  "Web development",
  "System architecture",
  "Agentic AI building",
  "Sales & customer consulting",
  "Inventory & logistics management",
  "Bookkeeping & invoicing",
  "Marketing strategy & planning",
  "PR & agency collaboration",
  "Event organizing",
  "IT support & troubleshooting",
  "Digital marketing",
  "SWOT & ratio analysis",
  "Critical thinking",
];

const EDUCATION = [
  {
    degree: "MBA, Digital Marketing",
    school: "University of East London — London, UK",
    description:
      "Focused on implementing marketing policy, managing communication channels and corporate communication, and how top-tier strategies are built and adapted across countries to fit local policy. Studied big-brand case studies (Kodak, Fujifilm, Tesla) alongside data-driven marketing, ratio analysis, SWOT analysis, and emotional intelligence in business.",
  },
  {
    degree: "Bachelor's, Information Management",
    school: "Orchid International College (TU affiliation)",
    description:
      "Studied how information is collected across platforms and how those platforms are built — programming for automation, system design and architecture, data structures and algorithms, database types, and how management and information systems support each other.",
  },
  {
    degree: "High School, Management",
    school: "Khwopa College",
    description:
      "Covered the fundamentals of business: principles of management (POM), business strategy, and accounting.",
  },
];

export default function ProfilePage() {
  return (
    <Container className="flex flex-col gap-12 py-12 md:py-20">
      <Link href="/about" className="text-sm text-accent underline-offset-2 hover:underline">
        ← Back to about
      </Link>

      <header className="flex flex-col items-start gap-5 max-w-2xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink text-paper font-display text-2xl">
          SB
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl text-ink md:text-4xl">Smaran Basnet</h1>
          <p className="text-ink-soft">Business development &amp; Agentic AI builder</p>
        </div>
        <p className="text-ink leading-relaxed">
          My core expertise is business development — running case studies on how a business
          actually operates, then using that data to make decisions and build plans for smoother
          operations. On the technical side, I&apos;m a web developer and system architect who builds
          agentic AI systems, which lets me take those same case studies from analysis straight
          into working tools rather than just a slide deck.
        </p>
        <p className="text-ink leading-relaxed">
          I&apos;ve always been curious with a problem-solver&apos;s attitude — I think creativity is the
          key to figuring out solutions for different problems. I&apos;m drawn to critical, hard
          problems and the thinking it takes to work through them.
        </p>
      </header>

      <section className="flex flex-col gap-5 max-w-2xl">
        <h2 className="font-display text-2xl text-ink">Experience</h2>
        <div className="flex flex-col gap-6">
          {EXPERIENCE.map((item) => (
            <div key={item.role} className="glass rounded-2xl p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-ink">{item.role}</span>
                <span className="text-xs text-ink-soft">{item.period}</span>
              </div>
              <p className="text-sm text-ink-soft">{item.org}</p>
              <p className="mt-2 text-ink-soft leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 max-w-2xl">
        <h2 className="font-display text-2xl text-ink">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-soft"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 max-w-2xl">
        <h2 className="font-display text-2xl text-ink">Education</h2>
        <div className="flex flex-col gap-4">
          {EDUCATION.map((item) => (
            <div key={item.degree} className="glass rounded-2xl p-6">
              <span className="font-medium text-ink">{item.degree}</span>
              <p className="text-sm text-ink-soft">{item.school}</p>
              <p className="mt-2 text-ink-soft leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Link
        href="/contact"
        className="self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-80"
      >
        Get in touch
      </Link>
    </Container>
  );
}
