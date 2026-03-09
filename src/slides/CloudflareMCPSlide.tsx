import { SlideContainer } from "@/components"
import { useAgent } from "agents/react"
import { useAgentChat } from "@cloudflare/ai-chat/react"
import { useState, useRef, useEffect, useCallback } from "react"
import { isToolUIPart } from "ai"
import { Streamdown } from "streamdown"

interface ToolPart {
  type: string
  toolName?: string
  toolCallId?: string
  state?: string
  errorText?: string
  input?: Record<string, unknown>
  output?: {
    code?: string
    result?: unknown
    logs?: string[]
    [key: string]: unknown
  }
}

function extractFunctionCalls(code?: string): string[] {
  if (!code) return []
  const matches = code.match(/codemode\.(\w+)/g)
  if (!matches) return []
  return [...new Set(matches.map((m) => m.replace("codemode.", "")))]
}

function getToolName(part: ToolPart): string {
  if (part.toolName) return part.toolName
  // Static tool parts have type "tool-<name>"
  if (part.type.startsWith("tool-")) return part.type.replace("tool-", "")
  return "tool"
}

function ToolCard({ toolPart }: { toolPart: ToolPart }) {
  const [expanded, setExpanded] = useState(false)
  const fnCalls = extractFunctionCalls(toolPart.output?.code)
  const isRunning = toolPart.state === "input-streaming" || toolPart.state === "input-available"
  const isDone = toolPart.state === "output-available"
  const hasError = toolPart.state === "output-error" || !!toolPart.errorText
  const name = getToolName(toolPart)

  return (
    <div className="rounded border border-ai-100/30 bg-ai-100/5 text-[12px] font-mono overflow-hidden mt-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-2 py-1 hover:bg-ai-100/10 transition-colors"
      >
        <span className="text-ai-100">{expanded ? "▾" : "▸"}</span>
        <span className="text-foreground-200">{name}</span>
        {fnCalls.length > 0 && (
          <span className="text-foreground-200/50 ml-1">
            ({fnCalls.join(", ")})
          </span>
        )}
        <span className="ml-auto">
          {hasError ? (
            <span className="text-accent-100">error</span>
          ) : isRunning ? (
            <span className="text-compute-100 animate-pulse">running...</span>
          ) : isDone ? (
            <span className="text-ai-100">done</span>
          ) : (
            <span className="text-foreground-200/50">{toolPart.state ?? "pending"}</span>
          )}
        </span>
      </button>
      {expanded && (
        <div className="border-t border-ai-100/20 p-2 space-y-1">
          {toolPart.output?.code && (
            <pre className="text-foreground-200 whitespace-pre-wrap break-all">{toolPart.output.code}</pre>
          )}
          {toolPart.output?.result !== undefined && (
            <pre className="text-ai-100/70 whitespace-pre-wrap break-all">
              {typeof toolPart.output.result === "string"
                ? toolPart.output.result
                : JSON.stringify(toolPart.output.result, null, 2)}
            </pre>
          )}
          {toolPart.output?.logs && toolPart.output.logs.length > 0 && (
            <pre className="text-foreground-200/50 whitespace-pre-wrap break-all">
              {toolPart.output.logs.join("\n")}
            </pre>
          )}
          {toolPart.errorText && (
            <pre className="text-accent-100 whitespace-pre-wrap break-all">
              {toolPart.errorText}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

export function CloudflareMCPSlide() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const agent = useAgent({
    agent: "codemode-talk",
  })

  const { messages, sendMessage, clearHistory, status } = useAgentChat({
    agent,
  })

  const isStreaming = status === "streaming"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = useCallback(() => {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput("")
    sendMessage({ role: "user", parts: [{ type: "text", text }] })
  }, [input, isStreaming, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Stop arrow keys from navigating slides
      e.stopPropagation()
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        send()
      }
    },
    [send]
  )

  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-3 w-full max-w-4xl h-full max-h-[80vh]">
        <div className="text-center shrink-0">
          <h2 className="text-foreground-100">
            <span className="text-accent-100">Code Mode</span> Demo
          </h2>
          <p className="text-foreground-200 text-sm mt-1">
            Live agent with PM tools — search + execute via Dynamic Worker Loaders
          </p>
        </div>

        {/* Live chat */}
        <div className="w-full flex-1 min-h-0 rounded-lg border border-border-100 bg-background-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-100 shrink-0">
            <div className={`size-2 rounded-full ${status === "error" ? "bg-accent-100" : "bg-ai-100"}`} />
            <span className="text-xs font-medium text-foreground-100">Project Management Agent</span>
            <span className="text-[12px] text-foreground-200 font-mono ml-auto">
              code mode enabled
            </span>
            {messages.length > 0 && (
              <button
                onClick={() => clearHistory()}
                className="text-[12px] text-foreground-200/50 hover:text-accent-100 transition-colors font-mono"
              >
                clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-foreground-200/30">
                <p className="text-sm">Ask anything about your projects</p>
                <p className="text-xs mt-1">Try "Create a project called Demo" or "List all tasks"</p>
              </div>
            )}
            {messages.map((message) => {
              const isUser = message.role === "user"

              if (isUser) {
                const text = message.parts
                  ?.filter((p) => p.type === "text")
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("") ?? ""

                return (
                  <div key={message.id} className="flex justify-end">
                    <div className="rounded-lg px-3 py-2 max-w-[85%] bg-accent-100/10 border border-accent-100/30">
                      <p className="text-xs text-foreground-100 whitespace-pre-wrap">{text}</p>
                    </div>
                  </div>
                )
              }

              return (
                <div key={message.id} className="space-y-1">
                  {message.parts?.map((part, i) => {
                    if (part.type === "text" && part.text) {
                      return (
                        <div key={i} className="flex justify-start">
                          <div className="rounded-lg px-3 py-2 max-w-[85%] bg-background-100 border border-border-100">
                            <Streamdown className="sd-theme text-xs text-foreground-100" controls={false}>
                              {part.text}
                            </Streamdown>
                          </div>
                        </div>
                      )
                    }
                    if (isToolUIPart(part)) {
                      const toolPart = part as unknown as ToolPart
                      return (
                        <div key={toolPart.toolCallId ?? i} className="max-w-[85%]">
                          <ToolCard toolPart={toolPart} />
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              )
            })}
            {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-background-100 border border-border-100 px-3 py-2">
                  <span className="text-xs text-foreground-200/50 animate-pulse">thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="border-t border-border-100 px-4 py-3 shrink-0"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your projects..."
                className="flex-1 rounded-lg border border-border-100 bg-background-100 px-3 py-2 text-sm text-foreground-100 placeholder:text-foreground-200/50 focus:outline-none focus:border-ai-100"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="rounded-lg bg-accent-100 px-4 py-2 text-sm font-medium text-white hover:bg-accent-100/90 disabled:opacity-40 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Bottom note */}
        <div className="flex gap-6 text-[13px] text-foreground-200 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-ai-100">2 tools</span> — search + execute
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-compute-100">20 endpoints</span> — projects, tasks, sprints, comments
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-accent-100">~1,000 tokens</span> — in context
          </div>
        </div>
      </div>
    </SlideContainer>
  )
}
