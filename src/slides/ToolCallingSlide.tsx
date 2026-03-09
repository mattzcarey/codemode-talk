import { SlideContainer } from "@/components"
import { motion } from "framer-motion"

function Box({
  children,
  variant = "default",
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  variant?: "default" | "ai" | "compute" | "accent" | "muted"
  className?: string
  delay?: number
}) {
  const variants = {
    default: "border-border-100 bg-background-200",
    ai: "border-ai-100/40 bg-ai-100/5",
    compute: "border-compute-100 bg-compute-100/10",
    accent: "border-accent-100 bg-accent-100/10",
    muted: "border-border-100/50 bg-background-100/50",
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`rounded-lg border px-4 py-3 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.div>
  )
}

function Arrow({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-center"
    >
      <div className="flex flex-col items-center">
        <div className="w-px h-6 bg-border-100" />
        <div className="border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-border-100" />
      </div>
    </motion.div>
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
          <Box variant="accent" className="w-full text-center" delay={0.1}>
            <p className="text-sm font-medium text-accent-100">USER</p>
            <p className="text-xs text-foreground-200 italic mt-1">
              "What's the weather in London?"
            </p>
          </Box>

          <Arrow delay={0.3} />

          {/* LLM decides */}
          <Box variant="ai" className="w-full text-center" delay={0.5}>
            <p className="text-sm font-medium text-ai-100">LLM</p>
            <p className="text-xs text-foreground-100 mt-1">
              Decides to call a tool
            </p>
          </Box>

          <Arrow delay={0.7} />

          {/* Tool call */}
          <Box variant="compute" className="w-full" delay={0.9}>
            <p className="text-sm font-medium text-compute-100 text-center">TOOL CALL</p>
            <div className="mt-2 rounded border border-compute-100/30 bg-compute-100/5 px-3 py-2 font-mono text-xs">
              <span className="text-compute-100">get_weather</span>
              <span className="text-foreground-200">{"({ "}</span>
              <span className="text-accent-100">city</span>
              <span className="text-foreground-200">{': "London" })'}</span>
            </div>
          </Box>

          <Arrow delay={1.1} />

          {/* Result */}
          <Box variant="muted" className="w-full" delay={1.3}>
            <p className="text-sm font-medium text-foreground-200 text-center">RESULT</p>
            <div className="mt-2 rounded border border-border-100/30 bg-background-200 px-3 py-2 font-mono text-xs text-foreground-200">
              {'{ temp: 18, condition: "cloudy" }'}
            </div>
          </Box>

          <Arrow delay={1.5} />

          {/* LLM responds */}
          <Box variant="ai" className="w-full text-center" delay={1.7}>
            <p className="text-sm font-medium text-ai-100">LLM RESPONSE</p>
            <p className="text-xs text-foreground-100 italic mt-1">
              "It's 18°C and cloudy in London"
            </p>
          </Box>
        </div>
      </div>
    </SlideContainer>
  )
}
