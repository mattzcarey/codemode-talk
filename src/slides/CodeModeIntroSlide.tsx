import { SlideContainer } from "@/components"

export function CodeModeIntroSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-6 max-w-5xl w-full">
        <div className="text-center">
          <h2 className="text-foreground-100">
            <span className="text-accent-100">Code Mode</span>
          </h2>
          <p className="text-foreground-200 text-sm mt-1">
            Instead of calling tools one-by-one, the LLM writes code against a typed SDK
          </p>
        </div>

        <img
          src="/comparison.png"
          alt="Traditional MCP vs Code Mode architecture comparison"
          className="w-full max-w-2xl rounded-lg border border-border-100"
        />

        <p className="text-sm text-foreground-200 text-center max-w-2xl">
          The agent executes LLM-generated code in a <span className="text-compute-100 font-medium">sandboxed V8 isolate</span>,
          dispatching tool calls via RPC back to the host
        </p>
      </div>
    </SlideContainer>
  )
}
