import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  Sparkles, Heart, Brain, Activity, Calendar, Volume2, VolumeX,
  RotateCw, Copy, Check, MessageSquare, Plus, Trash2, Edit3, 
  Download, PauseCircle, PlayCircle, ChevronRight, Star, Film, BookOpen, 
  Utensils, MapPin, Compass, ArrowUpRight, ShieldCheck, Zap, AlertCircle
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';

// Today's Insights Data Pool
const TODAY_INSIGHTS = [
  {
    id: 1,
    text: "You and Emma both respond well to thoughtful messages in the evening.",
    context: "Peak Sync Window: 8:30 PM - 10:15 PM",
    confidence: "98% Neural Match",
    actionTip: "Send a quiet voice note or a thoughtful question about her architectural project."
  },
  {
    id: 2,
    text: "Emma experiences her highest emotional security during unhurried 1-on-1 weekend conversations.",
    context: "Love Language: Quality Time & Acts of Service",
    confidence: "95% Behavioral Consistency",
    actionTip: "Block out Saturday morning for uninterrupted coffee and album listening."
  },
  {
    id: 3,
    text: "Her stress recovery cycle drops by 40% when you proactively coordinate dinner plans on Thursdays.",
    context: "Cognitive Load Relief",
    confidence: "92% Pattern Accuracy",
    actionTip: "Reserve a table at her favorite spot before she asks."
  }
];

// Conversation Coach Generator Types & Templates
const COACH_CATEGORIES = [
  { id: 'followup', label: 'Follow-up Question', icon: MessageSquare },
  { id: 'funny', label: 'Funny Message', icon: Sparkles },
  { id: 'romantic', label: 'Romantic Message', icon: Heart },
  { id: 'supportive', label: 'Supportive Message', icon: ShieldCheck },
  { id: 'deep', label: 'Deep Discussion Topic', icon: Brain }
];

const COACH_PROMPTS: Record<string, string[]> = {
  followup: [
    "How did that neural rendering test turn out today? I remember you were excited about the loss convergence curve.",
    "Did you manage to catch a moment for coffee between your design reviews, or was it non-stop chaos?",
    "Thinking back to our museum chat—did you ever look up that Japanese woodblock exhibit we were talking about?"
  ],
  funny: [
    "AI forecast indicates a 99.4% probability that we both deserve dark chocolate and zero adult responsibilities tonight.",
    "I just ran a diagnostic on our banter and the results came back dangerously witty. Proceed with caution.",
    "My coffee machine tried to match your Yirgacheffe recipe and immediately resigned in embarrassment."
  ],
  romantic: [
    "Just sitting here looking through our Oaxaca itinerary and realizing how lucky I am to explore the world with you.",
    "Even in a room full of noise, thinking of your voice brings me back to complete clarity.",
    "Some people read poetry to find calm; I just think back to our late-night tea talks on the balcony."
  ],
  supportive: [
    "I know your workload is heavy right now. You don't have to carry it all—I'm in your corner no matter what.",
    "Take a deep breath. You're insanely capable, and whatever happens today, I'm waiting with dinner ready.",
    "Remember to rest your eyes for a second. You don't have to optimize everything today."
  ],
  deep: [
    "If we could freeze one memory from this past year and re-live it every month, which moment would you choose?",
    "What is a dream you haven't spoken out loud yet because it feels too big or ambitious?",
    "How has your definition of a 'perfect home' evolved over the last couple of years?"
  ]
};

// Relationship Health Gauges
const HEALTH_GAUGES = [
  { key: 'Communication', score: 96, trend: '+4.2%', status: 'Radiant', color: '#A855F7', detail: 'Consistent evening syncs & active listening' },
  { key: 'Trust', score: 98, trend: '+2.1%', status: 'Unshakeable', color: '#EC4899', detail: 'High transparency & non-judgmental space' },
  { key: 'Engagement', score: 92, trend: '+5.0%', status: 'Thriving', color: '#3B82F6', detail: 'Frequent spontaneous check-ins & humor' },
  { key: 'Consistency', score: 94, trend: '+1.8%', status: 'Solid', color: '#10B981', detail: 'Reliable follow-through on commitments' },
  { key: 'Shared Interests', score: 90, trend: '+3.5%', status: 'Expanding', color: '#F59E0B', detail: 'Joint design, coffee, & travel pursuits' },
  { key: 'Future Planning', score: 95, trend: '+6.2%', status: 'Aligned', color: '#6366F1', detail: 'Co-created 2026 eco-loft & expedition roadmap' }
];

// Recommendations Dataset
const RECOMMENDATIONS = [
  {
    id: 'r1',
    category: 'Movies',
    title: 'Drive My Car (Ryusuke Hamaguchi)',
    subtitle: 'Deep Emotional Cinema • 3h 00m',
    match: 97,
    reason: 'Matches your shared appreciation for patient storytelling, atmospheric scores, and deep dialogue.',
    tag: 'Cinephile Night',
    icon: Film
  },
  {
    id: 'r2',
    category: 'Books',
    title: 'The Architecture of Happiness by Alain de Botton',
    subtitle: 'Philosophy & Design',
    match: 99,
    reason: 'Aligns directly with your joint aesthetic discussions on home design, spaces, and mood.',
    tag: 'Cozy Reading',
    icon: BookOpen
  },
  {
    id: 'r3',
    category: 'Restaurants',
    title: 'Atelier Crenn / Single Thread',
    subtitle: 'Organic Modernist Dining',
    match: 96,
    reason: 'Understated luxury, seasonal tasting menus, and intimate ambient lighting.',
    tag: 'Anniversary Pick',
    icon: Utensils
  },
  {
    id: 'r4',
    category: 'Weekend Activities',
    title: 'Private Wheel Throwing Pottery Workshop',
    subtitle: 'Tactile Creative Sync • 2.5 Hours',
    match: 94,
    reason: 'Zero screen time, hands-on creativity, and relaxed shared focus.',
    tag: 'Weekend Refresh',
    icon: Compass
  },
  {
    id: 'r5',
    category: 'Travel Ideas',
    title: 'Kyoto Ryokan & Bamboo Forest Sanctuary',
    subtitle: '10-Day Cultural Meditation',
    match: 98,
    reason: 'Complements your planned Oaxaca trip with tranquil minimalist architecture and tea ceremonies.',
    tag: 'Dream Getaway',
    icon: MapPin
  }
];

// Weekly Report Mock Chart Data
const WEEKLY_TREND_DATA = [
  { day: 'Mon', syncScore: 92, emotionalAlignment: 90, qualityMinutes: 85 },
  { day: 'Tue', syncScore: 95, emotionalAlignment: 94, qualityMinutes: 95 },
  { day: 'Wed', syncScore: 94, emotionalAlignment: 92, qualityMinutes: 90 },
  { day: 'Thu', syncScore: 98, emotionalAlignment: 97, qualityMinutes: 110 },
  { day: 'Fri', syncScore: 96, emotionalAlignment: 95, qualityMinutes: 125 },
  { day: 'Sat', syncScore: 99, emotionalAlignment: 99, qualityMinutes: 180 },
  { day: 'Sun', syncScore: 97, emotionalAlignment: 98, qualityMinutes: 160 }
];

export default function AuraCompanion() {
  const { 
    relosMemoryVault, 
    deleteMemoryVaultItem, 
    addMemoryVaultItem, 
    updateMemoryVaultItem,
    isMemoryPaused,
    togglePauseMemory,
    addToast,
    setActiveTab
  } = useAppStore();

  // Section 1: Insight State
  const [insightIndex, setInsightIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const cardGlowRef = useRef<HTMLDivElement>(null);

  // Section 2: Conversation Coach State
  const [selectedCoachCategory, setSelectedCoachCategory] = useState('followup');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isGeneratingCoach, setIsGeneratingCoach] = useState(false);
  const [currentCoachMessages, setCurrentCoachMessages] = useState<string[]>(COACH_PROMPTS['followup']);

  // Section 4: Memory Modal & Edit State
  const [memorySearch, setMemorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [memKey, setMemKey] = useState('');
  const [memVal, setMemVal] = useState('');
  const [memCategory, setMemCategory] = useState('Preferences');

  // Section 6: Recommendation Category Filter
  const [activeRecCategory, setActiveRecCategory] = useState<string>('All');

  // Section 8: Privacy Purge Confirmation Modal
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  // GSAP Entrance Glow Effect
  useEffect(() => {
    if (cardGlowRef.current) {
      gsap.to(cardGlowRef.current, {
        opacity: 0.8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, []);

  // Update Coach Messages when Category Changes
  useEffect(() => {
    setCurrentCoachMessages(COACH_PROMPTS[selectedCoachCategory] || COACH_PROMPTS['followup']);
  }, [selectedCoachCategory]);

  const handleGenerateFreshCoach = () => {
    setIsGeneratingCoach(true);
    setTimeout(() => {
      const base = COACH_PROMPTS[selectedCoachCategory] || COACH_PROMPTS['followup'];
      // Rotate list
      const shuffled = [...base].sort(() => Math.random() - 0.5);
      setCurrentCoachMessages(shuffled);
      setIsGeneratingCoach(false);
      addToast('Generated fresh conversation prompts tailored to Emma!', 'system');
    }, 600);
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    addToast('Message copied to clipboard!', 'system');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Memory Handlers
  const handleOpenNewMemoryModal = () => {
    setEditingMemoryId(null);
    setMemKey('');
    setMemVal('');
    setMemCategory('Preferences');
    setShowMemoryModal(true);
  };

  const handleOpenEditMemoryModal = (mem: { id: string; key: string; val: string; category: string }) => {
    setEditingMemoryId(mem.id);
    setMemKey(mem.key);
    setMemVal(mem.val);
    setMemCategory(mem.category);
    setShowMemoryModal(true);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memKey.trim() || !memVal.trim()) return;

    if (editingMemoryId) {
      updateMemoryVaultItem(editingMemoryId, memKey, memVal, memCategory);
      addToast('Memory updated successfully', 'system');
    } else {
      addMemoryVaultItem(memKey, memVal, memCategory);
      addToast('New memory saved to Aura Vault', 'system');
    }
    setShowMemoryModal(false);
  };

  const handleDeleteMemory = (id: string, keyName: string) => {
    deleteMemoryVaultItem(id);
    addToast(`Deleted memory: "${keyName}"`, 'system');
  };

  const handlePurgeAllMemories = () => {
    relosMemoryVault.forEach(m => deleteMemoryVaultItem(m.id));
    setShowPurgeModal(false);
    addToast('All memory vault items permanently deleted', 'system');
  };

  const handleExportData = () => {
    const exportPayload = {
      user: "Alex",
      partner: "Elena Rostova",
      exportedAt: new Date().toISOString(),
      companionVersion: "3.0 Flagship",
      memories: relosMemoryVault,
      relationshipHealth: HEALTH_GAUGES,
      insightsCount: TODAY_INSIGHTS.length,
      privacyStatus: {
        isPaused: isMemoryPaused,
        encryption: "AES-256-GCM Zero-Knowledge Vault"
      }
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_companion_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Aura Companion data exported successfully!', 'system');
  };

  // Default Memory Display Preset if empty
  const defaultMemoriesDisplay = [
    { id: 'dm1', category: 'Coffee/Food', key: 'Favorite Coffee', val: 'Single-origin Ethiopian Yirgacheffe, light roast, oat milk', updated: '2 days ago' },
    { id: 'dm2', category: 'Dates/Milestones', key: 'Birthday', val: 'November 24 (Sagittarius)', updated: '1 week ago' },
    { id: 'dm3', category: 'Travel', key: 'Dream Destination', val: 'Kyoto Ryokan & Oaxaca Artisan Tour', updated: '3 days ago' },
    { id: 'dm4', category: 'Music/Arts', key: 'Favorite Music', val: 'Post-minimalist classical, Nils Frahm, Modular ambient', updated: '5 days ago' },
    { id: 'dm5', category: 'Coffee/Food', key: 'Favorite Food', val: 'Authentic Neapolitan Pizza & Dark Chocolate >75%', updated: '1 week ago' },
    { id: 'dm6', category: 'Dates/Milestones', key: 'Important Milestones', val: 'First Date Nov 2nd (Art Gallery), Loft Co-living Jan 15th', updated: '2 weeks ago' }
  ];

  const activeMemories = relosMemoryVault.length > 0 ? relosMemoryVault : defaultMemoriesDisplay;

  const filteredMemories = activeMemories.filter(m => {
    const matchesSearch = m.key.toLowerCase().includes(memorySearch.toLowerCase()) || 
                          m.val.toLowerCase().includes(memorySearch.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredRecs = activeRecCategory === 'All' 
    ? RECOMMENDATIONS 
    : RECOMMENDATIONS.filter(r => r.category === activeRecCategory);

  const currentInsight = TODAY_INSIGHTS[insightIndex];

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans antialiased selection:bg-primary/30 text-white">
      {/* Permanent Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Container Viewport */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-12 relative z-10 overflow-x-hidden">
        
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Aura Companion v3.0 — Flagship Intelligence
              </Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Continuous Memory Sync Active</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="text-accent shrink-0" size={38} /> Aura Companion
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl font-sans leading-relaxed">
              Your persistent, intelligent relationship assistant. Aura continuously analyzes behavioral nuances, remembers crucial details, and provides proactive guidance to build a healthier connection.
            </p>
          </div>

          {/* Partner Status Pill */}
          <GlassCard className="p-4 bg-card-dark/80 border-primary/30 flex items-center gap-4 shrink-0 shadow-[0_0_30px_rgba(168,85,247,0.12)]">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white text-lg shadow-lg">
                E
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" />
            </div>
            <div>
              <div className="text-xs text-white/50 font-mono uppercase tracking-wider">Synced Partner</div>
              <div className="text-base font-semibold text-white">Elena Rostova</div>
              <div className="text-xs text-accent font-medium flex items-center gap-1 mt-0.5">
                <Heart size={12} className="fill-accent" /> 96.8% Deep Harmony
              </div>
            </div>
          </GlassCard>
        </div>

        {/* SECTION 1: Today's Insight */}
        <section aria-labelledby="section-today-insight">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              <h2 id="section-today-insight" className="text-xl sm:text-2xl font-display font-bold text-white">
                Today's Insight
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInsightIndex((prev) => (prev + 1) % TODAY_INSIGHTS.length)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCw size={13} />
                <span>Next Insight ({insightIndex + 1}/{TODAY_INSIGHTS.length})</span>
              </button>
            </div>
          </div>

          <GlassCard 
            variant="glow" 
            className="relative p-6 sm:p-8 bg-gradient-to-br from-primary/15 via-card-dark/90 to-accent/15 border-primary/40 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.18)]"
          >
            {/* Background Ambient Glow */}
            <div ref={cardGlowRef} className="absolute -right-20 -top-20 w-80 h-80 bg-accent/20 rounded-full filter blur-[100px] pointer-events-none opacity-50" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="accent" size="sm" icon={Zap}>
                    {currentInsight.confidence}
                  </Badge>
                  <span className="text-xs text-white/50 font-mono">{currentInsight.context}</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={currentInsight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl sm:text-3xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-md"
                  >
                    "{currentInsight.text}"
                  </motion.blockquote>
                </AnimatePresence>

                <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-pink-300/90 font-medium">
                  <Sparkles size={15} className="shrink-0 text-accent" />
                  <span><strong>Aura Recommendation:</strong> {currentInsight.actionTip}</span>
                </div>
              </div>

              {/* Interactive Insight Tools */}
              <div className="flex flex-row md:flex-col items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
                <GlowButton
                  variant={isPlayingAudio ? 'accent' : 'glass'}
                  size="sm"
                  onClick={() => {
                    setIsPlayingAudio(!isPlayingAudio);
                    addToast(isPlayingAudio ? 'Audio summary paused' : 'Playing AI Voice Insight summary...', 'system');
                  }}
                  icon={isPlayingAudio ? VolumeX : Volume2}
                >
                  {isPlayingAudio ? 'Pause Audio' : 'Play Insight'}
                </GlowButton>

                <GlowButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`"${currentInsight.text}" — Aura Companion Insight`);
                    addToast('Insight copied to clipboard', 'system');
                  }}
                  icon={Copy}
                >
                  Share
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 2: Conversation Coach */}
        <section aria-labelledby="section-conversation-coach" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="text-accent" size={20} />
                <h2 id="section-conversation-coach" className="text-xl sm:text-2xl font-display font-bold text-white">
                  Conversation Coach
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Real-time message generation optimized for Elena's MBTI (INTJ) and communication style.
              </p>
            </div>

            <GlowButton
              variant="primary"
              size="sm"
              isLoading={isGeneratingCoach}
              onClick={handleGenerateFreshCoach}
              icon={Sparkles}
            >
              Generate New Suggestions
            </GlowButton>
          </div>

          {/* Coach Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {COACH_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCoachCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCoachCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border
                    ${isActive
                      ? 'bg-gradient-to-r from-primary/30 via-purple-600/20 to-accent/30 border-primary text-white shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                      : 'bg-card-dark/60 border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-accent' : 'text-white/40'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Generated Suggestion Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentCoachMessages.map((msg, idx) => (
              <GlassCard
                key={idx}
                variant="interactive"
                className="p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span>OPTION 0{idx + 1}</span>
                    <span className="text-accent flex items-center gap-1">
                      <Star size={11} className="fill-accent" /> High Harmony
                    </span>
                  </div>
                  <p className="text-sm font-sans text-white/90 leading-relaxed group-hover:text-white transition-colors">
                    "{msg}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyMessage(msg, idx)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedIndex === idx ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('chats');
                      addToast('Loaded message into active chat thread!', 'chat');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-xs text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Use in Chat</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* SECTION 3: Relationship Health Gauges */}
        <section aria-labelledby="section-health-gauges" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="text-emerald-400" size={20} />
                <h2 id="section-health-gauges" className="text-xl sm:text-2xl font-display font-bold text-white">
                  Relationship Health
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Real-time multi-dimensional vitality score derived from communication velocity, trust, and co-planning.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {HEALTH_GAUGES.map((gauge) => (
              <GlassCard key={gauge.key} variant="interactive" className="p-4 flex flex-col items-center text-center space-y-3">
                {/* Circular Animated SVG Gauge */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke={gauge.color} 
                      strokeWidth="8" 
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * gauge.score) / 100 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-extrabold text-lg text-white leading-none">
                      {gauge.score}%
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono mt-0.5">{gauge.trend}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white truncate max-w-full">{gauge.key}</h3>
                  <div className="text-[10px] text-accent font-medium mt-0.5">{gauge.status}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* SECTION 4: Memory Vault */}
        <section aria-labelledby="section-memory-vault" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="text-primary" size={20} />
                <h2 id="section-memory-vault" className="text-xl sm:text-2xl font-display font-bold text-white">
                  Memory Vault
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Aura automatically retains key preferences, favorite items, and important milestones.
              </p>
            </div>

            <GlowButton
              variant="glass"
              size="sm"
              onClick={handleOpenNewMemoryModal}
              icon={Plus}
            >
              Add Memory
            </GlowButton>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search remembered coffee, music, dates, or milestones..."
                value={memorySearch}
                onChange={(e) => setMemorySearch(e.target.value)}
                className="w-full glass-input pl-10 text-xs sm:text-sm"
              />
              <Brain size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {['All', 'Preferences', 'Coffee/Food', 'Dates/Milestones', 'Travel', 'Music/Arts'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border
                    ${selectedCategory === cat
                      ? 'bg-primary/25 border-primary text-white font-semibold'
                      : 'bg-white/5 border-white/8 text-white/60 hover:text-white'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Memory Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map((mem) => (
              <GlassCard
                key={mem.id}
                variant="interactive"
                className="p-5 flex flex-col justify-between space-y-3 hover:border-accent/40 group relative"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <Badge variant="primary" size="sm">
                      {mem.category}
                    </Badge>
                    <span className="text-[10px] text-white/40 font-mono">{mem.updated}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white group-hover:text-accent transition-colors">
                    {mem.key}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-white/80 mt-1 leading-relaxed">
                    {mem.val}
                  </p>
                </div>

                {/* Edit & Delete Controls */}
                <div className="pt-3 border-t border-white/8 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditMemoryModal(mem)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Edit Memory"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteMemory(mem.id, mem.key)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="Delete Memory"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* SECTION 5: Upcoming Events */}
        <section aria-labelledby="section-upcoming-events" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="text-accent" size={20} />
                <h2 id="section-upcoming-events" className="text-xl sm:text-2xl font-display font-bold text-white">
                  Upcoming Events & Milestones
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Automated calendar tracking for birthdays, anniversaries, planned dates, and co-created goals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard variant="glow" className="p-5 space-y-4 border-pink-500/30">
              <div className="flex items-center justify-between">
                <Badge variant="accent" size="sm">Birthday</Badge>
                <span className="text-xs text-white/40 font-mono">116 Days Left</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Elena's 27th Birthday</h3>
                <p className="text-xs text-white/60 mt-0.5">Nov 24 • Gift Idea: Vintage Record Player</p>
              </div>
              <button 
                onClick={() => addToast('Added birthday gift idea reminder!', 'system')}
                className="w-full py-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-xs text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Plan Celebration</span>
                <ChevronRight size={14} />
              </button>
            </GlassCard>

            <GlassCard variant="interactive" className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">Anniversary</Badge>
                <span className="text-xs text-white/40 font-mono">94 Days Left</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">First Date Anniversary</h3>
                <p className="text-xs text-white/60 mt-0.5">Nov 02 • Art Gallery & Fine Dining</p>
              </div>
              <button 
                onClick={() => addToast('Opening Date Planner with pre-filled anniversary options...', 'system')}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Reserve Venue</span>
                <ChevronRight size={14} />
              </button>
            </GlassCard>

            <GlassCard variant="interactive" className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="success" size="sm">Planned Date</Badge>
                <span className="text-xs text-emerald-400 font-mono font-semibold">In 2 Days</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Pottery & Supper Sync</h3>
                <p className="text-xs text-white/60 mt-0.5">Friday 7:30 PM • Atelier Studio</p>
              </div>
              <button 
                onClick={() => addToast('Calendar entry synced to mobile device!', 'system')}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight size={14} />
              </button>
            </GlassCard>

            <GlassCard variant="interactive" className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="warning" size="sm">Shared Goal</Badge>
                <span className="text-xs text-white/40 font-mono">Aug 2026</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Oaxaca Expedition</h3>
                <p className="text-xs text-white/60 mt-0.5">14-Day Cultural Research & Flights</p>
              </div>
              <button 
                onClick={() => setActiveTab('couple-os')}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Track Goal Progress</span>
                <ChevronRight size={14} />
              </button>
            </GlassCard>
          </div>
        </section>

        {/* SECTION 6: Recommendations */}
        <section aria-labelledby="section-recommendations" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="text-primary" size={20} />
                <h2 id="section-recommendations" className="text-xl sm:text-2xl font-display font-bold text-white">
                  Curated Recommendations
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Hand-picked cinema, books, dining, and weekend activities tailored to your joint tastes.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {['All', 'Movies', 'Books', 'Restaurants', 'Weekend Activities', 'Travel Ideas'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveRecCategory(cat)}
                  className={`
                    px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border
                    ${activeRecCategory === cat
                      ? 'bg-gradient-to-r from-primary to-accent border-white/20 text-white font-bold'
                      : 'bg-card-dark/60 border-white/10 text-white/60 hover:text-white'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecs.map((rec) => {
              const Icon = rec.icon;
              return (
                <GlassCard key={rec.id} variant="interactive" className="p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-semibold text-white/70">{rec.category}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                        {rec.match}% Match
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-white">{rec.title}</h3>
                      <p className="text-xs text-white/50 font-mono mt-0.5">{rec.subtitle}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/80 leading-relaxed font-sans">
                      <strong className="text-primary font-medium">Why Aura Recommends: </strong>
                      {rec.reason}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">{rec.tag}</span>
                    <button 
                      onClick={() => addToast(`Saved "${rec.title}" to shared wishlist!`, 'system')}
                      className="px-3 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Save Option</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* SECTION 7: Weekly Report Dashboard */}
        <section aria-labelledby="section-weekly-report" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="text-accent" size={20} />
                <h2 id="section-weekly-report" className="text-xl sm:text-2xl font-display font-bold text-white">
                  Weekly Relationship Report
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Visual analytics and AI recommendations based on this week's communication and quality time.
              </p>
            </div>
            <Badge variant="accent" size="sm">Week 30 • 2026</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Recharts Area Chart */}
            <GlassCard variant="default" className="lg:col-span-2 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">Emotional Alignment & Sync Velocity</h3>
                  <p className="text-xs text-white/50">Daily synchronization metrics over the last 7 days</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Sync Score
                  </span>
                  <span className="flex items-center gap-1.5 text-accent">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Emotional Alignment
                  </span>
                </div>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WEEKLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSync" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAlign" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                    <YAxis domain={[80, 100]} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0A0A12', 
                        borderColor: 'rgba(255,255,255,0.15)', 
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px' 
                      }} 
                    />
                    <Area type="monotone" dataKey="syncScore" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorSync)" />
                    <Area type="monotone" dataKey="emotionalAlignment" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorAlign)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* AI Strategic Suggestions */}
            <GlassCard variant="default" className="p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Sparkles className="text-accent" size={18} /> Strategic AI Suggestions
                </h3>
                <p className="text-xs text-white/50 mt-0.5">Top 3 focal points for next week</p>

                <div className="space-y-3 mt-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 space-y-1">
                    <div className="text-xs font-semibold text-accent">1. Schedule a Phone-Free Evening</div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Your uninterrupted quality time peaked on Saturday. Plan a digital detox dinner on Thursday.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 space-y-1">
                    <div className="text-xs font-semibold text-primary">2. Acknowledge Project Milestones</div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Elena finishes her architectural presentation on Wednesday. Proactively celebrate her effort.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 space-y-1">
                    <div className="text-xs font-semibold text-emerald-400">3. Finalize Oaxaca Flights</div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Co-booking flights reduces low-level planning anxiety by an estimated 35%.
                    </p>
                  </div>
                </div>
              </div>

              <GlowButton 
                variant="glass" 
                size="sm" 
                className="w-full mt-4" 
                onClick={() => addToast('Weekly relationship summary emailed to your account.', 'system')}
              >
                Export Weekly PDF Summary
              </GlowButton>
            </GlassCard>
          </div>
        </section>

        {/* SECTION 8: Privacy & Memory Control */}
        <section aria-labelledby="section-privacy-controls">
          <GlassCard variant="glow" className="p-6 sm:p-8 bg-card-dark/90 border-white/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={24} />
                  <h2 id="section-privacy-controls" className="text-xl sm:text-2xl font-display font-bold text-white">
                    Privacy & Data Sovereignty
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl">
                  Aura Companion enforces end-to-end user data sovereignty. Your memory vault is encrypted locally and never shared with third parties or advertising networks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={isMemoryPaused ? "warning" : "success"} size="md">
                  {isMemoryPaused ? "Memory Learning: PAUSED" : "Memory Learning: ACTIVE"}
                </Badge>
              </div>
            </div>

            {/* Privacy Controls Action Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Action 1: Delete Memory Bank */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Trash2 size={16} /> Delete Memories
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Permanently purge all stored memories, preferences, and milestone data from Aura Vault.
                </p>
                <GlowButton 
                  variant="danger" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowPurgeModal(true)}
                >
                  Delete All Data
                </GlowButton>
              </div>

              {/* Action 2: Pause Memory Learning */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  {isMemoryPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                  <span>{isMemoryPaused ? "Resume Memory Learning" : "Pause Memory Learning"}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Temporarily stop Aura from ingesting new chat messages or saving new preferences.
                </p>
                <GlowButton 
                  variant="glass" 
                  size="sm" 
                  className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  onClick={() => {
                    togglePauseMemory();
                    addToast(isMemoryPaused ? 'Resumed Aura memory ingestion' : 'Paused Aura memory ingestion', 'system');
                  }}
                >
                  {isMemoryPaused ? "Resume Ingestion" : "Pause Ingestion"}
                </GlowButton>
              </div>

              {/* Action 3: Export Data */}
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Download size={16} /> Export Companion Data
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Download a full JSON archive of all your memories, scores, and relationship insights.
                </p>
                <GlowButton 
                  variant="glass" 
                  size="sm" 
                  className="w-full border-primary/30 text-white hover:bg-primary/20"
                  onClick={handleExportData}
                >
                  Export JSON Archive
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        </section>

      </main>

      {/* Memory Add/Edit Modal */}
      <Modal
        isOpen={showMemoryModal}
        onClose={() => setShowMemoryModal(false)}
        title={editingMemoryId ? "Edit Memory Vault Item" : "Add New Memory"}
      >
        <form onSubmit={handleSaveMemory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Memory Title / Key</label>
            <input
              type="text"
              placeholder="e.g. Favorite Tea, Anniversary Spot, Ring Size"
              value={memKey}
              onChange={(e) => setMemKey(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Category</label>
            <select
              value={memCategory}
              onChange={(e) => setMemCategory(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm bg-card-dark text-white"
            >
              <option value="Preferences">Preferences</option>
              <option value="Coffee/Food">Coffee/Food</option>
              <option value="Dates/Milestones">Dates/Milestones</option>
              <option value="Travel">Travel</option>
              <option value="Music/Arts">Music/Arts</option>
              <option value="Keepsakes">Keepsakes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Details & Values</label>
            <textarea
              placeholder="Enter exact preference details..."
              value={memVal}
              onChange={(e) => setMemVal(e.target.value)}
              rows={3}
              className="w-full glass-input text-xs sm:text-sm resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <GlowButton variant="secondary" size="sm" onClick={() => setShowMemoryModal(false)}>
              Cancel
            </GlowButton>
            <GlowButton type="submit" variant="primary" size="sm">
              Save Memory
            </GlowButton>
          </div>
        </form>
      </Modal>

      {/* Memory Purge Confirmation Modal */}
      <Modal
        isOpen={showPurgeModal}
        onClose={() => setShowPurgeModal(false)}
        title="Confirm Memory Vault Purge"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>
              Warning: This action is permanent and cannot be undone. All remembered preferences, coffee tastes, and milestone records will be purged.
            </span>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            Are you sure you want to completely erase the Aura Companion memory vault?
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <GlowButton variant="secondary" size="sm" onClick={() => setShowPurgeModal(false)}>
              Cancel
            </GlowButton>
            <GlowButton variant="danger" size="sm" onClick={handlePurgeAllMemories}>
              Permanently Delete All Memories
            </GlowButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
