import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API Key found");
    process.exit(1);
}

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-pro"
];

async function checkModels() {
    console.log("Checking model availability and quotas...");
    for (const model of modelsToTest) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
            });
            console.log(`- ${model}: ${res.status} ${res.statusText}`);
            if (!res.ok) {
                const data = await res.json();
                console.log(`  Error: ${data.error?.message.split('\n')[0]}`);
            }
        } catch (e) {
            console.log(`- ${model}: ERROR ${e.message}`);
        }
    }
}

checkModels();
