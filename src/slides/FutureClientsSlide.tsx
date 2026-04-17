import { SlideContainer } from "@/components"
import { motion } from "framer-motion"

const items = [
  {
    title: "Programmatic Tool Calling",
    description: "Clients will natively support code-as-tool-call. It's coming.",
    color: "accent",
  },
  {
    title: "Saved Mini-Scripts",
    description: "Agents save and reuse small scripts for recurring tasks. No re-discovery needed.",
    color: "media",
  },
  {
    title: "Stateless Agent Loops",
    description: "The agent loop can be stateless in remote environments. Full isolation. No VM needed.",
    color: "compute",
  },
]

export function FutureClientsSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-8 max-w-4xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            Clients Will <span className="text-accent-100">Catch Up</span>
          </h2>
          <p className="text-foreground-200 mt-1">
            Programmatic tool calling is coming to every client
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
              className={`flex-1 rounded-lg border border-${item.color}-100 bg-${item.color}-100/10 p-6 flex flex-col gap-3`}
            >
              <p className={`text-lg font-medium text-${item.color}-100`}>{item.title}</p>
              <p className="text-foreground-200">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideContainer>
  )
}
