import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Sparkles, Camera, Gamepad2, Dumbbell, BookOpen, Cpu, Compass, Music, Utensils, Plus, Check 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const COMMUNITIES = [
  { id: 'cm1', name: 'Analog Photography & Leica Collectors', category: 'Photography', members: '1,420 members', desc: '35mm film processing, darkroom techniques, and street photography expeditions.', icon: Camera, joined: true },
  { id: 'cm2', name: 'Clean Tech & AI Founders', category: 'Technology', members: '2,890 members', desc: 'Discussing neural architecture, climate tech, and sustainable co-living.', icon: Cpu, joined: true },
  { id: 'cm3', name: 'Bebop Jazz & Vinyl Connoisseurs', category: 'Music', members: '1,150 members', desc: 'Speakeasy listening sessions, vinyl trades, and live jazz club nights.', icon: Music, joined: false },
  { id: 'cm4', name: 'Japanese Architecture & Joinery', category: 'Design', members: '980 members', desc: 'Tactile woodworking, tea room design, and Kyoto artisan trips.', icon: Compass, joined: false }
];

export default function Communities() {
  const { addToast } = useAppStore();
  const [joinedState, setJoinedState] = useState<Record<string, boolean>>({
    cm1: true,
    cm2: true
  });

  const toggleJoin = (club: typeof COMMUNITIES[0]) => {
    const nextState = !joinedState[club.id];
    setJoinedState(prev => ({ ...prev, [club.id]: nextState }));
    addToast(nextState ? `Joined ${club.name}` : `Left ${club.name}`, 'system');
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
                Aura Interest Clubs & Group Meetups
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">8 Active Communities</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Users className="text-accent shrink-0" size={38} /> Ecosystem Communities
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Connect with couples and high-intent singles sharing passions across photography, AI technology, jazz, and architecture.
            </p>
          </div>
        </div>

        {/* Communities Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMMUNITIES.map((club) => {
            const Icon = club.icon;
            const isJoined = joinedState[club.id];
            return (
              <GlassCard key={club.id} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
                      <Icon size={20} />
                    </div>
                    <Badge variant="primary" size="sm">{club.members}</Badge>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white">{club.name}</h3>
                    <span className="text-xs text-accent font-medium">{club.category}</span>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed font-sans">{club.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/8 flex items-center justify-end">
                  <GlowButton 
                    variant={isJoined ? 'glass' : 'primary'}
                    size="sm"
                    onClick={() => toggleJoin(club)}
                    icon={isJoined ? Check : Plus}
                  >
                    {isJoined ? 'Member' : 'Join Club'}
                  </GlowButton>
                </div>
              </GlassCard>
            );
          })}
        </section>

      </main>
    </div>
  );
}
