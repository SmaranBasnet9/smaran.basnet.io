import Link from "next/link";
import { Container } from "./Container";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/tools", label: "Tools" },
      { href: "/news", label: "News" },
      { href: "/blog", label: "Blog" },
      { href: "/guides", label: "Guides" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-10 py-16 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-xl tracking-tight">Smaran Basnet</p>
          <p className="mt-3 text-sm text-ink-soft">
            Independent coverage of AI tools, products, and the people building them.
          </p>
        </div>
        <div className="flex gap-12">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium text-ink">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-soft transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Container className="border-t border-line py-6 text-xs text-ink-soft">
        © {new Date().getFullYear()} Smaran Basnet. All rights reserved.
      </Container>
    </footer>
  );
}
