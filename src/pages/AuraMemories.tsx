import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, MapPin, Music, Utensils, Sparkles, Plus, Image as ImageIcon, 
  Clock, Bookmark, Star, ChevronRight, Award, MessageSquare, Bot, Volume2, X, Play, Coffee, Film, Gift
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import MemoryGalaxyCanvas, { GALAXY_MEMORY_NODES } from '../components/MemoryGalaxyCanvas';
import type { MemoryPlanetNode } from '../components/MemoryGalaxyCanvas';
import { useAppStore } from '../store/useAppStore';

export default function AuraMemories() {
  const { addToast, setActiveTab } = useAppStore();
  const [scrollY, setScrollY] = useState(0);
  const [selectedNode, setSelectedNode] = useState<MemoryPlanetNode | null>(GALAXY_MEMORY_NODES[0]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredNodes = activeCategory === 'All' 
    ? GALAXY_MEMORY_NODES 
    : GALAXY_MEMORY_NODES.filter(n => n.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const handleSelectNode = (node: MemoryPlanetNode) => {
    setSelectedNode(node);
    addToast(`Zoomed 3D Camera to Memory Planet: ${node.title}`, "system");
  };

  const toggleAudioPlayback = () => {
    setIsPlayingAudio(!isPlayingAudio);
    addToast(isPlayingAudio ? "Paused Voice Telemetry" : "Playing AI Encrypted Voice Recording", "system");
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white relative select-none">
      {/* 3D WebGL Memory Galaxy Canvas */}
      <MemoryGalaxyCanvas 
        scrollY={scrollY}
        selectedNode={selectedNode}
        onSelectNode={handleSelectNode}
      />

      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-6 relative z-10 overflow-x-hidden">
        
        {/* Top Header & Category Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-6 bg-black/40 backdrop-blur-xl p-4 rounded-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                AURA.OS • 3D MEMORY GALAXY
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                🟢 128 Memories Synced
              </span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-3">
              Spatial Memory Universe
            </h1>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Coffee', 'Celebration', 'Cinema', 'Travel', 'Voice Record', 'Dates'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  addToast(`Filtered Memory Galaxy: ${cat}`, "system");
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-accent text-white font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-105'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Memory 3D Spatial Inspector Panel */}
        {selectedNode && (
          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* Telemetry Glass Inspector Card */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <GlassCard variant="glow" className="p-6 space-y-4 border-accent/40 bg-black/75 backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-accent font-bold uppercase">{selectedNode.category} PLANET</span>
                      <Badge variant="accent" size="sm">98% Resonance</Badge>
                    </div>
                    <h2 className="text-xl font-display font-extrabold text-white">{selectedNode.title}</h2>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{selectedNode.date}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                  <MapPin size={14} className="text-emerald-400" />
                  <span>{selectedNode.location}</span>
                </div>

                <p className="text-xs text-white/90 font-sans leading-relaxed">
                  {selectedNode.detail}
                </p>

                {/* Voice Player Bar if Voice Node */}
                {selectedNode.isVoice && (
                  <div className="p-3.5 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-between gap-3">
                    <button 
                      onClick={toggleAudioPlayback}
                      className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center cursor-pointer shrink-0 shadow-md"
                    >
                      <Play size={16} className={isPlayingAudio ? 'animate-pulse' : ''} />
                    </button>
                    <div className="flex-1 flex items-center gap-1">
                      {[40, 70, 90, 45, 80, 100, 60, 30, 85, 95, 50, 75].map((h, idx) => (
                        <span 
                          key={idx} 
                          className={`w-1 rounded-full transition-all ${isPlayingAudio ? 'bg-accent animate-bounce' : 'bg-white/40'}`} 
                          style={{ height: `${h * 0.25}px` }} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-white/60">0:42</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs font-mono text-white/60">Vault ID: <strong className="text-accent">{selectedNode.id}</strong></span>
                  <GlowButton variant="accent" size="sm" icon={MessageSquare} onClick={() => setActiveTab('chats')}>
                    Open Telemetry Chat
                  </GlowButton>
                </div>
              </GlassCard>
            </div>

            {/* Memory Planets Grid List */}
            <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredNodes.map((node) => (
                <div 
                  key={node.id}
                  onClick={() => handleSelectNode(node)}
                  className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-accent/40 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-accent border border-white/10 uppercase font-bold">{node.category}</span>
                    <span className="text-white/50">{node.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{node.title}</h4>
                  <div className="text-[11px] text-white/60 font-sans truncate">{node.location}</div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Floating AI Memory Assistant Orb */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAiModal(true)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary via-accent to-pink-500 p-0.5 shadow-[0_0_30px_rgba(236,72,153,0.6)] cursor-pointer flex items-center justify-center"
          title="Open Aura AI Memory Assistant"
        >
          <div className="w-full h-full rounded-full bg-[#0A0A14] flex items-center justify-center">
            <Bot size={24} className="text-accent animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
        </motion.button>
      </div>

      {/* AI Memory Modal */}
      <AnimatePresence>
        {showAiModal && (
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
                  <h3 className="text-base font-display font-bold">Aura AI Memory Telemetry</h3>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-white/40 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 text-xs font-mono text-white/90 space-y-2">
                <div>MOST ROMANTIC MONTH: <strong className="text-accent">November (Birthday & Excursions)</strong></div>
                <div>FAVORITE ACTIVITY: <strong className="text-emerald-400">Artisan Coffee & Architecture</strong></div>
              </div>

              <GlowButton variant="accent" size="md" className="w-full" onClick={() => setShowAiModal(false)}>
                Close AI Telemetry
              </GlowButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
