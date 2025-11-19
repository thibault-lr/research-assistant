import { BioMCPService } from "@/infrastructure/biomcp-service";
import { userMessageReqBodySchema } from "@/domain/chat";
import { NextResponse } from "next/server";
import z from "zod";

// Force le runtime Node.js (obligatoire pour @modelcontextprotocol/sdk)
export const runtime = "nodejs";

export async function POST(req: Request) {
  const BIOMCP_URL = process.env.BIOMCP_URL!;

  try {
    const reqBody = await req.json();
    const { message } = userMessageReqBodySchema.parse(reqBody);

    // Appel du service d'infrastructure
    const service = new BioMCPService(BIOMCP_URL);
    const stream = await service.evaluateMessage(message);

    console.log("[API] Stream prepared, sending response...");

    // Retour du stream avec les bons headers
    return new Response(stream, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("[API Error]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: z.treeifyError(error) },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Erreur interne du service BioMCP" },
        { status: 503 }
      );
    }

    throw error;
  }
}
