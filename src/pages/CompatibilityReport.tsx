import React from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip 
} from 'recharts';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, Calendar, Map, Gift, Sparkles, Heart, TrendingUp, ShieldAlert
} from 'lucide-react';

const AI_ANALYSIS_DATA: Record<string, {
  whyMatch: string;
  communication: string;
  emotional: string;
  lifestyle: {
    travel: number;
    career: number;
    health: number;
    social: number;
    sleep: number;
    family: number;
  };
  challenges: string[];
  prediction: string;
  confidenceExplanation: string;
}> = {
  "1": {
    whyMatch: "Your personalities naturally complement one another. While you enjoy structured planning and system architectures, Elena brings a beautiful fusion of PhD machine learning research and violin artistry. This combination creates a deep, non-competitive intellectual feedback loop where logic and creative fluidity feed into each other.",
    communication: "Both of you prefer meaningful conversations over small talk. Your INTJ/INTP communication indexes suggest low-noise logical transparency. Conflict resolution is projected to run in cooperative modes, though both must remember to actively voice emotional signals instead of over-rationalizing discomfort.",
    emotional: "Extremely stable. The empathy scores (User 80% vs Elena 74%) show a balanced capability for listening. The connection feels grounding, with little space for low-value drama.",
    lifestyle: { travel: 88, career: 96, health: 80, social: 70, sleep: 75, family: 90 },
    challenges: [
      "Both partners have a tendency to disappear into research coding blocks for days, neglecting routine coordination.",
      "Risk of over-rationalizing emotional friction, leading to unresolved intellectualized distance."
    ],
    prediction: "High likelihood of a stable, long-term partnership characterized by joint project creation, mutual respect, and private humor.",
    confidenceExplanation: "High confidence (94%) based on hyper-aligned traits vectors, shared doctoral credentials, and mutual focus on computational paradigms."
  },
  "2": {
    whyMatch: "A classic balance of internal systems vs external exploration. Marcus's nomadic adventure paragliding energy will actively pull you out of your comfort zones, while your systems architecture background offers him a grounding focus point.",
    communication: "Energetic and spontaneous. Marcus communicates with high emotional warmth, which balances your quieter logical focus.",
    emotional: "Highly supportive. Marcus has an extroverted empathy score of 88% that complements your analytical focus.",
    lifestyle: { travel: 95, career: 74, health: 85, social: 90, sleep: 60, family: 70 },
    challenges: [
      "Marcus's frequent travel and documentary editing blocks make routine schedule synchronization challenging.",
      "His ENFP tendency to avoid immediate conflict in favor of keeping a positive vibe can delay critical discussions."
    ],
    prediction: "A whirlwind partnership filled with travel tickets and outdoor bouldering.",
    confidenceExplanation: "High confidence (83%) based on high chemistry indicators offset by lifestyle scheduling variances."
  }
};

export default function CompatibilityReport() {
  const { 
    profiles, 
    userProfile, 
    viewingReportProfileId, 
    setActiveTab 
  } = useAppStore();

  const targetId = viewingReportProfileId || "1";
  const profile = profiles.find(p => p.id === targetId) || profiles[0];
  const aiAnalysis = AI_ANALYSIS_DATA[targetId] || AI_ANALYSIS_DATA["1"];
  const report = profile.compatibilityReport;

  const radarData = [
    { subject: 'Extroversion', A: userProfile.traits.extroversion, B: profile.traits.extroversion, fullMark: 100 },
    { subject: 'Adventurousness', A: userProfile.traits.adventurousness, B: profile.traits.adventurousness, fullMark: 100 },
    { subject: 'Logic', A: userProfile.traits.logic, B: profile.traits.logic, fullMark: 100 },
    { subject: 'Empathy', A: userProfile.traits.empathy, B: profile.traits.empathy, fullMark: 100 }
  ];

  const statsData = [
    { name: 'Comm.', Score: report.communication },
    { name: 'Chem.', Score: report.chemistry },
    { name: 'Life.', Score: report.lifestyle },
    { name: 'Future', Score: report.longTerm }
  ];

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 grid grid-cols-12 gap-6 md:gap-8 items-start relative z-10 max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="col-span-12 flex items-center justify-between pb-4 border-b border-white/8 mb-2">
          <button 
            onClick={() => setActiveTab('deck')}
            className="flex items-center gap-2 text-xs text-white/60 hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} /> Back to Swipe Deck
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent animate-pulse" />
            <span className="font-display font-extrabold text-xs uppercase text-accent tracking-widest font-mono">
              AURA RELATIONSHIP DIAGNOSTIC
            </span>
          </div>
        </div>

        {/* Left Column: AI Diagnostics */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* Header Card */}
          <GlassCard className="p-6 md:p-8 border-white/10 relative overflow-hidden" hoverEffect={false}>
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-24 h-24 rounded-full bg-[#0A0A14] border-2 border-accent/50 flex items-center justify-center relative shadow-[0_0_35px_rgba(236,72,153,0.3)] shrink-0">
                <span className="font-display font-black text-2xl text-accent">{report.overall}%</span>
              </div>

              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="text-xl md:text-2xl font-display font-extrabold text-white">
                    Resonance Affinity with {profile.name}
                  </h2>
                  <Badge variant="primary" size="sm">
                    {profile.personalityType}
                  </Badge>
                </div>
                <p className="text-xs text-white/60 leading-relaxed max-w-lg font-sans">
                  Behavioral compatibility mapped over 16 cognitive coordinates ({userProfile.personalityType} vs {profile.personalityType}). Real-time telemetry synchronized.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Why You Match */}
          <GlassCard className="p-6 border-white/10 space-y-4" hoverEffect={false}>
            <div className="flex items-center gap-2 pb-3 border-b border-white/8">
              <Heart className="text-accent fill-accent/20" size={18} />
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white font-mono">Why You Match</h3>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-sans italic bg-white/[0.02] border border-white/6 p-4 rounded-2xl">
              "{aiAnalysis.whyMatch}"
            </p>
            <div className="space-y-1.5 pt-2">
              <h4 className="text-[10px] text-purple-300 uppercase font-bold tracking-wider font-mono">Emotional Compatibility Vector</h4>
              <p className="text-xs text-white/70 leading-relaxed">{aiAnalysis.emotional}</p>
            </div>
          </GlassCard>

          {/* Communication Style */}
          <GlassCard className="p-6 border-white/10 space-y-3" hoverEffect={false}>
            <div className="flex items-center gap-2 pb-3 border-b border-white/8">
              <Sparkles className="text-primary" size={18} />
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white font-mono">Communication Style Telemetry</h3>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              {aiAnalysis.communication}
            </p>
          </GlassCard>

          {/* Lifestyle Matrix */}
          <GlassCard className="p-6 border-white/10 space-y-5" hoverEffect={false}>
            <div className="flex items-center gap-2 pb-3 border-b border-white/8">
              <TrendingUp className="text-accent" size={18} />
              <h3 className="text-xs font-display font-bold uppercase tracking-wider text-white font-mono">Lifestyle Alignment Matrix</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: "Travel Alignment", val: aiAnalysis.lifestyle.travel },
                { label: "Career Drive Sync", val: aiAnalysis.lifestyle.career },
                { label: "Health & Diet Calibration", val: aiAnalysis.lifestyle.health },
                { label: "Social Calendar Balance", val: aiAnalysis.lifestyle.social },
                { label: "Sleep Cycle Cohesion", val: aiAnalysis.lifestyle.sleep },
                { label: "Family Goals Index", val: aiAnalysis.lifestyle.family }
              ].map((life, i) => (
                <div key={i} className="space-y-1.5 bg-white/[0.02] border border-white/6 p-3 rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-medium text-white/60 uppercase tracking-wider font-mono">
                    <span>{life.label}</span>
                    <span className="font-bold text-accent">{life.val}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${life.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Diagnostic Bar Graph */}
          <GlassCard className="p-6 border-white/10" hoverEffect={false}>
            <h4 className="text-[10px] text-purple-300 uppercase font-bold tracking-wider mb-4 font-mono">Diagnostic Alignment Matrix Graph</h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#070712', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="Score" fill="#A855F7" radius={[6, 6, 0, 0]} barSize={34} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Radar & Concepts */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Confidence Gauge */}
          <GlassCard className="p-6 border-white/10 space-y-4" hoverEffect={false}>
            <h4 className="text-[10px] text-pink-300 uppercase font-bold tracking-wider flex items-center gap-1.5 font-mono">
              <ShieldAlert size={14} className="text-accent" /> AI Diagnostic Confidence
            </h4>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-black/50 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-extrabold text-purple-300 font-display">94%</span>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                {aiAnalysis.confidenceExplanation}
              </p>
            </div>
          </GlassCard>

          {/* Traits Vector Radar */}
          <GlassCard className="p-6 border-white/10 flex flex-col items-center" hoverEffect={false}>
            <h4 className="text-[10px] text-purple-300 uppercase font-bold tracking-wider mb-4 self-start font-mono">Traits Vector Radar</h4>
            <div className="w-full h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="You" dataKey="A" stroke="#A855F7" fill="#A855F7" fillOpacity={0.3} />
                  <Radar name="Them" dataKey="B" stroke="#EC4899" fill="#EC4899" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Challenges */}
          <GlassCard className="p-6 border-white/10 space-y-4" hoverEffect={false}>
            <h5 className="text-[10px] text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1.5 font-mono">
              <AlertTriangle size={14} /> Potential Friction Points
            </h5>
            <ul className="space-y-3">
              {aiAnalysis.challenges.map((c, i) => (
                <li key={i} className="text-xs text-white/70 flex items-start gap-2.5 leading-relaxed">
                  <span className="text-amber-400 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Green Flags */}
          <GlassCard className="p-6 border-white/10 space-y-4" hoverEffect={false}>
            <div>
              <h5 className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <CheckCircle2 size={14} /> Green Flag Accelerators
              </h5>
              <ul className="space-y-2">
                {report.greenFlags ? report.greenFlags.map((st: string, i: number) => (
                  <li key={i} className="text-[11px] text-white/70 flex items-start gap-1.5 leading-normal">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{st}</span>
                  </li>
                )) : report.strengths.map((st: string, i: number) => (
                  <li key={i} className="text-[11px] text-white/70 flex items-start gap-1.5 leading-normal">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          {/* Date Concepts */}
          <GlassCard className="p-6 border-white/10 space-y-4" hoverEffect={false}>
            <div>
              <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <Calendar size={13} className="text-accent" /> Recommended First Date
              </h5>
              <p className="text-xs text-white/80 leading-relaxed bg-white/[0.02] border border-white/6 p-3 rounded-xl">
                {report.perfectFirstDate}
              </p>
            </div>

            <div>
              <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <Map size={13} className="text-primary" /> Destination Concept
              </h5>
              <p className="text-xs text-white/80 leading-relaxed bg-white/[0.02] border border-white/6 p-3 rounded-xl">
                {profile.travel ? `${profile.travel[0]} & Naoshima Island: The ideal blend of adventure and serene architecture.` : "Kyoto, Japan: Design, tea gardens, and quiet architectures."}
              </p>
            </div>

            <div>
              <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <Gift size={13} className="text-accent" /> Gift Suggestion
              </h5>
              <p className="text-xs text-white/80 leading-relaxed bg-white/[0.02] border border-white/6 p-3 rounded-xl">
                {report.giftSuggestions[0]}
              </p>
            </div>
          </GlassCard>
        </div>

      </main>
    </div>
  );
}
