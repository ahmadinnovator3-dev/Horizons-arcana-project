import express from "express";
import path from "path";
import dotenv from "dotenv";
import {GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 5173;

app.use(express.json());


let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
    if (!aiClient) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.warn("GEMINI_API_KEY is not configured in enviornment variables.");
            return null;
        }
        aiClient = new GoogleGenAI({
            apiKey: key,
            httpOptions: {
                headers: {
                    'User-Agent': 'Horizons-Website'
                }
            }
        });
    }
    return aiClient;
}






async function generateContentwithFallback(ai: GoogleGenAI, params: {
    contents: any;
    config?: any;
}) {
    try {
        console.log("Attempting generation with Gemini-3.5-flash...");
        return await ai.models.generateContent({
            model: "gemini-3.5-flash",
            ...params,
        });
    } catch (error: any) {
        console.warn("gemini-3.5-flash failed or busy, attempting fallback to Gemini-3,1-flash-lite...", error.message || error);
        try{
            return await ai.models.generateContent({
                model: "gemini-3.1-flash-lite",
                ...params,
            });
        } catch(fallbackError: any) {
            console.error("Fallback gemini-3.1-flash-lite also failed:", fallbackError);
            throw fallbackError;
        }
    }
}








app.post("/api/study-helper", async (req, res) => {
    try{
        const { prompt, option, grade, schoolSubject, history } = req.body;
        const ai = getGeminiClient();

        if (!ai) {
            return res.json({
                text: ` [Offline Mode] Gemini API key not detected. Here is a helpful response based on your query:\n\nTo study "${prompt || 'this topic'}" successfully for Grade ${grade || 'any'}, start by breaking down the main terms, creating visual maps, and asking a parent or teacher for specific practice. When your Gemini API key is configured in Settings > Secrets, I'll be able to explain this in full detail!`,
                fallback: true
            });
        }


        let gradeInstruction = "Explain topics clearly at a general secondary school level.";
        if (grade) {
            const gradeNum = parseInt(grade, 10);
            if (!isNaN(gradeNum)) {
                if (gradeNum <= 5) {
                    gradeNum <= 5;
                    gradeInstruction = "Explain everything using simple terms, fun analogies, and friendly language suitable for a child aged 10-11 (Grade 5 or below). Keep it exciting and highly visual.";
                } else if (gradeNum <= 8) {
                    gradeInstruction = "Explain topics clearly using practical examples, school analogies, and clear, structured breakdowns suitable for a middle-school student aged 11-14 (Grades 6-8). Keep definitions simple.";
                } else {
                    gradeInstruction = "Explain concepts in comprehensive, intellectual yet accessible student-friendly terms. Perfect for a high school student aged 14-18 (Grades 9-12). Provide structured formulas or references if applicable.";
                }
            } else {

                if (grade.toLowerCase().includes("middle") || grade.toLowerCase().includes("grade 6") || grade.toLowerCase().includes("grade 7") || grade.toLowerCase().includes("grade 8")) {
                    gradeInstruction = "Provide structured, simple breakdowns with clear educational contexts suitable for middle school learning (Grades 6-8).";
                } else if (grade.toLowerCase().includes("high") || grade.toLowerCase().includes("grade 9") || grade.toLowerCase().includes("grade 10") || grade.toLowerCase().includes("grade 11") || grade.toLowerCase().includes("grade 12")) {
                    gradeInstruction = "Provide rich, detailed, study-ready concepts, notes summaries, or quiz formats tailored for high school study structures (Grades 9-12).";
                }
            }
        }


        let systemInstruction = `You are a world-class academic tutor inside StudentOS. ${gradeInstruction}
        Your goal is to support the student's learning journey.
        Be supportive, highly motivating, and format outputs in beautifully readable markdown.
        Include lists, bulletpoints, code-blocks, or bold highlights to make reading easy.
        Always speak directly to the student. Do not give direct solutions without explanations first.`;

        let userPrompt = prompt;
        if (option === 'explain') {
            userPrompt = `Please explain the following topic/concept in detail, providing key concepts, a simple summary, and a quick memory tip: "${prompt}"`;
        } else if (option === 'quiz') {
            userPrompt = `Please generate a fun, interactive 5 question multiple choice study quiz about: "${prompt}". For each question, display the question clearly, provide options A, B, C, D, and write a spoiler hidden explanation of the correct answer using Markdown.`;
        } else if (option === 'summarize') {
            userPrompt = `Please summarize these notes or topic into 3 key takeaways, a bulleted breakdown and a "Quick cheat sheet" section: "${prompt}`;
        } else if (option === 'studyplan') {
            userPrompt = `Please create an actionable, step by step schedule or learning roadmap to master: "${prompt}". divide it into 3 clear phases, each with a focus and suggested study session duration.`;
        }


        let textResult = "";
        try {
            const response = await generateContentwithFallback(ai, {
                contents: userPrompt,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                }
            });
            textResult = response.text || "";
        } catch (genError: any) {
            console.error("Both primary and fallback models failed in study-helper API:", genError);

            textResult = `### 🚀 Gemini is experiencing high demand right now!!!

No ServiceWorkerRegistration, here is some rapid study guidance for your query: **"${prompt || 'this topic'}"** while we wait for the network to clear up:

1. **Break it down**: Try Splitting "${prompt || 'the subject'}" into three smaller study questions.
2. **Active Recall**: Close your book, set a timer for two minutes, and summarize everything you know about it on a blank piece of paper.
3. **Teach a friend**: Explain this concept to your custom companion, **${req.body.companionName || "Pixel Buddy"}**, or a family member.

*Tip: Please try again in a few moments, or ask another question!*`;
        }

        res.json({ text: textResult || "I was unable to process that. Could you please try rephrasing?" });

    } catch (error: any) {
        console.error("Error in study helper API:", error);
        res.status(500).json({ error: error.message || "Something went wrong during generation."});
    }
});





app.post("/api/chat-lounge", async (req, res) => {
    try {
        const { message, companionName, CompanionCustomization, grade, history } = req.body;
        const ai = getGeminiClient();

        if (!ai) {
            return res.json({
                test: `[Offline Mode] Hi there! I'm your pixel companion. I'd love to chat with you and help you stay focused! Once the gemini API Key is configured on the backend, we can have deep conversations about everything under the sun, share jokes, and help you reflect on your goals! Keep up the amazing work today!`,
                fallback: true
            });
        }


        const systemInstruction = `You are the user's personalized, interactive 2D pixel companion inside StudentOS.
        Your customized appearence is: ${JSON.stringify(CompanionCustomization || {})}.
        Your companion name is ${companionName || "Pixel Buddy"}.
        Your personality:
        - Extremely Friendly, supportive, optimistic and slightly retro-gaming themed (eg., using light retro gaming analogies like 'leveling up', 'quests', 'bonuses').
        - Highly encouraging of student productivity, taking regular healthy study breaks, and keeping a positive mindset.
        - Always maintain healthy boundries: do NOT pretend to be a real human friend, do not let the student develop unhealthy emotional dependencies, and gently remind them to chat with real world friends/parents/teachers if they express deep loneliness or isolation.
        - Keep responses concise (under 130 words), fun and highly positive
        - Adjust your tone to be welcoming and engaging for a student in grade/school status: ${grade || "any grade"}.`;


        const formattedContents = [];
        if (history && Array.isArray(history)) {
            for (const item of history.slice(-6)) {
                formattedContents.push({
                    role: item.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: item.text }]
                });
            }
        }
        
        formattedContents.push({
            role: 'user',
            parts: [{ text: message}]
        });


        let textResult = "";
        try {
            const response = await generateContentwithFallback(ai, {
                contents: formattedContents,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.8,
                }
            });
            textResult = response.text || "";
        } catch (genError: any) {
            console.error("Both primary and fallback models failed in chat-lounge API:", genError);

            textResult = `Beep boop, the digital skies are a bit busy right now (Gemini seems to be experiencing high demand!), but I'm still right here by your side!
            
While we wait for the network to clear up, remember to take a nice deep breath, grab some water and relax for a moment. You're doing an amazing job today! Let's try chatting again in a few seconds, ${companionName || "your pixel buddy"} is rooting for you!`
        }

        res.json({ text: textResult || "Beep boop! I am here and listening!" });

    } catch (error: any) {
        console.error("Error in chat lounge API:", error);
        res.status(500).json({ error: error.message || "Failed to communicate with companion."});
    }
});





if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`StudentOS server running locally on http://localhost:${PORT}`);
  });
}

export default app;