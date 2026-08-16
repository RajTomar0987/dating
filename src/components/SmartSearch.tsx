import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { ApiClient } from '../api/client';
import { getValidImageUrl } from '../lib/imageUtils';

export default function SmartSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      ApiClient.searchProfiles(query.trim())
        .then(res => {
          if (res?.profiles) {
            setResults(res.profiles);
          }
        })
        .catch(err => {
          console.warn('[SmartSearch] Search notice:', err);
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

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
                placeholder="Search real members by name, @username, interest, city... (Cmd+K)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-white/40"
              />
              {loading && <Loader2 size={16} className="text-pink-400 animate-spin" />}
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Results Grid */}
            <div className="p-4 max-h-96 overflow-y-auto space-y-2">
              {results.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40">
                  {query.trim() ? 'No matching members found.' : 'Type a name or @username to search.'}
                </div>
              ) : (
                results.map(p => {
                  const avatarUrl = getValidImageUrl(p.image || p.photos?.[0] || p.images?.[0]);
                  const userHandle = p.userHandle || (p.username ? `@${p.username}` : '');

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/profile/${p.id || p.username}`);
                      }}
                      className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={avatarUrl} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{p.name || p.display_name}</h4>
                            {userHandle && (
                              <span className="text-xs font-mono font-bold text-pink-400">{userHandle}</span>
                            )}
                          </div>
                          <p className="text-xs text-white/50">{p.occupation || 'Member'} • {p.location || 'Nearby'}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/40">
                        View Profile
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
