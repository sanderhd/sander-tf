"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

type Props = {
  onCreated?: () => void;
};

export default function AdminProfileForm({ onCreated }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        setMessage(await res.text());
        return;
      }

      setEmail("");
      setPassword("");
      setRole("USER");
      setMessage("User registered successfully.");
      onCreated?.();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700/70 dark:bg-slate-900/40">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Register User</h2>

      <div>
        <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
        />
      </div>

      <div>
        <label htmlFor="register-role" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Role
        </label>
        <select
          id="register-role"
          value={role}
          onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
          className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </motion.button>
    </form>
  );
}
