"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { NotConnectedNotice } from "@/components/admin/NotConnectedNotice";
import type { ContactMessage } from "@/types/database";

type Message = ContactMessage & { _file: string };

export function MessagesList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [notConnected, setNotConnected] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/messages");
    if (res.status === 401) {
      setNotConnected(true);
      setLoading(false);
      return;
    }
    const body = await res.json();
    setMessages((body.data as Message[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- admin-only client fetch-on-mount, not perf sensitive
    load();
  }, []);

  async function toggleRead(message: Message) {
    const next = !message.read;
    setMessages((prev) => prev.map((m) => (m._file === message._file ? { ...m, read: next } : m)));
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: message._file, read: next }),
    });
  }

  async function remove(message: Message) {
    if (!confirm("Nachricht wirklich löschen?")) return;
    await fetch(`/api/admin/messages?file=${encodeURIComponent(message._file)}`, {
      method: "DELETE",
    });
    setMessages((prev) => prev.filter((m) => m._file !== message._file));
  }

  if (notConnected) return <NotConnectedNotice />;
  if (loading) return <p className="text-[var(--color-ink-muted)]">Wird geladen …</p>;
  if (messages.length === 0)
    return <p className="text-[var(--color-ink-muted)]">Noch keine Nachrichten eingegangen.</p>;

  return (
    <ul className="flex flex-col gap-3">
      {messages.map((message) => (
        <li
          key={message._file}
          className="rounded-[var(--radius-md)] border border-[var(--color-beige)] bg-[var(--color-paper)] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-[var(--color-ink)]">
                {message.subject}{" "}
                {!message.read && (
                  <span className="ml-1 rounded-full bg-[var(--color-terracotta)]/15 px-2 py-0.5 text-xs text-[var(--color-terracotta-dark)]">
                    neu
                  </span>
                )}
              </p>
              <p className="text-sm text-[var(--color-ink-muted)]">
                {message.name} · {message.email}
                {message.phone ? ` · ${message.phone}` : ""}
              </p>
              <p className="text-xs text-[var(--color-ink-muted)]">
                {new Date(message.created_at).toLocaleString("de-CH")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => toggleRead(message)}
                aria-label={message.read ? "Als ungelesen markieren" : "Als gelesen markieren"}
                className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                {message.read ? <MailOpen size={18} /> : <Mail size={18} />}
              </button>
              <button
                onClick={() => remove(message)}
                aria-label="Löschen"
                className="text-[var(--color-ink-soft)] hover:text-[var(--color-error)]"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-[var(--color-ink-soft)]">
            {message.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
