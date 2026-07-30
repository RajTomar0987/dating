import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { Mail, Lock, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveTab('deck');
    }, 600);
  };

  const handleDemoAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveTab('deck');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-bg-luxury flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="luxury-bg-glow" />
      <div className="glow-spot-1" />
      <div className="glow-spot-2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[440px] w-full relative z-10"
      >
        <GlassCard className="p-8 md:p-10 border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]" hoverEffect={false}>
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center gap-2 mb-4 cursor-pointer group px-3 py-1.5 rounded-2xl hover:bg-white/[0.04] transition-colors" 
              onClick={() => setActiveTab('landing')}
              role="button"
              tabIndex={0}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Heart className="text-white fill-white" size={18} />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider">
                AURA<span className="gradient-text">AI</span>
              </span>
            </div>

            <div className="flex justify-center mb-2">
              <Badge variant="primary" size="sm" icon={Sparkles}>
                Investor Telemetry Enabled
              </Badge>
            </div>

            <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Enter credentials to synchronize your relationship intelligence profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.mercer@aura.ai"
                  className="glass-input w-full pl-11"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="text-[10px] text-white/60 uppercase font-bold tracking-wider block font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-[10px] text-accent hover:underline font-medium cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="glass-input w-full pl-11"
                />
              </div>
            </div>

            <GlowButton type="submit" isLoading={isLoading} className="w-full mt-2" icon={ArrowRight}>
              Sign In to Suite
            </GlowButton>
          </form>

          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-white/8"></div>
            <span className="flex-shrink mx-4 text-[10px] text-white/30 uppercase font-mono tracking-widest">or demo</span>
            <div className="flex-grow border-t border-white/8"></div>
          </div>

          <GlowButton 
            variant="glass" 
            className="w-full border-primary/30 text-purple-300 hover:text-white" 
            onClick={handleDemoAccess}
            icon={Sparkles}
          >
            Investor Demo Instant Access
          </GlowButton>

          <p className="text-center text-xs text-white/50 mt-8">
            Don't have an account?{' '}
            <button 
              type="button"
              className="text-accent font-semibold hover:underline cursor-pointer" 
              onClick={() => setActiveTab('signup')}
            >
              Initialize Profile
            </button>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
