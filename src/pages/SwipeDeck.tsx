import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  Heart, X, Star, RotateCcw, Sparkles, MapPin, Briefcase, 
  Check, AlertTriangle, Gift, Calendar, Compass
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Profile } from '../data/mockData';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

export default function SwipeDeck() {
  const { 
    profiles, 
    userProfile, 
    likeProfile, 
    setActiveTab,
    setSelectedMatchId,
    setViewingReportProfileId
  } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [matchCelebration, setMatchCelebration] = useState<Profile | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  // Motion values for swiping
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const cardControls = useAnimation();

  // Overlay mappings
  const rotate = useTransform(motionX, [-300, 300], [-30, 30]);
  const likeOpacity = useTransform(motionX, [0, 150], [0, 1]);
  const passOpacity = useTransform(motionX, [-150, 0], [1, 0]);
  const superLikeOpacity = useTransform(motionY, [-150, 0], [1, 0]);

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [currentIndex]);

  const triggerSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (!currentProfile) return;

    if (direction === 'left') {
      await cardControls.start({ x: -600, opacity: 0, rotate: -35, transition: { duration: 0.3 } });
      handleSwipeComplete(false);
    } else if (direction === 'right') {
      await cardControls.start({ x: 600, opacity: 0, rotate: 35, transition: { duration: 0.3 } });
      handleSwipeComplete(true);
    } else if (direction === 'up') {
      await cardControls.start({ y: -700, opacity: 0, scale: 0.85, transition: { duration: 0.3 } });
      handleSwipeComplete(true, true);
    }
  };

  const handleSwipeComplete = (liked: boolean, superLiked: boolean = false) => {
    if (!currentProfile) return;

    setHistory(prev => [...prev, currentIndex]);

    if (liked || superLiked) {
      likeProfile(currentProfile.id);
      if (Math.random() < 0.85) {
        setMatchCelebration(currentProfile);
      } else {
        advanceDeck();
      }
    } else {
      advanceDeck();
    }
  };

  const advanceDeck = () => {
    motionX.set(0);
    motionY.set(0);
    cardControls.set({ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 });
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(profiles.length);
    }
  };

  const handleUndo = async () => {
    if (history.length === 0) return;
    const previousIndex = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    
    cardControls.set({ x: -600, opacity: 0, rotate: -35 });
    setCurrentIndex(previousIndex);
    await cardControls.start({ x: 0, opacity: 1, rotate: 0, transition: { duration: 0.4, type: 'spring' } });
  };

  const handleDragEnd = async (_: any, info: any) => {
    const swipeThresholdX = 130;
    const swipeThresholdY = -110;

    if (info.offset.x > swipeThresholdX) {
      triggerSwipe('right');
    } else if (info.offset.x < -swipeThresholdX) {
      triggerSwipe('left');
    } else if (info.offset.y < swipeThresholdY) {
      triggerSwipe('up');
    } else {
      cardControls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 220, damping: 20 } });
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentProfile) return;
    setActiveImageIndex(prev => (prev + 1) % currentProfile.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentProfile) return;
    setActiveImageIndex(prev => (prev - 1 + currentProfile.images.length) % currentProfile.images.length);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 grid grid-cols-12 gap-6 md:gap-8 items-start relative z-10 max-w-7xl mx-auto">
        
        {/* Match Celebration Modal */}
        <Modal 
          isOpen={!!matchCelebration} 
          onClose={() => setMatchCelebration(null)}
          title="It's a Neural Match!"
        >
          {matchCelebration && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto mb-4 text-accent shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                <Sparkles size={32} className="animate-spin" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Frequency Alignment: <span className="gradient-text">{matchCelebration.compatibilityReport.overall}%</span>
              </h2>
              <p className="text-xs text-white/60 mb-6">
                Your neural traits and behavioral values are strongly synchronized.
              </p>
              
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-18 h-18 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {userProfile.name.charAt(0)}
                  </div>
                  <span className="text-xs text-white/50 mt-2">{userProfile.name}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <Heart className="text-accent fill-accent animate-pulse" size={28} />
                </div>

                <div className="flex flex-col items-center">
                  <img 
                    src={matchCelebration.images[0]} 
                    alt={matchCelebration.name} 
                    className="w-18 h-18 rounded-full object-cover border border-white/20 shadow-lg"
                  />
                  <span className="text-xs text-white/50 mt-2">{matchCelebration.name}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/8 rounded-2xl p-4 italic text-xs text-white/80 mb-6 leading-relaxed">
                "{matchCelebration.compatibilityReport.summary}"
              </div>

              <div className="flex gap-3">
                <GlowButton 
                  className="flex-1"
                  onClick={() => {
                    setSelectedMatchId(matchCelebration.id);
                    setMatchCelebration(null);
                    setActiveTab('chats');
                  }}
                >
                  Start Chat Now
                </GlowButton>
                <GlowButton 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => {
                    setMatchCelebration(null);
                    advanceDeck();
                  }}
                >
                  Keep Swiping
                </GlowButton>
              </div>
            </div>
          )}
        </Modal>

        {/* Center Swipe Card */}
        <div className="col-span-12 lg:col-span-7 flex flex-col items-center gap-6">
          <AnimatePresence mode="popLayout">
            {currentProfile ? (
              <motion.div
                key={currentProfile.id}
                style={{ x: motionX, y: motionY, rotate }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                animate={cardControls}
                className="w-full max-w-[480px] h-[640px] rounded-[28px] overflow-hidden relative cursor-grab active:cursor-grabbing border border-white/10 shadow-2xl bg-card-dark flex flex-col justify-between"
              >
                {/* Swipe Text Overlay Badges */}
                <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 rotate-[-12deg] z-20 border-4 border-accent text-accent font-display font-black text-3xl px-4 py-2 rounded-2xl pointer-events-none uppercase tracking-wider bg-black/40 backdrop-blur-md">
                  LIKE
                </motion.div>
                <motion.div style={{ opacity: passOpacity }} className="absolute top-8 right-8 rotate-[12deg] z-20 border-4 border-white/40 text-white/70 font-display font-black text-3xl px-4 py-2 rounded-2xl pointer-events-none uppercase tracking-wider bg-black/40 backdrop-blur-md">
                  PASS
                </motion.div>
                <motion.div style={{ opacity: superLikeOpacity }} className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 border-4 border-primary text-primary font-display font-black text-3xl px-4 py-2 rounded-2xl pointer-events-none uppercase tracking-wider bg-black/40 backdrop-blur-md">
                  SUPER LIKE
                </motion.div>

                {/* Main Profile Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={currentProfile.images[activeImageIndex]} 
                    alt={currentProfile.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040408] via-black/35 to-transparent z-10" />

                  {/* Image Carousel Bar */}
                  <div className="absolute top-4 left-6 right-6 flex gap-1.5 z-20">
                    {currentProfile.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 flex-1 rounded-full transition-all ${i === activeImageIndex ? 'bg-accent shadow-sm' : 'bg-white/30'}`}
                      />
                    ))}
                  </div>

                  {/* Photo Nav Triggers */}
                  <button onClick={prevImage} className="absolute left-0 top-0 bottom-28 w-1/3 z-10 cursor-w-resize" aria-label="Previous photo" />
                  <button onClick={nextImage} className="absolute right-0 top-0 bottom-28 w-1/3 z-10 cursor-e-resize" aria-label="Next photo" />

                  {/* Match Score Chip */}
                  <div 
                    className="absolute top-8 right-6 z-20"
                    onClick={() => {
                      setViewingReportProfileId(currentProfile.id);
                      setActiveTab('report');
                    }}
                  >
                    <Badge variant="accent" size="lg" icon={Sparkles} className="cursor-pointer hover:scale-105">
                      Match: {currentProfile.compatibilityReport.overall}%
                    </Badge>
                  </div>
                </div>

                {/* Profile Card Footer */}
                <div className="mt-auto p-6 relative z-15 w-full flex flex-col justify-end">
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-display font-extrabold text-white">
                        {currentProfile.name}, {currentProfile.age}
                      </h2>
                      <Badge variant="primary" size="sm">
                        {currentProfile.personalityType}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-xs text-white/70">
                      <div className="flex items-center gap-1.5"><Briefcase size={13} className="text-primary" /> {currentProfile.occupation}</div>
                      <div className="flex items-center gap-1.5"><MapPin size={13} className="text-accent" /> {currentProfile.location}</div>
                    </div>
                  </div>

                  <p className="text-xs text-white/80 line-clamp-2 italic mb-4">"{currentProfile.bio}"</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {currentProfile.interests.slice(0, 4).map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-[10px] text-white/80 backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <button 
                      onClick={handleUndo} 
                      disabled={history.length === 0}
                      className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 cursor-pointer transition-all"
                      aria-label="Undo last swipe"
                    >
                      <RotateCcw size={16} />
                    </button>
                    
                    <button 
                      onClick={() => triggerSwipe('left')} 
                      className="w-14 h-14 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 cursor-pointer shadow-lg transition-transform hover:scale-105"
                      aria-label="Pass profile"
                    >
                      <X size={24} />
                    </button>
                    
                    <button 
                      onClick={() => triggerSwipe('up')} 
                      className="w-12 h-12 rounded-full border border-primary/30 bg-primary/20 backdrop-blur-xl flex items-center justify-center text-purple-300 hover:bg-primary/30 hover:text-white cursor-pointer shadow-lg transition-transform hover:scale-105"
                      aria-label="Super Like profile"
                    >
                      <Star size={20} className="fill-purple-300/30" />
                    </button>
                    
                    <button 
                      onClick={() => triggerSwipe('right')} 
                      className="w-14 h-14 rounded-full border border-accent/40 bg-accent/20 backdrop-blur-xl flex items-center justify-center text-pink-300 hover:bg-accent/35 hover:text-white cursor-pointer shadow-lg transition-transform hover:scale-105"
                      aria-label="Like profile"
                    >
                      <Heart size={24} className="fill-accent/20" />
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="Sync Deck Depleted"
                description="No matching neural frequencies remain in your orbit. Recalibrate your MBTI dimensions or refresh the deck."
                actionLabel="Refresh Deck Frequencies"
                onAction={() => setCurrentIndex(1)}
                className="max-w-[480px] w-full"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right AI Analytics Panel */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {currentProfile ? (
            <GlassCard className="p-6 border-white/10 bg-card-dark/60 h-[640px] overflow-y-auto" hoverEffect={false}>
              
              <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-accent" size={18} />
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">AI Compatibility Telemetry</h3>
                </div>
                <Badge variant="glass" size="sm">
                  {currentProfile.personalityType}
                </Badge>
              </div>

              {/* Gauge & Summary */}
              <div className="flex items-center gap-5 bg-white/[0.02] border border-white/8 p-4 rounded-2xl mb-6">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 100 100" className="rotate-90 w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#EC4899" 
                      strokeWidth="8" 
                      strokeDasharray="250" 
                      initial={{ strokeDashoffset: 250 }}
                      animate={{ strokeDashoffset: 250 - (250 * currentProfile.compatibilityReport.overall) / 100 }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-display font-extrabold text-sm text-white">
                    {currentProfile.compatibilityReport.overall}%
                  </div>
                </div>
                <p className="text-xs text-white/80 leading-relaxed italic">
                  "{currentProfile.compatibilityReport.summary}"
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Communication", val: currentProfile.compatibilityReport.communication },
                  { label: "Chemistry", val: currentProfile.compatibilityReport.chemistry },
                  { label: "Lifestyle", val: currentProfile.compatibilityReport.lifestyle },
                  { label: "Future Potential", val: currentProfile.compatibilityReport.longTerm }
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/6 rounded-xl p-3">
                    <span className="text-[10px] text-white/50 block mb-1 uppercase font-mono font-semibold">{item.label}</span>
                    <span className="font-display font-bold text-sm text-white">{item.val}%</span>
                  </div>
                ))}
              </div>

              {/* Trait Bars */}
              <div className="space-y-4 mb-6">
                <h4 className="text-[10px] text-purple-300 uppercase font-bold tracking-wider font-mono">Personality Trait Alignment</h4>
                {Object.entries(currentProfile.traits).map(([trait, value]) => {
                  const userVal = userProfile.traits[trait as keyof typeof userProfile.traits] || 50;
                  return (
                    <div key={trait} className="text-xs">
                      <div className="flex justify-between mb-1 text-white/70">
                        <span className="capitalize">{trait}</span>
                        <span className="font-mono text-[11px]">You: {userVal}% | {currentProfile.name}: {value}%</span>
                      </div>
                      <div className="h-2 bg-white/8 rounded-full relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-0 bg-primary/50 rounded-l-full" style={{ width: `${userVal}%` }} />
                        <div className="absolute top-0 bottom-0 bg-accent/60 rounded-r-full" style={{ left: `${userVal}%`, width: `${Math.abs(value - userVal)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Flags */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h5 className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2 font-mono">Green Flags</h5>
                  <ul className="space-y-1.5">
                    {currentProfile.compatibilityReport.greenFlags.map((flag, idx) => (
                      <li key={idx} className="text-[11px] text-white/70 flex items-start gap-1.5">
                        <Check size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-2 font-mono">Risks & Considerations</h5>
                  <ul className="space-y-1.5">
                    {currentProfile.compatibilityReport.weaknesses.map((flag, idx) => (
                      <li key={idx} className="text-[11px] text-white/70 flex items-start gap-1.5">
                        <AlertTriangle size={11} className="text-amber-400 mt-0.5 shrink-0" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions & Action */}
              <div className="border-t border-white/8 pt-4 space-y-4">
                <div>
                  <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <Calendar size={12} className="text-accent" /> Recommended First Date
                  </h5>
                  <p className="text-xs text-white/80 leading-relaxed bg-white/[0.03] border border-white/6 p-3 rounded-xl">
                    {currentProfile.compatibilityReport.perfectFirstDate}
                  </p>
                </div>
                
                <div>
                  <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <Gift size={12} className="text-primary" /> Curated Gift Ideas
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.compatibilityReport.giftSuggestions.map((gift, idx) => (
                      <Badge key={idx} variant="glass" size="sm">
                        {gift}
                      </Badge>
                    ))}
                  </div>
                </div>

                <GlowButton 
                  onClick={() => {
                    setViewingReportProfileId(currentProfile.id);
                    setActiveTab('report');
                  }}
                  variant="glass"
                  className="w-full mt-4 border-accent/30 text-pink-300"
                  icon={Compass}
                >
                  View Full Diagnostic Report
                </GlowButton>
              </div>

            </GlassCard>
          ) : (
            <div className="h-[640px] flex items-center justify-center glass-panel border-white/8 p-8 text-center text-white/40">
              Select a signature in the Swipe Deck to view compatibility indicators.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
