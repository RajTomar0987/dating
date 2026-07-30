import React from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { 
  User, MapPin, Briefcase, Award, Zap, Camera, ShieldCheck, TrendingUp, MessageCircle
} from 'lucide-react';

export default function Profile() {
  const { userProfile, profiles, likedProfiles, setActiveTab, setSelectedMatchId, isPremiumUser } = useAppStore();

  const matched = profiles.filter(p => likedProfiles.includes(p.id));

  return (
    <div className="flex min-h-screen bg-bg-luxury">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 grid grid-cols-12 gap-6 md:gap-8 items-start relative z-10 max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto">
        
        {/* Left Column: Profile Preview Card */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-1">
            <div className="flex items-center gap-2.5">
              <User size={18} className="text-accent" />
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Profile Telemetry</h3>
            </div>
            <Badge variant={isPremiumUser ? "accent" : "glass"} size="sm">
              {isPremiumUser ? "Aura VIP Active" : "Free Calibration"}
            </Badge>
          </div>

          <GlassCard className="p-6 border-white/10 bg-card-dark/60 text-center flex flex-col items-center gap-4 relative overflow-hidden" hoverEffect={false}>
            {/* Background Cover */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-primary/30 via-accent/30 to-pink-600/20 pointer-events-none border-b border-white/8" />
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary via-purple-600 to-accent flex items-center justify-center font-extrabold text-4xl text-white border-2 border-white/20 shadow-xl mt-10 relative z-10">
              {userProfile.name.charAt(0)}
            </div>

            <div className="relative z-10 space-y-1">
              <h2 className="text-xl font-display font-extrabold text-white flex items-center justify-center gap-1.5">
                {userProfile.name}, {userProfile.age}
                <ShieldCheck size={18} className="text-accent" />
              </h2>
              <span className="text-xs text-accent font-semibold uppercase tracking-wider font-mono">{userProfile.occupation}</span>
            </div>

            <div className="w-full flex flex-col gap-2.5 text-xs text-white/70 text-left border-y border-white/8 py-4 my-2 font-sans">
              <div className="flex items-center gap-2.5"><Briefcase size={14} className="text-primary" /> {userProfile.occupation}</div>
              <div className="flex items-center gap-2.5"><MapPin size={14} className="text-accent" /> {userProfile.location}</div>
              <div className="flex items-center gap-2.5"><Zap size={14} className="text-primary" /> MBTI Archetype: <strong className="text-white">{userProfile.personalityType}</strong></div>
              <div className="flex items-center gap-2.5"><Award size={14} className="text-accent" /> Love Language: <strong className="text-white">{userProfile.loveLanguage}</strong></div>
            </div>

            <div className="w-full text-left">
              <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2 font-mono">Core Bio Statement</h5>
              <p className="text-xs text-white/80 leading-relaxed italic bg-white/[0.02] border border-white/6 p-3 rounded-xl">"{userProfile.bio}"</p>
            </div>

            <div className="w-full text-left mt-4 border-t border-white/8 pt-4">
              <div className="flex justify-between items-center text-[10px] text-white/50 mb-1.5 font-bold uppercase tracking-wider font-mono">
                <span>Profile Calibration Index</span>
                <span className="text-accent font-bold">100%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="w-full text-left mt-2">
              <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2 font-mono">Resonance Tags</h5>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.interests?.map((tag, i) => (
                  <Badge key={i} variant="glass" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Statistics & Match Telemetry */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/8 mb-1">
            <TrendingUp size={18} className="text-accent" />
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Telemetry Telemetrics</h3>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Matches Synced", val: matched.length },
              { label: "AI Tuning Index", val: "96.4%" },
              { label: "Affinity Mean", val: "88%" }
            ].map((stat, i) => (
              <GlassCard key={i} className="p-4 border-white/10 text-center" hoverEffect={true}>
                <span className="text-[9px] text-white/50 uppercase block mb-1 font-mono font-semibold">{stat.label}</span>
                <span className="font-display font-extrabold text-2xl text-white">{stat.val}</span>
              </GlassCard>
            ))}
          </div>

          {/* Gallery */}
          <GlassCard className="p-6 border-white/10" hoverEffect={false}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <Camera size={15} className="text-accent" /> Active Media Assets (1 Active)
              </h4>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/15 bg-white/5 relative group cursor-pointer">
                <img src={userProfile.images[0]} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Profile" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Matched Signatures */}
          <GlassCard className="p-6 border-white/10" hoverEffect={false}>
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Matched Frequencies ({matched.length})
            </h4>
            
            <div className="space-y-3">
              {matched.length > 0 ? (
                matched.map(profile => (
                  <div key={profile.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={profile.images[0]} className="w-10 h-10 rounded-full object-cover border border-white/10" alt={profile.name} />
                      <div>
                        <div className="font-semibold text-xs text-white">{profile.name}</div>
                        <div className="text-[10px] text-white/50">{profile.occupation}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="accent" size="sm">
                        {profile.compatibilityReport.overall}% Affinity
                      </Badge>
                      <GlowButton 
                        variant="secondary" 
                        size="sm"
                        icon={MessageCircle}
                        onClick={() => {
                          setSelectedMatchId(profile.id);
                          setActiveTab('chats');
                        }}
                      >
                        Chat
                      </GlowButton>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/40 italic">No active matches found yet. Launch the Swipe Deck to connect.</p>
              )}
            </div>
          </GlassCard>

          {/* Achievements */}
          <GlassCard className="p-6 border-white/10" hoverEffect={false}>
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
              <Award size={15} className="text-accent" /> Calibration Achievements
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Resonance Master", desc: "Tuned MBTI coordinates to INTJ and INTP indicators." },
                { title: "Affinity Found", desc: "Detected compatibility scores over 90% in Swipe Deck." },
                { title: "Dialogue Calibrated", desc: "Sent chat messages utilizing AI Wingman recommendations." },
                { title: "Signature Verified", desc: "Completed 3 full compatibility diagnostic reports." }
              ].map((ach, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/6 space-y-1">
                  <span className="text-xs font-bold text-white block font-display">{ach.title}</span>
                  <span className="text-[10px] text-white/50 leading-relaxed block font-sans">{ach.desc}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </main>
    </div>
  );
}
