import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Activity, Heart, MessageSquare, Cpu, ShieldCheck, 
  DollarSign, Server, Database, Radio, RefreshCw, Zap, ArrowUpRight, TrendingUp, AlertCircle
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar 
} from 'recharts';

export default function AdminDashboard() {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Realtime Telemetry Mock State
  const [telemetry, setTelemetry] = useState({
    liveUsers: 1482,
    dau: 42890,
    matchesToday: 8940,
    messagesToday: 134200,
    aiRequests: 48920,
    avgCompatScore: 94.6,
    premiumSubscribers: 12450,
    revenueToday: 18450,
    serverUptime: 99.99,
    apiLatencyMs: 22,
    dbConnections: 84,
    realtimeSockets: 1482
  });

  const [historicalData, setHistoricalData] = useState([
    { time: '12:00', liveUsers: 1200, aiLatency: 28, revenue: 14200 },
    { time: '13:00', liveUsers: 1320, aiLatency: 25, revenue: 15400 },
    { time: '14:00', liveUsers: 1410, aiLatency: 22, revenue: 16800 },
    { time: '15:00', liveUsers: 1380, aiLatency: 24, revenue: 17100 },
    { time: '16:00', liveUsers: 1450, aiLatency: 20, revenue: 17900 },
    { time: '17:00', liveUsers: 1482, aiLatency: 22, revenue: 18450 }
  ]);

  // Auto Refresh Every 5 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const liveUserDelta = Math.floor(Math.random() * 21) - 10;
      const latencyDelta = Math.floor(Math.random() * 5) - 2;
      const revDelta = Math.floor(Math.random() * 150) + 10;
      const socketDelta = liveUserDelta;

      setTelemetry(prev => ({
        ...prev,
        liveUsers: Math.max(1200, prev.liveUsers + liveUserDelta),
        realtimeSockets: Math.max(1200, prev.realtimeSockets + socketDelta),
        messagesToday: prev.messagesToday + Math.floor(Math.random() * 15) + 5,
        aiRequests: prev.aiRequests + Math.floor(Math.random() * 8) + 2,
        revenueToday: prev.revenueToday + revDelta,
        apiLatencyMs: Math.max(15, Math.min(45, prev.apiLatencyMs + latencyDelta))
      }));

      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;

      setHistoricalData(prev => {
        const next = [...prev.slice(1)];
        next.push({
          time: timeStr,
          liveUsers: telemetry.liveUsers,
          aiLatency: telemetry.apiLatencyMs,
          revenue: telemetry.revenueToday
        });
        return next;
      });

      setLastRefreshed(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [telemetry]);

  return (
    <div className="min-h-screen bg-bg-luxury font-sans text-white p-4 sm:p-8 space-y-8 max-w-7xl mx-auto selection:bg-accent/30">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="accent" size="sm" icon={ShieldCheck}>
              Hidden Master Admin System • /admin
            </Badge>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Auto-Sync (5s)</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
            <Activity className="text-accent" size={32} /> AuraAI Command & Telemetry Center
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Real-time platform vitals, system metrics, latency monitoring, and revenue diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-white/40 font-mono">Last Telemetry Refresh</div>
            <div className="text-xs font-mono text-white/80">{lastRefreshed.toLocaleTimeString()}</div>
          </div>
          <button 
            onClick={() => setLastRefreshed(new Date())}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
            title="Force Telemetry Sync"
          >
            <RefreshCw size={16} className="animate-spin-slow" />
          </button>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <GlassCard variant="glow" className="p-4 space-y-2 border-primary/40">
          <div className="flex items-center justify-between text-white/60 text-xs font-medium">
            <span>Live Active Users</span>
            <Users size={16} className="text-primary" />
          </div>
          <motion.div 
            key={telemetry.liveUsers}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl font-display font-extrabold text-white"
          >
            {telemetry.liveUsers.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp size={12} /> +12.4% vs last hour
          </div>
        </GlassCard>

        {/* Metric 2 */}
        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-white/60 text-xs font-medium">
            <span>Daily Active Users (DAU)</span>
            <Activity size={16} className="text-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {telemetry.dau.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp size={12} /> +8.9% growth
          </div>
        </GlassCard>

        {/* Metric 3 */}
        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-white/60 text-xs font-medium">
            <span>Matches Today</span>
            <Heart size={16} className="text-pink-500 fill-pink-500/20" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {telemetry.matchesToday.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp size={12} /> 94.2% neural affinity
          </div>
        </GlassCard>

        {/* Metric 4 */}
        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-white/60 text-xs font-medium">
            <span>Messages Today</span>
            <MessageSquare size={16} className="text-blue-400" />
          </div>
          <motion.div 
            key={telemetry.messagesToday}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl font-display font-extrabold text-white"
          >
            {telemetry.messagesToday.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-white/40 font-mono">
            ~1.5k msg/min throughput
          </div>
        </GlassCard>

        {/* Metric 5 */}
        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-white/60 text-xs font-medium">
            <span>AI Requests Processed</span>
            <Cpu size={16} className="text-purple-400" />
          </div>
          <motion.div 
            key={telemetry.aiRequests}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl font-display font-extrabold text-white"
          >
            {telemetry.aiRequests.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-purple-300 font-mono">
            Gemini 3.1 Pro + Wingman engine
          </div>
        </GlassCard>

        {/* Metric 6 */}
        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-white/60 text-xs font-medium">
            <span>Avg Compatibility Score</span>
            <Zap size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {telemetry.avgCompatScore}%
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">
            High relational satisfaction
          </div>
        </GlassCard>

        {/* Metric 7 */}
        <GlassCard variant="glow" className="p-4 space-y-2 border-accent/40">
          <div className="flex items-center justify-between text-white/60 text-xs font-medium">
            <span>Premium Subscribers</span>
            <ShieldCheck size={16} className="text-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {telemetry.premiumSubscribers.toLocaleString()}
          </div>
          <div className="text-[10px] text-accent font-mono">
            29.0% Conversion Rate
          </div>
        </GlassCard>

        {/* Metric 8 */}
        <GlassCard variant="glow" className="p-4 space-y-2 border-emerald-500/40">
          <div className="flex items-center justify-between text-white/60 text-xs font-medium">
            <span>Revenue Today (Mock)</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <motion.div 
            key={telemetry.revenueToday}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400"
          >
            ${telemetry.revenueToday.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-emerald-400 font-mono">
            MRR Runway: $553,500/mo
          </div>
        </GlassCard>
      </div>

      {/* System Infrastructure Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-4 flex items-center gap-3">
          <Server className="text-emerald-400 shrink-0" size={24} />
          <div>
            <div className="text-xs text-white/50 font-mono">SERVER CLUSTER</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Operational</span>
              <span className="text-xs font-mono text-emerald-400">({telemetry.serverUptime}%)</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex items-center gap-3">
          <Zap className="text-blue-400 shrink-0" size={24} />
          <div>
            <div className="text-xs text-white/50 font-mono">API STATUS & LATENCY</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Healthy</span>
              <span className="text-xs font-mono text-blue-400">({telemetry.apiLatencyMs}ms)</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex items-center gap-3">
          <Database className="text-purple-400 shrink-0" size={24} />
          <div>
            <div className="text-xs text-white/50 font-mono">DATABASE CLUSTER</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>PostgreSQL 16</span>
              <span className="text-xs font-mono text-purple-400">({telemetry.dbConnections} Conns)</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4 flex items-center gap-3">
          <Radio className="text-pink-400 shrink-0" size={24} />
          <div>
            <div className="text-xs text-white/50 font-mono">REALTIME SOCKETS</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Connected</span>
              <span className="text-xs font-mono text-pink-400">({telemetry.realtimeSockets} Sockets)</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Realtime Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Live Active Users & API Latency</h3>
              <p className="text-xs text-white/50">Realtime telemetry telemetry over 5-second polling intervals</p>
            </div>
            <span className="text-xs font-mono text-primary">Live Feed</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="liveUsers" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Daily Cumulative Revenue ($)</h3>
              <p className="text-xs text-white/50">Live mock transaction stream and VIP conversion velocity</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">$18,450 / day</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
