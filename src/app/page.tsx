"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a research query");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const text = await res.text();
      setResponse(text);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch response";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-2">
        <div className="w-full max-w-2xl space-y-6">
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Research Assistant
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Ask questions about biomedical research and get instant answers
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Query</CardTitle>
              <CardDescription>Enter your research question</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="research-query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What would you like to know about biomedical research?"
                  disabled={loading}
                  className="text-base"
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="pt-6">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </CardContent>
            </Card>
          )}

          {response && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {response}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!response && !error && (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center text-slate-500 dark:text-slate-400">
                <p className="text-sm">Submit a query to see results here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
