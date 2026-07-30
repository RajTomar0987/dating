import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Sparkles, Brain, Heart, CheckCircle2, MessageSquare, 
  Lightbulb, Compass, Award, ChevronRight, Zap
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const ADVICE_PILLARS = [
  {
    category: 'Conflict Prevention',
    title: 'De-escalate Delay Anxiety',
    desc: 'Elena values structured timing due to her INTJ analytical style. Giving a 15-minute advance heads-up before spontaneous schedule changes prevents low-level anxiety.',
    icon: ShieldAlert,
    badge: 'Proactive Alert'
  },
  {
    category: 'Communication Coaching',
    title: 'Active Listening in Evening Syncs',
    desc: 'When discussing complex design projects, validate her logic first before introducing alternative solutions.',
    icon: MessageSquare,
    badge: 'High Impact'
  },
  {
    category: 'Suggested Activity',
    title: 'Pottery & Phone-Free Supper',
    desc: 'Tactile creative focus with zero digital distractions will recharge both your energy levels.',
    icon: Compass,
    badge: 'Recommended'
  },
  {
    category: 'Celebrate Milestone',
    title: 'Acknowledge Architectural Review',
    desc: 'Celebrate her presentation completion on Wednesday with her favorite dark chocolate and tea.',
    icon: Award,
    badge: 'Milestone'
  }
];

export default function AuraCoach() {
  const { addToast, setActiveTab } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRefreshCoach = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast('Aura Relationship Coach refreshed weekly strategy matrix!', 'system');
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={ShieldAlert}>
                Aura Coach Module • AI Relationship Guidance
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">96.8% Harmony Score</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="text-accent shrink-0" size={38} /> Aura Relationship Coach
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Proactive conflict prevention, personalized communication coaching, and strategic activity suggestions tailored to your partner's MBTI and attachment style.
            </p>
          </div>

          <GlowButton 
            variant="primary" 
            size="md" 
            isLoading={isGenerating}
            onClick={handleRefreshCoach} 
            icon={Sparkles}
          >
            Generate Fresh Strategy
          </GlowButton>
        </div>

        {/* Hero Strategy Banner */}
        <GlassCard variant="glow" className="p-8 bg-gradient-to-br from-primary/20 via-card-dark/95 to-accent/20 border-primary/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-accent font-bold">
              <Zap size={15} /> WEEKLY AI RELATIONSHIP DIAGNOSIS
            </div>
            <Badge variant="accent" size="sm">Active Sync</Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
            "Your relationship is in an optimal growth phase. Prioritize proactive communication on Thursday to maintain high trust."
          </h2>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-white/70">
            <span>Primary Trigger: Spontaneous unannounced delays</span>
            <span>•</span>
            <span className="text-emerald-400">De-escalation Key: Logical clarity & quiet 1-on-1 space</span>
          </div>
        </GlassCard>

        {/* 4 Pillars Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Brain className="text-primary" size={22} /> Strategic Guidance Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADVICE_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <GlassCard key={idx} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-semibold text-white/70">{pillar.category}</span>
                      </div>
                      <Badge variant="primary" size="sm">{pillar.badge}</Badge>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-end">
                    <button 
                      onClick={() => {
                        setActiveTab('companion');
                        addToast('Applied recommendation to Aura Companion!', 'system');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Apply with Companion</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
