import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import RequireAuth from './auth/RequireAuth';
import GuestRoute from './auth/GuestRoute';
import LoadingScreen from './components/auth/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Shield, X } from 'lucide-react';

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ProfileWizard = lazy(() => import('./pages/ProfileWizard'));
const LiveHomeDashboard = lazy(() => import('./pages/LiveHomeDashboard'));
const SwipeDeck = lazy(() => import('./pages/SwipeDeck'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Matchmaker = lazy(() => import('./pages/Matchmaker'));
const DatePlanner = lazy(() => import('./pages/DatePlanner'));
const AIWingman = lazy(() => import('./pages/AIWingman'));
const Premium = lazy(() => import('./pages/Premium'));
const CompatibilityReport = lazy(() => import('./pages/CompatibilityReport'));
const AuraCompanion = lazy(() => import('./pages/AuraCompanion'));
const RelOSDashboard = lazy(() => import('./pages/RelOSDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const InvestorAnalytics = lazy(() => import('./pages/InvestorAnalytics'));
const AuraMemories = lazy(() => import('./pages/AuraMemories'));
const AuraGoals = lazy(() => import('./pages/AuraGoals'));
const AuraWellness = lazy(() => import('./pages/AuraWellness'));
const AuraJournal = lazy(() => import('./pages/AuraJournal'));
const AuraCoach = lazy(() => import('./pages/AuraCoach'));
const AuraAvatar = lazy(() => import('./pages/AuraAvatar'));
const AIMarketplace = lazy(() => import('./pages/AIMarketplace'));
const AuraStore = lazy(() => import('./pages/AuraStore'));
const ReferralSystem = lazy(() => import('./pages/ReferralSystem'));
const CreatorPlatform = lazy(() => import('./pages/CreatorPlatform'));
const PlatformAnalytics = lazy(() => import('./pages/PlatformAnalytics'));
const EnterprisePlatform = lazy(() => import('./pages/EnterprisePlatform'));
const DeveloperPlatform = lazy(() => import('./pages/DeveloperPlatform'));
const AIModelHub = lazy(() => import('./pages/AIModelHub'));
const InvestorVision = lazy(() => import('./pages/InvestorVision'));
const SmartCalendar = lazy(() => import('./pages/SmartCalendar'));
const EmotionAnalysis = lazy(() => import('./pages/EmotionAnalysis'));
const Communities = lazy(() => import('./pages/Communities'));
const SafetyCenter = lazy(() => import('./pages/SafetyCenter'));

// Eagerly loaded shared components
import ParticleBg from './components/ParticleBg';
import DynamicIsland from './components/DynamicIsland';
import AIAssistantDock from './components/AIAssistantDock';
import SmartSearch from './components/SmartSearch';

function AppShell({ children }: { children: React.ReactNode }) {
  const { notifications, removeToast, highContrast, reducedMotion } = useAppStore();

  return (
    <div className={`min-h-screen bg-bg-luxury text-white relative font-sans selection:bg-primary/30 perspective-1200 ${highContrast ? 'high-contrast' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
      <ParticleBg />
      <DynamicIsland />
      <AIAssistantDock />
      <SmartSearch />

      {/* Toast Notifications */}
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
              <button onClick={() => removeToast(n.id)} className="text-white/30 hover:text-white cursor-pointer shrink-0">
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen message="Loading..." />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function ProtectedPage({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== GUEST ROUTES ==================== */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Landing />
              </Suspense>
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Login />
              </Suspense>
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Signup />
              </Suspense>
            </GuestRoute>
          }
        />

        {/* ==================== ONBOARDING (auth required, no profile required) ==================== */}
        <Route
          path="/onboarding"
          element={
            <RequireAuth requireProfile={false}>
              <Suspense fallback={<LoadingScreen />}>
                <ProfileWizard />
              </Suspense>
            </RequireAuth>
          }
        />

        {/* ==================== PROTECTED ROUTES ==================== */}
        <Route path="/dashboard" element={<ProtectedPage><LiveHomeDashboard /></ProtectedPage>} />
        <Route path="/discover" element={<ProtectedPage><SwipeDeck /></ProtectedPage>} />
        <Route path="/chat" element={<ProtectedPage><Chat /></ProtectedPage>} />
        <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
        <Route path="/settings" element={<ProtectedPage><Settings /></ProtectedPage>} />
        <Route path="/matchmaker" element={<ProtectedPage><Matchmaker /></ProtectedPage>} />
        <Route path="/planner" element={<ProtectedPage><DatePlanner /></ProtectedPage>} />
        <Route path="/wingman" element={<ProtectedPage><AIWingman /></ProtectedPage>} />
        <Route path="/premium" element={<ProtectedPage><Premium /></ProtectedPage>} />
        <Route path="/report" element={<ProtectedPage><CompatibilityReport /></ProtectedPage>} />
        <Route path="/companion" element={<ProtectedPage><AuraCompanion /></ProtectedPage>} />
        <Route path="/relos" element={<ProtectedPage><RelOSDashboard /></ProtectedPage>} />
        <Route path="/memories" element={<ProtectedPage><AuraMemories /></ProtectedPage>} />
        <Route path="/goals" element={<ProtectedPage><AuraGoals /></ProtectedPage>} />
        <Route path="/wellness" element={<ProtectedPage><AuraWellness /></ProtectedPage>} />
        <Route path="/journal" element={<ProtectedPage><AuraJournal /></ProtectedPage>} />
        <Route path="/coach" element={<ProtectedPage><AuraCoach /></ProtectedPage>} />
        <Route path="/avatar" element={<ProtectedPage><AuraAvatar /></ProtectedPage>} />
        <Route path="/marketplace" element={<ProtectedPage><AIMarketplace /></ProtectedPage>} />
        <Route path="/store" element={<ProtectedPage><AuraStore /></ProtectedPage>} />
        <Route path="/referrals" element={<ProtectedPage><ReferralSystem /></ProtectedPage>} />
        <Route path="/creators" element={<ProtectedPage><CreatorPlatform /></ProtectedPage>} />
        <Route path="/analytics" element={<ProtectedPage><PlatformAnalytics /></ProtectedPage>} />
        <Route path="/enterprise" element={<ProtectedPage><EnterprisePlatform /></ProtectedPage>} />
        <Route path="/developer" element={<ProtectedPage><DeveloperPlatform /></ProtectedPage>} />
        <Route path="/models" element={<ProtectedPage><AIModelHub /></ProtectedPage>} />
        <Route path="/investor" element={<ProtectedPage><InvestorAnalytics /></ProtectedPage>} />
        <Route path="/admin" element={<ProtectedPage><AdminDashboard /></ProtectedPage>} />
        <Route path="/vision" element={<ProtectedPage><InvestorVision /></ProtectedPage>} />
        <Route path="/calendar" element={<ProtectedPage><SmartCalendar /></ProtectedPage>} />
        <Route path="/emotion" element={<ProtectedPage><EmotionAnalysis /></ProtectedPage>} />
        <Route path="/communities" element={<ProtectedPage><Communities /></ProtectedPage>} />
        <Route path="/safety" element={<ProtectedPage><SafetyCenter /></ProtectedPage>} />

        {/* ==================== CATCH-ALL ==================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
