# Code Mode Talk

Slide deck for **"Every API is a Tool for Agents with Code Mode"** — presented at Node Congress by [@mattzcarey](https://x.com/mattzcarey).

Built on Cloudflare Workers with React, featuring live demos of Code Mode, MCP servers, V8 isolate execution, and the Cloudflare MCP client.

## Setup

```bash
npm install
npm start
```

### Environment variables

Create a `.env` file:

```
OPENAI_API_KEY=sk-...
```

### Deploy

```bash
wrangler secret bulk .env
npm run deploy -- --var HOST:https://codemode-talk.<your-subdomain>.workers.dev
```

## Stack

- **Frontend**: React 19, Tailwind v4, Framer Motion, React Router
- **Backend**: Cloudflare Workers, Durable Objects (Agents SDK)
- **AI**: OpenAI (gpt-5.4) for MCP client, Workers AI for Code Mode PM agent
- **Code Mode**: `@cloudflare/codemode` — executes LLM-generated code in V8 isolates
- **MCP**: Remote MCP client connecting to `mcp.cloudflare.com/mcp` via OAuth
- **Sandbox**: `@cloudflare/sandbox` for embedded terminal demo

## Project structure

```
src/
  slides/       — One component per slide
  components/   — SlideContainer, Dots, CornerSquares
  server.ts     — Workers entry, Durable Object agents, API endpoints
  tools.ts      — PM SaaS API tools (AI SDK format)
  App.tsx        — Slide routing and navigation
saas/           — PM SaaS backend (D1 + Workers)
public/         — Static assets
```

## Slides with live demos

- **Code Mode: Execute** — Run code in a V8 isolate with `codemode.*` proxy to PM tools
- **Worker Loaders** — Raw V8 isolate execution with network toggling
- **Code Mode Demo** — Chat agent with Code Mode + PM tools
- **Cloudflare MCP** — Real Cloudflare API via remote MCP server + OAuth
