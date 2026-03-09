# Codemode Talk — Slide Deck

## Talk
**"Every API is a Tool for Agents with Code Mode"**
Speaker: Matt Carey (@mattzcarey), Agents & MCP at Cloudflare
Event: Node Congress

## Project Structure
- `src/slides/` — One component per slide
- `src/components/` — Shared components (SlideContainer, Dots, CornerSquares)
- `specs/` — Detailed spec for each slide (01-title.md through 15-thank-you.md)
- `public/` — Static assets (images, fonts)

## Slide Authoring Rules

### Framework
- Each slide is a React component exported from `src/slides/index.ts`
- Slides are listed in order in the `slides` array in `src/App.tsx`
- Wrap every slide in `<SlideContainer>` (provides animation, dots, corner squares)
- Use `showDots={false}` for dense/diagram slides

### Styling
- Tailwind v4 with `@theme` CSS variables (see `src/index.css`)
- **Colors**: accent-100 (orange), compute-100 (blue), ai-100 (green), media-100 (purple), storage-100 (pink)
- **Fonts**: `font-sans` = FT Kunst Grotesk, `font-mono` = Apercu Mono Pro
- **Text**: foreground-100 (dark), foreground-200 (muted), accent-100 (highlight)
- **Borders/BG**: border-100, background-100/200/300
- Use responsive classes: base for mobile, `md:` for desktop

### Code Examples
- For code highlighting use `prism-react-renderer` (already installed)
- When we need real code examples, look in the agents repo:

**Codemode SDK** (`/Users/matt/Documents/Github/agents/packages/codemode/`):
- `src/tool.ts` — `createCodeTool()` main entry point (153 lines)
- `src/executor.ts` — `DynamicWorkerExecutor`, `ToolDispatcher` (171 lines)
- `src/types.ts` — `generateTypes()` converts tool schemas → TypeScript types
- `src/ai.ts` — AI SDK integration export

**Codemode Example** (`/Users/matt/Documents/Github/agents/examples/codemode/`):
- `src/server.ts` — Full server with DynamicWorkerExecutor + SQLite PM tools (160 lines)
- `src/tools.ts` — 10 PM tools (projects, tasks, sprints, comments) backed by SQLite (300 lines)
- `src/client.tsx` — React UI with useAgentChat, tool cards, executor switching

**Cloudflare MCP Server** (`/Users/matt/Documents/Github/cloudflare-mcp/`):
- The production MCP server using code mode

**Other useful examples** (`/Users/matt/Documents/Github/agents/examples/`):
- `mcp/` — Stateful MCP server with McpAgent
- `ai-chat/` — Chat with server/client tools, approval
- `dynamic-tools/` — Runtime tool registration pattern

### Sandbox SDK — Terminal (`/Users/matt/Documents/Github/sandbox-sdk/`)
- Slide 7 uses `@cloudflare/sandbox` for an embedded terminal
- Terminal component: `examples/collaborative-terminal/app/components/Terminal.client.tsx`
- Uses `SandboxAddon` (xterm.js addon) → WebSocket → Container PTY
- Deps: `@cloudflare/sandbox`, `@xterm/xterm`, `@xterm/addon-fit`, `@xterm/addon-web-links`
- Server: `getSandbox(env.Sandbox, id).getSession(sid).terminal(request)`
- Needs `containers` binding in wrangler.jsonc

### Streamdown — Markdown Rendering
- Use `<Streamdown>` from `"streamdown"` to render any LLM/assistant markdown output
- CSS imported globally via `@import "streamdown/styles.css"` in `src/index.css`
- Usage: `<Streamdown className="sd-theme text-xs" controls={false}>{markdownText}</Streamdown>`
- Always use Streamdown for assistant message text in chat UIs — never raw `<p>` tags for markdown content

### Orama — Tool Search (Slide 8)
- `@orama/orama` for client-side BM25 full-text search
- Runs entirely in the browser, no server needed
- Index PM API + Cloudflare API tool descriptions
- `search(db, { term: query, limit: 5 })` returns ranked results

### Interactive Elements
- Slide 7: Embedded terminal via sandbox-sdk (xterm.js + SandboxAddon)
- Slide 8: Client-side tool search via Orama JS
- Slide 13: Code editor + run button (Worker Loader execution)
- Slide 14: Chat demo (AIChatAgent with codemode)
- Keep interactive elements self-contained within the slide component

### Design Principles
- Dark on light (Cloudflare brand warm palette)
- Clean, minimal — let content breathe
- Big text for key statements, small text for code/details
- Diagrams use Box/Arrow patterns (see ArchitectureSlide for reference)
- No emojis unless specifically requested

### Key Stats (from blog posts)
- Cloudflare API: 2,500+ endpoints
- Traditional MCP token cost: 1.17M tokens
- Code Mode token cost: ~1,000 tokens (99.9% reduction)
- Code Mode exposes 2 tools: `search()` + `execute()`
- V8 isolates start in milliseconds
- Full DDoS protection scenario: 4 tool calls total
- Quote: "LLMs are better at writing code to call MCP, than at calling MCP directly"
- Shakespeare analogy: "like putting Shakespeare through a month-long class in Mandarin"

### Code Mode Execution Flow
```
LLM writes code → Normalized via acorn AST → Executor runs in V8 isolate
→ Inside sandbox: codemode.* Proxy → RPC call via ToolDispatcher
→ Host validates args, executes tool → Result back to sandbox
→ Code completes, logs captured → Return result to LLM
```

### Worker Loader Config
```jsonc
// wrangler.jsonc
{ "worker_loaders": [{ "binding": "LOADER" }] }
```

### createCodeTool Pattern
```typescript
import { createCodeTool } from "@cloudflare/codemode/ai";
import { DynamicWorkerExecutor } from "@cloudflare/codemode";

const executor = new DynamicWorkerExecutor({ loader: env.LOADER });
const codemode = createCodeTool({ tools: allTools, executor });
// Pass `codemode` as a tool to streamText()
```
