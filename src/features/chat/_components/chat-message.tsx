import { UIMessage } from "ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeMessage } from "../_helpers/message";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = normalizeMessage(message);

  return (
    <Card
      className={
        role === "user"
          ? "ml-auto max-w-[80%] bg-slate-100 dark:bg-slate-800 gap-2"
          : "mr-auto max-w-[80%] gap-2"
      }
    >
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">
          {role === "user" ? "You" : "Assistant"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {role === "user" ? (
            content
          ) : (
            <ReactMarkdown
              components={{
                ul: (props) => (
                  <ul className="list-disc pl-4 my-2 space-y-1" {...props} />
                ),
                ol: (props) => (
                  <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />
                ),
                li: (props) => <li className="pl-1" {...props} />,
                strong: (props) => (
                  <span
                    className="font-bold text-slate-900 dark:text-slate-100"
                    {...props}
                  />
                ),
                a: (props) => (
                  <a
                    className="text-blue-600 hover:underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                p: (props) => <p className="mb-2 last:mb-0" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
