"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "./chat-message";

const EXAMPLE_PROMPTS = [
  "Find papers about TNF-alpha inhibitors in inflammatory bowel disease",
  "Are there any clinical trials for adalimumab in Crohn's disease?",
  "What do we know about the rs113488022 genetic variant?",
];

export function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleExamplePrompt = useCallback(
    (prompt: string) => {
      sendMessage({ text: prompt });
    },
    [sendMessage]
  );

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

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex flex-col min-h-screen px-4 py-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 gap-4">
          {hasMessages && (
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Research Assistant
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Ask questions about biomedical research and get instant answers
              </p>
            </div>
          )}

          {hasMessages && (
            <div className="flex-1 space-y-4 overflow-y-auto">
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
          )}

          {!hasMessages && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-2xl space-y-6">
                <div className="space-y-2 text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Research Assistant
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Ask questions about biomedical research and get instant
                    answers
                  </p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What would you like to know about biomedical research?"
                        disabled={isLoading}
                        className="text-base"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Thinking..." : "Send"}
                      </Button>

                      <div className="space-y-3 pt-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center">
                          Example prompts:
                        </p>
                        <div className="flex flex-col gap-2">
                          {EXAMPLE_PROMPTS.map((prompt) => (
                            <Button
                              key={prompt}
                              type="button"
                              variant="ghost"
                              onClick={() => handleExamplePrompt(prompt)}
                              disabled={isLoading}
                              className="w-full justify-start text-left h-auto py-3 px-4 text-sm font-normal hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                            >
                              <span className="text-slate-700 dark:text-slate-300">
                                {prompt}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {hasMessages && (
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
          )}
        </div>
      </main>
    </div>
  );
}
