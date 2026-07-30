import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Zap, Shield, Sparkles, Check, Crown, Star, Flame, 
  HelpCircle, CheckCircle2, XCircle, ArrowRight
} from 'lucide-react';

export default function Premium() {
  const { setPremiumUser, isPremiumUser } = useAppStore();
  const [calibrating, setCalibrating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');

  const handleUpgrade = () => {
    setCalibrating(true);
    setTimeout(() => {
      setCalibrating(false);
      setSuccess(true);
      setPremiumUser(true);
    }, 1600);
  };

  const featureMatrix = [
    { feature: "AI Relationship Reports", free: "Basic (1/mo)", pro: "5 / mo", proPlus: "Unlimited AI Reports" },
    { feature: "AI Wingman Chat Assistant", free: "3 / day", pro: "50 / day", proPlus: "Unlimited AI Wingman" },
    { feature: "AI Date Planner Engine", free: "Standard", pro: "Advanced", proPlus: "Unlimited Date Planner" },
    { feature: "Match Velocity & Boost", free: "Standard", pro: "2x Boost", proPlus: "Priority Matching (10x)" },
    { feature: "Compatibility Intelligence", free: "Overview", pro: "Deep Score", proPlus: "Advanced Neural Compatibility" },
    { feature: "Relationship Coach", free: "Locked", pro: "Basic", proPlus: "24/7 Relationship Coach" },
    { feature: "Aura Companion Flagship", free: "Locked", pro: "Limited", proPlus: "Full Aura Companion Access" }
  ];

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-6xl mx-auto space-y-10 relative z-10 overflow-y-auto">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary/20 via-purple-600/20 to-accent/20 border border-primary/40 text-xs font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Crown size={14} className="text-amber-400" />
            <span>AuraAI Pro+ Flagship Membership</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white">
            Supercharge Your Connection with <span className="gradient-text">AuraAI Pro+</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 font-sans leading-relaxed">
            Unlock unlimited AI Reports, AI Wingman coaching, priority match placement, unlimited date planning, and persistent Aura Companion intelligence.
          </p>
        </div>

        {/* Processing / Success Overlay Modals */}
        <AnimatePresence>
          {calibrating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#040408]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mb-6 shadow-[0_0_50px_rgba(236,72,153,0.5)]">
                <Sparkles size={40} className="animate-spin" />
              </div>
              <h3 className="text-2xl font-display font-extrabold text-white mb-2">Activating AuraAI Pro+ Nodes...</h3>
              <p className="text-sm text-white/60 max-w-md">Allocating dedicated GPU memory for real-time neural sync and persistent companion memory.</p>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#040408]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                <ShieldCheck size={44} className="animate-bounce" />
              </div>
              <h3 className="text-3xl font-display font-extrabold text-white mb-2">Welcome to AuraAI Pro+!</h3>
              <p className="text-sm text-white/70 max-w-md mb-8">
                Your profile has been elevated to Priority Status. Unlimited AI Reports, Wingman advice, and Aura Companion are now active.
              </p>
              <GlowButton onClick={() => setSuccess(false)} icon={Check} size="lg">
                Explore Pro+ Workspace
              </GlowButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Monthly Tier */}
          <GlassCard 
            onClick={() => setSelectedPlan('monthly')}
            variant={selectedPlan === 'monthly' ? 'glow' : 'interactive'}
            className={`p-6 flex flex-col justify-between space-y-6 cursor-pointer relative transition-all ${
              selectedPlan === 'monthly' ? 'border-primary/60 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : ''
            }`}
          >
            <div>
              <div className="text-xs font-mono text-white/50 uppercase font-semibold mb-2">Monthly Flexibility</div>
              <h3 className="text-2xl font-display font-bold text-white">Pro Monthly</h3>
              <div className="flex items-baseline gap-1 mt-4 mb-2">
                <span className="text-4xl font-display font-extrabold text-white">$29</span>
                <span className="text-xs text-white/40 font-mono">/ month</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Full access to all Pro features with flexible month-to-month billing. Cancel anytime.
              </p>
            </div>

            <GlowButton 
              variant={selectedPlan === 'monthly' ? 'primary' : 'glass'} 
              className="w-full"
              onClick={handleUpgrade}
            >
              Select Monthly
            </GlowButton>
          </GlassCard>

          {/* Yearly Tier (Most Popular Flagship) */}
          <GlassCard 
            onClick={() => setSelectedPlan('yearly')}
            variant="glow"
            className={`p-6 flex flex-col justify-between space-y-6 cursor-pointer relative transition-all border-accent/60 bg-gradient-to-b from-accent/10 via-card-dark/90 to-primary/10 shadow-[0_0_40px_rgba(236,72,153,0.3)] ${
              selectedPlan === 'yearly' ? 'ring-2 ring-accent' : ''
            }`}
          >
            <div className="absolute -top-3.5 right-4">
              <Badge variant="accent" size="sm" icon={Flame}>
                SAVE 35% • MOST POPULAR
              </Badge>
            </div>

            <div>
              <div className="text-xs font-mono text-accent font-bold uppercase mb-2 flex items-center gap-1">
                <Crown size={14} /> AuraAI Pro+ Annual Flagship
              </div>
              <h3 className="text-2xl font-display font-bold text-white">Pro+ Annual</h3>
              <div className="flex items-baseline gap-1 mt-4 mb-2">
                <span className="text-4xl font-display font-extrabold text-pink-300">$19</span>
                <span className="text-xs text-white/40 font-mono">/ month ($228/yr)</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Complete unlimited access to Aura Companion, Priority Matching, and 24/7 Relationship Coaching.
              </p>
            </div>

            <GlowButton 
              variant="accent" 
              className="w-full shadow-lg"
              onClick={handleUpgrade}
              icon={Zap}
            >
              Upgrade to Pro+ Flagship
            </GlowButton>
          </GlassCard>

          {/* Lifetime Demo Tier */}
          <GlassCard 
            onClick={() => setSelectedPlan('lifetime')}
            variant={selectedPlan === 'lifetime' ? 'glow' : 'interactive'}
            className={`p-6 flex flex-col justify-between space-y-6 cursor-pointer relative transition-all ${
              selectedPlan === 'lifetime' ? 'border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''
            }`}
          >
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase font-semibold mb-2">Founders Pass</div>
              <h3 className="text-2xl font-display font-bold text-white">Lifetime VIP</h3>
              <div className="flex items-baseline gap-1 mt-4 mb-2">
                <span className="text-4xl font-display font-extrabold text-white">$299</span>
                <span className="text-xs text-white/40 font-mono">one-time</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Pay once and unlock all future AI model upgrades, neural affinity updates, and VIP benefits forever.
              </p>
            </div>

            <GlowButton 
              variant={selectedPlan === 'lifetime' ? 'primary' : 'glass'} 
              className="w-full border-emerald-500/40 text-emerald-300"
              onClick={handleUpgrade}
            >
              Claim Lifetime VIP
            </GlowButton>
          </GlassCard>
        </div>

        {/* Feature Comparison Table */}
        <section className="space-y-4 pt-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-display font-bold text-white">Compare Membership Tiers</h2>
            <p className="text-xs text-white/50">Transparent breakdown of feature capabilities</p>
          </div>

          <GlassCard variant="default" className="p-6 bg-card-dark/80 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono text-white/50">
                  <th className="py-3 px-4 font-normal">FEATURE</th>
                  <th className="py-3 px-4 font-normal text-center">FREE CALIBRATION</th>
                  <th className="py-3 px-4 font-normal text-center">PRO MONTHLY</th>
                  <th className="py-3 px-4 font-normal text-center text-accent font-bold">PRO+ FLAGSHIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                {featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white/90">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center text-white/40 font-mono">{row.free}</td>
                    <td className="py-3.5 px-4 text-center text-white/70 font-mono">{row.pro}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-accent font-mono flex items-center justify-center gap-1">
                      <CheckCircle2 size={15} className="text-accent shrink-0" />
                      <span>{row.proPlus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </section>

      </main>
    </div>
  );
}
