# Slide 10: Why Code Mode is Awesome

## Type
Stats / benefits slide

## Content
- **Title**: "Why This Works"

- **Stats** (from blog posts):
  - Cloudflare API: **2,500+ endpoints**
  - Traditional MCP: **1.17 million tokens** (one tool per endpoint)
  - Code Mode: **~1,000 tokens** (2 tools: `search()` + `execute()`)
  - **99.9% token reduction**
  - Full DDoS protection scenario: **4 tool calls total**

- Quote: "LLMs are better at writing code to call MCP, than at calling MCP directly."

- **Three key benefits** as cards:

  1. **TypeScript as a Compact Plan**
     - Code naturally expresses multi-step workflows
     - No round-trip through the LLM between each step
     - Training data: massive TypeScript corpus vs tiny set of tool-call examples

  2. **Per-Endpoint Permissioning**
     - SDK methods map 1:1 to API endpoints
     - Permission checks happen at the API layer
     - "We're just working with an API, the same as always"

  3. **Automatic Scaling**
     - New endpoints require zero new tool definitions
     - Agent discovers them via `search()`
     - No MCP server updates needed

## Layout
- Title top
- Stats in a highlight row (big numbers, accent color)
- Three benefit cards below
- Quote as callout

## Key point
- Fixed token footprint regardless of API size
- The LLM writes code it was trained on, not tool-call JSON it barely knows
