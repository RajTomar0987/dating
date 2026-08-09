import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { RecaptchaVerifier, type ConfirmationResult } from '../../lib/firebase';
import { auth } from '../../lib/firebase';

interface PhoneLoginProps {
  onLogin: (phone: string, verifier: any) => Promise<ConfirmationResult>;
  onVerify: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
}

export default function PhoneLogin({ onLogin, onVerify }: PhoneLoginProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const verifierRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (verifierRef.current) {
        try { verifierRef.current.clear(); } catch {}
      }
    };
  }, []);

  const initRecaptcha = () => {
    if (verifierRef.current) return verifierRef.current;
    
    const verifier = new RecaptchaVerifier(auth, recaptchaRef.current!, {
      size: 'invisible',
      callback: () => {},
    });
    verifierRef.current = verifier;
    return verifier;
  };

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const verifier = initRecaptcha();
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const result = await onLogin(formattedPhone, verifier);
      setConfirmResult(result);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit on complete
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (code?: string) => {
    const otpCode = code || otp.join('');
    if (otpCode.length !== 6 || !confirmResult) return;

    setLoading(true);
    setError('');

    try {
      await onVerify(confirmResult, otpCode);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div ref={recaptchaRef} id="recaptcha-container" />

      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div>
              <label className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleSendOTP}
              disabled={loading || phone.length < 10}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              <span>{loading ? 'Sending OTP...' : 'Send Verification Code'}</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={16} className="text-green-400" />
                <span className="text-xs text-white/60">Verification code sent to {phone}</span>
              </div>
            </div>

            <div className="flex justify-center gap-2.5">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/[0.04] border border-white/12 text-white focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              ))}
            </div>

            <motion.button
              type="button"
              onClick={() => handleVerifyOTP()}
              disabled={loading || otp.some(d => d === '')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-sm font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
            </motion.button>

            <button
              type="button"
              onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
              className="w-full text-center text-xs text-white/40 hover:text-white/60 transition-colors cursor-pointer"
            >
              Change phone number
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
