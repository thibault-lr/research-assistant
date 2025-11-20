import { z } from "zod";

export const searchArticleSchema = z.object({
  keywords: z
    .string()
    .optional()
    .describe("Search keywords or full query text for articles"),
  diseases: z
    .string()
    .optional()
    .describe("Disease names (e.g., 'inflammatory bowel disease')"),
  genes: z
    .string()
    .optional()
    .describe("Gene symbols (e.g., 'BRAF', 'TNF-alpha')"),
  chemicals: z
    .string()
    .optional()
    .describe(
      "Drug or chemical names (e.g., 'adalimumab', 'TNF-alpha inhibitors')"
    ),
  variants: z
    .string()
    .optional()
    .describe("Genetic variant identifiers (e.g., 'V600E', 'p.D277Y')"),
  page_size: z.number().min(1).max(50).default(10).optional(),
});

export const trialSearchArgsSchema = z.object({
  conditions: z
    .string()
    .optional()
    .describe("Medical conditions (e.g., 'Crohn's disease', 'melanoma')"),
  interventions: z
    .string()
    .optional()
    .describe(
      "Treatments or interventions (e.g., 'adalimumab', 'pembrolizumab')"
    ),
  other_terms: z
    .string()
    .optional()
    .describe("Additional search terms for trials"),
  recruiting_status: z
    .enum(["OPEN", "CLOSED", "ANY"])
    .optional()
    .describe("Filter by recruiting status"),
  phase: z
    .enum(["EARLY_PHASE1", "PHASE1", "PHASE2", "PHASE3", "PHASE4"])
    .optional()
    .describe("Filter by trial phase"),
  page_size: z.number().min(1).max(50).default(10).optional(),
});

export const variantSearchArgsSchema = z.object({
  rsid: z
    .string()
    .optional()
    .describe("dbSNP rsID (e.g., 'rs113488022', 'rs121913254')"),
  gene: z.string().optional().describe("Gene symbol (e.g., 'BRAF', 'TP53')"),
  hgvs: z
    .string()
    .optional()
    .describe("HGVS notation (e.g., 'chr7:g.140453136A>T')"),
  significance: z
    .enum([
      "pathogenic",
      "likely_pathogenic",
      "uncertain_significance",
      "likely_benign",
      "benign",
    ])
    .optional()
    .describe("Filter by clinical significance"),
  page_size: z.number().min(1).max(50).default(10).optional(),
});

export const variantGetArgsSchema = z.object({
  variant_id: z
    .string()
    .describe(
      "Variant ID in HGVS format, rsID, or MyVariant ID (e.g., 'rs113488022', 'chr7:g.140753336A>T')"
    ),
});

export const thinkSchema = z.object({
  thought: z.string().describe("The current step of reasoning or analysis"),
  thoughtNumber: z
    .number()
    .int()
    .min(1)
    .describe("Sequential step number (starts at 1)"),
  totalThoughts: z
    .number()
    .int()
    .min(1)
    .describe("Estimated total number of reasoning steps"),
  nextThoughtNeeded: z
    .boolean()
    .describe("true if reasoning should continue, false if ready to execute"),
});

export type SearchArticleInput = z.infer<typeof searchArticleSchema>;
export type TrialSearchInput = z.infer<typeof trialSearchArgsSchema>;
export type VariantSearchInput = z.infer<typeof variantSearchArgsSchema>;
export type VariantGetInput = z.infer<typeof variantGetArgsSchema>;
export type ThinkInput = z.infer<typeof thinkSchema>;

export type ArticleSearchArgs = {
  keywords?: string[];
  diseases?: string[];
  genes?: string[];
  chemicals?: string[];
  variants?: string[];
  page_size: number;
  include_preprints: true;
};

export type TrialSearchArgs = {
  conditions?: string[];
  interventions?: string[];
  other_terms?: string[];
  recruiting_status?: "OPEN" | "CLOSED" | "ANY";
  phase?: "EARLY_PHASE1" | "PHASE1" | "PHASE2" | "PHASE3" | "PHASE4";
  page_size: number;
};

export type VariantSearchArgs = {
  rsid?: string;
  gene?: string;
  hgvs?: string;
  significance?:
    | "pathogenic"
    | "likely_pathogenic"
    | "uncertain_significance"
    | "likely_benign"
    | "benign";
  page_size: number;
};

export type VariantGetArgs = {
  variant_id: string;
};

export type ThinkArgs = {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  nextThoughtNeeded: boolean;
};

// Actually not used, but it aims to validate tools results
export const mcpResponseSchema = z.any().describe("AI tool execution result");
export type MCPResponse = z.infer<typeof mcpResponseSchema>;
