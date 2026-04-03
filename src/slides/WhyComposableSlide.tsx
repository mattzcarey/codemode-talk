import { SlideContainer } from "@/components"
import { Highlight, themes } from "prism-react-renderer"
import { motion } from "framer-motion"

const toolCallingSteps = [
  { call: "list_projects()", result: '[{ id: "p1", name: "Website" }]' },
  { call: 'list_tasks({ projectId: "p1" })', result: '[{ id: "t42", title: "Fix bug" }]' },
  { call: 'update_task({ id: "t42", assignee: "u7" })', result: "{ success: true }" },
]

const codemodeCode = `async () => {
  const projects = await codemode.listProjects();
  const website = projects.find(p => p.name === "Website");
  const tasks = await codemode.listTasks({ projectId: website.id });
  const bug = tasks.find(t => t.title === "Fix bug");
  return codemode.updateTask({ id: bug.id, assignee: "u7" });
}`

export function WhyComposableSlide() {
  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            Why: <span className="text-accent-100">Composability & Tokens</span>
          </h2>
        </div>

        <div className="flex gap-8 w-full">
          {/* Left column: composability comparison */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            {/* Tool calling */}
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-compute-100">Tool Calling</h3>
              <span className="rounded border border-compute-100/30 bg-compute-100/5 px-2 py-0.5 text-[14px] font-mono text-compute-100">
                3+ round trips
              </span>
            </div>
            <div className="rounded-lg border border-compute-100/40 bg-background-200 p-3">
              <div className="flex flex-col gap-2">
                {toolCallingSteps.map((step, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-mono text-compute-100 bg-compute-100/10 rounded px-1 py-0.5 shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-base font-mono text-foreground-100">{step.call}</span>
                    </div>
                    <div className="ml-6 flex items-center gap-1">
                      <span className="text-[14px] text-compute-100">→</span>
                      <span className="text-[14px] font-mono text-foreground-200">{step.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code mode */}
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-accent-100">Code Mode</h3>
              <span className="rounded border border-accent-100/30 bg-accent-100/5 px-2 py-0.5 text-[14px] font-mono text-accent-100">
                1 round trip
              </span>
            </div>
            <Highlight theme={themes.github} code={codemodeCode} language="javascript">
              {({ tokens, getLineProps, getTokenProps }) => (
                <div className="rounded-lg border border-accent-100/40 bg-background-200 p-6 overflow-auto">
                  <pre className="text-base font-mono whitespace-pre leading-relaxed">
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                </div>
              )}
            </Highlight>
          </div>

          {/* Right column: token efficiency */}
          <div className="w-72 shrink-0 flex flex-col gap-8 justify-center">
            {/* Token bars */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-base text-foreground-200 mb-1">All tools in context</p>
                <div className="h-7 rounded-lg border border-compute-100/30 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-compute-100/40 rounded-lg"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-base font-mono font-medium text-compute-100 z-10">
                    1.17M tokens
                  </span>
                </div>
              </div>
              <div>
                <p className="text-base text-foreground-200 mb-1">Code Mode</p>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-7 rounded-lg bg-accent-100 border border-accent-100"
                    initial={{ width: 0 }}
                    animate={{ width: "0.5rem" }}
                    transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                  />
                  <motion.span
                    className="text-base font-mono font-medium text-accent-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                  >
                    ~1,000 tokens
                  </motion.span>
                </div>
              </div>
              <motion.div
                className="rounded-full border border-accent-100/30 bg-accent-100/10 px-5 py-1 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.5, ease: "easeOut" }}
              >
                <span className="text-base font-medium text-accent-100">99.9% reduction</span>
              </motion.div>
            </div>

            {/* 2 tools */}
            <div className="rounded-lg border border-border-100 bg-background-200 p-3">
              <p className="text-[14px] font-medium text-foreground-200 mb-2">The model gets 2 tools:</p>
              <div className="flex flex-col gap-1.5">
                <div className="rounded border border-compute-100/30 bg-compute-100/5 px-2 py-1.5">
                  <p className="font-mono text-base text-compute-100 font-medium">search()</p>
                  <p className="text-base text-foreground-200 mt-0.5">Discover tools by keyword</p>
                </div>
                <div className="rounded border border-accent-100/30 bg-accent-100/5 px-2 py-1.5">
                  <p className="font-mono text-base text-accent-100 font-medium">execute()</p>
                  <p className="text-base text-foreground-200 mt-0.5">Run code against typed SDK</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-6 py-4 w-full">
          <p className="text-center text-base font-medium text-accent-100 italic">
            "LLMs are better at writing code to call MCP, than at calling MCP directly"
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
