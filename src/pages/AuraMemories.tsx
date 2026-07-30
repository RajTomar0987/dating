import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, MapPin, Music, Utensils, Sparkles, Plus, Image as ImageIcon, 
  Clock, Bookmark, Star, ChevronRight, Award, MessageSquare
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useAppStore } from '../store/useAppStore';

const MILESTONE_TIMELINE = [
  {
    id: 'm1',
    date: 'Oct 14, 2025',
    title: 'Neural Affinity Sync Established',
    category: 'First Match',
    desc: 'Initial compatibility score computed at 94.6%. First algorithmic affinity signal.',
    badge: 'Neural Match',
    icon: Sparkles,
    color: '#A855F7'
  },
  {
    id: 'm2',
    date: 'Oct 15, 2025',
    title: 'First Chat Connection',
    category: 'First Chat',
    desc: 'Exchanged 45 messages about machine learning, model distillation, and Bach violin sonatas.',
    badge: 'Spark Moment',
    icon: MessageSquare,
    color: '#EC4899'
  },
  {
    id: 'm3',
    date: 'Nov 02, 2025',
    title: 'First Physical Date at Modern Art Museum',
    category: 'First Date',
    desc: 'Spent 4 hours discussing spatial architecture and classical composition over espresso.',
    badge: 'First Date',
    icon: Heart,
    color: '#3B82F6'
  },
  {
    id: 'm4',
    date: 'Jan 15, 2026',
    title: 'Moved into Shared Loft Space',
    category: 'Co-Living',
    desc: 'Combined minimalist studio spaces and set up shared audio synth workstation.',
    badge: 'Milestone',
    icon: MapPin,
    color: '#10B981'
  },
  {
    id: 'm5',
    date: 'May 20, 2026',
    title: 'Oaxaca Expedition Co-Planned',
    category: 'Travel',
    desc: 'Co-created 14-day itinerary for cultural research and artisan culinary tours.',
    badge: 'Upcoming Travel',
    icon: Bookmark,
    color: '#F59E0B'
  }
];

const KEEPSAKES_GALLERY = [
  { title: 'Ethiopian Yirgacheffe Recipe', category: 'Favorite Coffee', val: 'Single-origin, light roast, oat milk, 88°C brew', icon: Utensils },
  { title: 'Modern Art Museum Gallery', category: 'Favorite Place', val: 'Sculpture Garden & Quiet 2nd Floor Gallery', icon: MapPin },
  { title: 'Nils Frahm & Bach Sonatas', category: 'Favorite Music', val: 'Solo piano, ambient synth, classical violin', icon: Music },
  { title: 'Authentic Neapolitan Pizza', category: 'Favorite Food', val: 'San Marzano tomatoes, fresh basil, dark chocolate >75%', icon: Utensils }
];

export default function AuraMemories() {
  const { addToast } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('First Date');
  const [newDesc, setNewDesc] = useState('');

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    addToast(`Saved memory milestone: "${newTitle}"`, 'system');
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                Aura Memories Module • Ecosystem Core
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">5 Key Milestones Retained</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Heart className="text-accent shrink-0" size={38} /> Aura Memories
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              An animated timeline of your journey together—from the very first match signal to your latest co-living milestones, favorite places, and shared keepsakes.
            </p>
          </div>

          <GlowButton variant="primary" size="md" onClick={() => setShowAddModal(true)} icon={Plus}>
            Add Memory Milestone
          </GlowButton>
        </div>

        {/* Section 1: Keepsakes & Favorites Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Star className="text-amber-400" size={20} /> Core Favorites & Keepsakes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KEEPSAKES_GALLERY.map((item, idx) => {
              const Icon = item.icon;
              return (
                <GlassCard key={idx} variant="interactive" className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                      <Icon size={18} />
                    </div>
                    <Badge variant="primary" size="sm">{item.category}</Badge>
                  </div>
                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">{item.val}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Section 2: Animated Timeline */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
              <Clock className="text-accent" size={22} /> Relationship Timeline
            </h2>
            <span className="text-xs font-mono text-white/50">Chronological Flow</span>
          </div>

          <div className="relative pl-6 md:pl-10 border-l-2 border-primary/30 space-y-8">
            {MILESTONE_TIMELINE.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Dot Icon */}
                  <div 
                    className="absolute -left-[31px] md:-left-[47px] top-1.5 w-10 h-10 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon size={18} />
                  </div>

                  <GlassCard variant="interactive" className="p-6 space-y-3 ml-2 hover:border-primary/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="accent" size="sm">{item.category}</Badge>
                        <span className="text-xs text-white/40 font-mono">{item.date}</span>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10 w-fit">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-white group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Add Milestone Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Timeline Milestone">
        <form onSubmit={handleSaveMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Milestone Title</label>
            <input
              type="text"
              placeholder="e.g. First Trip to Paris, Apartment Key Handover"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm bg-card-dark text-white"
            >
              <option value="First Match">First Match</option>
              <option value="First Chat">First Chat</option>
              <option value="First Date">First Date</option>
              <option value="Travel">Travel</option>
              <option value="Co-Living">Co-Living</option>
              <option value="Anniversary">Anniversary</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Memory Notes & Details</label>
            <textarea
              placeholder="Describe the moment..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="w-full glass-input text-xs sm:text-sm resize-none"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <GlowButton variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </GlowButton>
            <GlowButton type="submit" variant="primary" size="sm">
              Save Milestone
            </GlowButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
