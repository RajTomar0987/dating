import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Heart, Activity, Calendar, Compass, MessageCircle, Flame, Users, Shield, ArrowUpRight 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import LiveActivityFeed from '../components/LiveActivityFeed';
import StoriesBar from '../components/StoriesBar';
import HolographicRing from '../components/HolographicRing';
import MetricCube from '../components/MetricCube';
import { useAppStore } from '../store/useAppStore';
import { sampleProfiles } from '../data/sampleProfiles';

export default function LiveHomeDashboard() {
  const { setActiveTab, addToast } = useAppStore();

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Aura AI Platform • Active Neural Ecosystem
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                🟢 42 Online Now in your region
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              Live Relationship Intelligence
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Your real-time relationship hub featuring active nearby profiles, new matches, tonight's date events, and AI recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <GlowButton variant="accent" size="md" onClick={() => setActiveTab('deck')} icon={Heart}>
              Explore Swipe Deck
            </GlowButton>
          </div>
        </div>

        {/* 24-Hour Stories Bar */}
        <section className="space-y-3">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="text-accent" size={18} /> Active Stories
          </h2>
          <StoriesBar />
        </section>

        {/* 4 Metric Cubes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCube title="Active Nearby" value="42 Online" change="+18%" icon={Users} variant="glow" />
          <MetricCube title="New Matches" value="14 Today" change="+24%" icon={Heart} variant="interactive" />
          <MetricCube title="AI Suggestions" value="124" change="Generated" icon={Sparkles} variant="interactive" />
          <MetricCube title="Avg Harmony" value="94%" change="Top Tier" icon={Shield} variant="glow" />
        </div>

        {/* Live Telemetry & Featured Affinity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Affinity Spotlight */}
          <GlassCard variant="glow" className="p-6 lg:col-span-2 space-y-6 bg-gradient-to-br from-primary/15 via-card-dark/95 to-accent/15 border-primary/40">
            <div className="flex items-center justify-between">
              <Badge variant="accent" size="sm" icon={Sparkles}>Top Neural Match Today</Badge>
              <span className="text-xs font-mono text-emerald-400 font-bold">Sample Profile</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img 
                  src={sampleProfiles[0].images[0]} 
                  alt={sampleProfiles[0].name}
                  className="w-32 h-32 rounded-3xl object-cover border-2 border-accent/40 shadow-2xl" 
                />
                <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 border-2 border-black" />
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-display font-bold text-white">{sampleProfiles[0].name}, {sampleProfiles[0].age}</h3>
                <p className="text-xs text-accent font-medium">{sampleProfiles[0].profession} • {sampleProfiles[0].city}</p>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{sampleProfiles[0].bio}</p>
                
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                  <GlowButton variant="primary" size="sm" onClick={() => setActiveTab('deck')}>
                    View Full Profile
                  </GlowButton>
                </div>
              </div>

              <HolographicRing score={sampleProfiles[0].compatibility_score} size={100} />
            </div>
          </GlassCard>

          {/* Live Activity Feed Widget */}
          <LiveActivityFeed />
        </div>

        {/* Active Nearby Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Compass className="text-primary" size={20} /> Active Nearby Profiles ({sampleProfiles.length})
            </h2>
            <button onClick={() => setActiveTab('deck')} className="text-xs font-mono text-accent hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProfiles.slice(0, 4).map((p) => (
              <GlassCard key={p.id} variant="interactive" className="p-4 space-y-3">
                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                    🟢 {p.last_active}
                  </span>

                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-accent/80 backdrop-blur-md text-[10px] font-mono text-white font-bold">
                    {p.compatibility_score}%
                  </span>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-bold text-sm text-white">{p.name}, {p.age}</h4>
                    <p className="text-[11px] text-white/70 truncate">{p.profession}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
