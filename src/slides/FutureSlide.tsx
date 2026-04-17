import { SlideContainer } from "@/components"
import { motion } from "framer-motion"

const columns = [
  {
    title: "Sandboxes",
    color: "compute",
    items: [
      "Pydantic Monty",
      "Deno",
      "Dynamic Workers (local)",
      "More isolated environments",
    ],
  },
  {
    title: "Clients",
    color: "accent",
    items: [
      "Programmatic tool calling",
      "Saved mini-scripts per task",
      "Stateless agent loops",
      "No VM needed",
    ],
  },
  {
    title: "Servers",
    color: "media",
    items: [
      "MCP as middleware",
      "TS SDK getting tiny",
      "v2: split client & server",
      "Every framework ships it",
    ],
  },
]

export function FutureSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            The <span className="text-accent-100">Future</span>
          </h2>
        </div>

        <div className="flex gap-6 w-full">
          {columns.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + ci * 0.15 }}
              className={`flex-1 rounded-lg border border-${col.color}-100 bg-${col.color}-100/10 p-6 flex flex-col gap-4`}
            >
              <p className={`text-lg font-medium text-${col.color}-100`}>{col.title}</p>
              <div className="flex flex-col gap-2">
                {col.items.map((item) => (
                  <div
                    key={item}
                    className={`rounded border border-${col.color}-100/30 bg-background-100/50 px-3 py-2`}
                  >
                    <p className="text-foreground-200">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideContainer>
  )
}
