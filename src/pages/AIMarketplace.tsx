import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Search, Star, Download, CheckCircle2, ShieldCheck, Heart, 
  MessageSquare, Compass, Gift, DollarSign, Film, Utensils, Award, 
  Dog, Users, Zap, Check, Plus
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

const AI_SKILLS = [
  {
    id: 's1',
    name: 'Relationship Coach AI',
    desc: 'Proactive conflict prevention, attachment style analysis, and active listening coaching.',
    category: 'Relationship',
    rating: 4.9,
    downloads: '48.2k',
    isPremium: true,
    isFeatured: true,
    isTrending: true,
    icon: ShieldCheck,
    isInstalled: true
  },
  {
    id: 's2',
    name: 'Conversation Genius',
    desc: 'Context-aware flirt, banter, and deep discussion topic generator tailored to partner MBTI.',
    category: 'Relationship',
    rating: 4.9,
    downloads: '52.4k',
    isPremium: true,
    isFeatured: true,
    isTrending: true,
    icon: MessageSquare,
    isInstalled: true
  },
  {
    id: 's3',
    name: 'Travel Planner AI',
    desc: 'Co-created travel itineraries, ryokan bookings, and 14-day expedition co-op planner.',
    category: 'Lifestyle',
    rating: 4.8,
    downloads: '34.1k',
    isPremium: false,
    isFeatured: true,
    isTrending: false,
    icon: Compass,
    isInstalled: false
  },
  {
    id: 's4',
    name: 'Gift Expert AI',
    desc: 'Surfaces thoughtful birthday, anniversary, and milestone gift suggestions based on memory vault.',
    category: 'Lifestyle',
    rating: 4.9,
    downloads: '29.8k',
    isPremium: true,
    isFeatured: false,
    isTrending: true,
    icon: Gift,
    isInstalled: false
  },
  {
    id: 's5',
    name: 'Financial Compatibility',
    desc: 'Joint emergency & opportunity vault tracking, eco-loft purchasing goals, and budget sync.',
    category: 'Finance',
    rating: 4.7,
    downloads: '18.5k',
    isPremium: true,
    isFeatured: false,
    isTrending: false,
    icon: DollarSign,
    isInstalled: false
  },
  {
    id: 's6',
    name: 'Movie Recommender',
    desc: 'Cinephile date night cinema recommendations with joint vibe match percentage scores.',
    category: 'Lifestyle',
    rating: 4.8,
    downloads: '41.2k',
    isPremium: false,
    isFeatured: true,
    isTrending: true,
    icon: Film,
    isInstalled: false
  },
  {
    id: 's7',
    name: 'Restaurant Expert',
    desc: 'Understated luxury, seasonal tasting menus, and romantic table reservation finder.',
    category: 'Lifestyle',
    rating: 4.9,
    downloads: '38.6k',
    isPremium: true,
    isFeatured: false,
    isTrending: true,
    icon: Utensils,
    isInstalled: false
  },
  {
    id: 's8',
    name: 'Wedding Planner AI',
    desc: 'Co-created wedding timeline, seating chart architecture, and vendor budget optimizer.',
    category: 'Family',
    rating: 4.9,
    downloads: '14.2k',
    isPremium: true,
    isFeatured: false,
    isTrending: false,
    icon: Award,
    isInstalled: false
  },
  {
    id: 's9',
    name: 'Pet Compatibility AI',
    desc: 'Shared pet care routines, vet schedule sync, and joint adoption suitability scores.',
    category: 'Family',
    rating: 4.7,
    downloads: '12.8k',
    isPremium: false,
    isFeatured: false,
    isTrending: false,
    icon: Dog,
    isInstalled: false
  },
  {
    id: 's10',
    name: 'Parenting Coach AI',
    desc: 'Long-term family planning, values alignment, and child-rearing philosophy guidance.',
    category: 'Family',
    rating: 4.8,
    downloads: '11.5k',
    isPremium: true,
    isFeatured: false,
    isTrending: false,
    icon: Users,
    isInstalled: false
  }
];

export default function AIMarketplace() {
  const { addToast } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [installedState, setInstalledState] = useState<Record<string, boolean>>({
    s1: true,
    s2: true
  });
  const [installingId, setInstallingId] = useState<string | null>(null);

  const toggleInstall = (skill: typeof AI_SKILLS[0]) => {
    if (installedState[skill.id]) {
      setInstalledState(prev => ({ ...prev, [skill.id]: false }));
      addToast(`Uninstalled AI Skill: ${skill.name}`, 'system');
    } else {
      setInstallingId(skill.id);
      setTimeout(() => {
        setInstallingId(null);
        setInstalledState(prev => ({ ...prev, [skill.id]: true }));
        addToast(`Successfully Installed ${skill.name}! Active in Aura Suite.`, 'system');
      }, 700);
    }
  };

  const filteredSkills = AI_SKILLS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.desc.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'Featured') return matchesSearch && s.isFeatured;
    if (activeFilter === 'Trending') return matchesSearch && s.isTrending;
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && s.category === activeFilter;
  });

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Aura AI Skills Marketplace • Modular Intelligence
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">10 Active AI Skills</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="text-accent shrink-0" size={38} /> Aura AI Marketplace
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Install specialized AI skills to extend your relationship suite—from conversation coaching and travel planning to financial compatibility and gift experts.
            </p>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search AI skills (e.g. Travel, Conversation, Gift, Movie)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input pl-10 text-xs sm:text-sm"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['All', 'Featured', 'Trending', 'Relationship', 'Lifestyle', 'Finance', 'Family'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`
                  px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border
                  ${activeFilter === f
                    ? 'bg-gradient-to-r from-primary to-accent border-white/20 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-card-dark/60 border-white/10 text-white/60 hover:text-white'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Banner Section */}
        {activeFilter === 'All' && !searchTerm && (
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Zap className="text-amber-400" size={20} /> Featured AI Packs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AI_SKILLS.filter(s => s.isFeatured).slice(0, 2).map((skill) => {
                const Icon = skill.icon;
                const installed = installedState[skill.id];
                return (
                  <GlassCard key={skill.id} variant="glow" className="p-6 bg-gradient-to-br from-primary/15 via-card-dark/95 to-accent/15 border-primary/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                          <Icon size={20} />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg text-white">{skill.name}</h3>
                          <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                            <span className="text-amber-400 font-bold flex items-center gap-0.5">
                              <Star size={11} className="fill-amber-400" /> {skill.rating}
                            </span>
                            <span>•</span>
                            <span>{skill.downloads} installs</span>
                          </div>
                        </div>
                      </div>

                      {skill.isPremium && (
                        <Badge variant="accent" size="sm">Pro+ Pack</Badge>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                      {skill.desc}
                    </p>

                    <div className="pt-2 flex items-center justify-end">
                      <GlowButton 
                        variant={installed ? 'glass' : 'primary'}
                        size="sm"
                        isLoading={installingId === skill.id}
                        onClick={() => toggleInstall(skill)}
                        icon={installed ? Check : Plus}
                      >
                        {installed ? 'Installed' : 'Install AI Skill'}
                      </GlowButton>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        )}

        {/* Main Skills Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white">All AI Skills ({filteredSkills.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => {
              const Icon = skill.icon;
              const installed = installedState[skill.id];
              return (
                <GlassCard 
                  key={skill.id} 
                  variant="interactive" 
                  className="p-6 space-y-4 flex flex-col justify-between hover:border-primary/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-accent border border-white/10">
                        <Icon size={20} />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {skill.isPremium && <Badge variant="accent" size="sm">Pro+</Badge>}
                        <Badge variant="primary" size="sm">{skill.category}</Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-white">{skill.name}</h3>
                      <div className="flex items-center gap-3 text-xs font-mono text-white/50 mt-1">
                        <span className="text-amber-400 font-bold flex items-center gap-0.5">
                          <Star size={11} className="fill-amber-400" /> {skill.rating}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Download size={11} /> {skill.downloads}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed font-sans">
                      {skill.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-end">
                    <GlowButton 
                      variant={installed ? 'glass' : 'primary'}
                      size="sm"
                      isLoading={installingId === skill.id}
                      onClick={() => toggleInstall(skill)}
                      icon={installed ? Check : Plus}
                    >
                      {installed ? 'Installed' : 'Install Skill'}
                    </GlowButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
