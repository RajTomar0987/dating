import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';

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

interface EmailLoginProps {
  mode?: 'login' | 'signup';
  onSubmit?: (email: string, password: string) => Promise<void>;
  onCustomTokenLogin?: (customToken: string) => Promise<void>;
  error?: string | null;
}

export default function EmailLogin({ mode = 'login', onSubmit, onCustomTokenLogin, error }: EmailLoginProps) {
  // Email Sub-Mode: 'password' | 'otp'
  const [emailSubMode, setEmailSubMode] = useState<'password' | 'otp'>('password');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(0);

  // UI State
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown Timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const displayError = error || localError;

  // ----------------------------------------------------
  // 1. PASSWORD AUTH SUBMIT HANDLER
  // ----------------------------------------------------
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return;

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(cleanEmail, password);
      }
    } catch (err: any) {
      setLocalError(err?.message || 'Authentication failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 2. SEND EMAIL OTP HANDLER
  // ----------------------------------------------------
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLocalError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json().catch(() => ({ error: 'Failed to send verification code.' }));

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Unable to send verification code. Please try again.');
      }

      setOtpStep(2);
      setResendTimer(data.resendCooldownSeconds || 60);
      setSuccessMessage('Verification code sent to your email.');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    } catch (err: any) {
      console.error('[EMAIL OTP] Send error:', err);
      setLocalError(err?.message || 'Unable to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 3. VERIFY EMAIL OTP HANDLER
  // ----------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length < 6) {
      setLocalError('Enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: fullOtp }),
      });

      const data = await res.json().catch(() => ({ error: 'Verification failed.' }));

      if (!res.ok) {
        throw new Error(data.error || 'Incorrect verification code.');
      }

      if (!data.customToken) {
        throw new Error('Verification token missing. Please try again.');
      }

      if (onCustomTokenLogin) {
        await onCustomTokenLogin(data.customToken);
      }
    } catch (err: any) {
      console.error('[EMAIL OTP] Verify error:', err);
      setLocalError(err?.message || 'Incorrect verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 4. OTP INPUT HANDLERS
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

    if (index < 5) {
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

  return (
    <div className="space-y-4">
      {/* Sub-Mode Toggle: [ Email & Password ] [ Email OTP ] */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/8 mb-4">
        <button
          type="button"
          onClick={() => {
            setEmailSubMode('password');
            setLocalError(null);
            setSuccessMessage(null);
          }}
          className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            emailSubMode === 'password'
              ? 'bg-gradient-to-r from-primary/30 to-purple-600/30 border border-primary/50 text-white shadow-md'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          Email & Password
        </button>
        <button
          type="button"
          onClick={() => {
            setEmailSubMode('otp');
            setLocalError(null);
            setSuccessMessage(null);
            setOtpStep(1);
          }}
          className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            emailSubMode === 'otp'
              ? 'bg-gradient-to-r from-primary/30 to-purple-600/30 border border-primary/50 text-white shadow-md'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          Email OTP
        </button>
      </div>

      {/* Global Error Banner */}
      {displayError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 text-center bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3"
        >
          {displayError}
        </motion.p>
      )}

      {/* Global Success Banner */}
      {successMessage && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-emerald-400 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2 px-3 font-medium"
        >
          {successMessage}
        </motion.p>
      )}

      <AnimatePresence mode="wait">
        {emailSubMode === 'password' ? (
          // ====================================================
          // MODE 1: EMAIL & PASSWORD
          // ====================================================
          <motion.form
            key="password-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handlePasswordSubmit}
            className="space-y-4"
          >
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
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </motion.form>
        ) : (
          // ====================================================
          // MODE 2: EMAIL OTP
          // ====================================================
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {otpStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="login-otp-email" className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input
                      id="login-otp-email"
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

                <motion.button
                  type="submit"
                  disabled={loading || !email}
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
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-xs text-white/80 font-medium">
                    Enter 6-digit verification code sent to:
                  </p>
                  <p className="text-xs font-mono font-bold text-pink-400 truncate">
                    {email}
                  </p>
                </div>

                {/* 6-DIGIT OTP BOXES (SINGLE ROW AT 400PX MOBILE WIDTH) */}
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
                      onClick={() => {
                        setOtpStep(1);
                        setOtpDigits(['', '', '', '', '', '']);
                        setLocalError(null);
                        setSuccessMessage(null);
                      }}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Change Email
                    </button>

                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={() => handleSendOtp()}
                      className="flex items-center gap-1 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono cursor-pointer"
                    >
                      <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
