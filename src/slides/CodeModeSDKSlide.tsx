import { SlideContainer } from "@/components"
import { useState, useRef } from "react"
import { Highlight, themes } from "prism-react-renderer"

interface APITool {
  name: string
  safeName: string
  description: string
  inputType: string
  outputType: string
}

const cfTools: APITool[] = [
  // Workers
  { name: "GET /workers/scripts", safeName: "listWorkers", description: "List Workers", inputType: "type Input = {}", outputType: "type Output = {\n  id: string;\n  name: string;\n  modified_on: string;\n}[]" },
  { name: "PUT /workers/scripts/:name", safeName: "deployWorker", description: "Deploy Worker", inputType: "type Input = {\n  name: string;\n  script: string;\n  bindings?: Binding[];\n  routes?: string[];\n}", outputType: "type Output = {\n  id: string;\n  name: string;\n  etag: string;\n}" },
  { name: "DELETE /workers/scripts/:name", safeName: "deleteWorker", description: "Delete Worker", inputType: "type Input = {\n  name: string;\n}", outputType: "type Output = {\n  success: boolean;\n}" },
  { name: "POST /workers/scripts/:name/tails", safeName: "tailWorker", description: "Tail Worker logs", inputType: "type Input = {\n  name: string;\n  filters?: string[];\n}", outputType: "type Output = {\n  id: string;\n  url: string;\n  expires_at: string;\n}" },
  { name: "GET /workers/scripts/:name/settings", safeName: "getWorkerSettings", description: "Get Worker settings", inputType: "type Input = {\n  name: string;\n}", outputType: "type Output = {\n  bindings: Binding[];\n  compatibility_date: string;\n  compatibility_flags: string[];\n}" },
  // DNS
  { name: "GET /zones/:zoneId/dns_records", safeName: "listDnsRecords", description: "List DNS records", inputType: "type Input = {\n  zoneId: string;\n  type?: \"A\" | \"AAAA\" | \"CNAME\" | \"MX\" | \"TXT\";\n  name?: string;\n}", outputType: "type Output = {\n  id: string;\n  type: string;\n  name: string;\n  content: string;\n  proxied: boolean;\n  ttl: number;\n}[]" },
  { name: "POST /zones/:zoneId/dns_records", safeName: "createDnsRecord", description: "Create DNS record", inputType: "type Input = {\n  zoneId: string;\n  type: \"A\" | \"AAAA\" | \"CNAME\" | \"MX\" | \"TXT\";\n  name: string;\n  content: string;\n  proxied?: boolean;\n  ttl?: number;\n}", outputType: "type Output = {\n  id: string;\n  type: string;\n  name: string;\n}" },
  { name: "PATCH /zones/:zoneId/dns_records/:id", safeName: "updateDnsRecord", description: "Update DNS record", inputType: "type Input = {\n  zoneId: string;\n  id: string;\n  content?: string;\n  proxied?: boolean;\n}", outputType: "type Output = {\n  id: string;\n  name: string;\n  content: string;\n}" },
  { name: "DELETE /zones/:zoneId/dns_records/:id", safeName: "deleteDnsRecord", description: "Delete DNS record", inputType: "type Input = {\n  zoneId: string;\n  id: string;\n}", outputType: "type Output = {\n  id: string;\n}" },
  // KV
  { name: "GET /storage/kv/namespaces", safeName: "listKvNamespaces", description: "List KV namespaces", inputType: "type Input = {}", outputType: "type Output = {\n  id: string;\n  title: string;\n  supports_url_encoding: boolean;\n}[]" },
  { name: "GET /storage/kv/namespaces/:id/values/:key", safeName: "kvGet", description: "Read KV value", inputType: "type Input = {\n  namespaceId: string;\n  key: string;\n}", outputType: "type Output = {\n  value: string;\n  metadata: unknown;\n}" },
  { name: "PUT /storage/kv/namespaces/:id/values/:key", safeName: "kvPut", description: "Write KV value", inputType: "type Input = {\n  namespaceId: string;\n  key: string;\n  value: string;\n  metadata?: Record<string, string>;\n  expiration_ttl?: number;\n}", outputType: "type Output = {\n  success: boolean;\n}" },
  // R2
  { name: "GET /r2/buckets", safeName: "listR2Buckets", description: "List R2 buckets", inputType: "type Input = {}", outputType: "type Output = {\n  name: string;\n  creation_date: string;\n  location: string;\n}[]" },
  { name: "POST /r2/buckets", safeName: "createR2Bucket", description: "Create R2 bucket", inputType: "type Input = {\n  name: string;\n  locationHint?: string;\n}", outputType: "type Output = {\n  name: string;\n  creation_date: string;\n}" },
  // D1
  { name: "GET /d1/database", safeName: "listD1Databases", description: "List D1 databases", inputType: "type Input = {}", outputType: "type Output = {\n  uuid: string;\n  name: string;\n  num_tables: number;\n  file_size: number;\n}[]" },
  { name: "POST /d1/database/:id/query", safeName: "d1Query", description: "Query D1 database", inputType: "type Input = {\n  databaseId: string;\n  sql: string;\n  params?: unknown[];\n}", outputType: "type Output = {\n  results: unknown[];\n  meta: {\n    rows_read: number;\n    rows_written: number;\n    duration: number;\n  };\n}" },
  // Zones
  { name: "GET /zones", safeName: "listZones", description: "List zones", inputType: "type Input = {\n  name?: string;\n  status?: \"active\" | \"pending\";\n}", outputType: "type Output = {\n  id: string;\n  name: string;\n  status: string;\n  plan: { name: string };\n}[]" },
  { name: "POST /zones/:zoneId/purge_cache", safeName: "purgeCache", description: "Purge cache", inputType: "type Input = {\n  zoneId: string;\n  files?: string[];\n  tags?: string[];\n  everything?: boolean;\n}", outputType: "type Output = {\n  id: string;\n  success: boolean;\n}" },
  { name: "GET /zones/:zoneId/settings", safeName: "getZoneSettings", description: "Get zone settings", inputType: "type Input = {\n  zoneId: string;\n}", outputType: "type Output = {\n  id: string;\n  value: unknown;\n  modified_on: string;\n}[]" },
  // Firewall
  { name: "GET /firewall/access_rules/rules", safeName: "listFirewallRules", description: "List IP access rules", inputType: "type Input = {\n  mode?: \"block\" | \"challenge\" | \"whitelist\";\n}", outputType: "type Output = {\n  id: string;\n  mode: string;\n  configuration: { target: string; value: string };\n}[]" },
  { name: "POST /firewall/access_rules/rules", safeName: "createFirewallRule", description: "Create IP access rule", inputType: "type Input = {\n  mode: \"block\" | \"challenge\" | \"whitelist\";\n  configuration: {\n    target: \"ip\" | \"ip_range\" | \"country\";\n    value: string;\n  };\n  notes?: string;\n}", outputType: "type Output = {\n  id: string;\n  mode: string;\n}" },
  // Access
  { name: "GET /access/apps", safeName: "listAccessApps", description: "List Access apps", inputType: "type Input = {}", outputType: "type Output = {\n  id: string;\n  name: string;\n  domain: string;\n  type: string;\n}[]" },
  { name: "POST /access/apps", safeName: "createAccessApp", description: "Create Access app", inputType: "type Input = {\n  name: string;\n  domain: string;\n  type?: \"self_hosted\";\n  session_duration?: string;\n}", outputType: "type Output = {\n  id: string;\n  name: string;\n  domain: string;\n}" },
  { name: "POST /access/apps/:appId/policies", safeName: "createAccessPolicy", description: "Create Access policy", inputType: "type Input = {\n  appId: string;\n  decision: \"allow\" | \"deny\" | \"bypass\";\n  name: string;\n  include: Array<\n    | { email: { email: string } }\n    | { email_domain: { domain: string } }\n    | { everyone: {} }\n  >;\n}", outputType: "type Output = {\n  id: string;\n  decision: string;\n  name: string;\n}" },
  // Load Balancers
  { name: "GET /load_balancers", safeName: "listLoadBalancers", description: "List load balancers", inputType: "type Input = {}", outputType: "type Output = {\n  id: string;\n  name: string;\n  default_pools: string[];\n  fallback_pool: string;\n}[]" },
  // Analytics
  { name: "GET /zones/:zoneId/analytics/dashboard", safeName: "getAnalytics", description: "Get zone analytics", inputType: "type Input = {\n  zoneId: string;\n  since?: string;\n  until?: string;\n}", outputType: "type Output = {\n  requests: { all: number };\n  bandwidth: { all: number };\n  threats: { all: number };\n  pageviews: { all: number };\n}" },
  // SSL
  { name: "GET /zones/:zoneId/ssl/verification", safeName: "getSslStatus", description: "Get SSL verification", inputType: "type Input = {\n  zoneId: string;\n}", outputType: "type Output = {\n  certificate_status: string;\n  validation_method: string;\n  cert_pack_uuid: string;\n}[]" },
]

const executeTemplates = [
  {
    label: "List Workers",
    code: `async () => {
  const workers = await codemode.listWorkers();
  return workers.slice(0, 3).map(w => ({
    name: w.name,
    modified: w.modified_on,
  }));
}`,
  },
  {
    label: "Deploy Worker",
    code: `async () => {
  const name = "hello-world-" + Math.random()
    .toString(36).slice(2, 8);

  const script = [
    "export default {",
    "  fetch() {",
    "    return new Response('Hello from ' + name);",
    "  }",
    "}",
  ].join("\\n");

  await codemode.deployWorker({ name, script });

  return {
    deployed: name,
    url: name + ".mattzcarey.workers.dev",
  };
}`,
  },
  {
    label: "Add Access",
    code: `async () => {
  const workers = await codemode.listWorkers();
  const hw = workers.find(
    w => w.name.startsWith("hello-world-")
  );
  if (!hw) return { error: "Deploy first" };

  const app = await codemode.createAccessApp({
    name: hw.name,
    domain: hw.name + ".mattzcarey.workers.dev",
  });
  await codemode.createAccessPolicy({
    appId: app.id,
    decision: "allow",
    include: [{
      email: { email: "mcarey@cloudflare.com" }
    }],
  });

  return { worker: hw.name, access: "matt-only" };
}`,
  },
]

interface LogEntry {
  direction: "out" | "in" | "status"
  text: string
}

export function CodeModeSDKSlide() {
  const [selected, setSelected] = useState(0)
  const [code, setCode] = useState(executeTemplates[0].code)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  const tool = cfTools[selected]
  const typesCode = `// ${tool.name}\n\n${tool.inputType}\n\n${tool.outputType}`

  const addLog = (entry: LogEntry) => {
    setLogs((prev) => [...prev, entry])
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 10)
  }

  const run = async () => {
    setRunning(true)
    setOutput(null)
    setLogs([])
    addLog({ direction: "status", text: "Sending code to V8 isolate..." })
    const calls = code.match(/codemode\.\w+/g) ?? []
    await new Promise((r) => setTimeout(r, 300))
    for (const call of calls) {
      addLog({ direction: "out", text: call + "()" })
      await new Promise((r) => setTimeout(r, 200))
    }
    addLog({ direction: "status", text: "Executing..." })
    try {
      const resp = await fetch("/api/codemode-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const result = (await resp.json()) as { result?: unknown; error?: string; logs?: string[] }
      if (result.logs) {
        for (const log of result.logs) addLog({ direction: "in", text: log })
      }
      if (result.error) {
        addLog({ direction: "status", text: `Error: ${result.error}` })
        setOutput(JSON.stringify(result, null, 2))
      } else {
        addLog({ direction: "in", text: "Result returned" })
        setOutput(JSON.stringify(result.result, null, 2))
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed"
      addLog({ direction: "status", text: `Error: ${msg}` })
      setOutput(JSON.stringify({ error: msg }, null, 2))
    }
    setRunning(false)
  }

  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col gap-4 w-full max-w-[85vw] h-full max-h-[75vh]">
        {/* Header */}
        <div className="text-center shrink-0">
          <h2 className="text-foreground-100">
            <span className="text-accent-100">Code</span> Mode
          </h2>
          <p className="text-foreground-200 mt-1">
            Just let the model write code
          </p>
        </div>

        {/* Main content — tools left, rest right */}
        <div className="flex gap-2 flex-1 min-h-0">
          {/* Left: full-height tools list */}
          <div className="w-56 shrink-0 flex flex-col gap-1 overflow-auto">
            {cfTools.map((t, i) => (
              <button
                key={t.safeName}
                onClick={() => setSelected(i)}
                className={`text-left rounded-lg border px-2.5 py-1 transition-colors ${
                  i === selected
                    ? "border-accent-100 bg-accent-100/10"
                    : "border-border-100 bg-background-200 hover:border-accent-100/50"
                }`}
              >
                <p className="text-sm font-mono text-accent-100">{t.name}</p>
                <p className="text-xs text-foreground-200 truncate">{t.description}</p>
              </button>
            ))}
          </div>

          {/* Middle: types + buttons + code */}
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            {/* Types */}
            <div className="rounded border border-accent-100/40 bg-background-200 overflow-auto" style={{ flex: "0 1 40%" }}>
              <div className="flex items-center gap-2 px-2 py-0.5 border-b border-border-100">
                <span className="text-sm font-mono text-accent-100">types.d.ts</span>
                <span className="text-sm text-foreground-200/50 ml-auto">generated</span>
              </div>
              <Highlight theme={themes.github} code={typesCode} language="typescript">
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="px-2 py-1 text-[14px] font-mono leading-relaxed whitespace-pre overflow-auto">
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-mono text-foreground-200">codemode.execute()</span>
              <div className="flex items-center gap-1.5 ml-auto">
                {executeTemplates.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => { setCode(t.code); setOutput(null); setLogs([]) }}
                    className={`px-2 py-0.5 rounded text-sm font-mono transition-colors ${
                      code === t.code
                        ? "bg-accent-100/20 text-accent-100 border border-accent-100/40"
                        : "bg-background-200 text-foreground-200 border border-border-100 hover:text-foreground-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
                <button
                  onClick={run}
                  disabled={running}
                  className={`rounded px-3 py-0.5 text-sm font-medium transition-colors ${
                    running ? "bg-accent-100/20 text-accent-100/50 cursor-wait" : "bg-accent-100 text-white hover:bg-accent-100/90"
                  }`}
                >
                  {running ? "Running..." : "Run"}
                </button>
              </div>
            </div>

            {/* Code editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 rounded border border-accent-100/40 bg-background-200 px-2 py-1 text-[14px] font-mono text-foreground-100 leading-relaxed resize-none focus:outline-none focus:border-accent-100"
            />
          </div>

          {/* Right: log + result */}
          <div className="w-52 shrink-0 flex flex-col gap-1">
            <div
              ref={logRef}
              className="rounded border border-border-100 bg-background-200 px-2 py-1 overflow-auto flex-1"
            >
              {logs.length === 0 ? (
                <p className="text-sm text-foreground-200/30 text-center py-2">Execution Log</p>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className={`text-sm font-mono shrink-0 ${log.direction === "status" ? "text-foreground-200/50" : "text-accent-100"}`}>
                        {log.direction === "out" ? "→" : log.direction === "in" ? "←" : "·"}
                      </span>
                      <span className="text-sm font-mono text-foreground-200 break-all">{log.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded border border-accent-100/40 bg-background-200 px-2 py-1 overflow-auto flex-1">
              {output ? (
                <pre className="text-sm font-mono text-foreground-100 whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-sm text-foreground-200/30 text-center py-2">Result</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SlideContainer>
  )
}
