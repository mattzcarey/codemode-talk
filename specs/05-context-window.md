# Slide 5: The Context Window Problem

## Type
Data visualization / impact slide

## Content
- **Title**: "We Filled the Context Window"

- The problem visualized:
  - Cloudflare's REST OpenAPI spec: **2.3 million tokens**
  - A typical LLM context window: 128K-200K tokens
  - Even cherry-picking tools, you quickly run out of space

- Visual: a container/bar showing context window capacity being eaten up by tool definitions
  - Tool definitions (schemas, descriptions)
  - System prompt
  - Conversation history
  - Actual user content ← tiny sliver left

- Callout box: "The context limit is not an MCP problem. It's an Agent problem."

## Layout
- Title top
- Stacked bar or visual meter in center showing context window breakdown
- Quote/callout at bottom

## Key point
- More tools = less room for actual reasoning
- Cherry-picking tools means you only expose a fraction of the API
- We need a better approach
