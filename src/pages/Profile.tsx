import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Video, Volume2, Calendar, Gift, Sparkles, 
  MapPin, Briefcase, GraduationCap, Globe, ShieldCheck, Clock, CheckCircle2, 
  Star, Coffee, Film, BookOpen, Music, Camera, Utensils, Flame, X, Play, 
  Pause, ChevronRight, Award, Compass, Eye, Users, ChevronDown, ChevronUp, Share2,
  Loader2, User as UserIcon, Sparkle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ParticleBg from '../components/ParticleBg';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../auth/useAuth';

import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ApiClient } from '../api/client';

// Helper to calculate age from birthday string (e.g., '2005-12-01')
const calculateAge = (birthday?: string | null): number | null => {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function Profile() {
  const { setActiveTab, setSelectedMatchId, addToast } = useAppStore();
  const { profile, firebaseUser, jwt, loading, profileLoading } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const targetId = id || searchParams.get('id');
  const navigate = useNavigate();

  const [targetProfile, setTargetProfile] = useState<any | null>(null);
  const [targetLoading, setTargetLoading] = useState(false);

  // Active UI States
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const [selectedGalleryMedia, setSelectedGalleryMedia] = useState<any | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [playingVoice, setPlayingVoice] = useState(false);

  useEffect(() => {
    if (targetId && targetId !== firebaseUser?.uid) {
      setTargetLoading(true);
      ApiClient.getProfileById(targetId)
        .then(res => {
          if (res?.profile) {
            setTargetProfile(res.profile);
          }
        })
        .finally(() => setTargetLoading(false));
    } else {
      setTargetProfile(null);
    }
  }, [targetId, firebaseUser]);

  const isViewingSelf = !targetId || targetId === firebaseUser?.uid;
  const displayProfile = targetProfile || profile;

  const handleLikeTarget = async () => {
    if (!targetId || isViewingSelf) return;
    setIsLiked(true);
    addToast(`Liked ${displayProfile?.display_name || 'user'}!`, 'match');
    const res = await ApiClient.likeUser(targetId, 'like');
    if (res?.isMatch) {
      addToast(`🎉 Mutual Match with ${displayProfile?.display_name}!`, 'match');
      if (res.match?.id) {
        setSelectedMatchId(res.match.id);
        navigate('/chat');
      }
    }
  };

  const handleSuperLikeTarget = async () => {
    if (!targetId || isViewingSelf) return;
    setIsLiked(true);
    addToast(`Super Liked ${displayProfile?.display_name || 'user'}! ⚡`, 'match');
    const res = await ApiClient.likeUser(targetId, 'superlike');
    if (res?.isMatch) {
      addToast(`🎉 Mutual Match with ${displayProfile?.display_name}!`, 'match');
      if (res.match?.id) {
        setSelectedMatchId(res.match.id);
        navigate('/chat');
      }
    }
  };

  // Loading state handling
  if (loading || profileLoading || targetLoading) {
    return (
      <div className="flex min-h-screen bg-[#04040A] text-white font-sans items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          <p className="text-sm font-mono text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Real user data formatting
  const displayName = displayProfile?.display_name || displayProfile?.first_name || (isViewingSelf ? firebaseUser?.displayName : 'User Profile') || 'User Profile';
  const age = calculateAge(displayProfile?.birthday);
  const nameHeading = age ? `${displayName}, ${age}` : displayName;

  const profilePhoto = displayProfile?.photos?.[0] || (isViewingSelf ? firebaseUser?.photoURL : null) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const coverMedia = displayProfile?.photos?.[1] || displayProfile?.photos?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80';
  
  const occupation = profile?.occupation || 'Not specified';
  const education = profile?.education || 'Not specified';
  const locationCity = profile?.location_city || 'Location not set';
  const bio = profile?.bio || 'No bio provided yet.';
  const gender = profile?.gender || 'Not specified';
  const interestedIn = profile?.interested_in?.length ? profile.interested_in.join(', ') : 'Not specified';
  const heightText = profile?.height_cm ? `${profile.height_cm} cm` : 'Not specified';
  const languagesText = profile?.languages?.length ? profile.languages.join(', ') : 'Not specified';

  const interestsList = profile?.interests?.length ? profile.interests : ['Artificial Intelligence', 'Travel', 'Music', 'Fitness'];
  const lifestyleList = profile?.lifestyle?.length ? profile.lifestyle : ['Early Bird', 'Active Lifestyle'];
  const promptsMap = profile?.prompts || {};

  // Story highlights derived from user photos or default highlights
  const highlights = profile?.photos?.map((photoUrl, idx) => ({
    id: `hl_${idx}`,
    title: idx === 0 ? 'Main' : `Highlight ${idx + 1}`,
    icon: idx === 0 ? '✨' : '📸',
    coverImage: photoUrl,
    storyMedia: photoUrl,
    caption: `${displayName}'s profile highlight #${idx + 1}`
  })) || [
    {
      id: 'hl_main',
      title: 'Main',
      icon: '✨',
      coverImage: profilePhoto,
      storyMedia: profilePhoto,
      caption: `${displayName}'s primary highlight`
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    addToast(isLiked ? 'Removed from favorites' : 'Saved to favorites! ✨', 'system');
  };

  const handleVoiceIntroToggle = () => {
    setPlayingVoice(!playingVoice);
    addToast(playingVoice ? 'Paused voice note' : `Playing ${displayName}'s audio intro...`, 'system');
  };

  return (
    <div className="flex min-h-[100dvh] w-full max-w-full bg-[#04040A] text-white font-sans relative overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* Background Ambient Particles & Glows */}
      <ParticleBg />
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-[30%] right-[-10%] w-[550px] h-[550px] bg-pink-900/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-5%] left-[20%] w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Viewport Content */}
      <main className="flex-1 ml-0 md:ml-64 w-full max-w-7xl mx-auto min-w-0 p-3.5 sm:p-4 md:p-8 pb-28 md:pb-24 space-y-8 md:space-y-12 relative z-10 overflow-x-hidden">
        
        {/* ====================================================
            SECTION 1: HERO COVER & FLOATING PROFILE CARD
            ==================================================== */}
        <section className="relative rounded-3xl overflow-hidden border border-white/12 bg-gradient-to-b from-white/[0.06] to-black/80 backdrop-blur-2xl shadow-2xl">
          {/* Cover Media */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img 
              src={coverMedia} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04040A] via-black/30 to-black/40" />

            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active Now
              </span>
            </div>
          </div>

          {/* Overlapping Avatar & Details */}
          <div className="px-6 pb-8 pt-0 relative -mt-24 sm:-mt-32 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_50px_rgba(236,72,153,0.5)]">
                  <div className="w-full h-full rounded-[22px] bg-black overflow-hidden relative">
                    <img 
                      src={profilePhoto} 
                      alt={displayName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#04040A] shadow-xl" title="Online" />
              </div>

              {/* Name & Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
                    {nameHeading}
                  </h1>
                  <span className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40" title="Verified Profile">
                    <ShieldCheck size={22} />
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-1">
                    <Sparkles size={13} /> Verified Member
                  </span>
                </div>

                <p className="text-sm md:text-base text-pink-300 font-medium flex items-center justify-center md:justify-start gap-2">
                  <Briefcase size={16} />
                  {occupation}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs text-white/70 font-mono">
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-pink-400" /> {locationCity}</span>
                  <span className="flex items-center gap-1"><GraduationCap size={13} className="text-purple-400" /> {education}</span>
                </div>
              </div>
            </div>

            {/* Action Card / Match Preferences */}
            {!isViewingSelf ? (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-pink-500/30 backdrop-blur-xl flex flex-wrap items-center justify-center md:justify-end gap-2.5">
                <button
                  onClick={handleLikeTarget}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                    isLiked
                      ? 'bg-pink-600 text-white'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                  }`}
                >
                  <Heart size={14} className="fill-white" />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
                <button
                  onClick={handleSuperLikeTarget}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  <Sparkles size={14} />
                  Super Like
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageCircle size={14} />
                  Message
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/12 backdrop-blur-xl text-center md:text-right max-w-xs space-y-1">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">Interested In</span>
                <p className="text-xs font-semibold text-white">{interestedIn}</p>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================
            SECTION 2: STORY HIGHLIGHTS
            ==================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase text-white/60 font-semibold tracking-wider flex items-center gap-2">
              <Flame size={14} className="text-pink-400" />
              Story Highlights
            </h3>
            <span className="text-xs text-white/40 font-mono">Tap to view photos</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
            {highlights.map((hl) => (
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
            SECTION 3: ABOUT ME & BIO
            ==================================================== */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-white">About {displayName}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bio Card */}
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/12 backdrop-blur-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-pink-400 uppercase">BIO & SELF INTRODUCTION</span>
                <UserIcon size={16} className="text-pink-400" />
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-sans">
                {bio}
              </p>
            </div>

            {/* Quick Details Card */}
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/12 backdrop-blur-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">PROFILE DETAILS</span>
                <Coffee size={16} className="text-purple-400" />
              </div>
              
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/50">Gender</span>
                  <span className="text-white font-medium">{gender}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/50">Height</span>
                  <span className="text-white font-medium">{heightText}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/50">Languages</span>
                  <span className="text-white font-medium">{languagesText}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-white/50">Location</span>
                  <span className="text-white font-medium">{locationCity}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Prompts Section if user saved any */}
        {Object.keys(promptsMap).length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-display font-bold text-white">Prompts & Answers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(promptsMap).map(([question, answer], idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-2">
                  <span className="text-xs font-mono text-purple-400 font-bold">{question}</span>
                  <p className="text-sm font-semibold text-white leading-relaxed">{answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================
            SECTION 4: INTERESTS & LIFESTYLE
            ==================================================== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-white">Interests & Lifestyle</h2>

          <div className="flex flex-wrap gap-2.5">
            {interestsList.map((interest, idx) => (
              <div 
                key={idx}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 via-purple-600/20 to-accent/20 border border-accent/40 text-xs font-semibold text-white shadow-md flex items-center gap-1.5"
              >
                <Sparkles size={12} className="text-pink-400" />
                <span>{interest}</span>
              </div>
            ))}

            {lifestyleList.map((item, idx) => (
              <div 
                key={`life_${idx}`}
                className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/12 text-xs font-semibold text-purple-200 flex items-center gap-1.5"
              >
                <Flame size={12} className="text-purple-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 5: PHOTOS GALLERY
            ==================================================== */}
        {profile?.photos && profile.photos.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">Uploaded Photos</h2>
                <p className="text-xs text-white/50">{profile.photos.length} photos on file</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.photos.map((url, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedGalleryMedia({ url, caption: `${displayName} Photo ${idx + 1}` })}
                  className="rounded-3xl bg-white/[0.04] border border-white/10 overflow-hidden backdrop-blur-xl group cursor-pointer shadow-xl h-72 relative"
                >
                  <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                    <p className="text-xs text-white font-medium">Photo {idx + 1}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* STICKY FLOATING QUICK ACTION BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto p-2.5 rounded-full bg-black/80 border border-white/20 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2">
        <button 
          onClick={handleLike}
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
            isLiked ? 'bg-pink-600 text-white shadow-pink-600/40' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110'
          }`}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          <span>{isLiked ? 'Favorited' : 'Favorite'}</span>
        </button>

        <button 
          onClick={() => setActiveTab('onboarding')}
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles size={16} />
          <span>Edit Profile</span>
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
                    <h4 className="text-sm font-bold text-white font-display">{activeStory.title}</h4>
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
