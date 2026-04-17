import { SlideContainer } from "@/components"
import { motion } from "framer-motion"

const servers = [
  { name: "Cloudflare API", desc: "2,500+ endpoints via Codemode", color: "accent" },
  { name: "Documentation", desc: "Reference docs", color: "compute" },
  { name: "Workers Bindings", desc: "Storage, AI, compute", color: "compute" },
  { name: "Workers Builds", desc: "Build management", color: "compute" },
  { name: "Observability", desc: "Logs & analytics", color: "media" },
  { name: "Radar", desc: "Internet intelligence", color: "media" },
  { name: "Container", desc: "Sandbox environments", color: "media" },
  { name: "Browser Rendering", desc: "Screenshots & markdown", color: "media" },
  { name: "Logpush", desc: "Log job health", color: "storage" },
  { name: "AI Gateway", desc: "Prompt monitoring", color: "storage" },
  { name: "AI Search", desc: "Document search", color: "storage" },
  { name: "Audit Logs", desc: "Compliance reports", color: "storage" },
  { name: "DNS Analytics", desc: "DNS performance", color: "accent" },
  { name: "Digital Experience", desc: "App monitoring", color: "media" },
  { name: "CASB", desc: "SaaS security", color: "media" },
  { name: "GraphQL", desc: "Analytics API", color: "compute" },
]

export function SplitServersSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-8 max-w-4xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            Split by <span className="text-accent-100">Domain</span>
          </h2>
          <p className="text-foreground-200 mt-2">
            One MCP server per product. Each agent only loads the tools it needs.
          </p>
        </div>

        {/* Monolith vs split */}
        <div className="w-full flex items-center gap-6">
          {/* Before: monolith */}
          <motion.div
            className="flex-1 rounded-lg border border-accent-100/40 bg-accent-100/5 p-6 text-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-base font-medium text-accent-100 uppercase tracking-wider">One giant server</p>
            <p className="text-3xl font-medium text-accent-100 mt-2">2,500+</p>
            <p className="text-base text-foreground-200 mt-1">tools in context</p>
            <p className="text-base text-foreground-200/60 mt-2">1.17M tokens</p>
          </motion.div>

          {/* Arrow */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <svg className="size-8 text-foreground-200/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </motion.div>

          {/* After: real MCP servers */}
          <div className="flex-[2] grid grid-cols-4 gap-1.5">
            {servers.map((s, i) => (
              <motion.div
                key={s.name}
                className={`rounded border border-${s.color}-100/30 bg-${s.color}-100/5 px-2 py-1.5 text-center`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.05, ease: "easeOut" }}
              >
                <p className={`text-base font-medium text-${s.color}-100 leading-tight`}>{s.name}</p>
                <p className="text-base text-foreground-200/70 mt-0.5 leading-tight">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefit callouts */}
        <div className="w-full grid grid-cols-3 gap-3">
          {[
            { text: "Less context", color: "compute" },
            { text: "User selection needed", color: "accent" },
            { text: "Incomplete coverage", color: "accent" },
          ].map((b, i) => (
            <motion.div
              key={b.text}
              className={`rounded-lg border border-${b.color}-100/30 bg-${b.color}-100/5 px-5 py-4 text-center`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.4 + i * 0.1 }}
            >
              <p className={`text-base font-medium text-${b.color}-100`}>{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideContainer>
  )
}
