import { z } from "zod";

export const articleSearchArgsSchema = z
  .object({
    keywords: z.string().describe("Search keywords or full query text for articles"),
    diseases: z.string().optional().describe("Disease names (e.g., 'inflammatory bowel disease')"),
    genes: z.string().optional().describe("Gene symbols (e.g., 'BRAF', 'TNF-alpha')"),
    chemicals: z.string().optional().describe("Drug or chemical names (e.g., 'adalimumab', 'TNF-alpha inhibitors')"),
    variants: z.string().optional().describe("Genetic variant identifiers (e.g., 'V600E', 'p.D277Y')"),
    page_size: z.number().min(1).max(50).default(10).optional(),
  })
  .transform((data) => ({
    keywords: data.keywords ? [data.keywords] : undefined,
    diseases: data.diseases ? [data.diseases] : undefined,
    genes: data.genes ? [data.genes] : undefined,
    chemicals: data.chemicals ? [data.chemicals] : undefined,
    variants: data.variants ? [data.variants] : undefined,
    page_size: data.page_size ?? 10,
    include_preprints: true as const,
  }));

export const trialSearchArgsSchema = z
  .object({
    conditions: z.string().optional().describe("Medical conditions (e.g., 'Crohn's disease', 'melanoma')"),
    interventions: z.string().optional().describe("Treatments or interventions (e.g., 'adalimumab', 'pembrolizumab')"),
    other_terms: z.string().optional().describe("Additional search terms for trials"),
    recruiting_status: z.enum(["OPEN", "CLOSED", "ANY"]).optional().describe("Filter by recruiting status"),
    phase: z.enum(["EARLY_PHASE1", "PHASE1", "PHASE2", "PHASE3", "PHASE4"]).optional().describe("Filter by trial phase"),
    page_size: z.number().min(1).max(50).default(10).optional(),
  })
  .transform((data) => ({
    conditions: data.conditions ? [data.conditions] : undefined,
    interventions: data.interventions ? [data.interventions] : undefined,
    other_terms: data.other_terms ? [data.other_terms] : undefined,
    recruiting_status: data.recruiting_status,
    phase: data.phase,
    page_size: data.page_size ?? 10,
  }));

export const variantSearchArgsSchema = z
  .object({
    rsid: z.string().optional().describe("dbSNP rsID (e.g., 'rs113488022', 'rs121913254')"),
    gene: z.string().optional().describe("Gene symbol (e.g., 'BRAF', 'TP53')"),
    hgvs: z.string().optional().describe("HGVS notation (e.g., 'chr7:g.140453136A>T')"),
    significance: z
      .enum(["pathogenic", "likely_pathogenic", "uncertain_significance", "likely_benign", "benign"])
      .optional()
      .describe("Filter by clinical significance"),
    page_size: z.number().min(1).max(50).default(10).optional(),
  })
  .transform((data) => ({
    rsid: data.rsid,
    gene: data.gene,
    hgvs: data.hgvs,
    significance: data.significance,
    page_size: data.page_size ?? 10,
  }));

export const variantGetArgsSchema = z
  .object({
    variant_id: z.string().describe("Variant ID in HGVS format, rsID, or MyVariant ID (e.g., 'rs113488022', 'chr7:g.140753336A>T')"),
  })
  .transform((data) => ({
    variant_id: data.variant_id,
  }));

export const aiResultSchema = z.any().describe("AI tool execution result");

export type ArticleSearchArgs = z.infer<typeof articleSearchArgsSchema>;
export type TrialSearchArgs = z.infer<typeof trialSearchArgsSchema>;
export type VariantSearchArgs = z.infer<typeof variantSearchArgsSchema>;
export type VariantGetArgs = z.infer<typeof variantGetArgsSchema>;


export type AiResult = z.infer<typeof aiResultSchema>;
