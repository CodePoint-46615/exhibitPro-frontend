# ExhibitPro Frontend (Customer)

Tech stack: Next.js App Router, TailwindCSS v4, Axios, Zod, PusherJS, Font Awesome (CDN).

ExhibitPro Frontend (Customer) is a Next.js-based web application designed for customers to manage exhibitions, bookings, feedback, and profiles through a secure dashboard. It features real-time updates via PusherJS, API communication with Axios, and robust form validation using Zod. Styled with TailwindCSS v4, the app ensures a responsive and modern user experience aligned with backend DTOs.

Env vars (.env.local):
- NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
- NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
- NEXT_PUBLIC_PUSHER_CLUSTER=ap2

Scripts:
- npm run dev (port 5000)
- npm run build
- npm start

Routes overview:
- /login, /register
- /dashboard (protected via middleware)
  - /dashboard/exhibitions, /dashboard/exhibitions/[id]
  - /dashboard/bookings, /dashboard/bookings/new
  - /dashboard/feedbacks
  - /dashboard/profile

Notes:
- No extra fields are added beyond backend DTOs.
- Axios client sends Authorization: Bearer <token> from cookie.
- Validation uses Zod per backend DTOs.
- Font Awesome icons via CDN in app/layout.tsx.
- Add Pusher keys to enable realtime; wire channels to your backend events as needed.
