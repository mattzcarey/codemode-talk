import { SlideContainer } from "@/components"

const approaches = [
  {
    number: "1",
    title: "CLI / Bash",
    subtitle: "Let the agent explore",
    description: "Self-discoverable, documented by design. --help is built in.",
    color: "compute",
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Tool Search",
    subtitle: "Let the agent find",
    description: "BM25 / semantic search over tool descriptions. Load on demand.",
    color: "ai",
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Code Mode",
    subtitle: "Let the agent code",
    description: "Write code against a typed SDK. The SDK is the documentation.",
    color: "accent",
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
]

export function ProgressiveDisclosureSlide() {
  return (
    <SlideContainer>
      <div className="flex flex-col items-center gap-8 max-w-4xl">
        <div className="text-center">
          <h2 className="text-foreground-100">Progressive Disclosure</h2>
          <p className="text-foreground-200 mt-2">
            Don't show everything at once
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {approaches.map((a) => {
            const borderColor = `border-${a.color}-100`
            const bgColor = `bg-${a.color}-100/10`
            const textColor = `text-${a.color}-100`
            return (
              <div
                key={a.title}
                className={`flex-1 rounded-lg border ${borderColor} ${bgColor} p-5 flex flex-col gap-3`}
              >
                <div className={`${textColor}`}>{a.icon}</div>
                <div>
                  <p className={`text-lg font-medium ${textColor}`}>{a.title}</p>
                  <p className="text-xs text-foreground-200 italic">{a.subtitle}</p>
                </div>
                <p className="text-sm text-foreground-200">{a.description}</p>
              </div>
            )
          })}
        </div>

        <p className="text-sm text-foreground-200 text-center max-w-lg">
          Tools should be discovered on demand, not dumped into context
        </p>
      </div>
    </SlideContainer>
  )
}
