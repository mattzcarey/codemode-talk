import { SlideContainer } from "@/components"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
  GET: "text-compute-100",
  POST: "text-compute-100",
  PATCH: "text-media-100",
  DELETE: "text-accent-100",
}

const total = groups.reduce((n, g) => n + g.endpoints.length, 0)

export function ExampleIntroSlide() {
  const [revealed, setRevealed] = useState(false)
  const [curlResult, setCurlResult] = useState<string | null>(null)
  const [curlRunning, setCurlRunning] = useState(false)

  const runFetch = async () => {
    setCurlRunning(true)
    setCurlResult(null)
    try {
      const r = await fetch("https://pm-saas.mattzcarey.workers.dev/api/stats")
      const data = await r.json()
      setCurlResult(JSON.stringify(data, null, 2))
    } catch {
      setCurlResult("// failed to reach API")
    }
    setCurlRunning(false)
  }

  return (
    <SlideContainer showDots={!revealed}>
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="intro"
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between w-full">
              <h2 className="text-foreground-100">
                Example <span className="text-accent-100">Time</span>
              </h2>
              <button
                onClick={() => setRevealed(true)}
                className="shrink-0 px-5 py-1.5 rounded border border-accent-100/40 bg-accent-100/10 text-accent-100 hover:bg-accent-100/20 text-base font-mono transition-colors"
              >
                API →
              </button>
            </div>
            <p className="text-foreground-200 max-w-lg text-center">
              We have a <span className="text-accent-100 font-medium">Project Management API</span>.{" "}
              Projects, sprints, tasks, comments — the usual stuff.
            </p>
            <p className="text-foreground-200 max-w-lg text-center">
              How do we give an agent access to <span className="text-accent-100 font-medium">{total} endpoints</span>?
            </p>

            {/* Live fetch */}
            <div className="w-full max-w-2xl flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-border-100 bg-background-200 px-4 py-2.5 font-mono text-sm text-foreground-200">
                  fetch(<span className="text-accent-100">"https://pm-saas.mattzcarey.workers.dev/api/stats"</span>)
                </div>
                <button
                  onClick={runFetch}
                  disabled={curlRunning}
                  className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                    curlRunning
                      ? "bg-accent-100/20 text-accent-100/50 cursor-wait"
                      : "bg-accent-100 text-white hover:bg-accent-100/90"
                  }`}
                >
                  {curlRunning ? "Running..." : "Run"}
                </button>
              </div>
              {curlResult && (
                <div className="rounded-lg border border-border-100 bg-background-200 px-4 py-3 max-h-32 overflow-auto">
                  <pre className="font-mono text-sm text-foreground-100 whitespace-pre-wrap">{curlResult}</pre>
                </div>
              )}
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="api"
            className="flex flex-col items-center gap-5 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-foreground-100">
                  <span className="text-accent-100">Project Management</span> API
                </h2>
                <p className="text-foreground-200 mt-1">
                  {total} REST endpoints · Cloudflare Worker + D1
                </p>
              </div>
              <button
                onClick={() => setRevealed(false)}
                className="shrink-0 px-5 py-1.5 rounded border border-border-100 bg-background-200 text-foreground-200 hover:text-foreground-100 text-base font-mono transition-colors"
              >
                ← back
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {groups.map((g) => (
                <div key={g.label} className="flex flex-col gap-1.5">
                  <p className="text-base font-medium text-foreground-200/60 px-1 uppercase tracking-wide">
                    {g.label}
                  </p>
                  {g.endpoints.map((e) => (
                    <div
                      key={e.method + e.path}
                      className="rounded border border-border-100 bg-background-200 px-3 py-2"
                    >
                      <p className="text-base font-mono leading-snug">
                        <span className={methodColor[e.method]}>{e.method}</span>{" "}
                        <span className="text-foreground-200">{e.path}</span>
                      </p>
                      <p className="text-sm text-foreground-200/50">{e.desc}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="text-base text-foreground-200 text-center max-w-lg">
              How do we expose {total} endpoints to an LLM without blowing up the context window?
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </SlideContainer>
  )
}
