import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Heart, Sparkles, MessageCircle, ShieldAlert, User, Sliders, Shield, 
  Calendar, Activity, Bot, BarChart3, Lock, BookOpen, Target, 
  ShoppingBag, Gift, Users, Code, Building2, Cpu, Play
} from 'lucide-react';
import Badge from './Badge';

export default function Sidebar() {
  const { activeTab, setActiveTab, userProfile, isPremiumUser, startDemoMode } = useAppStore();

  const ecosystemItems = [
    { id: 'companion', name: 'Aura Companion', icon: Bot, badge: 'Flagship' },
    { id: 'deck', name: 'Aura Discover', icon: Heart },
    { id: 'planner', name: 'Aura Date Planner', icon: Calendar },
    { id: 'memories', name: 'Aura Memories', icon: Sparkles },
    { id: 'goals', name: 'Aura Goals', icon: Target },
    { id: 'wellness', name: 'Aura Wellness', icon: Activity },
    { id: 'journal', name: 'Aura Journal', icon: BookOpen },
    { id: 'coach', name: 'Aura Coach', icon: ShieldAlert },
    { id: 'avatar', name: 'Aura Avatar', icon: Sparkles, badge: 'Level 4' },
    { id: 'premium', name: 'AuraAI Pro+', icon: Shield, highlight: true }
  ];

  const businessItems = [
    { id: 'marketplace', name: 'AI Marketplace', icon: Sparkles, badge: '10 Skills' },
    { id: 'store', name: 'Aura Store', icon: ShoppingBag },
    { id: 'referrals', name: 'Referral Engine', icon: Gift },
    { id: 'creators', name: 'Creator Hub', icon: Users }
  ];

  const enterpriseItems = [
    { id: 'analytics', name: 'Platform Analytics', icon: BarChart3 },
    { id: 'enterprise', name: 'Enterprise B2B', icon: Building2 },
    { id: 'developer', name: 'Developer Platform', icon: Code },
    { id: 'models', name: 'AI Model Hub', icon: Cpu },
    { id: 'investor', name: 'Investor Deck', icon: BarChart3 },
    { id: 'admin', name: 'Admin Control', icon: Lock }
  ];

  const mobileItems = [
    { id: 'companion', name: 'Companion', icon: Bot },
    { id: 'deck', name: 'Discover', icon: Heart },
    { id: 'planner', name: 'Planner', icon: Calendar },
    { id: 'memories', name: 'Memories', icon: Sparkles },
    { id: 'wellness', name: 'Wellness', icon: Activity }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-white/8 bg-[#04040A]/90 p-5 flex-col justify-between fixed top-0 bottom-0 left-0 z-30 backdrop-blur-2xl shadow-[4px_0_30px_rgba(0,0,0,0.5)] overflow-y-auto scrollbar-none">
        <div className="flex flex-col gap-5">
          {/* Logo Brand Header */}
          <div 
            className="flex items-center justify-between cursor-pointer group px-2 py-1 rounded-2xl hover:bg-white/[0.03] transition-colors" 
            onClick={() => setActiveTab('landing')}
            role="button"
            tabIndex={0}
            aria-label="Go to AuraAI Home"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-purple-600 to-accent flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform shrink-0">
                <Heart className="text-white fill-white" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base tracking-wider leading-none">
                  AURA<span className="gradient-text">AI</span>
                </span>
                <span className="text-[9px] text-accent font-mono uppercase tracking-widest mt-0.5">
                  Platform v3.0
                </span>
              </div>
            </div>
          </div>

          {/* Quick Presenter Mode Button */}
          <button
            onClick={startDemoMode}
            className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/40 text-xs font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all cursor-pointer"
          >
            <Play size={13} className="fill-white" />
            <span>Present AuraAI (5 Min)</span>
          </button>

          {/* Section 1: Ecosystem Modules */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase text-white/40 px-3 font-semibold tracking-wider">
              ECOSYSTEM MODULES
            </div>
            <nav className="flex flex-col gap-0.5" aria-label="Ecosystem Navigation">
              {ecosystemItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    aria-label={`Navigate to ${item.name}`}
                    className={`
                      w-full px-3 py-2 rounded-xl text-left font-medium text-xs flex items-center justify-between transition-all cursor-pointer border
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary/20 via-purple-600/15 to-accent/15 border-primary/35 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)] font-semibold' 
                        : item.highlight 
                        ? 'bg-accent/10 border-accent/25 text-pink-300 hover:bg-accent/20 hover:text-white'
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive ? 'text-accent fill-accent/20' : item.highlight ? 'text-accent' : 'text-white/40'} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && !isActive && (
                      <Badge variant="primary" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section 2: Marketplace & Growth */}
          <div className="space-y-1 pt-2 border-t border-white/8">
            <div className="text-[10px] font-mono uppercase text-white/40 px-3 font-semibold tracking-wider">
              MARKETPLACE & GROWTH
            </div>
            <nav className="flex flex-col gap-0.5">
              {businessItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full px-3 py-2 rounded-xl text-left font-medium text-xs flex items-center justify-between transition-all cursor-pointer border
                      ${isActive 
                        ? 'bg-primary/20 border-primary/35 text-white font-semibold' 
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive ? 'text-accent' : 'text-white/40'} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="glass" size="sm">{item.badge}</Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section 3: Enterprise & Platform */}
          <div className="space-y-1 pt-2 border-t border-white/8">
            <div className="text-[10px] font-mono uppercase text-white/40 px-3 font-semibold tracking-wider">
              ENTERPRISE & DEVELOPER
            </div>
            <nav className="flex flex-col gap-0.5">
              {enterpriseItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full px-3 py-2 rounded-xl text-left font-medium text-xs flex items-center justify-between transition-all cursor-pointer border
                      ${isActive 
                        ? 'bg-primary/20 border-primary/35 text-white font-semibold' 
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive ? 'text-accent' : 'text-white/40'} />
                      <span className="truncate">{item.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Profile Card Footer */}
        <div 
          className="flex items-center gap-3 border-t border-white/8 pt-4 px-2 cursor-pointer group hover:bg-white/[0.03] rounded-2xl p-2 transition-all mt-4" 
          onClick={() => setActiveTab('profile')}
          role="button"
          tabIndex={0}
          aria-label="View user profile"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center font-bold text-xs text-white border border-white/20 shadow-md group-hover:scale-105 transition-transform shrink-0">
              {userProfile.name.charAt(0)}
            </div>
            {isPremiumUser && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent text-white text-[8px] flex items-center justify-center font-bold border border-black shadow">
                ★
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-xs text-white truncate group-hover:text-accent transition-colors flex items-center gap-1.5">
              <span>{userProfile.name}</span>
            </div>
            <div className="text-[9px] text-white/40 uppercase font-mono tracking-wider">
              {isPremiumUser ? 'Aura Pro+' : 'Free Calibration'}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#040408]/95 border-t border-white/10 flex items-center justify-around px-3 z-40 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {mobileItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={`Navigate to ${item.name}`}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-white scale-105' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <div className={`relative ${isActive ? 'text-accent' : ''}`}>
                <Icon size={19} className={isActive ? 'fill-accent/20' : ''} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                )}
              </div>
              <span className={`text-[9px] font-medium transition-colors ${isActive ? 'text-white font-semibold' : 'text-white/40'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
