import { readFromEnv } from "@/utils/env";
import { Client } from "@modelcontextprotocol/sdk/client";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

export async function callBioMCPTool<T = unknown>(
  name: string,
  args: Record<string, unknown>
): Promise<T> {
  const mcpUrl = readFromEnv("BIOMCP_URL");
  const client = new Client({ name: "biomcp-assistant", version: "1.0.0" });

  // TODO: Use StreamableHTTPClientTransport when server supports http
  const transport = new SSEClientTransport(new URL(mcpUrl));

  try {
    await client.connect(transport);

    const result = await client.callTool({
      name,
      arguments: args,
    });

    if (result.isError) {
      throw new Error("MCP result error", { cause: result.isError });
    }

    return result.content as T;
  } catch (error: unknown) {
    console.error(`[BioMCP] Error calling tool ${name}:`, error);

    // In case error are meant to be handled differently
    if (error instanceof Error) {
      throw new Error(`Error while calling BioMCP tool : ${name}`, {
        cause: error.cause,
      });
    }
    throw error;
  } finally {
    await transport.close();
  }
}
