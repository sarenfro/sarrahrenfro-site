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
    <footer className="bg-navy text-cream/80">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-display font-bold text-cream text-sm">Sarrah Renfro</span>
          <span className="text-cream/50 text-xs">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/60 hover:text-cream text-xs transition-colors"
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
            className="text-cream/60 hover:text-cream transition-colors"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href="https://github.com/sarrahrenfro"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-cream/60 hover:text-cream transition-colors"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href="https://sarrahsandbox.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Substack"
            className="text-cream/60 hover:text-cream transition-colors text-xs font-medium"
          >
            Substack
          </a>
        </div>
      </div>
    </footer>
  );
}
