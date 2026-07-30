import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, X, Sparkles, ShieldCheck, 
  Crown, BarChart3, Heart, MessageSquare, Calendar, Bot, Film
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import GlowButton from './GlowButton';
import Badge from './Badge';

export const INVESTOR_STORY_STEPS = [
  {
    step: 1,
    tab: 'landing',
    title: '1. AuraAI Core Mission',
    subtitle: 'The Paradigm Shift in Human Connection',
    valueProp: 'AuraAI is not just a dating product—it is an AI-powered relationship ecosystem built on continuous neural affinity.',
    duration: 18000
  },
  {
    step: 2,
    tab: 'profile',
    title: '2. Deep Profile & AI Learning',
    subtitle: 'Continuous Personality Calibration',
    valueProp: 'Aura analyzes MBTI traits, attachment styles, and love languages to build an unshakeable user profile.',
    duration: 18000
  },
  {
    step: 3,
    tab: 'deck',
    title: '3. Neural Swipe Deck',
    subtitle: 'Intelligent Affinity Matching',
    valueProp: 'High-intent matching algorithm connecting users based on deep psychological compatibility, not superficial swipes.',
    duration: 18000
  },
  {
    step: 4,
    tab: 'report',
    title: '4. AI Compatibility Matrix',
    subtitle: 'Mathematical Explanation of Match Dynamics',
    valueProp: 'Detailed breakdown of communication velocity, shared values, and long-term harmony potential.',
    duration: 18000
  },
  {
    step: 5,
    tab: 'wingman',
    title: '5. AI Wingman Conversation Engine',
    subtitle: 'Real-Time Flirt & Banter Assistance',
    valueProp: 'Generates context-aware, witty, and deep conversation suggestions to prevent chat drop-offs.',
    duration: 18000
  },
  {
    step: 6,
    tab: 'planner',
    title: '6. AI Date Planner',
    subtitle: 'Zero-Friction Date Itinerary Co-Creation',
    valueProp: 'Curates venue bookings, multi-stage dates, and icebreakers tailored to both partners.',
    duration: 18000
  },
  {
    step: 7,
    tab: 'companion',
    title: '7. Aura Companion (Flagship)',
    subtitle: 'Persistent AI Relationship Assistant',
    valueProp: 'Transitions users from dating to co-living & marriage with memory vaults, wellness checks, and conflict prevention.',
    duration: 18000
  },
  {
    step: 8,
    tab: 'premium',
    title: '8. Pro+ Monetization Engine',
    subtitle: '29.4% Industry-Leading Conversion Rate',
    valueProp: 'High LTV ($480) freemium-to-paid conversion backed by multi-tier recurring membership.',
    duration: 18000
  },
  {
    step: 9,
    tab: 'admin',
    title: '9. Operational & System Telemetry',
    subtitle: 'Realtime Infrastructure Metrics',
    valueProp: '78.4% gross profit margin, low AI inference cost ($0.18/user), and operational break-even.',
    duration: 18000
  }
];

export default function InvestorStoryTour() {
  const { isDemoMode, stopDemoMode, activeTab, setActiveTab } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentStep = INVESTOR_STORY_STEPS[currentStepIndex];

  useEffect(() => {
    if (!isDemoMode || !isPlaying) return;

    setActiveTab(currentStep.tab);

    const timer = setTimeout(() => {
      if (currentStepIndex < INVESTOR_STORY_STEPS.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 16000);

    return () => clearTimeout(timer);
  }, [isDemoMode, currentStepIndex, isPlaying, setActiveTab, currentStep.tab]);

  if (!isDemoMode) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }}
        className="p-5 sm:p-6 rounded-3xl bg-[#0A0A12]/95 border border-accent/40 shadow-[0_0_50px_rgba(236,72,153,0.3)] backdrop-blur-2xl text-white space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
            <Badge variant="accent" size="sm" icon={Film}>
              Investor Story Mode • Cinematic Product Journey
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/50">
              Step {currentStep.step} of {INVESTOR_STORY_STEPS.length}
            </span>
            <button
              onClick={stopDemoMode}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-9 gap-1.5">
          {INVESTOR_STORY_STEPS.map((s, idx) => (
            <div 
              key={s.step} 
              onClick={() => {
                setCurrentStepIndex(idx);
                setActiveTab(s.tab);
              }}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                idx === currentStepIndex 
                  ? 'bg-accent shadow-[0_0_10px_rgba(236,72,153,0.8)]' 
                  : idx < currentStepIndex 
                  ? 'bg-primary' 
                  : 'bg-white/10'
              }`} 
            />
          ))}
        </div>

        {/* Step Content Overlay */}
        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
            <span>{currentStep.title}</span>
            <span className="text-xs font-mono text-accent font-normal">({currentStep.subtitle})</span>
          </h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
            {currentStep.valueProp}
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => {
                if (currentStepIndex > 0) {
                  setCurrentStepIndex(prev => prev - 1);
                  setActiveTab(INVESTOR_STORY_STEPS[currentStepIndex - 1].tab);
                }
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
            >
              <SkipBack size={16} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-accent hover:bg-pink-600 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause Journey' : 'Resume Journey'}</span>
            </button>

            <button
              disabled={currentStepIndex === INVESTOR_STORY_STEPS.length - 1}
              onClick={() => {
                if (currentStepIndex < INVESTOR_STORY_STEPS.length - 1) {
                  setCurrentStepIndex(prev => prev + 1);
                  setActiveTab(INVESTOR_STORY_STEPS[currentStepIndex + 1].tab);
                }
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
            >
              <SkipForward size={16} />
            </button>
          </div>

          <GlowButton variant="secondary" size="sm" onClick={stopDemoMode}>
            Exit Story Mode
          </GlowButton>
        </div>
      </motion.div>
    </div>
  );
}
