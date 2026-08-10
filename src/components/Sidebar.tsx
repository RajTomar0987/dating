import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../auth/useAuth';
import { 
  Heart, Sparkles, Activity, Shield, Calendar, Bot, BarChart3, Lock, 
  BookOpen, Target, ShoppingBag, Gift, Users, Code, Building2, Cpu, 
  Play, Brain, ShieldCheck, MessageCircle, LogOut
} from 'lucide-react';
import Badge from './Badge';

// Map sidebar IDs to URL routes
const ROUTE_MAP: Record<string, string> = {
  companion: '/companion',
  home: '/dashboard',
  deck: '/discover',
  chats: '/chat',
  calendar: '/calendar',
  emotion: '/emotion',
  communities: '/communities',
  safety: '/safety',
  planner: '/planner',
  memories: '/memories',
  goals: '/goals',
  wellness: '/wellness',
  journal: '/journal',
  coach: '/coach',
  avatar: '/avatar',
  premium: '/premium',
  marketplace: '/marketplace',
  store: '/store',
  referrals: '/referrals',
  creators: '/creators',
  analytics: '/analytics',
  enterprise: '/enterprise',
  developer: '/developer',
  models: '/models',
  investor: '/investor',
  admin: '/admin',
  profile: '/profile',
  matchmaker: '/matchmaker',
  wingman: '/wingman',
  report: '/report',
  settings: '/settings',
};

// Reverse map: route → sidebar ID
function getActiveId(pathname: string): string {
  for (const [id, route] of Object.entries(ROUTE_MAP)) {
    if (pathname === route) return id;
  }
  return '';
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, isPremiumUser } = useAppStore();
  const { logout, profile } = useAuth();
  const activeId = getActiveId(location.pathname);

  const navigateTo = (id: string) => {
    const route = ROUTE_MAP[id];
    if (route) navigate(route);
  };

  const ecosystemItems = [
    { id: 'companion', name: 'Aura Companion', icon: Bot, badge: 'Flagship AI' },
    { id: 'home', name: 'Live Dashboard', icon: Activity, badge: 'Live' },
    { id: 'deck', name: 'Aura Discover', icon: Heart },
    { id: 'chats', name: 'Chats', icon: MessageCircle, badge: 'Live' },
    { id: 'calendar', name: 'Smart Calendar', icon: Calendar },
    { id: 'emotion', name: 'Emotion Analysis', icon: Brain },
    { id: 'communities', name: 'Communities', icon: Users },
    { id: 'safety', name: 'Safety & Privacy', icon: ShieldCheck },
    { id: 'planner', name: 'Aura Date Planner', icon: Calendar },
    { id: 'memories', name: 'Aura Memories', icon: Sparkles },
    { id: 'goals', name: 'Aura Goals', icon: Target },
    { id: 'wellness', name: 'Aura Wellness', icon: Activity },
    { id: 'journal', name: 'Aura Journal', icon: BookOpen },
    { id: 'coach', name: 'Aura Coach', icon: Activity },
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
    { id: 'home', name: 'Dashboard', icon: Activity },
    { id: 'deck', name: 'Discover', icon: Heart },
    { id: 'chats', name: 'Chats', icon: MessageCircle },
    { id: 'companion', name: 'Companion', icon: Bot },
    { id: 'profile', name: 'Profile', icon: Users }
  ];

  const displayName = profile?.display_name || profile?.first_name || userProfile?.name || 'User';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-white/8 bg-[#04040A]/90 p-5 flex-col justify-between fixed top-0 bottom-0 left-0 z-30 backdrop-blur-2xl shadow-[4px_0_30px_rgba(0,0,0,0.5)] overflow-y-auto scrollbar-none">
        <div className="flex flex-col gap-5">
          {/* Logo Brand Header */}
          <div 
            className="flex items-center justify-between cursor-pointer group px-2 py-1 rounded-2xl hover:bg-white/[0.03] transition-colors" 
            onClick={() => navigateTo('companion')}
            role="button"
            tabIndex={0}
            aria-label="Go to AuraAI Command Center"
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
                  Autonomous v3.0
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Ecosystem Modules */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase text-white/40 px-3 font-semibold tracking-wider">
              AUTONOMOUS ECOSYSTEM
            </div>
            <nav className="flex flex-col gap-0.5" aria-label="Ecosystem Navigation">
              {ecosystemItems.map(item => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
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
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
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
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
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

        {/* Profile Card Footer + Logout */}
        <div className="space-y-2">
          <div 
            className="flex items-center gap-3 border-t border-white/8 pt-4 px-2 cursor-pointer group hover:bg-white/[0.03] rounded-2xl p-2 transition-all mt-4" 
            onClick={() => navigateTo('profile')}
            role="button"
            tabIndex={0}
            aria-label="View user profile"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center font-bold text-xs text-white border border-white/20 shadow-md group-hover:scale-105 transition-transform shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              {isPremiumUser && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent text-white text-[8px] flex items-center justify-center font-bold border border-black shadow">
                  ★
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-xs text-white truncate group-hover:text-accent transition-colors flex items-center gap-1.5">
                <span>{displayName}</span>
              </div>
              <div className="text-[9px] text-white/40 uppercase font-mono tracking-wider">
                {isPremiumUser ? 'Aura Pro+' : 'Free Calibration'}
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#040408]/95 border-t border-white/10 grid grid-cols-5 items-center px-1 z-50 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.9)] pb-[env(safe-area-inset-bottom)] w-full max-w-full">
        {mobileItems.map(item => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              aria-label={`Navigate to ${item.name}`}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer w-full min-w-0 px-0.5 ${
                isActive ? 'text-white scale-105' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <div className={`relative ${isActive ? 'text-accent' : ''}`}>
                <Icon size={19} className={isActive ? 'fill-accent/20 text-accent' : ''} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                )}
              </div>
              <span className={`text-[9.5px] font-medium tracking-tight truncate w-full transition-colors text-center ${isActive ? 'text-white font-semibold' : 'text-white/40'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
