import BookingsClient from "@/src/components/BookingsClient";

export default function BookingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">My Bookings</h1>
      <BookingsClient />
    </div>
  );
}

