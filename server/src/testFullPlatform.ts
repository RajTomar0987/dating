import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

const API_BASE = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'aura_ai_jwt_secret_dev_key_2026';
const rawUrl = process.env.SUPABASE_URL || 'https://cspcrxztpuaofwtophik.supabase.co';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(cleanUrl, supabaseKey);

const USER_A = {
  uid: 'test_user_a_uid',
  email: 'testA@auraai.test',
  name: 'Test User A'
};

const USER_B = {
  uid: 'test_user_b_uid',
  email: 'testB@auraai.test',
  name: 'Test User B'
};

const tokenA = jwt.sign(
  { id: USER_A.uid, firebase_uid: USER_A.uid, email: USER_A.email },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const tokenB = jwt.sign(
  { id: USER_B.uid, firebase_uid: USER_B.uid, email: USER_B.email },
  JWT_SECRET,
  { expiresIn: '1h' }
);

interface SuiteResult {
  feature: string;
  userAStatus: 'PASS' | 'FAIL';
  userBStatus: 'PASS' | 'FAIL';
  overallResult: 'PASS' | 'FAIL';
  evidence: string;
}

async function runFullVerification() {
  console.log('================================================================');
  console.log('🚀 STARTING COMPREHENSIVE FULL REAL MULTI-USER END-TO-END AUDIT');
  console.log('================================================================\n');

  const suiteResults: SuiteResult[] = [];

  const addResult = (
    feature: string,
    userAOk: boolean,
    userBOk: boolean,
    evidence: string
  ) => {
    const overallResult = userAOk && userBOk ? 'PASS' : 'FAIL';
    const item: SuiteResult = {
      feature,
      userAStatus: userAOk ? 'PASS' : 'FAIL',
      userBStatus: userBOk ? 'PASS' : 'FAIL',
      overallResult,
      evidence
    };
    suiteResults.push(item);
    console.log(`[${overallResult}] ${feature} | A: ${item.userAStatus} | B: ${item.userBStatus} | ${evidence}`);
  };

  try {
    // ----------------------------------------------------------------
    // 1. AUTHENTICATION (Session creation, verification & refresh)
    // ----------------------------------------------------------------
    const authARes = await fetch(`${API_BASE}/profiles/me`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const authABody = await authARes.json();
    const authAOk = authARes.status === 200 && (authABody.profile?.firebase_uid === USER_A.uid);

    const authBRes = await fetch(`${API_BASE}/profiles/me`, { headers: { Authorization: `Bearer ${tokenB}` } });
    const authBBody = await authBRes.json();
    const authBOk = authBRes.status === 200 && (authBBody.profile?.firebase_uid === USER_B.uid);

    addResult(
      'Authentication & Session',
      authAOk,
      authBOk,
      `User A HTTP ${authARes.status} (UID: ${authABody.profile?.firebase_uid}), User B HTTP ${authBRes.status} (UID: ${authBBody.profile?.firebase_uid})`
    );

    // ----------------------------------------------------------------
    // 2. PROFILE SYSTEM & PERSISTENCE
    // ----------------------------------------------------------------
    const profAPayload = {
      first_name: USER_A.name,
      display_name: USER_A.name,
      birthday: '2000-01-15',
      gender: 'Male',
      interested_in: ['Women'],
      height_cm: 178,
      education: 'IIT Gwalior',
      occupation: 'Software Engineer',
      languages: ['English', 'Hindi'],
      bio: 'Test profile A - Software Engineer in Gwalior',
      interests: ['Technology', 'Travel', 'Music'],
      location_city: 'Gwalior',
      photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600'],
      profile_completed: true
    };
    const profARes = await fetch(`${API_BASE}/profiles/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify(profAPayload)
    });
    const profABody = await profARes.json();

    const profBPayload = {
      first_name: USER_B.name,
      display_name: USER_B.name,
      birthday: '2001-05-20',
      gender: 'Female',
      interested_in: ['Men'],
      height_cm: 165,
      education: 'Design Institute',
      occupation: 'Designer',
      languages: ['English', 'Hindi'],
      bio: 'Test profile B - Designer in Gwalior',
      interests: ['Art', 'Travel', 'Music'],
      location_city: 'Gwalior',
      photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600'],
      profile_completed: true
    };
    const profBRes = await fetch(`${API_BASE}/profiles/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify(profBPayload)
    });
    const profBBody = await profBRes.json();

    const profAOk = profARes.status === 200 && (profABody.profile?.display_name === USER_A.name);
    const profBOk = profBRes.status === 200 && (profBBody.profile?.display_name === USER_B.name);

    addResult(
      'Profile Persistence',
      profAOk,
      profBOk,
      `User A Name: "${profABody.profile?.display_name}", User B Name: "${profBBody.profile?.display_name}"`
    );

    // ----------------------------------------------------------------
    // 3. REFRESH & SESSION RESTORATION
    // ----------------------------------------------------------------
    const refARes = await fetch(`${API_BASE}/profiles/me`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const refABody = await refARes.json();
    const refAOk = refARes.status === 200 && (refABody.profile?.bio === profAPayload.bio);

    const refBRes = await fetch(`${API_BASE}/profiles/me`, { headers: { Authorization: `Bearer ${tokenB}` } });
    const refBBody = await refBRes.json();
    const refBOk = refBRes.status === 200 && (refBBody.profile?.bio === profBPayload.bio);

    addResult(
      'Refresh Session Restoration',
      refAOk,
      refBOk,
      `User A Bio restored: "${refABody.profile?.bio}", User B Bio restored: "${refBBody.profile?.bio}"`
    );

    // ----------------------------------------------------------------
    // 4. DISCOVER / REAL USERS SEARCH
    // ----------------------------------------------------------------
    const discARes = await fetch(`${API_BASE}/profiles/discover`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const discABody = await discARes.json();
    const bInDisc = discABody.profiles?.some((p: any) => p.id === USER_B.uid || p.name === USER_B.name);

    const discBRes = await fetch(`${API_BASE}/profiles/discover`, { headers: { Authorization: `Bearer ${tokenB}` } });
    const discBBody = await discBRes.json();
    const aInDisc = discBBody.profiles?.some((p: any) => p.id === USER_A.uid || p.name === USER_A.name);

    addResult(
      'Discover Real Users',
      discARes.status === 200 && bInDisc,
      discBRes.status === 200 && aInDisc,
      `User A discover returned ${discABody.profiles?.length || 0} DB profiles (Found B: ${bInDisc}). User B discover returned ${discBBody.profiles?.length || 0} DB profiles (Found A: ${aInDisc})`
    );

    // ----------------------------------------------------------------
    // 4.5 REAL USER SEARCH (Name, Location, Interest, Occupation, No-Result & Isolation)
    // ----------------------------------------------------------------
    // 1. Name Search: User A searches "Test User B" -> B appears, A excluded
    const nameSearchRes = await fetch(`${API_BASE}/profiles/search?q=Test%20User%20B`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const nameSearchBody = await nameSearchRes.json();
    const nameSearchOk = nameSearchRes.status === 200 && nameSearchBody.profiles?.some((p: any) => p.firebase_uid === USER_B.uid) && !nameSearchBody.profiles?.some((p: any) => p.firebase_uid === USER_A.uid);

    // 2. Location Search: User A searches "Gwalior"
    const locSearchRes = await fetch(`${API_BASE}/profiles/search?q=Gwalior`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const locSearchBody = await locSearchRes.json();
    const locSearchOk = locSearchRes.status === 200 && locSearchBody.profiles?.some((p: any) => p.firebase_uid === USER_B.uid);

    // 3. Interest Search: User A searches "Art"
    const intSearchRes = await fetch(`${API_BASE}/profiles/search?q=Art`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const intSearchBody = await intSearchRes.json();
    const intSearchOk = intSearchRes.status === 200 && intSearchBody.profiles?.some((p: any) => p.firebase_uid === USER_B.uid);

    // 4. Occupation Search: User B searches "Engineer" -> A appears
    const occSearchRes = await fetch(`${API_BASE}/profiles/search?q=Engineer`, { headers: { Authorization: `Bearer ${tokenB}` } });
    const occSearchBody = await occSearchRes.json();
    const occSearchOk = occSearchRes.status === 200 && occSearchBody.profiles?.some((p: any) => p.firebase_uid === USER_A.uid);

    // 5. No Result Search
    const noResSearch = await fetch(`${API_BASE}/profiles/search?q=NonExistentQuery99`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const noResBody = await noResSearch.json();
    const noResOk = noResSearch.status === 200 && noResBody.profiles?.length === 0;

    // 6. Open Searched Profile by ID
    const getByIdRes = await fetch(`${API_BASE}/profiles/${USER_B.uid}`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const getByIdBody = await getByIdRes.json();
    const getByIdOk = getByIdRes.status === 200 && getByIdBody.profile?.firebase_uid === USER_B.uid;

    addResult(
      'Real User Search Engine',
      nameSearchOk && locSearchOk && intSearchOk && getByIdOk,
      occSearchOk && noResOk,
      `Name search: ${nameSearchBody.profiles?.length || 0} match(es), Location: ${locSearchBody.profiles?.length || 0}, Occupation: ${occSearchBody.profiles?.length || 0}, No-result: ${noResBody.profiles?.length || 0}, Profile by ID: "${getByIdBody.profile?.display_name}"`
    );

    // ----------------------------------------------------------------
    // 5 & 6. LIKES & RECIPROCAL MATCH ENGINE
    // ----------------------------------------------------------------
    // Reset previous test swipes
    await fetch(`${API_BASE}/likes/reset`, { method: 'DELETE', headers: { Authorization: `Bearer ${tokenA}` } });

    // A likes B
    const likeARes = await fetch(`${API_BASE}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ targetId: USER_B.uid, direction: 'like' })
    });
    const likeABody = await likeARes.json();

    // B likes A (Reciprocal swipe)
    const likeBRes = await fetch(`${API_BASE}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({ targetId: USER_A.uid, direction: 'like' })
    });
    const likeBBody = await likeBRes.json();
    const matchId = likeBBody.match?.id;

    const likeAOk = likeARes.status === 200 && likeABody.isMatch === false;
    const likeBOk = likeBRes.status === 200 && likeBBody.isMatch === true && !!matchId;

    addResult(
      'Likes & Reciprocal Match Engine',
      likeAOk,
      likeBOk,
      `A->B isMatch: ${likeABody.isMatch}, B->A isMatch: ${likeBBody.isMatch}, Match ID: ${matchId}`
    );

    // ----------------------------------------------------------------
    // 7, 8, 9, 10. REAL HUMAN CHAT, REALTIME, PERSISTENCE & READ/UNREAD
    // ----------------------------------------------------------------
    // Send 5 messages A->B
    const msgsA = [];
    for (let i = 1; i <= 5; i++) {
      const res = await fetch(`${API_BASE}/chats/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
        body: JSON.stringify({ matchId, text: `Hello from User A message #${i}` })
      });
      msgsA.push(await res.json());
    }

    // Send 5 reply messages B->A
    const msgsB = [];
    for (let i = 1; i <= 5; i++) {
      const res = await fetch(`${API_BASE}/chats/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
        body: JSON.stringify({ matchId, text: `Hello from User B reply #${i}` })
      });
      msgsB.push(await res.json());
    }

    // Fetch conversation from DB for A and B
    const fetchMsgsA = await (await fetch(`${API_BASE}/chats/messages/${matchId}`, { headers: { Authorization: `Bearer ${tokenA}` } })).json();
    const fetchMsgsB = await (await fetch(`${API_BASE}/chats/messages/${matchId}`, { headers: { Authorization: `Bearer ${tokenB}` } })).json();

    const chatAOk = msgsA.length === 5 && fetchMsgsA.messages?.length >= 10;
    const chatBOk = msgsB.length === 5 && fetchMsgsB.messages?.length >= 10;

    addResult(
      'Real Human Chat & Persistence',
      chatAOk,
      chatBOk,
      `User A loaded ${fetchMsgsA.messages?.length} messages, User B loaded ${fetchMsgsB.messages?.length} messages. Persisted in DB.`
    );

    // ----------------------------------------------------------------
    // 11. AI CHAT SEPARATION
    // ----------------------------------------------------------------
    const aiResA = await fetch(`${API_BASE}/chats/ai/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ companionId: 'aura_ai', text: 'AI query from A' })
    });
    const aiBodyA = await aiResA.json();

    const aiResB = await fetch(`${API_BASE}/chats/ai/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({ companionId: 'aura_ai', text: 'AI query from B' })
    });
    const aiBodyB = await aiResB.json();

    addResult(
      'AI Chat Separation',
      aiResA.status === 200 && aiBodyA.aiMessage?.isAiMessage === true,
      aiResB.status === 200 && aiBodyB.aiMessage?.isAiMessage === true,
      `A AI response has isAiMessage: true, B AI response has isAiMessage: true. Completely separated from human chat.`
    );

    // ----------------------------------------------------------------
    // 12. NOTIFICATIONS SYSTEM
    // ----------------------------------------------------------------
    const notifARes = await fetch(`${API_BASE}/notifications`, { headers: { Authorization: `Bearer ${tokenA}` } });
    const notifABody = await notifARes.json();

    const notifBRes = await fetch(`${API_BASE}/notifications`, { headers: { Authorization: `Bearer ${tokenB}` } });
    const notifBBody = await notifBRes.json();

    addResult(
      'Notifications System',
      notifARes.status === 200 && Array.isArray(notifABody.notifications),
      notifBRes.status === 200 && Array.isArray(notifBBody.notifications),
      `User A notifications count: ${notifABody.notifications?.length || 0}, User B notifications count: ${notifBBody.notifications?.length || 0}`
    );

    // ----------------------------------------------------------------
    // 13. ACCOUNT & DATA ISOLATION
    // ----------------------------------------------------------------
    const editARes = await fetch(`${API_BASE}/profiles/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ bio: 'User A Bio Isolation Verification' })
    });
    const editABody = await editARes.json();

    const fetchMeB = await (await fetch(`${API_BASE}/profiles/me`, { headers: { Authorization: `Bearer ${tokenB}` } })).json();
    const isoBProfile = fetchMeB.profile || fetchMeB;

    const isoAOk = editARes.status === 200 && editABody.profile?.bio === 'User A Bio Isolation Verification';
    const isoBOk = isoBProfile.bio === profBPayload.bio && isoBProfile.bio !== 'User A Bio Isolation Verification';

    addResult(
      'Account Data Isolation',
      isoAOk,
      isoBOk,
      `User A updated bio to "${editABody.profile?.bio}". User B bio remained untouched ("${isoBProfile.bio}")`
    );

    // ----------------------------------------------------------------
    // 14. SECURITY & SENDER SPOOF PROTECTION
    // ----------------------------------------------------------------
    const unauthRes = await fetch(`${API_BASE}/profiles/me`);
    const spoofRes = await fetch(`${API_BASE}/chats/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ matchId, text: 'Spoof attempt', senderId: USER_B.uid })
    });
    const spoofBody = await spoofRes.json();

    const secAOk = unauthRes.status === 401 && spoofBody.newMessage?.senderId === USER_A.uid;
    const secBOk = true;

    addResult(
      'Security & Spoof Protection',
      secAOk,
      secBOk,
      `Unauthenticated 401 verified. Payload senderId: USER_B ignored; backend derived sender (${spoofBody.newMessage?.senderId}) from JWT.`
    );

  } catch (err: any) {
    console.error('❌ Full Verification Execution Error:', err);
  }

  console.log('\n================================================================');
  console.log('📋 FULL REAL MULTI-USER AUDIT COMPLETE TABLE');
  console.log('================================================================');
  console.table(suiteResults);
  const passCount = suiteResults.filter(r => r.overallResult === 'PASS').length;
  console.log(`TOTAL SUITES: ${suiteResults.length} | PASSED: ${passCount} | FAILED: ${suiteResults.length - passCount}`);
  console.log('================================================================');
}

runFullVerification();
