import { SlideContainer } from "@/components"

function AppBox({ name, tools }: { name: string; tools: string[] }) {
  return (
    <div className="rounded-lg border border-border-100 bg-background-200 px-4 py-3 w-44">
      <p className="text-sm font-medium text-foreground-100 text-center">{name}</p>
      <div className="mt-2 flex flex-col gap-1">
        {tools.map((t) => (
          <div
            key={t}
            className="rounded border border-compute-100/30 bg-compute-100/5 px-2 py-0.5 text-[12px] font-mono text-compute-100 text-center"
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}

function AgentDot({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="size-10 rounded-full border border-ai-100 bg-ai-100/10 flex items-center justify-center">
        <svg className="size-5 text-ai-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      </div>
      <span className="text-[12px] text-foreground-200">{label}</span>
    </div>
  )
}

export function MCPSlide() {
  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-6 scale-[0.85] md:scale-100 origin-top">
        <h2 className="text-center text-foreground-100">
          From Bundled to Shared
        </h2>

        <div className="flex gap-12 items-start">
          {/* Before */}
          <div className="flex flex-col items-center gap-4">
            <div className="rounded border border-border-100 bg-background-200 px-3 py-1.5">
              <p className="text-xs font-medium text-foreground-200">BEFORE MCP</p>
            </div>
            <div className="flex gap-3">
              <AppBox name="App A" tools={["get_weather", "send_email"]} />
              <AppBox name="App B" tools={["get_weather", "send_email"]} />
            </div>
            <p className="text-xs text-foreground-200 max-w-[300px] text-center">
              Every app reimplements the same integrations
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center pt-10">
            <div className="w-12 h-px bg-border-100" />
            <div className="border-t-[5px] border-b-[5px] border-l-[5px] border-t-transparent border-b-transparent border-l-border-100" />
          </div>

          {/* After */}
          <div className="flex flex-col items-center gap-4">
            <div className="rounded border border-accent-100 bg-accent-100/10 px-3 py-1.5">
              <p className="text-xs font-medium text-accent-100">REMOTE MCP</p>
            </div>

            <div className="flex gap-6 items-end">
              <AgentDot label="Agent A" />
              <AgentDot label="Agent B" />
              <AgentDot label="Agent C" />
            </div>

            {/* Lines converging */}
            <div className="w-px h-4 bg-border-100" />

            <div className="rounded-lg border border-compute-100 bg-compute-100/10 px-6 py-3 text-center">
              <p className="text-sm font-medium text-compute-100">MCP Server</p>
              <div className="mt-2 flex gap-2">
                <div className="rounded border border-compute-100/30 bg-compute-100/5 px-2 py-0.5 text-[12px] font-mono text-compute-100">
                  get_weather
                </div>
                <div className="rounded border border-compute-100/30 bg-compute-100/5 px-2 py-0.5 text-[12px] font-mono text-compute-100">
                  send_email
                </div>
                <div className="rounded border border-compute-100/30 bg-compute-100/5 px-2 py-0.5 text-[12px] font-mono text-compute-100">
                  + more
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-4 rounded-lg border border-accent-100/30 bg-accent-100/5 px-6 py-3 max-w-xl">
          <p className="text-center text-sm text-accent-100 italic">
            "Share tools with agents you've never met"
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
