import fetch from 'node-fetch';

async function debugChat() {
    try {
        console.log("--- DEBUG CHAT START ---");
        // Create thread to exist
        const threadRes = await fetch('http://localhost:8080/threads', { method: 'POST' });
        const thread = await threadRes.json();
        console.log('Created Thread ID:', thread.threadId);

        const start = Date.now();
        console.log('Sending message: "Who are you?"');

        const res = await fetch('http://localhost:8080/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                threadId: thread.threadId,
                message: 'Who are you?'
            })
        });

        console.log('HTTP Status:', res.status);
        const text = await res.text();
        console.log('Raw Response Body:', text);

        try {
            const json = JSON.parse(text);
            if (json.reply) {
                console.log("✅ SUCCESS: Gemini Reply Found:", json.reply);
            } else if (json.error) {
                console.log("❌ ERROR from API:", json.error, json.details);
            } else {
                console.log("⚠️ WARNING: Unexpected JSON structure", Object.keys(json));
            }
        } catch (e) {
            console.log("❌ Failed to parse JSON response");
        }

    } catch (e) {
        console.error("FATAL SCRIPT ERROR:", e);
    }
}

debugChat();
