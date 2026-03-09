import { SlideContainer } from "@/components"

function Box({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode
  variant?: "default" | "ai" | "compute" | "accent" | "muted"
  className?: string
}) {
  const variants = {
    default: "border-border-100 bg-background-200",
    ai: "border-ai-100 bg-ai-100/10",
    compute: "border-compute-100 bg-compute-100/10",
    accent: "border-accent-100 bg-accent-100/10",
    muted: "border-border-100/50 bg-background-100/50",
  }
  return (
    <div className={`rounded-lg border px-4 py-3 ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

function Arrow() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center">
        <div className="w-px h-6 bg-border-100" />
        <div className="border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-border-100" />
      </div>
    </div>
  )
}

export function ToolCallingSlide() {
  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-2 scale-[0.9] md:scale-100 origin-top">
        <h2 className="text-center text-foreground-100 mb-1">
          Giving Agents Hands
        </h2>
        <p className="text-center text-foreground-200 text-sm mb-6">
          Tool / Function Calling
        </p>

        <div className="flex flex-col items-center w-[500px]">
          {/* User */}
          <Box variant="accent" className="w-full text-center">
            <p className="text-sm font-medium text-accent-100">USER</p>
            <p className="text-xs text-foreground-200 italic mt-1">
              "What's the weather in London?"
            </p>
          </Box>

          <Arrow />

          {/* LLM decides */}
          <Box variant="ai" className="w-full text-center">
            <p className="text-sm font-medium text-ai-100">LLM</p>
            <p className="text-xs text-foreground-200 mt-1">
              Decides to call a tool
            </p>
          </Box>

          <Arrow />

          {/* Tool call */}
          <Box variant="compute" className="w-full">
            <p className="text-sm font-medium text-compute-100 text-center">TOOL CALL</p>
            <div className="mt-2 rounded border border-compute-100/30 bg-compute-100/5 px-3 py-2 font-mono text-xs">
              <span className="text-compute-100">get_weather</span>
              <span className="text-foreground-200">{"({ "}</span>
              <span className="text-accent-100">city</span>
              <span className="text-foreground-200">{': "London" })'}</span>
            </div>
          </Box>

          <Arrow />

          {/* Result */}
          <Box variant="muted" className="w-full">
            <p className="text-sm font-medium text-foreground-200 text-center">RESULT</p>
            <div className="mt-2 rounded border border-border-100/30 bg-background-200 px-3 py-2 font-mono text-xs text-foreground-200">
              {'{ temp: 18, condition: "cloudy" }'}
            </div>
          </Box>

          <Arrow />

          {/* LLM responds */}
          <Box variant="ai" className="w-full text-center">
            <p className="text-sm font-medium text-ai-100">LLM RESPONSE</p>
            <p className="text-xs text-foreground-200 italic mt-1">
              "It's 18°C and cloudy in London"
            </p>
          </Box>
        </div>
      </div>
    </SlideContainer>
  )
}
