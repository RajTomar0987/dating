import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, Award, Flame, UserCheck } from 'lucide-react';
import GlassCard from './GlassCard';

const FEED_EVENTS = [
  { id: 'e1', text: "Sophia matched with someone in San Francisco", time: "Just now", type: "match", icon: Heart },
  { id: 'e2', text: "Emma replied 2 minutes ago", time: "2m ago", type: "chat", icon: MessageCircle },
  { id: 'e3', text: "Olivia completed her neural profile setup", time: "5m ago", type: "profile", icon: UserCheck },
  { id: 'e4', text: "Daniel reached Level 12 AI Companion Status", time: "8m ago", type: "achievement", icon: Flame },
  { id: 'e5', text: "Aura AI generated 124 conversation suggestions today", time: "12m ago", type: "ai", icon: Sparkles }
];

export default function LiveActivityFeed() {
  const [events, setEvents] = useState(FEED_EVENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = {
        id: `e_${Date.now()}`,
        text: `New match activity logged in ecosystem`,
        time: "Just now",
        type: "match",
        icon: Heart
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard variant="glow" className="p-5 space-y-4 border-accent/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="font-display font-bold text-sm text-white">Live Platform Telemetry</h3>
        </div>
        <span className="text-[10px] font-mono text-white/40 uppercase">Realtime Feed</span>
      </div>

      <div className="space-y-2.5">
        <AnimatePresence>
          {events.map((e) => {
            const Icon = e.icon;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                    <Icon size={14} />
                  </div>
                  <span className="text-white/80 font-sans">{e.text}</span>
                </div>
                <span className="text-[10px] font-mono text-white/40 shrink-0">{e.time}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
