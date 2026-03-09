import { SlideContainer } from "@/components"

const rows = [
  {
    approach: "CLI / Bash",
    who: "OpenClaw, various agents",
    status: "Adopted",
    adopted: true,
    color: "compute",
  },
  {
    approach: "Tool Search",
    who: "Claude Code, Cursor",
    status: "Adopted",
    adopted: true,
    color: "ai",
  },
  {
    approach: "Code Mode",
    who: "...nobody?",
    status: "Missing",
    adopted: false,
    color: "accent",
  },
]

export function AdoptionSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-8 max-w-3xl">
        <h2 className="text-center text-foreground-100">So Where Are We?</h2>

        {/* Table */}
        <div className="w-full rounded-lg border border-border-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 px-6 py-3 bg-background-200 border-b border-border-100">
            <p className="text-xs font-medium text-foreground-200">APPROACH</p>
            <p className="text-xs font-medium text-foreground-200">WHO'S DOING IT</p>
            <p className="text-xs font-medium text-foreground-200 text-right">STATUS</p>
          </div>
          {/* Rows */}
          {rows.map((r) => (
            <div
              key={r.approach}
              className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border-100 last:border-b-0"
            >
              <p className={`text-sm font-medium text-${r.color}-100`}>{r.approach}</p>
              <p className="text-sm text-foreground-200">{r.who}</p>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    r.adopted
                      ? "bg-ai-100/10 text-ai-100 border border-ai-100/30"
                      : "bg-accent-100/10 text-accent-100 border border-accent-100/30"
                  }`}
                >
                  {r.adopted ? "+" : "x"} {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Blocker */}
        <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-6 py-4 w-full">
          <p className="text-center text-foreground-100">
            The blocker: executing someone else's{" "}
            <span className="font-medium text-accent-100">untrusted code</span>{" "}
            is scary
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
