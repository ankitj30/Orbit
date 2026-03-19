import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080';

async function debugAuthChat() {
    try {
        console.log("--- DEBUG AUTH CHAT START ---");

        // 1. Register/Login User
        console.log("1. Authenticating...");
        const userPayload = {
            name: "Debug User",
            email: "debug" + Date.now() + "@test.com",
            password: "password123"
        };

        let authRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userPayload)
        });

        let user = await authRes.json();
        if (!authRes.ok) {
            console.log("Register failed, trying login...");
            // Fallback login logic if needed, but unique email above prevents this usually
        }

        if (!user.token) {
            throw new Error("Authentication failed: " + JSON.stringify(user));
        }
        console.log("✅ Authenticated as:", user.email);
        const token = user.token;

        // 2. Create Thread
        console.log("2. Creating Thread...");
        const threadRes = await fetch(`${BASE_URL}/threads`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!threadRes.ok) {
            throw new Error("Create Thread failed: " + await threadRes.text());
        }

        const thread = await threadRes.json();
        console.log('✅ Created Thread ID:', thread.threadId);

        // 3. Send Message
        console.log('3. Sending message: "Hello AI"');
        const start = Date.now();

        const chatRes = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                threadId: thread.threadId,
                message: 'Hello AI'
            })
        });

        console.log('HTTP Status:', chatRes.status);
        const text = await chatRes.text();
        console.log('Raw Response Body:', text.substring(0, 500)); // Truncate for readability

        try {
            const json = JSON.parse(text);
            if (json.aiMessage) {
                console.log("✅ SUCCESS: AI Reply:", json.aiMessage.content);
            } else if (json.error) {
                console.log("❌ ERROR from API:", json.error, json.details);
            } else {
                console.log("⚠️ WARNING: Unexpected JSON", Object.keys(json));
            }
        } catch (e) {
            console.log("❌ Failed to parse JSON response");
        }

    } catch (e) {
        console.error("FATAL SCRIPT ERROR:", e);
    }
}

debugAuthChat();
