import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Sparkles, MapPin, Search, X, Bell, 
  ArrowRight, Star, ShieldCheck, User, Sliders, ThumbsDown, Bot, Plus
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../auth/useAuth';
import { ApiClient } from '../api/client';

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
// MAIN HOME DASHBOARD COMPONENT (STITCH REDESIGN)
// ----------------------------------------------------
export default function LiveHomeDashboard() {
  const { setActiveTab, addToast, setSelectedMatchId } = useAppStore();
  const { profile, firebaseUser } = useAuth();
  const navigate = useNavigate();

  // Real Backend Data State
  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const [realProfiles, setRealProfiles] = useState<any[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showFloatingMatch, setShowFloatingMatch] = useState(true);

  // Interaction State
  const [likedMatches, setLikedMatches] = useState<Record<string, boolean>>({});
  const [passedMatches, setPassedMatches] = useState<Record<string, boolean>>({});

  // Real Database Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch real notifications and real discover profiles from backend
  useEffect(() => {
    let isMounted = true;
    async function loadBackendData() {
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

    loadBackendData();
    return () => { isMounted = false; };
  }, [firebaseUser]);

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

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-cycle real activity ticker every 4 seconds
  useEffect(() => {
    if (userNotifications.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % userNotifications.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [userNotifications.length]);

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

  // Dynamic Greeting
  const getGreeting = () => {
    const name = profile?.first_name || profile?.display_name || firebaseUser?.displayName || 'User';
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${name}`;
    if (hour < 18) return `Good Afternoon, ${name}`;
    return `Good Evening, ${name}`;
  };

  // Real Action Handlers
  const handleLike = async (id: string, name: string) => {
    setLikedMatches(prev => ({ ...prev, [id]: true }));
    try {
      await ApiClient.likeUser(id, 'like');
      const refreshedNotifs = await ApiClient.getNotifications();
      if (refreshedNotifs && Array.isArray(refreshedNotifs.notifications)) {
        setUserNotifications(refreshedNotifs.notifications);
      }
    } catch (_) {}
    addToast(`Sent a crush heart to ${name}! ✨`, 'match');
  };

  const handlePass = (id: string, name: string) => {
    setPassedMatches(prev => ({ ...prev, [id]: true }));
    addToast(`Passed on ${name}'s profile`, 'system');
  };

  const userAvatar = profile?.photos?.[0] || (profile as any)?.avatar_url || firebaseUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const unreadNotification = userNotifications.find(n => !n.is_read) || (userNotifications.length > 0 ? userNotifications[0] : null);
  const currentTickerNotif = userNotifications.length > 0 ? userNotifications[tickerIndex % userNotifications.length] : null;

  // Filter out passed profiles
  const visibleProfiles = realProfiles.filter(p => !passedMatches[p.id || p.firebase_uid]);
  const featuredProfile = visibleProfiles[0];
  const secondaryProfiles = visibleProfiles.slice(1, 4);

  return (
    <div className="flex min-h-[100dvh] w-full max-w-full bg-[#fcf9f8] dark:bg-[#04040A] text-slate-900 dark:text-white font-sans relative overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* Background Ambient Glows */}
      <ParticleBg />
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#ff5e62]/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-10%] w-[550px] h-[550px] bg-[#943699]/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Container Viewport */}
      <div className="flex-1 ml-0 md:ml-64 w-full max-w-7xl mx-auto min-w-0 flex flex-col min-h-screen relative z-10">

        {/* ====================================================
            STITCH TOP APP BAR (HEADER)
            ==================================================== */}
        <header className="bg-[#fcf9f8]/80 dark:bg-[#04040A]/80 backdrop-blur-md shadow-[0_4px_20px_rgba(148,54,153,0.04)] border-b border-[#e1bebd]/30 dark:border-white/10 sticky top-0 z-40 flex justify-between items-center px-4 sm:px-6 py-3 w-full">
          <div 
            onClick={() => navigate('/profile')} 
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 cursor-pointer active:scale-95 transition-transform hover:opacity-80 ring-2 ring-[#b32631]/20 shadow-sm"
          >
            <img 
              src={userAvatar} 
              alt="User profile photo" 
              className="w-full h-full object-cover" 
            />
          </div>

          <h1 className="font-headline-md text-2xl font-bold bg-gradient-to-r from-[#b32631] via-[#ff5e62] to-[#943699] bg-clip-text text-transparent tracking-tight">
            Aura
          </h1>

          <button 
            onClick={() => navigate('/settings')}
            className="w-10 h-10 flex items-center justify-center text-[#b32631] dark:text-pink-400 hover:bg-[#b32631]/10 rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Settings & Filters"
          >
            <Sliders size={20} />
          </button>
        </header>

        {/* Main Body Content */}
        <main className="flex-grow pb-24 md:pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 mt-4 sm:mt-6">

          {/* ====================================================
              REAL USER SEARCH BAR
              ==================================================== */}
          <section ref={searchContainerRef} className="relative z-30 w-full">
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="relative flex items-center min-h-[44px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b32631] dark:text-pink-400/80 shrink-0" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.trim().length >= 2) setIsSearchOpen(true); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search real members, interests, locations..."
                  className="w-full min-h-[44px] py-3 pl-10 pr-10 rounded-2xl bg-white/80 dark:bg-[#0A0A14]/90 border border-[#e1bebd]/50 dark:border-white/15 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-[#ff5e62] focus:ring-2 focus:ring-[#ff5e62]/20 backdrop-blur-2xl shadow-md transition-all"
                />
                {searchQuery ? (
                  <button
                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer p-2 flex items-center justify-center"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                ) : (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 dark:text-white/30 hidden sm:inline">
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
                    className="absolute top-full left-0 right-0 mt-2 w-full rounded-2xl bg-white dark:bg-[#0A0A14]/98 border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-2xl text-slate-900 dark:text-white overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/8 z-50"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-white/[0.03] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-white/50">
                      <span>REAL USER SEARCH RESULTS</span>
                      {isSearching && <span className="text-[#b32631] dark:text-pink-400 animate-pulse">Searching DB...</span>}
                    </div>

                    {isSearching && searchResults.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 dark:text-white/60 space-y-2">
                        <div className="w-5 h-5 border-2 border-[#b32631] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p>Searching database profiles...</p>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 dark:text-white/50 space-y-1">
                        <p className="font-semibold text-slate-800 dark:text-white/80">No registered users found</p>
                        <p className="text-[11px]">No profiles match "{searchQuery}"</p>
                      </div>
                    ) : (
                      searchResults.map((user) => {
                        const photo = user.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                        const location = user.location_city || 'Nearby';
                        const occupation = user.occupation || 'Member';

                        return (
                          <div
                            key={user.firebase_uid || user.id}
                            onClick={() => handleSelectUser(user)}
                            className="p-3 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-3 group min-h-[44px]"
                          >
                            <img
                              src={photo}
                              alt={user.display_name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-white/15 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#b32631] dark:group-hover:text-pink-400 transition-colors">
                                  {user.display_name}
                                </h4>
                                <span className="px-2 py-0.5 rounded-full bg-[#ff5e62]/15 border border-[#ff5e62]/30 text-[#b32631] dark:text-pink-300 text-[10px] font-mono font-bold shrink-0">
                                  Verified Member
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-white/60 truncate mt-0.5">
                                {location} • {occupation}
                              </p>
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
              STITCH WELCOME SECTION
              ==================================================== */}
          <section className="mt-2 mb-2">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
              {getGreeting()}
            </h2>
            <p className="font-body-lg text-sm sm:text-base text-slate-600 dark:text-[#594040]/90 text-white/70">
              Here are your daily matches and top picks.
            </p>
          </section>

          {/* ====================================================
              REAL-TIME ACTIVITY TELEMETRY BAR
              ==================================================== */}
          <section className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-black/60 border border-slate-200 dark:border-white/10 backdrop-blur-xl flex items-center justify-between shadow-sm">
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
                  <span className="text-xs md:text-sm text-slate-800 dark:text-white font-medium truncate">
                    {currentTickerNotif.title}: {currentTickerNotif.message}
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] font-mono text-slate-500 dark:text-white/40 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full shrink-0">
                    {formatRelativeTime(currentTickerNotif.created_at)}
                  </span>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <Bell size={16} className="text-[#b32631] dark:text-pink-400 shrink-0" />
                <span className="text-xs md:text-sm text-slate-600 dark:text-white/80 font-medium truncate">
                  No new notifications • Activity will appear here when members interact with you
                </span>
              </div>
            )}

            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold hidden sm:inline shrink-0">
              ● REALTIME TELEMETRY STREAM
            </span>
          </section>

          {/* ====================================================
              STITCH CTA CARD ("Ready to connect?")
              ==================================================== */}
          <section className="mb-6">
            <div 
              onClick={() => { setActiveTab('deck'); navigate('/discover'); }}
              className="relative overflow-hidden rounded-[20px] shadow-[0_8px_30px_rgba(179,38,49,0.15)] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#b32631]/90 via-[#ff5e62]/80 to-[#943699]/90 backdrop-blur-[2px]" />
              <div className="relative z-10 p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-white text-center md:text-left">
                  <h3 className="font-headline-md text-xl sm:text-2xl mb-1 font-semibold">Ready to connect?</h3>
                  <p className="font-body-md text-xs sm:text-sm opacity-95">Discover new people in your area.</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveTab('deck'); navigate('/discover'); }}
                  className="bg-white text-[#b32631] font-label-md text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  Start Swiping
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* ====================================================
              STITCH RECENT MATCHES (HORIZONTAL SCROLL)
              ==================================================== */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="font-headline-md text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Recent Matches</h3>
              <button 
                onClick={() => { setActiveTab('deck'); navigate('/discover'); }}
                className="font-label-md text-xs sm:text-sm text-[#b32631] dark:text-pink-400 hover:underline font-bold transition-colors cursor-pointer"
              >
                View All
              </button>
            </div>

            {visibleProfiles.length > 0 ? (
              <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-3 scrollbar-none snap-x snap-mandatory">
                {visibleProfiles.map((match) => {
                  const avatar = match.images?.[0] || match.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                  const name = match.display_name || match.name || 'Member';
                  const uid = match.firebase_uid || match.id;

                  return (
                    <div 
                      key={uid} 
                      onClick={() => navigate(`/profile/${uid}`)}
                      className="snap-start flex-shrink-0 w-20 flex flex-col items-center gap-1.5 cursor-pointer group"
                    >
                      <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#b32631] to-[#fe95fe] shadow-md">
                        <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white dark:border-[#04040A] bg-slate-100 dark:bg-white/10">
                          <img 
                            src={avatar} 
                            alt={name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#ff5e62] border-2 border-white dark:border-[#04040A] rounded-full shadow-sm" />
                      </div>
                      <span className="font-label-md text-xs text-slate-700 dark:text-white/90 truncate w-full text-center font-medium">
                        {name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}

                {/* More Card */}
                <div 
                  onClick={() => { setActiveTab('deck'); navigate('/discover'); }}
                  className="snap-start flex-shrink-0 w-20 flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#b32631] dark:text-pink-400 border-2 border-dashed border-slate-300 dark:border-white/20 group-hover:border-[#ff5e62] group-hover:bg-[#ff5e62]/10 transition-all shadow-sm">
                    <Plus size={24} />
                  </div>
                  <span className="font-label-md text-xs text-slate-600 dark:text-white/70 truncate w-full text-center font-medium">
                    More
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-1">
                <p className="text-xs font-medium text-slate-600 dark:text-white/70">No other matches yet</p>
                <p className="text-[11px] text-slate-400 dark:text-white/40">New members will appear here automatically</p>
              </div>
            )}
          </section>

          {/* ====================================================
              STITCH TOP PICKS (BENTO GRID)
              ==================================================== */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="font-headline-md text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star size={20} className="text-[#b32631] dark:text-pink-400 fill-[#b32631] dark:fill-pink-400" />
                Top Picks for You
              </h3>
            </div>

            {visibleProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Pick Card 1 (Featured / Large Bento Card) */}
                {featuredProfile && (
                  <Tilt className="col-span-1 sm:col-span-2 row-span-2">
                    <div className="relative rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgba(148,54,153,0.12)] group cursor-pointer aspect-square sm:aspect-[4/3] w-full">
                      <img 
                        src={featuredProfile.images?.[0] || featuredProfile.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800'} 
                        alt={featuredProfile.display_name || featuredProfile.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <div className="flex justify-between items-end">
                          <div>
                            <h4 className="font-headline-lg-mobile text-xl sm:text-2xl text-white font-bold mb-1 flex items-center gap-2">
                              {featuredProfile.display_name || featuredProfile.name}, {featuredProfile.age || 25}
                              <ShieldCheck size={20} className="text-cyan-400 shrink-0" />
                            </h4>
                            
                            <p className="text-xs text-white/80 mb-2">
                              {featuredProfile.occupation || 'Member'} • {featuredProfile.location_city || 'Nearby'}
                            </p>

                            {Array.isArray(featuredProfile.interests) && featuredProfile.interests.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {featuredProfile.interests.slice(0, 3).map((interest: string, idx: number) => (
                                  <span key={idx} className="bg-black/40 backdrop-blur-md text-white font-label-md text-[11px] px-3 py-1 rounded-full border border-white/20">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(featuredProfile.firebase_uid || featuredProfile.id, featuredProfile.display_name || featuredProfile.name);
                            }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0 ${
                              likedMatches[featuredProfile.firebase_uid || featuredProfile.id]
                                ? 'bg-emerald-600'
                                : 'bg-gradient-to-r from-[#b32631] to-[#fe95fe]'
                            }`}
                            title="Like Profile"
                          >
                            <Heart size={22} fill={likedMatches[featuredProfile.firebase_uid || featuredProfile.id] ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Tilt>
                )}

                {/* Secondary Bento Cards */}
                {secondaryProfiles.map((item) => {
                  const avatar = item.images?.[0] || item.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600';
                  const name = item.display_name || item.name || 'Member';
                  const uid = item.firebase_uid || item.id;

                  return (
                    <div 
                      key={uid}
                      onClick={() => navigate(`/profile/${uid}`)}
                      className="relative rounded-[20px] overflow-hidden shadow-md group cursor-pointer aspect-[3/4] sm:aspect-auto sm:h-full min-h-[220px]"
                    >
                      <img 
                        src={avatar} 
                        alt={name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full flex justify-between items-end">
                        <div>
                          <h4 className="font-headline-md text-white font-bold text-base sm:text-lg">{name}, {item.age || 24}</h4>
                          <p className="font-caption text-xs text-white/90 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} className="text-[#ff5e62]" /> {item.location_city || 'Nearby'}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(uid, name);
                          }}
                          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                        >
                          <Heart size={16} fill={likedMatches[uid] ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-2 backdrop-blur-2xl">
                <Sparkles className="mx-auto text-[#b32631] dark:text-pink-400" size={32} />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">No Top Picks Available Yet</h3>
                <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm mx-auto">
                  As new members join, personalized top picks will be generated automatically.
                </p>
              </div>
            )}
          </section>

          {/* ====================================================
              REAL NOTIFICATIONS LIST SECTION
              ==================================================== */}
          <section className="mb-8 space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-500 dark:text-white/60 font-semibold tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#b32631] dark:text-pink-400" />
              Real Notifications
            </h3>

            {userNotifications.length > 0 ? (
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-2xl space-y-2 shadow-sm">
                {userNotifications.slice(0, 5).map((notif) => (
                  <div key={notif.id} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/8 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#ff5e62]/15 border border-[#ff5e62]/30 flex items-center justify-center text-[#b32631] dark:text-pink-400 shrink-0 font-bold">
                        {notif.notification_type === 'match' ? '🎉' : notif.notification_type === 'like' ? '❤️' : '🔔'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate text-xs">{notif.title}</p>
                        <p className="text-slate-500 dark:text-white/60 truncate text-[11px]">{notif.message}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-white/40 shrink-0">{formatRelativeTime(notif.created_at)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-white/80">No new notifications</p>
                <p className="text-[11px] text-slate-500 dark:text-white/40">Interactions from other members will be displayed here.</p>
              </div>
            )}
          </section>

        </main>

        {/* ====================================================
            FLOATING REAL MATCH POPUP
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
              className="sm:left-auto sm:right-6 sm:max-w-sm z-40 p-3.5 rounded-2xl bg-slate-900/95 dark:bg-[#080812]/95 border border-[#ff5e62]/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center justify-between gap-3 text-white"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-[#ff5e62]/20 border border-[#ff5e62] flex items-center justify-center text-pink-400 font-bold text-base shrink-0">
                  {unreadNotification.notification_type === 'match' ? '🎉' : unreadNotification.notification_type === 'like' ? '❤️' : '🔔'}
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
                      navigate('/chat');
                    } else {
                      setActiveTab('deck');
                      navigate('/discover');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#b32631] to-[#fe95fe] text-white font-bold text-xs shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                >
                  View
                </button>
                <button 
                  onClick={() => setShowFloatingMatch(false)}
                  className="p-1.5 text-white/40 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close notification"
                >
                  <X size={15} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====================================================
            FLOATING AI ASSISTANT BUTTON
            ==================================================== */}
        <button
          onClick={() => navigate('/companion')}
          style={{
            position: 'fixed',
            right: '16px',
            bottom: 'calc(84px + env(safe-area-inset-bottom))',
          }}
          className="z-40 w-12 h-12 rounded-full bg-gradient-to-r from-[#b32631] via-[#ff5e62] to-[#943699] border border-white/20 shadow-[0_0_25px_rgba(236,72,153,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
          aria-label="Open AURA AI Assistant"
          title="AURA AI Assistant"
        >
          <Bot size={22} className="text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
        </button>

        {/* ====================================================
            STITCH BOTTOM NAVIGATION BAR (MOBILE)
            ==================================================== */}
        <nav className="bg-[#fcf9f8]/90 dark:bg-[#04040A]/90 backdrop-blur-xl border-t border-[#e1bebd]/30 dark:border-white/10 shadow-[0_-8px_30px_rgba(148,54,153,0.06)] fixed bottom-0 left-0 w-full z-50 md:hidden flex justify-around items-center py-2 px-4 pb-safe">
          {/* Discover (Active) */}
          <button 
            onClick={() => { setActiveTab('deck'); navigate('/discover'); }}
            className="flex flex-col items-center justify-center text-[#b32631] dark:text-pink-400 bg-[#ff5e62]/15 rounded-2xl px-5 py-1.5 transition-colors active:scale-95 duration-200 cursor-pointer"
          >
            <Sparkles size={20} className="mb-0.5" />
            <span className="font-label-md text-[10px] font-bold">Discover</span>
          </button>
          
          {/* Messages */}
          <button 
            onClick={() => { setActiveTab('chats'); navigate('/chat'); }}
            className="flex flex-col items-center justify-center text-slate-500 dark:text-white/60 hover:text-[#b32631] dark:hover:text-pink-400 transition-colors active:scale-95 duration-200 px-5 py-1.5 cursor-pointer"
          >
            <MessageCircle size={20} className="mb-0.5" />
            <span className="font-label-md text-[10px] font-medium">Messages</span>
          </button>
          
          {/* Profile */}
          <button 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center justify-center text-slate-500 dark:text-white/60 hover:text-[#b32631] dark:hover:text-pink-400 transition-colors active:scale-95 duration-200 px-5 py-1.5 cursor-pointer"
          >
            <User size={20} className="mb-0.5" />
            <span className="font-label-md text-[10px] font-medium">Profile</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
