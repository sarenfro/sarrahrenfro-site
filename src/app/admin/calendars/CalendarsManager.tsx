"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

interface CalendarUrl {
  id: string;
  label: string;
  url: string;
}

interface EditState {
  id: string;
  label: string;
  url: string;
}

export default function CalendarsManager({ initial }: { initial: CalendarUrl[] }) {
  const router = useRouter();
  const [calendars, setCalendars] = useState<CalendarUrl[]>(initial);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function handleAdd() {
    if (!newLabel.trim() || !newUrl.trim()) return;
    setBusy(true);
    const res = await fetch("/api/admin/calendars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim(), url: newUrl.trim() }),
    });
    if (res.ok) {
      const { entry } = await res.json();
      setCalendars((prev) => [...prev, entry]);
      setNewLabel("");
      setNewUrl("");
      setAdding(false);
    }
    setBusy(false);
  }

  async function handleSaveEdit() {
    if (!editing || !editing.label.trim() || !editing.url.trim()) return;
    setBusy(true);
    const res = await fetch("/api/admin/calendars", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      setCalendars((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...editing } : c))
      );
      setEditing(null);
    }
    setBusy(false);
  }

  async function handleDelete(id: string) {
    setBusy(true);
    const res = await fetch("/api/admin/calendars", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setCalendars((prev) => prev.filter((c) => c.id !== id));
      setConfirmDelete(null);
    }
    setBusy(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen px-6 py-16" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: "var(--accent)" }} />
            <h1 className="font-display text-2xl font-bold text-navy">Calendar Sources</h1>
            <p className="text-stone text-sm mt-1">ICS feeds the booking tool checks for availability.</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-stone hover:text-navy transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Calendar list */}
        <div className="flex flex-col gap-4 mb-6">
          {calendars.length === 0 && (
            <p className="text-stone text-sm text-center py-8">No calendars configured.</p>
          )}

          {calendars.map((cal) =>
            editing?.id === cal.id ? (
              <div key={cal.id} className="bg-cream border border-terracotta rounded-2xl p-6 flex flex-col gap-3">
                <input
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                  placeholder="Label"
                  className="border border-pebble rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:border-terracotta bg-sand"
                />
                <input
                  value={editing.url}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="ICS URL"
                  className="border border-pebble rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:border-terracotta bg-sand font-mono"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={busy}
                    className="flex items-center gap-1.5 bg-terracotta text-cream text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    <Check size={12} /> Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex items-center gap-1.5 text-stone text-xs px-4 py-2 rounded-full border border-pebble hover:border-navy transition-colors"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={cal.id} className="bg-cream border border-pebble rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-navy text-sm mb-1">{cal.label}</p>
                    <p className="text-stone text-xs font-mono break-all leading-relaxed">{cal.url}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditing({ id: cal.id, label: cal.label, url: cal.url })}
                      className="p-2 rounded-lg hover:bg-light transition-colors text-stone hover:text-navy"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    {confirmDelete === cal.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(cal.id)}
                          disabled={busy}
                          className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition-colors disabled:opacity-60"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs text-stone px-2 py-1.5 hover:text-navy transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(cal.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-stone hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Add new */}
        {adding ? (
          <div className="bg-cream border border-dashed border-pebble rounded-2xl p-6 flex flex-col gap-3">
            <p className="font-display text-sm font-bold text-navy mb-1">Add calendar</p>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (e.g. Outlook, Google)"
              autoFocus
              className="border border-pebble rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:border-terracotta bg-sand"
            />
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="ICS URL"
              className="border border-pebble rounded-xl px-4 py-2.5 text-charcoal text-sm focus:outline-none focus:border-terracotta bg-sand font-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={busy || !newLabel.trim() || !newUrl.trim()}
                className="flex items-center gap-1.5 bg-terracotta text-cream text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Check size={12} /> Add
              </button>
              <button
                onClick={() => { setAdding(false); setNewLabel(""); setNewUrl(""); }}
                className="flex items-center gap-1.5 text-stone text-xs px-4 py-2 rounded-full border border-pebble hover:border-navy transition-colors"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 text-terracotta text-sm font-medium hover:gap-3 transition-all"
          >
            <Plus size={16} /> Add calendar
          </button>
        )}
      </div>
    </div>
  );
}
