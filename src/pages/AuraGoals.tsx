import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Award, Plane, Dumbbell, BookOpen, Film, DollarSign, Heart, 
  CheckCircle2, Plus, Sparkles, TrendingUp
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useAppStore } from '../store/useAppStore';

const CATEGORIES = [
  { id: 'All', label: 'All Goals' },
  { id: 'Travel', label: 'Travel', icon: Plane },
  { id: 'Fitness', label: 'Fitness & Health', icon: Dumbbell },
  { id: 'Reading', label: 'Reading & Philosophy', icon: BookOpen },
  { id: 'Movies', label: 'Cinema & Arts', icon: Film },
  { id: 'Financial', label: 'Financial Vault', icon: DollarSign },
  { id: 'Relationship', label: 'Relationship Sync', icon: Heart }
];

const ACHIEVEMENT_BADGES = [
  { title: 'Oaxaca Explorer', desc: 'Co-planned 14-day international cultural tour', icon: Plane, unlocked: true },
  { title: 'Pottery Masters', desc: 'Completed hands-on ceramic studio workshop', icon: Award, unlocked: true },
  { title: '100 Quality Hours', desc: 'Spent 100+ phone-free hours co-working & talking', icon: Heart, unlocked: true },
  { title: 'Eco Loft Founder', desc: 'Reached 75% savings target for design loft', icon: Sparkles, unlocked: false }
];

export default function AuraGoals() {
  const { relosLifeGoals, toggleLifeGoal, addLifeGoal, addToast } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('Travel');
  const [newDate, setNewDate] = useState('Q4 2026');

  const filteredGoals = activeCategory === 'All' 
    ? relosLifeGoals 
    : relosLifeGoals.filter((g: { category: string }) => g.category === activeCategory);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    addLifeGoal(newTitle, newCat, newDate);
    addToast(`Added goal: "${newTitle}"`, 'system');
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Target}>
                Aura Goals Module • Shared Life Roadmap
              </Badge>
              <span className="text-xs font-mono text-accent font-medium">82% Avg Progress</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Target className="text-accent shrink-0" size={38} /> Aura Co-Op Goals
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Your shared bucket list spanning travel expeditions, fitness milestones, joint savings, and relationship commitments.
            </p>
          </div>

          <GlowButton variant="primary" size="md" onClick={() => setShowAddModal(true)} icon={Plus}>
            New Shared Goal
          </GlowButton>
        </div>

        {/* Achievement Badges Row */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Award className="text-amber-400" size={22} /> Unlocked Achievement Badges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACHIEVEMENT_BADGES.map((b, idx) => {
              const Icon = b.icon;
              return (
                <GlassCard key={idx} variant={b.unlocked ? 'glow' : 'subtle'} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      b.unlocked ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-white/30 border-white/10'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <Badge variant={b.unlocked ? 'accent' : 'glass'} size="sm">
                      {b.unlocked ? 'Unlocked' : 'In Progress'}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-white">{b.title}</h3>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">{b.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border
                ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-primary to-accent border-white/20 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  : 'bg-card-dark/60 border-white/10 text-white/60 hover:text-white'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal: { id: string; title: string; category: string; progress: number; targetDate: string; completed: boolean }) => (
            <GlassCard key={goal.id} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">{goal.category}</Badge>
                  <span className="text-xs font-mono text-white/40">Target: {goal.targetDate}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h3 className={`font-display font-bold text-lg text-white ${goal.completed ? 'line-through text-white/50' : ''}`}>
                    {goal.title}
                  </h3>
                  <button 
                    onClick={() => toggleLifeGoal(goal.id)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      goal.completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Progress Rate</span>
                    <span className="text-accent font-bold">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </section>

      </main>

      {/* New Goal Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Shared Goal">
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Goal Title</label>
            <input
              type="text"
              placeholder="e.g. Scuba Diving Certification in Belize"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Category</label>
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm bg-card-dark text-white"
            >
              <option value="Travel">Travel</option>
              <option value="Fitness">Fitness & Health</option>
              <option value="Reading">Reading & Philosophy</option>
              <option value="Movies">Cinema & Arts</option>
              <option value="Financial">Financial Vault</option>
              <option value="Relationship">Relationship Sync</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Target Date</label>
            <input
              type="text"
              placeholder="e.g. Q4 2026 or Dec 2026"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <GlowButton variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </GlowButton>
            <GlowButton type="submit" variant="primary" size="sm">
              Add Goal
            </GlowButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
