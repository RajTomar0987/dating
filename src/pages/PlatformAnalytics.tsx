import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Heart, MessageSquare, Cpu, Activity, Zap, Flame, ShieldCheck, CheckCircle2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useAppStore } from '../store/useAppStore';

const WEEKLY_METRICS = [
  { day: 'Mon', matches: 4, aiQueries: 12, responseRate: 94, harmony: 92 },
  { day: 'Tue', matches: 6, aiQueries: 18, responseRate: 96, harmony: 95 },
  { day: 'Wed', matches: 5, aiQueries: 15, responseRate: 95, harmony: 94 },
  { day: 'Thu', matches: 8, aiQueries: 22, responseRate: 97, harmony: 96 },
  { day: 'Fri', matches: 10, aiQueries: 28, responseRate: 98, harmony: 97 },
  { day: 'Sat', matches: 12, aiQueries: 35, responseRate: 99, harmony: 98 },
  { day: 'Sun', matches: 9, aiQueries: 24, responseRate: 96, harmony: 96 }
];

export default function PlatformAnalytics() {
  const { relosScore, userProfile } = useAppStore();

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={BarChart3}>
                Personal & Ecosystem Analytics V4
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">🟢 Live Telemetry Stream</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <BarChart3 className="text-accent shrink-0" size={38} /> Performance & Harmony Dashboard
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Track your response rate, match quality index, AI interaction telemetry, activity streak, and weekly growth graphs.
            </p>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <GlassCard variant="glow" className="p-4 space-y-2 border-primary/30 text-center">
            <div className="text-[10px] text-white/50 font-mono uppercase">Response Rate</div>
            <div className="text-2xl font-display font-extrabold text-white">96.4%</div>
            <div className="text-[10px] text-emerald-400 font-mono">Top 5% Fast Responder</div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-4 space-y-2 text-center">
            <div className="text-[10px] text-white/50 font-mono uppercase">Match Quality</div>
            <div className="text-2xl font-display font-extrabold text-accent">94.2%</div>
            <div className="text-[10px] text-accent font-mono">Deep Resonance</div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-4 space-y-2 text-center">
            <div className="text-[10px] text-white/50 font-mono uppercase">Activity Streak</div>
            <div className="text-2xl font-display font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Flame size={20} fill="#F59E0B" /> 14 Days
            </div>
            <div className="text-[10px] text-amber-300 font-mono">Consistent Daily Sync</div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-4 space-y-2 text-center">
            <div className="text-[10px] text-white/50 font-mono uppercase">AI Wingman Queries</div>
            <div className="text-2xl font-display font-extrabold text-purple-400">124</div>
            <div className="text-[10px] text-purple-300 font-mono">Generated</div>
          </GlassCard>

          <GlassCard variant="glow" className="p-4 space-y-2 border-accent/30 text-center">
            <div className="text-[10px] text-white/50 font-mono uppercase">Weekly Growth</div>
            <div className="text-2xl font-display font-extrabold text-emerald-400">+18.4%</div>
            <div className="text-[10px] text-emerald-400 font-mono">High Momentum</div>
          </GlassCard>
        </div>

        {/* Progress Rings Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'RelOS Synergy Index', score: relosScore, color: '#EC4899', desc: 'Overall emotional & communicative harmony' },
            { label: 'Profile Calibration Index', score: 100, color: '#A855F7', desc: 'Completeness of MBTI, bio, and media assets' },
            { label: 'AI Assistance Utilization', score: 88, color: '#10B981', desc: 'Frequency of AI Wingman suggestions accepted' }
          ].map((ring, idx) => (
            <GlassCard key={idx} className="p-6 space-y-4 border-white/10 text-center flex flex-col items-center justify-center" hoverEffect={true}>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="transparent" />
                  <motion.circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    stroke={ring.color} 
                    strokeWidth="10" 
                    strokeDasharray={377}
                    initial={{ strokeDashoffset: 377 }}
                    animate={{ strokeDashoffset: 377 - (377 * ring.score) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-display font-extrabold text-xl text-white">
                  {ring.score}%
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">{ring.label}</h4>
                <p className="text-[11px] text-white/60 leading-relaxed max-w-xs">{ring.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Recharts Data Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <GlassCard variant="default" className="p-6 space-y-4 border-white/10">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" /> Weekly AI Wingman Telemetry
            </h3>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="aiQueries" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" name="AI Queries" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="p-6 space-y-4 border-white/10">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Heart size={18} className="text-primary" /> Daily Affinity Matches Established
            </h3>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                  <Bar dataKey="matches" fill="#A855F7" radius={[6, 6, 0, 0]} name="Matches" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

        </div>

      </main>
    </div>
  );
}
