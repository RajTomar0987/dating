import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Landing from './pages/Landing';
import LiveHomeDashboard from './pages/LiveHomeDashboard';
import AuraCommandCenter from './pages/AuraCommandCenter';
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
import InvestorStoryTour from './components/InvestorStoryTour';
import DemoDayMode from './components/DemoDayMode';
import PresenterTour from './components/PresenterTour';
import DynamicIsland from './components/DynamicIsland';
import SampleCommunityBanner from './components/SampleCommunityBanner';
import ParticleBg from './components/ParticleBg';
import AIAssistantDock from './components/AIAssistantDock';
import SmartSearch from './components/SmartSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Shield, X } from 'lucide-react';

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
    isDemoMode, 
    notifications, 
    addToast, 
    removeToast
  } = useAppStore();

  const isAdminUrl = typeof window !== 'undefined' && window.location.pathname === '/admin';
  const isVisionUrl = typeof window !== 'undefined' && (window.location.pathname === '/vision' || activeTab === 'vision');

  // Live Background Telemetry Alerts Simulation
  useEffect(() => {
    if (activeTab === 'landing' || isDemoMode) return;

    const interval = setInterval(() => {
      const randomAlert = LIVE_NOTIFICATIONS[Math.floor(Math.random() * LIVE_NOTIFICATIONS.length)];
      addToast(randomAlert.text, randomAlert.type);
    }, 12000); // Trigger every 12 seconds

    return () => clearInterval(interval);
  }, [activeTab, isDemoMode, addToast]);

  return (
    <div className="min-h-screen bg-bg-luxury text-white relative font-sans selection:bg-primary/30 perspective-1200">
      
      {/* 3D Depth Canvas Background */}
      <ParticleBg />

      {/* Top Announcement Banner for Sample Mode */}
      <SampleCommunityBanner />

      {/* Apple Dynamic Island Floating Header */}
      {!isDemoMode && activeTab !== 'landing' && <DynamicIsland />}

      {/* Global AI Assistant Floating Dock & Cmd+K Smart Search */}
      {!isDemoMode && <AIAssistantDock />}
      {!isDemoMode && <SmartSearch />}

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

      {/* Demo Day Automated Walkthrough */}
      <DemoDayMode />

      {/* Investor Story Mode Guided Overlay */}
      <InvestorStoryTour />

      {/* Guided Tour Banner Overlay */}
      {!isDemoMode && <PresenterTour />}

      {/* Pages Switcher Viewport */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isAdminUrl ? 'admin' : isVisionUrl ? 'vision' : activeTab}
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {isAdminUrl || activeTab === 'admin' ? (
            <AdminDashboard />
          ) : isVisionUrl ? (
            <InvestorVision />
          ) : (
            <>
              {activeTab === 'command' && <AuraCommandCenter />}
              {(activeTab === 'home' || activeTab === 'dashboard') && <LiveHomeDashboard />}
              {activeTab === 'calendar' && <SmartCalendar />}
              {activeTab === 'emotion' && <EmotionAnalysis />}
              {activeTab === 'communities' && <Communities />}
              {activeTab === 'safety' && <SafetyCenter />}
              {activeTab === 'landing' && <Landing />}
              {activeTab === 'login' && <Login />}
              {activeTab === 'signup' && <Signup />}
              {(activeTab === 'companion' || activeTab === 'aura-companion') && <AuraCompanion />}
              {(activeTab === 'couple-os' || activeTab === 'relos') && <RelOSDashboard />}
              {activeTab === 'deck' && <SwipeDeck />}
              {activeTab === 'planner' && <DatePlanner />}
              {activeTab === 'matchmaker' && <Matchmaker />}
              {activeTab === 'chats' && <Chat />}
              {activeTab === 'wingman' && <AIWingman />}
              {activeTab === 'memories' && <AuraMemories />}
              {activeTab === 'goals' && <AuraGoals />}
              {activeTab === 'wellness' && <AuraWellness />}
              {activeTab === 'journal' && <AuraJournal />}
              {activeTab === 'coach' && <AuraCoach />}
              {activeTab === 'avatar' && <AuraAvatar />}
              {activeTab === 'marketplace' && <AIMarketplace />}
              {activeTab === 'store' && <AuraStore />}
              {activeTab === 'referrals' && <ReferralSystem />}
              {activeTab === 'creators' && <CreatorPlatform />}
              {activeTab === 'analytics' && <PlatformAnalytics />}
              {activeTab === 'enterprise' && <EnterprisePlatform />}
              {activeTab === 'developer' && <DeveloperPlatform />}
              {activeTab === 'models' && <AIModelHub />}
              {activeTab === 'investor' && <InvestorAnalytics />}
              {activeTab === 'profile' && <Profile />}
              {activeTab === 'settings' && <Settings />}
              {activeTab === 'premium' && <Premium />}
              {activeTab === 'report' && <CompatibilityReport />}
            </>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
