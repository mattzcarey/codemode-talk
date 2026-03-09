# Slide 13: Dynamic Worker Loaders

## Type
Interactive demo + technical explainer

## Content
- **Title**: "Dynamic Worker Loaders"
- **Subtitle**: "V8 Isolates for untrusted code"

- What they are:
  - Cloudflare Workers runtime can dynamically create new Workers at runtime
  - Each Worker runs in its own V8 isolate
  - Sandboxed by default — no filesystem, no env vars, no host access

- **Key features**:
  - **Instant spin-up**: V8 isolates start in milliseconds (vs seconds for containers)
  - **Memory isolation**: each isolate has its own heap
  - **Network control**: `globalOutbound` property
    - `null` → blocks ALL fetch() and connect() — complete network isolation
    - Service binding → route all requests through your proxy/filter
  - **No filesystem**: Workers have no `fs` — code provided in-memory via modules map
  - **Controlled bindings**: parent explicitly controls what the loaded Worker can access via `env`
  - **Observability**: tail workers for logging/auditing

- **Config** (wrangler.toml):
  ```toml
  [[worker_loaders]]
  binding = "LOADER"
  ```

- **API**:
  ```javascript
  let worker = env.LOADER.get(id, async () => ({
    compatibilityDate: "2025-06-01",
    mainModule: "executor.js",
    modules: { "executor.js": generatedCode },
    env: { SDK: sdkBinding },
    globalOutbound: null, // block all network
  }));
  let entrypoint = worker.getEntrypoint();
  await entrypoint.fetch("http://localhost");
  ```

- **INTERACTIVE ELEMENT**: Code editor + Run button
  - Monaco/CodeMirror editor with editable JavaScript
  - Output panel showing results
  - Run button executes code in a real Dynamic Worker Loader
  - Show that filesystem access fails, network is blocked, but SDK calls work

## Layout
- Title top
- Split panel: code editor (left) + output (right)
- Run button prominent (accent color)
- Key security properties as badges/pills below

## Key point
- "With proper sandboxing configured, you can safely run code you do not trust"
- Real JavaScript, real isolation, millisecond spin-up
- This is what makes Code Mode practical
