import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'aura_ai_jwt_secret_dev_key_2026';

// Generate valid JWT tokens for Test User A and Test User B
const tokenA = jwt.sign(
  { id: 'test_user_a_uid', firebase_uid: 'test_user_a_uid', email: 'testA@auraai.test' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const tokenB = jwt.sign(
  { id: 'test_user_b_uid', firebase_uid: 'test_user_b_uid', email: 'testB@auraai.test' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

async function runE2ETests() {
  console.log('🚀 STARTING COMPREHENSIVE END-TO-END MULTI-USER API AUDIT & TEST MATRIX');
  const results: { feature: string; expected: string; actual: string; status: 'PASS' | 'FAIL' }[] = [];

  const logResult = (feature: string, expected: string, actual: string, passed: boolean) => {
    const status = passed ? 'PASS' : 'FAIL';
    results.push({ feature, expected, actual, status });
    console.log(`[${status}] ${feature} | Expected: ${expected} | Actual: ${actual}`);
  };

  try {
    // 1. Unauthorized access test
    const unauthRes = await fetch(`${API_BASE}/profiles/me`);
    logResult('Security Unauthorized Check', '401', `${unauthRes.status}`, unauthRes.status === 401);

    // 2. Profile User A check
    const profileARes = await fetch(`${API_BASE}/profiles/me`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const profileA = await profileARes.json();
    logResult(
      'Profile User A Data Isolation',
      'Test User A (Male, 178cm)',
      `${profileA.display_name || profileA.first_name} (${profileA.gender})`,
      profileARes.ok && (profileA.display_name === 'Test User A' || profileA.first_name === 'Test User A')
    );

    // 3. Profile User B check
    const profileBRes = await fetch(`${API_BASE}/profiles/me`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const profileB = await profileBRes.json();
    logResult(
      'Profile User B Data Isolation',
      'Test User B (Female, 165cm)',
      `${profileB.display_name || profileB.first_name} (${profileB.gender})`,
      profileBRes.ok && (profileB.display_name === 'Test User B' || profileB.first_name === 'Test User B')
    );

    // 4. Discovery test (User A discovers User B)
    const discoverARes = await fetch(`${API_BASE}/profiles/discover`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const discoverA = await discoverARes.json();
    const foundBInDiscover = discoverA.profiles?.some((p: any) => p.id === 'test_user_b_uid' || p.name === 'Test User B');
    logResult(
      'Discovery Real Users',
      'User B present in User A discover list',
      `Found B: ${foundBInDiscover}`,
      foundBInDiscover
    );

    // 5. User A likes User B (One-way swipe)
    const swipe1Res = await fetch(`${API_BASE}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ targetId: 'test_user_b_uid', direction: 'like' })
    });
    const swipe1 = await swipe1Res.json();
    logResult(
      'One-Way Swipe Like',
      'isMatch: false (Pending reciprocal like)',
      `isMatch: ${swipe1.isMatch}`,
      swipe1Res.ok && swipe1.isMatch === false
    );

    // 6. User B receives notification
    const notifBRes = await fetch(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const notifB = await notifBRes.json();
    logResult(
      'Notification System',
      'Notifications fetched successfully',
      `Count: ${notifB.notifications?.length || 0}`,
      notifBRes.ok && Array.isArray(notifB.notifications)
    );

    // 7. User B likes User A (Reciprocal swipe -> REAL MATCH)
    const swipe2Res = await fetch(`${API_BASE}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({ targetId: 'test_user_a_uid', direction: 'like' })
    });
    const swipe2 = await swipe2Res.json();
    logResult(
      'Reciprocal Like Match Creation',
      'isMatch: true with Match ID',
      `isMatch: ${swipe2.isMatch}, matchId: ${swipe2.match?.id}`,
      swipe2Res.ok && swipe2.isMatch === true && !!swipe2.match?.id
    );

    const matchId = swipe2.match?.id;

    // 8. Both users see the match in Matches List
    const matchesARes = await fetch(`${API_BASE}/chats/matches`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const matchesA = await matchesARes.json();
    const hasMatchInA = matchesA.matches?.some((m: any) => m.matchId === matchId);
    logResult(
      'Matches List Consistency User A',
      'Match record visible for User A',
      `Match found: ${hasMatchInA}`,
      matchesARes.ok && hasMatchInA
    );

    // 9. User A sends message to User B
    const sendMsgARes = await fetch(`${API_BASE}/chats/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ matchId, text: 'Hi User B from E2E Test' })
    });
    const sendMsgA = await sendMsgARes.json();
    logResult(
      'Human Message Dispatch User A -> B',
      'Message saved successfully',
      `Message ID: ${sendMsgA.newMessage?.id}`,
      sendMsgARes.ok && sendMsgA.success && !!sendMsgA.newMessage?.id
    );

    // 10. User B receives message from User A
    const getMsgsBRes = await fetch(`${API_BASE}/chats/messages/${matchId}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const getMsgsB = await getMsgsBRes.json();
    const receivedMsg = getMsgsB.messages?.find((m: any) => m.text === 'Hi User B from E2E Test');
    logResult(
      'Human Message Persistence & Load User B',
      'Contains "Hi User B from E2E Test"',
      `Found text: ${receivedMsg?.text}`,
      getMsgsBRes.ok && !!receivedMsg
    );

    // 11. User B replies to User A
    const sendMsgBRes = await fetch(`${API_BASE}/chats/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({ matchId, text: 'Hi User A, reply from E2E Test!' })
    });
    const sendMsgB = await sendMsgBRes.json();
    logResult(
      'Human Message Reply User B -> A',
      'Reply saved successfully',
      `Reply ID: ${sendMsgB.newMessage?.id}`,
      sendMsgBRes.ok && sendMsgB.success
    );

    // 12. User A receives User B's reply
    const getMsgsARes = await fetch(`${API_BASE}/chats/messages/${matchId}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const getMsgsA = await getMsgsARes.json();
    const receivedReply = getMsgsA.messages?.find((m: any) => m.text === 'Hi User A, reply from E2E Test!');
    logResult(
      'Human Message Reply Received User A',
      'Contains "Hi User A, reply from E2E Test!"',
      `Found text: ${receivedReply?.text}`,
      getMsgsARes.ok && !!receivedReply
    );

    // 13. Profile Edit & Isolation Test (User A updates bio)
    const updateARes = await fetch(`${API_BASE}/profiles/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ bio: 'Updated Bio for User A E2E Test' })
    });
    const updateA = await updateARes.json();
    logResult(
      'Profile Editing User A',
      'Bio updated for User A',
      `Updated: ${updateA.success}`,
      updateARes.ok && updateA.success
    );

    // Verify User B profile was NOT modified by User A's update
    const reProfileBRes = await fetch(`${API_BASE}/profiles/me`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const reProfileB = await reProfileBRes.json();
    logResult(
      'Profile Isolation Check',
      'User B bio unchanged',
      `Bio: ${reProfileB.bio}`,
      reProfileBRes.ok && reProfileB.bio !== 'Updated Bio for User A E2E Test'
    );

  } catch (err: any) {
    console.error('❌ E2E Test Execution Error:', err);
  }

  console.log('\n===========================================================');
  console.log('SUMMARY OF END-TO-END TEST MATRIX:');
  const passCount = results.filter(r => r.status === 'PASS').length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passCount} | FAILED: ${results.length - passCount}`);
  console.log('===========================================================');
}

runE2ETests();
