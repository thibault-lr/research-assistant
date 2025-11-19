import { google } from "@ai-sdk/google";
import { LanguageModel, streamText, tool } from "ai";
import { callBioMCPTool } from "@/lib/lib-biomcp";
import {
  articleSearchArgsSchema,
  trialSearchArgsSchema,
  variantSearchArgsSchema,
  aiResultSchema,
  type ArticleSearchInput,
  type TrialSearchInput,
  type VariantSearchInput,
  type ArticleSearchArgs,
  type TrialSearchArgs,
  type VariantSearchArgs,
  type AiResult,
} from "@/domain/tools";

type StreamTextOptions = Parameters<typeof streamText>[0];
type StreamTextResult = ReturnType<typeof streamText>;

export const AI_MODEL: LanguageModel = google("gemini-2.0-flash");

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
    execute: async (params: ArticleSearchInput): Promise<AiResult> => {
      const transformed: ArticleSearchArgs = {
        keywords: params.keywords ? [params.keywords] : undefined,
        diseases: params.diseases ? [params.diseases] : undefined,
        genes: params.genes ? [params.genes] : undefined,
        chemicals: params.chemicals ? [params.chemicals] : undefined,
        variants: params.variants ? [params.variants] : undefined,
        page_size: params.page_size ?? 10,
        include_preprints: true,
      };
      return callBioMCPTool<AiResult>("article_searcher", transformed);
    },
  }),

  searchTrials: tool({
    description:
      "Search ClinicalTrials.gov for clinical trials. Use when users ask about studies, trials, recruiting status, or clinical research.",
    inputSchema: trialSearchArgsSchema,
    outputSchema: aiResultSchema,
    execute: async (params: TrialSearchInput): Promise<AiResult> => {
      const transformed: TrialSearchArgs = {
        conditions: params.conditions ? [params.conditions] : undefined,
        interventions: params.interventions
          ? [params.interventions]
          : undefined,
        other_terms: params.other_terms ? [params.other_terms] : undefined,
        recruiting_status: params.recruiting_status,
        phase: params.phase,
        page_size: params.page_size ?? 10,
      };
      return callBioMCPTool<AiResult>("trial_searcher", transformed);
    },
  }),

  searchVariants: tool({
    description:
      "Search MyVariant.info for genetic variant information. Use when users ask about mutations, variants, rsIDs, or genetic annotations.",
    inputSchema: variantSearchArgsSchema,
    outputSchema: aiResultSchema,
    execute: async (params: VariantSearchInput): Promise<AiResult> => {
      const transformed: VariantSearchArgs = {
        rsid: params.rsid,
        gene: params.gene,
        hgvs: params.hgvs,
        significance: params.significance,
        page_size: params.page_size ?? 10,
      };
      return callBioMCPTool<AiResult>("variant_searcher", transformed);
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
