import { streamAIResponse } from "@/lib/lib-llm";
import { NextResponse } from "next/server";
import z from "zod";

export const runtime = "nodejs";

const messagePartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
});

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().optional(),
  parts: z.array(messagePartSchema).optional(),
  id: z.string().optional(),
}).refine(
  (data) => data.content || (data.parts && data.parts.length > 0),
  {
    message: "Message must have either 'content' or 'parts'",
  }
);

const chatRequestSchema = z.object({
  id: z.string().optional(),
  messages: z.array(messageSchema),
  trigger: z.string().optional(),
});

function normalizeMessage(
  message: z.infer<typeof chatRequestSchema>["messages"][0]
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

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { messages } = chatRequestSchema.parse(reqBody);

    const convertedMessages = messages.map(normalizeMessage);
    console.log("[API] Received messages:", convertedMessages);

    const result = streamAIResponse(convertedMessages);
    console.log("[API] Stream result created");

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    // Log unwanted behaviors somewhere on Sentry/Datadog...
    console.error("[API Error]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }

    throw error;
  }
}
