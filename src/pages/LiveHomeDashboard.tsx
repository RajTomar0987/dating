import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Sparkles, MapPin, Calendar, Coffee, Film, 
  Compass, Music, Camera, Utensils, ChevronLeft, ChevronRight, Play, 
  Pause, Clock, Sun, Flame, Zap, User, Share2, CheckCircle2, Send, 
  Volume2, Smile, Star, X, ShieldCheck, Eye, BookOpen, Users, Bell,
  ArrowUpRight, Bookmark, Filter, Search, Globe, ChevronDown, Check, ThumbsDown, Bot
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../auth/useAuth';
import { ApiClient } from '../api/client';
import {
  STORIES_DATA,
  FEATURED_COUPLES,
  TRENDING_THIS_WEEK,
  CONVERSATION_BUBBLES,
  COMPACT_AI_RECOMMENDATIONS,
  TRENDING_EVENTS
} from '../data/homeData';
import type {
  StoryItem
} from '../data/homeData';

// Helper for relative timestamps
function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'Just now';
  const time = new Date(isoString).getTime();
  if (isNaN(time)) return 'Just now';
  const now = Date.now();
  const diffSec = Math.floor((now - time) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

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

  // Real Notifications State
  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const [realProfiles, setRealProfiles] = useState<any[]>([]);
  const [showFloatingMatch, setShowFloatingMatch] = useState(true);

  const { profile, firebaseUser } = useAuth();
  const navigate = useNavigate();

  // Fetch real notifications and discover profiles from backend
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const notifRes = await ApiClient.getNotifications();
        if (isMounted && notifRes && Array.isArray(notifRes.notifications)) {
          setUserNotifications(notifRes.notifications);
        }
      } catch (err) {
        console.error('[Dashboard] Error fetching real notifications:', err);
      }

      try {
        const profRes = await ApiClient.getDiscoverProfiles();
        if (isMounted && profRes && Array.isArray(profRes.profiles)) {
          setRealProfiles(profRes.profiles);
        }
      } catch (err) {
        console.error('[Dashboard] Error fetching discover profiles:', err);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [firebaseUser]);

  // Real User Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const eventCarouselRef = useRef<HTMLDivElement>(null);

  // Debounced server-side search
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    setIsSearchOpen(true);

    const timer = setTimeout(async () => {
      try {
        const res = await ApiClient.searchProfiles(q);
        setSearchResults(res?.profiles || []);
      } catch (err) {
        console.error('[Dashboard/Search] Error searching profiles:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      handleSelectUser(searchResults[0]);
    }
  };

  const handleSelectUser = (user: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/profile/${user.firebase_uid || user.id}`);
  };

  // Time-based Greeting
  const getGreeting = () => {
    const name = profile?.display_name || profile?.first_name || firebaseUser?.displayName || 'User';
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${name} 👋`;
    if (hour < 18) return `Good Afternoon, ${name} 👋`;
    return `Good Evening, ${name} 👋`;
  };

  // Auto-cycle real notifications ticker every 4 seconds if present
  useEffect(() => {
    if (userNotifications.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % userNotifications.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [userNotifications.length]);

  // Action Handlers
  const handleLike = async (id: string, name: string) => {
    setLikedMatches(prev => ({ ...prev, [id]: true }));
    try {
      await ApiClient.likeUser(id, 'like');
      // Re-fetch notifications after real like action
      const refreshedNotifs = await ApiClient.getNotifications();
      if (refreshedNotifs && Array.isArray(refreshedNotifs.notifications)) {
        setUserNotifications(refreshedNotifs.notifications);
      }
    } catch (_) {}
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

  const unreadNotification = userNotifications.find(n => !n.is_read) || (userNotifications.length > 0 ? userNotifications[0] : null);
  const currentTickerNotif = userNotifications.length > 0 ? userNotifications[tickerIndex % userNotifications.length] : null;

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
      <main className="flex-1 ml-0 md:ml-64 w-full max-w-7xl mx-auto min-w-0 p-3 sm:p-4 md:p-8 pb-[calc(100px+env(safe-area-inset-bottom))] md:pb-24 space-y-6 sm:space-y-8 md:space-y-12 relative z-10 overflow-x-hidden">
        
        {/* ====================================================
            SECTION 1: HERO + ANIMATED REAL-TIME ACTIVITY TICKER
            ==================================================== */}
        <section className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 border border-white/12 bg-gradient-to-br from-white/[0.06] via-purple-950/20 to-black/80 backdrop-blur-2xl shadow-2xl space-y-4 sm:space-y-6 max-w-full overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-mono font-bold uppercase mb-2 max-w-full flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>AURA LIVE NETWORK • ACTIVE NOW</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-black text-white tracking-tight break-words">
                {getGreeting()}
              </h1>
              <p className="text-xs md:text-sm text-white/60 mt-1 font-light leading-relaxed">
                Discover real-time connections, live moments, and meaningful relationships powered by AI.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-left sm:text-right backdrop-blur-md w-full sm:w-auto">
                <span className="text-xs font-mono text-pink-400 font-bold block">🔥 {realProfiles.length} Members Registered</span>
                <span className="text-[10px] text-white/50">San Francisco & Bay Area</span>
              </div>
            </div>
          </div>

          {/* REAL-TIME ACTIVITY TICKER BAR */}
          <div className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl flex items-center justify-between shadow-inner">
            {currentTickerNotif ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTickerNotif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2.5 sm:gap-3 min-w-0"
                >
                  <span className="text-base sm:text-lg shrink-0">
                    {currentTickerNotif.notification_type === 'match' ? '🎉' : currentTickerNotif.notification_type === 'like' ? '❤️' : '🔔'}
                  </span>
                  <span className="text-xs md:text-sm text-white font-medium truncate">
                    {currentTickerNotif.title}: {currentTickerNotif.message}
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded-full shrink-0">
                    {formatRelativeTime(currentTickerNotif.created_at)}
                  </span>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <Bell size={16} className="text-pink-400 shrink-0" />
                <span className="text-xs md:text-sm text-white/80 font-medium truncate">
                  No new notifications • Activity will appear here when members interact with you
                </span>
              </div>
            )}

            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold hidden sm:inline shrink-0">
              ● REALTIME TELEMETRY STREAM
            </span>
          </div>
        </section>

        {/* ====================================================
            SECTION 1.5: REAL DATABASE USER SEARCH BAR
            ==================================================== */}
        <section ref={searchContainerRef} className="relative z-30 w-full max-w-full">
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative flex items-center min-h-[44px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400/80 shrink-0" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim().length >= 2) setIsSearchOpen(true); }}
                onKeyDown={handleKeyDown}
                placeholder="Search people, interests, locations..."
                className="w-full min-h-[44px] py-3 pl-10 pr-10 rounded-2xl bg-[#0A0A14]/90 border border-white/15 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-pink-500/80 focus:ring-2 focus:ring-pink-500/20 backdrop-blur-2xl shadow-xl transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              ) : (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/30 hidden sm:inline">
                  ESC to close
                </span>
              )}
            </div>

            {/* SEARCH RESULTS DROPDOWN */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 w-full rounded-2xl bg-[#0A0A14]/98 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white overflow-hidden max-h-80 overflow-y-auto divide-y divide-white/8 z-50"
                >
                  <div className="p-3 bg-white/[0.03] flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span>REAL USER SEARCH RESULTS</span>
                    {isSearching && <span className="text-pink-400 animate-pulse">Searching DB...</span>}
                  </div>

                  {isSearching && searchResults.length === 0 ? (
                    <div className="p-6 text-center text-xs text-white/60 space-y-2">
                      <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p>Searching database profiles...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-6 text-center text-xs text-white/50 space-y-1">
                      <p className="font-semibold text-white/80">No registered users found</p>
                      <p className="text-[11px]">No profiles match "{searchQuery}"</p>
                    </div>
                  ) : (
                    searchResults.map((user) => {
                      const userPhoto = user.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                      const userLocation = user.location_city || 'India';
                      const userOccupation = user.occupation || 'Member';
                      const userInterests = Array.isArray(user.interests) ? user.interests.slice(0, 3) : [];

                      return (
                        <div
                          key={user.firebase_uid || user.id}
                          onClick={() => handleSelectUser(user)}
                          className="p-3 hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-3 group min-h-[44px]"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={userPhoto}
                              alt={user.display_name}
                              className="w-11 h-11 rounded-xl object-cover border border-white/15 group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0A0A14]" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs md:text-sm font-bold text-white truncate group-hover:text-pink-400 transition-colors">
                                {user.display_name}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[10px] font-mono font-bold shrink-0">
                                97% Match
                              </span>
                            </div>

                            <p className="text-[11px] text-white/60 truncate mt-0.5">
                              {userLocation} • {userOccupation}
                            </p>

                            {userInterests.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {userInterests.map((interest: string, idx: number) => (
                                  <span key={idx} className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/8">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ====================================================
            SECTION 2: INSTAGRAM-QUALITY LIVE STORIES
            ==================================================== */}
        <section className="space-y-3 sm:space-y-4 max-w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-pink-400 shrink-0" />
              <h2 className="text-lg sm:text-xl font-display font-bold text-white">Live Stories</h2>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-white/40">Tap to Watch Highlights</span>
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none snap-x w-full max-w-full">
            {storiesList.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.06, y: -4 }}
                onClick={() => {
                  setActiveStory(story);
                  setStoriesList(prev => prev.map(s => s.id === story.id ? { ...s, hasUnviewed: false } : s));
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 snap-start group relative"
              >
                {/* Rotating Gradient Ring */}
                <div className={`p-[2.5px] rounded-full transition-all duration-300 ${
                  story.hasUnviewed 
                    ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_18px_rgba(236,72,153,0.5)] animate-pulse' 
                    : 'bg-white/15'
                }`}>
                  <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full overflow-hidden p-0.5 bg-black relative">
                    <img src={story.avatar} alt={story.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
                    {story.isOnline && (
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full shadow-md" />
                    )}
                  </div>
                </div>

                {story.isAiRecommended && (
                  <span className="absolute -top-1 px-1.5 py-0.5 bg-purple-600 text-[7.5px] font-bold font-mono text-white rounded-full shadow-md border border-purple-300">
                    AI PICK
                  </span>
                )}

                <div className="text-center w-16 sm:w-20">
                  <p className="text-[11px] sm:text-xs font-semibold text-white/90 truncate">
                    {story.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-white/40 font-mono truncate">{story.timeAgo}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 3: AI MATCHES (REAL USERS OR DISCOVER)
            ==================================================== */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">AI Affinity Matches</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">High-synergy profiles calibrated by your AI Digital Twin</p>
            </div>
            <button 
              onClick={() => setActiveTab('deck')}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors self-start sm:self-auto min-h-[36px] flex items-center"
            >
              Open Discover Deck →
            </button>
          </div>

          {realProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {realProfiles.filter(m => !passedMatches[m.id || m.firebase_uid]).map((match) => (
                <Tilt key={match.id || match.firebase_uid} className="h-full">
                  <div className="h-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/[0.08] to-black/90 border border-white/12 overflow-hidden backdrop-blur-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl hover:border-pink-500/40 transition-all duration-300 group">
                    
                    <div>
                      {/* Large Portrait Media */}
                      <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-3 sm:mb-4">
                        <img 
                          src={match.images?.[0] || match.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'} 
                          alt={match.name || match.display_name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                        {/* Top Synergy Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 sm:gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                            {match.compatibilityScore || 95}% SYNERGY
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-medium backdrop-blur-md border border-emerald-500/30">
                            Active
                          </span>
                        </div>

                        {/* Bottom Portrait Info Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">{match.name || match.display_name}, {match.age || 24}</h3>
                            <ShieldCheck size={18} className="text-cyan-400 shrink-0" />
                          </div>
                          <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                            <MapPin size={13} className="text-pink-400 shrink-0" />
                            <span>{match.occupation || 'Member'} • {match.location || 'Nearby'}</span>
                          </p>
                        </div>
                      </div>

                      {/* AI Synergy Reason */}
                      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 mb-3 sm:mb-4 flex items-start gap-2.5">
                        <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-purple-300 block mb-0.5">AI MATCH INSIGHT</span>
                          {match.bio || 'High synergy profile matched by your AI Digital Twin.'}
                        </div>
                      </div>

                      {/* Shared Interest Chips */}
                      {Array.isArray(match.interests) && match.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          {match.interests.slice(0, 3).map((interest: string, idx: number) => (
                            <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] sm:text-xs font-medium text-white/80">
                              #{interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Like / Pass / Message Actions */}
                    <div className="flex items-center gap-2.5 sm:gap-3 pt-3 border-t border-white/10">
                      <button 
                        onClick={() => handlePass(match.id || match.firebase_uid, match.name || match.display_name)}
                        className="p-3 min-h-[44px] min-w-[44px] rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center justify-center"
                        title="Pass"
                      >
                        <ThumbsDown size={18} />
                      </button>

                      <button 
                        onClick={() => handleLike(match.id || match.firebase_uid, match.name || match.display_name)}
                        className={`flex-1 min-h-[44px] py-3 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                          likedMatches[match.id || match.firebase_uid]
                            ? 'bg-pink-600 text-white'
                            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                        }`}
                      >
                        <Heart size={16} fill={likedMatches[match.id || match.firebase_uid] ? "currentColor" : "none"} />
                        {likedMatches[match.id || match.firebase_uid] ? 'Liked!' : 'Like Profile'}
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedMatchId(match.id || match.firebase_uid);
                          setActiveTab('chats');
                        }}
                        className="p-3 min-h-[44px] min-w-[44px] rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer flex items-center justify-center"
                        title="Message"
                      >
                        <MessageCircle size={18} />
                      </button>
                    </div>

                  </div>
                </Tilt>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-3 backdrop-blur-2xl">
              <Users className="mx-auto text-purple-400/50" size={32} />
              <h3 className="text-base font-bold text-white">No other profiles available yet</h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                New members are joining AURA AI continuously. Check back soon for new matches!
              </p>
            </div>
          )}
        </section>

        {/* ====================================================
            SECTION 4: REAL NOTIFICATIONS & ACTIVITY STREAM
            ==================================================== */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-mono uppercase text-white/60 font-semibold tracking-wider flex items-center gap-2">
              <Zap size={16} className="text-emerald-400 shrink-0" />
              Real Notifications & Activity
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Live Updates</span>
          </div>

          {userNotifications.length > 0 ? (
            <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl space-y-2.5 sm:space-y-3 shadow-xl">
              {userNotifications.map((notif) => (
                <div key={notif.id} className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.02] border border-white/8 flex items-center justify-between gap-2.5 sm:gap-3 text-xs text-white/80">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 font-bold">
                      {notif.notification_type === 'match' ? '🎉' : notif.notification_type === 'like' ? '❤️' : '🔔'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate text-xs">{notif.title}</p>
                      <p className="text-white/60 truncate text-[11px]">{notif.message}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 shrink-0">{formatRelativeTime(notif.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl text-center space-y-2">
              <Bell className="mx-auto text-pink-400/60 shrink-0" size={28} />
              <h4 className="text-sm font-semibold text-white">No new notifications</h4>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                You'll see activity here when someone interacts with you.
              </p>
            </div>
          )}
        </section>

        {/* ====================================================
            SECTION 5: FEATURED SUCCESSFUL COUPLES
            ==================================================== */}
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Featured Aura Couples</h2>
            <p className="text-xs text-white/60 mt-0.5">Real love stories calibrated and matched through AuraAI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {FEATURED_COUPLES.map((couple) => (
              <div 
                key={couple.id}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-950/30 via-purple-950/20 to-black/80 border border-pink-500/30 backdrop-blur-2xl space-y-3.5 sm:space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold font-display text-white">{couple.coupleNames}</h3>
                  <span className="text-[10px] font-mono font-bold text-pink-300 bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-500/30">
                    {couple.timeMatched}
                  </span>
                </div>

                {/* Before / After Photos */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="relative h-32 sm:h-40 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10">
                    <img src={couple.photoBefore} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-mono text-white">First Match</span>
                  </div>
                  <div className="relative h-32 sm:h-40 rounded-xl sm:rounded-2xl overflow-hidden border border-pink-500/40">
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
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Trending This Week</h2>
            <p className="text-xs text-white/60 mt-0.5">Top cafés, songs, outdoor date spots, and restaurants</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {TRENDING_THIS_WEEK.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6, scale: 1.03 }}
                className="rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden backdrop-blur-xl p-2.5 sm:p-3 flex flex-col justify-between h-44 sm:h-48 group hover:border-pink-500/40 transition-all shadow-lg"
              >
                <div className="relative h-20 sm:h-24 rounded-xl overflow-hidden mb-2">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-1.5 left-1.5 text-base sm:text-lg">{item.icon}</span>
                  {item.rating && (
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-black/60 text-[8.5px] sm:text-[9px] font-mono text-amber-300 font-bold">
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
        <section className="space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">AI Conversation Starters</h2>
            <p className="text-xs text-white/60 mt-0.5">Click any animated prompt bubble to start an instant message</p>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {CONVERSATION_BUBBLES.map((b) => (
              <motion.button
                key={b.id}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  addToast(`Prompt loaded for ${b.personName}: "${b.text}"`, 'chat');
                  setActiveTab('chats');
                }}
                className={`px-3.5 py-2.5 sm:px-4 sm:py-3 min-h-[44px] rounded-2xl bg-gradient-to-r ${b.bgGradient} border border-white/20 text-xs font-semibold text-white shadow-xl flex items-center gap-2 cursor-pointer transition-transform`}
              >
                <span className="text-base shrink-0">{b.icon}</span>
                <span className="text-left leading-tight">{b.text}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 8: CURATED OUTING EVENTS CAROUSEL
            ==================================================== */}
        <section className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Group Date Outings & Events</h2>
              <p className="text-xs text-white/60 mt-0.5">Join curated social events, coffee walks, and music sessions</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => scrollCarousel('left')} className="p-2 min-h-[36px] min-w-[36px] rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center"><ChevronLeft size={18} /></button>
              <button onClick={() => scrollCarousel('right')} className="p-2 min-h-[36px] min-w-[36px] rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer flex items-center justify-center"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div ref={eventCarouselRef} className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 scrollbar-none snap-x w-full max-w-full">
            {TRENDING_EVENTS.map((evt) => (
              <motion.div
                key={evt.id}
                whileHover={{ y: -6 }}
                className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 snap-start rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/12 overflow-hidden backdrop-blur-2xl flex flex-col justify-between shadow-xl group hover:border-purple-500/40 transition-all duration-300"
              >
                <div>
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] sm:text-[11px] font-bold font-mono text-purple-300 border border-purple-500/30">
                      {evt.category.toUpperCase()}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-pink-500/20 backdrop-blur-md text-[9.5px] sm:text-[10px] font-semibold text-pink-300 border border-pink-500/40">
                      {evt.spotsLeft} spots left
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-white font-display leading-snug group-hover:text-pink-300 transition-colors">{evt.title}</h3>
                    <div className="space-y-1 text-xs text-white/60 font-mono">
                      <p className="flex items-center gap-1.5"><Calendar size={13} className="text-purple-400 shrink-0" /> {evt.date}</p>
                      <p className="flex items-center gap-1.5"><MapPin size={13} className="text-pink-400 shrink-0" /> {evt.location}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <button 
                    onClick={() => handleJoinEvent(evt.id, evt.title)}
                    className={`w-full min-h-[44px] py-2.5 rounded-2xl font-semibold text-xs transition-all cursor-pointer ${
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
        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Compact AI Insights</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {COMPACT_AI_RECOMMENDATIONS.map((rec) => (
              <div 
                key={rec.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-2 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base shrink-0">{rec.icon}</span>
                  <h4 className="text-xs font-bold font-display text-white">{rec.headline}</h4>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{rec.detail}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ====================================================
          FLOATING MATCH REQUEST NOTIFICATION POPUP (REAL DATA ONLY)
          ==================================================== */}
      <AnimatePresence>
        {showFloatingMatch && unreadNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: 'calc(76px + env(safe-area-inset-bottom))',
              left: '12px',
              right: '12px',
            }}
            className="sm:left-auto sm:right-6 sm:max-w-sm z-40 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#080812]/95 border border-pink-500/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500/20 border-2 border-pink-500 flex items-center justify-center text-pink-400 font-bold text-base">
                  {unreadNotification.notification_type === 'match' ? '🎉' : unreadNotification.notification_type === 'like' ? '❤️' : '🔔'}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white font-display truncate">{unreadNotification.title}</h4>
                <p className="text-[10px] text-white/60 truncate">{unreadNotification.message}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={async () => {
                  try {
                    await ApiClient.markNotificationsRead();
                  } catch (_) {}
                  setShowFloatingMatch(false);
                  if (unreadNotification.notification_type === 'match' || unreadNotification.notification_type === 'chat') {
                    setActiveTab('chats');
                  } else {
                    setActiveTab('deck');
                  }
                }}
                className="px-3 py-1.5 min-h-[36px] rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                View
              </button>
              <button 
                onClick={() => setShowFloatingMatch(false)}
                className="p-2 text-white/40 hover:text-white transition-colors"
                aria-label="Close notification"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          FLOATING AURA AI ASSISTANT BUTTON
          ==================================================== */}
      <button
        onClick={() => navigate('/companion')}
        style={{
          position: 'fixed',
          right: '16px',
          bottom: 'calc(84px + env(safe-area-inset-bottom))',
        }}
        className="z-40 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 border border-white/20 shadow-[0_0_25px_rgba(236,72,153,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
        aria-label="Open AURA AI Assistant"
        title="AURA AI Assistant"
      >
        <Bot size={22} className="text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
      </button>

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
