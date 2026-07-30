import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, X, Sparkles, Check, Crown, Film, Maximize2, Heart, MessageCircle, Shield
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import GlowButton from './GlowButton';
import Badge from './Badge';

export const DEMO_DAY_STEPS = [
  {
    step: 1,
    tab: 'landing',
    title: 'Welcome to AuraAI',
    subtitle: 'The Global AI-Powered Relationship Ecosystem',
    narrative: 'AuraAI transitions human connection from traditional dating apps into a lifelong AI-guided relationship ecosystem.',
    duration: 20000,
    action: (store: any) => store.addToast("Demo Day Presentation Initialized", "system")
  },
  {
    step: 2,
    tab: 'deck',
    title: 'Aura Discover',
    subtitle: 'High-Intent Neural Affinity Matching',
    narrative: 'Our proprietary neural match engine connects users based on deep psychological compatibility, attachment style, and core values.',
    duration: 20000,
    action: (store: any) => store.addToast("Affinity match established with Zoe Hayashi (92% compatibility)!", "match")
  },
  {
    step: 3,
    tab: 'chats',
    title: 'Conversations & Real-Time Engagement',
    subtitle: 'Continuous Messaging Throughput',
    narrative: 'Real-time messaging thread with active AI Wingman banter suggestions to eliminate chat drop-offs.',
    duration: 20000,
    action: (store: any) => store.addToast("New message received from Elena: 'Check the model sync logs.'", "chat")
  },
  {
    step: 4,
    tab: 'report',
    title: 'AI Neural Compatibility Matrix',
    subtitle: 'Mathematical Explanation of Match Harmony',
    narrative: 'In-depth multi-dimensional breakdown of communication velocity, shared values, and long-term compatibility.',
    duration: 20000,
    action: (store: any) => store.addToast("Generated full neural affinity report", "system")
  },
  {
    step: 5,
    tab: 'companion',
    title: 'Aura Companion (Flagship)',
    subtitle: 'Persistent AI Relationship Assistant',
    narrative: 'Your persistent partner assistant featuring memory vaults, relationship health gauges, weekly reports, and privacy controls.',
    duration: 20000,
    action: (store: any) => store.addToast("Today's Insight: 'You both respond well to evening voice notes.'", "system")
  },
  {
    step: 6,
    tab: 'wellness',
    title: 'Aura Wellness & Vitals',
    subtitle: 'Weekly Emotional & Harmony Charts',
    narrative: 'Monitors relationship satisfaction, stress reduction, and emotional wellness using Recharts visual analytics.',
    duration: 20000,
    action: (store: any) => store.addToast("Weekly Emotional Check-In Recorded: Radiant", "system")
  },
  {
    step: 7,
    tab: 'premium',
    title: 'AuraAI Pro+ Membership',
    subtitle: '29.4% Industry-Leading Conversion Rate',
    narrative: 'High LTV ($480) freemium-to-paid conversion backed by multi-tier recurring membership plans.',
    duration: 20000,
    action: (store: any) => store.addToast("Aura Pro+ VIP Membership Active!", "premium")
  },
  {
    step: 8,
    tab: 'admin',
    title: 'Admin Telemetry & Vitals',
    subtitle: '78.4% Gross Margin & $0.18/User Inference',
    narrative: 'Operational metrics displaying realtime throughput, 99.99% server uptime, 22ms latency, and daily revenue.',
    duration: 20000,
    action: (store: any) => store.addToast("Operational Break-even Achieved ($18,450/day)", "system")
  },
  {
    step: 9,
    tab: 'landing',
    title: 'Thank you for exploring AuraAI.',
    subtitle: 'Building the Future of Human Connection',
    narrative: 'Thank you for participating in the AuraAI Demo Day presentation.',
    duration: 15000,
    action: (store: any) => store.addToast("Presentation Completed. Thank you!", "system")
  }
];

export default function DemoDayMode() {
  const store = useAppStore();
  const { isDemoMode, stopDemoMode, startDemoMode, setActiveTab } = store;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = DEMO_DAY_STEPS[currentStepIndex];

  const handleStartPresenting = () => {
    // Attempt Fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setIsFinished(false);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    startDemoMode();
  };

  useEffect(() => {
    if (!isDemoMode || !isPlaying) return;

    setActiveTab(currentStep.tab);
    if (currentStep.action) {
      currentStep.action(store);
    }

    const timer = setTimeout(() => {
      if (currentStepIndex < DEMO_DAY_STEPS.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setIsFinished(true);
      }
    }, 18000);

    return () => clearTimeout(timer);
  }, [isDemoMode, currentStepIndex, isPlaying, setActiveTab, currentStep.tab]);

  return (
    <>
      {/* Trigger Button Header */}
      {!isDemoMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={handleStartPresenting}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent via-pink-600 to-primary text-white font-display font-extrabold text-sm flex items-center gap-2.5 shadow-[0_0_30px_rgba(236,72,153,0.5)] border border-white/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Play size={16} className="fill-white" />
            <span>Present AuraAI</span>
          </button>
        </div>
      )}

      {/* Presentation Fullscreen Overlay */}
      <AnimatePresence>
        {isDemoMode && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-3xl pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="p-6 rounded-3xl bg-[#0A0A12]/95 border border-accent/50 shadow-[0_0_60px_rgba(236,72,153,0.4)] backdrop-blur-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent animate-ping" />
                  <Badge variant="accent" size="sm" icon={Sparkles}>
                    AuraAI Demo Day Mode • 5-Minute Auto Walkthrough
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/50">
                    Step {currentStep.step} of {DEMO_DAY_STEPS.length}
                  </span>
                  <button
                    onClick={() => {
                      stopDemoMode();
                      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="grid grid-cols-9 gap-1.5">
                {DEMO_DAY_STEPS.map((s, idx) => (
                  <div 
                    key={s.step}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setActiveTab(s.tab);
                    }}
                    className={`h-1.5 rounded-full cursor-pointer transition-all ${
                      idx === currentStepIndex 
                        ? 'bg-accent shadow-[0_0_12px_rgba(236,72,153,0.9)]' 
                        : idx < currentStepIndex 
                        ? 'bg-primary' 
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Narrative Overlay */}
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                  <span>{currentStep.title}</span>
                  <span className="text-xs font-mono text-accent font-normal">({currentStep.subtitle})</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                  {currentStep.narrative}
                </p>
              </div>

              {/* Finishing Overlay Toast */}
              {isFinished && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center">
                  Thank you for exploring AuraAI.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
