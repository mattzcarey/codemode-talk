import { SlideContainer } from "@/components"

export function WhyTokensSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-6 max-w-3xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            Why: <span className="text-accent-100">Token Efficiency</span>
          </h2>
        </div>

        {/* Big stat comparison */}
        <div className="w-full flex flex-col gap-4">
          {/* All tools */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right">
              <p className="text-xs text-foreground-200">All tools in context</p>
            </div>
            <div className="flex-1 h-8 rounded-lg bg-compute-100/20 border border-compute-100/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-compute-100/40" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-mono font-medium text-compute-100">
                1.17M tokens
              </span>
            </div>
          </div>

          {/* Code mode */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right">
              <p className="text-xs text-foreground-200">Code Mode</p>
            </div>
            <div className="flex items-center gap-3 flex-1">
              <div className="h-8 w-2 rounded-lg bg-accent-100 border border-accent-100" />
              <span className="text-sm font-mono font-medium text-accent-100">
                ~1,000 tokens
              </span>
              <span className="rounded-full border border-accent-100/30 bg-accent-100/10 px-3 py-0.5 text-xs font-medium text-accent-100">
                99.9% reduction
              </span>
            </div>
          </div>
        </div>

        {/* How: search + execute */}
        <div className="w-full rounded-lg border border-border-100 bg-background-200 p-5">
          <p className="text-xs font-medium text-foreground-200 mb-3">
            The model gets 2 tools:
          </p>
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border border-ai-100/30 bg-ai-100/5 p-3">
              <p className="font-mono text-sm text-ai-100 font-medium">search()</p>
              <p className="text-xs text-foreground-200 mt-1">
                Discovers relevant tools by keyword. Only loads what's needed.
              </p>
              <p className="text-[12px] text-foreground-200/50 mt-2">
                → Progressive disclosure
              </p>
            </div>
            <div className="flex-1 rounded-lg border border-accent-100/30 bg-accent-100/5 p-3">
              <p className="font-mono text-sm text-accent-100 font-medium">execute()</p>
              <p className="text-xs text-foreground-200 mt-1">
                Runs code against the typed SDK. Multiple operations, one call.
              </p>
              <p className="text-[12px] text-foreground-200/50 mt-2">
                → Composable without context leak
              </p>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-6 py-4 w-full">
          <p className="text-sm text-foreground-100 text-center leading-relaxed italic">
            "LLMs are better at writing code to call MCP, than at calling MCP directly"
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
