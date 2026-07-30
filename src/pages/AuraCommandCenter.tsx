import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Sparkles, Heart, Shield, Cpu, Calendar, MessageSquare, 
  TrendingUp, Zap, Clock, ArrowUpRight, CheckCircle2 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import HolographicRing from '../components/HolographicRing';
import MetricCube from '../components/MetricCube';
import { useAppStore } from '../store/useAppStore';
import { AUTONOMOUS_SUGGESTIONS } from '../lib/autonomousAgent';

export default function AuraCommandCenter() {
  const { setActiveTab, addToast } = useAppStore();

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Cpu}>
                Aura AI Command Center • Autonomous Intelligence
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-bold">99.4% AI Inference Confidence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Activity className="text-accent shrink-0" size={38} /> Autonomous Command Center
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Real-time relationship vitals, proactive AI assistant suggestions, mood trend analysis, and memory sync telemetry.
            </p>
          </div>

          <GlowButton variant="accent" size="md" onClick={() => addToast('Autonomous AI Engine executing background optimization', 'system')} icon={Sparkles}>
            Run Proactive AI Scan
          </GlowButton>
        </div>

        {/* Top 4 Telemetry Cubes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCube title="Relationship Vitals" value="98%" change="Optimal Harmony" icon={Heart} variant="glow" />
          <MetricCube title="AI Confidence" value="99.4%" change="Model Active" icon={Cpu} variant="interactive" />
          <MetricCube title="Pending Actions" value="4 Actions" change="High Priority" icon={Zap} variant="interactive" />
          <MetricCube title="Memory Sync" value="38 Saved" change="100% Vault Integrity" icon={Shield} variant="glow" />
        </div>

        {/* Proactive AI Action Cards Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Zap className="text-amber-400" size={20} /> Proactive AI Suggestions ({AUTONOMOUS_SUGGESTIONS.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AUTONOMOUS_SUGGESTIONS.map((item) => (
              <GlassCard key={item.id} variant="glow" className="p-6 space-y-4 border-amber-500/30">
                <div className="flex items-center justify-between">
                  <Badge variant={item.priority === 'high' ? 'accent' : 'primary'} size="sm">
                    {item.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <span className="text-xs font-mono text-white/40">{item.timestamp}</span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-white">{item.title}</h3>
                  <p className="text-xs text-white/50 mt-0.5">Target: {item.targetProfileName}</p>
                </div>

                <p className="text-xs text-white/80 leading-relaxed font-sans">{item.description}</p>

                <div className="pt-2 flex items-center justify-between border-t border-white/8">
                  <span className="text-[11px] font-mono text-accent">Autonomous Agent Ready</span>
                  <GlowButton 
                    variant="primary" 
                    size="sm"
                    onClick={() => {
                      addToast(`Executed action: ${item.actionText}`, 'system');
                      if (item.type === 'date') setActiveTab('planner');
                      if (item.type === 'reply') setActiveTab('wingman');
                    }}
                  >
                    {item.actionText}
                  </GlowButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Spotlight Relationship Vitals & Holographic Meter */}
        <GlassCard variant="glow" className="p-8 bg-gradient-to-br from-primary/20 via-card-dark/95 to-accent/20 border-primary/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <Badge variant="accent" size="sm">AI Co-Living Telemetry</Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Elena Rostova & Alex Rivers
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Multi-dimensional compatibility rating is at 98%. Active listening, shared minimalist design vision, and low conflict risk (12%) indicate exceptional long-term stability.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <GlowButton variant="glass" size="sm" onClick={() => setActiveTab('report')}>
                View Full Compatibility Matrix
              </GlowButton>
            </div>
          </div>

          <HolographicRing score={98} size={140} />
        </GlassCard>

      </main>
    </div>
  );
}
