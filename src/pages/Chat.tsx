import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Mic, Image, CheckCheck, Compass, MessageCircle, Sparkles, Play, Search, 
  Pin, ShieldCheck, FileText, X, Bot, Phone, Video, Flame, Zap, Volume2, Heart, 
  Smile, Activity, Award, TrendingUp, BarChart2, Filter, Sparkle, ArrowUpRight,
  Users, UserCheck, Cpu, RefreshCw, ArrowLeft
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';
import { ApiClient } from '../api/client';
import { useAuth } from '../auth/useAuth';
import { getValidImageUrl } from '../lib/imageUtils';

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
  const navigate = useNavigate();
  const { addToast } = useAppStore();
  const { firebaseUser } = useAuth();

  // Chat category selection: 'real' (Real User-to-User) vs 'ai' (AI Companion)
  const [chatType, setChatType] = useState<'real' | 'ai'>('real');
  const [selectedId, setSelectedId] = useState<string>('');

  // Mobile layout tab switcher ('list' vs 'chat') for 400px responsiveness
  const [mobileTab, setMobileTab] = useState<'list' | 'chat'>('list');

  // Data collections
  const [realMatches, setRealMatches] = useState<any[]>([]);
  const [aiCompanions, setAiCompanions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // UI & Loading states
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting'>('connected');

  const viewportRef = useRef<HTMLDivElement>(null);

  // 1. Fetch initial Real Matches & AI Companions
  const loadMatchesAndCompanions = async () => {
    setIsLoadingMatches(true);
    try {
      // Fetch AI companions first
      const resCompanions = await ApiClient.getAiCompanions();
      const companionsList = resCompanions?.companions || [
        {
          id: 'aura_ai',
          name: 'Aura AI',
          role: 'AI Companion',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
          bio: 'Aura Neural Relational Intelligence Companion',
          matchScore: 99
        },
        {
          id: 'elena_ai',
          name: 'Elena AI',
          role: 'AI Companion',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          bio: 'INTJ Architect AI Companion',
          matchScore: 98
        }
      ];
      setAiCompanions(companionsList);

      // Fetch Real User Matches
      const resMatches = await ApiClient.getMatches();
      const matchesList = resMatches?.matches || [];
      setRealMatches(matchesList);

      // Auto-select chat mode
      if (matchesList.length > 0) {
        setChatType('real');
        setSelectedId(matchesList[0].matchId);
      } else if (companionsList.length > 0) {
        setChatType('ai');
        setSelectedId(companionsList[0].id);
      }
    } catch (err) {
      console.warn('[Chat] Initial load notice:', err);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  useEffect(() => {
    loadMatchesAndCompanions();
  }, []);

  // 2. Load conversation messages & subscribe to Realtime for Real User Chat
  useEffect(() => {
    let isMounted = true;
    if (!selectedId) return;

    if (chatType === 'real') {
      // Fetch real database messages
      ApiClient.getMessages(selectedId).then(res => {
        if (res?.messages && isMounted) {
          setMessages(res.messages);
        }
      });

      // Subscribe to Supabase Realtime for instant user-to-user updates
      const unsubscribe = ApiClient.subscribeToRealtimeChat(
        selectedId, 
        (newMsg: any) => {
          if (!isMounted) return;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            const formatted = {
              id: newMsg.id,
              matchId: newMsg.match_id || selectedId,
              senderId: newMsg.sender_id,
              sender: newMsg.sender_id === firebaseUser?.uid ? 'user' : 'match',
              text: newMsg.content || newMsg.text,
              timestamp: new Date(newMsg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: newMsg.message_type || 'text',
              duration: newMsg.duration,
              imageUrl: newMsg.image_url,
              isRead: newMsg.is_read || false
            };
            return [...prev, formatted];
          });
        },
        (status) => {
          if (isMounted) setConnectionStatus(status);
        }
      );

      return () => {
        unsubscribe();
      };
    } else {
      // Fetch AI Companion messages
      ApiClient.getAiMessages(selectedId).then(res => {
        if (res?.messages && isMounted) {
          setMessages(res.messages);
        }
      });
    }
  }, [selectedId, chatType, firebaseUser?.uid]);

  // Auto-scroll viewport to bottom
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages.length, isAiTyping]);

  // Handle sending message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedId) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (chatType === 'real') {
      // REAL USER CHAT:
      const tempId = `temp_${Date.now()}`;
      const tempMsg = {
        id: tempId,
        matchId: selectedId,
        senderId: firebaseUser?.uid || '',
        sender: 'user' as const,
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };

      setMessages(prev => [...prev, tempMsg]);

      const res = await ApiClient.sendMessage(selectedId, textToSend);
      if (res?.newMessage) {
        setMessages(prev => prev.map(m => m.id === tempId ? res.newMessage : m));
      }
    } else {
      // AI COMPANION CHAT:
      const tempUserMsg = {
        id: `user_${Date.now()}`,
        companionId: selectedId,
        sender: 'user' as const,
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages(prev => [...prev, tempUserMsg]);
      setIsAiTyping(true);

      const res = await ApiClient.sendAiMessage(selectedId, textToSend);
      setIsAiTyping(false);

      if (res?.aiMessage) {
        setMessages(prev => [...prev, res.aiMessage]);
      }
    }
  };

  const toggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
      addToast("Paused Voice Telemetry", "system");
    } else {
      setPlayingVoiceId(msgId);
      addToast("Playing High-Fidelity Audio Telemetry", "system");
    }
  };

  // Currently active real match or AI companion object
  const activeRealMatch = realMatches.find(m => m.matchId === selectedId);
  const activeAiCompanion = aiCompanions.find(c => c.id === selectedId);

  const activeName = chatType === 'real' ? activeRealMatch?.partner?.name || 'Matched User' : activeAiCompanion?.name || 'AI Companion';
  const rawActivePhoto = chatType === 'real' ? activeRealMatch?.partner?.photos?.[0] : activeAiCompanion?.avatar;
  const activePhoto = getValidImageUrl(rawActivePhoto);

  const activeStatus = chatType === 'real' 
    ? (activeRealMatch?.partner?.is_online ? '🟢 Online' : '⚪ Offline')
    : '✨ AI Active';

  const activeMessages = searchQuery.trim()
    ? messages.filter(m => m.text?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex min-h-[100dvh] w-full max-w-full bg-bg-luxury font-sans text-white relative select-none">
      {/* 3D Neural Particles Background */}
      <ParticleBg />

      <Sidebar />

      {/* Main 3-Column Conversation Center */}
      <main className="flex-1 ml-0 md:ml-64 w-full min-w-0 p-3 md:p-6 pb-20 md:pb-6 grid grid-cols-12 gap-4 h-[calc(100dvh-4rem)] md:h-screen md:max-h-screen overflow-hidden relative z-10">
        
        {/* Mobile Tab Toggle Header (< 768px) */}
        <div className="col-span-12 md:hidden flex items-center bg-white/[0.04] p-1 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'list' ? 'bg-accent/20 text-accent border border-accent/40 shadow-sm' : 'text-white/60'
            }`}
          >
            Conversations ({realMatches.length})
          </button>
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'chat' ? 'bg-accent/20 text-accent border border-accent/40 shadow-sm' : 'text-white/60'
            }`}
          >
            {activeName}
          </button>
        </div>

        {/* LEFT COLUMN: CONVERSATION LIST (REAL MATCHES & AI COMPANIONS) */}
        <div className={`col-span-12 md:col-span-3 flex flex-col gap-3 h-full overflow-hidden ${mobileTab === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          {/* Header & Search */}
          <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-accent" />
                <h2 className="text-sm font-display font-extrabold text-white">Conversation Hub</h2>
              </div>
              <button onClick={loadMatchesAndCompanions} className="text-white/40 hover:text-white transition-colors cursor-pointer p-1">
                <RefreshCw size={14} className={isLoadingMatches ? 'animate-spin text-accent' : ''} />
              </button>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-3 text-white/40" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages & contacts..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            
            {/* SECTION 1: REAL MATCHES */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-[11px] font-mono font-bold uppercase tracking-wider text-pink-400">
                <span className="flex items-center gap-1.5">
                  <Users size={13} /> Real Matches
                </span>
                <Badge variant="accent" size="sm">{realMatches.length}</Badge>
              </div>

              {realMatches.length === 0 ? (
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-white/50 text-center space-y-1.5">
                  <p className="font-semibold text-white/70">No matches yet</p>
                  <p className="text-[10px] text-pink-400">Like profiles on Discover to start matching!</p>
                </div>
              ) : (
                realMatches.map((m) => {
                  const isSelected = chatType === 'real' && selectedId === m.matchId;
                  const partner = m.partner;
                  const partnerPhoto = getValidImageUrl(partner?.photos?.[0]);

                  return (
                    <motion.div
                      key={m.matchId}
                      whileHover={{ scale: 1.02, x: 2 }}
                      onClick={() => {
                        setChatType('real');
                        setSelectedId(m.matchId);
                        setMobileTab('chat');
                      }}
                      className={`p-3 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected 
                          ? 'bg-gradient-to-r from-primary/20 via-purple-600/15 to-accent/20 border-accent/60 shadow-[0_0_25px_rgba(236,72,153,0.3)]' 
                          : 'bg-white/[0.03] border-white/8 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-rose-500">
                            <img src={partnerPhoto} alt={partner.name} className="w-full h-full rounded-full object-cover border border-black" />
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${partner.is_online ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white truncate">{partner.name}</h4>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">Matched</span>
                          </div>

                          <p className="text-[11px] text-white/60 font-sans truncate">
                            {m.lastMessage?.text || partner.bio}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* SECTION 2: AURA AI COMPANION (SEPARATE FROM REAL MATCHES) */}
            <div className="space-y-2 pt-2 border-t border-white/8">
              <div className="flex items-center justify-between px-1 text-[11px] font-mono font-bold uppercase tracking-wider text-accent">
                <span className="flex items-center gap-1.5">
                  <Bot size={13} /> Aura AI Companion
                </span>
                <span className="text-[10px] text-accent/80 font-normal">AI Assistant</span>
              </div>

              {aiCompanions.map((comp) => {
                const isSelected = chatType === 'ai' && selectedId === comp.id;
                const compAvatar = getValidImageUrl(comp.avatar);

                return (
                  <motion.div
                    key={comp.id}
                    whileHover={{ scale: 1.02, x: 2 }}
                    onClick={() => {
                      setChatType('ai');
                      setSelectedId(comp.id);
                      setMobileTab('chat');
                    }}
                    className={`p-3 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-r from-accent/20 via-purple-600/20 to-primary/20 border-accent/70 shadow-[0_0_25px_rgba(168,85,247,0.3)]' 
                        : 'bg-white/[0.03] border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-accent via-purple-500 to-indigo-500">
                          <img src={compAvatar} alt={comp.name} className="w-full h-full rounded-full object-cover border border-black" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-accent border-2 border-black flex items-center justify-center">
                          <Sparkles size={7} className="text-white" />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate">{comp.name}</h4>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-accent/20 text-accent font-bold flex items-center gap-1">
                            <Bot size={9} /> AI Companion
                          </span>
                        </div>

                        <p className="text-[11px] text-white/60 font-sans truncate">
                          {comp.bio}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>

        {/* CENTER COLUMN: MESSAGE TIMELINE & INTERACTIVE CHAT */}
        <div className={`col-span-12 md:col-span-9 lg:col-span-6 flex flex-col h-full rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden relative ${mobileTab === 'list' ? 'hidden md:flex' : 'flex'}`}>
          
          {chatType === 'real' && realMatches.length === 0 ? (
            /* Clean Empty State when user has 0 real matches */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50 space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <Users size={32} className="text-pink-400" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-base font-display font-bold text-white">No matches yet</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Start discovering people to begin chatting. When you match with someone, your conversation will appear here!
                </p>
              </div>
              <button 
                onClick={() => navigate('/discover')} 
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-accent text-white text-xs font-semibold shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:opacity-90 transition-all cursor-pointer"
              >
                Discover People
              </button>
            </div>
          ) : (
            <>
              {/* Top Header */}
              <div className="p-4 border-b border-white/8 bg-black/40 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button (< md) */}
                  <button
                    type="button"
                    onClick={() => setMobileTab('list')}
                    className="md:hidden p-2 rounded-xl bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Back to Conversations"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent shrink-0 relative">
                    <img src={activePhoto} alt={activeName} className="w-full h-full rounded-full object-cover border border-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-display font-extrabold text-white">{activeName}</h3>
                      {chatType === 'real' ? (
                        <Badge variant="accent" size="sm">Real Match</Badge>
                      ) : (
                        <Badge variant="accent" size="sm" className="bg-accent/20 text-accent border-accent/40 flex items-center gap-1">
                          <Bot size={10} /> AI Companion
                        </Badge>
                      )}
                      {chatType === 'real' && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                          connectionStatus === 'connected'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                        }`}>
                          {connectionStatus === 'connected' ? '● Connected' : '◐ Reconnecting...'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                      <span>{activeStatus}</span>
                      <span>•</span>
                      <span className="text-amber-400 flex items-center gap-0.5">
                        <Flame size={11} className="fill-amber-400" /> High Affinity
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => addToast(`Initiated Encrypted Call with ${activeName}`, "system")}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <Phone size={15} />
                  </button>
                  <button 
                    onClick={() => addToast(`Initiated Video Call with ${activeName}`, "system")}
                    className="p-2.5 rounded-xl bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent transition-colors cursor-pointer"
                  >
                    <Video size={15} />
                  </button>
                </div>
              </div>

              {/* Messages Viewport */}
              <div ref={viewportRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
                {activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40 space-y-2">
                    <MessageCircle size={32} className="text-accent/60" />
                    <p className="text-xs font-medium">No messages yet.</p>
                    <p className="text-[11px]">Say hello to start the conversation!</p>
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isMe = msg.sender === 'user';
                    const isVoice = msg.text?.includes('Voice Note');

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onMouseEnter={() => setHoveredMessageId(msg.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 relative`}
                      >
                        {/* Message Bubble */}
                        <div className={`p-4 rounded-3xl max-w-sm md:max-w-md space-y-2 border transition-all relative ${
                          isMe 
                            ? 'bg-gradient-to-r from-primary to-accent text-white border-accent/40 shadow-[0_0_20px_rgba(236,72,153,0.3)]' 
                            : 'bg-white/[0.05] border-white/10 text-white backdrop-blur-xl'
                        }`}>
                          
                          {/* Header info */}
                          <div className="flex items-center justify-between text-[10px] font-mono text-white/60 border-b border-white/10 pb-1.5 mb-1">
                            <span className="flex items-center gap-1 font-bold text-accent">
                              <Sparkles size={10} /> {isMe ? 'Sent' : activeName}
                            </span>
                            <span>{msg.timestamp || 'Just now'}</span>
                          </div>

                          {/* Voice or Text Content */}
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

                          {/* Hover Telemetry Analysis Overlay */}
                          {hoveredMessageId === msg.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute -top-10 left-0 right-0 p-2 rounded-xl bg-black/90 border border-accent/40 text-[10px] font-mono text-emerald-400 flex items-center justify-between z-30 shadow-lg"
                            >
                              <span>TONE: HIGH ALIGNMENT</span>
                              <span>SYNCHRONY: 99%</span>
                            </motion.div>
                          )}

                        </div>
                      </motion.div>
                    );
                  })
                )}

                {/* AI Companion Typing Indicator */}
                {isAiTyping && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-accent animate-pulse w-fit">
                    <Bot size={14} />
                    <span>{activeName} is crafting an AI response...</span>
                  </div>
                )}
              </div>

              {/* Input & Smart Suggestions */}
              <div className="p-3 bg-black/30 border-t border-white/8 space-y-2 shrink-0 z-20">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                  <span className="flex items-center gap-1 font-bold text-accent">
                    <Bot size={12} /> SMART SUGGESTIONS
                  </span>
                  <span>Click to auto-fill input</span>
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
                    placeholder={chatType === 'real' ? `Message ${activeName}...` : `Chat with ${activeName}...`}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/12 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent"
                  />
                  <button 
                    type="button"
                    onClick={() => addToast("Recorded 15s Voice Note", "system")}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/12 text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <Mic size={16} />
                  </button>
                  <GlowButton variant="accent" size="sm" type="submit" icon={Send}>
                    Send
                  </GlowButton>
                </form>
              </div>
            </>
          )}

        </div>

        {/* RIGHT COLUMN: AI RELATIONSHIP TELEMETRY PANEL */}
        <div className="col-span-12 lg:col-span-3 hidden lg:flex flex-col gap-4 h-full overflow-y-auto pr-1">
          
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

          {/* Telemetry Metrics */}
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
