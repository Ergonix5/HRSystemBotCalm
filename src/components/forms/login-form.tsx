'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../app/store/authStore';
import { Mail, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative px-4 font-sans">
      {/* Login Card */}
      <div className="relative w-full max-w-sm z-10">
        <div className="bg-white p-8 md:p-10 border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Header */}
          <div className="flex flex-col mb-8 text-center items-center">
            <div className="w-10 h-10 bg-black flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-black uppercase tracking-tighter">
              Welcome
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-black text-black uppercase tracking-[0.2em]">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@domain.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:bg-gray-50 text-black placeholder-gray-300 font-medium text-sm transition-colors"
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-[10px] font-black text-black uppercase tracking-[0.2em]">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-none focus:outline-none focus:bg-gray-50 text-black placeholder-gray-300 font-medium text-sm transition-colors"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-white bg-black p-3 border-l-4 border-red-500 text-[10px] font-bold uppercase">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 px-4 rounded-none hover:invert active:translate-x-0.5 active:translate-y-0.5 transition-all font-black text-xs uppercase tracking-[0.3em]"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}