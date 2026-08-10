import { getSupabase } from './supabase.js';

// In-memory fallback stores for when Supabase tables are unmigrated
export const inMemoryMatches = new Map<string, any>(); // key: matchId
export const inMemoryMessages = new Map<string, any[]>(); // key: matchId -> messages[]
export const inMemoryAiMessages = new Map<string, any[]>(); // key: `${userId}_${companionId}` -> messages[]

// Helper: Ensure a match exists between two users
export async function createOrGetMatch(user1Id: string, user2Id: string) {
  const supabase = getSupabase();
  const [sorted1, sorted2] = [user1Id, user2Id].sort();
  
  try {
    const { data: existingMatch, error } = await supabase
      .from('matches')
      .select('*')
      .or(`and(user1_id.eq.${sorted1},user2_id.eq.${sorted2}),and(user1_id.eq.${sorted2},user2_id.eq.${sorted1})`)
      .maybeSingle();

    if (existingMatch) {
      return existingMatch;
    }

    const { data: newMatch, error: createErr } = await supabase
      .from('matches')
      .insert({
        user1_id: sorted1,
        user2_id: sorted2,
        status: 'matched',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!createErr && newMatch) {
      inMemoryMatches.set(newMatch.id, newMatch);
      return newMatch;
    }
  } catch (err) {
    console.warn('[ChatStore] Supabase match error, using fallback:', err);
  }

  // Fallback in memory
  let found = Array.from(inMemoryMatches.values()).find(
    m => (m.user1_id === sorted1 && m.user2_id === sorted2) || (m.user1_id === sorted2 && m.user2_id === sorted1)
  );

  if (!found) {
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    found = {
      id: matchId,
      user1_id: sorted1,
      user2_id: sorted2,
      status: 'matched',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryMatches.set(matchId, found);
  }

  return found;
}

// Get all matches for a user
export async function getUserMatches(userId: string) {
  const supabase = getSupabase();
  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'matched')
      .order('updated_at', { ascending: false });

    if (!error && matches && matches.length > 0) {
      // Sync memory
      matches.forEach((m: any) => inMemoryMatches.set(m.id, m));
      return matches;
    }
  } catch (err) {
    console.warn('[ChatStore] Supabase getUserMatches error, using fallback:', err);
  }

  // Fallback in memory
  return Array.from(inMemoryMatches.values()).filter(
    m => (m.user1_id === userId || m.user2_id === userId) && m.status === 'matched'
  );
}

// Get single match by ID
export async function getMatchById(matchId: string) {
  const supabase = getSupabase();
  try {
    const { data: match, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (!error && match) {
      inMemoryMatches.set(match.id, match);
      return match;
    }
  } catch (err) {}

  return inMemoryMatches.get(matchId) || null;
}

// Get messages for a match
export async function getMatchMessages(matchId: string) {
  const supabase = getSupabase();
  try {
    const { data: msgs, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (!error && msgs) {
      inMemoryMessages.set(matchId, msgs);
      return msgs;
    }
  } catch (err) {
    console.warn('[ChatStore] Supabase getMatchMessages error, using fallback:', err);
  }

  return inMemoryMessages.get(matchId) || [];
}

// Save real message
export async function saveRealMessage(payload: {
  match_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type?: string;
  duration?: string;
  image_url?: string;
}) {
  const supabase = getSupabase();
  let savedMsg: any = null;

  try {
    const { data: dbMsg, error } = await supabase
      .from('messages')
      .insert({
        match_id: payload.match_id,
        sender_id: payload.sender_id,
        receiver_id: payload.receiver_id,
        content: payload.content,
        message_type: payload.message_type || 'text',
        duration: payload.duration || null,
        image_url: payload.image_url || null,
      })
      .select()
      .single();

    if (!error && dbMsg) {
      savedMsg = dbMsg;
      // Update match timestamp
      await supabase
        .from('matches')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', payload.match_id);
    } else if (error) {
      console.warn('[ChatStore] Supabase insert message error:', error);
    }
  } catch (err) {
    console.warn('[ChatStore] Supabase saveRealMessage exception:', err);
  }

  if (!savedMsg) {
    savedMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      match_id: payload.match_id,
      sender_id: payload.sender_id,
      receiver_id: payload.receiver_id,
      content: payload.content,
      message_type: payload.message_type || 'text',
      duration: payload.duration || null,
      image_url: payload.image_url || null,
      is_read: false,
      created_at: new Date().toISOString(),
    };
  }

  // Update memory
  const currentList = inMemoryMessages.get(payload.match_id) || [];
  inMemoryMessages.set(payload.match_id, [...currentList, savedMsg]);

  const match = inMemoryMatches.get(payload.match_id);
  if (match) {
    match.updated_at = new Date().toISOString();
  }

  return savedMsg;
}

// AI Companion Messages Store
export async function getAiMessages(userId: string, companionId: string) {
  const key = `${userId}_${companionId}`;
  const supabase = getSupabase();

  try {
    const { data: msgs, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('companion_id', companionId)
      .order('created_at', { ascending: true });

    if (!error && msgs && msgs.length > 0) {
      inMemoryAiMessages.set(key, msgs);
      return msgs;
    }
  } catch (err) {}

  return inMemoryAiMessages.get(key) || [];
}

export async function saveAiMessage(userId: string, companionId: string, sender: 'user' | 'ai', content: string) {
  const key = `${userId}_${companionId}`;
  const supabase = getSupabase();
  let savedMsg: any = null;

  try {
    const { data: dbMsg, error } = await supabase
      .from('ai_messages')
      .insert({
        user_id: userId,
        companion_id: companionId,
        sender,
        content,
      })
      .select()
      .single();

    if (!error && dbMsg) {
      savedMsg = dbMsg;
    }
  } catch (err) {}

  if (!savedMsg) {
    savedMsg = {
      id: `aimsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      companion_id: companionId,
      sender,
      content,
      created_at: new Date().toISOString(),
    };
  }

  const current = inMemoryAiMessages.get(key) || [];
  inMemoryAiMessages.set(key, [...current, savedMsg]);
  return savedMsg;
}
