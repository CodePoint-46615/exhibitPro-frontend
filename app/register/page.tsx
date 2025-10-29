"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const fullNameSchema = z
  .string()
  .min(2)
  .max(150)
  .refine((v) => /^[A-Za-z\s'-]+$/.test(v), { message: "Full name must contain only letters and spaces" })
  .refine((v) => v.trim().split(/\s+/).length >= 2, { message: "Full name must contain at least two words" })
  .refine((v) => v.trim().split(/\s+/).every((w) => /^[A-Z][a-zA-Z'-]*$/.test(w)), { message: "Each word must start with a capital letter" })
  .refine((v) => v.trim().split(/\s+/).length <= 50, { message: "Too many words" });

const passwordSchema = z
  .string()
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]|:";'<>?,./]).{8,}$/, "Password too weak");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  fullName: fullNameSchema,
  email: z.string().email(),
  password: passwordSchema,
  role: z.enum(["admin", "host", "customer"]),
});

type RegisterForm = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "host" | "customer";
};

const countries = [
  { code: "BD", dial: "+880", label: "🇧🇩" },
  { code: "IN", dial: "+91", label: "🇮🇳" },
  { code: "PK", dial: "+92", label: "🇵🇰" },
  { code: "US", dial: "+1", label: "🇺🇸" },
  { code: "UK", dial: "+44", label: "🇬🇧" },
  { code: "CA", dial: "+1", label: "🇨🇦" },
  { code: "AU", dial: "+61", label: "🇦🇺" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [mode] = useState<"login" | "register">("register");

  // login state (to keep single UI structure consistent)
  const [lemail, setLemail] = useState("");
  const [lpassword, setLpassword] = useState("");
  const [lerror, setLerror] = useState<string | null>(null);
  const [lloading, setLloading] = useState(false);

  // register state
  const [rform, setRform] = useState<RegisterForm>({ fullName: "", email: "", phone: "", password: "", role: "customer" });
  const [country, setCountry] = useState<string>("BD");
  const [rerror, setRerror] = useState<string | null>(null);
  const [rloading, setRloading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLerror(null);
    const parsed = loginSchema.safeParse({ email: lemail, password: lpassword });
    if (!parsed.success) {
      setLerror(parsed.error.errors[0]?.message || "Invalid input");
      return;
    }
    setLloading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, { email: lemail, password: lpassword });
      const token = res.data?.access_token as string;
      if (!token) throw new Error("No token returned");
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 6}`;
      router.replace("/dashboard");
    } catch (err: any) {
      setLerror(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLloading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRerror(null);

    const base = registerSchema.safeParse({ fullName: rform.fullName, email: rform.email, password: rform.password, role: rform.role });
    if (!base.success) {
      setRerror(base.error.errors[0]?.message || "Invalid input");
      return;
    }

    const selected = countries.find((c) => c.code === country)!;
    const raw = `${selected.dial}${rform.phone}`.replace(/\s+/g, "");
    const phoneObj = parsePhoneNumberFromString(raw);
    if (!phoneObj || !phoneObj.isValid()) {
      setRerror("Invalid phone number for selected country");
      return;
    }

    setRloading(true);
    try {
      const e164 = phoneObj.number;
      const payload = {
        fullName: rform.fullName.trim(),
        email: rform.email.trim(),
        phone: Number(e164.replace("+", "")),
        password: rform.password,
        role: rform.role,
      };
      await axios.post(`${API_BASE_URL}/users`, payload, { headers: { "Content-Type": "application/json" } });
      router.replace("/login");
      setLemail(rform.email);
    } catch (err: any) {
      setRerror(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setRloading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

      {/* decorative background graphic */}
      <svg className="pointer-events-none absolute -top-20 -right-20 w-[600px] h-[600px] opacity-20 blur-3xl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#60a5fa" d="M46.5,-57.6C59.8,-49.9,70.8,-38.2,76.1,-24.5C81.5,-10.7,81.2,5,74.2,18.8C67.2,32.6,53.4,44.5,38.8,54.3C24.3,64.1,8.9,71.7,-6.8,79.6C-22.6,87.5,-45,95.7,-58.7,87.1C-72.4,78.5,-77.3,53.1,-79.5,31.1C-81.7,9,-81.1,-9.7,-74.3,-24.1C-67.6,-38.5,-54.7,-48.7,-41.3,-56.2C-27.9,-63.6,-13.9,-68.2,0.3,-68.6C14.5,-68.9,28.9,-65.2,46.5,-57.6Z" transform="translate(100 100)" />
      </svg>

      <div className="relative w-full max-w-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-blue-100 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden">

        {/* image section */}
        <a href="http://localhost:5000">
          <img src="/avatar/logo-removebg-preview.png" alt="" className="border w-[100px] h-[100px] m-4 mx-auto bg-white rounded-2xl hover:cursor-pointer" />
        </a>

        {/* Buttons */}
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50 dark:bg-slate-800">
          <div className="flex-1 flex">
            <button onClick={() => router.replace("/login")} className={`hover:cursor-pointer flex-1 py-3 text-center font-medium ${mode === "login" ? "bg-blue-600 text-white" : "text-slate-800 dark:text-slate-200"}`}>Login</button>

            <button onClick={() => router.replace("/register")} className={`hover:cursor-pointer flex-1 py-3 text-center font-medium ${mode === "register" ? "bg-blue-600 text-white" : "text-slate-800 dark:text-slate-200"}`}>Register</button>
          </div>
        </div>

        {/* Registration form */}
        <form onSubmit={handleRegister} className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" value={rform.fullName} onChange={(e) => setRform((p) => ({ ...p, fullName: e.target.value }))} placeholder="e.g. Saikot Kundu" className="w-full rounded-lg border px-4 py-2.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={rform.email} onChange={(e) => setRform((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="w-full rounded-lg border px-4 py-2.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <div className="flex gap-2">
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-lg border px-3 py-2.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.label} {c.dial}</option>
                ))}
              </select>
              <input name="phone" inputMode="numeric" value={rform.phone} onChange={(e) => setRform((p) => ({ ...p, phone: e.target.value }))} placeholder="Mobile number" className="flex-1 rounded-lg border px-4 py-2.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Digits vary by country. Use your local mobile number without leading 0.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={rform.password} onChange={(e) => setRform((p) => ({ ...p, password: e.target.value }))} placeholder="••••••" className="w-full rounded-lg border px-4 py-2.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
          </div>

          <div>
            <div className="block text-sm font-medium mb-2">Role</div>
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="role" value="admin" checked={rform.role === "admin"} onChange={() => setRform((p) => ({ ...p, role: "admin" }))} />
                <span>Admin</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="role" value="host" checked={rform.role === "host"} onChange={() => setRform((p) => ({ ...p, role: "host" }))} />
                <span>Host</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="role" value="customer" checked={rform.role === "customer"} onChange={() => setRform((p) => ({ ...p, role: "customer" }))} />
                <span>Customer</span>
              </label>
            </div>
          </div>

          {rerror && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{rerror}</div>}
          <button disabled={rloading} className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2.5">{rloading ? "Submitting..." : "Register"}</button>
        </form>
      </div>
    </div>
  );
}

