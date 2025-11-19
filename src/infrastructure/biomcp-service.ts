import { Client } from "@modelcontextprotocol/sdk/client";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import z from "zod";

const contentSchema = z.strictObject({
  type: z.literal("text"),
  text: z.string(),
});

const contentValidator = z.object({
  content: contentSchema.array().min(1),
  structuredContent: z.record(z.literal("result"), z.string()).optional(),
});

export class BioMCPService {
  private client: Client;

  constructor(private readonly mcpUrl: string) {
    this.client = new Client(
      { name: "scienta-assistant", version: "1.0.0" },
      { capabilities: {} }
    );
  }

  async evaluateMessage(userQuery: string): Promise<string> {
    //  TODO: Migrate to StreamableHTTPClientTransport once server supports it
    const transport = new SSEClientTransport(new URL(this.mcpUrl));

    await this.client.connect(transport);

    await this.client.callTool({
      name: "think",
      arguments: {
        thought: `Planning search for: ${userQuery}`,
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: true,
      },
    });

    const searchResult = await this.client.callTool({
      name: "article_searcher",
      arguments: { keywords: [userQuery] },
    });

    const validation = contentValidator.parse(searchResult);

    const content =
      validation.structuredContent?.result ?? validation.content[0].text;

    return content;
  }
}
