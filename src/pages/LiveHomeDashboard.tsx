import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Sparkles, MapPin, Calendar, Coffee, Film, 
  Compass, Music, Camera, Utensils, ChevronLeft, ChevronRight, Play, 
  Pause, Clock, Sun, Flame, Zap, User, Share2, CheckCircle2, Send, 
  Volume2, Smile, Star, X, ShieldCheck, Eye, BookOpen, Users,
  ArrowUpRight, Bookmark, Filter, Search, Globe, ChevronDown, Check, ThumbsDown
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../auth/useAuth';
import {
  LIVE_ACTIVITY_TICKER,
  LARGE_TINDER_MATCHES,
  STORIES_DATA,
  SOCIAL_STREAM,
  FEATURED_COUPLES,
  TRENDING_THIS_WEEK,
  CONVERSATION_BUBBLES,
  COMPACT_AI_RECOMMENDATIONS,
  TRENDING_EVENTS
} from '../data/homeData';
import type {
  StoryItem,
  LargeTinderMatch,
  FeaturedCouple
} from '../data/homeData';

// ----------------------------------------------------
// 3D TILT CONTAINER
// ----------------------------------------------------
interface TiltProps {
  children: React.ReactNode;
  className?: string;
}

const Tilt: React.FC<TiltProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const rX = ((mouseY - height / 2) / (height / 2)) * -8;
    const rY = ((mouseX - width / 2) / (width / 2)) * 8;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY, transformPerspective: 1000 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ----------------------------------------------------
// MAIN HOME DASHBOARD COMPONENT
// ----------------------------------------------------
export default function LiveHomeDashboard() {
  const { setActiveTab, addToast, setSelectedMatchId } = useAppStore();

  // Active Ticker Index
  const [tickerIndex, setTickerIndex] = useState(0);

  // Active Story & Match Modal
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [storiesList, setStoriesList] = useState<StoryItem[]>(STORIES_DATA);
  const [likedMatches, setLikedMatches] = useState<Record<string, boolean>>({});
  const [passedMatches, setPassedMatches] = useState<Record<string, boolean>>({});
  const [joinedEvents, setJoinedEvents] = useState<Record<string, boolean>>({});

  // Floating Notification Popup Toggle
  const [showFloatingMatch, setShowFloatingMatch] = useState(true);

  // Carousel Ref
  const eventCarouselRef = useRef<HTMLDivElement>(null);

  const { profile, firebaseUser } = useAuth();

  // Time-based Greeting
  const getGreeting = () => {
    const name = profile?.display_name || profile?.first_name || firebaseUser?.displayName || 'User';
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${name} 👋`;
    if (hour < 18) return `Good Afternoon, ${name} 👋`;
    return `Good Evening, ${name} 👋`;
  };

  // Auto-cycle Live Activity Ticker every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_ACTIVITY_TICKER.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Action Handlers
  const handleLike = (id: string, name: string) => {
    setLikedMatches(prev => ({ ...prev, [id]: true }));
    addToast(`Sent a crush heart to ${name}! ✨`, 'match');
  };

  const handlePass = (id: string, name: string) => {
    setPassedMatches(prev => ({ ...prev, [id]: true }));
    addToast(`Passed on ${name}'s card for today`, 'system');
  };

  const handleJoinEvent = (id: string, title: string) => {
    const isJoined = !joinedEvents[id];
    setJoinedEvents(prev => ({ ...prev, [id]: isJoined }));
    if (isJoined) addToast(`🎉 Joined guest list for: ${title}!`, 'match');
  };

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!eventCarouselRef.current) return;
    const amount = dir === 'left' ? -350 : 350;
    eventCarouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const currentTicker = LIVE_ACTIVITY_TICKER[tickerIndex];

  return (
    <div className="flex min-h-[100dvh] w-full max-w-full bg-[#04040A] text-white font-sans relative overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* Background Ambient Particles & Soft Glows */}
      <ParticleBg />
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-10%] w-[550px] h-[550px] bg-pink-900/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Container Viewport */}
      <main className="flex-1 ml-0 md:ml-64 w-full max-w-7xl mx-auto min-w-0 p-3.5 sm:p-4 md:p-8 pb-28 md:pb-24 space-y-8 md:space-y-12 relative z-10 overflow-x-hidden">
        
        {/* ====================================================
            SECTION 1: HERO + ANIMATED REAL-TIME ACTIVITY TICKER
            ==================================================== */}
        <section className="relative rounded-3xl p-6 md:p-10 border border-white/12 bg-gradient-to-br from-white/[0.06] via-purple-950/20 to-black/80 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                AURA LIVE NETWORK • ACTIVE NOW
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">
                {getGreeting()}
              </h1>
              <p className="text-xs md:text-sm text-white/60 mt-1 font-light">
                Discover real-time connections, live moments, and meaningful relationships powered by AI.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-right backdrop-blur-md">
                <span className="text-xs font-mono text-pink-400 font-bold block">🔥 60+ Profiles Live</span>
                <span className="text-[10px] text-white/50">San Francisco & Bay Area</span>
              </div>
            </div>
          </div>

          {/* ANIMATED REAL-TIME ACTIVITY TICKER BAR */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl flex items-center justify-between shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTicker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg">{currentTicker.icon}</span>
                <span className="text-xs md:text-sm text-white font-medium">
                  {currentTicker.text}
                </span>
                <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                  {currentTicker.timeAgo}
                </span>
              </motion.div>
            </AnimatePresence>

            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold hidden sm:inline">
              ● REALTIME TELEMETRY STREAM
            </span>
          </div>
        </section>

        {/* ====================================================
            SECTION 2: INSTAGRAM-QUALITY LIVE STORIES
            ==================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-pink-400" />
              <h2 className="text-xl font-display font-bold text-white">Live Stories</h2>
            </div>
            <span className="text-xs font-mono text-white/40">Tap to Watch Highlights</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none snap-x">
            {storiesList.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.06, y: -4 }}
                onClick={() => {
                  setActiveStory(story);
                  setStoriesList(prev => prev.map(s => s.id === story.id ? { ...s, hasUnviewed: false } : s));
                }}
                className="flex flex-col items-center gap-2 cursor-pointer shrink-0 snap-start group relative"
              >
                {/* Rotating Gradient Ring */}
                <div className={`p-[3px] rounded-full transition-all duration-300 ${
                  story.hasUnviewed 
                    ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_18px_rgba(236,72,153,0.5)] animate-pulse' 
                    : 'bg-white/15'
                }`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 bg-black relative">
                    <img src={story.avatar} alt={story.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
                    {story.isOnline && (
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full shadow-md" />
                    )}
                  </div>
                </div>

                {story.isAiRecommended && (
                  <span className="absolute -top-1 px-1.5 py-0.5 bg-purple-600 text-[8px] font-bold font-mono text-white rounded-full shadow-md border border-purple-300">
                    AI PICK
                  </span>
                )}

                <div className="text-center">
                  <p className="text-xs font-semibold text-white/90 truncate max-w-[80px]">
                    {story.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-white/40 font-mono">{story.timeAgo}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 3: AI MATCHES (LARGE TINDER-STYLE CARDS)
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                <h2 className="text-2xl font-display font-bold text-white">AI Affinity Matches</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">High-synergy profiles calibrated by your AI Digital Twin</p>
            </div>
            <button 
              onClick={() => setActiveTab('deck')}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Open Discover Deck →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LARGE_TINDER_MATCHES.filter(m => !passedMatches[m.id]).map((match) => (
              <Tilt key={match.id} className="h-full">
                <div className="h-full rounded-3xl bg-gradient-to-b from-white/[0.08] to-black/90 border border-white/12 overflow-hidden backdrop-blur-2xl p-5 flex flex-col justify-between shadow-2xl hover:border-pink-500/40 transition-all duration-300 group">
                  
                  <div>
                    {/* Large Portrait Media */}
                    <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                      <img 
                        src={match.portrait} 
                        alt={match.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                      {/* Top Synergy Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {match.matchScore}% SYNERGY
                        </span>
                        {match.online && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium backdrop-blur-md border border-emerald-500/30">
                            Online Now
                          </span>
                        )}
                      </div>

                      {/* Bottom Portrait Info Overlay */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold font-display text-white">{match.name}, {match.age}</h3>
                          {match.verified && <ShieldCheck size={20} className="text-cyan-400" />}
                        </div>
                        <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                          <MapPin size={13} className="text-pink-400" />
                          {match.occupation} • {match.distance}
                        </p>
                      </div>
                    </div>

                    {/* AI Synergy Reason */}
                    <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 mb-4 flex items-start gap-2.5">
                      <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-300 block mb-0.5">AI MATCH INSIGHT</span>
                        {match.aiReason}
                      </div>
                    </div>

                    {/* Two Shared Interest Chips */}
                    <div className="flex gap-2 mb-4">
                      {match.interests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/80">
                          #{interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Like / Pass / Message Actions */}
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <button 
                      onClick={() => handlePass(match.id, match.name)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="Pass"
                    >
                      <ThumbsDown size={18} />
                    </button>

                    <button 
                      onClick={() => handleLike(match.id, match.name)}
                      className={`flex-1 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                        likedMatches[match.id]
                          ? 'bg-pink-600 text-white'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                      }`}
                    >
                      <Heart size={16} fill={likedMatches[match.id] ? "currentColor" : "none"} />
                      {likedMatches[match.id] ? 'Liked!' : 'Like Profile'}
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedMatchId(match.id);
                        setActiveTab('chats');
                      }}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
                      title="Message"
                    >
                      <MessageCircle size={18} />
                    </button>
                  </div>

                </div>
              </Tilt>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 4: SCROLLING LIVE SOCIAL STREAM FEED
            ==================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-white/60 font-semibold tracking-wider flex items-center gap-2">
              <Zap size={16} className="text-emerald-400" />
              Live Activity Stream
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Continuous Updates</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl space-y-3 shadow-xl">
            {SOCIAL_STREAM.map((stream) => (
              <div key={stream.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/8 flex items-center justify-between gap-3 text-xs text-white/80">
                <div className="flex items-center gap-3">
                  <img src={stream.userAvatar} alt={stream.userName} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                  <p>
                    <span className="font-bold text-white">{stream.userName}</span> {stream.actionText}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-white/40 shrink-0">{stream.timestamp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 5: FEATURED SUCCESSFUL COUPLES (NEW SECTION)
            ==================================================== */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Featured Aura Couples</h2>
            <p className="text-xs text-white/60 mt-0.5">Real love stories calibrated and matched through AuraAI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURED_COUPLES.map((couple) => (
              <div 
                key={couple.id}
                className="p-6 rounded-3xl bg-gradient-to-br from-pink-950/30 via-purple-950/20 to-black/80 border border-pink-500/30 backdrop-blur-2xl space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-white">{couple.coupleNames}</h3>
                  <span className="text-[10px] font-mono font-bold text-pink-300 bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-500/30">
                    {couple.timeMatched}
                  </span>
                </div>

                {/* Before / After Photos */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10">
                    <img src={couple.photoBefore} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-mono text-white">First Match</span>
                  </div>
                  <div className="relative h-40 rounded-2xl overflow-hidden border border-pink-500/40">
                    <img src={couple.photoAfter} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-pink-500 text-[9px] font-mono text-white font-bold">Co-Living Now ❤️</span>
                  </div>
                </div>

                <blockquote className="text-xs italic text-white/80 font-serif leading-relaxed">
                  {couple.quote}
                </blockquote>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 6: TRENDING THIS WEEK
            ==================================================== */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Trending This Week</h2>
            <p className="text-xs text-white/60 mt-0.5">Top cafés, songs, outdoor date spots, and restaurants</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {TRENDING_THIS_WEEK.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6, scale: 1.03 }}
                className="rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden backdrop-blur-xl p-3 flex flex-col justify-between h-48 group hover:border-pink-500/40 transition-all shadow-lg"
              >
                <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 text-lg">{item.icon}</span>
                  {item.rating && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-mono text-amber-300 font-bold">
                      {item.rating}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white font-display line-clamp-1 group-hover:text-pink-300 transition-colors">{item.title}</h4>
                  <p className="text-[10px] text-white/50 line-clamp-2 mt-0.5 leading-snug">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 7: AI CONVERSATION STARTER BUBBLES
            ==================================================== */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">AI Conversation Starters</h2>
            <p className="text-xs text-white/60 mt-0.5">Click any animated prompt bubble to start an instant message</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {CONVERSATION_BUBBLES.map((b) => (
              <motion.button
                key={b.id}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  addToast(`Prompt loaded for ${b.personName}: "${b.text}"`, 'chat');
                  setActiveTab('chats');
                }}
                className={`px-4 py-3 rounded-2xl bg-gradient-to-r ${b.bgGradient} border border-white/20 text-xs font-semibold text-white shadow-xl flex items-center gap-2 cursor-pointer transition-transform`}
              >
                <span className="text-base">{b.icon}</span>
                <span>{b.text}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 8: CURATED OUTING EVENTS CAROUSEL
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Group Date Outings & Events</h2>
              <p className="text-xs text-white/60 mt-0.5">Join curated social events, coffee walks, and music sessions</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"><ChevronLeft size={18} /></button>
              <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div ref={eventCarouselRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x">
            {TRENDING_EVENTS.map((evt) => (
              <motion.div
                key={evt.id}
                whileHover={{ y: -6 }}
                className="w-[320px] md:w-[360px] shrink-0 snap-start rounded-3xl bg-white/[0.04] border border-white/12 overflow-hidden backdrop-blur-2xl flex flex-col justify-between shadow-xl group hover:border-purple-500/40 transition-all duration-300"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold font-mono text-purple-300 border border-purple-500/30">
                      {evt.category.toUpperCase()}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-pink-500/20 backdrop-blur-md text-[10px] font-semibold text-pink-300 border border-pink-500/40">
                      {evt.spotsLeft} spots left
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white font-display leading-snug group-hover:text-pink-300 transition-colors">{evt.title}</h3>
                    <div className="space-y-1 text-xs text-white/60 font-mono">
                      <p className="flex items-center gap-1.5"><Calendar size={13} className="text-purple-400" /> {evt.date}</p>
                      <p className="flex items-center gap-1.5"><MapPin size={13} className="text-pink-400" /> {evt.location}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => handleJoinEvent(evt.id, evt.title)}
                    className={`w-full py-2.5 rounded-2xl font-semibold text-xs transition-all cursor-pointer ${
                      joinedEvents[evt.id] ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {joinedEvents[evt.id] ? '✓ Joined Guest List' : 'Join Outing Instantly'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 9: COMPACT AI RECOMMENDATIONS
            ==================================================== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-white">Compact AI Insights</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {COMPACT_AI_RECOMMENDATIONS.map((rec) => (
              <div 
                key={rec.id}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-2 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{rec.icon}</span>
                  <h4 className="text-xs font-bold font-display text-white">{rec.headline}</h4>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{rec.detail}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ====================================================
          FLOATING MATCH REQUEST NOTIFICATION POPUP
          ==================================================== */}
      <AnimatePresence>
        {showFloatingMatch && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-3xl bg-black/90 border border-pink-500/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center gap-4 max-w-sm"
          >
            <div className="relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" 
                alt="Maya" 
                className="w-12 h-12 rounded-full object-cover border-2 border-pink-500" 
              />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white">❤️</span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white font-display">Maya sent you a heart!</h4>
              <p className="text-[10px] text-white/60">97% Affinity Match in Hayes Valley</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={() => {
                  setSelectedMatchId('sp1');
                  setActiveTab('deck');
                }}
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs"
              >
                View
              </button>
              <button 
                onClick={() => setShowFloatingMatch(false)}
                className="p-1.5 rounded-full text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORY VIEWER MODAL */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm h-[620px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between bg-black"
            >
              <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/80 to-transparent space-y-3">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 5, ease: 'linear' }} onAnimationComplete={() => setActiveStory(null)} className="h-full bg-gradient-to-r from-pink-500 to-purple-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={activeStory.avatar} alt={activeStory.name} className="w-8 h-8 rounded-full object-cover border border-pink-500" />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{activeStory.name}</h4>
                      <p className="text-[10px] text-white/60 font-mono">{activeStory.timeAgo}</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveStory(null)} className="p-2 rounded-full bg-black/50 text-white"><X size={18} /></button>
                </div>
              </div>
              <img src={storyImage(activeStory)} alt="Story" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                <p className="text-sm text-white font-medium">{activeStory.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function storyImage(story: StoryItem) {
  return story.storyImage || story.avatar;
}
