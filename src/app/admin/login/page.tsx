'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input, Button, Toast } from '@/components/ui';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c2424] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Public Site Link */}
      <div className="w-full max-w-md mb-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-teal-200/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Interactive Minds Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-200/90 space-y-6 z-10 relative">
        {/* Header / Brand */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center">
            <div className="relative w-[160px] sm:w-[180px] h-[52px] sm:h-[58px] overflow-hidden flex items-center justify-center">
              <Image
                src="/images/interactive-minds-logo.webp"
                alt="Interactive Minds"
                width={180}
                height={180}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-750 block mb-1">
              Restricted Operations
            </span>
            <h1 className="font-serif-heading text-2xl font-bold text-brand-950 tracking-tight">
              Clinical Admin Portal
            </h1>
            <p className="text-xs text-stone-600 font-medium mt-1">
              Sign in with your authorized credentials to access management tools.
            </p>
          </div>
        </div>

        {errorMsg && <Toast type="error" message={errorMsg} onClose={() => setErrorMsg(null)} />}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <Input
            label="Authorized Email"
            type="email"
            name="email"
            id="admin-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            id="admin-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <div className="pt-2">
            <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
              <Lock className="w-4 h-4 mr-2 shrink-0" />
              <span>Sign In to Dashboard</span>
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-stone-600 text-[11px] font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
          <span>Interactive Minds Child Development Centre • Patna</span>
        </div>
      </div>
    </div>
  );
}
