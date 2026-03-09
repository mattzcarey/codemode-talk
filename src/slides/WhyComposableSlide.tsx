import { SlideContainer } from "@/components"
import { Highlight, themes } from "prism-react-renderer"

const toolCallingSteps = [
  { call: "list_projects()", result: '[{ id: "p1", name: "Website" }]' },
  { call: 'list_tasks({ projectId: "p1" })', result: '[{ id: "t42", title: "Fix bug", assignee: null }]' },
  { call: 'get_task({ id: "t42" })', result: '{ title: "Fix bug", status: "todo" }' },
  { call: "list_users()", result: '[{ id: "u7", name: "Matt" }]' },
  { call: 'update_task({ id: "t42", assignee: "u7" })', result: "{ success: true }" },
]

const codemodeCode = `async () => {
  const projects = await codemode.listProjects();
  const website = projects
    .find(p => p.name === "Website");

  const tasks = await codemode.listTasks({
    projectId: website.id
  });
  const bug = tasks
    .find(t => t.title === "Fix bug");

  const users = await codemode.listUsers();
  const matt = users
    .find(u => u.name === "Matt");

  return codemode.updateTask({
    id: bug.id,
    assignee: matt.id
  });
}`

export function WhyComposableSlide() {
  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-4 w-full max-w-5xl scale-[0.9] md:scale-100 origin-top">
        <div className="text-center">
          <h2 className="text-foreground-100">
            Why: <span className="text-accent-100">Composability</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Left: Tool calling */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-medium text-compute-100">Tool Calling</h3>
              <span className="rounded border border-compute-100/30 bg-compute-100/5 px-2 py-0.5 text-[12px] font-mono text-compute-100">
                5 round trips
              </span>
            </div>
            <div className="rounded-lg border border-compute-100/40 bg-background-200 p-4 flex-1">
              <div className="flex flex-col gap-2.5">
                {toolCallingSteps.map((step, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-mono text-compute-100 bg-compute-100/10 rounded px-1.5 py-0.5 shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-[13px] font-mono text-foreground-100">
                        {step.call}
                      </span>
                    </div>
                    <div className="ml-7 flex items-center gap-1">
                      <span className="text-[12px] text-compute-100">→</span>
                      <span className="text-[12px] font-mono text-foreground-200">
                        {step.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Code mode */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-medium text-accent-100">Code Mode</h3>
              <span className="rounded border border-accent-100/30 bg-accent-100/5 px-2 py-0.5 text-[12px] font-mono text-accent-100">
                1 round trip
              </span>
            </div>
            <Highlight theme={themes.github} code={codemodeCode} language="javascript">
              {({ tokens, getLineProps, getTokenProps }) => (
                <div className="rounded-lg border border-accent-100/40 bg-background-200 p-4 flex-1 overflow-auto">
                  <pre className="text-[13px] font-mono whitespace-pre leading-relaxed">
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
        </div>

        {/* Bottom callout */}
        <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-6 py-3">
          <p className="text-center text-sm font-medium text-accent-100">
            Code is a natural compact plan — multiple operations in one shot
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
