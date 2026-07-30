import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { Sliders, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';

const AVAILABLE_TAGS = [
  "Artificial Intelligence", "Violin", "Classical Music", "Philosophy", "Cyberpunk", "Hiking",
  "Filmmaking", "Extreme Sports", "Travel", "Tacos", "Photography", "Rock Climbing",
  "UI/UX Design", "Sculpture", "Pottery", "Indie Music", "Coffee Shop Hopping", "Minimalism",
  "Solar Power", "Cooking", "Snowboarding", "Sustainability", "Wine Tasting", "Cabin Life",
  "Game Dev", "Synthesizers", "Indie Rock", "Houseplants", "Retro Gaming", "Anime"
];

const LOVE_LANGUAGES = ["Quality Time", "Words of Affirmation", "Acts of Service", "Physical Touch", "Receiving Gifts"];
const MBTIS = ["INTJ", "INFJ", "INTP", "INFP", "ENTJ", "ENFJ", "ENTP", "ENFP", "ISTJ", "ISFJ", "ISTP", "ISFP", "ESTJ", "ESFJ", "ESTP", "ESFP"];

export default function Matchmaker() {
  const { userProfile, setUserProfile, setActiveTab } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ ...userProfile });
  const [success, setSuccess] = useState(false);

  const handleSliderChange = (trait: string, val: number) => {
    setFormData(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [trait]: val
      }
    }));
  };

  const toggleTag = (tag: string) => {
    const current = formData.interests || [];
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    setFormData(prev => ({ ...prev, interests: updated }));
  };

  const handleSave = () => {
    setUserProfile(formData);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setActiveTab('deck');
    }, 1600);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 flex items-center justify-center relative z-10 max-w-4xl mx-auto">
        <GlassCard className="w-full max-w-[640px] p-6 md:p-8 border-white/10 relative overflow-hidden" hoverEffect={false}>
          
          {success && (
            <div className="absolute inset-0 bg-[#040408]/95 z-30 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl">
              <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mb-4 shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                <Sparkles size={36} className="animate-spin" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Resonance Matrix Calibrated!</h3>
              <p className="text-xs text-white/60">Your neural traits are synchronized with the active Swipe Deck.</p>
            </div>
          )}

          <div className="flex items-center justify-between pb-6 border-b border-white/8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-purple-300">
                <Sliders size={20} />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-white">AI Matchmaker Telemetry</h2>
                <p className="text-xs text-white/50">Tune cognitive trait coefficients for investor-grade compatibility.</p>
              </div>
            </div>
            <Badge variant="primary" size="sm">
              Step {step} of 3
            </Badge>
          </div>

          {/* Progress Indicator */}
          <div className="w-full h-1 bg-white/8 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-display font-bold text-purple-300 uppercase tracking-wider font-mono">
                  Step 1: Cognitive Trait Sliders
                </h3>
              </div>
              
              <div className="space-y-5">
                {[
                  { key: 'extroversion', left: 'Introverted', right: 'Extroverted' },
                  { key: 'adventurousness', left: 'Cautious', right: 'Adventurous' },
                  { key: 'logic', left: 'Empathetic', right: 'Logical' },
                  { key: 'empathy', left: 'Reserved', right: 'Nurturing' }
                ].map(t => {
                  const val = formData.traits?.[t.key as keyof typeof formData.traits] || 50;
                  return (
                    <div key={t.key} className="space-y-2 bg-white/[0.02] border border-white/6 p-3.5 rounded-2xl">
                      <div className="flex justify-between text-xs text-white/80 font-medium">
                        <span>{t.left}</span>
                        <span className="font-mono text-[11px] text-accent">{val}%</span>
                        <span>{t.right}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) => handleSliderChange(t.key, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  );
                })}
              </div>

              <GlowButton className="w-full mt-6" onClick={() => setStep(2)} icon={ArrowRight}>
                Next: Affinity Parameters
              </GlowButton>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xs font-display font-bold text-purple-300 uppercase tracking-wider font-mono">
                Step 2: Affinity Dimensions
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-2 font-mono">
                    MBTI Personality Archetype
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                    {MBTIS.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, personalityType: m }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                          formData.personalityType === m 
                            ? 'border-primary bg-primary/25 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)]' 
                            : 'border-white/8 bg-white/5 text-white/50 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-2 font-mono">
                    Love Language Alignment
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {LOVE_LANGUAGES.map(l => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, loveLanguage: l }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                          formData.loveLanguage === l 
                            ? 'border-accent bg-accent/25 text-white shadow-[0_0_12px_rgba(236,72,153,0.2)]' 
                            : 'border-white/8 bg-white/5 text-white/50 hover:text-white'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <GlowButton variant="secondary" className="flex-1" onClick={() => setStep(1)} icon={ArrowLeft}>
                  Back
                </GlowButton>
                <GlowButton className="flex-1" onClick={() => setStep(3)} icon={ArrowRight}>
                  Next: Interest Tags
                </GlowButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xs font-display font-bold text-purple-300 uppercase tracking-wider font-mono">
                Step 3: Lifestyle & Interest Vectors
              </h3>
              
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-3 bg-black/30 rounded-2xl border border-white/8">
                {AVAILABLE_TAGS.map(tag => {
                  const isSelected = (formData.interests || []).includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all flex items-center gap-1.5 ${
                        isSelected 
                          ? 'border-accent bg-accent/25 text-white shadow-[0_0_12px_rgba(236,72,153,0.2)]' 
                          : 'border-white/8 bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-accent" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4 mt-6">
                <GlowButton variant="secondary" className="flex-1" onClick={() => setStep(2)} icon={ArrowLeft}>
                  Back
                </GlowButton>
                <GlowButton className="flex-1" onClick={handleSave} icon={Check}>
                  Apply Calibration
                </GlowButton>
              </div>
            </div>
          )}

        </GlassCard>
      </main>
    </div>
  );
}
