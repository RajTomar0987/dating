import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Sparkles, MapPin, Calendar, Coffee, Film, 
  Compass, Music, Camera, Utensils, ChevronLeft, ChevronRight, Play, 
  Pause, Clock, Sun, Flame, Zap, User, Share2, CheckCircle2, Send, 
  Volume2, Smile, Star, X, ShieldCheck, Eye, BookOpen, Users,
  ArrowUpRight, Bookmark, Filter, Search
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';
import {
  HERO_MATCHES,
  STORIES_DATA,
  FEATURED_MATCHES,
  DISCOVER_MASONRY,
  TRENDING_EVENTS,
  COMMUNITY_BUBBLES,
  RECENT_MESSAGES,
  AI_WINGMAN_CARDS,
  UPCOMING_DATES
} from '../data/homeData';
import type {
  StoryItem,
  FeaturedMatch,
  DiscoverCard,
  TrendingEvent
} from '../data/homeData';

// ----------------------------------------------------
// 3D TILT CARD COMPONENT
// ----------------------------------------------------
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '' }) => {
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
    
    // Calculate rotation (-10 deg to 10 deg)
    const rX = ((mouseY - height / 2) / (height / 2)) * -10;
    const rY = ((mouseX - width / 2) / (width / 2)) * 10;
    
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
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ----------------------------------------------------
// MAIN HOMEPAGE COMPONENT
// ----------------------------------------------------
export default function LiveHomeDashboard() {
  const { setActiveTab, addToast, setSelectedMatchId } = useAppStore();

  // Active States
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [likedMatches, setLikedMatches] = useState<Record<string, boolean>>({});
  const [bookmarkedCards, setBookmarkedCards] = useState<Record<string, boolean>>({});
  const [joinedEvents, setJoinedEvents] = useState<Record<string, boolean>>({});
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [storiesList, setStoriesList] = useState<StoryItem[]>(STORIES_DATA);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Time of Day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Raj 👋';
    if (hour < 18) return 'Good Afternoon, Raj 👋';
    return 'Good Evening, Raj 👋';
  };

  // Handlers
  const handleLike = (id: string, name: string) => {
    const isLiked = !likedMatches[id];
    setLikedMatches(prev => ({ ...prev, [id]: isLiked }));
    if (isLiked) {
      addToast(`Sent a secret crush heart to ${name}! ✨`, 'match');
    }
  };

  const handleBookmark = (id: string, name: string) => {
    const isBookmarked = !bookmarkedCards[id];
    setBookmarkedCards(prev => ({ ...prev, [id]: isBookmarked }));
    addToast(isBookmarked ? `Saved ${name}'s profile to your favorites` : `Removed ${name} from saved`, 'system');
  };

  const handleJoinEvent = (eventId: string, title: string) => {
    const isJoined = !joinedEvents[eventId];
    setJoinedEvents(prev => ({ ...prev, [eventId]: isJoined }));
    if (isJoined) {
      addToast(`🎉 You're on the guest list for: ${title}!`, 'match');
    }
  };

  const handleOpenStory = (story: StoryItem) => {
    setActiveStory(story);
    // Mark story as viewed
    setStoriesList(prev => prev.map(s => s.id === story.id ? { ...s, hasUnviewed: false } : s));
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const toggleVoiceMessage = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      addToast(`Playing AI Voice Note from Elena Rostova...`, 'chat');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#04040A] text-white font-sans relative overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* Dynamic Ambient Glow & 3D Particle Background */}
      <ParticleBg />
      
      {/* Background Ambient Lighting Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-pink-900/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[30%] w-[450px] h-[450px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Container Viewport */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-32 md:pb-16 max-w-7xl mx-auto space-y-16 relative z-10 overflow-x-hidden">
        
        {/* ====================================================
            SECTION 1: LARGE HERO WITH 8 NEW AI MATCHES
            ==================================================== */}
        <section className="relative rounded-3xl p-6 md:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.05] via-purple-950/20 to-black/80 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
          {/* Animated Background Mesh Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,70,239,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-xs font-medium text-pink-300 backdrop-blur-md shadow-inner"
            >
              <Sparkles size={14} className="text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="tracking-wide">AI-POWERED MATCHMAKING V3.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-none"
            >
              {getGreeting()}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 font-light max-w-xl leading-relaxed"
            >
              Discover meaningful relationships powered by AI. Real people, deep compatibility, zero superficial noise.
            </motion.p>
          </div>

          {/* BELOW HERO: 8 NEW AI MATCHES BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 pt-8 border-t border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse" />
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                  8 New AI Matches Today
                </h3>
              </div>
              <button 
                onClick={() => setActiveTab('deck')}
                className="text-xs font-medium text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors group cursor-pointer"
              >
                Explore Discover Deck <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {HERO_MATCHES.map((match, i) => (
                <motion.div
                  key={match.id}
                  whileHover={{ y: -6, scale: 1.05 }}
                  onClick={() => {
                    setSelectedMatchId(match.id);
                    setActiveTab('deck');
                  }}
                  className="group relative flex flex-col items-center cursor-pointer"
                >
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-lg group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all">
                    <img 
                      src={match.avatar} 
                      alt={match.name} 
                      className="w-full h-full object-cover rounded-[14px] group-hover:scale-110 transition-transform duration-500" 
                    />
                    {match.online && (
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full shadow-sm" />
                    )}
                    <div className="absolute top-1 left-1 px-1 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-mono text-emerald-300 font-bold">
                      {match.matchScore}%
                    </div>
                  </div>
                  <span className="text-xs font-medium text-white/90 mt-1.5 truncate max-w-[64px] text-center">
                    {match.name}, {match.age}
                  </span>
                  <span className="text-[10px] text-pink-400 font-mono scale-95 opacity-80 truncate max-w-[64px] text-center">
                    {match.tag}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ====================================================
            SECTION 2: INSTAGRAM-STYLE SCROLLING STORIES
            ==================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                <Flame size={18} />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">Live Stories</h2>
                <p className="text-xs text-white/50">Real-time moments from matches in San Francisco</p>
              </div>
            </div>
            <span className="text-xs font-mono text-white/40">Tap to View Fullscreen</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x">
            {storiesList.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => handleOpenStory(story)}
                className="flex flex-col items-center gap-2 cursor-pointer shrink-0 snap-start group"
              >
                <div className={`relative p-[3px] rounded-full transition-all duration-300 ${
                  story.hasUnviewed 
                    ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(236,72,153,0.4)] animate-pulse' 
                    : 'bg-white/15'
                }`}>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-0.5 bg-black">
                    <img 
                      src={story.avatar} 
                      alt={story.name} 
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  {story.isOnline && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full shadow-md" />
                  )}
                  {story.hasUnviewed && (
                    <span className="absolute top-0 right-0 px-1.5 py-0.5 bg-pink-500 text-[9px] font-bold text-white rounded-full shadow-lg">
                      NEW
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-white/90 truncate max-w-[80px]">
                    {story.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-white/40 font-mono">
                    {story.timeAgo}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 3: FEATURED MATCHES (3D ROTATING CARDS)
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                <h2 className="text-2xl font-display font-bold text-white">Featured AI Affinity Matches</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">High-compatibility profiles tailored by your AI Digital Twin</p>
            </div>
            <button 
              onClick={() => setActiveTab('deck')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all cursor-pointer"
            >
              View All Matches
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURED_MATCHES.map((match) => (
              <TiltCard key={match.id} className="h-full">
                <div className="h-full rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/12 p-6 flex flex-col justify-between backdrop-blur-2xl shadow-2xl hover:border-pink-500/40 transition-all duration-300 group">
                  
                  {/* Top Image & Header */}
                  <div>
                    <div className="relative h-72 rounded-2xl overflow-hidden mb-5">
                      <img 
                        src={match.image} 
                        alt={match.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {match.compatibility}% SYNERGY
                        </span>
                        {match.activeNow && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium backdrop-blur-md">
                            Active Now
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={() => handleBookmark(match.id, match.name)}
                        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all ${
                          bookmarkedCards[match.id] 
                            ? 'bg-pink-500 text-white border-pink-400' 
                            : 'bg-black/40 text-white/80 border-white/15 hover:bg-black/60'
                        }`}
                      >
                        <Bookmark size={16} fill={bookmarkedCards[match.id] ? "currentColor" : "none"} />
                      </button>

                      {/* Name Overlay */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <div className="flex items-center gap-2 text-white">
                          <h3 className="text-2xl font-bold font-display">{match.name}, {match.age}</h3>
                          {match.verified && <ShieldCheck size={18} className="text-cyan-400" />}
                        </div>
                        <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-pink-400" />
                          {match.occupation} • {match.distance}
                        </p>
                      </div>
                    </div>

                    {/* Bio & AI Reason */}
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                      "{match.bio}"
                    </p>

                    <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 mb-4 flex items-start gap-2.5">
                      <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-300 block mb-0.5">AI MATCH INSIGHT</span>
                        {match.aiReason}
                      </div>
                    </div>

                    {/* Interest Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {match.interests.map((interest, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/8 text-[11px] font-medium text-white/70"
                        >
                          #{interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button 
                      onClick={() => handleLike(match.id, match.name)}
                      className={`flex-1 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                        likedMatches[match.id] 
                          ? 'bg-pink-600 text-white shadow-pink-600/40' 
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-purple-900/30'
                      }`}
                    >
                      <Heart size={16} fill={likedMatches[match.id] ? "currentColor" : "none"} />
                      {likedMatches[match.id] ? 'Liked!' : 'Like Profile'}
                    </button>

                    <button 
                      onClick={() => setActiveTab('chats')}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all cursor-pointer"
                      title="Send Instant Message"
                    >
                      <MessageCircle size={18} />
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedMatchId(match.id);
                        setActiveTab('deck');
                      }}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                      title="View Full Profile"
                    >
                      <User size={18} />
                    </button>
                  </div>

                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 4: DISCOVER NEARBY (PINTEREST MASONRY GRID)
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Compass size={20} className="text-pink-400" />
                <h2 className="text-2xl font-display font-bold text-white">Discover Nearby Profiles</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Explore local creators, artists, and innovators with AI conversation starters</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 font-mono hidden sm:inline">Pinterest-Style Masonry</span>
            </div>
          </div>

          <div className="columns-1 sm:columns-2 md:columns-4 gap-4 space-y-4">
            {DISCOVER_MASONRY.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="break-inside-avoid rounded-3xl bg-white/[0.04] border border-white/10 overflow-hidden backdrop-blur-xl group cursor-pointer shadow-xl hover:border-pink-500/30 transition-all duration-300"
              >
                <div className={`relative ${profile.aspectRatio} overflow-hidden`}>
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* AI Conversation Starter Pill */}
                  <div className="absolute top-3 left-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-pink-200 font-medium leading-snug">
                    <span className="text-[10px] font-bold text-pink-400 block font-mono uppercase mb-0.5">AI Starter</span>
                    {profile.conversationStarter}
                  </div>

                  {/* Bottom Profile Details */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-lg font-bold text-white font-display">{profile.name}, {profile.age}</h4>
                    <p className="text-xs text-white/70 truncate">{profile.occupation}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{profile.distance}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(profile.id, profile.name);
                        }}
                        className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
                          likedMatches[profile.id] ? 'bg-pink-500 text-white border-pink-400' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <Heart size={14} fill={likedMatches[profile.id] ? "currentColor" : "none"} />
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('chats');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-pink-500/80 hover:bg-pink-500 text-white text-xs font-semibold backdrop-blur-md transition-colors"
                      >
                        Say Hello 👋
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 5: TRENDING RIGHT NOW (DATE IDEA CAROUSEL)
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-orange-400" />
                <h2 className="text-2xl font-display font-bold text-white">Trending Dates & Group Outings</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Join curated social events, coffee walks, and music sessions</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollCarousel('left')}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x"
          >
            {TRENDING_EVENTS.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -6 }}
                className="w-[320px] md:w-[360px] shrink-0 snap-start rounded-3xl bg-white/[0.04] border border-white/12 overflow-hidden backdrop-blur-2xl flex flex-col justify-between group shadow-xl hover:border-purple-500/40 transition-all duration-300"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold font-mono text-purple-300 border border-purple-500/30">
                      {event.category.toUpperCase()}
                    </span>

                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-pink-500/20 backdrop-blur-md text-[10px] font-semibold text-pink-300 border border-pink-500/40">
                      {event.spotsLeft} spots left
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white font-display leading-snug group-hover:text-pink-300 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-1 text-xs text-white/60 font-mono">
                      <p className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-purple-400" />
                        {event.date}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-pink-400" />
                        {event.location}
                      </p>
                    </div>

                    {/* Host & Attendees */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <img 
                          src={event.hostAvatar} 
                          alt={event.hostName} 
                          className="w-7 h-7 rounded-full object-cover border border-purple-400" 
                        />
                        <span className="text-xs text-white/80 font-medium">Host: {event.hostName}</span>
                      </div>

                      <div className="flex -space-x-2">
                        {event.attendees.map((att, idx) => (
                          <img 
                            key={idx} 
                            src={att} 
                            alt="Attendee" 
                            className="w-6 h-6 rounded-full object-cover border border-black" 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => handleJoinEvent(event.id, event.title)}
                    className={`w-full py-2.5 rounded-2xl font-semibold text-xs transition-all cursor-pointer shadow-md ${
                      joinedEvents[event.id] 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {joinedEvents[event.id] ? '✓ Joined Guest List' : 'Join Outing Instantly'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 6: FLOATING GLASS COMMUNITY BUBBLES
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users size={20} className="text-cyan-400" />
                <h2 className="text-2xl font-display font-bold text-white">Interest Communities</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Interactive floating glass hubs connecting shared passions</p>
            </div>
            <button 
              onClick={() => setActiveTab('communities')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Explore All Communities →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {COMMUNITY_BUBBLES.map((bubble, i) => (
              <motion.div
                key={bubble.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.03 }}
                onClick={() => setActiveTab('communities')}
                className={`relative rounded-3xl p-6 bg-gradient-to-br ${bubble.bgGradient} border border-white/15 backdrop-blur-2xl cursor-pointer group shadow-2xl overflow-hidden flex flex-col justify-between h-56`}
              >
                {/* Floating ambient circle */}
                <div 
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: bubble.accentColor }} 
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
                      {bubble.membersCount}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {bubble.activeCount} live chats
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-200 transition-colors mb-2">
                    {bubble.name}
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                    💬 "{bubble.topic}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex -space-x-2">
                    {bubble.avatarList.map((av, idx) => (
                      <img 
                        key={idx} 
                        src={av} 
                        alt="Member Avatar" 
                        className="w-7 h-7 rounded-full object-cover border-2 border-black" 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white/80 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Enter Hub <ArrowUpRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 7: RECENT MESSAGES (MESSENGER LUXURY UI)
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle size={20} className="text-pink-400" />
                <h2 className="text-2xl font-display font-bold text-white">Recent Messages</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Active conversations with audio voice notes & media</p>
            </div>
            <button 
              onClick={() => setActiveTab('chats')}
              className="text-xs font-medium text-pink-400 hover:text-pink-300 cursor-pointer"
            >
              Open Full Messenger →
            </button>
          </div>

          <div className="rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-4 md:p-6 space-y-3 shadow-2xl">
            {RECENT_MESSAGES.map((msg) => (
              <motion.div
                key={msg.id}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                onClick={() => setActiveTab('chats')}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src={msg.avatar} 
                      alt={msg.senderName} 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border border-white/15 group-hover:scale-105 transition-transform" 
                    />
                    {msg.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                        {msg.senderName}
                      </h4>
                      <span className="text-[10px] text-white/40 font-mono">{msg.timestamp}</span>
                    </div>

                    {msg.isTyping ? (
                      <div className="flex items-center gap-1.5 text-xs text-pink-400 font-mono">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                        <span>typing a response...</span>
                      </div>
                    ) : msg.hasVoiceMessage ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVoiceMessage(msg.id);
                          }}
                          className="p-1.5 rounded-full bg-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white transition-colors"
                        >
                          {playingVoiceId === msg.id ? <Pause size={12} /> : <Play size={12} />}
                        </button>
                        {/* Audio Waveform Bars */}
                        <div className="flex items-center gap-0.5 h-4">
                          {[40, 70, 30, 90, 50, 80, 40, 60, 90, 30].map((h, idx) => (
                            <span 
                              key={idx} 
                              className={`w-1 rounded-full ${playingVoiceId === msg.id ? 'bg-pink-400 animate-pulse' : 'bg-white/30'}`}
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-white/50">{msg.voiceDuration}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-white/70 truncate">{msg.lastMessage}</p>
                    )}
                  </div>
                </div>

                {msg.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-md">
                    {msg.unreadCount}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 8: AI WINGMAN INSIGHTS (ACTIONABLE CARDS)
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-emerald-400" />
                <h2 className="text-2xl font-display font-bold text-white">AI Wingman Feed</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Real-time social signals, engagement highlights & date prompts</p>
            </div>
            <button 
              onClick={() => setActiveTab('wingman')}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Open AI Wingman Dock →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_WINGMAN_CARDS.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-5 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl flex items-start gap-4 shadow-xl group hover:border-emerald-500/40 transition-all"
              >
                <div className="relative shrink-0">
                  <img 
                    src={card.personAvatar} 
                    alt={card.personName} 
                    className="w-12 h-12 rounded-2xl object-cover border border-white/20" 
                  />
                  <div 
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-black shadow"
                    style={{ backgroundColor: card.accentColor }}
                  >
                    ✨
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {card.headline}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono shrink-0 ml-2">{card.timestamp}</span>
                  </div>

                  <p className="text-xs text-white/60">
                    💡 <span className="font-semibold text-white/80">Recommended Action:</span> {card.suggestedAction}
                  </p>

                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        addToast(`AI Wingman initiated action for ${card.personName}`, 'system');
                        setActiveTab('chats');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-white border border-white/15 text-xs font-semibold text-white/90 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Coffee size={13} />
                      Send Coffee Invite
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 9: UPCOMING DATES TIMELINE
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-purple-400" />
                <h2 className="text-2xl font-display font-bold text-white">Upcoming Confirmed Dates</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Your synchronized dates, venue maps, and weather forecasts</p>
            </div>
            <button 
              onClick={() => setActiveTab('planner')}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Open Date Planner →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UPCOMING_DATES.map((date) => (
              <motion.div
                key={date.id}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white/[0.04] border border-white/12 overflow-hidden backdrop-blur-2xl p-6 flex flex-col justify-between shadow-2xl relative group"
              >
                <div>
                  {/* Top Partner Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={date.partnerAvatar} 
                        alt={date.partnerName} 
                        className="w-12 h-12 rounded-2xl object-cover border border-purple-400/50" 
                      />
                      <div>
                        <h4 className="text-base font-bold text-white font-display">
                          Date with {date.partnerName}
                        </h4>
                        <p className="text-xs text-purple-300 font-mono">{date.type} Experience</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                      {date.countdown}
                    </span>
                  </div>

                  {/* Venue Details */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-2 mb-4">
                    <p className="text-sm font-bold text-white">{date.locationName}</p>
                    <p className="text-xs text-white/60 flex items-center gap-1.5">
                      <MapPin size={13} className="text-pink-400 shrink-0" />
                      {date.address}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono text-white/80 pt-2 border-t border-white/10">
                      <span>📅 {date.date} at {date.time}</span>
                      <span className="text-amber-300 font-bold">{date.weather.icon} {date.weather.temp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab('planner')}
                    className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    View Date Itinerary
                  </button>
                  <button 
                    onClick={() => setActiveTab('chats')}
                    className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 10: GLASS FOOTER WITH AMBIENT PARTICLES
            ==================================================== */}
        <footer className="mt-20 rounded-3xl p-8 bg-gradient-to-br from-white/[0.04] via-purple-950/20 to-black/90 border border-white/10 backdrop-blur-2xl text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(236,72,153,0.15),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                <Heart size={20} className="text-white fill-white" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-bold text-lg text-white tracking-wider">AURA<span className="text-pink-400">AI</span></h3>
                <p className="text-[10px] text-white/50 font-mono">The World's Most Premium AI Dating Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/60">
              <button onClick={() => setActiveTab('deck')} className="hover:text-white transition-colors">Discover</button>
              <button onClick={() => setActiveTab('chats')} className="hover:text-white transition-colors">Chats</button>
              <button onClick={() => setActiveTab('communities')} className="hover:text-white transition-colors">Communities</button>
              <button onClick={() => setActiveTab('planner')} className="hover:text-white transition-colors">Date Planner</button>
              <button onClick={() => setActiveTab('premium')} className="hover:text-white transition-colors">Aura Pro+</button>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono gap-2">
            <p>© 2026 AuraAI Technologies, Inc. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              San Francisco • Spatial AI Engine Active
            </p>
          </div>
        </footer>

      </main>

      {/* ====================================================
          STORY VIEWER MODAL
          ==================================================== */}
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
              className="relative w-full max-w-sm h-[640px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between bg-black"
            >
              {/* Story Top Progress Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/80 to-transparent space-y-3">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    onAnimationComplete={() => setActiveStory(null)}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={activeStory.avatar} 
                      alt={activeStory.name} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-pink-500" 
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{activeStory.name}</h4>
                      <p className="text-[10px] text-white/70 font-mono">{activeStory.timeAgo}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveStory(null)}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Story Image */}
              <img 
                src={activeStory.storyImage} 
                alt="Story content" 
                className="w-full h-full object-cover" 
              />

              {/* Story Bottom Caption & Reply Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-4">
                <p className="text-sm text-white font-medium drop-shadow-md">
                  {activeStory.caption}
                </p>

                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder={`Reply to ${activeStory.name.split(' ')[0]}...`}
                    className="flex-1 py-2.5 px-4 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-white/50 focus:outline-none focus:border-pink-500 backdrop-blur-md"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addToast(`Sent reply to ${activeStory.name}!`, 'chat');
                        setActiveStory(null);
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      addToast(`Liked ${activeStory.name}'s story! ❤️`, 'match');
                    }}
                    className="p-2.5 rounded-full bg-pink-500 text-white shadow-lg cursor-pointer"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
