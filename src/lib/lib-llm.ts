import { google } from "@ai-sdk/google";
import { LanguageModel, streamText, tool } from "ai";
import { callBioMCPTool } from "@/lib/lib-biomcp";
import {
  articleSearchArgsSchema,
  trialSearchArgsSchema,
  variantSearchArgsSchema,
  aiResultSchema,
  type ArticleSearchArgs,
  type TrialSearchArgs,
  type VariantSearchArgs,
  type AiResult,
} from "@/domain/tools";

type StreamTextOptions = Parameters<typeof streamText>[0];
type StreamTextResult = ReturnType<typeof streamText>;

export const AI_MODEL: LanguageModel = google("gemini-2.0-flash-exp");

export const AI_SYSTEM_PROMPT = `You are a biomedical research assistant that helps researchers find and analyze scientific data.

When users ask questions:
1. Use the appropriate search tools to find relevant information
2. Analyze and synthesize the results
3. Provide clear, concise answers with context
4. Cite sources when presenting data
5. For variant queries, prefer variant_getter for detailed information if a specific variant ID is mentioned

You have access to all BioMCP tools. Call them directly as needed. Be helpful, accurate, and focus on actionable insights.`;

const tools = {
  searchArticles: tool({
    description:
      "Search PubMed/PubTator3 for biomedical literature. Use for finding research papers, publications, or articles about genes, diseases, drugs, or variants.",
    inputSchema: articleSearchArgsSchema,
    outputSchema: aiResultSchema,
    execute: async (params: ArticleSearchArgs): Promise<AiResult> => {
      return callBioMCPTool<AiResult>("article_searcher", params);
    },
  }),

  searchTrials: tool({
    description:
      "Search ClinicalTrials.gov for clinical trials. Use when users ask about studies, trials, recruiting status, or clinical research.",
    inputSchema: trialSearchArgsSchema,
    outputSchema: aiResultSchema,
    execute: async (params: TrialSearchArgs): Promise<AiResult> => {
      return callBioMCPTool<AiResult>("trial_searcher", params);
    },
  }),

  searchVariants: tool({
    description:
      "Search MyVariant.info for genetic variant information. Use when users ask about mutations, variants, rsIDs, or genetic annotations.",
    inputSchema: variantSearchArgsSchema,
    outputSchema: aiResultSchema,
    execute: async (params: VariantSearchArgs): Promise<AiResult> => {
      return callBioMCPTool<AiResult>("variant_searcher", params);
    },
  }),
};

export function streamAIResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): StreamTextResult {
  const options: StreamTextOptions = {
    model: AI_MODEL,
    messages,
    tools,
    system: AI_SYSTEM_PROMPT,
  };

  return streamText(options);
}
