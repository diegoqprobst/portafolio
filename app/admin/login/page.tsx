"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Credenciales incorrectas");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-black tracking-tighter gradient-text">
            DQ
          </a>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30 uppercase tracking-widest">
            <Zap className="w-3 h-3 text-electric" />
            Admin
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-electric/50 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-electric/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
