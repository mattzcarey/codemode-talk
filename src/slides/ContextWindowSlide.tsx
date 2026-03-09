import { SlideContainer } from "@/components"

const segments = [
  { label: "Tool Definitions", tokens: "1.17M", pct: 85, color: "bg-compute-100" },
  { label: "System Prompt", tokens: "2K", pct: 5, color: "bg-accent-100" },
  { label: "Conversation", tokens: "8K", pct: 7, color: "bg-ai-100" },
  { label: "Actual Task", tokens: "???", pct: 3, color: "bg-media-100" },
]

export function ContextWindowSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-8 max-w-3xl">
        <h2 className="text-center text-foreground-100">
          We Filled the Context Window
        </h2>

        {/* Big number */}
        <div className="flex items-baseline gap-4">
          <span className="text-6xl md:text-7xl font-medium text-accent-100 tracking-tight">
            2.3M
          </span>
          <span className="text-xl text-foreground-200">
            tokens in Cloudflare's OpenAPI spec
          </span>
        </div>

        {/* Context window bar */}
        <div className="w-full mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-foreground-200">CONTEXT WINDOW</p>
            <p className="text-xs font-mono text-foreground-200">128K tokens</p>
          </div>
          <div className="flex h-12 w-full overflow-hidden rounded-lg border border-border-100">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className={`${seg.color} flex items-center justify-center transition-all`}
                style={{ width: `${seg.pct}%` }}
              >
                {seg.pct > 10 && (
                  <span className="text-[12px] font-medium text-white truncate px-1">
                    {seg.label}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 justify-center flex-wrap">
            {segments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-1.5">
                <div className={`size-2.5 rounded-sm ${seg.color}`} />
                <span className="text-xs text-foreground-200">{seg.label}</span>
                <span className="text-xs font-mono text-foreground-200/60">{seg.tokens}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Callout */}
        <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-6 py-3">
          <p className="text-center text-sm font-medium text-accent-100">
            The context limit is not an MCP problem. It's an Agent problem.
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
