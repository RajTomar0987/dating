import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Phone, Mail, Apple } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GoogleButton from '../components/auth/GoogleButton';
import EmailLogin from '../components/auth/EmailLogin';
import PhoneLogin from '../components/auth/PhoneLogin';
import { useAuth } from '../auth/useAuth';

type AuthMethod = 'email' | 'phone';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, loginWithPhone, verifyPhoneOTP, error, clearError } = useAuth();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');

  const handleEmailLogin = async (email: string, password: string) => {
    await loginWithEmail(email, password);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleAppleLogin = async () => {
    // Apple Sign-In architecture prepared — requires Apple Developer account
    alert('Apple Sign-In coming soon. Please use Google or Email login.');
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
          <div className="text-center mb-8">
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

            <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Sign in to your relationship intelligence profile.
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <GoogleButton onClick={handleGoogleLogin} label="Continue with Google" />

            <motion.button
              type="button"
              onClick={handleAppleLogin}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl 
                bg-white/[0.06] backdrop-blur-xl border border-white/12 
                text-white/90 text-sm font-medium
                hover:bg-white/[0.1] hover:border-white/20 
                transition-all duration-200 cursor-pointer
                shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              <Apple size={20} />
              <span>Continue with Apple</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/8"></div>
            <span className="flex-shrink mx-4 text-[10px] text-white/30 uppercase font-mono tracking-widest">or continue with</span>
            <div className="flex-grow border-t border-white/8"></div>
          </div>

          {/* Method Toggle */}
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => { setAuthMethod('email'); clearError(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-primary/15 border border-primary/40 text-white'
                  : 'bg-white/[0.03] border border-white/8 text-white/50 hover:text-white/70'
              }`}
            >
              <Mail size={14} />
              Email
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('phone'); clearError(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-primary/15 border border-primary/40 text-white'
                  : 'bg-white/[0.03] border border-white/8 text-white/50 hover:text-white/70'
              }`}
            >
              <Phone size={14} />
              Phone
            </button>
          </div>

          {/* Auth Forms */}
          <AnimatePresence mode="wait">
            {authMethod === 'email' ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <EmailLogin mode="login" onSubmit={handleEmailLogin} error={error} />
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PhoneLogin onLogin={loginWithPhone} onVerify={verifyPhoneOTP} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="text-center text-xs text-white/50 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
