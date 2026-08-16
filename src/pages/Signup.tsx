import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import GoogleButton from '../components/auth/GoogleButton';
import { useAuth } from '../auth/useAuth';

function getApiBaseUrl(): string {
  let url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      url = 'https://dating-f5pp.onrender.com/api';
    } else {
      url = 'http://localhost:5000/api';
    }
  }
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
}

export default function Signup() {
  const navigate = useNavigate();
  const { signupWithEmail, loginWithCustomToken, loginWithGoogle, error: authContextError, clearError } = useAuth();

  // Active Signup Mode: 'password' | 'otp'
  const [signupMode, setSignupMode] = useState<'password' | 'otp'>('password');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(0);

  // UI State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Clear errors when switching mode
  useEffect(() => {
    clearError();
    setFormError(null);
    setSuccessMessage(null);
  }, [signupMode, clearError]);

  // Resend Countdown Timer Effect
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const displayError = formError || authContextError;

  // ----------------------------------------------------
  // 1. EMAIL + PASSWORD SIGNUP HANDLER
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
      // AuthProvider will establish session & GuestRoute will navigate to /onboarding
    } catch (err: any) {
      console.error('[SIGNUP] Email signup error:', err);
      const msg = err?.message || '';
      if (msg.includes('already exists') || msg.includes('already-in-use')) {
        setFormError('This email is already registered. Sign in instead.');
      } else if (msg.includes('weak-password')) {
        setFormError('Password must meet the required security rules.');
      } else if (msg.includes('invalid-email')) {
        setFormError('Enter a valid email address.');
      } else {
        setFormError(msg || 'Unable to complete registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 2. SEND EMAIL OTP HANDLER (STEP 1)
  // ----------------------------------------------------
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearError();
    setFormError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json().catch(() => ({ error: 'Failed to send OTP' }));

      if (!res.ok) {
        throw new Error(data.error || 'Unable to send verification code. Please try again.');
      }

      setOtpStep(2);
      setResendTimer(data.resendCooldownSeconds || 60);
      setSuccessMessage('Verification code sent to your email.');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    } catch (err: any) {
      console.error('[SIGNUP OTP] Send exception:', err);
      setFormError(err?.message || 'Unable to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 3. VERIFY EMAIL OTP HANDLER (STEP 2)
  // ----------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    const cleanEmail = email.trim().toLowerCase();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length < 6) {
      setFormError('Enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otp: fullOtp,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({ error: 'Verification failed' }));

      if (!res.ok) {
        throw new Error(data.error || 'Incorrect verification code.');
      }

      if (!data.customToken) {
        throw new Error('Verification token missing. Please try again.');
      }

      // Log in with returned Firebase custom token
      await loginWithCustomToken(data.customToken);
      // AuthProvider will establish session & redirect to /onboarding
    } catch (err: any) {
      console.error('[SIGNUP OTP] Verify exception:', err);
      setFormError(err?.message || 'Incorrect verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 4. OTP INPUT BOX HANDLERS (AUTO-FOCUS & PASTE)
  // ----------------------------------------------------
  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const digit = cleanVal.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (index < 5 && digit) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedText) return;

    const digits = pastedText.split('');
    const newDigits = ['', '', '', '', '', ''];
    digits.forEach((d, idx) => {
      if (idx < 6) newDigits[idx] = d;
    });
    setOtpDigits(newDigits);

    const nextFocusIndex = Math.min(digits.length, 5);
    otpInputRefs.current[nextFocusIndex]?.focus();
  };

  // ----------------------------------------------------
  // 5. GOOGLE SIGNUP HANDLER
  // ----------------------------------------------------
  const handleGoogleSignup = async () => {
    clearError();
    setFormError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setFormError(err?.message || 'Unable to sign up with Google.');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-bg-luxury flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden selection:bg-primary/30">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-accent/20 via-primary/15 to-purple-800/10 blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[320px] h-[320px] rounded-full bg-purple-600/10 blur-[90px]" />
        <div className="absolute top-10 right-10 w-[280px] h-[280px] rounded-full bg-pink-600/10 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[440px] w-full relative z-10 my-6"
      >
        <GlassCard className="p-6 sm:p-8 md:p-10 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]" hoverEffect={false}>
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 mb-3 group px-3 py-1.5 rounded-2xl hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Heart className="text-white fill-white" size={18} />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider">
                AURA<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            <div className="flex justify-center mb-3">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Begin Your Journey
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1.5">
              Create Your Aura Account
            </h1>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Join the next generation of relationship intelligence.
            </p>
          </div>

          {/* Registration Mode Selector */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSignupMode('password')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                signupMode === 'password'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setSignupMode('otp')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                signupMode === 'otp'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Email OTP Code
            </button>
          </div>

          {/* Error / Success Feedback Alerts */}
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

            {successMessage && !displayError && (
              <motion.div
                key="success-alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center leading-relaxed flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ====================================================
              MODE A: EMAIL + PASSWORD SIGNUP FORM
              ==================================================== */}
          {signupMode === 'password' && (
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

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || !email || !password || !confirmPassword}
                whileHover={loading ? undefined : { scale: 1.01, y: -1 }}
                whileTap={loading ? undefined : { scale: 0.99 }}
                className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl 
                  bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-bold 
                  shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.55)] 
                  border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* ====================================================
              MODE B: EMAIL OTP SIGNUP FORM
              ==================================================== */}
          {signupMode === 'otp' && (
            <div className="space-y-4">
              {otpStep === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-1.5 font-mono">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                      <input
                        type="text"
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

                  {/* Send OTP Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !email}
                    whileHover={loading ? undefined : { scale: 1.01, y: -1 }}
                    whileTap={loading ? undefined : { scale: 0.99 }}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl 
                      bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-bold 
                      shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.55)] 
                      border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} />
                        <span>Send OTP</span>
                      </>
                    )}
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-white/80 font-medium">
                      Enter the 6-digit code sent to:
                    </p>
                    <p className="text-xs font-mono font-bold text-pink-400 truncate">
                      {email}
                    </p>
                  </div>

                  {/* 6-DIGIT OTP BOXES (FITS 1 SINGLE ROW AT 400PX MOBILE WIDTH) */}
                  <div className="grid grid-cols-6 gap-1.5 sm:gap-2 max-w-full my-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-full h-12 text-center text-lg font-mono font-bold rounded-xl bg-white/[0.06] border border-white/20 text-white focus:border-pink-500 focus:bg-pink-500/10 focus:outline-none transition-all"
                      />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      type="submit"
                      disabled={loading || otpDigits.join('').length < 6}
                      whileHover={loading ? undefined : { scale: 1.01, y: -1 }}
                      whileTap={loading ? undefined : { scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl 
                        bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-bold 
                        shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.55)] 
                        border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Verify OTP</span>
                        </>
                      )}
                    </motion.button>

                    <div className="flex items-center justify-between text-xs text-white/50 pt-1">
                      <button
                        type="button"
                        onClick={() => setOtpStep(1)}
                        className="hover:text-white transition-colors"
                      >
                        Change Email
                      </button>

                      <button
                        type="button"
                        disabled={resendTimer > 0 || loading}
                        onClick={() => handleSendOtp()}
                        className="flex items-center gap-1 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono"
                      >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                        {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

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
