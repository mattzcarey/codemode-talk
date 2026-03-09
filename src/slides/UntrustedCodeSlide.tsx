import { SlideContainer } from "@/components"

const scary = [
  { icon: "FS", text: "Read the filesystem", detail: "Exfiltrate secrets, config, keys" },
  { icon: "NET", text: "Make network requests", detail: "Send data to external servers" },
  { icon: "CPU", text: "Run infinite loops", detail: "Consume all resources, crash host" },
  { icon: "MEM", text: "Eat all memory", detail: "OOM kill the process" },
]

const historical = [
  { name: "DSLs", desc: "Restrict what users can express", verdict: "Limited" },
  { name: "Docker", desc: "Isolate in containers", verdict: "Slow (seconds to start)" },
  { name: "VMs", desc: "Strong isolation", verdict: "Heavy & expensive" },
  { name: "Code review", desc: "Human verification", verdict: "Doesn't scale" },
]

export function UntrustedCodeSlide() {
  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-6 max-w-4xl scale-[0.9] md:scale-100 origin-top">
        <h2 className="text-center text-foreground-100">Untrusted Code is <span className="text-accent-100">Scary</span></h2>

        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Left: what can go wrong */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-xs font-medium text-accent-100">WHAT CAN GO WRONG</p>
            {scary.map((s) => (
              <div
                key={s.text}
                className="flex items-center gap-3 rounded-lg border border-accent-100/30 bg-accent-100/5 px-4 py-3"
              >
                <div className="size-8 rounded border border-accent-100/50 bg-accent-100/10 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-mono font-medium text-accent-100">{s.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-100">{s.text}</p>
                  <p className="text-xs text-foreground-200">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: historical solutions */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-xs font-medium text-foreground-200">WHAT PEOPLE TRIED</p>
            {historical.map((h) => (
              <div
                key={h.name}
                className="flex items-center gap-3 rounded-lg border border-border-100 bg-background-200 px-4 py-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground-100">{h.name}</p>
                  <p className="text-xs text-foreground-200">{h.desc}</p>
                </div>
                <span className="text-[12px] font-mono text-foreground-200/60 shrink-0">
                  {h.verdict}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 w-full">
          <div className="rounded-lg border border-border-100 bg-background-200 px-6 py-3">
            <p className="text-center text-sm text-foreground-200">
              You want the expressiveness of a <span className="text-accent-100 font-medium">real language</span>{" "}
              with the safety of a <span className="text-compute-100 font-medium">sandbox</span>
            </p>
          </div>
        </div>
      </div>
    </SlideContainer>
  )
}
