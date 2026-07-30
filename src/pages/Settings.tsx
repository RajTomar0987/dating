import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { 
  Settings as SettingsIcon, Check, Shuffle, AlertCircle, ToggleLeft, ToggleRight, Sparkles, Save
} from 'lucide-react';

export default function Settings() {
  const { userProfile, setUserProfile } = useAppStore();
  const [formData, setFormData] = useState({ ...userProfile });
  const [success, setSuccess] = useState(false);
  const [aiToggles, setAiToggles] = useState({
    wingman: true,
    telemetry: true,
    calibration: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBioEnhance = () => {
    const enhanced = `Architecting automated reasoning systems as an AI Product Architect by day, researching modular synth patches by night. Seeking an intellectually curious creative mind to co-design future tech concepts, debate simulation theory, and swap stories over spicy ramen.`;
    setFormData(prev => ({ ...prev, bio: enhanced }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 grid grid-cols-12 gap-6 md:gap-8 items-start relative z-10 max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto">
        
        {/* Left Column: Form Settings */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-1">
            <div className="flex items-center gap-2.5">
              <SettingsIcon size={18} className="text-accent" />
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Account Configurations</h3>
            </div>
            <Badge variant="primary" size="sm">
              Telemetry Active
            </Badge>
          </div>

          <GlassCard className="p-6 border-white/10" hoverEffect={false}>
            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check size={16} /> Account parameters successfully updated.
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="settings-name" className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-2 font-mono">
                    Display Name
                  </label>
                  <input
                    id="settings-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="settings-age" className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-2 font-mono">
                    Age
                  </label>
                  <input
                    id="settings-age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="settings-occ" className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-2 font-mono">
                    Occupation
                  </label>
                  <input
                    id="settings-occ"
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="settings-loc" className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-2 font-mono">
                    Location Coordinates
                  </label>
                  <input
                    id="settings-loc"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="settings-bio" className="text-[10px] text-white/50 uppercase font-bold tracking-wider font-mono">
                    Bio Statement
                  </label>
                  <button 
                    type="button" 
                    onClick={handleBioEnhance}
                    className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Shuffle size={12} /> Enhance with AI
                  </button>
                </div>
                <textarea
                  id="settings-bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="glass-input w-full resize-none leading-relaxed"
                />
              </div>

              <GlowButton type="submit" className="w-full mt-2" icon={Save}>
                Save Configurations
              </GlowButton>
            </form>
          </GlassCard>
        </div>

        {/* Right Column: AI Toggles */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/8 mb-1">
            <Sparkles size={18} className="text-primary" />
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">AI System Toggles</h3>
          </div>

          <GlassCard className="p-6 border-white/10 space-y-6" hoverEffect={false}>
            {[
              {
                key: 'wingman' as const,
                title: "AI Wingman Assist",
                desc: "Inject strategic response prompts in active chat streams."
              },
              {
                key: 'telemetry' as const,
                title: "Log Compatibility Telemetry",
                desc: "Export affinity vectors and scores directly inside profile metrics."
              },
              {
                key: 'calibration' as const,
                title: "GPU Priority Calibration",
                desc: "Prioritize hardware compute nodes for instant compatibility charts."
              }
            ].map(toggle => {
              const isActive = aiToggles[toggle.key];
              const ToggleIcon = isActive ? ToggleRight : ToggleLeft;
              return (
                <div key={toggle.key} className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/6">
                  <div>
                    <h4 className="text-xs font-semibold text-white mb-1 font-display">{toggle.title}</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed font-sans">{toggle.desc}</p>
                  </div>
                  <button 
                    onClick={() => setAiToggles(prev => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                    className={`cursor-pointer transition-colors shrink-0 ${isActive ? 'text-accent' : 'text-white/30'}`}
                    aria-label={`Toggle ${toggle.title}`}
                  >
                    <ToggleIcon size={30} />
                  </button>
                </div>
              );
            })}
          </GlassCard>

          <GlassCard className="p-5 border-white/10 bg-white/[0.01]" hoverEffect={false}>
            <div className="flex gap-3 text-white/60">
              <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-sans">
                Configuration variables update your profile calculations in real-time across the Swipe Deck database.
              </p>
            </div>
          </GlassCard>
        </div>

      </main>
    </div>
  );
}
