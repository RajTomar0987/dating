import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

interface EmailLoginProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
}

export default function EmailLogin({ mode, onSubmit, error }: EmailLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (mode === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setLocalError('');

    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={`${mode}-email`} className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            id={`${mode}-email`}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setLocalError(''); }}
            placeholder="you@example.com"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${mode}-password`} className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
          {mode === 'signup' ? 'Create Password' : 'Password'}
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            id={`${mode}-password`}
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            minLength={6}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
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
        {mode === 'signup' && (
          <p className="text-[10px] text-white/30 mt-1.5 ml-1">Minimum 6 characters</p>
        )}
      </div>

      {displayError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 text-center py-1"
        >
          {displayError}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={loading || !email || !password}
        whileHover={loading ? undefined : { scale: 1.01, y: -1 }}
        whileTap={loading ? undefined : { scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
          bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-medium 
          shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(236,72,153,0.5)] 
          border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <ArrowRight size={16} />
            <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
          </>
        )}
      </motion.button>
    </form>
  );
}
