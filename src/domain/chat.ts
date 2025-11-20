import { z } from "zod";

export enum MessageRoleEnum {
  USER = "user",
  ASSISTANT = "assistant",
}


export const messagePartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
});


export const messageSchema = z
  .object({
    role: z.enum(MessageRoleEnum),
    content: z.string().optional(),
    parts: z.array(messagePartSchema).optional(),
    id: z.string().optional(),
  })
  .refine((data) => data.content || (data.parts && data.parts.length > 0), {
    message: "Message must have either 'content' or 'parts'",
  });

export const chatRequestSchema = z.object({
  id: z.string().optional(),
  messages: z.array(messageSchema),
  trigger: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatMessage = z.infer<typeof chatRequestSchema>["messages"][0];
