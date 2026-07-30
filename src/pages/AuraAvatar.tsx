import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Flame, Award, Star 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const AVATAR_STAGES = [
  { level: 1, title: 'Beginner', xpRequired: 0, desc: 'Initial neural synchronization initialized.', color: '#A855F7' },
  { level: 2, title: 'Explorer', xpRequired: 500, desc: 'Explored 10+ date itineraries & chat analyses.', color: '#3B82F6' },
  { level: 3, title: 'Connector', xpRequired: 1500, desc: 'Deep harmony established across 5 relationship dimensions.', color: '#10B981' },
  { level: 4, title: 'Mentor', xpRequired: 3000, desc: 'Proactive conflict prevention & continuous memory vault sync.', color: '#EC4899' },
  { level: 5, title: 'Legend', xpRequired: 5000, desc: 'Mastery of AI-guided intimacy & lifetime partnership.', color: '#F59E0B' }
];

const ACHIEVEMENTS = [
  { title: '🔥 14-Day Streak Master', desc: 'Checked in with Aura Companion for 14 consecutive days', xp: '+350 XP', unlocked: true },
  { title: '🧠 Neural Affinity Pioneer', desc: 'Reached 95%+ affinity sync score', xp: '+500 XP', unlocked: true },
  { title: '📖 Journal Reflections', desc: 'Logged 10+ private AI journal entries', xp: '+250 XP', unlocked: true },
  { title: '👑 Legend Companion', desc: 'Unlock Level 5 Avatar Stage', xp: '+1000 XP', unlocked: false }
];

export default function AuraAvatar() {
  const { addToast } = useAppStore();
  const [currentXP, setCurrentXP] = useState(3450);
  const [streakDays, setStreakDays] = useState(14);

  // Level computation
  const currentLevelIndex = AVATAR_STAGES.findIndex((stage, idx) => {
    const nextStage = AVATAR_STAGES[idx + 1];
    return !nextStage || currentXP < nextStage.xpRequired;
  });

  const currentStage = AVATAR_STAGES[currentLevelIndex !== -1 ? currentLevelIndex : 0];
  const nextStage = AVATAR_STAGES[currentLevelIndex + 1] || currentStage;
  
  const xpProgress = nextStage.xpRequired > currentStage.xpRequired
    ? Math.min(100, Math.round(((currentXP - currentStage.xpRequired) / (nextStage.xpRequired - currentStage.xpRequired)) * 100))
    : 100;

  const handleClaimDailyXP = () => {
    setCurrentXP(prev => prev + 150);
    setStreakDays(prev => prev + 1);
    addToast('Claimed Daily Streak Bonus (+150 XP)!', 'system');
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Aura Visual AI Companion Avatar
              </Badge>
              <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                <Flame size={13} /> {streakDays}-Day Daily Streak Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="text-accent shrink-0" size={38} /> Aura AI Companion Avatar
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Your personalized visual AI avatar evolves as you log journal entries, complete co-op goals, and build deeper relationship harmony.
            </p>
          </div>

          <GlowButton variant="accent" size="md" onClick={handleClaimDailyXP} icon={Flame}>
            Claim Daily Streak (+150 XP)
          </GlowButton>
        </div>

        {/* Visual Avatar Stage Display */}
        <GlassCard variant="glow" className="p-8 bg-gradient-to-br from-primary/20 via-card-dark/95 to-accent/20 border-primary/40 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Animated Avatar Sphere */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shrink-0">
            {/* Outer Aura Glow */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-purple-600 to-accent opacity-50 filter blur-xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Core Orb Stage */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-card-dark border-2 border-accent/60 flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.4)] overflow-hidden">
              <motion.div 
                className="w-32 h-32 rounded-full bg-gradient-to-tr from-accent via-pink-500 to-primary flex items-center justify-center text-white font-display font-extrabold text-3xl shadow-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={48} className="text-white animate-pulse" />
              </motion.div>

              <div className="absolute bottom-3 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-accent border border-accent/40 font-bold">
                LEVEL {currentStage.level} • {currentStage.title.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Level Progress & XP Information */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="accent" size="sm">Stage {currentStage.level} of 5</Badge>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
                  Level {currentStage.level}: {currentStage.title} Avatar
                </h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40 font-mono">TOTAL XP</div>
                <div className="text-2xl font-display font-extrabold text-accent">{currentXP.toLocaleString()} XP</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
              {currentStage.desc}
            </p>

            {/* XP Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">Progress to Level {nextStage.level} ({nextStage.title})</span>
                <span className="text-accent font-bold">{xpProgress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Level Progression Roadmap */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Award className="text-amber-400" size={20} /> Avatar Level Evolution Stages
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {AVATAR_STAGES.map((s) => {
              const isUnlocked = currentXP >= s.xpRequired;
              return (
                <GlassCard key={s.level} variant={isUnlocked ? 'glow' : 'subtle'} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">LVL {s.level}</span>
                    <Badge variant={isUnlocked ? 'accent' : 'glass'} size="sm">
                      {isUnlocked ? 'Unlocked' : `${s.xpRequired} XP`}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-white">{s.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* XP Achievements */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Star className="text-accent" size={20} /> Unlocked XP Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((a, idx) => (
              <GlassCard key={idx} variant={a.unlocked ? 'interactive' : 'subtle'} className="p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-white">{a.title}</h3>
                  <p className="text-xs text-white/60 mt-0.5">{a.desc}</p>
                </div>
                <span className="text-xs font-mono font-bold text-accent px-3 py-1 rounded-xl bg-accent/15 border border-accent/30 shrink-0">
                  {a.xp}
                </span>
              </GlassCard>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
