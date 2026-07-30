import React, { useState } from 'react';
import { 
  Calendar, Sparkles, Sun, Clock, 
  Copy, Check, DollarSign, Gift, Coffee, Compass, 
  Smile, ShieldCheck, Star, Navigation, AlertTriangle, 
  MessageSquare, ChevronRight, ThumbsUp, PartyPopper
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import Sidebar from '../components/Sidebar';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

export default function DatePlanner() {
  const { profiles, likedProfiles, selectedPlannerMatchId, setSelectedPlannerMatchId, setActiveTab } = useAppStore();

  const matchedProfiles = profiles.filter(p => likedProfiles.includes(p.id) || p.id === '1' || p.id === '2');
  const currentMatch = profiles.find(p => p.id === selectedPlannerMatchId) || profiles[0];

  const [selectedBudget, setSelectedBudget] = useState<number>(100);
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-30');
  const [selectedTime, setSelectedTime] = useState<string>('18:30');
  const [copiedTopic, setCopiedTopic] = useState<string | null>(null);
  const [checkInRating, setCheckInRating] = useState<string | null>(null);
  const [checkInNotes, setCheckInNotes] = useState<string>('');
  const [checkInSubmitted, setCheckInSubmitted] = useState<boolean>(false);

  // 15 Intelligent Conversation Topics
  const conversationStarters = [
    { cat: "Dreams", text: "What dream are you quietly working toward right now?" },
    { cat: "Perspective", text: "What place or experience completely changed your perspective on life?" },
    { cat: "Passions", text: "What hobby or topic could you spend an entire weekend doing without getting bored?" },
    { cat: "Curiosity", text: "If you could master any skill overnight by instant download, what would it be?" },
    { cat: "Lifestyle", text: "What is your absolute favorite ritual for resetting after an intense week?" },
    { cat: "Travel", text: "What destination surprised you the most, and why?" },
    { cat: "Culture", text: "What book or documentary left a lasting footprint on how you think?" },
    { cat: "Humor", text: "What is the most absurd topic you've ever spent hours researching online?" },
    { cat: "Values", text: "What quality do you value most in long-term friendships?" },
    { cat: "Creativity", text: "If you were asked to design your ideal Sunday from scratch, how would it look?" },
    { cat: "Aesthetics", text: "What architectural style or visual aesthetic resonates with you most?" },
    { cat: "Food", text: "What secret dish or comfort food is your ultimate guilty pleasure?" },
    { cat: "Future", text: "Where do you see your creative energy focusing over the next five years?" },
    { cat: "Music", text: "What song or album feels like a soundtrack to your favorite memories?" },
    { cat: "Growth", text: "What piece of advice did someone give you that you still follow today?" }
  ];

  // Dynamic recommendations based on selected budget (£20, £50, £100, £250)
  const getBudgetDetails = (budget: number) => {
    if (budget <= 20) {
      return {
        label: "£20 — Casual & Organic",
        venue: "Botanical Gardens Walk & Organic Espresso",
        desc: "Stroll through greenhouse exhibits followed by single-origin pourovers.",
        gift: "Succulent Plant in Handcrafted Ceramic Pot",
        giftWhy: "A living plant reflects growth and thoughtful attention without pressure.",
        dressCode: "Casual Luxury — Tailored denim, clean sneakers, relaxed sweater",
        dining: "Artisan Bakery Pastries & Espresso"
      };
    } else if (budget <= 50) {
      return {
        label: "£50 — Intellectual & Cozy",
        venue: "Indie Art Bookstore & Speakeasy Jazz Lounge",
        desc: "Browse rare design books and enjoy live acoustic jazz sets in a hidden lounge.",
        gift: "First-Edition Hardcover of a Shared Favorite Author",
        giftWhy: "Shows intellectual alignment and signals shared literary taste.",
        dressCode: "Smart Casual — Layered knit, unstructured blazer, dark trousers",
        dining: "Artisanal Tapas & Craft Mocktails"
      };
    } else if (budget <= 100) {
      return {
        label: "£100 — Contemporary & Refined",
        venue: "Modern Art Gallery & Skyline Rooftop Cocktails",
        desc: "Explore contemporary sculpture exhibits then head to a heated glass rooftop view.",
        gift: "Custom Hand-Poured Botanical Soy Candle + Artisan Beans",
        giftWhy: "Fuses luxury sensory aesthetics with personal warmth.",
        dressCode: "Smart Luxury — Tailored blazer or elegant cocktail silhouette",
        dining: "Chef's Tasting Menu Starters & Wine Pairing"
      };
    } else {
      return {
        label: "£250 — Concierge VIP Experience",
        venue: "Private Museum After-Hours Tour & Michelin-Star Dining",
        desc: "Exclusive private viewing followed by a multi-course seasonal tasting menu.",
        gift: "Engraved Leather Journal + Handcrafted Gourmet Chocolates",
        giftWhy: "Expresses signature VIP prestige and long-term keepsake quality.",
        dressCode: "Formal Luxury — Tailored tuxedo jacket / evening cocktail dress",
        dining: "7-Course Chef's Tasting Menu with Vintage Cellar Pairing"
      };
    }
  };

  const currentBudgetInfo = getBudgetDetails(selectedBudget);

  const radarData = [
    { subject: 'Overall Match', score: currentMatch.compatibilityReport.overall },
    { subject: 'Communication', score: currentMatch.compatibilityReport.communication },
    { subject: 'Chemistry', score: currentMatch.compatibilityReport.chemistry },
    { subject: 'Lifestyle', score: currentMatch.compatibilityReport.lifestyle },
    { subject: 'Adventure', score: (currentMatch.compatibilityReport as any).adventure || 85 },
    { subject: 'Humor', score: 88 },
    { subject: 'Future Potential', score: currentMatch.compatibilityReport.overall + 2 }
  ];

  const handleCopyStarter = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTopic(text);
    setTimeout(() => setCopiedTopic(null), 2500);
  };

  const venuesList = [
    { name: "Art Gallery & Museum", icon: Compass, suitability: "98% Match" },
    { name: "Espresso & Roastery", icon: Coffee, suitability: "95% Match" },
    { name: "Indie Bookstore", icon: Calendar, suitability: "92% Match" },
    { name: "Skyline Rooftop", icon: Star, suitability: "90% Match" },
    { name: "Beach Stargazing Walk", icon: Sun, suitability: "88% Match" },
    { name: "Fine Culinary Dining", icon: DollarSign, suitability: "86% Match" }
  ];

  const giftSuggestions = [
    { name: "Botanical Succulent Plant", icon: Sun, why: "Represents living growth, calm focus, and thoughtful minimalism." },
    { name: "Hardcover Design Book", icon: Calendar, why: "Mirrors shared passion for aesthetics and intellectual discussion." },
    { name: "Artisan Chocolate Set", icon: Gift, why: "A classic touch of sweetness tailored to refined taste palettes." },
    { name: "Engraved Leather Notebook", icon: Star, why: "For capturing spontaneous ideas, travel logs, and joint plans." }
  ];

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto space-y-8 relative z-10">
        
        {/* Flagship Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="accent" size="sm" icon={Sparkles}>
                AuraAI Flagship Feature — Concierge Match Engine
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
              <Calendar className="text-accent" size={32} /> AuraAI Date Planner
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 font-sans">
              Curate a date tailored to your shared affinity telemetry matrix.
            </p>
          </div>

          {/* Candidate Match Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <span className="text-xs text-white/50 font-mono font-semibold uppercase shrink-0">Match:</span>
            {matchedProfiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => setSelectedPlannerMatchId(profile.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all shrink-0
                  ${selectedPlannerMatchId === profile.id 
                    ? 'bg-gradient-to-r from-primary/30 to-accent/30 border-accent text-white shadow-lg' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}
                `}
              >
                <img src={profile.images[0]} alt={profile.name} className="w-5 h-5 rounded-full object-cover border border-white/20" />
                <span>{profile.name}</span>
                <span className="text-[10px] text-accent font-mono font-bold">({profile.compatibilityReport.overall}%)</span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1: AI Compatibility Summary */}
        <GlassCard className="p-6 border-white/10" hoverEffect={false}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-accent" />
              <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                Section 1: AI Compatibility Diagnostics
              </h2>
            </div>
            <Badge variant="accent" size="sm">
              {currentMatch.compatibilityReport.overall}% Affinity Match
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Recharts Radar Graph */}
            <div className="lg:col-span-7 h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="#E2E8F0" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
                  <Radar name={currentMatch.name} dataKey="score" stroke="#EC4899" fill="#EC4899" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Trait Indicators Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              {radarData.slice(0, 5).map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs text-white/80 font-medium">
                    <span>{item.subject}</span>
                    <span className="text-accent font-mono font-bold">{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" 
                      style={{ width: `${item.score}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* SECTION 2 & 5: Date Recommendations & Weather Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Section 2: Venue Recommendations */}
          <GlassCard className="lg:col-span-8 p-6 border-white/10" hoverEffect={false}>
            <div className="flex items-center gap-2.5 mb-6">
              <Compass size={18} className="text-accent" />
              <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                Section 2: Recommended Venues for {currentMatch.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {venuesList.map((v, idx) => {
                const Icon = v.icon;
                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-accent/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-purple-300 mb-3">
                        <Icon size={18} />
                      </div>
                      <h4 className="font-display font-bold text-sm text-white mb-1">{v.name}</h4>
                      <p className="text-[10px] text-white/50">Tailored to {currentMatch.personalityType} vector.</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/8 flex justify-between items-center text-[10px] text-accent font-mono font-bold">
                      <span>{v.suitability}</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Section 5: Weather Forecast Card */}
          <GlassCard className="lg:col-span-4 p-6 border-white/10 flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Sun size={18} className="text-amber-400" />
                <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                  Section 5: Weather Forecast
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-transparent border border-white/10 mb-4">
                <div className="text-3xl font-display font-extrabold text-white mb-1">72°F / 22°C</div>
                <div className="text-xs text-white/70 font-medium">Clear Skies & Golden Hour Sunset</div>
                <div className="text-[10px] text-white/40 font-mono mt-2">Sunset projected at 7:42 PM</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 text-xs text-white/80 leading-relaxed font-sans">
              <strong className="text-accent block mb-1">AI Weather Advisory:</strong>
              Optimal conditions for an initial outdoor garden walk followed by an indoor rooftop lounge.
            </div>
          </GlassCard>
        </div>

        {/* SECTION 6: Budget Planner */}
        <GlassCard className="p-6 border-white/10" hoverEffect={false}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <DollarSign size={18} className="text-accent" />
              <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                Section 6: Interactive Budget Planner
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {[20, 50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedBudget(amt)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-display font-extrabold border transition-all cursor-pointer
                    ${selectedBudget === amt 
                      ? 'bg-gradient-to-r from-primary to-accent border-accent text-white shadow-lg scale-105' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}
                  `}
                >
                  £{amt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/8">
            <div>
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider font-semibold block mb-1">Selected Plan</span>
              <h4 className="font-display font-extrabold text-lg text-white">{currentBudgetInfo.label}</h4>
              <p className="text-xs text-white/60 mt-1">{currentBudgetInfo.desc}</p>
            </div>
            <div>
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider font-semibold block mb-1">Recommended Venue</span>
              <h4 className="font-display font-bold text-sm text-accent">{currentBudgetInfo.venue}</h4>
              <p className="text-xs text-white/60 mt-1">Dining: {currentBudgetInfo.dining}</p>
            </div>
            <div>
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider font-semibold block mb-1">Dress Code Recommendation</span>
              <h4 className="font-display font-bold text-sm text-white">{currentBudgetInfo.dressCode}</h4>
              <p className="text-xs text-white/60 mt-1">Gifts: {currentBudgetInfo.gift}</p>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 3: 15 Conversation Starters */}
        <GlassCard className="p-6 border-white/10" hoverEffect={false}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={18} className="text-accent" />
              <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                Section 3: 15 Intelligent Conversation Starters
              </h2>
            </div>
            {copiedTopic && (
              <Badge variant="success" size="sm" icon={Check}>
                Copied to Clipboard!
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {conversationStarters.map((starter, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-primary/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono uppercase font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                      #{idx + 1} {starter.cat}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed italic">"{starter.text}"</p>
                </div>

                <button
                  onClick={() => handleCopyStarter(starter.text)}
                  className="mt-3 pt-2 border-t border-white/8 text-[10px] text-white/50 hover:text-white flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>Copy Prompt</span>
                  <Copy size={12} className="group-hover:text-accent transition-colors" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* SECTION 4 & 7: Gift Suggestions & Schedule Itinerary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Section 4: Gift Suggestions */}
          <GlassCard className="lg:col-span-6 p-6 border-white/10" hoverEffect={false}>
            <div className="flex items-center gap-2.5 mb-6">
              <Gift size={18} className="text-accent" />
              <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                Section 4: Curated Gift Ideas
              </h2>
            </div>

            <div className="space-y-3">
              {giftSuggestions.map((g, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <Gift size={15} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-white">{g.name}</h4>
                    <p className="text-[11px] text-white/60 mt-0.5 font-sans leading-relaxed">{g.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Section 7: Schedule & Itinerary */}
          <GlassCard className="lg:col-span-6 p-6 border-white/10 flex flex-col justify-between" hoverEffect={false}>
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <Clock size={18} className="text-accent" />
                <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                  Section 7: Date Schedule & Itinerary
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase font-bold block mb-1">Calendar Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase font-bold block mb-1">Time</label>
                  <input 
                    type="time" 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-3 relative pl-4 border-l border-white/15">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
                  <div className="text-xs font-bold text-white">06:30 PM — Meetup & Initial Drinks</div>
                  <div className="text-[10px] text-white/50">Gallery Cafe Espresso Bar</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                  <div className="text-xs font-bold text-white">07:30 PM — Main Exhibition Walk</div>
                  <div className="text-[10px] text-white/50">Contemporary Sculpture Hall</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
                  <div className="text-xs font-bold text-white">08:45 PM — Rooftop Dessert & Wrap-up</div>
                  <div className="text-[10px] text-white/50">Estimated Duration: 2.5 Hours</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/8 flex justify-between items-center text-[10px] text-white/50 font-mono">
              <span className="flex items-center gap-1.5"><Navigation size={12} className="text-accent" /> Traffic: Light (12 min drive)</span>
              <span className="text-accent font-bold">Confirmed Sync</span>
            </div>
          </GlassCard>
        </div>

        {/* SECTION 8: AI Advice & Cheat Sheet */}
        <GlassCard className="p-6 border-white/10" hoverEffect={false}>
          <div className="flex items-center gap-2.5 mb-6">
            <ShieldCheck size={18} className="text-accent" />
            <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
              Section 8: AI Dating Advice & Signals Cheat Sheet
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Smile size={14} className="text-accent" /> Confidence Boosts
              </h4>
              <ul className="text-xs text-white/70 space-y-1.5 font-sans">
                <li>• Maintain relaxed eye contact.</li>
                <li>• Listen actively without interrupting.</li>
                <li>• Smile authentically during banter.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ThumbsUp size={14} /> Green Flags
              </h4>
              <ul className="text-xs text-white/70 space-y-1.5 font-sans">
                <li>• Asks follow-up questions about your work.</li>
                <li>• Body language tilts towards you.</li>
                <li>• Shared laughter over subtle jokes.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <AlertTriangle size={14} /> Things to Avoid
              </h4>
              <ul className="text-xs text-white/70 space-y-1.5 font-sans">
                <li>• Checking phone repeatedly.</li>
                <li>• Talking extensively about past exes.</li>
                <li>• Dominating the dialogue 80%+ of time.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <AlertTriangle size={14} /> Red Flags
              </h4>
              <ul className="text-xs text-white/70 space-y-1.5 font-sans">
                <li>• Unpolite treatment of waitstaff.</li>
                <li>• Dismissive attitude towards your passions.</li>
                <li>• Disregarding personal space boundaries.</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 9: 24-Hour After-Date Check-in Simulator */}
        <GlassCard className="p-6 border-white/10 relative overflow-hidden" hoverEffect={false}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <PartyPopper size={18} className="text-accent" />
              <h2 className="font-display font-extrabold text-base text-white uppercase tracking-wider">
                Section 9: 24-Hour Post-Date Check-in Simulator
              </h2>
            </div>
            <Badge variant="primary" size="sm">
              Automated Telemetry
            </Badge>
          </div>

          {!checkInSubmitted ? (
            <div className="space-y-6">
              <p className="text-xs text-white/70 font-sans">
                It's 24 hours after your date with <strong>{currentMatch.name}</strong>. How did the experience unfold?
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'amazing', label: '🔥 Amazing Connection!' },
                  { id: 'good', label: '😊 Good Vibe, Want 2nd Date' },
                  { id: 'friendly', label: '☕ Better as Friends' },
                  { id: 'awkward', label: '😬 Awkward Chemistry' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCheckInRating(opt.id)}
                    className={`
                      px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer
                      ${checkInRating === opt.id 
                        ? 'bg-gradient-to-r from-primary to-accent border-accent text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'}
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase font-bold block mb-1.5">Date Reflection Notes</label>
                <textarea 
                  rows={2}
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  placeholder="Share a quick thought about how it went..."
                  className="glass-input w-full text-xs"
                />
              </div>

              <GlowButton 
                onClick={() => setCheckInSubmitted(true)}
                disabled={!checkInRating}
                icon={Check}
              >
                Submit Feedback & Generate Follow-up Strategy
              </GlowButton>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-accent/15 to-transparent border border-accent/30 space-y-4">
              <div className="flex items-center gap-2 text-accent font-display font-extrabold text-sm">
                <Check size={18} /> Personalized Follow-up Strategy Generated
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Based on your feedback (<strong>{checkInRating?.toUpperCase()}</strong>), our AI recommends sending a lightweight text within 3 hours referencing the exhibit you discussed, then locking in date #2.
              </p>
              <div className="flex gap-3">
                <GlowButton size="sm" onClick={() => setActiveTab('chats')}>
                  Open Chat with {currentMatch.name}
                </GlowButton>
                <button 
                  onClick={() => setCheckInSubmitted(false)}
                  className="text-xs text-white/50 hover:text-white underline cursor-pointer"
                >
                  Reset Check-in
                </button>
              </div>
            </div>
          )}
        </GlassCard>

      </main>
    </div>
  );
}
