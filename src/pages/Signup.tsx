import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GoogleButton from '../components/auth/GoogleButton';
import { useAuth } from '../auth/useAuth';

export default function Signup() {
  const navigate = useNavigate();
  const { signupWithEmail, loginWithGoogle, error: authContextError, clearError } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const displayError = formError || authContextError;

  // ----------------------------------------------------
  // EMAIL + PASSWORD SIGNUP HANDLER
  // ----------------------------------------------------
  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must meet the required security rules (at least 6 characters).');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signupWithEmail(cleanEmail, password);
      // AuthProvider establishes session & GuestRoute redirects to /onboarding
    } catch (err: any) {
      console.error('[SIGNUP] Email signup error:', err);
      const msg = err?.message || '';
      if (msg.includes('already exists') || msg.includes('already-in-use')) {
        setFormError('An account with this email already exists. Please sign in instead.');
      } else {
        setFormError(msg || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // GOOGLE SIGNUP HANDLER
  // ----------------------------------------------------
  const handleGoogleSignup = async () => {
    clearError();
    setFormError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('[SIGNUP] Google signup error:', err);
      setFormError(err?.message || 'Google sign-up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-luxury flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/20 via-accent/15 to-purple-800/10 blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-[300px] h-[300px] rounded-full bg-pink-600/10 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[440px] w-full relative z-10"
      >
        <GlassCard className="p-8 md:p-10 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]" hoverEffect={false}>
          {/* Header */}
          <div className="text-center mb-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 mb-4 group px-3 py-1.5 rounded-2xl hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Heart className="text-white fill-white" size={18} />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider">
                AURA<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Create Your Aura Account
            </h1>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Join the next generation of relationship intelligence.
            </p>
          </div>

          {/* Error Feedback Alert */}
          <AnimatePresence mode="wait">
            {displayError && (
              <motion.div
                key="error-alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center leading-relaxed"
              >
                {displayError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMAIL + PASSWORD SIGNUP FORM */}
          <form onSubmit={handlePasswordSignup} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-1.5 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFormError(null); }}
                  placeholder="Alex Morgan"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError(null); }}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-white/30 mt-1 ml-1 font-mono">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-1.5 font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setFormError(null); }}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !name || !email || !password || !confirmPassword}
              whileHover={loading ? undefined : { scale: 1.01, y: -1 }}
              whileTap={loading ? undefined : { scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl 
                bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-bold 
                shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.55)] 
                border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <ArrowRight size={16} />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Social Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/8"></div>
            <span className="flex-shrink mx-4 text-[10px] text-white/30 uppercase font-mono tracking-widest">or continue with</span>
            <div className="flex-grow border-t border-white/8"></div>
          </div>

          {/* Google Button */}
          <div className="mb-6">
            <GoogleButton onClick={handleGoogleSignup} label="Sign up with Google" />
          </div>

          {/* Sign In Link */}
          <p className="text-center text-xs text-white/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-bold hover:underline">
              Sign In
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-[10px] text-white/30 mt-4 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-white/50 hover:text-white/70 underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-white/50 hover:text-white/70 underline">Privacy Policy</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
