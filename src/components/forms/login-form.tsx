'use client';
import '../styles/form-animations.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../app/store/authStore';
import { Mail, Lock, Loader2, ShieldCheck, AlertCircle, Eye, EyeOff, ChevronRight} from 'lucide-react';
import LoginBackground from '../ui/LoginBackground';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { login, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle fake loading progress
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>; 
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
      }, 200);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  if (!isMounted) return null;

  return (
<div className="fixed inset-0 flex items-center justify-center px-4 font-mono text-slate-800">
      
      {/* Background Layer */}
    <LoginBackground/>

      <div className="relative w-full max-w-[420px] z-10">
       

        <div className="relative bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex h-1.5 w-full">
            <div className="flex-1 bg-[#B91434]" />
            <div className="w-12 bg-slate-100" />
            <div className="w-4 bg-slate-800" />
          </div>

          <div className="p-6 md:p-10 relative">
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-slate-200" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-slate-200" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-slate-200" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-slate-200" />

            {/* Header */}
            <div className="mb-8 flex justify-between items-start mt-8">
              <div>
                <h1 className="text-3xl font-[900] text-slate-900 uppercase tracking-tighter leading-none italic">
                 
                  <span className="text-[#B91434] not-italic">SIGN_IN</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-[2px] w-6 bg-slate-800" />
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                    Enter the details to access  account
                  </p>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-sm">
                <ShieldCheck size={20} className="text-[#B91434]" />
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group relative">
                <label className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                  <span> Email</span>
                
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#B91434] transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="ADMIN@STATION.INFO"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white outline-none transition-all text-sm font-bold text-slate-900 placeholder-slate-300 tracking-wider"
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#B91434] transition-all duration-300 group-focus-within:w-full" />
                </div>
              </div>

              {/* Password Field */}
              <div className="group relative">
                <label className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                  <span>Password</span>
                
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#B91434] transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white outline-none transition-all text-sm font-bold text-slate-900 placeholder-slate-300 tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#B91434] transition-all duration-300 group-focus-within:w-full" />
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <div className="bg-white border-l-4 border-[#B91434] shadow-sm text-[#B91434] p-3 text-[9px] font-black flex items-center gap-2.5 animate-shake">
                  <div className="p-1 bg-[#B91434] text-white">
                    <AlertCircle size={12} />
                  </div>
                  <span className="tracking-widest">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden group w-full mb-10  bg-slate-900  text-white py-4 px-6 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-2.5 font-black text-[10px] uppercase tracking-[0.3em] relative z-10 ">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating... {Math.round(progress)}%
                      </>
                    ) : (
                      <>
                        LOGIN
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0  bg-[#B91434] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                </button>
              </div>
            </form>

            
          </div>
        </div>

      </div>

    </div>
  );
}
