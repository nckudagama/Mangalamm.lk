"use client";

import { useEffect, useState } from "react";
import AppShell from "../app-shell";
import { api } from "../../lib/api";

type Thread = { match_id: string; user_id: string; conversation_id?: string | null; last_message?: string | null };
type Message = { id: string; content: string; role: string; created_at: string };

export default function Messages() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { api<Thread[]>("/api/v1/messages").then((rows) => { setThreads(rows); if (rows[0]) setActive(rows[0]); }).catch((e) => setError(e.message)); }, []);
  useEffect(() => { if (active) api<Message[]>(`/api/v1/messages/${active.match_id}`).then(setMessages).catch(() => undefined); }, [active]);

  async function send() {
    if (!active || !draft.trim()) return;
    const text = draft.trim(); setDraft("");
    try {
      const m = await api<Message>(`/api/v1/messages/${active.match_id}`, { method: "POST", body: JSON.stringify({ content: text }) });
      setMessages((rows) => [...rows, m]);
      setThreads((rows) => rows.map((r) => r.match_id === active.match_id ? { ...r, last_message: text } : r));
    } catch (e) { setError(e instanceof Error ? e.message : "Could not send message"); }
  }

  return <AppShell><main className="mx-auto max-w-5xl px-4 py-8 md:py-12"><p className="font-sans text-xs uppercase tracking-[.2em] text-[#a6535e]">Messages</p><h1 className="mt-2 text-4xl sm:text-5xl">Conversations.</h1>{error && <p className="mt-4 font-sans text-sm text-[#a6535e]">{error}</p>}<div className="mt-8 grid min-h-[520px] overflow-hidden rounded-[28px] border border-[#e3d5cd] bg-white md:grid-cols-[280px_1fr]">
    <aside className="border-b border-[#e3d5cd] p-4 md:border-b-0 md:border-r">{threads.length ? threads.map((t) => <button key={t.match_id} onClick={() => setActive(t)} className={`mb-2 w-full rounded-2xl p-4 text-left ${active?.match_id === t.match_id ? "bg-[#efe3d7]" : "bg-[#fbf7f2]"}`}><p className="font-sans text-xs text-[#756b69]">Matched member</p><p className="mt-1 text-sm">{t.last_message || "Start the conversation"}</p></button>) : <p className="p-3 font-sans text-sm text-[#756b69]">Mutual matches will appear here.</p>}</aside>
    <section className="flex min-h-[520px] flex-col">{active ? <><div className="border-b border-[#e3d5cd] p-5"><p className="font-sans text-xs text-[#756b69]">Mutual match</p><h2 className="mt-1 text-xl">A new connection</h2></div><div className="flex-1 space-y-3 overflow-y-auto p-5">{messages.map((m) => <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "USER" ? "ml-auto bg-[#231f20] text-white" : "bg-[#efe3d7]"}`}>{m.content}</div>)}</div><div className="flex gap-2 border-t border-[#e3d5cd] p-4"><input className="field" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Write a message…" /><button onClick={send} className="rounded-2xl bg-[#231f20] px-5 font-sans text-sm text-white">Send</button></div></> : <div className="m-auto p-8 text-center"><h2 className="text-2xl">Your conversations will live here.</h2><p className="mt-2 font-sans text-sm text-[#756b69]">A chat opens after two people express mutual interest.</p></div>}</section>
  </div></main></AppShell>;
}
