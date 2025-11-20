import { UIMessage } from "ai";
import { ChatMessage } from "@/domain/chat";

export function getMessageText(message: UIMessage): string {
  if (message.parts.length === 0) {
    return "";
  }

  return message.parts
    .filter((part) => part.type === "text" && "text" in part)
    .map((part) => part.text)
    .join("");
}

export function normalizeMessage(
  message: ChatMessage
): { role: "user" | "assistant"; content: string } {
  if (message.content) {
    return {
      role: message.role,
      content: message.content,
    };
  }

  if (message.parts) {
    const textParts = message.parts
      .filter((part) => part.type === "text" && part.text)
      .map((part) => part.text as string);

    return {
      role: message.role,
      content: textParts.join(""),
    };
  }

  return {
    role: message.role,
    content: "",
  };
}

