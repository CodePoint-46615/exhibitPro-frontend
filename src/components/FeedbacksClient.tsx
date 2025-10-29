"use client";

import { api } from "@/src/lib/api";
import { updateFeedbackSchema, createFeedbackSchema } from "@/src/lib/validation";
import { useEffect, useState } from "react";

function FeedbackCard({ fb, onUpdated }: { fb: any; onUpdated: () => void }) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState<number>(fb.rating);
  const [comment, setComment] = useState<string>(fb.comment);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const parsed = updateFeedbackSchema.safeParse({ rating, comment });
    if (!parsed.success) return setError(parsed.error.errors[0]?.message || "Invalid");
    await api.patch(`/customer/feedbacks/${fb.feedbackID}`, { rating, comment });
    setEditing(false);
    onUpdated();
  };

  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="font-medium">{fb.exhibition?.title}</div>
      {!editing ? (
        <>
          <div className="text-sm">Rating: {fb.rating} / 5</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">{fb.comment}</div>
          <div className="mt-2">
            <button onClick={() => setEditing(true)} className="rounded bg-blue-600 text-white px-3 py-1 text-sm">Edit</button>
          </div>
        </>
      ) : (
        <div className="space-y-2 mt-2">
          <div>
            <label className="text-sm mr-2">Rating</label>
            <input type="number" min={1} max={5} value={rating} onChange={e=>setRating(parseInt(e.target.value))} className="border rounded px-2 py-1 w-20" />
          </div>
          <div>
            <label className="text-sm mr-2">Comment</label>
            <input value={comment} onChange={e=>setComment(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-2">
            <button onClick={save} className="rounded bg-green-600 text-white px-3 py-1 text-sm">Save</button>
            <button onClick={()=>setEditing(false)} className="rounded bg-slate-200 dark:bg-slate-700 px-3 py-1 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewFeedbackForm({ exhibitions, onCreated }: { exhibitions: any[]; onCreated: () => void }) {
  const [exhibitionID, setExhibitionID] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1];
    const customerID = token ? JSON.parse(atob(token.split('.')[1])).sub : undefined;
    const body = { exhibitionID, customerID, rating, comment } as any;
    const parsed = createFeedbackSchema.safeParse(body);
    if (!parsed.success) return setError(parsed.error.errors[0]?.message || "Invalid input");
    await api.post("/customer/feedbacks", body);
    setExhibitionID(""); setRating(5); setComment("");
    onCreated();
  };

  return (
    <form onSubmit={submit} className="rounded-lg border p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3">
      <div className="text-sm font-medium">Create Feedback</div>
      <div className="grid sm:grid-cols-3 gap-3">
        <select value={exhibitionID} onChange={e=>setExhibitionID(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Select Exhibition</option>
          {exhibitions.map((ex:any)=> <option key={ex.exhibitionID} value={ex.exhibitionID}>{ex.title}</option>)}
        </select>
        <input type="number" min={1} max={5} value={rating} onChange={e=>setRating(parseInt(e.target.value))} className="border rounded px-3 py-2" placeholder="Rating 1-5" />
        <input value={comment} onChange={e=>setComment(e.target.value)} className="border rounded px-3 py-2" placeholder="Comment" />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button className="rounded bg-blue-600 text-white px-4 py-2 text-sm">Submit</button>
    </form>
  );
}

export default function FeedbacksClient() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [f, e] = await Promise.all([
        api.get("/customer/feedbacks"),
        api.get("/customer/exhibitions"),
      ]);
      setFeedbacks(f.data || []);
      setExhibitions(e.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <NewFeedbackForm exhibitions={exhibitions} onCreated={() => load()} />
      <div className="grid gap-3">
        {feedbacks.map((fb: any) => (
          <FeedbackCard key={fb.feedbackID} fb={fb} onUpdated={() => load()} />
        ))}
      </div>
    </div>
  );
}

