import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, Video, Radio, Award, Star, Eye, Sparkles, Heart, Check, Plus 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const CREATORS = [
  {
    id: 'c1',
    name: 'Dr. Sarah Chen, Ph.D.',
    role: 'Clinical Psychologist & Attachment Specialist',
    followers: '124.5k',
    rating: 4.9,
    contentCount: '34 Articles • 8 Courses',
    bio: 'Specializes in attachment security, active listening, and MBTI intimacy alignment.',
    isFollowing: true
  },
  {
    id: 'c2',
    name: 'Mark Vance',
    role: 'Dating & Flirt Coach',
    followers: '88.2k',
    rating: 4.8,
    contentCount: '19 Videos • 12 Guides',
    bio: 'Helping urban professionals break through awkward chat barriers and design memorable dates.',
    isFollowing: false
  },
  {
    id: 'c3',
    name: 'Elena Rostova',
    role: 'Architect & RelOS Research Fellow',
    followers: '54.1k',
    rating: 4.9,
    contentCount: '15 Articles • 4 Live Sessions',
    bio: 'Explores spatial aesthetics, co-living design, and shared financial goals.',
    isFollowing: true
  }
];

const CREATOR_CONTENT = [
  { id: 'ct1', type: 'Article', title: 'The Science of Active Evening Listening in INTJ Couples', creator: 'Dr. Sarah Chen', readTime: '5 min read', likes: '4.2k' },
  { id: 'ct2', type: 'Video', title: 'Designing First Dates That Eliminate Small Talk', creator: 'Mark Vance', readTime: '12 min video', likes: '8.9k' },
  { id: 'ct3', type: 'Course', title: 'Co-Living Architecture & Shared Financial Goals', creator: 'Elena Rostova', readTime: '4 Modules', likes: '3.1k' },
  { id: 'ct4', type: 'Live Session', title: 'Weekly Q&A: Overcoming Delay Anxiety in Relationships', creator: 'Dr. Sarah Chen', readTime: 'Live Today 8 PM', likes: '1.8k' }
];

export default function CreatorPlatform() {
  const { addToast } = useAppStore();
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({
    c1: true,
    c3: true
  });

  const toggleFollow = (creator: typeof CREATORS[0]) => {
    const nextState = !followingState[creator.id];
    setFollowingState(prev => ({ ...prev, [creator.id]: nextState }));
    addToast(nextState ? `Following ${creator.name}` : `Unfollowed ${creator.name}`, 'system');
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Users}>
                Aura Creator Platform • Expert Masterclasses
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">150+ Verified Experts</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Users className="text-accent shrink-0" size={38} /> Creator & Expert Hub
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Access published articles, video masterclasses, courses, and live sessions from clinical psychologists, dating coaches, and relationship experts.
            </p>
          </div>
        </div>

        {/* Featured Creator Profiles */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Award className="text-amber-400" size={20} /> Verified Relationship Creators
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CREATORS.map((creator) => {
              const isFollowing = followingState[creator.id];
              return (
                <GlassCard key={creator.id} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white text-lg">
                        {creator.name.charAt(0)}
                      </div>
                      <Badge variant="accent" size="sm">{creator.followers} followers</Badge>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-white">{creator.name}</h3>
                      <div className="text-xs text-accent font-medium mt-0.5">{creator.role}</div>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed font-sans">{creator.bio}</p>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-white/40">{creator.contentCount}</span>
                    <GlowButton 
                      variant={isFollowing ? 'glass' : 'primary'}
                      size="sm"
                      onClick={() => toggleFollow(creator)}
                      icon={isFollowing ? Check : Plus}
                    >
                      {isFollowing ? 'Following' : 'Follow Creator'}
                    </GlowButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Published Masterclasses & Articles Feed */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <BookOpen className="text-primary" size={20} /> Masterclasses, Articles & Live Sessions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CREATOR_CONTENT.map((content) => (
              <GlassCard key={content.id} variant="interactive" className="p-6 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="primary" size="sm">{content.type}</Badge>
                    <span className="text-white/40 font-mono">{content.readTime}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white hover:text-accent transition-colors">
                    {content.title}
                  </h3>

                  <div className="text-xs text-white/60 font-medium">By {content.creator}</div>
                </div>

                <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                  <span className="text-xs font-mono text-accent flex items-center gap-1">
                    <Heart size={13} className="fill-accent" /> {content.likes} Likes
                  </span>
                  <GlowButton 
                    variant="glass" 
                    size="sm"
                    onClick={() => addToast(`Opening "${content.title}"`, 'system')}
                  >
                    Read & Watch
                  </GlowButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
