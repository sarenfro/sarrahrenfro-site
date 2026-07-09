"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/calendars");
    } else {
      setStatus("error");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="w-full max-w-sm">
        <div className="bg-cream border border-pebble rounded-2xl p-8">
          <div className="w-8 h-1 rounded-full mb-6" style={{ backgroundColor: "var(--accent)" }} />
          <h1 className="font-display text-xl font-bold text-navy mb-6">Admin</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoFocus
              className="border border-pebble rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-stone focus:outline-none focus:border-terracotta transition-colors bg-sand"
            />
            {status === "error" && (
              <p className="text-red-500 text-xs">Incorrect password.</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-terracotta text-cream font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
