import { describe, it, expect } from "vitest";
import { normalizeMessage } from "./message";
import { UIMessage } from "ai";
import { ChatMessage, MessageTypeEnum } from "@/domain/chat";

describe("normalizeMessage", () => {
  it("returns message with content when content exists", () => {
    const message: ChatMessage = {
      role: MessageTypeEnum.USER,
      content: "Hello world",
    };

    expect(normalizeMessage(message)).toEqual({
      role: "user",
      content: "Hello world",
    });
  });

  it("extracts text from parts when content is missing", () => {
    const message: ChatMessage = {
      role: MessageTypeEnum.ASSISTANT,
      parts: [
        { type: "text", text: "Hello" },
        { type: "text", text: " World" },
      ],
    };

    expect(normalizeMessage(message)).toEqual({
      role: "assistant",
      content: "Hello World",
    });
  });

  it("returns empty content when neither content nor parts exist", () => {
    const message: ChatMessage = {
      role: MessageTypeEnum.USER,
    };

    expect(normalizeMessage(message)).toEqual({
      role: "user",
      content: "",
    });
  });

});

