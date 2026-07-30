import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { Mail, Lock, User, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveTab('matchmaker');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-bg-luxury flex items-center justify-center p-6 relative overflow-hidden">
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
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Neural Onboarding Protocol
              </Badge>
            </div>

            <h2 className="text-2xl font-display font-bold text-white mb-2">Create Account</h2>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Register to calibrate your multi-dimensional relationship telemetry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="signup-name" className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="glass-input w-full pl-11"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="text-[10px] text-white/60 uppercase font-bold tracking-wider block mb-2 font-mono">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  id="signup-password"
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
              Calibrate Profile
            </GlowButton>
          </form>

          <p className="text-center text-xs text-white/50 mt-8">
            Already registered?{' '}
            <button 
              type="button"
              className="text-accent font-semibold hover:underline cursor-pointer" 
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
