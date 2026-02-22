import supabase from "@/services/supabase";
import { inngest } from "./client";

export const llmModel = inngest.createFunction(
  { id: "llm-model" },
  { event: "llm-model" },
  async ({ event, step }) => {
    const aiResp = await step.ai.infer("generate-ai-llm-model-call", {
      model: step.ai.models.openai({
        model: "llama-3.1-8b-instant",
        apiKey: process.env.GROQ_API_KEY,
        baseUrl: "https://api.groq.com/openai/v1",
      }),
      body: {
        messages: [
          {
            role: "system",
            content:
              `
Act like Perplexity AI.

Structure the response as:

## Overview
(2–3 sentence summary)

## Key Points
- Bullet point facts
- Important numbers, names, dates

## Details
(Short explanatory paragraph)

## Sources
- Include the provided link

Rules:
- No repetition
- No generic intro like "Here is a summary"
- Use markdown formatting
- Keep under 350 words
- return output in markdown format
` + event.data.searchInput,
          },
          {
            role: "user",
            content:
              "User input: " +
              event.data.searchInput +
              "\n\nSearch Results:\n" +
              JSON.stringify(event.data.searchResult),
          },
        ],
      },
    });

    // ✅ ADD ERROR CHECK HERE
    if (!aiResp?.choices?.[0]?.message?.content) {
      throw new Error("Groq returned an invalid or empty response");
    }

    const aiText = aiResp.choices[0].message.content;

    await step.run("saveToDb", async () => {
      await supabase
        .from("Chats")
        .update({ aiResp: aiText })
        .eq("id", event.data.recordId);
    });
  },
);
