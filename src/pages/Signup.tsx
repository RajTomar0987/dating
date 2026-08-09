import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import GoogleButton from '../components/auth/GoogleButton';
import EmailLogin from '../components/auth/EmailLogin';
import { useAuth } from '../auth/useAuth';

export default function Signup() {
  const { signupWithEmail, loginWithGoogle, error, clearError } = useAuth();

  const handleEmailSignup = async (email: string, password: string) => {
    await signupWithEmail(email, password);
  };

  const handleGoogleSignup = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen bg-bg-luxury flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-accent/20 via-primary/15 to-purple-800/10 blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[80px]" />
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

            <div className="flex justify-center mb-3">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Begin Your Journey
              </Badge>
            </div>

            <h2 className="text-2xl font-display font-bold text-white mb-2">Create Account</h2>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Join the next generation of relationship intelligence.
            </p>
          </div>

          {/* Google Signup */}
          <div className="mb-6">
            <GoogleButton onClick={handleGoogleSignup} label="Sign up with Google" />
          </div>

          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/8"></div>
            <span className="flex-shrink mx-4 text-[10px] text-white/30 uppercase font-mono tracking-widest">or with email</span>
            <div className="flex-grow border-t border-white/8"></div>
          </div>

          {/* Email Signup */}
          <EmailLogin mode="signup" onSubmit={handleEmailSignup} error={error} />

          {/* Footer */}
          <p className="text-center text-xs text-white/50 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
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
