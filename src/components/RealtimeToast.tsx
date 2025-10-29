import { pusherClient } from "@/src/lib/pusher";
import { useEffect } from "react";

export default function RealtimeToast({ channel, event }: { channel: string; event: string }) {
  useEffect(() => {
    if (!pusherClient) return;
    const ch = pusherClient.subscribe(channel);
    ch.bind(event, (data: any) => {
      // minimalistic toast
      const el = document.createElement('div');
      el.textContent = data?.message || 'Update received';
      el.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded shadow';
      document.body.appendChild(el);
      setTimeout(()=> el.remove(), 3000);
    });
    return () => {
      try { ch.unsubscribe(); } catch {}
    };
  }, [channel, event]);
  return null;
}

// 'use client';

// import { useEffect } from "react";
// import { pusherClient } from "@/src/lib/pusher";

// interface RealtimeToastProps {
//   channel: string;
//   event: string;
// }

// export default function RealtimeToast({ channel, event }: RealtimeToastProps) {
//   useEffect(() => {
//     if (!pusherClient) return;

//     // Check if already subscribed
//     let ch = pusherClient.channel(channel);
//     if (!ch) {
//       ch = pusherClient.subscribe(channel);
//     }

//     const handler = (data: any) => {
//       const el = document.createElement('div');
//       el.textContent = data?.message || 'Update received';
//       el.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded shadow';
//       document.body.appendChild(el);
//       setTimeout(() => el.remove(), 3000);
//     };

//     ch.bind(event, handler);

//     return () => {
//       ch.unbind(event, handler);
//       // Do NOT unsubscribe here if you want continuous notifications
//     };
//   }, [channel, event]);

//   return null;
// }
