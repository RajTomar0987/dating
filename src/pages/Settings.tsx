import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import { 
  Settings as SettingsIcon, Check, ShieldCheck, Lock, Bell, Sparkles, SunMoon, CreditCard, Laptop, Trash2, Download, CheckCircle2, Eye, EyeOff, X, AlertTriangle, KeyRound, Smartphone, Shield
} from 'lucide-react';

export default function Settings() {
  const { 
    userProfile, 
    setUserProfile, 
    twoFactorEnabled, 
    toggleTwoFactor,
    emailVerified,
    verifyEmail,
    activeSessions,
    revokeSession,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    theme,
    setTheme,
    isPremiumUser,
    setPremiumUser,
    exportUserDataJson,
    addToast
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<'account' | 'privacy' | 'security' | 'notifications' | 'ai' | 'appearance' | 'subscription'>('account');
  const [formData, setFormData] = useState({ ...userProfile });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    ghostMode: false,
    showReadReceipts: true,
    showOnlineStatus: true,
    publicProfile: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    pushMatches: true,
    pushMessages: true,
    emailDigests: false,
    wingmanAlerts: true
  });

  const [aiPreferences, setAiPreferences] = useState({
    autoWingman: true,
    proactiveAnalysis: true,
    aiModel: 'Gemini 3.6 Flash'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    addToast('Account settings saved', 'system');
  };

  return (
    <div className="flex min-h-screen bg-bg-luxury font-sans text-white">
      <Sidebar />

      {/* 2FA QR Setup Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#0A0A14] border border-accent/40 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <KeyRound className="text-accent" size={18} />
                <h3 className="font-display font-bold text-sm text-white">Two-Factor Authenticator Setup</h3>
              </div>
              <button onClick={() => setShowQrModal(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block mx-auto border-4 border-accent/40 shadow-xl">
              {/* Simulated QR Code */}
              <div className="w-40 h-40 bg-black p-2 flex flex-col items-center justify-center gap-1">
                <div className="w-full h-full border-2 border-dashed border-accent flex items-center justify-center text-[10px] text-accent font-mono text-center">
                  [AURA-2FA-QR-KEY-SCAN]
                </div>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Scan this QR code with Google Authenticator or 1Password to bind your device to 2FA security.
            </p>

            <GlowButton onClick={() => {
              toggleTwoFactor();
              setShowQrModal(false);
            }} variant="accent" className="w-full">
              Confirm 2FA Verification
            </GlowButton>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#0A0A14] border border-red-500/40 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-white">Delete Account & Telemetry?</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                This action is permanent. All your neural matches, chat transcripts, RelOS data, and achievements will be erased forever.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addToast('Account deletion request queued', 'system');
                  setShowDeleteModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto space-y-8 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm" icon={SettingsIcon}>
                Aura AI Control Panel
              </Badge>
              <span className="text-xs font-mono text-emerald-400 font-medium">Session Encrypted</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white flex items-center gap-3">
              <SettingsIcon className="text-accent shrink-0" size={38} /> Premium Settings
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Manage your account identity, security 2FA, privacy controls, AI preferences, accessibility mode, and data exports.
            </p>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'account', label: 'Account', icon: SettingsIcon },
            { id: 'privacy', label: 'Privacy', icon: Eye },
            { id: 'security', label: 'Security & 2FA', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'ai', label: 'AI Preferences', icon: Sparkles },
            { id: 'appearance', label: 'Appearance', icon: SunMoon },
            { id: 'subscription', label: 'Subscription', icon: CreditCard }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeCategory === cat.id 
                  ? 'bg-accent/20 border border-accent/40 text-white shadow-lg' 
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <cat.icon size={14} className={activeCategory === cat.id ? 'text-accent' : 'text-white/40'} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Category 1: Account */}
        {activeCategory === 'account' && (
          <GlassCard className="p-6 space-y-6 border-white/10" hoverEffect={false}>
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <SettingsIcon size={18} className="text-accent" /> Profile Identity & Verification
              </h3>
              <div className="flex items-center gap-2">
                {emailVerified ? (
                  <Badge variant="accent" size="sm" icon={ShieldCheck}>
                    Email Verified ✓
                  </Badge>
                ) : (
                  <button onClick={verifyEmail} className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40">
                    Verify Email
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono text-white/50 font-bold block mb-1">Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-white/50 font-bold block mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono text-white/50 font-bold block mb-1">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-white/50 font-bold block mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-white/50 font-bold block mb-1">Bio Statement</label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                />
              </div>

              <GlowButton type="submit" variant="accent" size="sm">
                Save Account Updates
              </GlowButton>
            </form>
          </GlassCard>
        )}

        {/* Category 2: Privacy */}
        {activeCategory === 'privacy' && (
          <GlassCard className="p-6 space-y-6 border-white/10" hoverEffect={false}>
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/8 pb-4">
              <Eye size={18} className="text-accent" /> Privacy & Visibility Controls
            </h3>

            <div className="space-y-4">
              {[
                { key: 'ghostMode', label: 'Ghost Mode', desc: 'Hide your profile from active search while keeping existing matches.' },
                { key: 'showReadReceipts', label: 'Read Receipts', desc: 'Allow matches to see when you have read their messages.' },
                { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Display green active dot when using Aura AI.' },
                { key: 'publicProfile', label: 'Public Ecosystem Visibility', desc: 'Allow your profile to be featured in community spotlights.' }
              ].map(item => (
                <div key={item.key} className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.label}</h4>
                    <p className="text-[11px] text-white/60">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      const k = item.key as keyof typeof privacySettings;
                      setPrivacySettings(prev => ({ ...prev, [k]: !prev[k] }));
                      addToast(`Privacy: ${item.label} updated`, 'system');
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      privacySettings[item.key as keyof typeof privacySettings] ? 'bg-accent' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      privacySettings[item.key as keyof typeof privacySettings] ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Category 3: Security & 2FA */}
        {activeCategory === 'security' && (
          <div className="space-y-6">
            <GlassCard className="p-6 space-y-4 border-white/10" hoverEffect={false}>
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Lock size={18} className="text-accent" /> Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">Secure your account with TOTP authenticator apps.</p>
                </div>
                <button
                  onClick={() => setShowQrModal(true)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-accent text-white'
                  }`}
                >
                  {twoFactorEnabled ? '✓ 2FA Active (Reconfigure)' : 'Enable 2FA'}
                </button>
              </div>
            </GlassCard>

            {/* Active Device Sessions */}
            <GlassCard className="p-6 space-y-4 border-white/10" hoverEffect={false}>
              <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/8 pb-4">
                <Laptop size={18} className="text-primary" /> Active Device Sessions ({activeSessions.length})
              </h3>

              <div className="space-y-3">
                {activeSessions.map(session => (
                  <div key={session.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        {session.deviceName}
                        {session.isCurrent && <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">Current Device</span>}
                      </div>
                      <p className="text-[11px] text-white/60 font-mono">{session.browser} • {session.location}</p>
                      <span className="text-[9px] text-white/40 font-mono">Last Active: {session.lastActive}</span>
                    </div>

                    {!session.isCurrent && (
                      <button
                        onClick={() => {
                          revokeSession(session.id);
                          addToast(`Session for ${session.deviceName} revoked`, 'system');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-300 text-xs font-semibold cursor-pointer border border-red-500/30"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Account Deletion Safeguard */}
            <GlassCard className="p-6 space-y-3 border-red-500/30 bg-red-500/5" hoverEffect={false}>
              <h3 className="font-bold text-sm text-red-400 flex items-center gap-2">
                <Trash2 size={16} /> Danger Zone
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Permanently delete your account and clear all stored RelOS telemetric signatures.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                Delete Account
              </button>
            </GlassCard>
          </div>
        )}

        {/* Category 4: Notifications */}
        {activeCategory === 'notifications' && (
          <GlassCard className="p-6 space-y-6 border-white/10" hoverEffect={false}>
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/8 pb-4">
              <Bell size={18} className="text-accent" /> Notification Preferences
            </h3>

            <div className="space-y-4">
              {[
                { key: 'pushMatches', label: 'New Match Push Alerts', desc: 'Instant push alert when a high-affinity match is established.' },
                { key: 'pushMessages', label: 'Chat Message Notifications', desc: 'Receive real-time notifications for incoming messages.' },
                { key: 'emailDigests', label: 'Weekly Relationship Digest', desc: 'Receive weekly summary email of your RelOS progress.' },
                { key: 'wingmanAlerts', label: 'AI Wingman Proactive Suggestions', desc: 'Allow AI assistant to send proactive advice notifications.' }
              ].map(item => (
                <div key={item.key} className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.label}</h4>
                    <p className="text-[11px] text-white/60">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      const k = item.key as keyof typeof notificationSettings;
                      setNotificationSettings(prev => ({ ...prev, [k]: !prev[k] }));
                      addToast(`Notification: ${item.label} updated`, 'system');
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-accent' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      notificationSettings[item.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Category 5: AI Preferences */}
        {activeCategory === 'ai' && (
          <GlassCard className="p-6 space-y-6 border-white/10" hoverEffect={false}>
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/8 pb-4">
              <Sparkles size={18} className="text-accent" /> AI Engine & Telemetry Settings
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 space-y-2">
                <label className="text-[10px] uppercase font-mono text-white/50 font-bold block">Selected AI Intelligence Model</label>
                <select
                  value={aiPreferences.aiModel}
                  onChange={(e) => {
                    setAiPreferences(prev => ({ ...prev, aiModel: e.target.value }));
                    addToast(`AI Model set to ${e.target.value}`, 'system');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                >
                  <option value="Gemini 3.6 Flash" className="bg-[#0A0A14]">Gemini 3.6 Flash (Recommended • Ultra Low Latency)</option>
                  <option value="Gemini 3.1 Pro" className="bg-[#0A0A14]">Gemini 3.1 Pro (Deep Analytical Reasoning)</option>
                  <option value="Aura Neural Custom V4" className="bg-[#0A0A14]">Aura Custom Fine-Tuned Relationship Model</option>
                </select>
              </div>

              {[
                { key: 'autoWingman', label: 'Automatic Flirt & Banter Suggestions', desc: 'Generate smart reply pills inside active chat windows.' },
                { key: 'proactiveAnalysis', label: 'Proactive Harmony Calibration', desc: 'Automatically compute MBTI alignment graphs in background.' }
              ].map(item => (
                <div key={item.key} className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.label}</h4>
                    <p className="text-[11px] text-white/60">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      const k = item.key as keyof typeof aiPreferences;
                      setAiPreferences(prev => ({ ...prev, [k]: !prev[k] }));
                      addToast(`AI: ${item.label} updated`, 'system');
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      aiPreferences[item.key as keyof typeof aiPreferences] ? 'bg-accent' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      aiPreferences[item.key as keyof typeof aiPreferences] ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Category 6: Appearance & Accessibility */}
        {activeCategory === 'appearance' && (
          <GlassCard className="p-6 space-y-6 border-white/10" hoverEffect={false}>
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/8 pb-4">
              <SunMoon size={18} className="text-accent" /> Appearance & Accessibility Modes
            </h3>

            <div className="space-y-4">
              {/* High Contrast */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-white">High Contrast Mode</h4>
                  <p className="text-[11px] text-white/60">Enhance text contrast and border visibility for accessibility.</p>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${highContrast ? 'bg-accent' : 'bg-white/20'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-white">Reduced Motion</h4>
                  <p className="text-[11px] text-white/60">Disable background particle animations and heavy motion effects.</p>
                </div>
                <button
                  onClick={toggleReducedMotion}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${reducedMotion ? 'bg-accent' : 'bg-white/20'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Theme Picker */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 space-y-2">
                <label className="text-[10px] uppercase font-mono text-white/50 font-bold block">Theme Palette</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'luxury', label: 'Dark Luxury (Default)', bg: 'bg-[#040408]' },
                    { id: 'dark', label: 'Midnight Blue', bg: 'bg-[#0A0A18]' },
                    { id: 'light', label: 'High-Contrast White', bg: 'bg-[#181824]' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id as typeof theme);
                        addToast(`Theme switched to ${t.label}`, 'system');
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        theme === t.id ? 'border-accent bg-accent/20 text-white' : 'border-white/10 bg-white/5 text-white/70'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Category 7: Subscription & Data Export */}
        {activeCategory === 'subscription' && (
          <div className="space-y-6">
            <GlassCard className="p-6 space-y-4 border-white/10" hoverEffect={false}>
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <CreditCard size={18} className="text-accent" /> Active Subscription Plan
                  </h3>
                  <p className="text-xs text-accent font-mono font-bold mt-1">
                    {isPremiumUser ? 'Aura Pro+ VIP Active ($29.99/mo)' : 'Free Calibration Plan'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setPremiumUser(!isPremiumUser);
                    addToast(isPremiumUser ? 'Subscription downgraded' : 'Upgraded to Aura VIP!', 'premium');
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white text-xs font-extrabold shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  {isPremiumUser ? 'Manage Subscription' : 'Upgrade to Aura VIP'}
                </button>
              </div>
            </GlassCard>

            {/* Data Export Button */}
            <GlassCard className="p-6 space-y-3 border-white/10" hoverEffect={false}>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Download size={18} className="text-emerald-400" /> Export Personal Telemetry & Data
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Download a complete JSON export of your profile, RelOS memory vault, journal entries, wellness logs, and matched signatures.
              </p>
              <GlowButton onClick={exportUserDataJson} variant="primary" size="sm" icon={Download}>
                Export Data (JSON)
              </GlowButton>
            </GlassCard>
          </div>
        )}

      </main>
    </div>
  );
}
