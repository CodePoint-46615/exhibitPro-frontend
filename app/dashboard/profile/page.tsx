"use client";

import { api } from "@/src/lib/api";
import { useEffect, useMemo, useState } from "react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <img src="/avatar/logo.png" alt="Avatar" className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800" />
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
      </div>
      <ProfileClient />
    </div>
  );
}

function useUserId() {
  return useMemo(() => {
    try {
      const token = document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1];
      return token ? JSON.parse(atob(token.split('.')[1])).sub : null;
    } catch { return null; }
  }, []);
}

function ProfileClient() {
  const uid = useUserId();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!uid) return;
      try {
        const me = (await api.get(`/users/${uid}`)).data;
        setEmail(me.email || "");
        setFullName(me.fullName || "");
        setPhone(String(me.phone || ""));
      } catch { }
    })();
  }, [uid]);

  async function save() {
    setMessage(null);
    try {
      const payload: any = { email, fullName, phone: Number(phone), password: password || "changeme1" };
      await api.put(`/users/${uid}`, payload);
      setMessage("Saved");
      setPassword("");
    } catch (e: any) {
      setMessage(e?.response?.data?.message || e.message || "Failed to save");
    }
  }

  return (
    <div className="space-y-4">

      {/* profile settings */}
      <div className="rounded-xl border p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} className="border rounded-lg px-3 py-2.5 w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border rounded-lg px-3 py-2.5 w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
            </div>
          </div>

          {/* password and phone */}
          <div className="grid sm:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="border rounded-lg px-3 py-2.5 w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
            </div>
          </div>
        </div>
        {message && <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{message}</div>}

        {/* save and reset buttons */}
        <div className="mt-4 flex gap-3">
          <button onClick={save} className="hover:cursor-pointer w-1/2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm">Save</button>
          <button onClick={() => { setFullName(""); setEmail(""); setPhone(""); setPassword(""); }} className="hover:cursor-pointer w-1/2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Reset</button>
        </div>
      </div>
      <PasswordChange />
      {/* <DeleteAccount /> */}
    </div>
  );
}

// password change component
function PasswordChange() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // submit function to change the password
  async function submit() {
    setMsg(null);
    try {
      const token = document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1];
      const uid = token ? JSON.parse(atob(token.split('.')[1])).sub : undefined;

      await api.post(`/users/${uid}/change-password`, {
        currentPassword,
        newPassword
      });

      // ✅ Invalidate session
      document.cookie = "token=; path=/; max-age=0; secure; samesite=strict";

      setMsg("Password changed. Logging out...");

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch (e: any) {
      setMsg(e?.response?.data?.message || e.message || "Failed");
    }
  }


  return (
    <div className="rounded-xl border p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
      <div className="font-medium">Change Password</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrent(e.target.value)} className="border rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
        <input type="password" placeholder="New password" value={newPassword} onChange={e => setNew(e.target.value)} className="border rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
      </div>
      {msg && <div className="text-sm text-slate-600">{msg}</div>}
      <button onClick={submit} className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm">Update Password</button>
    </div>
  );
}

// function DeleteAccount() {
//   const [msg, setMsg] = useState<string | null>(null);
//   async function remove() {
//     if (!confirm("This will delete your account. Continue?")) return;
//     try {
//       const token = document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1];
//       const uid = token ? JSON.parse(atob(token.split('.')[1])).sub : undefined;
//       await api.delete(`/users/${uid}`);
//       document.cookie = "token=; path=/; max-age=0";
//       window.location.href = "/register";
//     } catch (e: any) {
//       setMsg(e?.response?.data?.message || e.message || "Failed to delete");
//     }
//   }
//   return (
//     <div className="rounded-xl border p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
//       <div className="font-medium mb-2">Danger Zone</div>
//       <button onClick={remove} className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-sm">Delete my account</button>
//       {msg && <div className="text-sm text-red-600 mt-2">{msg}</div>}
//     </div>
//   );
// }

