import Link from "next/link";
import { LinkedinIcon, GithubIcon } from "@/components/SocialIcons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--bg-base)", borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>Sarrah Renfro</span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/sarrahrenfro"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href="https://github.com/sarrahrenfro"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <GithubIcon size={18} />
          </a>
          <a
            href="https://sarrahsandbox.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Substack"
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Substack
          </a>
        </div>
      </div>
    </footer>
  );
}
