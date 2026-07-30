import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Brain, Clock, ShieldCheck, 
  TrendingUp, Lock, Calendar, MessageSquare, Plus, Search, 
  Check, Target, Heart, Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import Sidebar from '../components/Sidebar';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function RelOSDashboard() {
  const { 
    relosScore, 
    relosScoreTrend, 
    partnerPersona, 
    relosTimeline, 
    relosMemoryVault, 
    relosLifeGoals, 
    toggleLifeGoal, 
    addMemoryVaultItem, 
    setActiveTab 
  } = useAppStore();

  const [memorySearch, setMemorySearch] = useState('');
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newCategory, setNewCategory] = useState('Preferences');
  const [selectedCoachTopic, setSelectedCoachTopic] = useState<'conflict' | 'communication' | 'intimacy'>('communication');

  const filteredMemories = relosMemoryVault.filter(m => 
    m.key.toLowerCase().includes(memorySearch.toLowerCase()) || 
    m.val.toLowerCase().includes(memorySearch.toLowerCase()) ||
    m.category.toLowerCase().includes(memorySearch.toLowerCase())
  );

  const weeklyTrendData = [
    { day: 'Mon', sync: 92, intimacy: 90, qualityTime: 85 },
    { day: 'Tue', sync: 95, intimacy: 92, qualityTime: 88 },
    { day: 'Wed', sync: 94, intimacy: 96, qualityTime: 90 },
    { day: 'Thu', sync: 98, intimacy: 95, qualityTime: 92 },
    { day: 'Fri', sync: 96, intimacy: 98, qualityTime: 95 },
    { day: 'Sat', sync: 99, intimacy: 99, qualityTime: 98 },
    { day: 'Sun', sync: 97, intimacy: 97, qualityTime: 96 }
  ];

  const personaRadar = [
    { subject: 'Intellectual Sync', score: 98 },
    { subject: 'Emotional Security', score: 95 },
    { subject: 'Shared Vision', score: 96 },
    { subject: 'Conflict Resolution', score: 94 },
    { subject: 'Spontaneity', score: 88 }
  ];

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newVal) return;
    addMemoryVaultItem(newKey, newVal, newCategory);
    setNewKey('');
    setNewVal('');
    setShowAddMemoryModal(false);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto space-y-8 relative z-10">
        
        {/* Header & Aura Intelligence Score */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Aura RelOS v3.0 — AI Relationship Operating System
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
              <Activity className="text-accent" size={32} /> Couple OS Command Center
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 font-sans">
              Proactive relationship intelligence, partner memory vault, and shared life planning.
            </p>
          </div>

          {/* Aura Intelligence Score Widget */}
          <GlassCard className="p-4 border-accent/30 bg-gradient-to-br from-primary/15 via-accent/10 to-transparent flex items-center gap-4 shrink-0" hoverEffect={false}>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EC4899" strokeWidth="8" strokeDasharray="250" strokeDashoffset="12" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-sm text-white">
                {relosScore}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-white/50 uppercase font-mono font-bold tracking-wider block">Aura RelOS Index</span>
              <div className="font-display font-extrabold text-base text-white flex items-center gap-1.5">
                <span>96.8 / 100</span>
                <span className="text-emerald-400 text-xs font-mono font-bold">{relosScoreTrend}</span>
              </div>
              <span className="text-[10px] text-accent font-semibold block mt-0.5">Optimal Harmony Synchronized</span>
            </div>
          </GlassCard>
        </div>

        {/* SECTION 1: AI Persona & Couple Dashboard Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* AI Partner Persona Matrix */}
          <GlassCard className="lg:col-span-7 p-6 border-white/10" hoverEffect={false}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Brain size={18} className="text-accent" />
                <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                  AI Partner Persona: {partnerPersona.name}
                </h2>
              </div>
              <Badge variant="accent" size="sm">
                Active Mood: {partnerPersona.activeMood}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-1">
                <span className="text-[10px] text-white/50 uppercase font-mono font-bold block">Personality Archetype</span>
                <div className="font-display font-bold text-sm text-white">{partnerPersona.mbti}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-1">
                <span className="text-[10px] text-white/50 uppercase font-mono font-bold block">Love Language</span>
                <div className="font-display font-bold text-sm text-accent">{partnerPersona.loveLanguage}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-1">
                <span className="text-[10px] text-white/50 uppercase font-mono font-bold block">Attachment System</span>
                <div className="font-display font-bold text-sm text-white">{partnerPersona.attachmentStyle}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-1">
                <span className="text-[10px] text-white/50 uppercase font-mono font-bold block">De-escalation Key</span>
                <div className="font-display font-bold text-xs text-purple-300">{partnerPersona.deEscalationKey}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-white/80 leading-relaxed font-sans">
              <strong className="text-amber-300 block mb-1 font-mono uppercase text-[10px]">Primary Stress Trigger Warning:</strong>
              {partnerPersona.primaryTrigger}. Give 30 minutes of unstructured processing time before introducing complex logistics.
            </div>
          </GlassCard>

          {/* Couple Dashboard Quick Status */}
          <GlassCard className="lg:col-span-5 p-6 border-white/10 flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <Heart size={18} className="text-accent fill-accent/20" />
                <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                  Couple Sync Status
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/8">
                  <span className="text-xs text-white/70">Connection Streak</span>
                  <span className="font-display font-bold text-white text-sm">184 Days</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/8">
                  <span className="text-xs text-white/70">Upcoming Anniversary</span>
                  <span className="font-display font-bold text-accent text-xs">Nov 02 (98 Days)</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/8">
                  <span className="text-xs text-white/70">Next Co-Planned Date</span>
                  <span className="font-display font-bold text-white text-xs">This Saturday, 06:30 PM</span>
                </div>
              </div>
            </div>

            <GlowButton 
              className="w-full text-xs" 
              icon={Calendar}
              onClick={() => setActiveTab('planner')}
            >
              Launch Date Planner Engine
            </GlowButton>
          </GlassCard>
        </div>

        {/* SECTION 2: Weekly Insights Engine */}
        <GlassCard className="p-6 border-white/10" hoverEffect={false}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={18} className="text-accent" />
              <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                Weekly Relationship Insights & Telemetry
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent" /> Communication Sync</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Intimacy Index</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrendData}>
                <defs>
                  <linearGradient id="syncGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="intimacyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0A0A14', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="sync" stroke="#EC4899" fillOpacity={1} fill="url(#syncGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="intimacy" stroke="#A855F7" fillOpacity={1} fill="url(#intimacyGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* SECTION 3 & 4: AI Memory Vault & AI Relationship Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* AI Memory Vault */}
          <GlassCard className="lg:col-span-7 p-6 border-white/10" hoverEffect={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Lock size={18} className="text-accent" />
                <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                  AI Memory Vault
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Search memories..." 
                    value={memorySearch}
                    onChange={(e) => setMemorySearch(e.target.value)}
                    className="glass-input w-full pl-8 py-1.5 text-xs"
                  />
                </div>
                <button
                  onClick={() => setShowAddMemoryModal(true)}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform shrink-0"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredMemories.map((mem) => (
                <div key={mem.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] text-accent font-mono font-bold uppercase px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                        {mem.category}
                      </span>
                      <span className="font-bold text-xs text-white">{mem.key}</span>
                    </div>
                    <p className="text-xs text-white/70 font-sans">{mem.val}</p>
                  </div>
                  <span className="text-[9px] text-white/40 font-mono shrink-0">{mem.updated}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Relationship Timeline */}
          <GlassCard className="lg:col-span-5 p-6 border-white/10" hoverEffect={false}>
            <div className="flex items-center gap-2.5 mb-6">
              <Clock size={18} className="text-accent" />
              <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                AI Milestone Timeline
              </h2>
            </div>

            <div className="space-y-4 relative pl-4 border-l border-white/15">
              {relosTimeline.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                  <span className="text-[9px] text-accent font-mono font-bold block mb-0.5">{item.date}</span>
                  <h4 className="font-display font-bold text-xs text-white">{item.title}</h4>
                  <p className="text-[11px] text-white/60 font-sans mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* SECTION 5 & 6: AI Relationship Coach & AI Life Planner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* AI Relationship Coach */}
          <GlassCard className="lg:col-span-6 p-6 border-white/10 flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-accent" />
                  <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                    AI Relationship Coach
                  </h2>
                </div>
                <Badge variant="accent" size="sm">
                  Active Advisor
                </Badge>
              </div>

              <div className="flex gap-2 mb-4">
                {[
                  { id: 'communication', label: 'Communication' },
                  { id: 'conflict', label: 'De-escalation' },
                  { id: 'intimacy', label: 'Deep Alignment' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedCoachTopic(t.id as any)}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer
                      ${selectedCoachTopic === t.id 
                        ? 'bg-gradient-to-r from-primary to-accent border-accent text-white' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}
                    `}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
                <h4 className="font-display font-bold text-xs text-white">
                  {selectedCoachTopic === 'communication' && 'Proactive Clarity Protocol'}
                  {selectedCoachTopic === 'conflict' && 'INTJ Logical Reset Procedure'}
                  {selectedCoachTopic === 'intimacy' && 'Quality Time Resonance'}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  {selectedCoachTopic === 'communication' && "Elena values structured schedules. When changes arise, state the logistical update directly before discussing emotions."}
                  {selectedCoachTopic === 'conflict' && "If tension rises, avoid continuous emotional probing. Provide a clear 30-minute cooling window, then revisit with objective facts."}
                  {selectedCoachTopic === 'intimacy' && "Plan 1-on-1 dates centered around joint intellectual discovery—like exploring a design gallery or listening to an album together."}
                </p>
              </div>
            </div>

            <GlowButton 
              className="mt-6 text-xs w-full"
              variant="secondary"
              icon={MessageSquare}
              onClick={() => setActiveTab('wingman')}
            >
              Consult AI Wingman & Relationship Advisor
            </GlowButton>
          </GlassCard>

          {/* AI Life Planner */}
          <GlassCard className="lg:col-span-6 p-6 border-white/10" hoverEffect={false}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Target size={18} className="text-accent" />
                <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                  AI Life Planner & Co-Created Goals
                </h2>
              </div>
              <Badge variant="primary" size="sm">
                4 Active Goals
              </Badge>
            </div>

            <div className="space-y-4">
              {relosLifeGoals.map((goal: { id: string; title: string; category: string; progress: number; targetDate: string; completed: boolean }) => (
                <div key={goal.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => toggleLifeGoal(goal.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                          goal.completed ? 'bg-accent border-accent text-white' : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        {goal.completed && <Check size={12} />}
                      </button>
                      <span className={`text-xs font-bold font-display ${goal.completed ? 'line-through text-white/40' : 'text-white'}`}>
                        {goal.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-accent font-mono font-bold">{goal.targetDate}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/50 font-mono">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Modal: Add Memory Vault Item */}
        <AnimatePresence>
          {showAddMemoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md p-6 rounded-3xl bg-[#0A0A14] border border-white/15 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                  <h3 className="font-display font-extrabold text-base text-white">Add Memory Vault Item</h3>
                  <button onClick={() => setShowAddMemoryModal(false)} className="text-white/40 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAddMemory} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase font-bold block mb-1">Category</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="glass-input w-full text-xs"
                    >
                      <option value="Preferences" className="bg-black text-white">Preferences</option>
                      <option value="Keepsakes" className="bg-black text-white">Keepsakes</option>
                      <option value="Dietary" className="bg-black text-white">Dietary</option>
                      <option value="Milestones" className="bg-black text-white">Milestones</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase font-bold block mb-1">Memory Key</label>
                    <input 
                      type="text"
                      placeholder="e.g. Favorite Flower, Ring Size..."
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      className="glass-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase font-bold block mb-1">Details / Note</label>
                    <input 
                      type="text"
                      placeholder="e.g. White Peonies, light pink roses..."
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                      className="glass-input w-full text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddMemoryModal(false)}
                      className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                    <GlowButton type="submit" size="sm">
                      Save to Vault
                    </GlowButton>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
