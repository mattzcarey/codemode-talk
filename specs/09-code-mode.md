# Slide 9: Code Mode — Write Code Over a TypeScript SDK

## Type
Code showcase + concept slide

## Content
- **Title**: "Approach 3: Code Mode"
- **Subtitle**: "Write code against a typed SDK"

- The idea: instead of calling tools one at a time, the LLM writes a TypeScript program
  - One tool: `codemode` — accepts generated code
  - The code runs against a typed SDK with full API access
  - SDK is generated from the OpenAPI spec

- Example comparison (side by side):

  **Tool calling (5 round trips):**
  ```
  1. list_projects → [{id: 1, name: "Website"}]
  2. list_tasks({project: 1}) → [{id: 42, ...}]
  3. get_task({id: 42}) → {title: "Fix bug", assignee: null}
  4. list_users → [{id: 7, name: "Matt"}]
  5. update_task({id: 42, assignee: 7}) → OK
  ```

  **Code Mode (1 round trip):**
  ```typescript
  async () => {
    const projects = await sdk.projects.list();
    const website = projects.find(p => p.name === "Website");
    const tasks = await sdk.tasks.list({ project: website.id });
    const bug = tasks.find(t => t.title === "Fix bug");
    const users = await sdk.users.list();
    const matt = users.find(u => u.name === "Matt");
    return sdk.tasks.update(bug.id, { assignee: matt.id });
  }
  ```

## Layout
- Title top
- Side-by-side comparison: tool calling (left, many steps) vs code mode (right, single block)
- Highlight the reduction in round trips

## Key point
- Code is a natural "compact plan" — multiple operations in one shot
- TypeScript types act as documentation
- 1 round trip instead of N
