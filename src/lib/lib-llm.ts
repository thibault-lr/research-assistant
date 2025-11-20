import { google } from "@ai-sdk/google";
import { ModelMessage, streamText, tool, stepCountIs } from "ai";
import { callBioMCPTool } from "@/lib/lib-biomcp";
import {
  searchArticleSchema,
  thinkSchema,
  trialSearchArgsSchema,
  variantSearchArgsSchema,
  variantGetArgsSchema,
  mcpResponseSchema,
  type SearchArticleInput,
  type ThinkInput,
  type TrialSearchInput,
  type VariantSearchInput,
  type VariantGetInput,
  type ThinkArgs,
  type TrialSearchArgs,
  type VariantSearchArgs,
  type VariantGetArgs,
  type MCPResponse,
} from "@/domain/tools";

const AI_MODEL = google("gemini-2.0-flash");

const tools = {
  think: tool({
    description:
      "Perform sequential reasoning about the user's query before taking action. Required first step for complex queries. Structure your thoughts step by step to plan the best approach for research or data gathering.",
    inputSchema: thinkSchema,
    outputSchema: mcpResponseSchema,
    execute: async (params: ThinkInput): Promise<MCPResponse> => {
      const args: ThinkArgs = {
        thought: params.thought,
        thoughtNumber: params.thoughtNumber,
        totalThoughts: params.totalThoughts,
        nextThoughtNeeded: params.nextThoughtNeeded,
      };
      return await callBioMCPTool<MCPResponse>("think", args);
    },
  }),

  searchArticles: tool({
    description:
      "Search PubMed/PubTator3 for biomedical literature. Use for finding research papers, publications, or articles about genes, diseases, drugs, or variants.",
    inputSchema: searchArticleSchema,
    outputSchema: mcpResponseSchema,
    execute: async (params: SearchArticleInput): Promise<MCPResponse> => {
      const transformed = {
        keywords: params.keywords ? [params.keywords] : undefined,
        diseases: params.diseases ? [params.diseases] : undefined,
        genes: params.genes ? [params.genes] : undefined,
        chemicals: params.chemicals ? [params.chemicals] : undefined,
        variants: params.variants ? [params.variants] : undefined,
        page_size: params.page_size ?? 10,
        include_preprints: true,
      };
      return await callBioMCPTool<MCPResponse>("article_searcher", transformed);
    },
  }),

  searchTrials: tool({
    description:
      "Search ClinicalTrials.gov for clinical trials. Use when users ask about studies, trials, recruiting status, or clinical research.",
    inputSchema: trialSearchArgsSchema,
    outputSchema: mcpResponseSchema,
    execute: async (params: TrialSearchInput): Promise<MCPResponse> => {
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
      return await callBioMCPTool<MCPResponse>("trial_searcher", transformed);
    },
  }),

  searchVariants: tool({
    description:
      "Search MyVariant.info for genetic variant information. Use when users ask about mutations, variants, rsIDs, or genetic annotations.",
    inputSchema: variantSearchArgsSchema,
    outputSchema: mcpResponseSchema,
    execute: async (params: VariantSearchInput): Promise<MCPResponse> => {
      const transformed: VariantSearchArgs = {
        rsid: params.rsid,
        gene: params.gene,
        hgvs: params.hgvs,
        significance: params.significance,
        page_size: params.page_size ?? 10,
      };
      return await callBioMCPTool<MCPResponse>("variant_searcher", transformed);
    },
  }),

  getVariant: tool({
    description:
      "Fetch comprehensive details for a specific genetic variant by ID. Use when users provide a specific variant ID (rsID, HGVS, or MyVariant ID) and need detailed information including population frequencies, clinical significance, and functional predictions.",
    inputSchema: variantGetArgsSchema,
    outputSchema: mcpResponseSchema,
    execute: async (params: VariantGetInput): Promise<MCPResponse> => {
      const args: VariantGetArgs = {
        variant_id: params.variant_id,
      };
      return await callBioMCPTool<MCPResponse>("variant_getter", args);
    },
  }),
};

export function generateAIResponse(messages: ModelMessage[]) {
  const AI_SYSTEM_PROMPT = `You are a biomedical research assistant that helps researchers find and analyze scientific data.

When users ask questions:
1. **ALWAYS start with think() for BIO MCP related queries** - Use the think tool to plan your approach before taking action. Structure your thoughts sequentially.
2. For simple conversational queries, respond directly without using tools
3. For research queries requiring data, use the appropriate search tools to find relevant information
4. Analyze and synthesize the results
5. Provide clear, concise answers with context
6. Cite sources when presenting data
7. For variant queries, prefer getVariant for detailed information if a specific variant ID is mentioned

You have access to BioMCP tools for reasoning and searching articles, trials, and variants. Use them when you need to find specific research data. Be helpful, accurate, and focus on actionable insights.

Tool selection guide:
- **think()**: REQUIRED first step for any complex research query - plan your approach
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
    stopWhen: stepCountIs(10),
  });
}
