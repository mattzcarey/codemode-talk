import { type ConnectionState, SandboxAddon } from "@cloudflare/sandbox/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { WebLinksAddon } from "@xterm/addon-web-links"
import { Terminal as XTerm } from "@xterm/xterm"
import { useEffect, useRef, useState } from "react"

import "@xterm/xterm/css/xterm.css"

interface TerminalProps {
  sandboxId: string
  sessionId: string
  className?: string
}

export function Terminal({ sandboxId, sessionId, className = "" }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<ConnectionState>("disconnected")

  useEffect(() => {
    if (!containerRef.current) return

    const terminal = new XTerm({
      cursorBlink: true,
      fontFamily: '"Apercu Mono Pro", "JetBrains Mono", "Fira Code", monospace',
      fontSize: 13,
      lineHeight: 1.3,
      theme: {
        background: "#0a0a0a",
        foreground: "#fafafa",
        cursor: "#ff4801",
        cursorAccent: "#0a0a0a",
        selectionBackground: "#ff480140",
        black: "#0a0a0a",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        blue: "#0a95ff",
        magenta: "#9616ff",
        cyan: "#06b6d4",
        white: "#fafafa",
        brightBlack: "#71717a",
        brightRed: "#f87171",
        brightGreen: "#4ade80",
        brightYellow: "#facc15",
        brightBlue: "#60a5fa",
        brightMagenta: "#c084fc",
        brightCyan: "#22d3ee",
        brightWhite: "#ffffff",
      },
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    const sandboxAddon = new SandboxAddon({
      getWebSocketUrl: ({ origin, sessionId: sid }) =>
        `${origin}/ws/terminal/${sid}`,
      onStateChange: (newState) => setState(newState),
    })

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)
    terminal.loadAddon(sandboxAddon)
    terminal.open(containerRef.current)
    fitAddon.fit()

    sandboxAddon.connect({ sandboxId, sessionId })

    const handleResize = () => fitAddon.fit()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      terminal.dispose()
    }
  }, [sandboxId, sessionId])

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      {state !== "connected" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/90 rounded-lg">
          <div className="flex items-center gap-3 text-foreground-200">
            {state === "connecting" ? (
              <>
                <svg
                  className="size-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm">Connecting to sandbox...</span>
              </>
            ) : (
              <span className="text-sm">Disconnected</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
