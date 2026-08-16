import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

interface EmailLoginProps {
  mode?: 'login' | 'signup';
  onSubmit?: (email: string, password: string) => Promise<void>;
  error?: string | null;
}

export default function EmailLogin({ mode = 'login', onSubmit, error }: EmailLoginProps) {
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  // PASSWORD AUTH SUBMIT HANDLER
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return;

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(cleanEmail, password);
      }
    } catch (err: any) {
      setLocalError(err?.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Global Error Banner */}
      {displayError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 text-center bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3 leading-relaxed"
        >
          {displayError}
        </motion.p>
      )}

      {/* EMAIL & PASSWORD LOGIN FORM */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLocalError(null); }}
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              minLength={6}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLocalError(null); }}
              placeholder="••••••••••••"
              className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !email || !password}
          whileHover={loading ? undefined : { scale: 1.01, y: -1 }}
          whileTap={loading ? undefined : { scale: 0.99 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl 
            bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-bold 
            shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(236,72,153,0.5)] 
            border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <ArrowRight size={16} />
              <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
