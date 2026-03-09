# Slide 3: Giving Agents Hands — Tool/Function Calling

## Type
Concept explainer with animated/visual elements

## Content
- **Title**: "Giving Agents Hands"
- **Subtitle**: Tool / Function Calling

- Visual showing the basic pattern:
  1. User sends message to LLM
  2. LLM decides to call a tool (function call)
  3. Tool executes and returns result
  4. LLM incorporates result into response

- Show a simple example:
  ```
  User: "What's the weather in London?"
  LLM → tool_call: get_weather({ city: "London" })
  Result: { temp: 18, condition: "cloudy" }
  LLM: "It's 18°C and cloudy in London"
  ```

## Layout
- Title top
- Flow diagram in center (horizontal or vertical)
- Could use the Box/Arrow pattern from Rita's architecture slide

## Key point
- This is how every AI agent works today
- The LLM doesn't "do" things — it asks tools to do things on its behalf
