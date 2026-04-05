"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";

export default function LoginPage() {
	const router = useRouter();
	const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
	const isTurnstileConfigured = turnstileSiteKey.length > 0;
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!isTurnstileConfigured) {
			setError("Turnstile is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your environment.");
			setLoading(false);
			return;
		}

		if(!turnstileToken) {
			setError("Please complete the captcha.");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password, turnstileToken }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError("Login failed: " + (data.error || "Unknown error"));
				setLoading(false);
				return;
			}

			router.push("/admin");
			router.refresh();
		} catch (err) {
			setError("An error occurred. Please try again.");
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
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Log in with your admin email and password.</p>

					<form onSubmit={onSubmit} className="mt-8 space-y-4">
						<div>
							<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
								required
								className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
							/>
						</div>

						<div>
							<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
								required
								className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
							/>
						</div>

						{error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
						
						<div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
							{isTurnstileConfigured ? (
								<Turnstile
									className="mx-auto"
									siteKey={turnstileSiteKey}
									options={{
										size: "flexible",
										theme: "auto",
										appearance: "interaction-only",
									}}
									onSuccess={(token) => setTurnstileToken(token)}
									onExpire={() => setTurnstileToken(null)}
									onError={() => setTurnstileToken(null)}
								/>
							) : (
								<p className="text-sm text-amber-700 dark:text-amber-400">
									Turnstile site key ontbreekt. Zet NEXT_PUBLIC_TURNSTILE_SITE_KEY in je env.
								</p>
							)}
						</div>
					
						<motion.button
							type="submit"
							disabled={loading || !isTurnstileConfigured}
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
