import { SlideContainer } from "@/components"
import { lazy, Suspense } from "react"

const Terminal = lazy(() =>
  import("@/components/Terminal").then((m) => ({ default: m.Terminal }))
)

export function CLISlide() {
  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-8 w-full max-w-4xl h-full max-h-[80vh]">
        <div className="text-center shrink-0">
          <h2 className="text-foreground-100">
            Command Line <span className="text-accent-100">Interface</span>
          </h2>
          <p className="text-foreground-200 mt-1">
            Self-discoverable by design
          </p>
        </div>

        {/* Terminal */}
        <div className="w-full flex-1 min-h-0 rounded-lg border border-border-100 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-background-200 border-b border-border-100 shrink-0">
            <div className="size-3 rounded-full bg-accent-100" />
            <div className="size-3 rounded-full bg-border-100" />
            <div className="size-3 rounded-full bg-border-100" />
            <span className="ml-2 text-base text-foreground-200/60 font-mono">
              bash
            </span>
          </div>

          {/* Live terminal */}
          <Suspense
            fallback={
              <div className="h-full bg-background-100 flex items-center justify-center text-foreground-200 text-sm">
                Loading terminal...
              </div>
            }
          >
            <Terminal
              sandboxId="sandbox-v7"
              sessionId="cli-demo"
              className="h-[calc(100%-36px)]"
            />
          </Suspense>
        </div>

        {/* Callout */}
        <div className="flex gap-8 text-base text-foreground-200 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-compute-100">+</span> --help for discovery
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-accent-100">-</span> Maintenance, permissioning sucks
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-foreground-200/50">
            Used by: OpenClaw, various agents
          </div>
        </div>
      </div>
    </SlideContainer>
  )
}
