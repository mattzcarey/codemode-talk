# Slide 8: Tool Search — BM25 Over Descriptions

## Type
Interactive demo slide with live search

## Content
- **Title**: "Approach 2: Tool Search"
- **Subtitle**: "Find the right tool on demand"

- How it works:
  1. Register hundreds/thousands of tools with descriptions
  2. When the agent needs a tool, search over descriptions
  3. Return top-K matching tools to the context
  4. Agent uses the most relevant tool

- **INTERACTIVE ELEMENT**: Live search box using Orama JS
  - Runs entirely in the browser (no server needed)
  - Pre-indexed with all PM API tool descriptions + some Cloudflare API tools
  - User types a query → results ranked by BM25 relevance in real-time
  - Shows tool name, description, and relevance score
  - Example: type "create task" → shows `createTask`, `createProject`, `listTasks` ranked

- Who does this:
  - **Claude Code**: tool search over MCP tools
  - **Cursor**: similar approach

## Technical Implementation
- **Package**: `@orama/orama` — full-text search engine that runs in the browser
- **Index**: Pre-built at build time or created on slide mount with tool descriptions
- **Schema**: `{ name: string, description: string, parameters: string }`
- **Search**: `search(db, { term: query, limit: 5 })` returns ranked results
- **UI**: Search input + results list with scores, all client-side

## Dependencies
- `@orama/orama`

## Layout
- Title top
- Search box in center
- Results list below with scores and tool details
- Pros/cons callout at bottom

## Key point
- Better than loading everything — only loads what's relevant
- But: still limited by tool granularity (1 tool = 1 API call)
- Complex workflows need many round-trips
