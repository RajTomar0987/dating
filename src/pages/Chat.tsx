import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Mic, Image, CheckCheck, Compass, MessageCircle, Sparkles, Play, Search, 
  Pin, ShieldCheck, FileText, X, Bot, Phone, Video, Flame, Zap, Volume2, Heart, 
  Smile, Activity, Award, TrendingUp, BarChart2, Filter, Sparkle, ArrowUpRight
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, PieChart, Pie, Cell 
} from 'recharts';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';

// Radar Chart Telemetry
const RADAR_DATA = [
  { trait: 'Trust', score: 99 },
  { trait: 'Communication', score: 94 },
  { trait: 'Humor', score: 98 },
  { trait: 'Lifestyle', score: 92 },
  { trait: 'Emotion', score: 96 },
  { trait: 'Future', score: 95 }
];

// Donut Emotion Distribution
const DONUT_EMOTIONS = [
  { name: 'Joy', val: 35, color: '#F59E0B' },
  { name: 'Empathy', val: 25, color: '#10B981' },
  { name: 'Trust', val: 25, color: '#3B82F6' },
  { name: 'Passion', val: 15, color: '#EC4899' }
];

// Smart Reply Categories
const SMART_REPLIES = [
  { text: "I'd love to try that Sonoma pottery workshop with you!", type: "Romantic", color: "from-pink-500 to-rose-500" },
  { text: "Only if you promise oat milk cortados afterwards ☕", type: "Playful", color: "from-accent to-purple-500" },
  { text: "That architecture book sounds incredible, tell me more!", type: "Deep", color: "from-primary to-indigo-500" },
  { text: "Count me in for Saturday at 6 PM ✨", type: "Supportive", color: "from-emerald-400 to-teal-500" }
];

export default function Chat() {
  const { 
    profiles, 
    likedProfiles, 
    chatThreads, 
    sendMessage, 
    selectedMatchId, 
    setSelectedMatchId,
    typingMatches,
    addToast
  } = useAppStore();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const matched = profiles.filter(p => likedProfiles.includes(p.id));
  const activeMatch = profiles.find(p => p.id === selectedMatchId) || matched[0] || profiles[0];
  const allMessages = activeMatch ? (chatThreads[activeMatch.id] || []) : [];
  
  const activeMessages = searchQuery.trim()
    ? allMessages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : allMessages;

  const isTyping = activeMatch ? !!typingMatches[activeMatch.id] : false;

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [activeMessages.length, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatch) return;
    sendMessage(activeMatch.id, inputText);
    setInputText('');
  };

  const toggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
      addToast("Paused Voice Telemetry", "system");
    } else {
      setPlayingVoiceId(msgId);
      addToast("Playing AI High-Fidelity Audio Telemetry", "system");
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white relative select-none">
      {/* 3D Neural Particles Background */}
      <ParticleBg />

      <Sidebar />

      {/* Main 3-Column AI Conversation Intelligence Center */}
      <main className="flex-1 ml-0 md:ml-64 p-3 md:p-6 pb-24 md:pb-6 grid grid-cols-12 gap-4 h-screen max-h-screen overflow-hidden relative z-10">
        
        {/* LEFT COLUMN: FLOATING CONVERSATION INTELLIGENCE LIST */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-3 h-full overflow-hidden">
          {/* Header & Search */}
          <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-accent" />
                <h2 className="text-sm font-display font-extrabold text-white">AI Conversation Hub</h2>
              </div>
              <Badge variant="accent" size="sm">{matched.length} Synced</Badge>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-3 text-white/40" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search neural logs..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Conversation Cards List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {matched.map((profile) => {
              const isSelected = activeMatch?.id === profile.id;
              const lastMsg = (chatThreads[profile.id] || []).slice(-1)[0];
              const isUserTyping = !!typingMatches[profile.id];

              return (
                <motion.div
                  key={profile.id}
                  whileHover={{ scale: 1.02, x: 2 }}
                  onClick={() => setSelectedMatchId(profile.id)}
                  className={`p-3.5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected 
                      ? 'bg-gradient-to-r from-primary/20 via-purple-600/15 to-accent/20 border-accent/60 shadow-[0_0_25px_rgba(236,72,153,0.3)]' 
                      : 'bg-white/[0.03] border-white/8 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar Ring */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent">
                        <img src={profile.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} alt={profile.name} className="w-full h-full rounded-full object-cover border border-black" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{profile.name}</h4>
                        <span className="text-[10px] font-mono text-accent font-bold">98% Sync</span>
                      </div>

                      <p className="text-[11px] text-white/60 font-sans truncate">
                        {isUserTyping ? (
                          <span className="text-accent font-mono animate-pulse">Neural Engine Typing...</span>
                        ) : (
                          lastMsg?.text || profile.bio
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: AI MESSAGE TIMELINE & INTERACTIVE CHAT */}
        <div className="col-span-12 md:col-span-6 flex flex-col h-full rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden relative">
          
          {/* Top Bar Navigation */}
          {activeMatch && (
            <div className="p-4 border-b border-white/8 bg-black/40 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent shrink-0">
                  <img src={activeMatch.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} alt={activeMatch.name} className="w-full h-full rounded-full object-cover border border-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-display font-extrabold text-white">{activeMatch.name}</h3>
                    <Badge variant="accent" size="sm">98% Match</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <span>🟢 AURA.OS Synced</span>
                    <span>•</span>
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Flame size={11} className="fill-amber-400" /> 42 Day Streak
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => addToast(`Initiated Encrypted Voice Call with ${activeMatch.name}`, "system")}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Phone size={15} />
                </button>
                <button 
                  onClick={() => addToast(`Initiated Holographic Video Call with ${activeMatch.name}`, "system")}
                  className="p-2.5 rounded-xl bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent transition-colors cursor-pointer"
                >
                  <Video size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Messages Viewport */}
          <div ref={viewportRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
            {activeMessages.map((msg) => {
              const isMe = msg.sender === 'user';
              const isVoice = msg.text.includes('Voice Note');

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onMouseEnter={() => setHoveredMessageId(msg.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 relative`}
                >
                  {/* Glowing Message Bubble */}
                  <div className={`p-4 rounded-3xl max-w-sm md:max-w-md space-y-2 border transition-all relative ${
                    isMe 
                      ? 'bg-gradient-to-r from-primary to-accent text-white border-accent/40 shadow-[0_0_20px_rgba(236,72,153,0.3)]' 
                      : 'bg-white/[0.05] border-white/10 text-white backdrop-blur-xl'
                  }`}>
                    
                    {/* Emotion Tag Header */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/60 border-b border-white/10 pb-1.5 mb-1">
                      <span className="flex items-center gap-1 font-bold text-accent">
                        <Sparkles size={10} /> {isMe ? 'Sent • 99% Clarity' : 'Elena • High Resonance'}
                      </span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Voice Waveform Player or Standard Text */}
                    {isVoice ? (
                      <div className="flex items-center gap-3 py-1">
                        <button 
                          onClick={() => toggleVoicePlayback(msg.id)}
                          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer shrink-0"
                        >
                          <Play size={16} className={`text-white ${playingVoiceId === msg.id ? 'animate-pulse' : ''}`} />
                        </button>
                        <div className="flex-1 flex items-center gap-1">
                          {[40, 70, 90, 45, 80, 100, 60, 30, 85, 95, 50, 75].map((h, idx) => (
                            <span 
                              key={idx} 
                              className={`w-1 rounded-full transition-all ${playingVoiceId === msg.id ? 'bg-accent animate-bounce' : 'bg-white/40'}`} 
                              style={{ height: `${h * 0.25}px` }} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-white/60">0:42</span>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm font-sans leading-relaxed text-white font-medium">
                        {msg.text}
                      </p>
                    )}

                    {/* Hover AI Telemetry Analysis Overlay */}
                    {hoveredMessageId === msg.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-10 left-0 right-0 p-2 rounded-xl bg-black/90 border border-accent/40 text-[10px] font-mono text-emerald-400 flex items-center justify-between z-30 shadow-lg"
                      >
                        <span>TONE: DEEP RESONANCE</span>
                        <span>ATTACHMENT: 99% SECURE</span>
                      </motion.div>
                    )}

                  </div>
                </motion.div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-accent animate-pulse w-fit">
                <Bot size={14} />
                <span>Elena is crafting a response...</span>
              </div>
            )}
          </div>

          {/* AI Smart Replies Chips */}
          <div className="p-3 bg-black/30 border-t border-white/8 space-y-2 shrink-0 z-20">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
              <span className="flex items-center gap-1 font-bold text-accent">
                <Bot size={12} /> AURA.OS SMART SUGGESTIONS
              </span>
              <span>Select to Auto-Fill</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {SMART_REPLIES.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(reply.text)}
                  className={`px-3 py-1.5 rounded-2xl bg-gradient-to-r ${reply.color} text-white text-[11px] font-semibold whitespace-nowrap shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5`}
                >
                  <Sparkles size={11} />
                  <span>{reply.type}</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type encrypted message or select AI smart reply..."
                className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/12 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
              />
              <button 
                type="button"
                onClick={() => addToast("Recorded 15s Voice Telemetry Note", "system")}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/12 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <Mic size={16} />
              </button>
              <GlowButton variant="accent" size="sm" type="submit" icon={Send}>
                Send
              </GlowButton>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: AI RELATIONSHIP ENGINE TELEMETRY PANEL */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4 h-full overflow-y-auto pr-1">
          
          {/* Emotion Donut Wheel */}
          <GlassCard className="p-4 space-y-3 border-white/10">
            <div className="flex items-center justify-between pb-1 border-b border-white/8 text-xs font-display font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Smile size={15} className="text-amber-400" /> Emotional Spectrum
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Live Sync</span>
            </div>

            <div className="w-full h-36 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DONUT_EMOTIONS} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="val">
                    {DONUT_EMOTIONS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <div className="text-lg font-display font-black text-white">98%</div>
                <div className="text-[8px] font-mono text-white/50 uppercase">Vibe</div>
              </div>
            </div>
          </GlassCard>

          {/* Conversation Radar */}
          <GlassCard className="p-4 space-y-3 border-white/10">
            <div className="flex items-center justify-between pb-1 border-b border-white/8 text-xs font-display font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Activity size={15} className="text-accent" /> Resonance Radar
              </span>
              <span className="text-[10px] font-mono text-accent">6 Traits</span>
            </div>

            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={RADAR_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.15)" />
                  <PolarAngleAxis dataKey="trait" stroke="rgba(255,255,255,0.6)" tick={{ fontSize: 9 }} />
                  <Radar name="Aura Telemetry" dataKey="score" stroke="#EC4899" fill="#EC4899" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Live AI Analysis Hologram Cards */}
          <GlassCard className="p-4 space-y-3 border-white/10">
            <div className="flex items-center justify-between pb-1 border-b border-white/8 text-xs font-display font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Bot size={15} className="text-primary" /> Neural Telemetry
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              {[
                { label: 'Energy Meter', val: '98%', color: 'text-amber-400' },
                { label: 'Response Quality', val: '99%', color: 'text-emerald-400' },
                { label: 'Humor Score', val: '94%', color: 'text-primary' },
                { label: 'Romance Index', val: '97%', color: 'text-accent' }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/8 flex justify-between items-center">
                  <span className="text-white/70">{item.label}</span>
                  <strong className={item.color}>{item.val}</strong>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </main>

      {/* FLOATING HOLOGRAPHIC AI CORE ORB (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAiDrawer(true)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary via-accent to-pink-500 p-0.5 shadow-[0_0_30px_rgba(236,72,153,0.6)] cursor-pointer flex items-center justify-center"
          title="Open Aura Neural AI Assistant"
        >
          <div className="w-full h-full rounded-full bg-[#0A0A14] flex items-center justify-center">
            <Bot size={24} className="text-accent animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
        </motion.button>
      </div>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAiDrawer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full p-6 rounded-3xl bg-[#0A0A14] border border-accent/30 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-accent" />
                  <h3 className="text-base font-display font-bold">Aura AI Conversation Engine</h3>
                </div>
                <button onClick={() => setShowAiDrawer(false)} className="text-white/40 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-white/70">
                AI Neural Engine is continuously monitoring tone, empathy, and attachment trajectory.
              </p>

              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 text-xs font-mono text-white/90 space-y-1">
                <div>CURRENT VIBE: <strong className="text-accent">High Emotional Alignment</strong></div>
                <div>RECOMMENDATION: <strong className="text-emerald-400">Suggest Sonoma pottery workshop date</strong></div>
              </div>

              <GlowButton variant="accent" size="md" className="w-full" onClick={() => setShowAiDrawer(false)}>
                Close AI Engine
              </GlowButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
