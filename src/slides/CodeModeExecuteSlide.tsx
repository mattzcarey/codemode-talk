import { SlideContainer } from "@/components"
import { useState, useRef } from "react"

const defaultCode = `const projects = await codemode.listProjects();
console.log("Found", projects.length, "projects");

const first = projects[0];
if (!first) return { error: "No projects found" };

console.log("Fetching tasks for:", first.name);
const tasks = await codemode.listProjectTasks({
  projectId: first.id
});
console.log("Found", tasks.length, "tasks");

return {
  project: first.name,
  taskCount: tasks.length,
  tasks: tasks.map(t => ({
    title: t.title,
    status: t.status,
    priority: t.priority
  }))
};`

interface LogEntry {
  direction: "out" | "in" | "status"
  text: string
}

export function CodeModeExecuteSlide() {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  const addLog = (entry: LogEntry) => {
    setLogs((prev) => [...prev, entry])
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 10)
  }

  const run = async () => {
    setRunning(true)
    setOutput(null)
    setLogs([])

    // Simulate the execution flow with timed log entries
    addLog({ direction: "status", text: "Sending code to V8 isolate..." })

    // Parse codemode.* calls from the code to show in log
    const calls = code.match(/codemode\.\w+\([^)]*\)/g) || []

    await new Promise((r) => setTimeout(r, 300))

    for (const call of calls) {
      addLog({ direction: "out", text: call })
      await new Promise((r) => setTimeout(r, 200))
    }

    addLog({ direction: "status", text: "Executing..." })

    try {
      // Server wraps in async () => { ... } and executes in V8 isolate
      const resp = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const result = (await resp.json()) as { result?: unknown; error?: string; logs?: string[] }

      // Show captured console.logs in the execution log
      if (result.logs && result.logs.length > 0) {
        for (const log of result.logs) {
          addLog({ direction: "in", text: log })
        }
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
      <div className="flex flex-col items-center gap-3 w-full max-w-5xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            <span className="text-accent-100">Code Mode</span>: Execute
          </h2>
          <p className="text-foreground-200 text-sm mt-1">
            Code runs in a V8 isolate — not on the agent
          </p>
        </div>

        <div className="flex gap-4 w-full flex-1 min-h-0">
          {/* Left: Code editor */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-mono text-foreground-200">
                codemode.execute()
              </span>
              <button
                onClick={run}
                disabled={running}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                  running
                    ? "bg-compute-100/20 text-compute-100/50 cursor-wait"
                    : "bg-compute-100 text-white hover:bg-compute-100/90"
                }`}
              >
                {running ? "Running..." : "Run"}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 rounded-lg border border-accent-100/40 bg-background-200 p-3 text-[13px] font-mono text-foreground-100 leading-relaxed resize-none focus:outline-none focus:border-accent-100 min-h-[35vh]"
            />
          </div>

          {/* Right: V8 diagram + Execution log + output */}
          <div className="w-72 shrink-0 flex flex-col gap-2">
            {/* V8 isolates diagram */}
            <div className="rounded-lg border border-compute-100/30 bg-compute-100/5 p-2">
              <img
                src="/workers-diagram.png"
                alt="V8 isolates — many lightweight sandboxes sharing a single process"
                className="w-full rounded"
              />
              <p className="text-[9px] text-foreground-200/50 text-center mt-1">
                Each execution runs in its own V8 isolate — lightweight, sandboxed, instant startup
              </p>
            </div>

            {/* Execution log */}
            <span className="text-[12px] font-mono text-foreground-200">
              Execution Log
            </span>
            <div
              ref={logRef}
              className="rounded-lg border border-border-100 bg-background-200 p-3 overflow-auto min-h-[10vh] max-h-[18vh]"
            >
              {logs.length === 0 ? (
                <p className="text-[12px] text-foreground-200/30 text-center py-4">
                  Click Run to execute
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span
                        className={`text-[12px] font-mono shrink-0 ${
                          log.direction === "out"
                            ? "text-compute-100"
                            : log.direction === "in"
                              ? "text-ai-100"
                              : "text-foreground-200/50"
                        }`}
                      >
                        {log.direction === "out"
                          ? "→"
                          : log.direction === "in"
                            ? "←"
                            : "·"}
                      </span>
                      <span className="text-[12px] font-mono text-foreground-200 break-all">
                        {log.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Output */}
            <span className="text-[12px] font-mono text-foreground-200">
              Result
            </span>
            <div className="rounded-lg border border-ai-100/40 bg-background-200 p-3 overflow-auto min-h-[8vh] max-h-[15vh]">
              {output ? (
                <pre className="text-[12px] font-mono text-ai-100 whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <p className="text-[12px] text-foreground-200/30 text-center py-2">
                  No output yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="flex gap-6 text-[13px] text-foreground-200">
          <div className="flex items-center gap-1.5">
            <span className="text-compute-100">→</span> codemode.* calls dispatched via RPC to host
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-ai-100">←</span> Tool executes on host, result returns to isolate
          </div>
        </div>
      </div>
    </SlideContainer>
  )
}
