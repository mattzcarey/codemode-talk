import { SlideContainer } from "@/components"
import { motion } from "framer-motion"

const items = [
  {
    title: "MCP as Middleware",
    description: "Servers become thin integration layers. Auth, capabilities, extensions — all handled by the protocol.",
  },
  {
    title: "TS SDK Getting Tiny",
    description: "The TypeScript MCP server library is shrinking. Less boilerplate, more convention.",
  },
  {
    title: "v2: Split Client & Server",
    description: "Server will be so small and lightweight, every framework will ship it by end of year.",
  },
]

export function FutureServersSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-8 max-w-3xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            Servers Get <span className="text-accent-100">Simpler</span>
          </h2>
          <p className="text-foreground-200 mt-1">
            MCP servers will continue to get smaller
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              className="rounded-lg border border-accent-100/30 bg-accent-100/5 p-6 flex items-start gap-4"
            >
              <div className="size-8 rounded-full border border-accent-100/50 bg-accent-100/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm font-mono font-medium text-accent-100">{i + 1}</span>
              </div>
              <div>
                <p className="text-lg font-medium text-accent-100">{item.title}</p>
                <p className="text-foreground-200 mt-1">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="rounded-lg border border-accent-100 bg-accent-100/10 px-8 py-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
        >
          <p className="text-accent-100 font-medium text-center">
            That's the plan.
          </p>
        </motion.div>
      </div>
    </SlideContainer>
  )
}
