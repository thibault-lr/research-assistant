import { generateAIResponse, summariseAIResponse } from "@/lib/lib-llm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { chatRequestSchema, MessageRoleEnum } from "@/domain/chat";
import { normalizeMessage } from "@/features/chat/_helpers/message";


export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    const { messages } = chatRequestSchema.parse(reqBody);
    const convertedMessages = messages.map(normalizeMessage);
    const latestUserQuery = convertedMessages.findLast((message) => message.role === MessageRoleEnum.USER)?.content;

    if(! latestUserQuery) {
      return new Response("No user query found", { status: 400 });
    }


    const result = await generateAIResponse(convertedMessages);

    if (result.toolCalls.length === 0) {
      return new Response(result.text)
    }

    const summaryStream = await summariseAIResponse(
        latestUserQuery, 
        result.content
    );

    return summaryStream.toTextStreamResponse();

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
