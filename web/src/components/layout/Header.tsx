import Link from "next/link";
import { Container } from "./Container";

const NAV = [
  { href: "/tools", label: "Tools" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line glass">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight">
          Smaran Basnet
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-80"
        >
          Get in touch
        </Link>
      </Container>
    </header>
  );
}
