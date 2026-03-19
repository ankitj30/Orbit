import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080';

async function testBackend() {
    try {
        console.log('--- Testing Backend ---');

        // 1. Create Thread
        console.log('\n1. Creating Thread...');
        const threadRes = await fetch(`${BASE_URL}/threads`, { method: 'POST' });
        const thread = await threadRes.json();
        console.log('CREATED THREAD:', thread);

        if (!thread.threadId) throw new Error('Thread creation failed');

        // 2. Send Message
        console.log('\n2. Sending Message...');
        const chatRes = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                threadId: thread.threadId,
                message: 'Hello, explain quantum physics in 1 sentence.'
            })
        });
        const chatData = await chatRes.json();
        console.log('CHAT RESPONSE:', chatData);

        if (!chatData.aiMessage) throw new Error('Chat failed');

        // 3. Get Messages
        console.log('\n3. Fetching Messages...');
        const msgsRes = await fetch(`${BASE_URL}/threads/${thread.threadId}`);
        const msgs = await msgsRes.json();
        console.log(`FETCHED ${msgs.length} MESSAGES`);

        // 4. Delete Thread
        console.log('\n4. Deleting Thread...');
        const delRes = await fetch(`${BASE_URL}/threads/${thread.threadId}`, { method: 'DELETE' });
        const delData = await delRes.json();
        console.log('DELETE RESPONSE:', delData);

        console.log('\n✅ Backend Verification Passed!');
    } catch (err) {
        console.error('\n❌ Backend Verification Failed:', err);
    }
}

testBackend();
