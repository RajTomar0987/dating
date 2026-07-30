import { supabase } from '../lib/supabase';
import type { Profile } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper for authorized fetch
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('aura_jwt_token') || '';
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call ${endpoint} failed, falling back to local client processing`, err);
    return null;
  }
}

export const ApiClient = {
  // Auth
  async login(email: string, password: string) {
    // Try Supabase Auth first if configured
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.session) {
        localStorage.setItem('aura_jwt_token', data.session.access_token);
        return { user: data.user, token: data.session.access_token };
      }
    } catch (_) {}

    // Fallback to Express REST API endpoint
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (result?.token) {
      localStorage.setItem('aura_jwt_token', result.token);
    }
    return result;
  },

  async signup(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (!error && data.session) {
        localStorage.setItem('aura_jwt_token', data.session.access_token);
        return { user: data.user, token: data.session.access_token };
      }
    } catch (_) {}

    return await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  },

  // Profile & Photos
  async updateProfile(profileData: Partial<Profile>) {
    return await apiFetch('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async uploadPhoto(file: File) {
    // Try uploading to Supabase Storage `profile-photos` bucket
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

    const res = await apiFetch('/profiles/photos', { method: 'POST' });
    return res?.url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600';
  },

  // Swipes & Likes
  async recordSwipe(targetId: string, direction: 'like' | 'pass' | 'superlike') {
    return await apiFetch('/likes', {
      method: 'POST',
      body: JSON.stringify({ targetId, direction })
    });
  },

  // Realtime Messages & Subscriptions
  async sendMessage(matchId: string, text: string, type: 'text' | 'voice' | 'photo' = 'text', duration?: string, imageUrl?: string) {
    return await apiFetch('/chats/messages', {
      method: 'POST',
      body: JSON.stringify({ matchId, text, type, duration, imageUrl })
    });
  },

  subscribeToRealtimeChat(matchId: string, onMessage: (msg: any) => void) {
    const channel = supabase
      .channel(`chat_${matchId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        onMessage(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // AI Cached Reports
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

  // Subscription Upgrades
  async upgradeSubscription(planTier: 'free' | 'pro' | 'vip') {
    return await apiFetch('/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planTier })
    });
  }
};
