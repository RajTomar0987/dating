import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Sparkles, Brain, Activity, ShieldCheck, MessageCircle, Bot, Smile, 
  Flame, TrendingUp, Zap, ArrowUpRight, X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import EmotionEngineCanvas, { EMOTION_ORB_NODES } from '../components/EmotionEngineCanvas';
import type { EmotionOrbNode } from '../components/EmotionEngineCanvas';
import { useAppStore } from '../store/useAppStore';

export default function EmotionAnalysis() {
  const { addToast, setActiveTab } = useAppStore();
  const [scrollY, setScrollY] = useState(0);
  const [selectedNode, setSelectedNode] = useState<EmotionOrbNode | null>(EMOTION_ORB_NODES[0]);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectNode = (node: EmotionOrbNode) => {
    setSelectedNode(node);
    addToast(`Zoomed 3D Emotion Telemetry: ${node.name}`, "system");
  };

  const scrollToLayer = (targetYPx: number) => {
    window.scrollTo({ top: targetYPx, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white relative select-none">
      {/* 3D WebGL Emotion Engine Canvas */}
      <EmotionEngineCanvas 
        scrollY={scrollY}
        selectedNode={selectedNode}
        onSelectNode={handleSelectNode}
      />

      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-28 md:pb-12 max-w-7xl mx-auto space-y-6 relative z-10 overflow-x-hidden">
        
        {/* Header & Flight Navigation Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-6 bg-black/40 backdrop-blur-xl p-4 rounded-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="accent" size="sm" icon={Brain}>
                AURA.OS • 3D EMOTION ENGINE
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                🟢 98% Overall Sentiment Harmony
              </span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-3">
              Spatial Emotion Engine
            </h1>
          </div>

          {/* Layer Flight Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'L1: Current Mood', target: 0 },
              { name: 'L2: Weekly Trends', target: 600 },
              { name: 'L3: Monthly Growth', target: 1200 },
              { name: 'L4: Evolution', target: 1800 }
            ].map((layer, idx) => (
              <button
                key={idx}
                onClick={() => scrollToLayer(layer.target)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all cursor-pointer"
              >
                {layer.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Emotion 3D Spatial Inspector Panel */}
        {selectedNode && (
          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* Telemetry Glass Inspector Card */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <GlassCard variant="glow" className="p-6 space-y-4 border-accent/40 bg-black/75 backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-accent font-bold uppercase">EMOTIONAL AXIS</span>
                      <Badge variant="accent" size="sm">Optimal</Badge>
                    </div>
                    <h2 className="text-xl font-display font-extrabold text-white">{selectedNode.name}</h2>
                  </div>
                  <span className="text-2xl font-display font-black text-white">{selectedNode.score}%</span>
                </div>

                <p className="text-xs text-white/80 font-sans leading-relaxed">
                  {selectedNode.sub}
                </p>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-accent/30 text-xs font-sans text-white/90 space-y-1">
                  <div className="font-bold text-accent flex items-center gap-1.5">
                    <Bot size={14} /> AI Sentiment Telemetry
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Exhibits 99.4% stability. Frequent active listening and zero negative conflict vectors.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs font-mono text-white/60">Status: <strong className="text-emerald-400">Radiant Sync</strong></span>
                  <GlowButton variant="accent" size="sm" icon={MessageCircle} onClick={() => setActiveTab('chats')}>
                    Open Telemetry Chat
                  </GlowButton>
                </div>
              </GlassCard>
            </div>

            {/* Emotion Spheres Grid List */}
            <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EMOTION_ORB_NODES.map((node) => (
                <div 
                  key={node.id}
                  onClick={() => handleSelectNode(node)}
                  className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-accent/40 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-accent border border-white/10 uppercase font-bold">Resonance</span>
                    <span className="text-emerald-400 font-bold">{node.score}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{node.name}</h4>
                  <div className="text-[11px] text-white/60 font-sans truncate">{node.sub}</div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Floating AI Sentiment Assistant Orb */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAiModal(true)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary via-accent to-pink-500 p-0.5 shadow-[0_0_30px_rgba(236,72,153,0.6)] cursor-pointer flex items-center justify-center"
          title="Open Aura AI Emotion Assistant"
        >
          <div className="w-full h-full rounded-full bg-[#0A0A14] flex items-center justify-center">
            <Bot size={24} className="text-accent animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
        </motion.button>
      </div>

      {/* AI Emotion Modal */}
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
                  <h3 className="text-base font-display font-bold">Aura AI Emotion Telemetry</h3>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-white/40 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 text-xs font-mono text-white/90 space-y-2">
                <div>PEAK SENTIMENT: <strong className="text-accent">Trust & Empathy (99% Resonance)</strong></div>
                <div>RECOMMENDATION: <strong className="text-emerald-400">Keep maintaining high response frequency!</strong></div>
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
