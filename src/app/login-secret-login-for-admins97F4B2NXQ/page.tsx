'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      const { error: msg } = await res.json();
      setError(msg || 'Login failed');
      setPw('');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[--brand-accent] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 border border-gray-200"
      >
        <div className="text-center">
          <div className="text-black font-bold text-3xl mb-1 tracking-tight ">
            Scents & Suites
          </div>
          <p className="text-sm text-gray-500">Admin Login</p>
        </div>

        <input
          type="password"
          placeholder="Enter Admin Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[--brand-secondary] text-sm"
          required
        />

        <button
          type="submit"
          className="w-full bg-[--brand-secondary] hover:brightness-110 text-white py-2 rounded-lg font-semibold transition"
        >
          Login
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm font-medium">{error}</p>
        )}
      </form>
    </main>
  );
}
