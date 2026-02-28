import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildChatMessages } from "@/lib/prompts";

export async function POST(request) {
    try {
        const { question, documentText, chatHistory, apiKey, baseUrl, model } =
            await request.json();

        if (!question || !documentText) {
            return NextResponse.json(
                { error: "Question and document text are required" },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key is required. Please configure it in Settings." },
                { status: 400 }
            );
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseUrl || "https://api.groq.com/openai/v1",
        });

        const messages = buildChatMessages(
            documentText,
            chatHistory || [],
            question
        );

        const completion = await openai.chat.completions.create({
            model: model || "llama-3.3-70b-versatile",
            messages: messages,
            temperature: 0.3,
            max_tokens: 2048,
        });

        const reply = completion.choices[0].message.content;

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Chat failed: " + error.message },
            { status: 500 }
        );
    }
}
