"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/SocialIcons";

const reachOutReasons = [
  "A role",
  "A project",
  "A collaboration",
  "Something I read",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xpqkzjlq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", reason: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-ink px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-hero mb-4">
            Let&apos;s talk.
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Tell me what you&apos;re working on.
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="bg-light px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Fit criteria */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-cream border border-pebble rounded-2xl p-7">
              <h2 className="font-display text-lg font-bold text-navy mb-4">
                Reach out if you&apos;re...
              </h2>
              <ul className="flex flex-col gap-3">
                {[
                  "Hiring for a PM, Product Marketing, or Chief of Staff role in the Seattle area (or remote-open)",
                  "A founder or early-stage team that needs someone who can hold the strategic and the tactical at the same time",
                  "A collaborator interested in building something in the AI or product space",
                  "Someone who wants to discuss something from Sarrah's Sandbox",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-charcoal text-sm leading-relaxed">
                    <span className="text-terracotta shrink-0 mt-0.5">&#8227;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-cream border border-pebble rounded-2xl p-7">
              <h2 className="font-display text-sm font-bold text-stone mb-3">
                Probably not a great fit if...
              </h2>
              <p className="text-stone text-sm leading-relaxed">
                You&apos;re looking for an Executive Assistant or someone to execute
                without context. I work best when I&apos;m close to the problem.
              </p>
            </div>

            {/* Social links */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.linkedin.com/in/sarrahrenfro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-stone hover:text-navy transition-colors"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href="https://github.com/sarrahrenfro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-stone hover:text-navy transition-colors"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href="https://sarrahsandbox.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone hover:text-navy transition-colors text-sm font-medium"
              >
                Substack
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {status === "sent" ? (
              <div className="bg-cream border border-pebble rounded-2xl p-10 text-center">
                <div className="w-12 h-12 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={20} className="text-terracotta" />
                </div>
                <h2 className="font-display text-2xl font-bold text-navy mb-2">
                  Message sent.
                </h2>
                <p className="text-stone text-sm">
                  Thanks for reaching out. I&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <div className="bg-cream border border-pebble rounded-2xl p-8 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-navy text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="border border-pebble rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-stone focus:outline-none focus:border-terracotta transition-colors bg-sand"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-navy text-sm font-medium"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="border border-pebble rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-stone focus:outline-none focus:border-terracotta transition-colors bg-sand"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reason"
                    className="text-navy text-sm font-medium"
                  >
                    I&apos;m reaching out about...
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="border border-pebble rounded-xl px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-terracotta transition-colors bg-sand appearance-none"
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {reachOutReasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-navy text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me what you're working on..."
                    className="border border-pebble rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-stone focus:outline-none focus:border-terracotta transition-colors bg-sand resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-500">
                    Something went wrong. Try emailing me directly.
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={status === "sending"}
                  className="bg-terracotta text-cream font-medium px-8 py-3 rounded-full hover:bg-terracotta-dark transition-colors disabled:opacity-60 self-start flex items-center gap-2"
                >
                  {status === "sending" ? "Sending..." : "Send it"}
                  {status !== "sending" && <Send size={14} />}
                </button>
              </div>
            )}
          </div>
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
          <a
            href="https://www.linkedin.com/in/sarrahrenfro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cream text-terracotta font-semibold px-8 py-3 rounded-full hover:bg-sand transition-colors"
          >
            Connect on LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
