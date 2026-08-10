import { supabase } from '../lib/supabase';
import type { Profile } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper for authorized fetch
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('aura_jwt_token') || '';

  if (!token) {
    console.warn(`[API] No auth token available for ${endpoint}`);
    return null;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401) {
      console.warn(`[API] 401 Unauthorized on ${endpoint}`);
      return null;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call ${endpoint} failed:`, err);
    return null;
  }
}

export const ApiClient = {
  // Profile
  async getProfile() {
    return await apiFetch('/profiles/me');
  },

  async getProfileById(id: string) {
    return await apiFetch(`/profiles/${encodeURIComponent(id)}`);
  },

  async searchProfiles(query: string) {
    return await apiFetch(`/profiles/search?q=${encodeURIComponent(query)}`);
  },

  async updateProfile(profileData: Partial<Profile>) {
    return await apiFetch('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async uploadPhoto(file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `user_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      }
    } catch (_) {}

    return null;
  },

  // Swipes & Likes
  async recordSwipe(targetId: string, direction: 'like' | 'pass' | 'superlike') {
    return await apiFetch('/likes', {
      method: 'POST',
      body: JSON.stringify({ targetId, direction })
    });
  },

  async likeUser(targetId: string, direction: 'like' | 'pass' | 'superlike' = 'like') {
    return await this.recordSwipe(targetId, direction);
  },

  async getDiscoverProfiles() {
    return await apiFetch('/profiles/discover');
  },

  // Notifications
  async getNotifications() {
    return await apiFetch('/notifications');
  },

  async markNotificationsRead() {
    return await apiFetch('/notifications/read', { method: 'POST' });
  },

  // Real User Chat
  async getMatches() {
    return await apiFetch('/chats/matches');
  },

  async getMessages(matchId: string) {
    return await apiFetch(`/chats/messages/${matchId}`);
  },

  async sendMessage(matchId: string, text: string, type: 'text' | 'voice' | 'photo' = 'text', duration?: string, imageUrl?: string) {
    const res = await apiFetch('/chats/messages', {
      method: 'POST',
      body: JSON.stringify({ matchId, text, type, duration, imageUrl })
    });

    if (res?.success && res?.newMessage) {
      // Broadcast over Supabase Realtime channel for instant cross-tab sync
      try {
        const channel = supabase.channel(`realtime_match_${matchId}`);
        await channel.send({
          type: 'broadcast',
          event: 'new_message',
          payload: res.newMessage
        });
      } catch (_) {}
    }

    return res;
  },

  // Supabase Realtime Subscription for Real User Chat
  subscribeToRealtimeChat(matchId: string, onMessage: (msg: any) => void) {
    const channel = supabase.channel(`realtime_match_${matchId}`);

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` }, payload => {
        if (payload?.new) {
          onMessage(payload.new);
        }
      })
      .on('broadcast', { event: 'new_message' }, payload => {
        if (payload?.payload) {
          onMessage(payload.payload);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // AI Companions Chat
  async getAiCompanions() {
    return await apiFetch('/chats/ai/companions');
  },

  async getAiMessages(companionId: string) {
    return await apiFetch(`/chats/ai/messages/${companionId}`);
  },

  async sendAiMessage(companionId: string, text: string) {
    return await apiFetch('/chats/ai/messages', {
      method: 'POST',
      body: JSON.stringify({ companionId, text })
    });
  },

  // AI Reports
  async getCompatibilityReport(targetId: string, userTraits?: any) {
    const query = userTraits ? `?userTraits=${encodeURIComponent(JSON.stringify(userTraits))}` : '';
    return await apiFetch(`/reports/${targetId}${query}`);
  },

  // AI Wingman
  async analyzeWingmanText(inputText: string) {
    return await apiFetch('/wingman/analyze', {
      method: 'POST',
      body: JSON.stringify({ inputText })
    });
  },

  // Subscriptions
  async upgradeSubscription(planTier: 'free' | 'pro' | 'vip') {
    return await apiFetch('/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planTier })
    });
  }
};
