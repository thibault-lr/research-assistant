import { describe, it, expect, vi } from "vitest";
import { callBioMCPTool } from "./lib-biomcp";

const mockCallTool = vi.fn();
vi.mock(import("@modelcontextprotocol/sdk/client"), () => {
  const Client = vi.fn(
    class {
      connect = vi.fn();
      callTool = mockCallTool;
    }
  );
  return {
    ...vi.importActual("@modelcontextprotocol/sdk/client"),
    Client,
  };
});

const mockCloseTransport = vi.fn();
vi.mock("@modelcontextprotocol/sdk/client/sse.js", () => {
  const SSEClientTransport = vi.fn(
    class {
      close = mockCloseTransport;
    }
  );

  return { SSEClientTransport };
});

describe("callBioMCPTool", () => {
  it("returns the tool result", async () => {
    const mockResult = { isError: false, content: { data: "test data" } };
    mockCallTool.mockResolvedValueOnce(mockResult);

    const result = await callBioMCPTool("test-tool", { param1: "value1" });

    expect(result).toEqual(mockResult.content);
    expect(mockCloseTransport).toHaveBeenCalled();
  });

  describe("regarding errors", () => {
    it("throws an error when the result is in error and closes the transport", async () => {
      mockCallTool.mockResolvedValue({
        isError: "Some error occurred",
      });

      await expect(callBioMCPTool("test-tool", {})).rejects.toThrow(
        new Error("Error while calling BioMCP tool : test-tool", {
          cause: "Some error occurred",
        })
      );
      expect(mockCloseTransport).toHaveBeenCalled();
    });
  });
});
