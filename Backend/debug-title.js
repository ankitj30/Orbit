import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080';

async function debugTitle() {
    try {
        console.log("--- DEBUG TITLE START ---");

        // 1. Authenticate
        const userPayload = { name: "Title Tester", email: "title" + Date.now() + "@test.com", password: "password" };
        let authRes = await fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userPayload) });
        let user = await authRes.json();
        const token = user.token;
        console.log("Authenticated");

        // 2. Create Thread
        const threadRes = await fetch(`${BASE_URL}/threads`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
        const thread = await threadRes.json();
        console.log('Created Thread:', thread.threadId, "Title:", thread.title);

        // 3. Send Long Message
        const message = "This is a test message to verify the title update feature works";
        console.log("Sending:", message);

        await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ threadId: thread.threadId, message })
        });

        // 4. Fetch Thread to Check Title
        const checkRes = await fetch(`${BASE_URL}/threads/${thread.threadId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        // This returns messages. We need thread info. 
        // The details endpoint usually returns messages. 
        // We should fetch ALL threads to see the title in the list.
        const threadsRes = await fetch(`${BASE_URL}/threads`, { headers: { 'Authorization': `Bearer ${token}` } });
        const threads = await threadsRes.json();
        const updatedThread = threads.find(t => t.threadId === thread.threadId);

        console.log("Updated Title:", updatedThread.title);

        // Expected: "This is a test message to..."
        const expected = "This is a test message to...";
        if (updatedThread.title === expected) {
            console.log("✅ SUCCESS: Title updated correctly");
        } else {
            console.log("❌ FAIL: Title mismatch. Got:", updatedThread.title);
        }

    } catch (e) {
        console.error("ERROR:", e);
    }
}

debugTitle();
