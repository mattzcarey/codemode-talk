import { SlideContainer } from "@/components"
import { useState } from "react"
import { motion } from "framer-motion"

const allTools = [
  "get_weather", "send_email", "get_calendar",
  "list_users", "create_user", "delete_user",
  "get_dns_records", "create_dns_record", "update_dns_record", "delete_dns_record",
  "list_workers", "deploy_worker", "delete_worker", "get_worker_logs",
  "list_kv_namespaces", "kv_get", "kv_put", "kv_delete",
  "list_r2_buckets", "r2_get_object", "r2_put_object",
  "create_d1_database", "d1_query", "list_d1_databases",
  "get_zone", "list_zones", "purge_cache",
  "get_analytics", "list_firewall_rules", "create_firewall_rule",
  "list_page_rules", "get_ssl_settings", "list_load_balancers",
  "get_waf_rules", "list_access_policies", "get_tunnel",
  "list_queues", "send_message", "list_durable_objects",
  "...2,460 more",
]

const stages = [3, 6, 10, 18, 28, allTools.length]
const tokenStages = ["~800", "~2K", "~8K", "~50K", "~200K", "1.17M"]

function ToolPill({ name, delay }: { name: string; delay: number }) {
  const isOverflow = name.startsWith("...")
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, delay }}
      className={`rounded border px-3 py-1 text-sm font-mono text-center whitespace-nowrap ${
        isOverflow
          ? "border-accent-100/40 bg-accent-100/10 text-accent-100"
          : "border-compute-100/30 bg-compute-100/5 text-compute-100"
      }`}
    >
      {name}
    </motion.div>
  )
}

export function MCPSlide() {
  const [stage, setStage] = useState(0)
  const toolCount = stages[stage]
  const tools = allTools.slice(0, toolCount)
  const tokenCount = tokenStages[stage]
  const isMaxed = stage >= stages.length - 1
  const advance = () => setStage((s) => Math.min(s + 1, stages.length - 1))

  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
        <h2 className="text-center text-foreground-100">
          From Bundled to <span className="text-accent-100">Shared</span>
        </h2>

        <div className="flex gap-10 items-start w-full">
          {/* Before */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <div className="rounded border border-border-100 bg-background-200 px-4 py-1.5">
              <p className="text-base font-medium text-foreground-200">BEFORE MCP</p>
            </div>
            <div className="flex gap-4">
              {["App A", "App B"].map((name) => (
                <div key={name} className="rounded-lg border border-border-100 bg-background-200 px-5 py-4 w-48">
                  <p className="text-base font-medium text-foreground-100 text-center">{name}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {["get_weather", "send_email"].map((t) => (
                      <div key={t} className="rounded border border-compute-100/30 bg-compute-100/5 px-3 py-1 text-sm font-mono text-compute-100 text-center">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-base text-foreground-200 text-center">
              Every app reimplements the same integrations
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center pt-16 shrink-0">
            <div className="w-10 h-px bg-border-100" />
            <div className="border-t-[5px] border-b-[5px] border-l-[5px] border-t-transparent border-b-transparent border-l-border-100" />
          </div>

          {/* After — interactive */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <div className="rounded border border-accent-100 bg-accent-100/10 px-4 py-1.5">
              <p className="text-base font-medium text-accent-100">REMOTE MCP</p>
            </div>

            <div className="flex gap-8 items-end">
              {["Agent A", "Agent B", "Agent C"].map((label) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="size-10 rounded-full border border-compute-100 bg-compute-100/10 flex items-center justify-center">
                    <svg className="size-5 text-compute-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground-200">{label}</span>
                </div>
              ))}
            </div>

            <div className="w-px h-3 bg-border-100" />

            {/* MCP Server — clickable, grows each click */}
            <motion.button
              onClick={advance}
              layout
              transition={{ layout: { duration: 0.4, ease: "easeOut" } }}
              className={`rounded-lg border px-6 py-4 text-center w-full cursor-pointer ${
                isMaxed
                  ? "border-accent-100 bg-accent-100/5"
                  : "border-compute-100 bg-compute-100/10 hover:bg-compute-100/15"
              }`}
            >
              <motion.div layout className="flex items-center justify-center gap-3">
                <p className={`text-base font-medium ${isMaxed ? "text-accent-100" : "text-compute-100"}`}>
                  MCP Server
                </p>
                <motion.span
                  key={tokenCount}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className={`text-sm font-mono px-2 py-0.5 rounded ${
                    isMaxed
                      ? "bg-accent-100/10 text-accent-100"
                      : "bg-compute-100/10 text-compute-100"
                  }`}
                >
                  {tokenCount} tokens
                </motion.span>
              </motion.div>
              <motion.div layout className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {tools.map((t, i) => (
                  <ToolPill key={t} name={t} delay={i >= (stages[stage - 1] ?? 0) ? (i - (stages[stage - 1] ?? 0)) * 0.03 : 0} />
                ))}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Quote */}
        <div className="rounded-lg border border-accent-100/30 bg-accent-100/5 px-6 py-3 max-w-xl">
          <p className="text-center text-base text-accent-100 italic">
            "Share tools with agents you've never met"
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
