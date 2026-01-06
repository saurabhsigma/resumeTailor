const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Manually read .env.local
let apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GOOGLE_API_KEY=(.*)/);
        if (match && match[1]) {
            apiKey = match[1].trim();
        }
    } catch (e) {
        console.error("Could not read .env.local");
    }
}

if (!apiKey) {
    console.error("No GOOGLE_API_KEY found.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    console.log("Using API Key:", apiKey.substring(0, 10) + "...");

    // Test 1: Simple Generate Content with 'gemini-1.5-flash'
    console.log("\n--- Testing gemini-1.5-flash ---");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello");
        console.log("Success! Response:", result.response.text());
    } catch (error) {
        console.error("Failed:", error.message);
    }

    // Test 2: gemini-pro
    console.log("\n--- Testing gemini-pro ---");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say hello");
        console.log("Success! Response:", result.response.text());
    } catch (error) {
        console.error("Failed:", error.message);
    }
}

run();
