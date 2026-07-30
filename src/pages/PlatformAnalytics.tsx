import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Heart, MessageSquare, Cpu, DollarSign, Activity, Zap 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const METRICS_DATA = [
  { day: 'Mon', mau: 42000, messages: 120000, conversion: 28.4 },
  { day: 'Tue', mau: 43200, messages: 128000, conversion: 28.9 },
  { day: 'Wed', mau: 44100, messages: 132000, conversion: 29.1 },
  { day: 'Thu', mau: 45000, messages: 138000, conversion: 29.3 },
  { day: 'Fri', mau: 46200, messages: 145000, conversion: 29.5 },
  { day: 'Sat', mau: 47800, messages: 160000, conversion: 29.8 },
  { day: 'Sun', mau: 48920, messages: 152000, conversion: 29.4 }
];

export default function PlatformAnalytics() {
  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={BarChart3}>
                Platform Analytics & Heatmaps • Executive Suite
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">Live Data Pipeline Sync</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <BarChart3 className="text-accent shrink-0" size={38} /> Platform Business Analytics
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              High-level telemetry monitoring retention velocity, daily messaging throughput, AI token consumption, and freemium conversion heatmaps.
            </p>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GlassCard variant="glow" className="p-4 space-y-2 border-primary/30">
            <div className="text-xs text-white/50 font-mono">MAU SCALE</div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">48,920</div>
            <div className="text-[10px] text-emerald-400 font-mono">+14.2% MoM</div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-4 space-y-2">
            <div className="text-xs text-white/50 font-mono">MESSAGES / DAY</div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">152,000</div>
            <div className="text-[10px] text-emerald-400 font-mono">High Engagement</div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-4 space-y-2">
            <div className="text-xs text-white/50 font-mono">AI TOKENS / DAY</div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-purple-400">12.4M</div>
            <div className="text-[10px] text-purple-300 font-mono">$0.18 / User / Mo</div>
          </GlassCard>

          <GlassCard variant="glow" className="p-4 space-y-2 border-accent/30">
            <div className="text-xs text-white/50 font-mono">PREMIUM CONVERSION</div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-accent">29.4%</div>
            <div className="text-[10px] text-accent font-mono">Best-in-class SaaS</div>
          </GlassCard>
        </div>

        {/* Recharts Data Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard variant="default" className="p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Daily Messaging Velocity</h3>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={METRICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="messages" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorMsg)" name="Messages" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Conversion Rate Evolution (%)</h3>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={METRICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis domain={[25, 32]} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                  <Bar dataKey="conversion" fill="#EC4899" radius={[8, 8, 0, 0]} name="Conversion (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

      </main>
    </div>
  );
}
