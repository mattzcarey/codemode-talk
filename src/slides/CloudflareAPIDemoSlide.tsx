import { SlideContainer } from "@/components"
import { useAgent } from "agents/react"
import { useAgentChat } from "@cloudflare/ai-chat/react"
import { useState, useRef, useEffect, useCallback } from "react"
import { isToolUIPart } from "ai"
import { Streamdown } from "streamdown"
import type { MCPServersState } from "agents"

interface ToolPart {
  type: string
  toolName?: string
  toolCallId?: string
  state?: string
  errorText?: string
  input?: Record<string, unknown>
  output?: unknown
}

function ToolCard({ toolPart }: { toolPart: ToolPart }) {
  const [expanded, setExpanded] = useState(false)
  const hasError = toolPart.state === "output-error" || !!toolPart.errorText
  const isComplete = toolPart.state === "output-available"
  const isRunning = !isComplete && !hasError

  const rawName = toolPart.toolName || ""
  const toolNameMatch = rawName.match(/^tool_[a-zA-Z0-9]+_(.+)$/)
  const label = toolNameMatch ? toolNameMatch[1] : rawName || "tool"

  const inputStr = toolPart.input
    ? JSON.stringify(toolPart.input, null, 2)
    : undefined
  const outputStr = toolPart.output
    ? (typeof toolPart.output === "string" ? toolPart.output : JSON.stringify(toolPart.output, null, 2))
    : undefined

  return (
    <div className={`rounded border overflow-hidden mt-1 ${hasError ? "border-accent-100/40" : "border-compute-100/30 bg-compute-100/5"}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-2 py-1 text-[12px] font-mono hover:bg-compute-100/10 transition-colors"
      >
        <span className="text-compute-100">{expanded ? "▾" : "▸"}</span>
        <span className="text-foreground-200">{label}</span>
        <span className="ml-auto">
          {hasError ? (
            <span className="text-accent-100">error</span>
          ) : isRunning ? (
            <span className="text-compute-100 animate-pulse">running...</span>
          ) : (
            <span className="text-compute-100">done</span>
          )}
        </span>
      </button>
      {expanded && (
        <div className="border-t border-compute-100/20 p-2 space-y-1 text-[12px] font-mono">
          {inputStr && (
            <pre className="text-foreground-200 whitespace-pre-wrap break-all max-h-32 overflow-auto">{inputStr}</pre>
          )}
          {outputStr !== undefined && (
            <pre className="text-foreground-100 whitespace-pre-wrap break-all max-h-48 overflow-auto">{outputStr}</pre>
          )}
          {toolPart.errorText && (
            <pre className="text-accent-100 whitespace-pre-wrap break-all">{toolPart.errorText}</pre>
          )}
        </div>
      )}
    </div>
  )
}

const SESSION_KEY = "cf-mcp-session"

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function CloudflareAPIDemoSlide() {
  const [sessionId, setSessionId] = useState(getOrCreateSessionId)

  const reset = useCallback(() => {
    const id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
    setSessionId(id)
  }, [])

  return (
    <SlideContainer showDots={false}>
      <CloudflareAPIChat key={sessionId} sessionId={sessionId} onReset={reset} />
    </SlideContainer>
  )
}

function CloudflareAPIChat({ sessionId, onReset }: { sessionId: string; onReset: () => void }) {
  const [input, setInput] = useState("")
  const [mcpState, setMcpState] = useState<MCPServersState>({
    prompts: [],
    resources: [],
    servers: {},
    tools: [],
  })
  const [connectError, setConnectError] = useState<string | null>(null)
  const pendingMessageRef = useRef<string | null>(null)
  const openedAuthRef = useRef<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const agent = useAgent({
    agent: "cloudflare-api",
    name: sessionId,
    onMcpUpdate: useCallback((state: MCPServersState) => setMcpState(state), []),
  })

  const { messages, sendMessage, stop, status } = useAgentChat({ agent })

  const isStreaming = status === "streaming"
  const servers = Object.entries(mcpState.servers)
  const hasServers = servers.length > 0
  const authenticatingServer = servers.find(([, s]) => s.state === "authenticating" && s.auth_url)
  const isAuthenticating = !!authenticatingServer
  const isReady = hasServers && servers.every(([, s]) => s.state === "ready")
  const isConnecting = hasServers && !isReady && !isAuthenticating
  const toolCount = mcpState.tools.length

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Open OAuth popup when auth is needed
  useEffect(() => {
    if (!authenticatingServer) return
    const [serverId, server] = authenticatingServer
    const authUrl = server.auth_url!
    if (openedAuthRef.current[serverId] === authUrl) return
    openedAuthRef.current[serverId] = authUrl
    window.open(authUrl, "oauth", "width=600,height=800,noopener,noreferrer")
  }, [authenticatingServer])

  // When MCP becomes ready, send pending message
  useEffect(() => {
    if (isReady && pendingMessageRef.current) {
      const text = pendingMessageRef.current
      pendingMessageRef.current = null
      sendMessage({ role: "user", parts: [{ type: "text", text }] })
    }
  }, [isReady, sendMessage])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    setInput("")

    if (isReady) {
      sendMessage({ role: "user", parts: [{ type: "text", text }] })
      return
    }

    // Not ready — store message and kick off connection
    pendingMessageRef.current = text
    setConnectError(null)
    try {
      await agent.call("connectServer")
    } catch (e) {
      console.error("Failed to connect MCP server:", e)
      setConnectError(String(e))
      pendingMessageRef.current = null
      setInput(text)
    }
  }, [input, isReady, agent, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation()
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        send()
      }
    },
    [send]
  )

  const hasPending = pendingMessageRef.current !== null

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-4xl h-full max-h-[80vh]">
      <div className="text-center shrink-0">
        <h2 className="text-foreground-100">
          <span className="text-accent-100">Cloudflare</span> MCP
        </h2>
        <p className="text-foreground-200 text-sm mt-1">
          Real Cloudflare API via remote MCP server
        </p>
      </div>

      <div className="w-full flex-1 min-h-0 rounded-lg border border-border-100 bg-background-200 overflow-hidden flex flex-col">
        {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-100 shrink-0">
            <div className={`size-2 rounded-full ${
              isReady ? "bg-ai-100" : isConnecting || hasPending ? "bg-media-100" : connectError ? "bg-accent-100" : "bg-foreground-200/30"
            }`} />
            <span className="text-xs font-medium text-foreground-100">cloudflare</span>
            {isAuthenticating && (
              <span className="text-[12px] text-media-100 animate-pulse">waiting for auth...</span>
            )}
            {isConnecting && !isAuthenticating && (
              <span className="text-[12px] text-foreground-200 animate-pulse">connecting...</span>
            )}
            {isReady && toolCount > 0 && (
              <span className="text-[12px] text-foreground-200">{toolCount} tools</span>
            )}
            {connectError && (
              <span className="text-[12px] text-accent-100">connection failed</span>
            )}
            <span className="text-[12px] text-media-100 font-mono ml-auto">MCP client</span>
            <button
              onClick={onReset}
              className="text-[12px] text-foreground-200/50 hover:text-accent-100 transition-colors font-mono"
            >
              reset
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.length === 0 && !hasPending && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <p className="text-sm text-foreground-200/30">Try the Cloudflare MCP server</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["What's the traffic today?", "List my Workers", "Create a hello world Worker"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-[12px] px-3 py-1.5 rounded-full border border-border-100 text-foreground-200 hover:border-accent-100/50 hover:text-foreground-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasPending && messages.length === 0 && (
              <>
                <div className="flex justify-end">
                  <div className="rounded-lg px-3 py-2 max-w-[85%] bg-accent-100/10 border border-accent-100/30 opacity-60">
                    <p className="text-xs text-foreground-100">{pendingMessageRef.current}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <span className="text-xs text-foreground-200/50 animate-pulse">
                    {isAuthenticating ? "Waiting for authentication..." : "Connecting to mcp.cloudflare.com..."}
                  </span>
                </div>
              </>
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
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="border-t border-border-100 px-4 py-3 shrink-0"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Cloudflare anything..."
                disabled={hasPending}
                className="flex-1 rounded-lg border border-border-100 bg-background-100 px-3 py-2 text-sm text-foreground-100 placeholder:text-foreground-200/50 focus:outline-none focus:border-ai-100 disabled:opacity-50"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="rounded-lg bg-accent-100/20 px-4 py-2 text-sm font-medium text-accent-100 hover:bg-accent-100/30 transition-colors"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() || hasPending}
                  className="rounded-lg bg-accent-100 px-4 py-2 text-sm font-medium text-white hover:bg-accent-100/90 disabled:opacity-40 transition-colors"
                >
                  Send
                </button>
              )}
            </div>
          </form>
        </div>

      {/* Bottom note */}
      <div className="flex gap-6 text-[13px] text-foreground-200 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-ai-100">mcp.cloudflare.com/mcp</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-media-100">OAuth</span> · MCP client
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-compute-100">2,500+</span> endpoints
        </div>
      </div>
    </div>
  )
}
