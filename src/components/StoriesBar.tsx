import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, X } from 'lucide-react';
import { sampleProfiles } from '../data/sampleProfiles';

export default function StoriesBar() {
  const [selectedStory, setSelectedStory] = useState<typeof sampleProfiles[0] | null>(null);

  return (
    <>
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2 select-none">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-accent hover:border-accent transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-[10px] font-mono text-white/50">Your Story</span>
        </div>

        {/* Profile Stories */}
        {sampleProfiles.slice(0, 8).map((profile) => (
          <div 
            key={profile.id}
            onClick={() => setSelectedStory(profile)}
            className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
          >
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary via-accent to-purple-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.4)]">
              <img 
                src={profile.images[0]} 
                alt={profile.first_name}
                className="w-15 h-15 rounded-full object-cover border-2 border-black" 
              />
            </div>
            <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">
              {profile.first_name}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-card-dark border border-white/20 shadow-2xl space-y-4"
            >
              <div className="relative h-96">
                <img src={selectedStory.images[0]} alt={selectedStory.first_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{selectedStory.first_name}</span>
                    <span className="text-[10px] font-mono text-accent">2h ago</span>
                  </div>
                  <button onClick={() => setSelectedStory(null)} className="text-white/70 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-xs text-white/90">
                  "{selectedStory.bio}"
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
