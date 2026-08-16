import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Mic, Sparkles, Heart, MessageCircle, Eye, ShieldCheck, MapPin, 
  Flame, Calendar, Music, Coffee, Film, Compass, Users, Volume2, Pause, 
  Play, X, Star, ArrowUpRight, Filter, ChevronRight, Zap, Bookmark, 
  Award, Globe, CheckCircle2, User
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';
import { ApiClient } from '../api/client';
import {
  CATEGORIES,
  DISCOVER_FEED,
  NEARBY_MAP_PINS,
  AI_SUGGESTIONS
} from '../data/discoverData';
import type {
  ProfileDiscoverCard,
  ReelDiscoverCard,
  PlaceEventDiscoverCard,
  CommunityDiscoverCard,
  AIRecommendationDiscoverCard,
  MapPin as MapPinType
} from '../data/discoverData';

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
// MAIN DISCOVER PAGE COMPONENT
// ----------------------------------------------------
export default function SwipeDeck() {
  const { setActiveTab, setSelectedMatchId, addToast } = useAppStore();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');

  // Quick Preview State
  const [previewProfile, setPreviewProfile] = useState<ProfileDiscoverCard | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Active Map Pin Selection
  const [selectedMapPin, setSelectedMapPin] = useState<MapPinType | null>(NEARBY_MAP_PINS[0]);

  // Social Interaction States
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [activeReelPlaying, setActiveReelPlaying] = useState<string | null>(null);
  const [realProfilesFeed, setRealProfilesFeed] = useState<any[]>([]);

  // Load real user profiles from database for discovery
  useEffect(() => {
    let isMounted = true;
    ApiClient.getDiscoverProfiles().then(res => {
      if (res?.profiles && res.profiles.length > 0 && isMounted) {
        const formattedProfiles = res.profiles.map((p: any) => ({
          id: p.id,
          type: 'profile' as const,
          category: 'profile',
          name: p.name,
          age: p.age,
          occupation: p.occupation,
          distance: p.location || 'Nearby',
          image: p.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          compatibility: p.compatibilityScore || 94,
          verified: true,
          hasVoiceIntro: false,
          voiceDuration: '0:15',
          introText: p.bio || 'Hello! Looking for meaningful connections.',
          interests: p.interests || ['Travel', 'Music']
        }));
        setRealProfilesFeed(formattedProfiles);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleLikeItem = async (itemId: string, name: string) => {
    setLikedMap(prev => ({ ...prev, [itemId]: true }));
    const res = await ApiClient.recordSwipe(itemId, 'like');
    if (res?.isMatch) {
      addToast(`🎉 IT'S A MATCH with ${name}! You can now chat!`, 'match');
      if (res?.match?.id) {
        setSelectedMatchId(res.match.id);
      }
    } else {
      addToast(`Sent a like to ${name}! ✨`, 'like');
    }
  };

  const [dbSearchResults, setDbSearchResults] = useState<any[] | null>(null);
  const [isSearchingDb, setIsSearchingDb] = useState(false);

  // Search real registered profiles from Supabase database when user types in search bar
  useEffect(() => {
    let isMounted = true;
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setDbSearchResults(null);
      setIsSearchingDb(false);
      return;
    }

    setIsSearchingDb(true);
    const timer = setTimeout(() => {
      ApiClient.searchProfiles(trimmed).then(res => {
        if (!isMounted) return;
        if (res?.profiles) {
          const formatted = res.profiles.map((p: any) => ({
            id: p.id || p.firebase_uid,
            type: 'profile' as const,
            category: 'profile',
            name: p.name || p.display_name || p.first_name || 'Member',
            age: p.age || 24,
            occupation: p.occupation || 'Member',
            distance: p.location || p.distance || 'Nearby',
            image: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            compatibility: p.compatibility || p.compatibilityScore || 94,
            verified: true,
            hasVoiceIntro: false,
            voiceDuration: '0:15',
            introText: p.introText || p.bio || 'Hello! Looking for meaningful connections.',
            interests: p.interests || ['Travel', 'Music']
          }));
          setDbSearchResults(formatted);
        } else {
          setDbSearchResults([]);
        }
        setIsSearchingDb(false);
      });
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Combine real database profiles with static feed items when not searching
  // When active search query exists: return DB search results ONLY (no static mock cards)
  const filteredFeed = searchQuery.trim()
    ? (dbSearchResults || []).filter(item => activeCategory === 'all' || item.category === activeCategory)
    : [...realProfilesFeed, ...DISCOVER_FEED].filter(item => activeCategory === 'all' || item.category === activeCategory);

  // Voice Search Simulation
  const toggleVoiceSearch = () => {
    setIsVoiceListening(true);
    addToast('🎙️ AI Listening... Say "Show coffee lovers in San Francisco"', 'system');
    setTimeout(() => {
      setIsVoiceListening(false);
      setSearchQuery('Coffee');
      setActiveCategory('coffee');
      addToast('Filtered feed by Voice Query: Coffee', 'system');
    }, 3000);
  };

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptInput.trim()) return;
    setSearchQuery(aiPromptInput);
    setShowAiModal(false);
    addToast(`🤖 AI Prompt Synced: "${aiPromptInput}"`, 'system');
    setAiPromptInput('');
  };



  const toggleVoiceNote = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      addToast('Playing 28s Voice Intro preview...', 'chat');
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full max-w-full bg-[#04040A] text-white font-sans relative overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* Dynamic Ambient Background */}
      <ParticleBg />
      
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-10%] w-[500px] h-[500px] bg-pink-900/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[550px] h-[550px] bg-cyan-900/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport Content */}
      <main className="flex-1 ml-0 md:ml-64 w-full max-w-7xl mx-auto min-w-0 p-3.5 sm:p-4 md:p-8 pb-28 md:pb-16 space-y-8 md:space-y-12 relative z-10 overflow-x-hidden">
        
        {/* ====================================================
            SECTION 1: HERO SEARCH BAR WITH VOICE & AI PROMPTS
            ==================================================== */}
        <section className="relative rounded-3xl p-4 sm:p-6 md:p-10 bg-gradient-to-br from-white/[0.06] via-purple-950/20 to-black/80 border border-white/12 backdrop-blur-2xl shadow-2xl space-y-4 sm:space-y-6 overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[10px] sm:text-xs font-mono font-bold uppercase mb-2 max-w-full truncate">
                <Compass size={14} className="animate-spin shrink-0" style={{ animationDuration: '8s' }} />
                <span className="truncate">Spatial Social Discovery Feed</span>
              </div>
              <h1 className="text-[17px] min-[360px]:text-[19px] min-[390px]:text-[21px] sm:text-3xl md:text-5xl font-display font-black text-white tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                Explore The Aura Universe
              </h1>
              <p className="text-xs md:text-sm text-white/60 mt-1 font-light">
                Discover people, 10-second reels, coffee spots, music events, and active communities nearby.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-right backdrop-blur-md">
                <span className="text-xs font-mono text-emerald-400 font-bold block">🟢 1,420 Active</span>
                <span className="text-[10px] text-white/50">San Francisco & Bay Area</span>
              </div>
            </div>
          </div>

          {/* LARGE SEARCH BAR (SINGLE HORIZONTAL LINE ON ALL MOBILE SCREEN WIDTHS) */}
          <div className="relative flex items-center gap-1.5 sm:gap-2 w-full max-w-full overflow-hidden">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-white/40 shrink-0" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search People, Interests, Cities, Coffee, Travel..." 
                className="w-full py-3 pl-10 pr-8 sm:py-4 sm:pl-12 sm:pr-10 rounded-2xl bg-black/60 border border-white/15 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-pink-500/80 backdrop-blur-xl shadow-inner transition-all truncate whitespace-nowrap"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Voice Search Button */}
            <button 
              onClick={toggleVoiceSearch}
              className={`p-3 sm:p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer shadow-lg flex items-center gap-2 shrink-0 ${
                isVoiceListening 
                  ? 'bg-pink-600 border-pink-400 text-white animate-pulse' 
                  : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
              title="Voice Search Prompt"
            >
              <Mic size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs font-semibold hidden sm:inline">Voice</span>
            </button>

            {/* AI Prompt Search Button */}
            <button 
              onClick={() => setShowAiModal(true)}
              className="p-3 sm:px-4 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2 shrink-0"
              title="AI Match Query"
            >
              <Sparkles size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">AI Match Query</span>
            </button>
          </div>

          {/* Quick Search Tag Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span className="font-mono text-[10px] uppercase tracking-wider text-pink-400 font-bold">Trending Tags:</span>
            {['Coffee Lovers', '35mm Film', 'Spatial Audio', 'Sourdough', 'Jazz Piano', 'Yosemite Climb'].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 2: TRENDING ANIMATED CATEGORY CHIPS
            ==================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-white/60 font-semibold tracking-wider flex items-center gap-2">
              <Filter size={14} className="text-pink-400" />
              Explore Categories
            </h3>
            {activeCategory !== 'all' && (
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-xs text-pink-400 hover:text-pink-300 font-mono underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 snap-start border ${
                    isActive 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105' 
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white/80'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-mono text-white/50 bg-black/30 px-1.5 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            SECTION 3: INFINITE DISCOVER FEED (PINTEREST / REELS GRID)
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Social Discovery Feed</h2>
              <p className="text-xs text-white/50">Mixed feed of profiles, 10s reels, coffee spots, and AI insights</p>
            </div>
            <span className="text-xs font-mono text-white/40">Showing {filteredFeed.length} items</span>
          </div>

          {filteredFeed.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400">
                <Users size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No people found</h3>
                <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
                  {searchQuery.trim() 
                    ? `No registered members found matching "${searchQuery}". Try searching by name, interest, occupation, or location.`
                    : 'No items found matching the selected category filter.'}
                </p>
              </div>
              {searchQuery.trim() && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredFeed.map((item, index) => {
              
              // ----------------------------------------------
              // ITEM TYPE 1: PROFILE CARD
              // ----------------------------------------------
              if (item.type === 'profile') {
                return (
                  <Tilt key={item.id} className="break-inside-avoid">
                    <div className="rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/12 overflow-hidden backdrop-blur-2xl p-5 shadow-2xl hover:border-pink-500/40 transition-all group">
                      
                      {/* Top Portrait Image */}
                      <div className="relative h-72 rounded-2xl overflow-hidden mb-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                            {item.compatibility}% Match
                          </span>
                          {item.verified && (
                            <span className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-cyan-400">
                              <ShieldCheck size={14} />
                            </span>
                          )}
                        </div>

                        {/* Voice Intro Pill */}
                        {item.hasVoiceIntro && (
                          <button 
                            onClick={() => toggleVoiceNote(item.id)}
                            className="absolute top-3 right-3 px-3 py-1 rounded-full bg-pink-500/80 hover:bg-pink-500 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
                          >
                            {playingVoiceId === item.id ? <Pause size={12} /> : <Volume2 size={12} />}
                            Voice Intro ({item.voiceDuration})
                          </button>
                        )}

                        {/* Bottom Name & Location Overlay */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-xl font-bold font-display text-white">{item.name}, {item.age}</h3>
                          {item.userHandle && (
                            <p className="text-xs font-mono font-bold text-pink-400">{item.userHandle}</p>
                          )}
                          <p className="text-xs text-white/70 truncate">{item.occupation}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">{item.distance}</p>
                        </div>
                      </div>

                      {/* Bio & Shared Communities */}
                      <p className="text-xs text-white/80 line-clamp-2 mb-3 leading-relaxed">
                        "{item.introText}"
                      </p>

                      {/* Interest Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.interests.map((interest: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/8 text-[10px] font-medium text-white/70">
                            #{interest}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        <button 
                          onClick={() => handleLikeItem(item.id, item.name)}
                          className={`flex-1 py-2.5 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            likedMap[item.id] 
                              ? 'bg-pink-600 text-white shadow-pink-600/40' 
                              : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                          }`}
                        >
                          <Heart size={14} fill={likedMap[item.id] ? "currentColor" : "none"} />
                          {likedMap[item.id] ? 'Liked!' : 'Like'}
                        </button>

                        <button 
                          onClick={() => {
                            setSelectedMatchId(item.id);
                            setActiveTab('chats');
                          }}
                          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Message"
                        >
                          <MessageCircle size={16} />
                        </button>

                        <button 
                          onClick={() => setPreviewProfile(item)}
                          className="px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                      </div>

                    </div>
                  </Tilt>
                );
              }

              // ----------------------------------------------
              // ITEM TYPE 2: TIKTOK-STYLE REEL CARD
              // ----------------------------------------------
              if (item.type === 'reel') {
                const isPlaying = activeReelPlaying === item.id;
                return (
                  <motion.div 
                    key={item.id} 
                    whileHover={{ y: -6 }}
                    className="break-inside-avoid rounded-3xl bg-black border border-pink-500/30 overflow-hidden relative group shadow-2xl h-[420px] flex flex-col justify-between"
                  >
                    <img 
                      src={item.thumbnail} 
                      alt={item.creatorName} 
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'group-hover:scale-105'}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40" />

                    {/* Top Creator Info */}
                    <div className="relative z-10 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={item.creatorAvatar} 
                          alt={item.creatorName} 
                          className="w-9 h-9 rounded-full object-cover border-2 border-pink-500" 
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white font-display">{item.creatorName}, {item.creatorAge}</h4>
                          <p className="text-[10px] text-white/60">{item.creatorOccupation}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-pink-500/20 backdrop-blur-md text-[10px] font-mono font-bold text-pink-300 border border-pink-500/40">
                        10s Reel
                      </span>
                    </div>

                    {/* Play Overlay Button */}
                    <div className="relative z-10 flex items-center justify-center">
                      <button 
                        onClick={() => {
                          setActiveReelPlaying(isPlaying ? null : item.id);
                          if (!isPlaying) addToast(`Playing 10s Reel from ${item.creatorName}`, 'system');
                        }}
                        className="w-14 h-14 rounded-full bg-pink-500/80 hover:bg-pink-500 backdrop-blur-md flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                      </button>
                    </div>

                    {/* Bottom Caption */}
                    <div className="relative z-10 p-4 space-y-3">
                      <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs text-white/70">
                        <span className="flex items-center gap-1 font-mono text-pink-400">
                          <Heart size={14} className="fill-pink-400" /> {item.likesCount} likes
                        </span>
                        <button 
                          onClick={() => {
                            setSelectedMatchId(item.id);
                            setActiveTab('chats');
                          }}
                          className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
                        >
                          Reply to Reel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // ----------------------------------------------
              // ITEM TYPE 3: EXPERIENCE / PLACE CARD
              // ----------------------------------------------
              if (item.type === 'experience') {
                return (
                  <motion.div 
                    key={item.id} 
                    whileHover={{ y: -6 }}
                    className="break-inside-avoid rounded-3xl bg-white/[0.04] border border-white/12 overflow-hidden backdrop-blur-2xl p-5 shadow-xl group hover:border-purple-500/40 transition-all"
                  >
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-purple-300 border border-purple-500/30">
                        {item.categoryName}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-display mb-1">{item.title}</h4>
                    <p className="text-xs text-white/60 flex items-center gap-1 mb-3">
                      <MapPin size={13} className="text-pink-400" />
                      {item.location}
                    </p>

                    <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 mb-4">
                      ✨ {item.aiReason}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex -space-x-2">
                        {item.attendeesAvatars.map((av: string, idx: number) => (
                          <img key={idx} src={av} alt="Attendee" className="w-6 h-6 rounded-full border border-black" />
                        ))}
                      </div>
                      <button 
                        onClick={() => addToast(`Saved Experience: ${item.title}`, 'system')}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors"
                      >
                        Plan Date Here
                      </button>
                    </div>
                  </motion.div>
                );
              }

              // ----------------------------------------------
              // ITEM TYPE 4: COMMUNITY DISCORD CARD
              // ----------------------------------------------
              if (item.type === 'community') {
                return (
                  <motion.div 
                    key={item.id}
                    whileHover={{ y: -6 }}
                    className="break-inside-avoid rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/80 border border-indigo-500/30 overflow-hidden backdrop-blur-2xl p-5 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Discord Hub</span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {item.onlineCount} Online
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white font-display mb-2">{item.name}</h4>
                    <p className="text-xs text-white/70 line-clamp-2 mb-4">
                      💬 "{item.recentDiscussion}"
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs text-white/50 font-mono">{item.membersCount}</span>
                      <button 
                        onClick={() => setActiveTab('communities')}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                      >
                        Join Hub
                      </button>
                    </div>
                  </motion.div>
                );
              }

              // ----------------------------------------------
              // ITEM TYPE 5: EVERY 5th CARD: AURA AI RECOMMENDATION
              // ----------------------------------------------
              if (item.type === 'ai_recommendation') {
                return (
                  <motion.div 
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="break-inside-avoid rounded-3xl bg-gradient-to-br from-pink-900/40 via-purple-900/30 to-black/90 border-2 border-pink-500/50 p-6 backdrop-blur-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)] space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="text-xs font-bold font-mono text-pink-300 uppercase tracking-wider">
                        AURA AI SMART RECOMMENDATION
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-white">{item.headline}</h3>
                    <p className="text-xs text-white/80 leading-relaxed">{item.subtext}</p>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex -space-x-2">
                        {item.matchAvatars.map((av: string, idx: number) => (
                          <img key={idx} src={av} alt="Match" className="w-8 h-8 rounded-full border-2 border-pink-500 object-cover" />
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          addToast(item.actionLabel, 'system');
                          setActiveTab('planner');
                        }}
                        className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs transition-all shadow-lg hover:brightness-110"
                      >
                        {item.actionLabel} →
                      </button>
                    </div>
                  </motion.div>
                );
              }

              return null;
            })}
          </div>
        )}
        </section>

        {/* ====================================================
            SECTION 4: NEARBY EXPERIENCES INTERACTIVE CITY MAP
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Globe size={20} className="text-cyan-400" />
                <h2 className="text-2xl font-display font-bold text-white">Nearby Hotspots & Live Pins</h2>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Interactive San Francisco city canvas with live matching members</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">San Francisco, CA</span>
          </div>

          {/* Interactive Map Visual Box */}
          <div className="relative h-96 rounded-3xl overflow-hidden border border-white/15 bg-[#0A0B14] shadow-2xl p-4 flex flex-col justify-between">
            {/* Map Grid Pattern Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

            {/* Top Map Status */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Live Map Radar Active
              </span>
            </div>

            {/* Interactive Pulse Pins */}
            <div className="absolute inset-0 p-8">
              {NEARBY_MAP_PINS.map((pin) => (
                <motion.div
                  key={pin.id}
                  style={{ top: `${pin.latPct}%`, left: `${pin.lngPct}%` }}
                  whileHover={{ scale: 1.25 }}
                  onClick={() => setSelectedMapPin(pin)}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group"
                >
                  <div className="relative">
                    <span className="w-6 h-6 rounded-full bg-pink-500/40 animate-ping absolute inset-0" />
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.8)] border border-white flex items-center justify-center">
                      <img src={pin.image} alt={pin.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Selected Map Pin Drawer */}
            {selectedMapPin && (
              <div className="relative z-10 p-4 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={selectedMapPin.image} alt={selectedMapPin.name} className="w-12 h-12 rounded-xl object-cover border border-cyan-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">{selectedMapPin.name}</h4>
                    <p className="text-xs text-white/60">{selectedMapPin.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {selectedMapPin.matchAvatars.map((av, i) => (
                      <img key={i} src={av} alt="Match" className="w-7 h-7 rounded-full border border-black" />
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('planner')}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    View Spot ({selectedMapPin.liveMatchesCount} Nearby)
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* ====================================================
          QUICK PREVIEW DRAWER (SLIDE-OUT PROFILE INSPECTOR)
          ==================================================== */}
      <AnimatePresence>
        {previewProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex justify-end"
            onClick={() => setPreviewProfile(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg h-full bg-[#080812] border-l border-white/15 p-6 overflow-y-auto space-y-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setPreviewProfile(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Header Image */}
              <div className="relative h-80 rounded-3xl overflow-hidden mt-4">
                <img src={previewProfile.image} alt={previewProfile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-3xl font-bold font-display text-white">{previewProfile.name}, {previewProfile.age}</h2>
                  <p className="text-sm text-white/80">{previewProfile.occupation}</p>
                  <p className="text-xs text-pink-400 font-mono mt-0.5">{previewProfile.distance}</p>
                </div>
              </div>

              {/* Voice Intro Player */}
              {previewProfile.hasVoiceIntro && (
                <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleVoiceNote(previewProfile.id)}
                      className="p-3 rounded-full bg-pink-500 text-white shadow-lg cursor-pointer"
                    >
                      {playingVoiceId === previewProfile.id ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-pink-300 font-mono uppercase">Voice Intro Note</h4>
                      <p className="text-[11px] text-white/70">{previewProfile.voiceDuration} duration</p>
                    </div>
                  </div>
                  <Volume2 size={20} className="text-pink-400" />
                </div>
              )}

              {/* Bio & Details */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase text-white/40 font-bold">About {previewProfile.name}</h3>
                <p className="text-sm text-white/90 leading-relaxed font-light">"{previewProfile.introText}"</p>
              </div>

              {/* Additional Photos Gallery */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase text-white/40 font-bold">Photo Highlights</h3>
                <div className="grid grid-cols-2 gap-3">
                  {previewProfile.additionalPhotos.map((ph, idx) => (
                    <img key={idx} src={ph} alt="Gallery" className="w-full h-36 rounded-2xl object-cover border border-white/10" />
                  ))}
                </div>
              </div>

              {/* Favorites & Lifestyle */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs text-white/80">
                <p>🎵 <span className="font-bold text-white">Favorite Music:</span> {previewProfile.favoriteMusic}</p>
                <p>📍 <span className="font-bold text-white">Favorite Spot:</span> {previewProfile.favoritePlace}</p>
                <p>🐶 <span className="font-bold text-white">Pets:</span> {previewProfile.pets}</p>
                <p>🌍 <span className="font-bold text-white">Travel:</span> {previewProfile.travelHistory.join(', ')}</p>
              </div>

              {/* Bottom Quick Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-[#080812] py-2">
                <button 
                  onClick={() => {
                    handleLikeItem(previewProfile.id, previewProfile.name);
                    setPreviewProfile(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Heart size={16} fill="currentColor" />
                  Like Profile
                </button>
                <button 
                  onClick={() => {
                    setSelectedMatchId(previewProfile.id);
                    setActiveTab('chats');
                    setPreviewProfile(null);
                  }}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          AI MATCH QUERY MODAL
          ==================================================== */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setShowAiModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-gradient-to-br from-purple-950/80 via-black to-black border border-purple-500/40 p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
                  <h3 className="text-lg font-bold font-display text-white">Aura AI Natural Language Search</h3>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-white/40 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAiSearchSubmit} className="space-y-4">
                <p className="text-xs text-white/70 leading-relaxed">
                  Describe your ideal match, vibe, interests, or location in natural language:
                </p>
                <textarea 
                  rows={4}
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  placeholder="e.g. Find creative architects who love vinyl record shops, dark roast coffee, and live jazz in San Francisco..."
                  className="w-full p-4 rounded-2xl bg-black/60 border border-purple-500/30 text-xs text-white placeholder-white/40 focus:outline-none focus:border-pink-500"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAiModal(false)}
                    className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs text-white/80"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg cursor-pointer"
                  >
                    Run AI Natural Language Search
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
