import { z } from "zod";

export type MessageType = "user" | "assistant";

export type Message = {
  sessionId: string;
  type: MessageType;
  content: string;
  timestamp: number;
};

// Message api Requests
export const userMessageReqBodySchema = z.strictObject({
  message: z.string().min(1, "Message content cannot be empty"),
});
export type UserMessageReqBodyDto = z.infer<typeof userMessageReqBodySchema>;
