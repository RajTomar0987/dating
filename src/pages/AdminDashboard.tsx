import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Activity, Heart, MessageSquare, Cpu, ShieldCheck, 
  DollarSign, Server, Database, Radio, RefreshCw, Zap, TrendingUp, AlertTriangle, Check, X, Sliders, Lock, Flag
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import GlowButton from '../components/GlowButton';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useAppStore } from '../store/useAppStore';

export default function AdminDashboard() {
  const { featureFlags, toggleFeatureFlag, addToast } = useAppStore();
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeAdminTab, setActiveAdminTab] = useState<'vitals' | 'users' | 'verification' | 'flags'>('vitals');

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

  // User Management List
  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Elena Rostova', email: 'elena@aura.ai', role: 'VIP User', status: 'Active', verified: true },
    { id: 'u2', name: 'Marcus Vance', email: 'marcus@aura.ai', role: 'Creator', status: 'Active', verified: true },
    { id: 'u3', name: 'Sophia Chen', email: 'sophia@aura.ai', role: 'Member', status: 'Active', verified: true },
    { id: 'u4', name: 'Liam Vance', email: 'liam@aura.ai', role: 'Member', status: 'Flagged', verified: false }
  ]);

  // Verification Queue
  const [verifications, setVerifications] = useState([
    { id: 'v1', name: 'Aria Thorne', method: 'Pose Selfie + 2FA', submitted: '10 mins ago' },
    { id: 'v2', name: 'Lucas Sterling', method: 'Government ID + Video', submitted: '35 mins ago' }
  ]);

  // Auto Refresh Every 5 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const liveUserDelta = Math.floor(Math.random() * 21) - 10;
      const latencyDelta = Math.floor(Math.random() * 5) - 2;
      const revDelta = Math.floor(Math.random() * 150) + 10;

      setTelemetry(prev => ({
        ...prev,
        liveUsers: Math.max(1200, prev.liveUsers + liveUserDelta),
        realtimeSockets: Math.max(1200, prev.realtimeSockets + liveUserDelta),
        messagesToday: prev.messagesToday + Math.floor(Math.random() * 15) + 5,
        aiRequests: prev.aiRequests + Math.floor(Math.random() * 8) + 2,
        revenueToday: prev.revenueToday + revDelta,
        apiLatencyMs: Math.max(15, Math.min(45, prev.apiLatencyMs + latencyDelta))
      }));

      setLastRefreshed(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleUserBan = (id: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const next = u.status === 'Active' ? 'Banned' : 'Active';
        addToast(`User ${u.name} status set to ${next}`, 'system');
        return { ...u, status: next };
      }
      return u;
    }));
  };

  const handleApproveVerification = (id: string) => {
    setVerifications(prev => prev.filter(v => v.id !== id));
    addToast('Identity verification approved!', 'system');
  };

  const handleRejectVerification = (id: string) => {
    setVerifications(prev => prev.filter(v => v.id !== id));
    addToast('Identity verification rejected', 'system');
  };

  return (
    <div className="min-h-screen bg-bg-luxury font-sans text-white p-4 sm:p-8 space-y-8 max-w-7xl mx-auto selection:bg-accent/30">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="accent" size="sm" icon={ShieldCheck}>
              Master Admin Control Hub • /admin
            </Badge>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Auto-Sync (5s)</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
            <Activity className="text-accent" size={32} /> AuraAI System Command Center
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Real-time infrastructure monitoring, user moderation, verification queues, and feature flag controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-white/40 font-mono">Last Telemetry Sync</div>
            <div className="text-xs font-mono text-white/80">{lastRefreshed.toLocaleTimeString()}</div>
          </div>
          <button 
            onClick={() => {
              setLastRefreshed(new Date());
              addToast('Telemetry re-synced', 'system');
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
            title="Force Telemetry Sync"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Admin Tab Pills */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'vitals', label: 'System Vitals & Telemetry', icon: Activity },
          { id: 'users', label: 'User Moderation', icon: Users },
          { id: 'verification', label: 'Verification Requests', icon: ShieldCheck },
          { id: 'flags', label: 'Feature Flags & Controls', icon: Sliders }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as typeof activeAdminTab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeAdminTab === tab.id
                ? 'bg-accent/20 border border-accent/40 text-white shadow-lg'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <tab.icon size={14} className={activeAdminTab === tab.id ? 'text-accent' : 'text-white/40'} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: System Vitals & Telemetry */}
      {activeAdminTab === 'vitals' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            <GlassCard variant="glow" className="p-4 space-y-2 border-primary/40">
              <div className="flex items-center justify-between text-white/60 text-xs font-medium">
                <span>Live Active Users</span>
                <Users size={16} className="text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {telemetry.liveUsers.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp size={12} /> +12.4% vs last hour
              </div>
            </GlassCard>

            <GlassCard variant="interactive" className="p-4 space-y-2">
              <div className="flex items-center justify-between text-white/60 text-xs font-medium">
                <span>Daily Active Users</span>
                <Activity size={16} className="text-accent" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {telemetry.dau.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">+8.9% growth</div>
            </GlassCard>

            <GlassCard variant="interactive" className="p-4 space-y-2">
              <div className="flex items-center justify-between text-white/60 text-xs font-medium">
                <span>AI Requests Processed</span>
                <Cpu size={16} className="text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {telemetry.aiRequests.toLocaleString()}
              </div>
              <div className="text-[10px] text-purple-300 font-mono">Gemini 3.6 Flash Engine</div>
            </GlassCard>

            <GlassCard variant="glow" className="p-4 space-y-2 border-emerald-500/40">
              <div className="flex items-center justify-between text-white/60 text-xs font-medium">
                <span>Revenue Today</span>
                <DollarSign size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
                ${telemetry.revenueToday.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">MRR: $553,500/mo</div>
            </GlassCard>
          </div>

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
                <div className="text-xs text-white/50 font-mono">API LATENCY</div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Healthy</span>
                  <span className="text-xs font-mono text-blue-400">({telemetry.apiLatencyMs}ms)</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="default" className="p-4 flex items-center gap-3">
              <Database className="text-purple-400 shrink-0" size={24} />
              <div>
                <div className="text-xs text-white/50 font-mono">POSTGRES DB</div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Cluster 16</span>
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
        </div>
      )}

      {/* Tab 2: User Moderation */}
      {activeAdminTab === 'users' && (
        <GlassCard className="p-6 space-y-4 border-white/10" hoverEffect={false}>
          <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/8 pb-4">
            <Users size={18} className="text-accent" /> Account Moderation & User Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-white/10 text-white/50 font-mono uppercase text-[10px]">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-bold text-white flex items-center gap-1.5">
                      {u.name}
                      {u.verified && <ShieldCheck size={14} className="text-accent" />}
                    </td>
                    <td className="py-3 text-white/60 font-mono">{u.email}</td>
                    <td className="py-3 text-accent font-semibold">{u.role}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleUserBan(u.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                          u.status === 'Active' ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                      >
                        {u.status === 'Active' ? 'Ban User' : 'Unban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab 3: Verification Queue */}
      {activeAdminTab === 'verification' && (
        <GlassCard className="p-6 space-y-4 border-white/10" hoverEffect={false}>
          <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/8 pb-4">
            <ShieldCheck size={18} className="text-accent" /> Identity Verification Requests Queue
          </h3>

          <div className="space-y-3">
            {verifications.length > 0 ? (
              verifications.map(v => (
                <div key={v.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-white">{v.name}</h4>
                    <p className="text-[11px] text-accent font-mono">{v.method} • Submitted {v.submitted}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveVerification(v.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleRejectVerification(v.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/40 italic">All identity verification requests have been processed.</p>
            )}
          </div>
        </GlassCard>
      )}

      {/* Tab 4: Feature Flags */}
      {activeAdminTab === 'flags' && (
        <GlassCard className="p-6 space-y-6 border-white/10" hoverEffect={false}>
          <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/8 pb-4">
            <Sliders size={18} className="text-accent" /> Dynamic Feature Flag Toggles
          </h3>

          <div className="space-y-4">
            {[
              { key: 'deck3dTransitions', label: '3D Stacked Card Deck Physics', desc: 'Enable 3D perspective tilt and spring animation physics in Discover deck.' },
              { key: 'proactiveWingman', label: 'Proactive AI Wingman Assistant', desc: 'Enable persistent floating orb and automatic chat suggestions.' },
              { key: 'brandSoundAudio', label: 'Web Audio API Procedural Chime', desc: 'Play brand audio chime during splash screen sequence.' },
              { key: 'liveTelemetryFeed', label: 'Live Telemetry Toast Stream', desc: 'Simulate background telemetry notifications every 12 seconds.' }
            ].map(item => {
              const k = item.key as keyof typeof featureFlags;
              const isEnabled = featureFlags[k];
              return (
                <div key={item.key} className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.label}</h4>
                    <p className="text-[11px] text-white/60">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      toggleFeatureFlag(k);
                      addToast(`Feature flag ${item.label} toggled`, 'system');
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${isEnabled ? 'bg-accent' : 'bg-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

    </div>
  );
}
