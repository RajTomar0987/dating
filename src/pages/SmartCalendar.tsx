import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Sparkles, Clock, MapPin, Heart, Gift, Plus, Check, 
  Bot, Sun, Flame, MessageCircle, ArrowUpRight, X, Compass, Utensils, Award
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import CalendarTimelineCanvas, { TIMELINE_NODES } from '../components/CalendarTimelineCanvas';
import type { TimelineEventNode } from '../components/CalendarTimelineCanvas';
import { useAppStore } from '../store/useAppStore';

export default function SmartCalendar() {
  const { addToast, setActiveTab } = useAppStore();
  const [scrollY, setScrollY] = useState(0);
  const [selectedNode, setSelectedNode] = useState<TimelineEventNode | null>(TIMELINE_NODES[2]); // Default Today
  const [showAiPlannerModal, setShowAiPlannerModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectNode = (node: TimelineEventNode) => {
    setSelectedNode(node);
    addToast(`Inspecting 3D Timeline Node: ${node.title}`, "system");
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white relative select-none">
      {/* 3D WebGL Calendar Timeline Canvas */}
      <CalendarTimelineCanvas 
        scrollY={scrollY}
        selectedNode={selectedNode}
        onSelectNode={handleSelectNode}
      />

      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-8 relative z-10 overflow-x-hidden">
        
        {/* Top Minimal Header & Flight Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-6 bg-black/40 backdrop-blur-xl p-4 rounded-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="accent" size="sm" icon={CalendarIcon}>
                AURA.OS • 3D RELATIONSHIP TIMELINE
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                🟢 3 Active Events Synced
              </span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-3">
              Spatial Relationship Timeline
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <GlowButton variant="accent" size="md" icon={Plus} onClick={() => setActiveTab('planner')}>
              Plan Itinerary
            </GlowButton>
          </div>
        </div>

        {/* Selected Timeline Node 3D Telemetry Inspector Panel */}
        {selectedNode && (
          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* Inspector Telemetry Glass Card */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <GlassCard variant="glow" className="p-6 space-y-4 border-accent/40 bg-black/70 backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-accent font-bold uppercase">{selectedNode.type} NODE</span>
                      <Badge variant="accent" size="sm">98% Sync</Badge>
                    </div>
                    <h2 className="text-xl font-display font-extrabold text-white">{selectedNode.title}</h2>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{selectedNode.date}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-white/80">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center gap-2">
                    <Clock size={15} className="text-accent" />
                    <span>{selectedNode.time}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center gap-2">
                    <MapPin size={15} className="text-emerald-400" />
                    <span className="truncate">{selectedNode.location}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-accent/30 text-xs font-sans text-white/90 space-y-1">
                  <div className="font-bold text-accent flex items-center gap-1.5">
                    <Bot size={14} /> AI Recommendation Telemetry
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Sunny 72°F expected. Recommend scheduling arrival 20m early for optimal atmosphere.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs font-mono text-white/60">Partner: <strong className="text-white">{selectedNode.partner}</strong></span>
                  <GlowButton variant="accent" size="sm" icon={MessageCircle} onClick={() => setActiveTab('chats')}>
                    Message {selectedNode.partner.split(' ')[0]}
                  </GlowButton>
                </div>
              </GlassCard>
            </div>

            {/* Upcoming Event Hologram Cards Grid */}
            <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TIMELINE_NODES.filter(n => n.type !== 'today').map((event) => (
                <div 
                  key={event.id}
                  onClick={() => handleSelectNode(event)}
                  className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-accent/40 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-accent border border-white/10 uppercase font-bold">{event.type}</span>
                    <span className="text-white/50">{event.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{event.title}</h4>
                  <div className="text-[11px] text-white/60 font-sans flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Floating Holographic AI Planner Orb (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAiPlannerModal(true)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary via-accent to-pink-500 p-0.5 shadow-[0_0_30px_rgba(236,72,153,0.6)] cursor-pointer flex items-center justify-center"
          title="Open Aura AI Calendar Assistant"
        >
          <div className="w-full h-full rounded-full bg-[#0A0A14] flex items-center justify-center">
            <Bot size={24} className="text-accent animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
        </motion.button>
      </div>

      {/* AI Planner Modal */}
      <AnimatePresence>
        {showAiPlannerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full p-6 rounded-3xl bg-[#0A0A14] border border-accent/30 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-accent" />
                  <h3 className="text-base font-display font-bold">Aura AI Event Telemetry</h3>
                </div>
                <button onClick={() => setShowAiPlannerModal(false)} className="text-white/40 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 text-xs font-mono text-white/90 space-y-2">
                <div>BEST VENUE: <strong className="text-accent">Black Cat Jazz Club (Saturday 7:30 PM)</strong></div>
                <div>WEATHER: <strong className="text-emerald-400">Clear Skies, 72°F</strong></div>
                <div>GIFT IDEA: <strong className="text-amber-400">First Edition Architecture Art Book</strong></div>
              </div>

              <GlowButton variant="accent" size="md" className="w-full" onClick={() => setShowAiPlannerModal(false)}>
                Close AI Assistant
              </GlowButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
