import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Shield, Bell, Cpu, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Badge from './Badge';

export default function DynamicIsland() {
  const { notifications, addToast } = useAppStore();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 surface-4 pointer-events-auto max-w-[calc(100vw-24px)]">
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="dynamic-island px-3.5 py-1.5 md:px-4 md:py-2 flex items-center gap-3 cursor-pointer select-none max-w-full"
        animate={{ width: isExpanded ? Math.min(420, typeof window !== 'undefined' ? window.innerWidth - 32 : 360) : 'auto' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Live Pulse Indicator */}
        <div className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="absolute w-4 h-4 rounded-full bg-emerald-400/50 animate-ping" />
        </div>

        {/* Compact Island Status View */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-display font-extrabold tracking-wider text-white">
            AURA<span className="text-accent">.OS</span>
          </span>
          <span className="text-[10px] font-mono text-white/50 uppercase hidden sm:inline">
            • Neural Sync Active
          </span>
        </div>

        {/* Action Indicators */}
        <div className="flex items-center gap-2 ml-auto">
          {notifications.length > 0 && (
            <Badge variant="accent" size="sm" icon={Bell}>
              {notifications.length}
            </Badge>
          )}

          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <Cpu size={12} />
          </div>

          <ChevronDown 
            size={14} 
            className={`text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </motion.div>

      {/* Expanded Island Menu Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 w-96 p-5 rounded-3xl bg-[#0A0A12]/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono text-white/50 pb-2 border-b border-white/8">
              <span>SYSTEM DIAGNOSTICS</span>
              <span className="text-emerald-400 font-bold">99.99% HEALTH</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div 
                onClick={() => { navigate('/models'); setIsExpanded(false); }}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-accent/40 transition-colors cursor-pointer space-y-1"
              >
                <div className="text-white/50 font-mono text-[10px]">AI ROUTER</div>
                <div className="font-bold text-white flex items-center gap-1">
                  <Cpu size={13} className="text-accent" /> Gemini 3.1 Pro
                </div>
              </div>

              <div 
                onClick={() => { navigate('/wellness'); setIsExpanded(false); }}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-accent/40 transition-colors cursor-pointer space-y-1"
              >
                <div className="text-white/50 font-mono text-[10px]">HARMONY VITALS</div>
                <div className="font-bold text-emerald-400 flex items-center gap-1">
                  <Activity size={13} /> 98% Affinity
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addToast("Triggered Instant AI System Refresh", "system");
                setIsExpanded(false);
              }}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95 transition-opacity"
            >
              Run System Diagnostic
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
