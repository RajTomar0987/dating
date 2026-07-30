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

interface AppState {
  userProfile: Profile;
  profiles: Profile[];
  likedProfiles: string[];
  chatThreads: Record<string, Message[]>;
  selectedMatchId: string;
  activeTab: string;
  wingmanHistory: WingmanAnalysis[];
  typingMatches: Record<string, boolean>;
  
  // Live demo telemetry & state
  notifications: ToastNotification[];
  isDemoMode: boolean;
  demoStep: number;
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
  startDemoMode: () => void;
  stopDemoMode: () => void;
  setDemoStep: (step: number) => void;
  setViewingReportProfileId: (id: string | null) => void;
  setPremiumUser: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userProfile: userDefaultProfile as unknown as Profile,
  profiles: mockProfiles,
  likedProfiles: ["1"], // Pre-match with Elena
  selectedMatchId: "1",
  selectedPlannerMatchId: "1",
  activeTab: "companion",
  
  // RelOS Telemetry Initial Data
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
  isDemoMode: false,
  demoStep: 0,
  isPremiumUser: false,
  viewingReportProfileId: null,
  
  chatThreads: {
    "1": [
      {
        id: "1",
        sender: "match",
        text: "Hey Alex! AI analysis shows our neural compatibility is at 94%. Quite impressive, actually. What are you up to today?",
        timestamp: "02:15 PM",
        isRead: true,
        type: 'text'
      },
      {
        id: "2",
        sender: "user",
        text: "Hey Elena! Nice to meet you. I'm just tweaking the code for a new matching system.",
        timestamp: "02:17 PM",
        isRead: true,
        type: 'text'
      },
      {
        id: "3",
        sender: "match",
        text: "Perfect. Code is just another medium for design. Have you read the latest research paper on model distillation? It's quite interesting.",
        timestamp: "02:18 PM",
        isRead: true,
        type: 'text'
      }
    ]
  },

  setUserProfile: (profile) => {
    set({ userProfile: profile });
    ApiClient.updateProfile(profile);
  },
  
  likeProfile: (id) => {
    set((state) => {
      if (state.likedProfiles.includes(id)) return {};
      
      const matchProfile = state.profiles.find(p => p.id === id);
      const initialMessage: Message = {
        id: Math.random().toString(),
        sender: 'match',
        text: `Affinity match established! Let's talk about our shared interest in ${matchProfile?.interests[0] || 'life'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        type: 'text'
      };

      return {
        likedProfiles: [...state.likedProfiles, id],
        selectedMatchId: id,
        chatThreads: {
          ...state.chatThreads,
          [id]: [initialMessage]
        }
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

    set((state) => ({
      typingMatches: { ...state.typingMatches, [matchId]: true }
    }));

    setTimeout(() => {
      const state = get();
      const matchProfile = state.profiles.find(p => p.id === matchId);
      if (!matchProfile) return;

      let replyText = `I'm highly intrigued by that topic. Let's explore it further. What are your core thoughts on it?`;
      const txt = text.toLowerCase();

      if (matchId === "1") { // Elena
        if (txt.includes("hello") || txt.includes("hi") || txt.includes("hey")) {
          replyText = "Hello again. I was just reviewing my neural training runs. How is your day developing?";
        } else if (txt.includes("ai") || txt.includes("llm") || txt.includes("model") || txt.includes("code")) {
          replyText = "The mathematics behind attention mechanisms is beautiful. Are you currently optimizing agent behaviors, or working on basic architectural layouts?";
        } else if (txt.includes("violin") || txt.includes("music") || txt.includes("classical")) {
          replyText = "Playing the violin teaches you that mechanical precision and creative fluidity are both required for harmony. It's similar to structuring clean algorithms. Do you listen to much Bach?";
        } else if (txt.includes("date") || txt.includes("meet") || txt.includes("coffee")) {
          replyText = "A physical sync sounds interesting. Let's select a quiet, design-focused space. Coffee at the museum gardens this weekend?";
        }
      } else if (matchId === "2") { // Marcus
        if (txt.includes("hello") || txt.includes("hi") || txt.includes("hey")) {
          replyText = "Hey! What's up? Just finishing editing this wild paragliding footage. Hope your day is awesome!";
        } else if (txt.includes("travel") || txt.includes("film") || txt.includes("camera") || txt.includes("photo")) {
          replyText = "Travel is all about finding those raw, unedited human moments. My favorite shots are always from Oaxaca. Where is the absolute craziest place you've ever been?";
        } else if (txt.includes("climb") || txt.includes("sport") || txt.includes("outdoor")) {
          replyText = "Climbing is the ultimate focus. You just block out the noise. Let's plan an outdoor trip sometime, you down?";
        }
      }

      const botMessage: Message = {
        id: Math.random().toString(),
        sender: 'match',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        type: 'text'
      };

      set((state) => ({
        typingMatches: { ...state.typingMatches, [matchId]: false },
        chatThreads: {
          ...state.chatThreads,
          [matchId]: [...(state.chatThreads[matchId] || []), botMessage]
        }
      }));
    }, 1800);
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

  startDemoMode: () => set({ isDemoMode: true, demoStep: 1, activeTab: "landing" }),
  
  stopDemoMode: () => set({ isDemoMode: false, demoStep: 0 }),
  
  setDemoStep: (step) => set({ demoStep: step }),

  setViewingReportProfileId: (id) => set({ viewingReportProfileId: id }),

  setPremiumUser: (status) => {
    set({ isPremiumUser: status });
    ApiClient.upgradeSubscription(status ? 'vip' : 'free');
  }
}));
