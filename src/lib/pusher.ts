import Pusher from "pusher-js";

export const pusherClient = typeof window !== "undefined" && process.env.NEXT_PUBLIC_PUSHER_KEY
  ? new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
      authEndpoint: undefined,
    })
  : null;

