import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, Activity, Shield, Calendar, Bot, Brain, Compass, 
  TrendingUp, Zap, Clock, Gift, Smile, Award, Flame, MapPin, CheckCircle2, 
  MessageCircle, Utensils, BookOpen, Coffee, Film, Plus, ChevronRight,
  ArrowUpRight, Star, RefreshCw, X, MessageSquare, Bookmark
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import CompanionCanvas from '../components/CompanionCanvas';
import type { MemoryNodeData } from '../components/CompanionCanvas';
import { useAppStore } from '../store/useAppStore';

// Radar Chart Data
const RADAR_DATA = [
  { trait: 'Communication', score: 94, fullMark: 100 },
  { trait: 'Lifestyle', score: 92, fullMark: 100 },
  { trait: 'Humor', score: 98, fullMark: 100 },
  { trait: 'Trust', score: 99, fullMark: 100 },
  { trait: 'Emotion', score: 96, fullMark: 100 },
  { trait: 'Future', score: 95, fullMark: 100 }
];

// Mood Analytics 7-Day Trend
const MOOD_TREND_DATA = [
  { day: 'Mon', mood: 88, sync: 90 },
  { day: 'Tue', mood: 94, sync: 95 },
  { day: 'Wed', mood: 91, sync: 92 },
  { day: 'Thu', mood: 98, sync: 97 },
  { day: 'Fri', mood: 95, sync: 96 },
  { day: 'Sat', mood: 99, sync: 99 },
  { day: 'Sun', mood: 97, sync: 98 }
];

// AI Memory Vault Items
const MEMORY_GRID = [
  { category: 'Favorite Food', value: 'Japanese Omakase & Artisan Ramen', icon: Utensils, badge: 'Gastronomy' },
  { category: 'Coffee Preference', value: 'Oat Milk Cortado (Extra Hot)', icon: Coffee, badge: 'Daily Ritual' },
  { category: 'Movies & Cinema', value: 'Atmospheric Sci-Fi & Indie Films', icon: Film, badge: 'Cinephile' },
  { category: 'Books & Reading', value: 'Modern Architecture & Philosophy', icon: BookOpen, badge: 'Intellectual' },
  { category: 'Travel Dreams', value: 'Kyoto Ryokan & Oaxaca Retreat', icon: MapPin, badge: 'Wanderlust' },
  { category: 'Special Date', value: 'November 14 (Scorpio • Birthday)', icon: Gift, badge: 'Celebration' }
];

// AI Suggestions List
const AI_SUGGESTIONS = [
  { title: 'Best Time to Message', detail: '7:30 PM Tonight (Peak Receptivity)', tag: 'Optimal Sync', icon: Clock, color: 'text-accent' },
  { title: 'Suggested Date', detail: 'Private Pottery & Wine Workshop', tag: 'High Compatibility', icon: Compass, color: 'text-primary' },
  { title: 'Gift Idea', detail: 'First Edition Architecture Art Book', tag: '99% Affinity', icon: Gift, color: 'text-pink-400' },
  { title: 'Question to Ask', detail: "What's your dream retreat in Kyoto?", tag: 'Deep Connection', icon: Sparkles, color: 'text-amber-300' },
  { title: 'Milestone Reminder', detail: '6-Month Anniversary in 12 Days', tag: 'Upcoming', icon: Calendar, color: 'text-emerald-400' }
];

// Relationship Timeline Steps
const TIMELINE_STEPS = [
  { stage: 'Matched', date: 'May 12', icon: Heart, completed: true },
  { stage: 'First Chat', date: 'May 14', icon: MessageCircle, completed: true },
  { stage: 'First Call', date: 'May 20', icon: Zap, completed: true },
  { stage: 'First Date', date: 'June 2', icon: Star, completed: true },
  { stage: 'Today (Active Sync)', date: 'Present', icon: Sparkles, active: true }
];

// Recent Activity Log
const RECENT_ACTIVITIES = [
  { type: 'voice', title: 'Voice Note Analyzed', detail: 'Elena sent 42s voice note on weekend trip plans.', time: '2h ago', icon: Activity },
  { type: 'chat', title: 'Deep Chat Highlight', detail: 'Discussed favourite modern architecture books.', time: '5h ago', icon: MessageCircle },
  { type: 'memory', title: 'Memory Saved', detail: 'Added Oat Milk Cortado to AI Vault.', time: '1d ago', icon: Bookmark },
  { type: 'date', title: 'Date Confirmed', detail: 'Pottery & Wine Workshop scheduled for Saturday.', time: '2d ago', icon: Calendar }
];

export default function AuraCompanion() {
  const { setActiveTab, addToast } = useAppStore();
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showOrbModal, setShowOrbModal] = useState(false);
  const [orbQuery, setOrbQuery] = useState('');
  const [orbResponse, setOrbResponse] = useState<string | null>(null);
  const [scrollY, setScrollY] = React.useState(0);
  const [selectedMemory, setSelectedMemory] = useState<MemoryNodeData | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrbQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orbQuery.trim()) return;
    setOrbResponse(`Analyzing telemetry for "${orbQuery}"... Recommendation: Schedule a quiet evening chat at 8 PM for peak emotional alignment.`);
  };

  const scrollToSection = (targetYPx: number) => {
    window.scrollTo({ top: targetYPx, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white relative">
      {/* 3D WebGL WebGL Canvas Background */}
      <CompanionCanvas 
        scrollY={scrollY} 
        onSelectMemory={(mem) => {
          setSelectedMemory(mem);
          addToast(`Inspecting Memory: ${mem.title}`, "system");
        }}
        selectedMemory={selectedMemory}
        onCloseMemoryModal={() => setSelectedMemory(null)}
      />

      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-8 relative z-10 overflow-x-hidden">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="accent" size="sm" icon={Bot}>
                AURA.OS • Universal AI Hub
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                🟢 Neural Engine Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              Aura Companion <span className="gradient-text-accent text-2xl font-mono">v4.0</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
              Real-time WebGL 3D camera flight across 6 relationship telemetry sectors.
            </p>

            {/* 3D WebGL Flight Navigation Jump Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              {[
                { name: '1. AI Core', target: 0 },
                { name: '2. Universe', target: 600 },
                { name: '3. Memory Galaxy', target: 1200 },
                { name: '4. Core Radar', target: 1800 },
                { name: '5. Timeline', target: 2400 },
                { name: '6. AI Assistant', target: 3000 }
              ].map((sec, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(sec.target)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-[10px] font-mono text-white/80 hover:text-white transition-all cursor-pointer"
                >
                  {sec.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => addToast("Ran Full AI Diagnostics Sync", "system")}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCw size={14} />
              <span>Sync Telemetry</span>
            </button>
            <GlowButton variant="accent" size="md" icon={Sparkles} onClick={() => setActiveTab('chats')}>
              Open Messenger
            </GlowButton>
          </div>
        </div>

        {/* SECTION 1: HERO (AI Health Score & Partner Avatar Ring) */}
        <GlassCard variant="glow" className="p-6 md:p-8 border-primary/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-12 gap-6 items-center relative z-10">
            {/* Partner Avatar with Glowing Ring */}
            <div className="col-span-12 lg:col-span-5 flex items-center gap-5">
              <div className="relative shrink-0">
                {/* Donut Progress Ring around Avatar */}
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="50" cy="50" r="42" 
                    stroke="url(#gradient-ring)" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="264" 
                    strokeDashoffset="12" 
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="50%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Avatar Image */}
                <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-black/80 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                    alt="Elena Rostova"
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black shadow animate-pulse" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-extrabold text-white">Elena Rostova</h2>
                  <Badge variant="accent" size="sm">98% Match</Badge>
                </div>
                <p className="text-xs text-white/60 font-sans">Architectural Designer • San Francisco</p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 pt-1">
                  <Zap size={12} />
                  <span>AURA.OS Synced • 128 Memories Active</span>
                </div>
              </div>
            </div>

            {/* Health Score Big Ring Counter */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex items-center justify-start lg:justify-center border-y lg:border-y-0 lg:border-x border-white/10 py-4 lg:py-0">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-accent"
                      strokeDasharray="98, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xl font-display font-black text-white">98%</span>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white/50 uppercase tracking-wider">Relationship Vitals</h4>
                  <div className="text-lg font-display font-bold text-white">Peak Harmony</div>
                  <span className="text-[11px] text-emerald-400 font-mono">+3.2% from last week</span>
                </div>
              </div>
            </div>

            {/* AI Status Quick Action */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 space-y-2">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-white/50">
                  <span>AI MODEL SYNC</span>
                  <span className="text-accent font-bold">GEMINI 3.1 PRO</span>
                </div>
                <div className="text-xs text-white font-medium truncate">
                  Cognitive calibration complete. Zero conflict vectors detected.
                </div>
              </div>
              
              <button 
                onClick={() => setShowOrbModal(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg hover:scale-[1.02] transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                <Bot size={14} />
                <span>Ask Aura AI Assistant</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 2: KPI CARDS (6 Grid Metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'Compatibility', value: '96%', sub: '+4% this week', icon: Heart, color: 'text-accent' },
            { label: 'Trust Index', value: '99%', sub: 'Deep Alignment', icon: Shield, color: 'text-emerald-400' },
            { label: 'Communication', value: '94%', sub: 'High Frequency', icon: MessageCircle, color: 'text-primary' },
            { label: 'Happiness', value: '97%', sub: 'Peak Vibe', icon: Smile, color: 'text-amber-400' },
            { label: 'Growth Vector', value: '92%', sub: 'Steady Upward', icon: TrendingUp, color: 'text-cyan-400' },
            { label: 'Activity Score', value: '98%', sub: 'Daily Interaction', icon: Zap, color: 'text-pink-400' }
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <GlassCard key={idx} variant="interactive" className="p-4 space-y-2 border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/50 uppercase font-semibold">{kpi.label}</span>
                  <Icon size={15} className={kpi.color} />
                </div>
                <div className="text-2xl font-display font-extrabold text-white tracking-tight">{kpi.value}</div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight size={10} />
                  <span>{kpi.sub}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* SECTION 3 & SECTION 4: RELATIONSHIP TIMELINE + COMPATIBILITY RADAR */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* SECTION 3: Visual Relationship Timeline */}
          <div className="col-span-12 lg:col-span-7">
            <GlassCard className="p-6 space-y-6 border-white/10 h-full">
              <div className="flex items-center justify-between pb-2 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Calendar className="text-accent" size={18} />
                  <h3 className="text-base font-display font-bold text-white">Relationship Milestone Timeline</h3>
                </div>
                <Badge variant="primary" size="sm">5 Key Milestones</Badge>
              </div>

              {/* Step Nodes Row */}
              <div className="relative pt-4 pb-2">
                {/* Connecting Line */}
                <div className="absolute top-9 inset-x-6 h-0.5 bg-gradient-to-r from-primary via-accent to-emerald-400 z-0" />
                
                <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          step.active 
                            ? 'bg-accent text-white border-white shadow-[0_0_20px_rgba(236,72,153,0.8)] scale-110' 
                            : step.completed 
                            ? 'bg-card-dark text-emerald-400 border-emerald-400' 
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-accent transition-colors">{step.stage}</span>
                        <span className="text-[10px] font-mono text-white/50">{step.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestone Summary Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-bold">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Next Projected Milestone</div>
                    <div className="text-white/60 font-sans">First Weekend Trip to Sonoma • Projected for Month 3</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                  96% Readiness
                </span>
              </div>
            </GlassCard>
          </div>

          {/* SECTION 4: Animated Compatibility Radar Chart */}
          <div className="col-span-12 lg:col-span-5">
            <GlassCard className="p-6 space-y-4 border-white/10 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Brain className="text-primary" size={18} />
                  <h3 className="text-base font-display font-bold text-white">Trait Affinity Radar</h3>
                </div>
                <span className="text-[10px] font-mono text-white/50">6 DIMENSIONS</span>
              </div>

              {/* Recharts Radar */}
              <div className="w-full h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                    <PolarGrid stroke="rgba(255,255,255,0.15)" />
                    <PolarAngleAxis dataKey="trait" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 10, fill: '#E2E8F0' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="none" />
                    <Radar name="Aura Compatibility" dataKey="score" stroke="#EC4899" fill="#EC4899" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-white/60 pt-2 border-t border-white/8">
                <div>HUMOR: <span className="text-accent font-bold">98%</span></div>
                <div>TRUST: <span className="text-emerald-400 font-bold">99%</span></div>
                <div>FUTURE: <span className="text-primary font-bold">95%</span></div>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* SECTION 5 & SECTION 6: MOOD ANALYTICS GRAPH + AI MEMORY GRID */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* SECTION 5: 7-Day Mood Analytics Line Graph */}
          <div className="col-span-12 lg:col-span-6">
            <GlassCard className="p-6 space-y-4 border-white/10">
              <div className="flex items-center justify-between pb-2 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={18} />
                  <h3 className="text-base font-display font-bold text-white">7-Day Emotional Sync Trend</h3>
                </div>
                <Badge variant="accent" size="sm">Mon - Sun</Badge>
              </div>

              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOOD_TREND_DATA}>
                    <defs>
                      <linearGradient id="colorSync" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} />
                    <YAxis domain={[80, 100]} stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A14', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '11px' }} 
                    />
                    <Area type="monotone" dataKey="sync" stroke="#10B981" fillOpacity={1} fill="url(#colorSync)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center text-xs text-white/60 pt-2 border-t border-white/8">
                <span>Weekly Average: <strong className="text-white">96.1% Emotional Alignment</strong></span>
                <span className="text-emerald-400 font-mono font-bold">+5% Peak Weekend</span>
              </div>
            </GlassCard>
          </div>

          {/* SECTION 6: AI Memory Grid */}
          <div className="col-span-12 lg:col-span-6">
            <GlassCard className="p-6 space-y-4 border-white/10">
              <div className="flex items-center justify-between pb-2 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Brain className="text-accent" size={18} />
                  <h3 className="text-base font-display font-bold text-white">AI Memory Vault Grid</h3>
                </div>
                <span className="text-[10px] font-mono text-accent">128 MEMORIES SYNCED</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MEMORY_GRID.map((mem, idx) => {
                  const Icon = mem.icon;
                  return (
                    <div key={idx} className="p-3 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-accent/40 transition-colors space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                        <span>{mem.category}</span>
                        <Icon size={13} className="text-accent" />
                      </div>
                      <div className="text-xs font-bold text-white truncate">{mem.value}</div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-mono text-accent border border-white/10">
                        {mem.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

        </div>

        {/* SECTION 7: CONVERSATION ANALYTICS (Counter Stats Grid) */}
        <GlassCard className="p-6 space-y-4 border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/8">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-primary" size={18} />
              <h3 className="text-base font-display font-bold text-white">Conversation & Telemetry Metrics</h3>
            </div>
            <Badge variant="primary" size="sm">Real-time Sync</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1">
              <div className="text-[10px] font-mono text-white/50 uppercase">Messages Sent</div>
              <div className="text-2xl font-display font-extrabold text-white">1,248</div>
              <div className="text-[10px] text-emerald-400 font-mono">100% Delivery</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1">
              <div className="text-[10px] font-mono text-white/50 uppercase">Avg Reply Time</div>
              <div className="text-2xl font-display font-extrabold text-accent">4.2m</div>
              <div className="text-[10px] text-emerald-400 font-mono">Fast Response</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1">
              <div className="text-[10px] font-mono text-white/50 uppercase">Longest Call/Chat</div>
              <div className="text-2xl font-display font-extrabold text-primary">3h 45m</div>
              <div className="text-[10px] text-purple-300 font-mono">Deep Session</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1">
              <div className="text-[10px] font-mono text-white/50 uppercase">AI Wingman Success</div>
              <div className="text-2xl font-display font-extrabold text-emerald-400">99.4%</div>
              <div className="text-[10px] text-emerald-400 font-mono">Tone Calibrated</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-white/50 uppercase">Active Streak</div>
              <div className="text-2xl font-display font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Flame size={20} className="fill-amber-400 text-amber-400" />
                42 Days
              </div>
              <div className="text-[10px] text-amber-300 font-mono">Unbroken Record</div>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 8 & SECTION 9: AI SUGGESTIONS CAROUSEL + WEEKLY PROGRESS BARS */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* SECTION 8: AI Suggestions Cards Carousel */}
          <div className="col-span-12 lg:col-span-7">
            <GlassCard className="p-6 space-y-4 border-white/10 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-accent animate-pulse" size={18} />
                  <h3 className="text-base font-display font-bold text-white">AI Recommendations Carousel</h3>
                </div>
                <div className="flex items-center gap-1">
                  {AI_SUGGESTIONS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSuggestionIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${activeSuggestionIndex === idx ? 'w-5 bg-accent' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Active Suggestion Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSuggestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-3xl bg-gradient-to-r from-primary/15 via-purple-600/10 to-accent/15 border border-accent/30 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-mono text-[10px] font-bold uppercase tracking-wider border border-accent/30">
                      {AI_SUGGESTIONS[activeSuggestionIndex].tag}
                    </span>
                    <span className="text-xs font-mono text-white/50">
                      Recommendation #{activeSuggestionIndex + 1}
                    </span>
                  </div>

                  <h4 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
                    {AI_SUGGESTIONS[activeSuggestionIndex].title}
                  </h4>

                  <p className="text-sm font-sans text-white/90 leading-relaxed">
                    {AI_SUGGESTIONS[activeSuggestionIndex].detail}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <GlowButton 
                      variant="accent" 
                      size="sm" 
                      onClick={() => addToast(`Applied AI Action: ${AI_SUGGESTIONS[activeSuggestionIndex].title}`, "system")}
                    >
                      Execute Recommendation
                    </GlowButton>

                    <button 
                      onClick={() => setActiveSuggestionIndex((prev) => (prev + 1) % AI_SUGGESTIONS.length)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-2 border-t border-white/8">
                <span>AI Confidence: <strong className="text-emerald-400">99.2%</strong></span>
                <span>Updated 10m ago</span>
              </div>
            </GlassCard>
          </div>

          {/* SECTION 9: Weekly Progress Bars */}
          <div className="col-span-12 lg:col-span-5">
            <GlassCard className="p-6 space-y-4 border-white/10 h-full">
              <div className="flex items-center justify-between pb-2 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Award className="text-amber-400" size={18} />
                  <h3 className="text-base font-display font-bold text-white">Weekly Goal Progress</h3>
                </div>
                <Badge variant="accent" size="sm">97% Target</Badge>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Relationship Health', val: 98, color: 'from-primary to-accent' },
                  { label: 'Trust Index', val: 99, color: 'from-emerald-500 to-teal-400' },
                  { label: 'Consistency Score', val: 95, color: 'from-purple-500 to-pink-500' },
                  { label: 'Engagement Rate', val: 97, color: 'from-amber-400 to-pink-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white/80 font-medium">{item.label}</span>
                      <span className="text-white font-bold">{item.val}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 1, delay: idx * 0.15 }}
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-[11px] text-white/70 font-sans flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>All weekly relationship milestones successfully completed.</span>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* SECTION 10: RECENT ACTIVITY TIMELINE */}
        <GlassCard className="p-6 space-y-4 border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Clock className="text-accent" size={18} />
              <h3 className="text-base font-display font-bold text-white">Recent Activity Telemetry Feed</h3>
            </div>
            <span className="text-[10px] font-mono text-white/50">LIVE EVENT LOG</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECENT_ACTIVITIES.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-accent/30 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                      <Icon size={14} />
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{act.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{act.title}</h4>
                  <p className="text-[11px] text-white/70 font-sans leading-tight line-clamp-2">{act.detail}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>

      </main>

      {/* SECTION 11: FLOATING AI ORB BUTTON (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOrbModal(true)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary via-accent to-pink-500 p-0.5 shadow-[0_0_30px_rgba(236,72,153,0.6)] cursor-pointer flex items-center justify-center"
          title="Open Aura AI Assistant"
        >
          <div className="w-full h-full rounded-full bg-[#0A0A14] flex items-center justify-center">
            <Bot size={24} className="text-accent animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
        </motion.button>
      </div>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showOrbModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-md w-full p-6 rounded-3xl bg-[#0A0A14] border border-accent/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-accent" />
                  <h3 className="text-base font-display font-bold">Aura AI Assistant</h3>
                </div>
                <button 
                  onClick={() => setShowOrbModal(false)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-white/70">
                Ask any question regarding your relationship telemetry, tone suggestions, or date planning.
              </p>

              <form onSubmit={handleOrbQuery} className="space-y-3">
                <input 
                  type="text" 
                  value={orbQuery}
                  onChange={(e) => setOrbQuery(e.target.value)}
                  placeholder="e.g. What is the best date idea for Saturday?"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
                />

                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95"
                >
                  Ask AI Neural Engine
                </button>
              </form>

              {orbResponse && (
                <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/30 text-xs font-sans text-white/90 leading-relaxed">
                  {orbResponse}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
