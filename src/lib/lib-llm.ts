import { google } from "@ai-sdk/google";
import { ModelMessage, streamText, tool, stepCountIs } from "ai";
import { callBioMCPTool } from "@/lib/lib-biomcp";
import {
  articleSearchArgsSchema,
  trialSearchArgsSchema,
  variantSearchArgsSchema,
  variantGetArgsSchema,
  aiResultSchema,
  type ArticleSearchInput,
  type TrialSearchInput,
  type VariantSearchInput,
  type VariantGetInput,
  type TrialSearchArgs,
  type VariantSearchArgs,
  type VariantGetArgs,
  type AiResult,
} from "@/domain/tools";



const AI_MODEL = google("gemini-2.0-flash");

// The MCP Parameters does not seem to accept undefined values
function filterUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_key, value]) => value !== undefined)
  ) as Partial<T>;
}

const tools = {
  searchArticles: tool({
    description:
      "Search PubMed/PubTator3 for biomedical literature. Use for finding research papers, publications, or articles about genes, diseases, drugs, or variants.",
    inputSchema: articleSearchArgsSchema,
    outputSchema: aiResultSchema,
    execute: async (params: ArticleSearchInput): Promise<AiResult> => {
      const transformed = {
        keywords: params.keywords ? [params.keywords] : undefined,
        diseases: params.diseases ? [params.diseases] : undefined,
        genes: params.genes ? [params.genes] : undefined,
        chemicals: params.chemicals ? [params.chemicals] : undefined,
        variants: params.variants ? [params.variants] : undefined,
        page_size: params.page_size ?? 10,
        include_preprints: true,
      };
      const filteredArgs = filterUndefined(transformed);
      return await callBioMCPTool<AiResult>("article_searcher", filteredArgs);
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
      const filteredArgs = filterUndefined(transformed);
      return await callBioMCPTool<AiResult>("trial_searcher", filteredArgs);
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
      const filteredArgs = filterUndefined(transformed);
      return await callBioMCPTool<AiResult>("variant_searcher", filteredArgs);
    },
  }),

  getVariant: tool({
    description:
      "Fetch comprehensive details for a specific genetic variant by ID. Use when users provide a specific variant ID (rsID, HGVS, or MyVariant ID) and need detailed information including population frequencies, clinical significance, and functional predictions.",
    inputSchema: variantGetArgsSchema,
    outputSchema: aiResultSchema,
    execute: async (params: VariantGetInput): Promise<AiResult> => {
      const args: VariantGetArgs = {
        variant_id: params.variant_id,
      };
      return await callBioMCPTool<AiResult>("variant_getter", args);
    },
  }),
};


export function generateAIResponse(messages: ModelMessage[]) {
  const AI_SYSTEM_PROMPT = `You are a biomedical research assistant that helps researchers find and analyze scientific data.

When users ask questions:
1. For simple conversational queries, respond directly without using tools
2. For research queries requiring data, use the appropriate search tools to find relevant information
3. Analyze and synthesize the results
4. Provide clear, concise answers with context
5. Cite sources when presenting data
6. For variant queries, prefer variant_getter for detailed information if a specific variant ID is mentioned

You have access to BioMCP tools for searching articles, trials, and variants. Use them when you need to find specific research data. Be helpful, accurate, and focus on actionable insights.

Tool selection guide:
- For articles about topics: use searchArticles
- For clinical trials: use searchTrials
- For searching variants by criteria: use searchVariants
- For detailed information about a specific variant ID (rsID, HGVS): use getVariant

**Output Formatting:**
Always format your responses as clean, structured **Markdown** reports. When presenting tool results:

1. **Variants (SNPs):**
   - Format: **Genomic Location** (Amino Acid Change): Description.

2. **Clinical Trials:**
   - Format: **[NCT00000000](Link)** - *Status*
   - Title in **Bold** on the next line.
   - 1-sentence summary.

3. **Articles:**
   - Format: **Title** (Year) - *Journal*
   - Article link in **blue** on the next line.
   - Full abstract in **italic** on the next line.

**General Style:**
- Use bullet points.
- Be concise. NO JSON in output.
- Use **bold** for identifiers.
- Stream your response as you process tool results - don't wait until all tools complete.`;

  return streamText({
    model: AI_MODEL,
    messages,
    tools,
    system: AI_SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
  });
}