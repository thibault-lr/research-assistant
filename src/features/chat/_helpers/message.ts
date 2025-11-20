import { UIMessage } from "ai";
import { ChatMessage } from "@/domain/chat";

function extractTextFromParts(
  parts: Array<{ type: string; text?: string }>
): string {
  if (parts.length === 0) {
    return "";
  }

  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text as string)
    .join("");
}

export function normalizeMessage(
  message: ChatMessage | UIMessage
): { role: "user" | "assistant"; content: string } {
  if ("content" in message && message.content) {
    return {
      role: message.role as "user" | "assistant",
      content: message.content,
    };
  }

  if ("parts" in message && message.parts) {
    return {
      role: message.role as "user" | "assistant",
      content: extractTextFromParts(message.parts),
    };
  }

  return {
    role: message.role as "user" | "assistant",
    content: "",
  };
}

