import { create } from 'zustand';
import { mockProfiles, userDefaultProfile } from '../data/mockData';
import type { Profile } from '../data/mockData';
import { ApiClient } from '../api/client';

export interface Message {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: string;
  isRead?: boolean;
  type?: 'text' | 'voice' | 'photo';
  duration?: string;
  imageUrl?: string;
  reaction?: string;
  isPinned?: boolean;
}

export interface WingmanAnalysis {
  id: string;
  inputText: string;
  timestamp: string;
  emotion: string;
  intent: string;
  confidence: number;
  replies: {
    funny: string;
    flirty: string;
    deep: string;
    professional: string;
  };
}

export interface ToastNotification {
  id: string;
  text: string;
  type: 'match' | 'like' | 'chat' | 'system' | 'premium';
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface DiscussionComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface DiscussionPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  clubName: string;
  content: string;
  upvotes: number;
  comments: DiscussionComment[];
  timestamp: string;
}

interface AppState {
  userProfile: Profile;
  profiles: Profile[];
  likedProfiles: string[];
  chatThreads: Record<string, Message[]>;
  selectedMatchId: string;
  activeTab: string;
  wingmanHistory: WingmanAnalysis[];
  typingMatches: Record<string, boolean>;
  
  // V4 Experience & Splash Screen
  showSplash: boolean;
  soundEnabled: boolean;
  
  // V4 Accessibility & Theme
  highContrast: boolean;
  reducedMotion: boolean;
  theme: 'dark' | 'light' | 'luxury';

  // V4 Security & Account
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  activeSessions: ActiveSession[];
  
  // V4 Community Interactions
  joinedClubIds: string[];
  rsvpedEventIds: string[];
  upvotedDiscussionIds: string[];
  discussionPosts: DiscussionPost[];

  // V4 Admin Feature Flags
  featureFlags: {
    deck3dTransitions: boolean;
    proactiveWingman: boolean;
    brandSoundAudio: boolean;
    liveTelemetryFeed: boolean;
  };
  
  // Live demo telemetry & state
  notifications: ToastNotification[];
  isPremiumUser: boolean;
  viewingReportProfileId: string | null;
  selectedPlannerMatchId: string;
  
  // RelOS Intelligence Operating System State
  relosScore: number;
  relosScoreTrend: string;
  partnerPersona: {
    name: string;
    mbti: string;
    loveLanguage: string;
    attachmentStyle: string;
    primaryTrigger: string;
    deEscalationKey: string;
    activeMood: string;
  };
  relosTimeline: { id: string; date: string; title: string; desc: string; category: string }[];
  relosMemoryVault: { id: string; category: string; key: string; val: string; updated: string }[];
  relosLifeGoals: { id: string; title: string; category: string; progress: number; targetDate: string; completed: boolean }[];
  journalEntries: { id: string; date: string; title: string; content: string; mood: string; tags: string[] }[];
  wellnessLogs: { date: string; mood: string; stress: number; sleep: number; energy: number; satisfaction: number }[];

  isMemoryPaused: boolean;

  // Actions
  setShowSplash: (show: boolean) => void;
  toggleSound: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setTheme: (theme: 'dark' | 'light' | 'luxury') => void;
  toggleTwoFactor: () => void;
  verifyEmail: () => void;
  revokeSession: (id: string) => void;
  togglePinMessage: (matchId: string, messageId: string) => void;
  toggleJoinClub: (clubId: string) => void;
  toggleRsvpEvent: (eventId: string) => void;
  upvoteDiscussion: (postId: string) => void;
  addDiscussionComment: (postId: string, commentText: string) => void;
  addDiscussionPost: (title: string, clubName: string, content: string) => void;
  toggleFeatureFlag: (flagKey: keyof AppState['featureFlags']) => void;
  exportUserDataJson: () => void;

  setUserProfile: (profile: Profile) => void;
  likeProfile: (id: string) => void;
  dislikeProfile: (id: string) => void;
  setActiveTab: (tab: string) => void;
  setSelectedMatchId: (id: string) => void;
  setSelectedPlannerMatchId: (id: string) => void;
  toggleLifeGoal: (id: string) => void;
  addLifeGoal: (title: string, category: string, targetDate: string) => void;
  addMemoryVaultItem: (key: string, val: string, category: string) => void;
  deleteMemoryVaultItem: (id: string) => void;
  updateMemoryVaultItem: (id: string, key: string, val: string, category: string) => void;
  togglePauseMemory: () => void;
  addJournalEntry: (title: string, content: string, mood: string, tags: string[]) => void;
  addWellnessLog: (mood: string, stress: number, sleep: number, energy: number, satisfaction: number) => void;
  sendMessage: (matchId: string, text: string, type?: 'text' | 'voice' | 'photo', duration?: string, imageUrl?: string) => void;
  reactToMessage: (matchId: string, messageId: string, reaction: string) => void;
  addWingmanAnalysis: (analysis: WingmanAnalysis) => void;
  addToast: (text: string, type: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  setViewingReportProfileId: (id: string | null) => void;
  setPremiumUser: (status: boolean) => void;
  resetStore: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userProfile: userDefaultProfile as unknown as Profile,
  profiles: mockProfiles,
  likedProfiles: ["1"], // Pre-match with Elena
  selectedMatchId: "1",
  selectedPlannerMatchId: "1",
  activeTab: "home",
  
  // V4 Experience & Splash
  showSplash: false,
  soundEnabled: true,
  
  // V4 Accessibility & Theme
  highContrast: false,
  reducedMotion: false,
  theme: 'luxury',

  // V4 Security & Account
  twoFactorEnabled: true,
  emailVerified: true,
  activeSessions: [
    { id: 's1', deviceName: 'MacBook Pro 16" M3 Max', browser: 'Arc Browser (macOS)', location: 'San Francisco, CA', lastActive: 'Active now', isCurrent: true },
    { id: 's2', deviceName: 'iPhone 16 Pro', browser: 'Aura AI iOS App', location: 'San Francisco, CA', lastActive: '12 mins ago', isCurrent: false },
    { id: 's3', deviceName: 'iPad Pro 13" OLED', browser: 'Safari Mobile', location: 'Palo Alto, CA', lastActive: 'Yesterday', isCurrent: false }
  ],
  
  // V4 Community Interactions
  joinedClubIds: ['c1', 'c2'],
  rsvpedEventIds: ['e1'],
  upvotedDiscussionIds: ['p1'],
  discussionPosts: [
    {
      id: 'p1',
      title: 'How AI compatibility scores evolved my perspective on long-term relationships',
      author: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      clubName: 'Neural Synergy Lab',
      content: 'When I first checked Aura AI’s neural report, I thought 94% compatibility was just a high score. But after 6 months of shared values alignment, the communication suggestions were scary accurate...',
      upvotes: 48,
      comments: [
        { id: 'cm1', author: 'Liam Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'Completely agree! The emotion analysis wingman avoided two miscommunications for us.', timestamp: '2 hours ago' }
      ],
      timestamp: '4 hours ago'
    },
    {
      id: 'p2',
      title: 'Top 5 Architectural & Museum Date Spots in San Francisco',
      author: 'Alex Mercer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      clubName: 'Design & Architecture Lovers',
      content: 'If your date loves spatial design and quiet ambient music, the De Young Museum tower deck during dusk is unmatched. Followed by tea at the Japanese Tea Garden.',
      upvotes: 35,
      comments: [],
      timestamp: 'Yesterday'
    }
  ],

  // V4 Admin Feature Flags
  featureFlags: {
    deck3dTransitions: true,
    proactiveWingman: true,
    brandSoundAudio: true,
    liveTelemetryFeed: true
  },
  relosScore: 96.8,
  relosScoreTrend: "+2.4% this month",
  partnerPersona: {
    name: "Elena Rostova",
    mbti: "INTJ-A (Architect)",
    loveLanguage: "Quality Time & Acts of Service",
    attachmentStyle: "Secure-Autonomous",
    primaryTrigger: "Unstructured spontaneous delays without notice",
    deEscalationKey: "Clear logical explanations & quiet 1-on-1 space",
    activeMood: "Focused & Deeply Engaged"
  },
  relosTimeline: [
    { id: "t1", date: "Oct 14, 2025", title: "Neural Affinity Sync Established", desc: "Initial compatibility score computed at 94%.", category: "Milestone" },
    { id: "t2", date: "Nov 02, 2025", title: "First Physical Meetup at Museum", desc: "Spent 4 hours discussing AI architecture and classical violin.", category: "Date" },
    { id: "t3", date: "Jan 15, 2026", title: "Moved into Shared Loft", desc: "Combined studio spaces and established shared life goals.", category: "Home" },
    { id: "t4", date: "May 20, 2026", title: "Oaxaca Expedition Planned", desc: "Co-created 14-day itinerary for cultural research.", category: "Travel" }
  ],
  relosMemoryVault: [
    { id: "m1", category: "Preferences", key: "Morning Coffee", val: "Single-origin Ethiopian Yirgacheffe, light roast, oat milk", updated: "2 days ago" },
    { id: "m2", category: "Keepsakes", key: "Ring Size", val: "Size 6.5 (Rose gold preference)", updated: "1 week ago" },
    { id: "m3", category: "Dietary", key: "Allergies & Restrictions", val: "Lactose sensitive, prefers dark chocolate >70%", updated: "3 weeks ago" },
    { id: "m4", category: "Milestones", key: "Anniversary Date", val: "November 2nd (First Date at Modern Art Gallery)", updated: "1 month ago" }
  ],
  relosLifeGoals: [
    { id: "g1", title: "Design-Focused Eco Loft Purchase", category: "Home", progress: 75, targetDate: "Q4 2026", completed: false },
    { id: "g2", title: "Oaxaca & Japan Cultural Research Tour", category: "Travel", progress: 90, targetDate: "Aug 2026", completed: false },
    { id: "g3", title: "Joint Emergency & Opportunity Vault", category: "Financial", progress: 85, targetDate: "Q3 2026", completed: false },
    { id: "g4", title: "Modular Synth & AI Audio Studio Setup", category: "Creative", progress: 100, targetDate: "Completed", completed: true }
  ],
  wingmanHistory: [],
  typingMatches: {},
  notifications: [],
  isPremiumUser: false,
  viewingReportProfileId: null,
  
  chatThreads: {},

  setUserProfile: (profile) => {
    set({ userProfile: profile });
    ApiClient.updateProfile(profile);
  },
  
  likeProfile: (id) => {
    set((state) => {
      if (state.likedProfiles.includes(id)) return {};
      return {
        likedProfiles: [...state.likedProfiles, id],
        selectedMatchId: id
      };
    });

    ApiClient.recordSwipe(id, 'like');
  },

  dislikeProfile: (id) => {
    ApiClient.recordSwipe(id, 'pass');
  },

  setActiveTab: (tab) => set({ activeTab: tab, viewingReportProfileId: null }),
  
  journalEntries: [
    { id: 'j1', date: 'Yesterday, 9:30 PM', title: 'Late Night Balcony Tea & Bach', content: 'We discussed our 2026 Oaxaca travel route while listening to Nils Frahm. Realized how aligned our vision for quiet spaces is.', mood: 'Radiant', tags: ['#Travel', '#Milestone'] },
    { id: 'j2', date: '3 days ago', title: 'Museum & Architectural Review', content: 'Elena loved the Japanese woodblock prints. Noticed how engaged she gets when explaining spatial proportions.', mood: 'Thoughtful', tags: ['#Art', '#Banter'] }
  ],
  wellnessLogs: [
    { date: 'Mon', mood: 'Balanced', stress: 30, sleep: 8.2, energy: 85, satisfaction: 94 },
    { date: 'Tue', mood: 'Energized', stress: 25, sleep: 7.8, energy: 90, satisfaction: 96 },
    { date: 'Wed', mood: 'Focused', stress: 35, sleep: 8.0, energy: 88, satisfaction: 95 },
    { date: 'Thu', mood: 'Radiant', stress: 20, sleep: 8.5, energy: 92, satisfaction: 98 },
    { date: 'Fri', mood: 'Relaxed', stress: 18, sleep: 8.4, energy: 94, satisfaction: 97 },
    { date: 'Sat', mood: 'Euphoric', stress: 15, sleep: 9.0, energy: 96, satisfaction: 99 },
    { date: 'Sun', mood: 'Serene', stress: 22, sleep: 8.6, energy: 91, satisfaction: 97 }
  ],

  setSelectedMatchId: (id) => set({ selectedMatchId: id }),

  setSelectedPlannerMatchId: (id) => set({ selectedPlannerMatchId: id }),

  isMemoryPaused: false,

  toggleLifeGoal: (id) => set((state) => ({
    relosLifeGoals: state.relosLifeGoals.map(g => 
      g.id === id ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : 70 } : g
    )
  })),

  addLifeGoal: (title, category, targetDate) => set((state) => ({
    relosLifeGoals: [
      ...state.relosLifeGoals,
      { id: `g_${Date.now()}`, title, category, progress: 10, targetDate, completed: false }
    ]
  })),

  addJournalEntry: (title, content, mood, tags) => set((state) => ({
    journalEntries: [
      { id: `j_${Date.now()}`, date: "Just now", title, content, mood, tags },
      ...state.journalEntries
    ]
  })),

  addWellnessLog: (mood, stress, sleep, energy, satisfaction) => set((state) => ({
    wellnessLogs: [
      ...state.wellnessLogs,
      { date: "Today", mood, stress, sleep, energy, satisfaction }
    ]
  })),

  addMemoryVaultItem: (key, val, category) => set((state) => ({
    relosMemoryVault: [
      { id: `m_${Date.now()}`, key, val, category, updated: "Just now" },
      ...state.relosMemoryVault
    ]
  })),

  deleteMemoryVaultItem: (id) => set((state) => ({
    relosMemoryVault: state.relosMemoryVault.filter(m => m.id !== id)
  })),

  updateMemoryVaultItem: (id, key, val, category) => set((state) => ({
    relosMemoryVault: state.relosMemoryVault.map(m => 
      m.id === id ? { ...m, key, val, category, updated: "Just now" } : m
    )
  })),

  togglePauseMemory: () => set((state) => ({
    isMemoryPaused: !state.isMemoryPaused
  })),

  sendMessage: (matchId, text, type = 'text', duration, imageUrl) => {
    const newMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      type,
      duration,
      imageUrl
    };

    set((state) => ({
      chatThreads: {
        ...state.chatThreads,
        [matchId]: [...(state.chatThreads[matchId] || []), newMessage]
      }
    }));

    ApiClient.sendMessage(matchId, text, type, duration, imageUrl);
  },

  reactToMessage: (matchId, messageId, reaction) => {
    set((state) => {
      const thread = state.chatThreads[matchId] || [];
      const updated = thread.map(msg => 
        msg.id === messageId ? { ...msg, reaction } : msg
      );
      return {
        chatThreads: {
          ...state.chatThreads,
          [matchId]: updated
        }
      };
    });
  },

  addWingmanAnalysis: (analysis) => {
    set((state) => ({
      wingmanHistory: [analysis, ...state.wingmanHistory]
    }));
    ApiClient.analyzeWingmanText(analysis.inputText);
  },

  addToast: (text, type) => {
    const newToast: ToastNotification = {
      id: Math.random().toString(),
      text,
      type
    };
    set((state) => ({
      notifications: [...state.notifications, newToast]
    }));

    setTimeout(() => {
      get().removeToast(newToast.id);
    }, 4000);
  },

  removeToast: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  setViewingReportProfileId: (id) => set({ viewingReportProfileId: id }),

  setPremiumUser: (status) => {
    set({ isPremiumUser: status });
    ApiClient.upgradeSubscription(status ? 'vip' : 'free');
  },

  setShowSplash: (show) => set({ showSplash: show }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  setTheme: (theme) => set({ theme }),
  toggleTwoFactor: () => set((state) => {
    const next = !state.twoFactorEnabled;
    state.addToast(`Two-Factor Authentication ${next ? 'enabled' : 'disabled'}`, 'system');
    return { twoFactorEnabled: next };
  }),
  verifyEmail: () => set((state) => {
    state.addToast('Email verified successfully!', 'system');
    return { emailVerified: true };
  }),
  revokeSession: (id) => set((state) => ({
    activeSessions: state.activeSessions.filter(s => s.id !== id)
  })),
  togglePinMessage: (matchId, messageId) => set((state) => {
    const thread = state.chatThreads[matchId] || [];
    const updated = thread.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
    );
    return {
      chatThreads: {
        ...state.chatThreads,
        [matchId]: updated
      }
    };
  }),
  toggleJoinClub: (clubId) => set((state) => {
    const exists = state.joinedClubIds.includes(clubId);
    const updated = exists ? state.joinedClubIds.filter(id => id !== clubId) : [...state.joinedClubIds, clubId];
    state.addToast(exists ? 'Left community club' : 'Joined community club!', 'system');
    return { joinedClubIds: updated };
  }),
  toggleRsvpEvent: (eventId) => set((state) => {
    const exists = state.rsvpedEventIds.includes(eventId);
    const updated = exists ? state.rsvpedEventIds.filter(id => id !== eventId) : [...state.rsvpedEventIds, eventId];
    state.addToast(exists ? 'RSVP cancelled' : 'RSVP confirmed for event!', 'system');
    return { rsvpedEventIds: updated };
  }),
  upvoteDiscussion: (postId) => set((state) => {
    const exists = state.upvotedDiscussionIds.includes(postId);
    const updatedIds = exists ? state.upvotedDiscussionIds.filter(id => id !== postId) : [...state.upvotedDiscussionIds, postId];
    const updatedPosts = state.discussionPosts.map(p => {
      if (p.id === postId) {
        return { ...p, upvotes: exists ? p.upvotes - 1 : p.upvotes + 1 };
      }
      return p;
    });
    return { upvotedDiscussionIds: updatedIds, discussionPosts: updatedPosts };
  }),
  addDiscussionComment: (postId, commentText) => set((state) => {
    const updatedPosts = state.discussionPosts.map(p => {
      if (p.id === postId) {
        const newComment: DiscussionComment = {
          id: `cm_${Date.now()}`,
          author: state.userProfile.name,
          avatar: state.userProfile.images[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          text: commentText,
          timestamp: 'Just now'
        };
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    state.addToast('Comment posted', 'system');
    return { discussionPosts: updatedPosts };
  }),
  addDiscussionPost: (title, clubName, content) => set((state) => {
    const newPost: DiscussionPost = {
      id: `p_${Date.now()}`,
      title,
      author: state.userProfile.name,
      avatar: state.userProfile.images[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      clubName,
      content,
      upvotes: 1,
      comments: [],
      timestamp: 'Just now'
    };
    state.addToast('New discussion post published!', 'system');
    return {
      discussionPosts: [newPost, ...state.discussionPosts],
      upvotedDiscussionIds: [...state.upvotedDiscussionIds, newPost.id]
    };
  }),
  toggleFeatureFlag: (flagKey) => set((state) => ({
    featureFlags: {
      ...state.featureFlags,
      [flagKey]: !state.featureFlags[flagKey]
    }
  })),
  exportUserDataJson: () => {
    const state = get();
    const exportData = {
      userProfile: state.userProfile,
      relosScore: state.relosScore,
      relosLifeGoals: state.relosLifeGoals,
      relosMemoryVault: state.relosMemoryVault,
      journalEntries: state.journalEntries,
      wellnessLogs: state.wellnessLogs,
      likedProfiles: state.likedProfiles,
      activeSessions: state.activeSessions,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_ai_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    state.addToast('User telemetry & data exported as JSON!', 'system');
  },

  resetStore: () => set({
    likedProfiles: [],
    selectedMatchId: '',
    selectedPlannerMatchId: '',
    chatThreads: {},
    wingmanHistory: [],
    typingMatches: {},
    notifications: [],
    isPremiumUser: false,
    viewingReportProfileId: null,
    showSplash: false,
    activeTab: 'home',
  })
}));
