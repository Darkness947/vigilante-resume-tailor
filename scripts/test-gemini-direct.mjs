import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API Key found in .env.local");
    process.exit(1);
}

const model = "gemini-2.5-flash"; // Stable model from the list
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const payload = {
    contents: [{
        parts: [{ text: "Hello, tell me a short joke." }]
    }]
};

async function test() {
    console.log(`Testing Gemini API with model: ${model}...`);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log(`Status: ${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

test();
