import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildAnalyzePrompt } from "@/lib/prompts";

export async function POST(request) {
    try {
        const { text, apiKey, baseUrl, model } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: "No document text provided" },
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

        const messages = buildAnalyzePrompt(text);

        const completion = await openai.chat.completions.create({
            model: model || "llama-3.3-70b-versatile",
            messages: messages,
            temperature: 0.1,
            max_tokens: 4096,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0].message.content;

        let analysis;
        try {
            analysis = JSON.parse(responseText);
        } catch {
            // If JSON parsing fails, try to extract JSON from the response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("AI response was not valid JSON");
            }
        }

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            { error: "Analysis failed: " + error.message },
            { status: 500 }
        );
    }
}
