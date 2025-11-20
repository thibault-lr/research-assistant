import { z } from "zod";

export const MESSAGE_ROLE = {
  USER : "user",
  ASSISTANT : "assistant",
  SYSTEM : "system",
} as const;
export type MessageRole = (typeof MESSAGE_ROLE)[keyof typeof MESSAGE_ROLE];

export const messagePartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
});

export const chatMessageSchema = z
  .object({
    role: z.enum(Object.values(MESSAGE_ROLE)),
    content: z.string().optional(),
    parts: z.array(messagePartSchema).optional(),
    id: z.string().optional(),
  })
  .refine((data) => data.content || (data.parts && data.parts.length > 0), {
    message: "Message must have either 'content' or 'parts'",
  });

export const chatRequestSchema = z.object({
  id: z.string().optional(),
  messages: z.array(chatMessageSchema),
  trigger: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatMessage = z.infer<typeof chatRequestSchema>["messages"][0];
