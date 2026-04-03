import { SlideContainer } from "@/components"
import { useState, useRef } from "react"
import { Highlight, themes } from "prism-react-renderer"
import { motion } from "framer-motion"

interface PMTool {
  name: string
  safeName: string
  description: string
  inputType: string
  outputType: string
}

const pmTools: PMTool[] = [
  { name: "GET /api/projects", safeName: "listProjects", description: "List all projects", inputType: "type ListProjectsInput = {}", outputType: "type ListProjectsOutput = {\n  id: string;\n  name: string;\n  description: string;\n  created_at: string;\n}[]" },
  { name: "POST /api/projects", safeName: "createProject", description: "Create a new project", inputType: "type CreateProjectInput = {\n  /** Project name */\n  name: string;\n  /** Project description */\n  description?: string;\n}", outputType: "type CreateProjectOutput = {\n  id: string;\n  name: string;\n  description: string;\n}" },
  { name: "GET /api/projects/:id", safeName: "getProject", description: "Get a single project by ID", inputType: "type GetProjectInput = {\n  /** Project ID */\n  id: string;\n}", outputType: "type GetProjectOutput = {\n  id: string;\n  name: string;\n  description: string;\n  created_at: string;\n}" },
  { name: "PATCH /api/projects/:id", safeName: "updateProject", description: "Update a project", inputType: "type UpdateProjectInput = {\n  id: string;\n  name?: string;\n  description?: string;\n}", outputType: "type UpdateProjectOutput = {\n  id: string;\n  name: string;\n  description: string;\n}" },
  { name: "DELETE /api/projects/:id", safeName: "deleteProject", description: "Delete a project", inputType: "type DeleteProjectInput = {\n  id: string;\n}", outputType: "type DeleteProjectOutput = {\n  deleted: string;\n}" },
  { name: "GET /api/projects/:id/sprints", safeName: "listSprints", description: "List sprints for a project", inputType: "type ListSprintsInput = {\n  projectId: string;\n}", outputType: "type ListSprintsOutput = {\n  id: string;\n  name: string;\n  status: string;\n}[]" },
  { name: "POST /api/projects/:id/sprints", safeName: "createSprint", description: "Create a sprint", inputType: "type CreateSprintInput = {\n  projectId: string;\n  name: string;\n  startDate?: string;\n  endDate?: string;\n}", outputType: "type CreateSprintOutput = {\n  id: string;\n  name: string;\n  status: \"planned\";\n}" },
  { name: "GET /api/projects/:id/tasks", safeName: "listProjectTasks", description: "List tasks with filters", inputType: "type ListProjectTasksInput = {\n  projectId: string;\n  status?: \"todo\" | \"in_progress\" | \"done\";\n  priority?: \"low\" | \"medium\" | \"high\" | \"critical\";\n}", outputType: "type ListProjectTasksOutput = {\n  id: string;\n  title: string;\n  status: string;\n  priority: string;\n  assignee: string;\n}[]" },
  { name: "POST /api/projects/:id/tasks", safeName: "createTask", description: "Create a task in a project", inputType: "type CreateTaskInput = {\n  projectId: string;\n  title: string;\n  priority?: \"low\" | \"medium\" | \"high\" | \"critical\";\n  assignee?: string;\n}", outputType: "type CreateTaskOutput = {\n  id: string;\n  title: string;\n  status: string;\n  priority: string;\n}" },
  { name: "PATCH /api/tasks/:id", safeName: "updateTask", description: "Update a task", inputType: "type UpdateTaskInput = {\n  id: string;\n  title?: string;\n  status?: \"todo\" | \"in_progress\" | \"done\";\n  priority?: \"low\" | \"medium\" | \"high\" | \"critical\";\n  assignee?: string;\n}", outputType: "type UpdateTaskOutput = {\n  id: string;\n  title: string;\n  status: string;\n  assignee: string;\n}" },
  { name: "GET /api/stats", safeName: "getStats", description: "Dashboard counts", inputType: "type GetStatsInput = {}", outputType: "type GetStatsOutput = {\n  projects: number;\n  tasks: number;\n  sprints: number;\n  comments: number;\n}" },
]

function methodColor(name: string) {
  if (name.startsWith("GET")) return "text-compute-100"
  if (name.startsWith("POST")) return "text-compute-100"
  if (name.startsWith("PATCH")) return "text-media-100"
  if (name.startsWith("DELETE")) return "text-accent-100"
  return "text-foreground-200"
}

const executeTemplates = [
  {
    label: "List Projects",
    code: `async () => {
  const projects = await codemode.listProjects();
  console.log("Found", projects.length, "projects");
  return projects.map(p => ({ name: p.name, id: p.id }));
}`,
  },
  {
    label: "Create Project",
    code: `async () => {
  const project = await codemode.createProject({
    name: "MCP Dev Summit",
    description: "Created live on stage"
  });
  console.log("Created:", project.name);
  return project;
}`,
  },
  {
    label: "Create Task",
    code: `async () => {
  const projects = await codemode.listProjects();
  const project = projects[0];
  if (!project) return { error: "No projects" };
  const task = await codemode.createTask({
    projectId: project.id,
    title: "Ship Code Mode",
    priority: "critical",
    assignee: "Matt"
  });
  return task;
}`,
  },
]

interface LogEntry {
  direction: "out" | "in" | "status"
  text: string
}

export function CodeModeSDKSlide() {
  const [flipped, setFlipped] = useState(false)
  const [selected, setSelected] = useState(0)
  const [code, setCode] = useState(executeTemplates[0].code)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  const tool = pmTools[selected]
  const typesCode = `${tool.inputType}\n\n${tool.outputType}`

  const addLog = (entry: LogEntry) => {
    setLogs((prev) => [...prev, entry])
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 10)
  }

  const run = async () => {
    setRunning(true)
    setOutput(null)
    setLogs([])
    addLog({ direction: "status", text: "Sending code to V8 isolate..." })
    const calls = code.match(/codemode\.\w+\([^)]*\)/g) || []
    await new Promise((r) => setTimeout(r, 300))
    for (const call of calls) {
      addLog({ direction: "out", text: call })
      await new Promise((r) => setTimeout(r, 200))
    }
    addLog({ direction: "status", text: "Executing..." })
    try {
      const resp = await fetch("/api/codemode-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const result = (await resp.json()) as { result?: unknown; error?: string; logs?: string[] }
      if (result.logs && result.logs.length > 0) {
        for (const log of result.logs) addLog({ direction: "in", text: log })
      }
      if (result.error) {
        addLog({ direction: "status", text: `Error: ${result.error}` })
        setOutput(JSON.stringify(result, null, 2))
      } else {
        addLog({ direction: "in", text: "Result returned" })
        addLog({ direction: "status", text: "Execution complete" })
        setOutput(JSON.stringify(result.result, null, 2))
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed"
      addLog({ direction: "status", text: `Error: ${msg}` })
      setOutput(JSON.stringify({ error: msg }, null, 2))
    }
    setRunning(false)
  }

  return (
    <SlideContainer showDots={false}>
      <div
        className="w-full max-w-5xl h-full max-h-[80vh] flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full"
        >
          {/* ===== FRONT: Typed SDK ===== */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="flex flex-col items-center gap-6 w-full"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-foreground-100">
                  <span className="text-accent-100">Code Mode:</span> Typed SDK
                </h2>
                <p className="text-foreground-200 text-base mt-1">
                  Tool descriptions + input schemas → TypeScript types
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFlipped(true) }}
                className="shrink-0 px-5 py-1.5 rounded border border-accent-100/40 bg-accent-100/10 text-accent-100 hover:bg-accent-100/20 text-base font-mono transition-colors"
              >
                try it →
              </button>
            </div>

            <div className="relative flex gap-6 w-full flex-1 min-h-0">
              {/* Left: Tools list */}
              <div className="w-64 shrink-0 flex flex-col gap-1 max-h-[50vh] overflow-auto">
                <span className="text-sm font-mono text-foreground-200/50 px-1">
                  {pmTools.length} tools
                </span>
                {pmTools.map((t, i) => (
                  <button
                    key={t.safeName}
                    onClick={() => setSelected(i)}
                    className={`text-left rounded-lg border px-2.5 py-1.5 transition-colors ${
                      i === selected
                        ? "border-accent-100 bg-accent-100/10"
                        : "border-border-100 bg-background-200 hover:border-accent-100/50"
                    }`}
                  >
                    <p className={`text-sm font-mono ${methodColor(t.name)}`}>{t.name}</p>
                    <p className="text-xs text-foreground-200 truncate">{t.description}</p>
                  </button>
                ))}
              </div>

              {/* Right: Generated types */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 rounded-lg border border-accent-100/40 bg-background-200 overflow-auto">
                  <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border-100">
                    <span className="text-sm font-mono text-accent-100">types.d.ts</span>
                    <span className="text-sm text-foreground-200/50 ml-auto">generated from schema</span>
                  </div>
                  <Highlight theme={themes.github} code={typesCode} language="typescript">
                    {({ tokens, getLineProps, getTokenProps }) => (
                      <pre className="p-3 text-sm font-mono leading-relaxed whitespace-pre overflow-auto">
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              </div>

            </div>

            <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-6 py-3">
              <p className="text-center text-base text-foreground-100">
                The model gets a <span className="text-accent-100 font-medium">typed SDK</span>, not a list of tools
              </p>
            </div>
          </div>

          {/* ===== BACK: Execute ===== */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 z-20 flex flex-col items-center gap-6 w-full"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-foreground-100">
                  <span className="text-accent-100">Code Mode:</span> Execute
                </h2>
                <p className="text-foreground-200 text-base mt-1">Code runs in a V8 isolate — not on the agent</p>
              </div>
              <button
                onClick={() => setFlipped(false)}
                className="shrink-0 px-5 py-1.5 rounded border border-border-100 bg-background-200 text-foreground-200 hover:text-foreground-100 text-base font-mono transition-colors"
              >
                ← back
              </button>
            </div>

            {/* Template selector - execute side */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-sm text-foreground-200">Templates:</span>
              {executeTemplates.map((t) => (
                <button
                  key={t.label}
                  onClick={() => { setCode(t.code); setOutput(null); setLogs([]) }}
                  className={`px-2.5 py-1 rounded text-sm font-mono transition-colors ${
                    code === t.code
                      ? "bg-accent-100/20 text-accent-100 border border-accent-100/40"
                      : "bg-background-200 text-foreground-200 border border-border-100 hover:text-foreground-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex gap-6 w-full flex-1 min-h-0">
              {/* Code editor */}
              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-foreground-200">codemode.execute()</span>
                  <button
                    onClick={run}
                    disabled={running}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                      running ? "bg-accent-100/20 text-accent-100/50 cursor-wait" : "bg-accent-100 text-white hover:bg-accent-100/90"
                    }`}
                  >
                    {running ? "Running..." : "Run"}
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 rounded-lg border border-accent-100/40 bg-background-200 p-4 text-sm font-mono text-foreground-100 leading-relaxed resize-none focus:outline-none focus:border-accent-100 min-h-[30vh]"
                />
              </div>

              {/* Execution log + output */}
              <div className="w-72 shrink-0 flex flex-col gap-2">
                <span className="text-sm font-mono text-foreground-200">Execution Log</span>
                <div
                  ref={logRef}
                  className="rounded-lg border border-border-100 bg-background-200 p-3 overflow-auto min-h-[10vh] max-h-[18vh]"
                >
                  {logs.length === 0 ? (
                    <p className="text-sm text-foreground-200/30 text-center py-4">Click Run to execute</p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {logs.map((log, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className={`text-sm font-mono shrink-0 ${log.direction === "status" ? "text-foreground-200/50" : "text-compute-100"}`}>
                            {log.direction === "out" ? "→" : log.direction === "in" ? "←" : "·"}
                          </span>
                          <span className="text-sm font-mono text-foreground-200 break-all">{log.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-sm font-mono text-foreground-200">Result</span>
                <div className="rounded-lg border border-compute-100/40 bg-background-200 p-3 overflow-auto min-h-[8vh] max-h-[15vh]">
                  {output ? (
                    <pre className="text-sm font-mono text-foreground-100 whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <p className="text-sm text-foreground-200/30 text-center py-2">No output yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-6 text-sm text-foreground-200">
              <div className="flex items-center gap-1.5">
                <span className="text-compute-100">→</span> codemode.* calls dispatched via RPC to host
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-compute-100">←</span> Tool executes on host, result returns to isolate
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SlideContainer>
  )
}
