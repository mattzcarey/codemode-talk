import { SlideContainer } from "@/components"
import { useState, useMemo } from "react"

const tools = [
  { name: "GET /api/projects", description: "List all projects", parameters: "" },
  { name: "POST /api/projects", description: "Create a new project", parameters: "name, description" },
  { name: "GET /api/projects/:id", description: "Get a single project by ID", parameters: "id" },
  { name: "PATCH /api/projects/:id", description: "Update a project's name or description", parameters: "id, name, description" },
  { name: "DELETE /api/projects/:id", description: "Delete a project and all its data", parameters: "id" },
  { name: "GET /api/projects/:id/sprints", description: "List sprints for a project", parameters: "projectId" },
  { name: "POST /api/projects/:id/sprints", description: "Create a sprint for a project", parameters: "projectId, name, startDate, endDate" },
  { name: "GET /api/sprints/:id", description: "Get a single sprint by ID", parameters: "id" },
  { name: "PATCH /api/sprints/:id", description: "Update a sprint's name, dates, or status", parameters: "id, name, startDate, endDate, status" },
  { name: "DELETE /api/sprints/:id", description: "Delete a sprint", parameters: "id" },
  { name: "GET /api/projects/:id/tasks", description: "List tasks for a project with filters", parameters: "projectId, status, priority, assignee, sprint_id" },
  { name: "GET /api/tasks", description: "List all tasks across projects", parameters: "status, priority, assignee" },
  { name: "POST /api/projects/:id/tasks", description: "Create a task in a project", parameters: "projectId, title, description, status, priority, assignee, sprintId" },
  { name: "GET /api/tasks/:id", description: "Get a single task by ID", parameters: "id" },
  { name: "PATCH /api/tasks/:id", description: "Update a task's fields like status, assignee, priority", parameters: "id, title, description, status, priority, assignee, sprintId" },
  { name: "DELETE /api/tasks/:id", description: "Delete a task and its comments", parameters: "id" },
  { name: "GET /api/tasks/:id/comments", description: "List comments on a task", parameters: "taskId" },
  { name: "POST /api/tasks/:id/comments", description: "Add a comment to a task", parameters: "taskId, content, author" },
  { name: "DELETE /api/comments/:id", description: "Delete a comment", parameters: "id" },
  { name: "GET /api/stats", description: "Get counts of projects, tasks, sprints, comments", parameters: "" },
]

function simpleBM25(query: string, docs: typeof tools): { tool: typeof tools[0]; score: number }[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  return docs
    .map((tool) => {
      const text = `${tool.name} ${tool.description} ${tool.parameters}`.toLowerCase()
      let score = 0
      for (const term of terms) {
        if (text.includes(term)) {
          score += 1
          if (tool.name.toLowerCase().includes(term)) score += 2
          if (tool.description.toLowerCase().includes(term)) score += 1
        }
      }
      return { tool, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

// Realistic token estimate for a tool definition in context
// Includes: name, description, input schema (JSON Schema with types, descriptions,
// required fields, enums), output schema, and framing overhead
function estimateTokens(tool: typeof tools[0]) {
  const paramCount = tool.parameters ? tool.parameters.split(",").length : 0
  // Base: name + description (~30 tokens)
  // Per param: type, description, optional/required, enums (~40 tokens each)
  // Schema overhead (JSON Schema wrapping, $schema, additionalProperties, etc): ~80 tokens
  // Output schema: ~50 tokens
  return 80 + 30 + paramCount * 40 + 50
}

export function ToolSearchSlide() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const results = useMemo(() => simpleBM25(query, tools), [query])
  const maxScore = results[0]?.score ?? 1

  const toggleSelect = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const selectedTools = tools.filter((t) => selected.has(t.name))
  const selectedTokens = selectedTools.reduce((sum, t) => sum + estimateTokens(t), 0)

  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-3 w-full max-w-4xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            <span className="text-ai-100">Tool Search</span>
          </h2>
          <p className="text-foreground-200 text-sm mt-1">
            The agent gets one tool: <span className="font-mono text-ai-100">search()</span> — to find the others
          </p>
        </div>

        <div className="flex gap-4 w-full flex-1 min-h-0">
          {/* Left: search + results */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* Search box */}
            <div className="w-full relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full rounded-lg border border-border-100 bg-background-200 px-4 py-2.5 pl-10 text-sm text-foreground-100 font-mono placeholder:text-foreground-200/50 focus:outline-none focus:border-ai-100"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-200/50 font-mono">
                {tools.length} tools
              </span>
            </div>

            {/* Results */}
            <div className="w-full flex flex-col gap-1 max-h-[50vh] overflow-auto">
              {query === "" && (
                <div className="flex flex-col items-center justify-center py-8 text-foreground-200/40">
                  <svg className="size-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <p className="text-sm">Type to search across {tools.length} tools</p>
                  <p className="text-xs mt-1">Try "create task" or "sprint" or "delete"</p>
                </div>
              )}
              {query !== "" && results.length === 0 && (
                <p className="text-sm text-foreground-200 text-center py-4">No matching tools</p>
              )}
              {results.slice(0, 8).map(({ tool, score }, i) => {
                const isSelected = selected.has(tool.name)
                return (
                  <button
                    key={tool.name}
                    onClick={() => toggleSelect(tool.name)}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                      isSelected
                        ? "border-ai-100 bg-ai-100/10"
                        : "border-border-100 bg-background-200 hover:border-ai-100/50"
                    }`}
                  >
                    {/* Checkbox */}
                    <div className={`size-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? "border-ai-100 bg-ai-100" : "border-foreground-200/30"
                    }`}>
                      {isSelected && (
                        <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>

                    <span className="text-xs font-mono text-foreground-200/50 w-3">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-compute-100">{tool.name}</span>
                        <span className="text-[13px] text-foreground-200 truncate">{tool.description}</span>
                      </div>
                    </div>
                    {/* Score bar */}
                    <div className="flex items-center gap-1.5 w-16 shrink-0">
                      <div className="flex-1 h-1 rounded-full bg-border-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-ai-100 transition-all"
                          style={{ width: `${(score / maxScore) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-ai-100 w-4 text-right">
                        {score.toFixed(0)}
                      </span>
                    </div>
                  </button>
                )
              })}
              {results.length > 8 && (
                <p className="text-xs text-foreground-200/50 text-center py-1">
                  +{results.length - 8} more results
                </p>
              )}
            </div>
          </div>

          {/* Right: context window */}
          <div className="w-64 shrink-0 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-foreground-200">Context Window</span>
              <span className="text-[12px] font-mono text-foreground-200/50">
                ~{selectedTokens} tokens
              </span>
            </div>
            <div className="flex-1 rounded-lg border border-border-100 bg-background-200 p-3 flex flex-col gap-1.5 overflow-auto max-h-[50vh]">
              {selectedTools.length === 0 ? (
                <p className="text-xs text-foreground-200/30 text-center py-6">
                  Select tools to add to context
                </p>
              ) : (
                selectedTools.map((tool) => (
                  <div
                    key={tool.name}
                    className="rounded border border-ai-100/20 bg-ai-100/5 px-2 py-1.5 flex items-start justify-between gap-1"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[12px] text-ai-100 truncate">{tool.name}</p>
                      {tool.parameters && (
                        <p className="font-mono text-[9px] text-foreground-200/50 truncate">
                          ({tool.parameters})
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleSelect(tool.name)}
                      className="text-foreground-200/30 hover:text-accent-100 shrink-0"
                    >
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
            {selectedTools.length > 0 && (
              <p className="text-[12px] text-foreground-200/50 text-center">
                {selectedTools.length} of {tools.length} tools loaded
              </p>
            )}
          </div>
        </div>

        {/* Callout */}
        <div className="flex gap-4 text-xs text-foreground-200">
          <div className="flex items-center gap-1.5">
            <span className="text-ai-100">+</span> Only loads what's relevant
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-accent-100">-</span> 1 tool = 1 API call. Complex workflows = many round trips.
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-foreground-200/50">
            Used by: Claude Code, Cursor
          </div>
        </div>
      </div>
    </SlideContainer>
  )
}
