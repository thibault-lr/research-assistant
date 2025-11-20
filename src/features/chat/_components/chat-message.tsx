import { UIMessage } from "ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessageText } from "../_helpers/message";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <Card
      className={
        message.role === "user"
          ? "ml-auto max-w-[80%] bg-slate-100 dark:bg-slate-800"
          : "mr-auto max-w-[80%]"
      }
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          {message.role === "user" ? "You" : "Assistant"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {getMessageText(message)}
        </div>
      </CardContent>
    </Card>
  );
}

