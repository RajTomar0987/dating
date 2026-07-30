import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Smile, Zap, Moon, Activity, ShieldCheck, Plus, Sparkles, TrendingUp
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useAppStore } from '../store/useAppStore';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

export default function AuraWellness() {
  const { wellnessLogs, addWellnessLog, addToast } = useAppStore();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState('Radiant');
  const [stressVal, setStressVal] = useState(20);
  const [sleepVal, setSleepVal] = useState(8.4);
  const [energyVal, setEnergyVal] = useState(90);
  const [satisfactionVal, setSatisfactionVal] = useState(98);

  const latestLog = wellnessLogs[wellnessLogs.length - 1] || {
    mood: 'Radiant', stress: 18, sleep: 8.5, energy: 94, satisfaction: 98
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    addWellnessLog(selectedMood, Number(stressVal), Number(sleepVal), Number(energyVal), Number(satisfactionVal));
    addToast('Weekly Emotional Check-In Recorded!', 'system');
    setShowCheckInModal(false);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-10 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={Activity}>
                Aura Wellness Module • Emotional Health Intelligence
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">Weekly Check-in Complete</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <Heart className="text-emerald-400 shrink-0" size={38} /> Aura Wellness
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Track weekly emotional harmony, stress resilience, sleep quality, and mutual relationship satisfaction through continuous AI vitals monitoring.
            </p>
          </div>

          <GlowButton variant="primary" size="md" onClick={() => setShowCheckInModal(true)} icon={Plus}>
            New Emotional Check-in
          </GlowButton>
        </div>

        {/* Current Vital Gauges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GlassCard variant="glow" className="p-4 space-y-2 border-emerald-500/30">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono">
              <span>ACTIVE MOOD</span>
              <Smile size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-display font-extrabold text-white">{latestLog.mood}</div>
            <div className="text-[10px] text-emerald-400 font-mono">High Emotional Equilibrium</div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono">
              <span>STRESS LEVEL</span>
              <Activity size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-display font-extrabold text-white">{latestLog.stress}%</div>
            <div className="text-[10px] text-blue-400 font-mono">Low Cognitive Load</div>
          </GlassCard>

          <GlassCard variant="interactive" className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono">
              <span>SLEEP QUALITY</span>
              <Moon size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl font-display font-extrabold text-white">{latestLog.sleep} hrs</div>
            <div className="text-[10px] text-purple-300 font-mono">Deep Rest Recovery</div>
          </GlassCard>

          <GlassCard variant="glow" className="p-4 space-y-2 border-accent/30">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono">
              <span>RELATIONSHIP SATISFACTION</span>
              <Heart size={16} className="text-accent" />
            </div>
            <div className="text-2xl font-display font-extrabold text-accent">{latestLog.satisfaction}%</div>
            <div className="text-[10px] text-accent font-mono">+4.2% this week</div>
          </GlassCard>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard variant="default" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">7-Day Emotional Satisfaction & Energy</h3>
                <p className="text-xs text-white/50">Tracking emotional harmony trend lines</p>
              </div>
              <Badge variant="accent" size="sm">Radiant Sync</Badge>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wellnessLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSatis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis domain={[70, 100]} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="satisfaction" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorSatis)" name="Satisfaction (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard variant="default" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Weekly Stress Reduction Breakdown</h3>
                <p className="text-xs text-white/50">Lower score indicates higher calm</p>
              </div>
              <Badge variant="success" size="sm">Optimal Calm</Badge>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wellnessLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                  <Bar dataKey="stress" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Stress Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

      </main>

      {/* Check-In Modal */}
      <Modal isOpen={showCheckInModal} onClose={() => setShowCheckInModal(false)} title="Weekly Emotional Check-In">
        <form onSubmit={handleSaveCheckIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Select Current Mood</label>
            <div className="grid grid-cols-3 gap-2">
              {['Radiant', 'Serene', 'Euphoric', 'Focused', 'Balanced', 'Thoughtful'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                    selectedMood === m ? 'bg-accent/20 border-accent text-white' : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Relationship Satisfaction ({satisfactionVal}%)</label>
            <input 
              type="range" 
              min="50" 
              max="100" 
              value={satisfactionVal} 
              onChange={(e) => setSatisfactionVal(Number(e.target.value))} 
              className="w-full accent-accent cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Stress Level ({stressVal}%)</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={stressVal} 
              onChange={(e) => setStressVal(Number(e.target.value))} 
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <GlowButton variant="secondary" size="sm" onClick={() => setShowCheckInModal(false)}>
              Cancel
            </GlowButton>
            <GlowButton type="submit" variant="primary" size="sm">
              Save Check-In
            </GlowButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
