import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, Target, Award, TrendingUp, ShieldCheck, Briefcase, Zap, Globe, Sparkles, CheckCircle2 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const ROADMAP_STEPS = [
  {
    year: '2026',
    title: 'Official Launch & Neural Affinity Beta',
    target: '10,000 Active Users',
    desc: 'Deploy Core Aura Discover & Aura Companion Flagship assistant on web & iOS.',
    status: 'Active / Current'
  },
  {
    year: '2027',
    title: 'RelOS Co-Living Suite Expansion',
    target: '100,000 Active Users',
    desc: 'Roll out shared home goals, financial vault integration, and wellness tracking.',
    status: 'In Development'
  },
  {
    year: '2028',
    title: 'Scale & International Expansion',
    target: '1,000,000 Active Users',
    desc: 'Expand to EU and APAC markets with multi-lingual voice coaching.',
    status: 'Planned'
  },
  {
    year: '2029',
    title: 'Cross-Cultural AI Affinity Engine',
    target: '3.5 Million Users',
    desc: 'Launch real-time cross-cultural communication translation and relationship conflict prevention.',
    status: 'Planned'
  },
  {
    year: '2030',
    title: '#1 Global AI Relationship Platform',
    target: '10.0 Million Users',
    desc: 'Full lifetime ecosystem from initial discovery to lifelong partnership support.',
    status: 'Vision Target'
  }
];

const PROJECTION_DATA = [
  { year: '2026', users: 10, revenue: 1.8 },
  { year: '2027', users: 100, revenue: 14.4 },
  { year: '2028', users: 1000, revenue: 84.0 },
  { year: '2029', users: 3500, revenue: 245.0 },
  { year: '2030', users: 10000, revenue: 650.0 }
];

export default function InvestorVision() {
  return (
    <div className="min-h-screen bg-bg-luxury font-sans text-white p-4 sm:p-8 space-y-10 max-w-7xl mx-auto selection:bg-accent/30">
      
      {/* Confidential Vision Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="accent" size="sm" icon={Briefcase}>
              Confidential Strategic Roadmap • AuraAI 2026-2030
            </Badge>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              Investor Mode Exclusive
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
            <Compass className="text-accent shrink-0" size={38} /> 2026-2030 Investor Vision & Roadmap
          </h1>
          <p className="text-sm sm:text-base text-white/60 mt-2 max-w-3xl leading-relaxed">
            The long-term trajectory scaling AuraAI into the world's dominant AI-powered relationship ecosystem.
          </p>
        </div>

        <GlassCard className="p-4 bg-card-dark/80 border-primary/30 flex items-center gap-4 shrink-0 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <div className="text-right">
            <div className="text-xs text-white/40 font-mono uppercase">2030 Target Revenue</div>
            <div className="text-2xl font-display font-extrabold text-emerald-400">$650 Million ARR</div>
            <div className="text-[10px] text-emerald-400 font-mono">10 Million Active Couples</div>
          </div>
        </GlassCard>
      </div>

      {/* TAM SAM SOM Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard variant="glow" className="p-6 space-y-3 border-primary/30">
          <Badge variant="primary" size="sm">TAM (Total Market)</Badge>
          <h3 className="text-3xl font-display font-extrabold text-white">$12.8 Billion</h3>
          <p className="text-xs text-white/70">Global digital intimacy & relationship tech TAM by 2028.</p>
        </GlassCard>

        <GlassCard variant="glow" className="p-6 space-y-3 border-accent/30">
          <Badge variant="accent" size="sm">SAM (Serviceable Market)</Badge>
          <h3 className="text-3xl font-display font-extrabold text-white">$3.2 Billion</h3>
          <p className="text-xs text-white/70">Urban Millennial & Gen Z professionals seeking high-intent AI assistance.</p>
        </GlassCard>

        <GlassCard variant="glow" className="p-6 space-y-3 border-emerald-500/30">
          <Badge variant="success" size="sm">SOM (Obtainable Market)</Badge>
          <h3 className="text-3xl font-display font-extrabold text-white">$450 Million</h3>
          <p className="text-xs text-white/70">Target 3-year market capture via viral co-living & couple adoption.</p>
        </GlassCard>
      </section>

      {/* Animated Timeline Roadmap */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
          <Sparkles className="text-accent" size={22} /> Strategic 5-Year Growth Roadmap
        </h2>

        <div className="space-y-4">
          {ROADMAP_STEPS.map((step, idx) => (
            <GlassCard key={step.year} variant="interactive" className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-extrabold text-xl text-white shadow-lg shrink-0">
                  {step.year}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-display font-bold text-white">{step.title}</h3>
                    <Badge variant="accent" size="sm">{step.status}</Badge>
                  </div>
                  <p className="text-xs text-white/70 mt-1 font-sans">{step.desc}</p>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0">
                <div className="text-xs text-white/40 font-mono">TARGET SCALE</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">{step.target}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Recharts Projections */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard variant="default" className="p-6 space-y-4">
          <h3 className="font-bold text-base text-white">Active Users Scaling (in Thousands)</h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PROJECTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsersProj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="users" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorUsersProj)" name="Users ('000)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-6 space-y-4">
          <h3 className="font-bold text-base text-white">Annual Recurring Revenue Scaling ($M)</h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROJECTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' }} />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} name="ARR ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

    </div>
  );
}
