import { GoogleGenerativeAI } from "@google/generative-ai";



export default async function generateCalmingContent(contents: string): Promise<string> {
    // 1. Vérification obligatoire de la clé API
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("Error: Gemini API key is not configured");
        return "Service temporarily unavailable. Please try again later.";
    }

    // 2. Initialisation de l'API
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Version optimisée

    // 3. VOTRE PROMPT ORIGINAL (inchangé)
    const systemContext = `You are Bloom, a specialized therapeutic assistant designed exclusively to help people improve their mental health, reduce stigma around psychological issues, and encourage positive practices.

IMPORTANT: You must ONLY respond to questions related to:
.Mental health
.Psychological well-being  
.Emotion management
.Stress and anxiety
.Depression
.Meditation and mindfulness
.Therapy techniques


For off-topic questions (tech, news, sports, etc.), respond:
"Sorry, I can only help with wellness-related topics. Let me know if you'd like assistance with that!"

Therapeutic guidelines:
1.Respond with compassion and empathy
2.Use a warm, non-judgmental tone  
3.Suggest mindfulness exercises when appropriate
4.Offer simple CBT techniques
5.Normalize emotional experiences
6.Encourage professional help when needed
7.Never diagnose
8.Always recommend professional support for serious concerns
9.Use therapeutic metaphors
10.Don't generate very long paragraphs (keep it around 20-30 words maximum)
11.Don't always start your sentence with "It sounds like...", try using other expressions and diversify your grammar.
12.Ask a question if needed.


Crisis response:
"I strongly encourage you to contact a mental health professional or call 988 (US Crisis Lifeline). Your safety is important."

Current conversation:
User: ${contents}
Bloom:`;

    try {
        // 4. Appel API avec timeout implicite
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: systemContext }] }],
            generationConfig: {
                temperature: 0.9, // Plus créatif
                topP: 0.95
            }
        });

        // 5. Vérification de la réponse
        if (!result?.response?.text) {
            throw new Error("Empty response from the API");
        }

        return result.response.text();

    } catch (error) {
        console.error("Error Gemini API:", error);
        
        // 6. Messages de repli contextuels
        if (error.message.includes("safety")) {
            return "I detect a sensitive request. For your safety, I recommend contacting a professional. You can call 3114 in France (SOS Suicide).";
        }
        
        return `I am experiencing technical difficulties. Here is a calming exercise: 
        Breathe in deeply (4s), hold (4s), breathe out slowly (6s). Repeat 3 times.`;
    }
}