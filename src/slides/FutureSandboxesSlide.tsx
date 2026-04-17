import { SlideContainer } from "@/components"
import { lazy, Suspense, useState } from "react"

const Terminal = lazy(() =>
  import("@/components/Terminal").then((m) => ({ default: m.Terminal }))
)

const sandboxes = [
  {
    name: "Workerd",
    color: "accent",
    command: "workerd \"var a=0,b=1,r=[];for(var i=0;i<10;i++){r.push(a);var t=a;a=b;b=t+b;}console.log(JSON.stringify({fib:r,date:new Date().toISOString()}))\"",
  },
  {
    name: "Deno",
    color: "media",
    command: 'echo "const fib=(n:number):number=>n<=1?n:fib(n-1)+fib(n-2); console.log(JSON.stringify({fib: Array.from({length:10},(_,i)=>fib(i)), date: new Date().toISOString()}))" | deno run --check -',
  },
  {
    name: "Monty",
    color: "compute",
    command: "monty \"(lambda f: [f(f,i) for i in range(10)])(lambda s,n: n if n<=1 else s(s,n-1)+s(s,n-2))\"",
  },
]

export function FutureSandboxesSlide() {
  const [copied, setCopied] = useState<number | null>(null)

  const copy = (i: number) => {
    navigator.clipboard.writeText(sandboxes[i].command)
    setCopied(i)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col gap-4 w-full max-w-5xl h-full max-h-[80vh]">
        <div className="text-center shrink-0">
          <h2 className="text-foreground-100">
            Isolated Environments <span className="text-accent-100">Everywhere</span>
          </h2>
          <p className="text-foreground-200 mt-1">
            Not the sandboxes of days gone by
          </p>
        </div>

        {/* Template commands */}
        <div className="flex gap-2 shrink-0">
          {sandboxes.map((s, i) => (
            <button
              key={s.name}
              onClick={() => copy(i)}
              className={`px-3 py-1 rounded text-sm font-mono transition-colors border ${
                copied === i
                  ? `border-${s.color}-100 bg-${s.color}-100/20 text-${s.color}-100`
                  : `border-${s.color}-100/40 bg-${s.color}-100/5 text-${s.color}-100 hover:bg-${s.color}-100/10`
              }`}
            >
              {copied === i ? "copied!" : s.name}
            </button>
          ))}
        </div>

        {/* Terminal */}
        <div className="flex-1 min-h-0 rounded-lg border border-border-100 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-background-200 border-b border-border-100 shrink-0">
            <div className="size-3 rounded-full bg-accent-100" />
            <div className="size-3 rounded-full bg-border-100" />
            <div className="size-3 rounded-full bg-border-100" />
            <span className="ml-2 text-base text-foreground-200/60 font-mono">
              bash
            </span>
          </div>
          <Suspense
            fallback={
              <div className="h-full bg-background-100 flex items-center justify-center text-foreground-200 text-sm">
                Loading terminal...
              </div>
            }
          >
            <Terminal
              sandboxId="sandbox-v7"
              sessionId="sandboxes-demo"
              className="h-[calc(100%-36px)]"
            />
          </Suspense>
        </div>
      </div>
    </SlideContainer>
  )
}
