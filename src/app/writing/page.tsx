import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getSubstackPosts, formatDate, truncate } from "@/lib/rss";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Writing | Sarrah Renfro",
  description:
    "Sarrah's Sandbox: AI and technology, explained for people who think differently about it. No jargon, no gatekeeping.",
};

export default async function WritingPage() {
  const posts = await getSubstackPosts(6);

  return (
    <>
      {/* HERO */}
      <section className="bg-ink px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-hero mb-4">
            Sarrah&apos;s Sandbox
          </h1>
          <p className="text-lg max-w-xl" style={{ color: "var(--text-secondary)" }}>
            AI and technology, explained for people who think differently about
            it. No jargon, no gatekeeping.
          </p>
        </div>
      </section>

      {/* POSTS */}
      <section className="bg-light px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {posts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cream border border-pebble rounded-2xl overflow-hidden hover:border-terracotta transition-colors group flex flex-col"
                >
                  {post.image && (
                    <div className="relative w-full h-44 shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-7 flex flex-col flex-1">
                    <p className="text-stone text-xs mb-3">
                      {formatDate(post.pubDate)}
                    </p>
                    <h2 className="font-display text-xl font-bold text-navy mb-3 group-hover:text-terracotta transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-charcoal text-sm leading-relaxed flex-1 mb-5">
                      {truncate(post.contentSnippet)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-terracotta text-sm font-medium">
                      Read <ArrowUpRight size={14} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-charcoal mb-4">
                Head to Substack to read the latest.
              </p>
              <a
                href="https://sarrahsandbox.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-terracotta font-medium hover:underline"
              >
                Open Substack <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* SUBSCRIBE CTA */}
      <section className="bg-navy px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-cream mb-3">
            Get it in your inbox.
          </h2>
          <p className="text-cream/70 mb-8">
            New posts on AI, product, and what&apos;s actually worth paying
            attention to.
          </p>
          <a
            href="https://sarrahsandbox.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-terracotta text-cream font-semibold px-8 py-3 rounded-full hover:bg-terracotta-dark transition-colors"
          >
            Subscribe on Substack
          </a>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="bg-terracotta px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-cream mb-4">
            Let&apos;s connect.
          </h2>
          <p className="text-cream/80 mb-8">
            Recruiting for a PM, Chief of Staff, or strategic operator role?
            Let&apos;s talk.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-cream text-terracotta font-semibold px-8 py-3 rounded-full hover:bg-sand transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
