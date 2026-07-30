import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from './GlassCard';
import GlowButton from './GlowButton';
import { Sparkles, SkipForward, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TourStep {
  step: number;
  tab: string;
  duration: number; // in ms
  title: string;
  narrative: string;
  highlightText: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    tab: "landing",
    duration: 18000,
    title: "1. The Vision of AuraAI",
    narrative: "Welcome to AuraAI. We are introducing the world's first Relationship Intelligence Platform. Traditional dating apps rely on superficial swipe mechanics. Aura uses trait calibrations, cognitive analysis, and game theory for investor-grade connections.",
    highlightText: "Keynote presentation initiated. Entering showcase mode."
  },
  {
    step: 2,
    tab: "deck",
    duration: 25000,
    title: "2. Real-Time Affinity Deck",
    narrative: "Aura's Swipe Deck evaluates cognitive compatibility. The right panel displays the AI-calculated compatibility report, listing strengths, risks, and green flags dynamically. Watch as we evaluate Marcus Vance.",
    highlightText: "Simulating neural swipe. Establishing mutual frequency alignment."
  },
  {
    step: 3,
    tab: "report",
    duration: 28000,
    title: "3. Full Compatibility Diagnostics",
    narrative: "Aura's signature feature. We project a multi-dimensional traits radar (Logic, Empathy, Extroversion, Adventure) and a 12-month relationship forecast timeline, complete with gift recommendations and date plans.",
    highlightText: "Visualizing Recharts Radar graphs comparing candidate traits."
  },
  {
    step: 4,
    tab: "wingman",
    duration: 25000,
    title: "4. AI Wingman Assistant",
    narrative: "Conversational red-teaming. Users can paste chat logs, and the AI Wingman analyzes tone variations (flirty, intellectual, funny, professional) to output optimal icebreakers.",
    highlightText: "Simulating tone analyzer parsing chat logs."
  },
  {
    step: 5,
    tab: "chats",
    duration: 28000,
    title: "5. Real-Time Messenger Sync",
    narrative: "Unified communication channels. When messages are sent, the AI responds in real-time according to their unique persona prompt. Note the active typing indicator dots.",
    highlightText: "Elena Rostova is typing... Message generated dynamically."
  },
  {
    step: 6,
    tab: "premium",
    duration: 20000,
    title: "6. Monetization & Aura VIP Upgrade",
    narrative: "Our business model: Aura VIP unlocks unlimited swipes, high-GPU compatibility reports, and vocal resonance metrics. Let's calibrate and purchase the upgrade.",
    highlightText: "Calibrating checkout nodes. Unlocking premium tier features."
  },
  {
    step: 7,
    tab: "profile",
    duration: 22000,
    title: "7. Unified Dashboard Hub",
    narrative: "The final dashboard showcases user verified check badges, profile completion vectors (100%), and complete matches history. Demo completed successfully.",
    highlightText: "Aura VIP tier successfully activated. Verification badge updated."
  }
];

export default function PresenterTour() {
  const { 
    isDemoMode, 
    demoStep, 
    setDemoStep, 
    setActiveTab, 
    stopDemoMode, 
    likeProfile, 
    sendMessage,
    setViewingReportProfileId,
    setPremiumUser,
    addToast
  } = useAppStore();

  const [timeLeft, setTimeLeft] = useState(0);

  const currentStepData = TOUR_STEPS.find(s => s.step === demoStep);

  // Fullscreen trigger
  useEffect(() => {
    if (isDemoMode) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [isDemoMode]);

  // Main presenter automation sequence loop
  useEffect(() => {
    if (!isDemoMode || !currentStepData) return;

    setTimeLeft(currentStepData.duration / 1000);

    const stepInterval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    const actionTimeout = setTimeout(() => {
      if (demoStep === 2) {
        likeProfile("2");
        addToast("Affinity Match Established with Marcus!", "match");
      } else if (demoStep === 5) {
        sendMessage("1", "Hey Elena, let's benchmark our neural alignment curves this weekend.");
      }
    }, currentStepData.duration / 2);

    const stepTimeout = setTimeout(() => {
      const nextStep = demoStep + 1;
      if (nextStep <= TOUR_STEPS.length) {
        const nextStepData = TOUR_STEPS.find(s => s.step === nextStep)!;
        if (nextStep === 3) setViewingReportProfileId("2");
        if (nextStep === 6) setPremiumUser(false);
        if (nextStep === 7) setPremiumUser(true);

        setActiveTab(nextStepData.tab);
        setDemoStep(nextStep);
      } else {
        stopDemoMode();
        addToast("Keynote Presentation Completed Successfully!", "system");
      }
    }, currentStepData.duration);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(actionTimeout);
      clearTimeout(stepTimeout);
    };
  }, [isDemoMode, demoStep, currentStepData]);

  if (!isDemoMode || !currentStepData) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 px-4 md:px-6 max-w-4xl mx-auto pointer-events-none">
      <GlassCard 
        variant="glow"
        className="p-5 md:p-6 border-primary/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] backdrop-blur-2xl relative overflow-hidden pointer-events-auto"
      >
        {/* Animated Timer Progress Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-white/10">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: currentStepData.duration / 1000, ease: "linear" }}
            className="h-full bg-gradient-to-r from-primary via-purple-500 to-accent"
          />
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
          
          {/* Left Column: Details */}
          <div className="col-span-12 md:col-span-8 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest font-display">
                {currentStepData.title}
              </h4>
              <span className="text-[10px] text-white/50 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                {timeLeft}s remaining
              </span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed font-sans">
              {currentStepData.narrative}
            </p>

            <div className="text-[10px] text-accent font-medium flex items-center gap-1.5 pt-0.5">
              <Sparkles size={12} className="animate-spin" />
              <span>{currentStepData.highlightText}</span>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="col-span-12 md:col-span-4 flex items-center justify-start md:justify-end gap-2 shrink-0">
            <GlowButton 
              variant="secondary"
              size="sm"
              icon={SkipForward}
              onClick={() => {
                const nextStep = demoStep + 1;
                if (nextStep <= TOUR_STEPS.length) {
                  const nextStepData = TOUR_STEPS.find(s => s.step === nextStep)!;
                  if (nextStep === 3) setViewingReportProfileId("2");
                  if (nextStep === 7) setPremiumUser(true);
                  setActiveTab(nextStepData.tab);
                  setDemoStep(nextStep);
                } else {
                  stopDemoMode();
                }
              }}
            >
              Skip
            </GlowButton>

            <GlowButton 
              variant="glass"
              size="sm"
              icon={X}
              onClick={stopDemoMode}
            >
              Exit
            </GlowButton>
          </div>

        </div>

      </GlassCard>
    </div>
  );
}
