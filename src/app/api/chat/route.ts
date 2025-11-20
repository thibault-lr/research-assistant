import { streamAIResponse } from "@/lib/lib-llm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { chatRequestSchema } from "@/domain/chat";
import { normalizeMessage } from "@/features/chat/_helpers/message";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { messages } = chatRequestSchema.parse(reqBody);

    const convertedMessages = messages.map(normalizeMessage);

    console.log("Converted", convertedMessages);
    const result = streamAIResponse(convertedMessages);

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
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
