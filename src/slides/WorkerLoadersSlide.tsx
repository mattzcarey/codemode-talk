import { SlideContainer } from "@/components"
import { Highlight, themes } from "prism-react-renderer"
import { motion } from "framer-motion"
import { useState } from "react"

const setupCode = `// wrangler.jsonc: "worker_loaders": [{ "binding": "LOADER" }]

const worker = env.LOADER.get(executionId, async () => ({
  compatibilityDate: "2026-04-03",
  mainModule: "executor.js",
  modules: {
    "executor.js": generatedCode,  // LLM-generated code
  },
  env: {
    SDK: sdkBinding,               // Only what you grant
  },
  globalOutbound: null,            // Block ALL network
}));

const entrypoint = worker.getEntrypoint();
const result = await entrypoint.run();`

const features = [
  { label: "Instant", detail: "V8 isolates start in ~5ms", color: "media" },
  { label: "No Filesystem", detail: "Code provided in-memory only", color: "compute" },
  { label: "Network Control", detail: "globalOutbound: null blocks all fetch()", color: "accent" },
  { label: "Memory Isolation", detail: "Each isolate has its own heap", color: "media" },
  { label: "Controlled Bindings", detail: "Parent controls what's accessible via env", color: "storage" },
  { label: "Observable", detail: "Tail workers for logging & auditing", color: "compute" },
]

const templates = [
  {
    label: "Math",
    code: `const fib = (n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};

const results = Array.from(
  { length: 10 },
  (_, i) => fib(i)
);

return {
  date: new Date().toISOString(),
  fibonacci: results,
  sum: results.reduce((a, b) => a + b, 0),
};`,
  },
  {
    label: "Isolation",
    code: `const secrets = process.env ?? null;

return {
  date: new Date().toISOString(),
  secrets,
  globals: Object.keys(globalThis).slice(0, 15),
};`,
  },
  {
    label: "Fetch",
    code: `const resp = await fetch(
  "https://httpbin.org/json"
);
const data = await resp.json();

return {
  date: new Date().toISOString(),
  ...data,
};`,
  },
]

export function WorkerLoadersSlide() {
  const [flipped, setFlipped] = useState(false)
  const [code, setCode] = useState(templates[0].code)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [networkBlocked, setNetworkBlocked] = useState(true)
  const [nodeCompat, setNodeCompat] = useState(true)

  const runCode = async () => {
    setRunning(true)
    setOutput(null)
    try {
      const resp = await fetch("/api/execute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, globalOutbound: networkBlocked ? null : "default", nodeCompat }),
      })
      const data = await resp.json()
      setOutput(JSON.stringify(data, null, 2))
    } catch (err) {
      setOutput(JSON.stringify({ error: String(err) }, null, 2))
    } finally {
      setRunning(false)
    }
  }

  return (
    <SlideContainer showDots={false}>
      <div
        className="w-full max-w-5xl h-full max-h-[80vh] flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full"
        >
          {/* ===== FRONT FACE ===== */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="flex flex-col items-center gap-8 w-full scale-[0.85] md:scale-100 origin-top"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-foreground-100">Dynamic <span className="text-accent-100">Workers</span></h2>
                <p className="text-foreground-200 mt-1">
                  Secure execution of untrusted code
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFlipped(true) }}
                className="shrink-0 px-5 py-1.5 rounded border border-accent-100/40 bg-accent-100/10 text-accent-100 hover:bg-accent-100/20 text-base font-mono transition-colors"
              >
                try it →
              </button>
            </div>

            <div className="relative flex flex-col md:flex-row gap-8 w-full">
              {/* Code */}
              <div className="flex-1">
                <Highlight theme={themes.github} code={setupCode} language="javascript">
                  {({ tokens, getLineProps, getTokenProps }) => (
                    <div className="rounded-lg border border-accent-100/40 bg-background-200 p-6 h-full overflow-auto">
                      <pre className="text-base md:text-base font-mono whitespace-pre leading-relaxed">
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    </div>
                  )}
                </Highlight>
              </div>

              {/* Features + diagram */}
              <div className="w-full md:w-64 flex flex-col gap-2">
                <div className="rounded-lg border border-compute-100/30 bg-compute-100/5 p-2">
                  <img
                    src="/workers-diagram.png"
                    alt="V8 isolates — many lightweight sandboxes sharing a single process"
                    className="w-full rounded"
                  />
                </div>
                {features.map((f) => (
                  <div
                    key={f.label}
                    className={`rounded border border-${f.color}-100/30 bg-${f.color}-100/5 px-5 py-2`}
                  >
                    <p className={`text-base font-medium text-${f.color}-100`}>{f.label}</p>
                    <p className="text-base text-foreground-200">{f.detail}</p>
                  </div>
                ))}
              </div>

            </div>


          </div>

          {/* ===== BACK FACE ===== */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 z-20 flex flex-col items-center gap-8 w-full scale-[0.85] md:scale-100 origin-top"
          >
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-foreground-100">
                  Try it — Dynamic <span className="text-accent-100">Worker</span>
                </h2>
              </div>
              <button
                onClick={() => setFlipped(false)}
                className="shrink-0 px-5 py-1.5 rounded border border-border-100 bg-background-200 text-foreground-200 hover:text-foreground-100 text-base font-mono transition-colors"
              >
                ← back
              </button>
            </div>

            {/* Controls bar: templates + globalOutbound toggle */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-base text-foreground-200">Templates:</span>
                {templates.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => { setCode(t.code); setOutput(null) }}
                    className={`px-2.5 py-1 rounded text-base font-mono transition-colors ${
                      code === t.code
                        ? "bg-accent-100/20 text-accent-100 border border-accent-100/40"
                        : "bg-background-200 text-foreground-200 border border-border-100 hover:text-foreground-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNodeCompat(!nodeCompat)}
                  className={`flex items-center gap-2 px-4 py-1 rounded text-sm font-mono transition-colors border ${
                    nodeCompat
                      ? "border-compute-100/40 bg-compute-100/10 text-compute-100"
                      : "border-accent-100/40 bg-accent-100/10 text-accent-100"
                  }`}
                >
                  <span className={`inline-block size-2 rounded-full ${nodeCompat ? "bg-compute-100" : "bg-accent-100"}`} />
                  nodejs_compat: {nodeCompat ? "on" : "off"}
                </button>
                <button
                  onClick={() => setNetworkBlocked(!networkBlocked)}
                  className={`flex items-center gap-2 px-4 py-1 rounded text-sm font-mono transition-colors border ${
                    networkBlocked
                      ? "border-accent-100/40 bg-accent-100/10 text-accent-100"
                      : "border-compute-100/40 bg-compute-100/10 text-compute-100"
                  }`}
                >
                  <span className={`inline-block size-2 rounded-full ${networkBlocked ? "bg-accent-100" : "bg-compute-100"}`} />
                  globalOutbound: {networkBlocked ? "null" : "default"}
                </button>
              </div>
            </div>

            {/* Editor + Output */}
            <div className="flex flex-col md:flex-row gap-8 w-full flex-1 min-h-0">
              {/* Code editor */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-mono text-foreground-200">code.js</span>
                  <button
                    onClick={runCode}
                    disabled={running}
                    className="px-4 py-1.5 rounded bg-accent-100 text-white text-base font-medium hover:bg-accent-100/90 disabled:opacity-50 transition-colors"
                  >
                    {running ? "Running..." : "▶ Run"}
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 min-h-[200px] rounded-lg border border-accent-100/40 bg-background-300 p-6 font-mono text-base text-foreground-100 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-accent-100"
                />
              </div>

              {/* Output */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center h-[36px]">
                  <span className="text-base font-mono text-foreground-200">output</span>
                </div>
                <div className="flex-1 min-h-[200px] rounded-lg border border-accent-100/40 bg-background-200 p-6 overflow-auto">
                  {output ? (
                    <pre className="font-mono text-base text-foreground-100 whitespace-pre-wrap leading-relaxed">
                      {output}
                    </pre>
                  ) : (
                    <p className="text-base text-foreground-200/50 italic">
                      Click "Run" to execute in a sandboxed V8 isolate...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SlideContainer>
  )
}
