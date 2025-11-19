'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a research query');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const text = await res.text();
      setResponse(text);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex items-center justify-between py-12 px-16 bg-white dark:bg-black">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white sm:text-5xl">
          Biomedical Research Assistant
        </h1>

        <section className="mb-8 w-full border h-32 p-4 overflow-auto bg-zinc-100 dark:bg-zinc-900">
          {response ? <pre className="text-sm">{response}</pre> : <span className="text-zinc-500">Response will appear here</span>}
        </section>

        {error && (
          <div className="mb-4 w-full rounded bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <label
            htmlFor="research-query"
            className="block text-lg font-medium text-zinc-700 dark:text-zinc-300"
          >
            Enter your research query:
          </label>
          <input
            id="research-query"
            name="research_query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-white mb-4"
            placeholder="Enter your research query here..."
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </main>
    </div>
  );
}
