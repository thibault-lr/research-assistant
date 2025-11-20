"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "./chat-message";

export function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming";

  const renderMessages = () => {
    return messages.map((message) => (
      <ChatMessage key={message.id} message={message} />
    ));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim()) {
        sendMessage({ text: input });
        setInput("");
      }
    },
    [input, sendMessage]
  );

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

            {renderMessages()}

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
              <form onSubmit={handleSubmit} className="space-y-4">
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

