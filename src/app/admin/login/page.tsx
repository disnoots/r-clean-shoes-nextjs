"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Gagal masuk.");
    }
  };

  const inputCls =
    "w-full rounded-[10px] border-[1.5px] border-[#b9c7d9] bg-white px-3 py-3 text-ink";

  return (
    <div className="flex min-h-screen items-center justify-center bg-foam p-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-extrabold text-navy">Admin · R Clean Shoes</h1>
        <p className="mt-1 mb-6 text-sm text-mute">
          Masuk untuk mengelola pesanan dan pengaturan.
        </p>

        <label className="mb-4 grid gap-1.5 text-sm font-bold">
          Username
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            className={inputCls}
          />
        </label>
        <label className="mb-2 grid gap-1.5 text-sm font-bold">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={inputCls}
          />
        </label>

        {error ? <p className="mb-2 text-sm font-medium text-[#b3261e]">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full cursor-pointer rounded-[10px] bg-navy py-3 font-bold text-white disabled:opacity-60"
        >
          {loading ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}