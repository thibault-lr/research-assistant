import { UIMessage } from "ai";
import { ChatMessage, MessageRole } from "@/domain/chat";

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

export function normalizeMessage(message: ChatMessage | UIMessage): {
  role: MessageRole;
  content: string;
} {
  if ("content" in message && message.content) {
    return {
      role: message.role,
      content: message.content,
    };
  }

  if ("parts" in message && message.parts) {
    return {
      role: message.role,
      content: extractTextFromParts(message.parts),
    };
  }

  return {
    role: message.role,
    content: "",
  };
}
