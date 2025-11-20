import { describe, it, expect } from "vitest";
import { UIMessage } from "ai";
import { normalizeMessage } from "../_helpers/message";
import { ChatMessage, MESSAGE_ROLE } from "@/domain/chat";

describe("normalizeMessage", () => {
  it("returns message with content when content exists", () => {
    const message: ChatMessage = {
      role: MESSAGE_ROLE.USER,
      content: "Hello world",
    };

    expect(normalizeMessage(message)).toEqual({
      role: "user",
      content: "Hello world",
    });
  });

  it("extracts text from parts when content is missing", () => {
    const message: ChatMessage = {
      role: MESSAGE_ROLE.ASSISTANT,
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
      role: MESSAGE_ROLE.USER,
    };

    expect(normalizeMessage(message)).toEqual({
      role: "user",
      content: "",
    });
  });

  it("handles UIMessage with empty parts", () => {
    const message: UIMessage = {
      id: "1",
      role: "user",
      parts: [],
    };

    expect(normalizeMessage(message)).toEqual({
      role: "user",
      content: "",
    });
  });

  it("handles UIMessage with parts", () => {
    const message: UIMessage = {
      id: "1",
      role: "user",
      parts: [
        { type: "text", text: "Hello" },
        { type: "text", text: " World" },
      ],
    };

    expect(normalizeMessage(message)).toEqual({
      role: "user",
      content: "Hello World",
    });
  });
});
