"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pusherClient } from "@/src/lib/pusher";

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  seen: boolean;
};

const LS_KEY = "exhibitpro.notifications";

function loadFromStorage(): Notification[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw) as Notification[];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: Notification[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items.slice(0, 100))); } catch {}
}

export default function NotificationsClient() {
  const [items, setItems] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unseen">("all");
  const channelRef = useRef<any>(null);

  // load existing
  useEffect(() => { setItems(loadFromStorage()); }, []);

  // subscribe to pusher channel for exhibition creations
  useEffect(() => {
    if (!pusherClient) return;
    const client = pusherClient;
    channelRef.current = client.subscribe("exhibitions");
    const handler = (payload: any) => {
      const title = payload?.title || "New Exhibition";
      const id = String(payload?.exhibitionID || payload?.id || Date.now());
      const pretty: Notification = {
        id: `${id}-${Date.now()}`,
        title: `🎉 New Exhibition: ${title}`,
        message: `✨ "${title}" has just been published. Tap to explore and book your tickets now! 🎟️`,
        createdAt: Date.now(),
        seen: false,
      };
      setItems((prev) => {
        const next = [pretty, ...prev];
        saveToStorage(next);
        return next;
      });
    };
    channelRef.current.bind("created", handler);
    // Be tolerant of different server event names
    channelRef.current.bind("exhibition:created", handler);
    channelRef.current.bind("exhibitions:created", handler);
    return () => {
      try { channelRef.current?.unbind("created", handler); } catch {}
      try { channelRef.current?.unbind("exhibition:created", handler); } catch {}
      try { channelRef.current?.unbind("exhibitions:created", handler); } catch {}
      try { client.unsubscribe("exhibitions"); } catch {}
    };
  }, []);

  const unseenCount = useMemo(() => items.filter(i => !i.seen).length, [items]);
  const shown = useMemo(() => items.filter(i => (filter === "all" ? true : !i.seen)), [items, filter]);

  function markSeen(id: string) {
    setItems((prev) => {
      const next = prev.map(n => n.id === id ? { ...n, seen: true } : n);
      saveToStorage(next);
      return next;
    });
  }

  function markAllSeen() {
    setItems((prev) => {
      const next = prev.map(n => ({ ...n, seen: true }));
      saveToStorage(next);
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="font-semibold flex items-center gap-2">
          Notifications
          {unseenCount > 0 && (
            <span className="inline-flex items-center justify-center text-xs rounded-full bg-blue-600 text-white px-2 py-0.5">
              {unseenCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilter(filter === "all" ? "unseen" : "all")} className="text-xs rounded-md border border-slate-300 dark:border-slate-700 px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800">
            {filter === "all" ? "Show Unseen" : "Show All"}
          </button>
          <button onClick={markAllSeen} className="text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white px-2 py-1">Mark all seen</button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {shown.length === 0 && (
          <div className="text-sm text-slate-600 dark:text-slate-300 text-center">No notifications yet.</div>
        )}
        {shown.map((n) => (
          <div key={n.id} className={`rounded-lg border p-3 flex items-start gap-3 transition ${n.seen ? "border-slate-200 dark:border-slate-800" : "border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-slate-800/50"}`}>
            <div className="text-xl">📣</div>
            <div className="flex-1">
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{n.message}</div>
            </div>
            {!n.seen && (
              <button onClick={() => markSeen(n.id)} className="text-xs rounded-md border border-slate-300 dark:border-slate-700 px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800">Mark seen</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


