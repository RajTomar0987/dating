import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Award, BarChart3, Briefcase, CheckCircle2
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar 
} from 'recharts';

const REVENUE_PROJECTION_DATA = [
  { year: '2024 (Actual)', arr: 1.2, grossProfit: 0.9, usersK: 120 },
  { year: '2025 (Actual)', arr: 6.6, grossProfit: 5.1, usersK: 450 },
  { year: '2026 (Target)', arr: 28.4, grossProfit: 22.2, usersK: 1800 },
  { year: '2027 (Forecast)', arr: 84.2, grossProfit: 66.5, usersK: 4200 },
  { year: '2028 (Forecast)', arr: 195.0, grossProfit: 156.0, usersK: 8900 }
];

const RETENTION_COHORT_DATA = [
  { day: 'Day 1', retention: 94 },
  { day: 'Day 7', retention: 86 },
  { day: 'Day 14', retention: 79 },
  { day: 'Day 30', retention: 74 },
  { day: 'Day 60', retention: 68 },
  { day: 'Day 90', retention: 62 },
  { day: 'Day 180', retention: 58 }
];

export default function InvestorAnalytics() {
  return (
    <div className="min-h-screen bg-bg-luxury font-sans text-white p-4 sm:p-8 space-y-10 max-w-7xl mx-auto selection:bg-primary/30">
      
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="accent" size="sm" icon={Briefcase}>
              Confidential Investor Deck • AuraAI Inc.
            </Badge>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              Series B Investment Telemetry
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="text-accent shrink-0" size={38} /> Business Potential & Investor Analytics
          </h1>
          <p className="text-sm sm:text-base text-white/60 mt-2 max-w-3xl leading-relaxed">
            Market size opportunity, retention economics, unit margin breakdown, AI infrastructure cost efficiency, and break-even scalability.
          </p>
        </div>

        <GlassCard className="p-4 bg-card-dark/80 border-primary/30 flex items-center gap-4 shrink-0 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <div className="text-right">
            <div className="text-xs text-white/40 font-mono uppercase">Current ARR</div>
            <div className="text-2xl font-display font-extrabold text-emerald-400">$6.6M</div>
            <div className="text-[10px] text-emerald-400 font-mono">+330% YoY Growth</div>
          </div>
        </GlassCard>
      </div>

      {/* 1. Executive Unit Economics Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <GlassCard variant="glow" className="p-4 space-y-2 border-emerald-500/30">
          <div className="text-[11px] text-white/50 font-mono uppercase">LTV (Lifetime Value)</div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">$480</div>
          <div className="text-[10px] text-emerald-400 font-mono">18 Mo Avg Tenure</div>
        </GlassCard>

        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="text-[11px] text-white/50 font-mono uppercase">CAC (Acquisition)</div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">$42</div>
          <div className="text-[10px] text-emerald-400 font-mono">11.4x LTV:CAC Ratio</div>
        </GlassCard>

        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="text-[11px] text-white/50 font-mono uppercase">Premium Conversion</div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-accent">29.4%</div>
          <div className="text-[10px] text-accent font-mono">4.2x Industry Standard</div>
        </GlassCard>

        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="text-[11px] text-white/50 font-mono uppercase">Monthly Churn Rate</div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">1.8%</div>
          <div className="text-[10px] text-emerald-400 font-mono">Best-in-class retention</div>
        </GlassCard>

        <GlassCard variant="interactive" className="p-4 space-y-2">
          <div className="text-[11px] text-white/50 font-mono uppercase">AI Cost / User / Mo</div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-purple-400">$0.18</div>
          <div className="text-[10px] text-purple-300 font-mono">Model Distillation</div>
        </GlassCard>

        <GlassCard variant="glow" className="p-4 space-y-2 border-primary/30">
          <div className="text-[11px] text-white/50 font-mono uppercase">Gross Profit Margin</div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">78.4%</div>
          <div className="text-[10px] text-emerald-400 font-mono">SaaS-Grade Margins</div>
        </GlassCard>
      </div>

      {/* 2. TAM / SAM / SOM Market Opportunity */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
          <Target className="text-accent" size={22} /> Market Opportunity (TAM / SAM / SOM)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="default" className="p-6 space-y-3 bg-gradient-to-br from-primary/10 via-card-dark/80 to-transparent">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm">TAM</Badge>
              <span className="text-xs text-white/40 font-mono">Global Market</span>
            </div>
            <h3 className="text-3xl font-display font-extrabold text-white">$12.8 Billion</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Global online dating & relationship intelligence software addressable market by 2028.
            </p>
          </GlassCard>

          <GlassCard variant="default" className="p-6 space-y-3 bg-gradient-to-br from-accent/10 via-card-dark/80 to-transparent">
            <div className="flex items-center justify-between">
              <Badge variant="accent" size="sm">SAM</Badge>
              <span className="text-xs text-white/40 font-mono">Target Segments</span>
            </div>
            <h3 className="text-3xl font-display font-extrabold text-white">$3.2 Billion</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Gen Z & Millennial urban professionals seeking high-intent AI relationship assistance.
            </p>
          </GlassCard>

          <GlassCard variant="default" className="p-6 space-y-3 bg-gradient-to-br from-emerald-500/10 via-card-dark/80 to-transparent">
            <div className="flex items-center justify-between">
              <Badge variant="success" size="sm">SOM</Badge>
              <span className="text-xs text-emerald-400 font-mono font-semibold">Year 3 Capture Target</span>
            </div>
            <h3 className="text-3xl font-display font-extrabold text-white">$450 Million</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Serviceable obtainable market captured through viral RelOS co-living & couple adoption loops.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 3. Revenue & Profit Scaling Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ARR Growth Forecast */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">ARR Scaling Trajectory ($M)</h3>
              <p className="text-xs text-white/50">Historical actuals vs 2026-2028 forecast</p>
            </div>
            <Badge variant="accent" size="sm">78.4% Margin</Badge>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_PROJECTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }}
                />
                <Bar dataKey="arr" fill="#A855F7" radius={[8, 8, 0, 0]} name="ARR ($M)" />
                <Bar dataKey="grossProfit" fill="#EC4899" radius={[8, 8, 0, 0]} name="Gross Profit ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* User Retention Curve */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Cohort Retention Curve (%)</h3>
              <p className="text-xs text-white/50">Industry-leading 90-day retention at 62%</p>
            </div>
            <Badge variant="success" size="sm">62% Day-90</Badge>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RETENTION_COHORT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="retention" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

      {/* 4. Strategic Investment Thesis & Moat */}
      <GlassCard variant="glow" className="p-8 space-y-6 border-white/15 bg-card-dark/90">
        <div className="flex items-center gap-3">
          <Award className="text-accent" size={28} />
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Break-even & Competitive Moat Thesis</h2>
            <p className="text-xs text-white/60 mt-0.5">Why AuraAI outperforms legacy dating & relationship apps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <CheckCircle2 size={18} /> Profitable Break-even Achieved
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Achieved operational break-even in Q1 2026 due to high freemium conversion (29.4%) and low AI inference overhead ($0.18/mo).
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <CheckCircle2 size={18} /> Zero-Churn Couple Lifecycle
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Unlike traditional dating apps that lose users when they find a partner, Aura transitions users to Couple RelOS and Aura Companion, increasing LTV to $480+.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-accent">
              <CheckCircle2 size={18} /> Proprietary RelOS Model Distillation
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Custom relationship memory vault architecture with zero-knowledge encryption ensures high switching barriers and unshakeable customer moat.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
