import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Calendar, Gift, Heart, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import AIOrb from './AIOrb';

export default function AIAssistantDock() {
  const { addToast, setActiveTab } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (actionName: string, targetTab?: string) => {
    addToast(`AI Action Triggered: ${actionName}`, 'system');
    if (targetTab) setActiveTab(targetTab);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 surface-5">
      {!isOpen && (
        <AIOrb size="sm" label="Aura AI" onClick={() => setIsOpen(true)} />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 p-5 rounded-3xl bg-[#0A0A12]/95 border border-accent/40 shadow-[0_20px_60px_rgba(236,72,153,0.3)] backdrop-blur-2xl text-white space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-accent" size={18} />
                <span className="font-display font-extrabold text-sm text-white">Aura AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleAction('Generate Flirt & Banter Suggestions', 'wingman')}
                className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 text-left text-xs font-semibold text-white flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <MessageSquare size={15} className="text-accent" />
                <span>Generate Flirt & Banter</span>
              </button>

              <button
                onClick={() => handleAction('Co-Op Date Itinerary Builder', 'planner')}
                className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 text-left text-xs font-semibold text-white flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Calendar size={15} className="text-primary" />
                <span>Plan Date Itinerary</span>
              </button>

              <button
                onClick={() => handleAction('Anniversary Gift Suggestions', 'marketplace')}
                className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 text-left text-xs font-semibold text-white flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Gift size={15} className="text-amber-400" />
                <span>Suggest Milestone Gifts</span>
              </button>

              <button
                onClick={() => handleAction('Relationship Harmony Analysis', 'coach')}
                className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 text-left text-xs font-semibold text-white flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Heart size={15} className="text-emerald-400" />
                <span>Summarize Relationship Harmony</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
