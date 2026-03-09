import { SlideContainer } from "@/components"

const groups = [
  {
    label: "Projects",
    endpoints: [
      { method: "GET", path: "/api/projects", desc: "List all projects" },
      { method: "POST", path: "/api/projects", desc: "Create a new project" },
      { method: "GET", path: "/api/projects/:id", desc: "Get project by ID" },
      { method: "PATCH", path: "/api/projects/:id", desc: "Update project" },
      { method: "DELETE", path: "/api/projects/:id", desc: "Delete project + cascade" },
    ],
  },
  {
    label: "Sprints",
    endpoints: [
      { method: "GET", path: "/api/projects/:id/sprints", desc: "List sprints" },
      { method: "POST", path: "/api/projects/:id/sprints", desc: "Create sprint" },
      { method: "GET", path: "/api/sprints/:id", desc: "Get sprint by ID" },
      { method: "PATCH", path: "/api/sprints/:id", desc: "Update sprint" },
      { method: "DELETE", path: "/api/sprints/:id", desc: "Delete sprint" },
    ],
  },
  {
    label: "Tasks",
    endpoints: [
      { method: "GET", path: "/api/projects/:id/tasks", desc: "List tasks (with filters)" },
      { method: "GET", path: "/api/tasks", desc: "List all tasks" },
      { method: "POST", path: "/api/projects/:id/tasks", desc: "Create task" },
      { method: "GET", path: "/api/tasks/:id", desc: "Get task by ID" },
      { method: "PATCH", path: "/api/tasks/:id", desc: "Update task" },
      { method: "DELETE", path: "/api/tasks/:id", desc: "Delete task + comments" },
    ],
  },
  {
    label: "Comments + Stats",
    endpoints: [
      { method: "GET", path: "/api/tasks/:id/comments", desc: "List comments" },
      { method: "POST", path: "/api/tasks/:id/comments", desc: "Add comment" },
      { method: "DELETE", path: "/api/comments/:id", desc: "Delete comment" },
      { method: "GET", path: "/api/stats", desc: "Dashboard counts" },
    ],
  },
]

const methodColor: Record<string, string> = {
  GET: "text-ai-100",
  POST: "text-compute-100",
  PATCH: "text-media-100",
  DELETE: "text-accent-100",
}

const total = groups.reduce((n, g) => n + g.endpoints.length, 0)

export function ExampleIntroSlide() {
  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-5 max-w-5xl w-full">
        <div className="text-center">
          <h2 className="text-foreground-100">
            Let's build a <span className="text-accent-100">Project Management</span> API
          </h2>
          <p className="text-foreground-200 text-sm mt-1">
            {total} REST endpoints · Cloudflare Worker + D1
          </p>
        </div>

        {/* Grouped endpoints */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {groups.map((g) => (
            <div key={g.label} className="flex flex-col gap-1">
              <p className="text-[12px] font-medium text-foreground-200/60 px-1 uppercase tracking-wide">
                {g.label}
              </p>
              {g.endpoints.map((e) => (
                <div
                  key={e.method + e.path}
                  className="rounded border border-border-100 bg-background-200 px-2.5 py-1.5"
                >
                  <p className="text-[12px] font-mono">
                    <span className={methodColor[e.method]}>{e.method.padEnd(6)}</span>{" "}
                    <span className="text-foreground-200">{e.path}</span>
                  </p>
                  <p className="text-[9px] text-foreground-200/50">{e.desc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="text-sm text-foreground-200 text-center max-w-lg">
          How do we expose {total} endpoints to an LLM without blowing up the context window?
        </p>
      </div>
    </SlideContainer>
  )
}
