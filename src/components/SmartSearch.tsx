import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, User, MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { sampleProfiles } from '../data/sampleProfiles';

export default function SmartSearch() {
  const { setActiveTab } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const results = sampleProfiles.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.profession.toLowerCase().includes(query.toLowerCase()) ||
    p.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-start justify-center pt-20 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl rounded-3xl bg-[#0A0A12] border border-white/15 shadow-2xl text-white overflow-hidden space-y-4"
          >
            {/* Input Bar */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search size={18} className="text-white/40" />
              <input 
                type="text"
                autoFocus
                placeholder="Search profiles, chats, memories, date ideas... (Cmd+K)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Results Grid */}
            <div className="p-4 max-h-96 overflow-y-auto space-y-2">
              {results.slice(0, 5).map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveTab('deck');
                    setIsOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{p.name}</h4>
                      <p className="text-xs text-white/50">{p.profession} • {p.city}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-accent">{p.compatibility_score}% Match</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
