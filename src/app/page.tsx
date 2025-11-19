export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen border w-full max-w-4xl flex-col items-center justify-between py-12 px-16 bg-white dark:bg-black">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white sm:text-5xl">
          Biomedical Research Assistant
        </h1>

        <section className="mb-8 w-full border h-32">Prompt rendered :</section>

        <label
          htmlFor="research-query"
          className="block text-lg font-medium text-zinc-700 dark:text-zinc-300"
        >
          Enter your research query:
        </label>
        <input
          name="research_query"
          type="text"
          className="w-full px-4 py-2 border"
          placeholder="Enter your research query here..."
        />
        <button className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
          Submit
        </button>
      </main>
    </div>
  );
}
