import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Sparkles, MessageSquare, TrendingUp, Mic, Video, 
  Check, ChevronDown, Star, ArrowRight, Play 
} from 'lucide-react';
import ParticleBg from '../components/ParticleBg';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';

// Custom smooth animated counter for React 19 compatibility
function CountUp({ end, duration = 2, suffix = '', decimals = 0 }: { end: number; duration?: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Ease out cubic
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easeOutProgress * end);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}</>;
}

export default function Landing() {
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const startDemoMode = useAppStore((state) => state.startDemoMode);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: Heart,
      title: "AI Matchmaking",
      desc: "Connect via deep interest matrices, MBTI dimensions, and emotional alignment heuristics."
    },
    {
      icon: Sparkles,
      title: "Personality Analysis",
      desc: "Interactive profiles analyzing 16 distinct behavioral parameters for clear bonding signals."
    },
    {
      icon: MessageSquare,
      title: "AI Wingman Assist",
      desc: "Instant conversation feedback, icebreakers, and reply prompts to eliminate anxiety."
    },
    {
      icon: TrendingUp,
      title: "Compatibility Reports",
      desc: "Detailed breakdowns of communication style, chemistry, conflict risks, and future forecasts."
    },
    {
      icon: Mic,
      title: "Voice Analysis",
      desc: "Compare vocal frequency resonances, rhythm sync, and sentiment markers."
    },
    {
      icon: Video,
      title: "Interactive Video Profiles",
      desc: "Dynamic live snippets showing active lifestyle layers and authentic energy."
    }
  ];

  const steps = [
    { num: "01", name: "Create Profile", text: "Fill details and pick active tag dimensions." },
    { num: "02", name: "AI Learns You", text: "Calibrate traits, sliders, and MBTI types." },
    { num: "03", name: "Discover Matches", text: "Review active decks with dynamic compatibility indicators." },
    { num: "04", name: "Receive AI Reports", text: "Understand chemistry vectors and date advice details." },
    { num: "05", name: "Chat with Wingman", text: "Practice drills and use suggestion engines to connect." }
  ];

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Travel Journalist",
      quote: "The compatibility report predicted we'd align on travel and spontaneity. We've been exploring Oaxaca together for six months now. Best app experience.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150"
    },
    {
      name: "Aria Chen",
      role: "Lead UI Designer",
      quote: "As a designer, I'm wowed by the UI/UX. But as a human, the wingman icebreakers took all the pressure away. Absolutely premium product.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"
    },
    {
      name: "Elena Rostova",
      role: "ML Engineer",
      quote: "The matching algorithm isn't just basic keywords. It actually mapped my logical traits and matched me with someone who shares my hyper-focuses.",
      stars: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150"
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$0",
      desc: "Begin your neural match path.",
      features: [
        "10 Swipe Deck evaluations daily",
        "Basic Compatibility matching",
        "Limited Chat streams",
        "No AI Coach integration"
      ],
      glow: false
    },
    {
      name: "Pro",
      price: "$29",
      desc: "Unlock advanced relationship analytics.",
      features: [
        "Unlimited card swiping",
        "Full AI Compatibility reports",
        "AI Wingman conversation coach",
        "Priority match recalibrations"
      ],
      glow: true
    },
    {
      name: "Premium",
      price: "$59",
      desc: "The ultimate concierge matching suite.",
      features: [
        "Everything in Pro tier",
        "Voice alignment telemetry analysis",
        "Simulated date training drills",
        "Verified VIP signature badge"
      ],
      glow: false
    }
  ];

  const faqs = [
    {
      q: "How does the AI Compatibility mapping work?",
      a: "Our system analyzes 16 psychological traits, MBTI footprints, love languages, and shared activity tags to map user profiles. It runs multi-dimensional resonance calculations to provide a dynamic affinity report."
    },
    {
      q: "What is the role of the AI Wingman dating coach?",
      a: "The Wingman helps users write outstanding profile bios, suggests tailored icebreakers for matches, and analyzes conversation screenshots to recommend funny, flirty, or deep responses."
    },
    {
      q: "Is my privacy and chat data protected?",
      a: "Absolutely. All communication streams and personality calibration logs are fully encrypted and only used to compute compatibility outputs."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-luxury">
      <ParticleBg />
      
      <div className="luxury-bg-glow">
        <div className="glow-spot-1" />
        <div className="glow-spot-2" />
      </div>

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#040408]/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('landing')}
            role="button"
            tabIndex={0}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
              <Heart className="text-white fill-white" size={18} />
            </div>
            <span className="font-display font-extrabold text-xl tracking-wider">
              AURA<span className="gradient-text">AI</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="text-sm font-medium text-white/80 hover:text-white cursor-pointer px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <GlowButton 
              size="sm"
              onClick={() => setActiveTab('signup')}
            >
              Get Started
            </GlowButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Badge variant="accent" size="lg" icon={Sparkles}>
                The World's First AI Relationship Operating System (RelOS)
              </Badge>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-none mb-6"
            >
              The AI System for <br />
              <span className="gradient-text">
                Long-Term Harmony
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/70 mb-8 max-w-xl leading-relaxed font-sans"
            >
              Partner persona modeling, shared memory vaults, proactive conflict resolution coaching, and joint life planning—all in one liquid glass experience.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <GlowButton onClick={() => setActiveTab('signup')} icon={ArrowRight} size="lg">
                Get Started
              </GlowButton>
              <GlowButton variant="secondary" onClick={startDemoMode} icon={Play} size="lg">
                Start Guided Demo
              </GlowButton>
            </motion.div>
          </div>

          {/* Hero Right Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Phone Container Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="relative w-[300px] h-[610px] rounded-[48px] border-[6px] border-white/15 bg-[#0A0A14] shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden p-3"
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Screen */}
              <div className="relative w-full h-full rounded-[38px] bg-bg-luxury overflow-hidden flex flex-col justify-between p-4 pt-8 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <Heart className="text-accent fill-accent" size={16} />
                    <span className="font-display font-bold text-xs tracking-wider">AURA</span>
                  </div>
                  <Sparkles className="text-primary" size={14} />
                </div>

                <div className="flex-1 bg-card-dark rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between relative p-3">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" 
                    alt="Mockup Profile"
                    className="absolute inset-0 w-full h-[65%] object-cover opacity-90"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="accent" size="sm" icon={Sparkles}>
                      Match: 94%
                    </Badge>
                  </div>

                  <div className="mt-[135px] relative z-10 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-10 rounded-b-xl">
                    <h4 className="font-display font-bold text-sm text-white">Elena Rostova, 26</h4>
                    <p className="text-[9px] text-white/60 mb-2">AI Scientist & Violinist</p>
                    <div className="flex gap-1 mb-2">
                      <Badge variant="glass" size="sm">INTJ</Badge>
                      <Badge variant="glass" size="sm">Quality Time</Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-2 mt-auto pt-2 border-t border-white/10">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40"><Heart size={14} /></div>
                    <div className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-primary to-accent text-[9px] font-semibold text-center text-white">AI Compatibility Report</div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent border border-accent/20"><Heart size={14} className="fill-accent/20" /></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Info Cards */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-12 -left-12 p-3 rounded-2xl bg-[#0A0A14]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-2.5 z-10"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent"><Heart size={16} className="fill-accent/20" /></div>
              <div>
                <div className="text-xs font-bold text-white">94% Compatibility</div>
                <div className="text-[9px] text-white/50 font-mono">Neural resonance match</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute top-44 -right-16 p-3 rounded-2xl bg-[#0A0A14]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-2.5 z-10"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-purple-300"><Sparkles size={16} /></div>
              <div>
                <div className="text-xs font-bold text-white">Personality Alignment</div>
                <div className="text-[9px] text-white/50 font-mono">INTJ + INTP vector</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-16 border-y border-white/8 bg-white/[0.01] relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-2">
              <CountUp end={150} duration={2.2} suffix="K+" />
            </h3>
            <p className="text-xs md:text-sm text-white/50 font-semibold uppercase tracking-wider font-mono">Matches Analysed</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-2">
              <CountUp end={96} duration={2.2} suffix="%" />
            </h3>
            <p className="text-xs md:text-sm text-white/50 font-semibold uppercase tracking-wider font-mono">Compatibility Accuracy</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-2">
              <CountUp end={2} duration={2} suffix="M+" />
            </h3>
            <p className="text-xs md:text-sm text-white/50 font-semibold uppercase tracking-wider font-mono">AI Coach Tips Generated</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-2">
              4.<CountUp end={9} duration={1.8} />★
            </h3>
            <p className="text-xs md:text-sm text-white/50 font-semibold uppercase tracking-wider font-mono">User Satisfaction Rating</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10 text-center">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold mb-4 text-white">Architected for Relationship Intelligence</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base font-sans">We combine deep neural models, semantic audio comparison, and custom tone calibration engines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={idx} variant="interactive" className="p-8 text-left">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-purple-300 mb-6 shadow-md">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-white">{feat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed font-sans">{feat.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Workflow Roadmap */}
      <section id="workflow" className="py-24 px-6 border-t border-white/8 bg-white/[0.005] relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold mb-4 text-white">Neural Calibration Roadmap</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base">Five structured steps to sync your interpersonal telemetry matrix.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-10 right-10 h-0.5 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20 z-0 pointer-events-none" />

            {steps.map((st, i) => (
              <div key={i} className="flex flex-col items-center relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 rounded-full bg-[#0A0A14] border border-white/15 flex items-center justify-center text-accent text-xl font-bold font-display shadow-2xl mb-6"
                >
                  {st.num}
                </motion.div>
                <h3 className="font-display font-bold text-lg mb-2 text-white">{st.name}</h3>
                <p className="text-xs text-white/60 leading-relaxed text-center px-2 font-sans">{st.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Dashboard Mockup */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold mb-4 text-white">The Relationship Command Center</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base">Investor-ready match statistics, compatibility projections, and message tracking in one master dashboard.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto rounded-[32px] border-[8px] border-white/15 bg-[#0A0A14] shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden p-1.5"
        >
          <div className="relative aspect-[16/10] w-full rounded-[24px] bg-bg-luxury overflow-hidden flex border border-white/10">
            <div className="w-[180px] border-r border-white/8 bg-black/40 p-4 flex flex-col gap-6 hidden sm:flex">
              <div className="flex items-center gap-2">
                <Heart className="text-accent fill-accent" size={18} />
                <span className="font-display font-bold text-sm tracking-wider">AURA</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-6 rounded-xl bg-primary/25 border border-primary/30 w-full" />
                <div className="h-6 rounded-xl bg-white/5 w-full" />
                <div className="h-6 rounded-xl bg-white/5 w-full" />
              </div>
            </div>

            <div className="flex-1 p-6 grid grid-cols-12 gap-4 overflow-y-auto">
              <div className="col-span-12 md:col-span-8 bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                  className="w-16 h-16 rounded-full object-cover border border-white/15"
                  alt="Elena"
                />
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Elena Rostova, 26</h4>
                  <p className="text-[10px] text-white/60 mb-2">94% Compatibility affinity. INTJ / INTP alignment.</p>
                  <div className="flex gap-2">
                    <Badge variant="accent" size="sm">Chemistry</Badge>
                    <Badge variant="primary" size="sm">INTJ Match</Badge>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg viewBox="0 0 100 100" className="rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#EC4899" strokeWidth="10" strokeDasharray="250" strokeDashoffset="60" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-xs text-white">94%</div>
                </div>
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-mono font-semibold">Affinity Score</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/8 bg-white/[0.005] relative z-10 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold mb-4 text-white">Matches Tuned at Scale</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base">Real success reports verified by AI calibration sensors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <GlassCard key={idx} variant="interactive" className="p-8 text-left flex flex-col justify-between">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(test.stars)].map((_, i) => (
                      <Star key={i} size={14} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-white/80 italic leading-relaxed font-sans">"{test.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-white/8">
                  <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border border-white/15" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">{test.name}</h4>
                    <p className="text-xs text-white/50">{test.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto relative z-10 text-center">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold mb-4 text-white">Synchronize Your Resonance Tier</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base">Select the perfect calibration options for your matchmaking budget.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {pricing.map((tier, index) => (
            <GlassCard 
              key={index} 
              variant={tier.glow ? 'glow' : 'interactive'}
              className="p-8 text-left flex flex-col justify-between relative"
            >
              {tier.glow && (
                <div className="absolute top-4 right-4">
                  <Badge variant="accent" size="sm">Recommended</Badge>
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-display font-extrabold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-white/50 mb-6">{tier.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-display font-extrabold text-white">{tier.price}</span>
                  <span className="text-xs text-white/50 font-mono">/ month</span>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-purple-300 mt-0.5 shrink-0">
                        <Check size={9} />
                      </div>
                      <span className="text-xs text-white/70 font-sans">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/8">
                <GlowButton 
                  variant={tier.glow ? 'primary' : 'secondary'}
                  className="w-full text-sm"
                  onClick={() => setActiveTab('signup')}
                >
                  Unlock {tier.name}
                </GlowButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold mb-4 text-white">Frequently Decoded Queries</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base">Get absolute clarity on our AI matchmaking mechanics.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <GlassCard key={idx} className="!rounded-2xl overflow-hidden" hoverEffect={false}>
              <button 
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-white text-base hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => toggleFaq(idx)}
              >
                <span>{faq.q}</span>
                <motion.div
                  animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/50"
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/8 bg-white/[0.01]"
                  >
                    <p className="p-6 text-sm text-white/70 leading-relaxed font-sans">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 bg-[#040408]/90 pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-4">
              <div className="flex items-center gap-2.5 mb-6">
                <Heart className="text-accent fill-accent" size={22} />
                <span className="font-display font-extrabold text-lg tracking-wider">AURA<span className="gradient-text">AI</span></span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed max-w-sm font-sans">
                AuraAI is a luxury-tier relationship intelligence platform utilizing personality vectoring and AI Wingman conversation coaches.
              </p>
            </div>

            <div className="md:col-span-2">
              <h5 className="font-display font-bold text-xs uppercase tracking-wider text-pink-300 mb-4 font-mono">Hub Links</h5>
              <ul className="space-y-2 text-xs text-white/50 font-sans">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#workflow" className="hover:text-white transition-colors">Workflow</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h5 className="font-display font-bold text-xs uppercase tracking-wider text-purple-300 mb-4 font-mono">Support</h5>
              <ul className="space-y-2 text-xs text-white/50 font-sans">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ Help</a></li>
                <li><span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('settings')}>Terms</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab('settings')}>Privacy</span></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h5 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-4 font-mono">Sync Telemetry Digest</h5>
              <p className="text-xs text-white/50 mb-4 leading-relaxed font-sans">Subscribe to get monthly dating intelligence reports.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email address..." 
                  className="glass-input flex-1 py-2 text-xs"
                />
                <GlowButton size="sm">
                  Subscribe
                </GlowButton>
              </div>
            </div>
          </div>

          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/40 font-mono uppercase tracking-widest">
            <span>© 2026 AuraAI Technologies, Inc. All rights reserved.</span>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer">Twitter</span>
              <span className="hover:text-white cursor-pointer">Discord</span>
              <span className="hover:text-white cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
