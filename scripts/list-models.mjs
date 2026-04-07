import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API Key found in .env.local");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
    console.log("Listing available Gemini models...");
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`Status: ${res.status} ${res.statusText}`);
            const err = await res.text();
            console.error(err);
            return;
        }
        const data = await res.json();
        console.log("Models:", JSON.stringify(data.models.map(m => m.name), null, 2));
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

listModels();
