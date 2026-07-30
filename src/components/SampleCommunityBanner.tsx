import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { SAMPLE_MODE } from '../data/sampleProfiles';

export default function SampleCommunityBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!SAMPLE_MODE || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full bg-gradient-to-r from-primary/20 via-card-dark/95 to-accent/20 border-b border-accent/30 px-4 py-2 flex items-center justify-between text-xs font-mono text-white/80 backdrop-blur-md relative z-30"
      >
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold border border-accent/40 text-[10px] uppercase">
            Sample Community
          </span>
          <span className="text-white/80 font-sans">
            These profiles are provided for demonstration while the community grows. Real users appear at the top automatically.
          </span>
        </div>

        <button 
          onClick={() => setDismissed(true)}
          className="text-white/40 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
