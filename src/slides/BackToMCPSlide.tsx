import { SlideContainer } from "@/components"

const benefits = [
  {
    title: "Server controls execution",
    description: "Sandboxed V8 isolates. No filesystem. Network blocked by default. Observable via tail workers.",
    color: "compute",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Agent stays simple",
    description: "No complex tool orchestration. The agent just writes code. All the hard stuff runs server-side.",
    color: "ai",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "MCP protocol preserved",
    description: "search + execute are just MCP tools. Any MCP client can use them. Standard protocol, enhanced capability.",
    color: "accent",
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
]

export function BackToMCPSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-6 max-w-3xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            Back to <span className="text-accent-100">MCP</span>
          </h2>
          <p className="text-foreground-200 text-sm mt-1">
            Code mode completes the picture
          </p>
        </div>

        {/* Flow diagram */}
        <div className="w-full flex items-center justify-center gap-3">
          {/* Agent */}
          <div className="rounded-lg border border-ai-100/40 bg-ai-100/5 px-4 py-3 text-center">
            <p className="text-xs font-medium text-ai-100">Agent</p>
            <p className="text-[12px] text-foreground-200 mt-0.5">writes code</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-1">
            <div className="h-px w-8 bg-foreground-200/30" />
            <svg className="size-3 text-foreground-200/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>

          {/* Server */}
          <div className="rounded-lg border border-accent-100/40 bg-accent-100/5 px-4 py-3 text-center">
            <p className="text-xs font-medium text-accent-100">MCP Server</p>
            <p className="text-[12px] text-foreground-200 mt-0.5">search + execute</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-1">
            <div className="h-px w-8 bg-foreground-200/30" />
            <svg className="size-3 text-foreground-200/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>

          {/* V8 Isolate */}
          <div className="rounded-lg border border-compute-100/40 bg-compute-100/5 px-4 py-3 text-center">
            <p className="text-xs font-medium text-compute-100">V8 Isolate</p>
            <p className="text-[12px] text-foreground-200 mt-0.5">runs code</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-1">
            <div className="h-px w-8 bg-foreground-200/30" />
            <svg className="size-3 text-foreground-200/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>

          {/* Tools */}
          <div className="rounded-lg border border-media-100/40 bg-media-100/5 px-4 py-3 text-center">
            <p className="text-xs font-medium text-media-100">Tools</p>
            <p className="text-[12px] text-foreground-200 mt-0.5">via RPC</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="w-full flex flex-col gap-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className={`rounded-lg border border-${b.color}-100/40 bg-${b.color}-100/5 p-4 flex items-start gap-3`}
            >
              <div className={`text-${b.color}-100 shrink-0 mt-0.5`}>{b.icon}</div>
              <div>
                <p className={`text-sm font-medium text-${b.color}-100`}>{b.title}</p>
                <p className="text-xs text-foreground-200 mt-0.5">{b.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-6 py-4 w-full">
          <p className="text-sm text-foreground-100 text-center">
            The agent is just a code writer. All the hard stuff runs on the server.
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
