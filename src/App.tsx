import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Landing from './pages/Landing';
import LiveHomeDashboard from './pages/LiveHomeDashboard';
import SmartCalendar from './pages/SmartCalendar';
import EmotionAnalysis from './pages/EmotionAnalysis';
import Communities from './pages/Communities';
import SafetyCenter from './pages/SafetyCenter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SwipeDeck from './pages/SwipeDeck';
import Matchmaker from './pages/Matchmaker';
import Chat from './pages/Chat';
import AIWingman from './pages/AIWingman';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Premium from './pages/Premium';
import CompatibilityReport from './pages/CompatibilityReport';
import DatePlanner from './pages/DatePlanner';
import RelOSDashboard from './pages/RelOSDashboard';
import AuraCompanion from './pages/AuraCompanion';
import AdminDashboard from './pages/AdminDashboard';
import InvestorAnalytics from './pages/InvestorAnalytics';
import AuraMemories from './pages/AuraMemories';
import AuraGoals from './pages/AuraGoals';
import AuraWellness from './pages/AuraWellness';
import AuraJournal from './pages/AuraJournal';
import AuraCoach from './pages/AuraCoach';
import AuraAvatar from './pages/AuraAvatar';
import AIMarketplace from './pages/AIMarketplace';
import AuraStore from './pages/AuraStore';
import ReferralSystem from './pages/ReferralSystem';
import CreatorPlatform from './pages/CreatorPlatform';
import PlatformAnalytics from './pages/PlatformAnalytics';
import EnterprisePlatform from './pages/EnterprisePlatform';
import DeveloperPlatform from './pages/DeveloperPlatform';
import AIModelHub from './pages/AIModelHub';
import InvestorVision from './pages/InvestorVision';
import DynamicIsland from './components/DynamicIsland';
import SampleCommunityBanner from './components/SampleCommunityBanner';
import ParticleBg from './components/ParticleBg';
import AIAssistantDock from './components/AIAssistantDock';
import SmartSearch from './components/SmartSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Shield, X } from 'lucide-react';

import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';

const LIVE_NOTIFICATIONS = [
  { text: "Affinity match established with Zoe Hayashi (98% compatibility)!", type: "match" as const },
  { text: "Someone liked your profile signature in Oakland.", type: "like" as const },
  { text: "AI Wingman finished analyzing your latest chat transcript.", type: "system" as const },
  { text: "New message received from Elena: 'Check the model sync logs.'", type: "chat" as const },
  { text: "Aura Pro+ premium upgrade recommended to boost visibility.", type: "premium" as const }
];

export default function App() {
  const { 
    activeTab, 
    notifications, 
    addToast, 
    removeToast,
    highContrast,
    reducedMotion,
    setActiveTab,
    showSplash
  } = useAppStore();

  const isAdminUrl = typeof window !== 'undefined' && window.location.pathname === '/admin';
  const isVisionUrl = typeof window !== 'undefined' && (window.location.pathname === '/vision' || activeTab === 'vision');

  // Navigation logging for route tracking
  useEffect(() => {
    console.log('[Navigation Log] Active Tab Transition:', activeTab, 'Admin:', isAdminUrl, 'Vision:', isVisionUrl, 'Show Splash:', showSplash);
  }, [activeTab, isAdminUrl, isVisionUrl, showSplash]);

  // Lock body & document scroll while splash is active
  useEffect(() => {
    if (showSplash) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [showSplash]);

  // Live Background Telemetry Alerts Simulation
  useEffect(() => {
    if (activeTab === 'landing' || showSplash) return;

    const interval = setInterval(() => {
      const randomAlert = LIVE_NOTIFICATIONS[Math.floor(Math.random() * LIVE_NOTIFICATIONS.length)];
      addToast(randomAlert.text, randomAlert.type);
    }, 12000); // Trigger every 12 seconds

    return () => clearInterval(interval);
  }, [activeTab, showSplash, addToast]);

  const renderActiveView = () => {
    if (isAdminUrl || activeTab === 'admin') return <AdminDashboard />;
    if (isVisionUrl) return <InvestorVision />;

    switch (activeTab) {
      case 'home':
      case 'dashboard': return <LiveHomeDashboard />;
      case 'command':
      case 'companion':
      case 'aura-companion': return <AuraCompanion />;
      case 'couple-os':
      case 'relos': return <RelOSDashboard />;
      case 'deck': return <SwipeDeck />;
      case 'planner': return <DatePlanner />;
      case 'matchmaker': return <Matchmaker />;
      case 'chats': return <Chat />;
      case 'wingman': return <AIWingman />;
      case 'memories': return <AuraMemories />;
      case 'goals': return <AuraGoals />;
      case 'wellness': return <AuraWellness />;
      case 'journal': return <AuraJournal />;
      case 'coach': return <AuraCoach />;
      case 'avatar': return <AuraAvatar />;
      case 'marketplace': return <AIMarketplace />;
      case 'store': return <AuraStore />;
      case 'referrals': return <ReferralSystem />;
      case 'creators': return <CreatorPlatform />;
      case 'analytics': return <PlatformAnalytics />;
      case 'enterprise': return <EnterprisePlatform />;
      case 'developer': return <DeveloperPlatform />;
      case 'models': return <AIModelHub />;
      case 'investor': return <InvestorAnalytics />;
      case 'profile': return <Profile />;
      case 'settings': return <Settings />;
      case 'premium': return <Premium />;
      case 'report': return <CompatibilityReport />;
      default: return <LiveHomeDashboard />;
    }
  };

  // If Splash Screen is active, isolate rendering to splash only
  if (showSplash) {
    return (
      <div 
        className={`fixed inset-0 w-screen h-screen bg-[#030307] overflow-hidden z-[100] flex items-center justify-center ${highContrast ? 'high-contrast' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}
        style={{ width: '100vw', height: '100vh' }}
      >
        <SplashScreen />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-bg-luxury text-white relative font-sans selection:bg-primary/30 perspective-1200 ${highContrast ? 'high-contrast' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
      
      {/* 3D Depth Canvas Background */}
      <ParticleBg />

      {/* Top Announcement Banner for Sample Mode */}
      <SampleCommunityBanner />

      {/* Apple Dynamic Island Floating Header */}
      {activeTab !== 'landing' && <DynamicIsland />}

      {/* Global AI Assistant Floating Dock & Cmd+K Smart Search */}
      <AIAssistantDock />
      <SmartSearch />

      {/* Absolute Toast Notifications Overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-card-dark/95 backdrop-blur-xl border border-accent/20 shadow-2xl flex items-start gap-3 pointer-events-auto"
            >
              {n.type === 'match' && <Heart className="text-accent fill-accent shrink-0 mt-0.5 animate-pulse" size={16} />}
              {n.type === 'chat' && <MessageCircle className="text-primary shrink-0 mt-0.5" size={16} />}
              {n.type === 'system' && <Sparkles className="text-primary shrink-0 mt-0.5" size={16} />}
              {n.type === 'premium' && <Shield className="text-accent shrink-0 mt-0.5" size={16} />}
              {n.type === 'like' && <Heart className="text-white/40 shrink-0 mt-0.5" size={16} />}
              
              <div className="flex-1">
                <p className="text-xs text-white font-medium leading-normal">{n.text}</p>
              </div>

              <button 
                onClick={() => removeToast(n.id)}
                className="text-white/30 hover:text-white cursor-pointer shrink-0"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ErrorBoundary Wrapped Pages Switcher Viewport */}
      <ErrorBoundary onReset={() => setActiveTab('home')}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isAdminUrl ? 'admin' : isVisionUrl ? 'vision' : activeTab}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>

    </div>
  );
}
