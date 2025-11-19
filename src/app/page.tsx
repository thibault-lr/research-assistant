"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getMessageText(message: UIMessage): string {
  if (message.parts.length === 0) {
    return "";
  }

  return message.parts
    .filter((part) => part.type === "text" && "text" in part)
    .map((part) => part.text)
    .join("");
}

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex flex-col min-h-screen px-4 py-8">
        <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col flex-1">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Research Assistant
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Ask questions about biomedical research and get instant answers
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {messages.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm">
                    Start a conversation to see results here
                  </p>
                </CardContent>
              </Card>
            )}

            {messages.map((message) => (
              <Card
                key={message.id}
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
            ))}

            {isLoading && (
              <Card className="mr-auto max-w-[80%]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                <CardContent className="pt-6">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error.message || "An error occurred"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="sticky bottom-0">
            <CardContent className="pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage({ text: input });
                    setInput("");
                  }
                }}
                className="space-y-4"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What would you like to know about biomedical research?"
                  disabled={isLoading}
                  className="text-base"
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Thinking..." : "Send"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
