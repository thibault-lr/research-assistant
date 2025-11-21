# Research Assistant

A Next.js application that acts as an AI-powered biomedical research assistant. It uses the **Vercel AI SDK** and **Model Context Protocol (MCP)** to query PubMed, ClinicalTrials.gov, and MyVariant.info.

## Environment Variables

You need to set the following variables in a `.env.local` file:

- `BIOMCP_URL` - The URL of the BioMCP server (SSE endpoint).
- `GOOGLE_GENERATIVE_AI_API_KEY` - Your Google Gemini API key.

## Getting Started

Run the development server: `yarn dev`

Open http://localhost:3000 in your browser.

## Architecture & Flow

This app connects a Chat UI to biomedical data sources through an AI Agent.

### How it works (Example)

1 - User prompt : "Find papers about TNF-alpha inhibitors."

2 - Analysis: The AI model (Gemini) analyzes the request.

3 - Tools: The AI calls a specific tool (e.g., searchArticles) if he can match the prompt with a tool. If not, he just returns the output of (2)

4 - MCP : Connect to BioMCP Server to search for results

5 - Response: The raw data is summarized into markdown and streamed back

## Project Structure

The code is organized to separate the user interface from the business logic.

`src/app`: Handles routing and API endpoints (like /api/chat).

`src/features`: Contains the app core logic (Chat page components)

`src/domain`: Defines the data types and core validation rules (Zod schemas).

`src/lib`: manages the interractions with external libraries like LLM & BioMCP server

`src/components/ui`: Reusable design elements (buttons, cards, inputs).

## Technical stack :

- Server : NextJS
- UI : ShadCN / Tailwind
- Validation : zod
- LLM: Vercel ai-sdk
- Testing: Vitest + Playwright
- Infra : Vercel

## Further improvements

While the app is currently simple, it contains the logic and design patterns needed to build a scalable system:

- Strong validation with Zod for type safety
- Reusable UI components
- Testing

To make it production-ready, the next steps could be:

- A left panel containing the chat history, backed by a dedicated database.
- Upgrading BioMCP outputs from static text to interactive components. This would allow users to sort, filter, and paginate through research papers or clinical trials directly in the chat.
- Implementing monitoring tools to track performance.
- Leveraging LLM streaming capabilities to visualize the "thinking process".
