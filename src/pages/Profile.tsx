import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Video, Volume2, Calendar, Gift, Sparkles, 
  MapPin, Briefcase, GraduationCap, Globe, ShieldCheck, Clock, CheckCircle2, 
  Star, Coffee, Film, BookOpen, Music, Camera, Utensils, Flame, X, Play, 
  Pause, ChevronRight, Award, Compass, Eye, Users, ChevronDown, ChevronUp, Share2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';
import { PROFILE_DATA } from '../data/profileData';
import type { StoryHighlight, GalleryMedia, SpotifyTrack, PersonalitySphere } from '../data/profileData';

export default function Profile() {
  const { setActiveTab, setSelectedMatchId, addToast } = useAppStore();

  // Active States
  const [activeStory, setActiveStory] = useState<StoryHighlight | null>(null);
  const [selectedGalleryMedia, setSelectedGalleryMedia] = useState<GalleryMedia | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState(false);
  const [expandedSphere, setExpandedSphere] = useState<PersonalitySphere | null>(PROFILE_DATA.personalitySpheres[0]);
  const [isLiked, setIsLiked] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showAuraAskModal, setShowAuraAskModal] = useState(false);
  const [expandedAboutCard, setExpandedAboutCard] = useState<string | null>('goals');

  // Action Handlers
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      addToast(`Sent a secret crush heart to ${PROFILE_DATA.name}! ✨`, 'match');
    }
  };

  const handleStartChat = () => {
    setSelectedMatchId('sp1');
    setActiveTab('chats');
  };

  const handleVoiceIntroToggle = () => {
    setPlayingVoice(!playingVoice);
    if (!playingVoice) {
      addToast(`Playing ${PROFILE_DATA.name}'s 28s Voice Intro & Violin note...`, 'chat');
    }
  };

  const toggleTrackPlay = (trackId: string, trackTitle: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
      addToast(`Playing Spotify Preview: ${trackTitle}`, 'system');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#04040A] text-white font-sans relative overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* Background Ambient Particles & Glows */}
      <ParticleBg />
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[30%] right-[-10%] w-[550px] h-[550px] bg-pink-900/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] left-[20%] w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Viewport Content */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-36 md:pb-24 max-w-7xl mx-auto space-y-12 relative z-10 overflow-x-hidden">
        
        {/* ====================================================
            SECTION 1: HERO COVER & FLOATING PROFILE CARD
            ==================================================== */}
        <section className="relative rounded-3xl overflow-hidden border border-white/12 bg-gradient-to-b from-white/[0.06] to-black/80 backdrop-blur-2xl shadow-2xl">
          {/* Full-bleed Cover Media */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img 
              src={PROFILE_DATA.coverMedia} 
              alt="Cover Media" 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04040A] via-black/30 to-black/40" />

            {/* Top Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {PROFILE_DATA.lastActive}
              </span>
            </div>
          </div>

          {/* Overlapping Avatar & Floating Details */}
          <div className="px-6 pb-8 pt-0 relative -mt-24 sm:-mt-32 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              {/* Animated Glowing Profile Picture */}
              <div className="relative group">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_50px_rgba(236,72,153,0.5)] animate-pulse" style={{ animationDuration: '4s' }}>
                  <div className="w-full h-full rounded-[22px] bg-black overflow-hidden relative">
                    <img 
                      src={PROFILE_DATA.avatar} 
                      alt={PROFILE_DATA.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </div>
                {PROFILE_DATA.isOnline && (
                  <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#04040A] shadow-xl" title="Live Online" />
                )}
              </div>

              {/* Name, Occupation & Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
                    {PROFILE_DATA.name}, {PROFILE_DATA.age}
                  </h1>
                  {PROFILE_DATA.isVerified && (
                    <span className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40" title="Identity Verified">
                      <ShieldCheck size={22} />
                    </span>
                  )}
                  {PROFILE_DATA.isAiVerified && (
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-1">
                      <Sparkles size={13} /> AI Digital Twin Verified
                    </span>
                  )}
                </div>

                <p className="text-sm md:text-base text-pink-300 font-medium flex items-center justify-center md:justify-start gap-2">
                  <Briefcase size={16} />
                  {PROFILE_DATA.occupation}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs text-white/70 font-mono">
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-pink-400" /> {PROFILE_DATA.location} • {PROFILE_DATA.distance}</span>
                  <span className="flex items-center gap-1"><GraduationCap size={13} className="text-purple-400" /> {PROFILE_DATA.education}</span>
                </div>
              </div>
            </div>

            {/* Relationship Goal Badge */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/12 backdrop-blur-xl text-center md:text-right max-w-xs space-y-1">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">Relationship Intention</span>
              <p className="text-xs font-semibold text-white">{PROFILE_DATA.relationshipIntention}</p>
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 2: INSTAGRAM-STYLE STORY HIGHLIGHTS
            ==================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-white/60 font-semibold tracking-wider flex items-center gap-2">
              <Flame size={14} className="text-pink-400" />
              Story Highlights
            </h3>
            <span className="text-xs text-white/40 font-mono">Tap to View Highlight Reels</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
            {PROFILE_DATA.highlights.map((hl) => (
              <motion.div
                key={hl.id}
                whileHover={{ scale: 1.08, y: -4 }}
                onClick={() => setActiveStory(hl)}
                className="flex flex-col items-center gap-2 cursor-pointer shrink-0 snap-start group"
              >
                <div className="p-[3px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-transform">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 bg-black relative">
                    <img src={hl.coverImage} alt={hl.title} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute inset-0 bg-black/30 flex items-center justify-center text-lg">{hl.icon}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-white/90 font-display">{hl.title}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 3: HUMAN AI INSIGHTS & SYNERGY OVERLAP
            ==================================================== */}
        <section className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-purple-950/40 via-pink-950/20 to-black/80 border border-purple-500/30 backdrop-blur-2xl shadow-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
            <h3 className="text-lg font-bold font-display text-white">Aura AI Human Story Insights</h3>
          </div>

          <p className="text-xs text-white/70 leading-relaxed">
            Instead of arbitrary percentage charts, here is how your lifestyles and passions naturally align:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROFILE_DATA.aiInsights.map((insight, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-medium text-purple-200 backdrop-blur-md flex items-start gap-2"
              >
                {insight}
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 4: ABOUT ME & EXPANDABLE STORY CARDS
            ==================================================== */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-white">About {PROFILE_DATA.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quote & Life Goals Card */}
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/12 backdrop-blur-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-pink-400 uppercase">FAVORITE QUOTE & LIFE GOALS</span>
                <BookOpen size={16} className="text-pink-400" />
              </div>
              <blockquote className="text-sm italic text-white/90 font-serif leading-relaxed">
                {PROFILE_DATA.quote}
              </blockquote>
              <div>
                <span className="text-[11px] font-mono text-white/40 block uppercase mb-1">Core Life Goal</span>
                <p className="text-xs text-white/80 leading-relaxed">{PROFILE_DATA.lifeGoals}</p>
              </div>
            </div>

            {/* Weekend Routine & Love Language */}
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/12 backdrop-blur-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">WEEKEND ROUTINE & LOVE LANGUAGE</span>
                <Coffee size={16} className="text-purple-400" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-white/40 block uppercase mb-1">Perfect Saturday</span>
                <p className="text-xs text-white/80 leading-relaxed">{PROFILE_DATA.weekendRoutine}</p>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">Love Language:</span>
                <span className="font-bold text-pink-300 font-mono">{PROFILE_DATA.loveLanguage}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Myers-Briggs Personality:</span>
                <span className="font-bold text-purple-300 font-mono">{PROFILE_DATA.personalityType}</span>
              </div>
            </div>

          </div>
        </section>

        {/* ====================================================
            SECTION 5: INTERACTIVE LIFESTYLE DASHBOARD
            ==================================================== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-white">Lifestyle & Passions</h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Coffee', icon: Coffee, desc: 'Pour-overs & Ethiopian Gesha', color: 'from-amber-500 to-orange-600' },
              { label: 'Violin Music', icon: Music, desc: 'Bach sonatas & ambient synths', color: 'from-purple-500 to-pink-600' },
              { label: 'Travel', icon: Globe, desc: 'Kyoto ryokans & Iceland ring road', color: 'from-cyan-500 to-blue-600' },
              { label: '35mm Art', icon: Camera, desc: 'Leica street film photography', color: 'from-fuchsia-500 to-pink-600' },
              { label: 'AI Science', icon: Sparkles, desc: 'Neural attention models', color: 'from-emerald-500 to-teal-600' },
              { label: 'Books', icon: BookOpen, desc: 'Philosophy & Sci-fi novels', color: 'from-indigo-500 to-purple-600' },
              { label: 'Indie Film', icon: Film, desc: 'Blade Runner 35mm screenings', color: 'from-rose-500 to-red-600' },
              { label: 'Pilates', icon: Flame, desc: 'Morning reformer sessions', color: 'from-yellow-500 to-amber-600' },
              { label: 'Foodie', icon: Utensils, desc: 'Midnight Japantown ramen', color: 'from-amber-600 to-orange-700' },
              { label: 'Cats', icon: Heart, desc: 'Maine Coon cat named Mochi', color: 'from-pink-500 to-rose-600' }
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-pink-500/40 backdrop-blur-xl space-y-2 group cursor-pointer shadow-lg transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-display group-hover:text-pink-300 transition-colors">{item.label}</h4>
                    <p className="text-[10px] text-white/50 line-clamp-1">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            SECTION 6: PINTEREST MEDIA GALLERY
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Media Gallery & 3D Memories</h2>
              <p className="text-xs text-white/50">Concerts, audio moments, and visual highlights</p>
            </div>
            <span className="text-xs font-mono text-white/40">{PROFILE_DATA.gallery.length} Media Highlights</span>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {PROFILE_DATA.gallery.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setSelectedGalleryMedia(item)}
                className="break-inside-avoid rounded-3xl bg-white/[0.04] border border-white/10 overflow-hidden backdrop-blur-xl group cursor-pointer shadow-xl hover:border-pink-500/40 transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

                  {item.type === 'voice' && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-pink-500/80 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1">
                      <Volume2 size={12} /> Voice Note ({item.voiceDuration})
                    </span>
                  )}
                  {item.type === 'memory3d' && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-500/80 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1">
                      <Sparkles size={12} /> 3D Memory
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs text-white font-medium line-clamp-2">{item.caption}</p>
                    <span className="text-[10px] text-pink-400 font-mono mt-1 block">❤️ {item.likes} likes</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 7: SPOTIFY MUSIC INTEGRATION
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Music size={20} className="text-emerald-400" />
                <h2 className="text-2xl font-display font-bold text-white">Spotify Music Compatibility</h2>
              </div>
              <p className="text-xs text-white/50 mt-0.5">Favorite artists & classical focus playlists</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">🟢 96% Music Overlap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROFILE_DATA.spotifyTracks.map((track) => (
              <motion.div
                key={track.id}
                whileHover={{ y: -4 }}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl flex items-center justify-between gap-4 shadow-lg group hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={track.albumCover} alt={track.title} className="w-12 h-12 rounded-xl object-cover border border-white/15" />
                  <div>
                    <h4 className="text-sm font-bold text-white font-display group-hover:text-emerald-300 transition-colors">{track.title}</h4>
                    <p className="text-xs text-white/60">{track.artist}</p>
                  </div>
                </div>

                <button 
                  onClick={() => toggleTrackPlay(track.id, track.title)}
                  className="p-2.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                >
                  {playingTrackId === track.id ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 8: TRAVEL MAP & DESTINATIONS
            ==================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Globe size={20} className="text-cyan-400" />
                <h2 className="text-2xl font-display font-bold text-white">Travel Passport & Dream Destinations</h2>
              </div>
              <p className="text-xs text-white/50 mt-0.5">Countries visited, dream tea tours & upcoming flights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {PROFILE_DATA.travel.map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -6, scale: 1.03 }}
                className="rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden backdrop-blur-xl p-3 shadow-lg flex flex-col justify-between h-44 group hover:border-cyan-500/40 transition-all"
              >
                <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                  <img src={dest.image} alt={dest.country} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 text-xl">{dest.flag}</span>
                  <span className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                    dest.status === 'Visited' ? 'bg-emerald-500/80 text-white' : dest.status === 'Upcoming' ? 'bg-purple-500/80 text-white' : 'bg-pink-500/80 text-white'
                  }`}>
                    {dest.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display">{dest.country}</h4>
                  {dest.year && <p className="text-[10px] text-white/40 font-mono">{dest.year}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 9: FLOATING 3D PERSONALITY SPHERES
            ==================================================== */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">3D Personality Spheres</h2>
            <p className="text-xs text-white/50">Hover or click a sphere to inspect behavioral anecdotes</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {PROFILE_DATA.personalitySpheres.map((sphere) => {
              const isSelected = expandedSphere?.id === sphere.id;
              return (
                <motion.div
                  key={sphere.id}
                  whileHover={{ scale: 1.1, y: -6 }}
                  onClick={() => setExpandedSphere(sphere)}
                  className={`p-4 rounded-3xl backdrop-blur-2xl border cursor-pointer text-center space-y-2 transition-all shadow-2xl ${
                    isSelected ? 'bg-white/10 border-pink-400 scale-105 shadow-[0_0_25px_rgba(236,72,153,0.4)]' : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div 
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white font-mono font-bold text-sm shadow-xl"
                    style={{ backgroundColor: sphere.color }}
                  >
                    {sphere.score}%
                  </div>
                  <h4 className="text-xs font-bold text-white font-display">{sphere.name}</h4>
                </motion.div>
              );
            })}
          </div>

          {/* Expanded Anecdote Box */}
          {expandedSphere && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-purple-950/30 border border-purple-500/30 backdrop-blur-2xl text-xs text-purple-200 flex items-start gap-3 shadow-xl"
            >
              <Sparkles size={18} className="text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">{expandedSphere.name} Personality Anecdote ({expandedSphere.score}%)</span>
                {expandedSphere.explanation}
              </div>
            </motion.div>
          )}
        </section>

        {/* ====================================================
            SECTION 10: VERTICAL LIFE TIMELINE
            ==================================================== */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Life Timeline & Milestones</h2>
            <p className="text-xs text-white/50">Graduations, recitals, publications, and personal milestones</p>
          </div>

          <div className="relative border-l-2 border-white/15 ml-4 pl-6 space-y-6">
            {PROFILE_DATA.timeline.map((ms) => (
              <motion.div key={ms.id} whileHover={{ x: 4 }} className="relative group">
                <span className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-pink-500 border-4 border-[#04040A] shadow-md" />
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-300 font-display">{ms.title}</span>
                    <span className="text-[10px] font-mono text-white/40 bg-black/40 px-2 py-0.5 rounded-full">{ms.year}</span>
                  </div>
                  <p className="text-xs text-white/70">{ms.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* ====================================================
          STICKY FLOATING QUICK ACTION BAR
          ==================================================== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto p-2.5 rounded-full bg-black/80 border border-white/20 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2">
        <button 
          onClick={handleLike}
          className={`px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
            isLiked ? 'bg-pink-600 text-white shadow-pink-600/40' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110'
          }`}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button 
          onClick={handleStartChat}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <MessageCircle size={16} />
          <span className="hidden sm:inline">Chat</span>
        </button>

        <button 
          onClick={handleVoiceIntroToggle}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-pink-500/20 text-pink-300 hover:bg-pink-500 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Volume2 size={16} />
          <span className="hidden sm:inline">Voice Intro</span>
        </button>

        <button 
          onClick={() => {
            addToast(`Invited ${PROFILE_DATA.name} for a coffee date! ☕`, 'match');
            setActiveTab('planner');
          }}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Calendar size={16} />
          <span className="hidden sm:inline">Date Invite</span>
        </button>

        <button 
          onClick={() => {
            addToast(`Sent a virtual coffee gift to ${PROFILE_DATA.name}! 🎁`, 'system');
          }}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          title="Send Gift"
        >
          <Gift size={16} />
        </button>
      </div>

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
                    <span className="text-xl">{activeStory.icon}</span>
                    <h4 className="text-sm font-bold text-white font-display">{activeStory.title} Highlight</h4>
                  </div>
                  <button onClick={() => setActiveStory(null)} className="p-2 rounded-full bg-black/50 text-white"><X size={18} /></button>
                </div>
              </div>
              <img src={activeStory.storyMedia} alt="Story" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                <p className="text-sm text-white font-medium">{activeStory.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GALLERY MEDIA LIGHTBOX */}
      <AnimatePresence>
        {selectedGalleryMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedGalleryMedia(null)}
          >
            <div className="relative max-w-3xl w-full max-h-[85vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black" onClick={(e) => e.stopPropagation()}>
              <img src={selectedGalleryMedia.url} alt="Gallery" className="w-full h-full object-contain max-h-[70vh]" />
              <div className="p-4 bg-black/90 border-t border-white/10 flex items-center justify-between">
                <p className="text-xs text-white">{selectedGalleryMedia.caption}</p>
                <button onClick={() => setSelectedGalleryMedia(null)} className="p-2 rounded-full bg-white/10 text-white"><X size={18} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
