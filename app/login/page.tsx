"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
	const router = useRouter();

	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError("Inloggen mislukt. Controleer je wachtwoord.");
				setLoading(false);
				return;
			}

			router.push("/admin");
			router.refresh();
		} catch (err) {
			setError("Er is een fout opgetreden. Probeer het opnieuw.");
			setLoading(false);
		}
	}

	return (
		<main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
			<div className="pointer-events-none absolute inset-0 overflow-hidden bg-white dark:bg-gray-950">
				<div className="absolute inset-0 bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950" />
				<div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/20" />
				<div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-800/20" />

				<div className="absolute inset-0 opacity-55 dark:opacity-40">
					<svg width="100%" height="100%" className="text-slate-500 dark:text-slate-500">
						<pattern id="tech-pattern-login" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
							<circle cx="18" cy="18" r="1.5" fill="currentColor" />
						</pattern>
						<rect width="100%" height="100%" fill="url(#tech-pattern-login)" />
					</svg>
				</div>

				<div className="absolute bottom-0 right-0 h-1/2 w-full bg-linear-to-t from-blue-100/30 to-transparent dark:from-blue-900/15 dark:to-transparent" />
			</div>

			<section className="relative z-10 w-full max-w-md">
				<motion.div
					initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
					className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/75"
				>
					<h1 className="font-mono text-3xl tracking-tight text-gray-900 dark:text-white">Login</h1>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Voer het admin wachtwoord in.</p>

					<form onSubmit={onSubmit} className="mt-8 space-y-4">
						<div>
							<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
								Wachtwoord
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
							/>
						</div>

						{error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

						<motion.button
							type="submit"
							disabled={loading}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
						>
							{loading ? "Logging in..." : "Log in"}
						</motion.button>
					</form>
				</motion.div>
			</section>
		</main>
	);
}
