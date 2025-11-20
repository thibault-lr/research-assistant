import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chat } from "./chat";
import * as useChatModule from "@ai-sdk/react";

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(() => ({
    messages: [],
    sendMessage: vi.fn(),
    status: "idle",
    error: null,
  })),
}));

describe("Chat", () => {
  it("renders the component", () => {
    render(<Chat />);

    expect(screen.getByText("Research Assistant")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "What would you like to know about biomedical research?"
      )
    ).toBeInTheDocument();
  });

  it("renders the messages", () => {
    vi.spyOn(useChatModule, "useChat").mockReturnValue({
      messages: [
        {
          parts: [
            {
              type: "text",
              text: "User question",
            },
          ],
          id: "message-id-1",
          role: "user",
        },
        {
          id: "message-id-2",
          role: "assistant",
          parts: [
            {
              type: "step-start",
            },
            {
              type: "text",
              text: "Assistant response",
              state: "streaming",
            },
          ],
        },
      ],
      status: "idle",
    } as any);

    render(<Chat />);

    expect(screen.getByText("User question")).toBeInTheDocument();
    expect(screen.getByText("Assistant response")).toBeInTheDocument();
  });
});
