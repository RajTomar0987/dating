import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabase } from '../services/supabase.js';
import { getProfileByFirebaseUid } from '../services/profileStore.js';
import { 
  createOrGetMatch, 
  getUserMatches, 
  getMatchById, 
  getMatchMessages, 
  saveRealMessage,
  getAiMessages,
  saveAiMessage
} from '../services/chatStore.js';
import { z } from 'zod';

const router = Router();

const SendMessageSchema = z.object({
  matchId: z.string().min(1),
  text: z.string().min(1),
  type: z.enum(['text', 'voice', 'photo']).optional().default('text'),
  duration: z.string().optional(),
  imageUrl: z.string().optional()
});

const SendAiMessageSchema = z.object({
  companionId: z.string().min(1),
  text: z.string().min(1)
});

// List of official AI Companions
const AI_COMPANIONS = [
  {
    id: 'aura_ai',
    name: 'Aura AI',
    role: 'AI Companion',
    isAi: true,
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    bio: 'Aura Relational Intelligence Companion — Tone, empathy & compatibility analysis.',
    matchScore: 99
  },
  {
    id: 'elena_ai',
    name: 'Elena AI',
    role: 'AI Companion',
    isAi: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'INTJ Architect AI — Passionate about design, violin harmony, & deep discussions.',
    matchScore: 98
  },
  {
    id: 'nova_ai',
    name: 'Nova AI',
    role: 'AI Companion',
    isAi: true,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    bio: 'Emotional Wellness AI — Supportive de-escalation & communication advice.',
    matchScore: 95
  }
];

function isTestOrDemoUser(p: any): boolean {
  if (!p) return false;
  const uid = String(p.firebase_uid || p.id || '').toLowerCase();
  const name = String(p.display_name || p.first_name || '').toLowerCase();
  const email = String(p.email || '').toLowerCase();

  if (uid.startsWith('test_') || uid.startsWith('unit_') || uid.startsWith('demo_') || uid.startsWith('empty_birthday_') || uid.startsWith('chat_test_')) return true;
  if (email.endsWith('@auraai.test') || email.endsWith('@example.com') || email.endsWith('@test.com')) return true;
  if (name.startsWith('test') || name.startsWith('unit') || name.startsWith('sanitization') || name.startsWith('demo') || name.startsWith('chatuser') || name.startsWith('chat user')) return true;

  return false;
}

/**
 * GET /api/chats/matches
 * Get all real user matches for the authenticated user (excluding test/demo fixture accounts)
 */
router.get('/matches', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const rawMatches = await getUserMatches(currentUserId);

    const matchesList = (await Promise.all(
      rawMatches.map(async (m: any) => {
        const partnerId = m.user1_id === currentUserId ? m.user2_id : m.user1_id;

        // Fetch partner profile
        let partnerProfile: any = null;
        try {
          partnerProfile = await getProfileByFirebaseUid(partnerId);
        } catch (_) {}

        if (isTestOrDemoUser(partnerProfile)) {
          return null;
        }

        // Online status calculation (active within last 5 minutes)
        let isOnline = false;
        if (partnerProfile?.last_active || partnerProfile?.updated_at) {
          const lastTime = new Date(partnerProfile.last_active || partnerProfile.updated_at).getTime();
          isOnline = Date.now() - lastTime < 5 * 60 * 1000;
        }

        // Get last message preview
        const msgs = await getMatchMessages(m.id);
        const lastMsg = msgs.slice(-1)[0] || null;

        const validPhotos = Array.isArray(partnerProfile?.photos)
          ? partnerProfile.photos.filter((url: any) => typeof url === 'string' && url.trim().length > 0 && !url.trim().startsWith('blob:'))
          : [];

        return {
          matchId: m.id,
          partnerId,
          partner: {
            id: partnerId,
            firebase_uid: partnerId,
            name: partnerProfile?.display_name || partnerProfile?.first_name || 'Matched User',
            first_name: partnerProfile?.first_name || 'Matched User',
            photos: validPhotos.length ? validPhotos : ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'],
            bio: partnerProfile?.bio || 'Dating app match',
            location_city: partnerProfile?.location_city || 'Nearby',
            is_online: isOnline,
            last_active: partnerProfile?.last_active || partnerProfile?.updated_at || new Date().toISOString()
          },
          lastMessage: lastMsg ? {
            text: lastMsg.content,
            timestamp: new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senderId: lastMsg.sender_id
          } : null,
          createdAt: m.created_at,
          updatedAt: m.updated_at
        };
      })
    )).filter(Boolean);

    res.status(200).json({ matches: matchesList });
  } catch (err: any) {
    console.error('[Chats] Get matches error:', err);
    res.status(500).json({ error: 'Internal server error fetching matches' });
  }
});

/**
 * GET /api/chats/messages/:matchId
 * Get real messages for a specific match
 */
router.get('/messages/:matchId', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  const matchId = req.params.matchId as string;

  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Security: Verify user is a member of this match
  const match = await getMatchById(matchId);
  if (!match || (match.user1_id !== currentUserId && match.user2_id !== currentUserId)) {
    res.status(403).json({ error: 'Forbidden: You are not a member of this conversation' });
    return;
  }

  try {
    const rawMsgs = await getMatchMessages(matchId);
    const messages = rawMsgs.map((m: any) => ({
      id: m.id,
      matchId: m.match_id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      sender: m.sender_id === currentUserId ? 'user' : 'match',
      text: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: m.message_type || 'text',
      duration: m.duration,
      imageUrl: m.image_url,
      isRead: m.is_read || false,
      createdAt: m.created_at
    }));

    res.status(200).json({ messages });
  } catch (err: any) {
    console.error('[Chats] Get messages error:', err);
    res.status(500).json({ error: 'Internal server error fetching messages' });
  }
});

/**
 * POST /api/chats/messages
 * Send a REAL message to a matched user (NO AI response generated)
 */
router.post('/messages', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const result = SendMessageSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid message payload', details: result.error.errors });
    return;
  }

  const { matchId, text, type, duration, imageUrl } = result.data;

  // Security: Verify user belongs to this match
  const match = await getMatchById(matchId);
  if (!match || (match.user1_id !== currentUserId && match.user2_id !== currentUserId)) {
    res.status(403).json({ error: 'Forbidden: You are not a member of this conversation' });
    return;
  }

  // Receiver is the other member of the match
  const receiverId = match.user1_id === currentUserId ? match.user2_id : match.user1_id;

  try {
    const savedMsg = await saveRealMessage({
      match_id: matchId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      content: text,
      message_type: type,
      duration,
      image_url: imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Message saved and dispatched',
      newMessage: {
        id: savedMsg.id,
        matchId: savedMsg.match_id,
        senderId: savedMsg.sender_id,
        receiverId: savedMsg.receiver_id,
        sender: 'user',
        text: savedMsg.content,
        timestamp: new Date(savedMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: savedMsg.message_type,
        duration: savedMsg.duration,
        imageUrl: savedMsg.image_url,
        isRead: savedMsg.is_read || false,
        createdAt: savedMsg.created_at
      }
    });
  } catch (err: any) {
    console.error('[Chats] Send real message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * GET /api/chats/ai/companions
 * List available AI Companions
 */
router.get('/ai/companions', (_req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({ companions: AI_COMPANIONS });
});

/**
 * GET /api/chats/ai/messages/:companionId
 * Get message history for an AI companion
 */
router.get('/ai/messages/:companionId', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  const companionId = req.params.companionId as string;

  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const rawMsgs = await getAiMessages(currentUserId, companionId);

    // If initial empty history, provide friendly welcome from AI Companion
    if (rawMsgs.length === 0) {
      const companion = AI_COMPANIONS.find(c => c.id === companionId) || AI_COMPANIONS[0];
      const welcomeMsg = await saveAiMessage(
        currentUserId, 
        companionId, 
        'ai', 
        `Hello! I am ${companion.name}, your AI Companion. How can I assist your relationship journey or chat with you today?`
      );
      rawMsgs.push(welcomeMsg);
    }

    const messages = rawMsgs.map((m: any) => ({
      id: m.id,
      companionId: m.companion_id,
      sender: m.sender === 'user' ? 'user' : 'match', // 'match' maps to the left bubble in existing UI
      text: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      isAiMessage: true,
      createdAt: m.created_at
    }));

    res.status(200).json({ messages });
  } catch (err: any) {
    console.error('[Chats] Get AI messages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/chats/ai/messages
 * Send message to an AI Companion & receive AI response
 */
router.post('/ai/messages', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const result = SendAiMessageSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid payload', details: result.error.errors });
    return;
  }

  const { companionId, text } = result.data;

  try {
    // 1. Save user message
    const userMsg = await saveAiMessage(currentUserId, companionId, 'user', text);

    // 2. Generate contextual AI response
    let aiReplyText = "I'm listening and analyzing the emotional resonance. How does that make you feel?";
    const txt = text.toLowerCase();

    if (companionId === 'aura_ai') {
      if (txt.includes('hello') || txt.includes('hi') || txt.includes('hey')) {
        aiReplyText = "Greetings! I'm Aura AI. How are your dating connections and relationship goals progressing today?";
      } else if (txt.includes('advice') || txt.includes('date') || txt.includes('idea')) {
        aiReplyText = "Based on relational telemetry, interactive dates like pottery workshops or museum terrace strolls create the highest trust scores.";
      } else {
        aiReplyText = `Analyzed "${text}". Tone shows deep alignment. Would you like me to optimize your profile prompts or suggest date ideas?`;
      }
    } else if (companionId === 'elena_ai') {
      if (txt.includes('hello') || txt.includes('hi') || txt.includes('hey')) {
        aiReplyText = "Hello! I was just reviewing architectural layouts and violin scores. What design topics are on your mind?";
      } else if (txt.includes('music') || txt.includes('violin') || txt.includes('art')) {
        aiReplyText = "Music and architecture both rely on spatial harmony and mathematical rhythm. Bach is my absolute favorite for deep focus.";
      } else {
        aiReplyText = "Fascinating perspective! Code and design really are two sides of the same creative medium.";
      }
    } else if (companionId === 'nova_ai') {
      if (txt.includes('hello') || txt.includes('hi') || txt.includes('hey')) {
        aiReplyText = "Hi there! I'm Nova, your emotional wellness companion. Take a deep breath. How are you feeling right now?";
      } else {
        aiReplyText = "Your emotional wellbeing is key to meaningful connections. Remember to communicate openly and take time for yourself.";
      }
    }

    // 3. Save AI message
    const aiMsg = await saveAiMessage(currentUserId, companionId, 'ai', aiReplyText);

    res.status(200).json({
      success: true,
      userMessage: {
        id: userMsg.id,
        sender: 'user',
        text: userMsg.content,
        timestamp: new Date(userMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      },
      aiMessage: {
        id: aiMsg.id,
        sender: 'match',
        text: aiMsg.content,
        timestamp: new Date(aiMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        isAiMessage: true
      }
    });
  } catch (err: any) {
    console.error('[Chats] Send AI message error:', err);
    res.status(500).json({ error: 'Failed to process AI conversation' });
  }
});

export default router;
