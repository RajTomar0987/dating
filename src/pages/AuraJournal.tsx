import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Sparkles, Plus, Search, Tag, Calendar, Heart, Lock, 
  Brain, ShieldCheck, ChevronRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useAppStore } from '../store/useAppStore';

export default function AuraJournal() {
  const { journalEntries, addJournalEntry, addToast } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Radiant');
  const [tagInput, setTagInput] = useState('#Reflection');

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || entry.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    const tagsArr = tagInput.split(' ').map(t => t.trim()).filter(Boolean);
    addJournalEntry(title, content, mood, tagsArr);
    addToast('Reflection saved to private AI Journal', 'system');
    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={BookOpen}>
                Aura Journal Module • Private AI Vault
              </Badge>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Lock size={12} /> End-to-End Encrypted
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <BookOpen className="text-primary shrink-0" size={38} /> Aura AI Journal
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Your private space for daily relationship reflections, weekly emotional summaries, and AI-guided gratitude prompts.
            </p>
          </div>

          <GlowButton variant="primary" size="md" onClick={() => setShowAddModal(true)} icon={Plus}>
            New Journal Entry
          </GlowButton>
        </div>

        {/* AI Weekly Reflection Summary Banner */}
        <GlassCard variant="glow" className="p-6 bg-gradient-to-r from-primary/15 via-card-dark/90 to-accent/15 border-primary/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-accent font-bold">
              <Sparkles size={14} /> AI WEEKLY SYNTHESIS
            </div>
            <Badge variant="accent" size="sm">Week 30</Badge>
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            "Your joint appreciation for quiet evening rituals and deep conversations increased emotional security by 14%."
          </h3>
          <p className="text-xs text-white/70">
            Aura synthesized your 5 latest journal entries to surface key connection themes.
          </p>
        </GlassCard>

        {/* Search & Tag Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search previous journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input pl-10 text-xs sm:text-sm"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['All', '#Travel', '#Milestone', '#Art', '#Banter', '#Gratitude'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border
                  ${selectedTag === t
                    ? 'bg-primary/25 border-primary text-white font-semibold'
                    : 'bg-white/5 border-white/8 text-white/60 hover:text-white'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Journal Entries Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => (
            <GlassCard key={entry.id} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40 font-mono flex items-center gap-1">
                    <Calendar size={13} /> {entry.date}
                  </span>
                  <Badge variant="accent" size="sm">{entry.mood}</Badge>
                </div>

                <h3 className="font-display font-bold text-lg text-white hover:text-accent transition-colors">
                  {entry.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                  "{entry.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {entry.tags.map((tg, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-accent border border-white/10">
                      {tg}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => addToast('Journal entry saved to cloud backup.', 'system')}
                  className="text-xs text-white/40 hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                >
                  <span>Encrypted</span>
                  <Lock size={12} />
                </button>
              </div>
            </GlassCard>
          ))}
        </section>

      </main>

      {/* New Journal Entry Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New AI-Assisted Journal Entry">
        <form onSubmit={handleSaveEntry} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Reflection Title</label>
            <input
              type="text"
              placeholder="e.g. Late Night Conversation & Oaxaca Ideas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Mood Tag</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm bg-card-dark text-white"
            >
              <option value="Radiant">Radiant</option>
              <option value="Thoughtful">Thoughtful</option>
              <option value="Grateful">Grateful</option>
              <option value="Playful">Playful</option>
              <option value="Serene">Serene</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Tags (Space Separated)</label>
            <input
              type="text"
              placeholder="#Travel #Milestone #Art"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Daily Reflection Content</label>
            <textarea
              placeholder="What made you feel closest to your partner today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full glass-input text-xs sm:text-sm resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <GlowButton variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </GlowButton>
            <GlowButton type="submit" variant="primary" size="sm">
              Save Entry
            </GlowButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
