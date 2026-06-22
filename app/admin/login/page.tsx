"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import BrandMark from "@/components/BrandMark";

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = getBrowserClient();

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError("Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-5 py-12">
      <BrandMark className="mb-8" />
      <p className="label">ADMIN</p>
      <h1 className="heading mt-3 text-2xl">Sign in</h1>
      <p className="mt-2 text-sm text-muted">The Offer Blueprint dashboard.</p>

      <form className="mt-7 space-y-4" onSubmit={signIn}>
        <label className="block">
          <span className="label-muted mb-1.5 block">Email</span>
          <input
            className="field"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="label-muted mb-1.5 block">Password</span>
          <input
            className="field"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p className="rounded-sheet border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
