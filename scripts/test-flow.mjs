import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testFlow() {
    console.log("--- STARTING END-TO-END FLOW TEST ---");

    // 1. Test Tailor API directly (using text)
    console.log("\nStep 1: Testing /api/tailor (with retry/fallback testing)...");
    const tailorRes = await fetch(`${baseUrl}/api/tailor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            originalResume: "John Doe. Experience: 5 years in React. Skills: JS, React, Node.",
            jobDescription: "Looking for a Senior React Developer with Node experience.",
            language: 'en',
            strength: 'balanced'
        })
    });

    if (!tailorRes.ok) {
        console.error("Tailor API Failed:", await tailorRes.text());
        return;
    }
    const tailorData = await tailorRes.json();
    console.log("Tailor API Success!");
    console.log("ATS Score:", tailorData.data.ats_score);
    console.log("Predicted Score:", tailorData.data.predicted_ats_score);

    // 2. Test PDF API
    console.log("\nStep 2: Testing /api/pdf...");
    const pdfRes = await fetch(`${baseUrl}/api/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            htmlContent: tailorData.data.tailored_resume_html,
            template: 'modern'
        })
    });

    if (!pdfRes.ok) {
        console.error("PDF API Failed:", await pdfRes.text());
        return;
    }
    const pdfData = await pdfRes.json();
    console.log("PDF API Success! URL:", pdfData.url);

    console.log("\n--- FLOW TEST COMPLETED SUCCESSFULLY ---");
}

testFlow().catch(console.error);
