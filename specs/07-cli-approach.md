# Slide 7: The CLI Approach — Write Bash

## Type
Interactive demo slide with embedded terminal

## Content
- **Title**: "Approach 1: CLI / Bash"
- **Subtitle**: "Self-discoverable by design"

- Key insight: CLIs are naturally progressive disclosure
  - `pm --help` → shows top-level commands
  - `pm projects --help` → shows project subcommands
  - Agent discovers what it needs, when it needs it

- **INTERACTIVE ELEMENT**: Real embedded terminal via `@cloudflare/sandbox`
  - Uses sandbox-sdk's `SandboxAddon` + xterm.js
  - Connected to a live sandbox container running the PM API CLI
  - Audience can see commands being typed and executed live
  - Example session:
    ```bash
    $ pm --help
    $ pm tasks list --project "Website Redesign"
    $ pm tasks create --project "Website Redesign" --title "Add caching"
    ```

## Technical Implementation
- **Package**: `@cloudflare/sandbox` provides `SandboxAddon` for xterm.js
- **Terminal component**: Based on `sandbox-sdk/examples/collaborative-terminal/app/components/Terminal.client.tsx`
- **Server-side**: `getSandbox(env.Sandbox, id)` → `sandbox.getSession(sessionId).terminal(request)` for WebSocket PTY
- **Wrangler**: needs `containers` binding with a Dockerfile for the sandbox
- **CSS**: Import `@xterm/xterm/css/xterm.css`

## Dependencies
- `@cloudflare/sandbox`
- `@xterm/xterm` ^6.0.0
- `@xterm/addon-fit` ^0.11.0
- `@xterm/addon-web-links` ^0.12.0

## Reference
- Terminal component: `/Users/matt/Documents/Github/sandbox-sdk/examples/collaborative-terminal/app/components/Terminal.client.tsx`
- Worker routing: `/Users/matt/Documents/Github/sandbox-sdk/examples/collaborative-terminal/workers/app.ts`
- Minimal example: `/Users/matt/Documents/Github/sandbox-sdk/examples/minimal/src/index.ts`

## Key point
- CLIs get progressive disclosure for free
- But: agents writing bash is fragile, hard to permission
