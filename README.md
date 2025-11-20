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
