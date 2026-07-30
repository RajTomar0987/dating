import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Sparkles, Brain, Activity, ShieldCheck, MessageCircle 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import HolographicRing from '../components/HolographicRing';

const EMOTIONAL_AXES = [
  { name: 'Happiness & Joy', score: 96, desc: 'Frequent shared humor, positive banter, and warm laughter.' },
  { name: 'Intellectual Curiosity', score: 94, desc: 'High engagement in complex philosophy, art, and neuroscience talks.' },
  { name: 'Empathy & Validation', score: 98, desc: 'Active listening and high emotional transparency.' },
  { name: 'Confidence & Safety', score: 92, desc: 'High psychological safety during deep discussion.' },
  { name: 'Mutual Interest', score: 97, desc: 'Rapid response times and balanced message length.' },
  { name: 'Supportiveness', score: 95, desc: 'Continuous encouragement toward career and creative goals.' }
];

export default function EmotionAnalysis() {
  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Brain}>
                Aura AI Sentiment & Emotional Intelligence Engine
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">95.8% Overall Harmony</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Brain className="text-accent shrink-0" size={38} /> Emotion Analysis & Sentiment
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Multi-axis sentiment analysis evaluating conversation dynamics, empathy levels, and communication health.
            </p>
          </div>
        </div>

        {/* Overall Emotional Score Card */}
        <GlassCard variant="glow" className="p-8 bg-gradient-to-r from-primary/20 via-card-dark/95 to-accent/20 border-primary/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <Badge variant="accent" size="sm">Sentiment Summary</Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Radiant Emotional Resonance
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Analysis of 142 chat transcripts shows an exceptionally healthy balance of intellectual curiosity, mutual validation, and active listening.
            </p>
          </div>

          <HolographicRing score={96} size={130} />
        </GlassCard>

        {/* 6 Emotional Axes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EMOTIONAL_AXES.map((axis, idx) => (
            <GlassCard key={idx} variant="interactive" className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-white">{axis.name}</h3>
                <Badge variant="accent" size="sm">{axis.score}%</Badge>
              </div>

              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${axis.score}%` }} />
              </div>

              <p className="text-xs text-white/70 leading-relaxed font-sans">{axis.desc}</p>
            </GlassCard>
          ))}
        </section>

      </main>
    </div>
  );
}
