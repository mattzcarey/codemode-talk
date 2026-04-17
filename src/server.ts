import { routeAgentRequest, callable } from "agents";
import { AIChatAgent, type OnChatMessageOptions } from "@cloudflare/ai-chat";
import { getSandbox } from "@cloudflare/sandbox";
import {
  streamText,
  stepCountIs,
  convertToModelMessages,
  pruneMessages,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export { Sandbox } from "@cloudflare/sandbox";

// ── Cloudflare API Agent (MCP client for mcp.cloudflare.com) ─────────

export class CloudflareApi extends AIChatAgent<Env> {
  async onStart() {
    this.mcp.configureOAuthCallback({
      customHandler: (result) => {
        if (result.authSuccess) {
          return new Response("<script>window.close();</script>", {
            headers: { "content-type": "text/html" },
          });
        }
        return new Response(
          `Authentication Failed: ${result.authError || "Unknown error"}`,
          { headers: { "content-type": "text/plain" }, status: 400 }
        );
      },
    });
  }

  async connectServer() {
    const existing = this.mcp.listServers().find((s) => s.name === "cloudflare");
    if (existing) return { id: existing.id, state: "ready" };
    const result = await this.addMcpServer(
      "cloudflare",
      "https://mcp.cloudflare.com/mcp",
      { callbackHost: this.env.HOST }
    );
    return result;
  }

  async onChatMessage(_onFinish: unknown, options?: OnChatMessageOptions) {
    const mcpTools = this.mcp.getAITools();
    const openai = createOpenAI({ apiKey: this.env.OPENAI_API_KEY });

    const result = streamText({
      abortSignal: options?.abortSignal,
      model: openai("gpt-5.4"),
      system:
        "You are a Cloudflare assistant with access to the Cloudflare API via MCP tools. " +
        "Use the provided tools to answer questions about the user's Cloudflare account. ",
      messages: pruneMessages({
        messages: await convertToModelMessages(this.messages),
        toolCalls: "before-last-2-messages",
        reasoning: "before-last-message",
      }),
      tools: mcpTools,
      stopWhen: stepCountIs(10),
    });

    return result.toUIMessageStreamResponse();
  }
}

callable()(
  CloudflareApi.prototype.connectServer,
  { kind: "method", name: "connectServer" } as ClassMethodDecoratorContext
);

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Mock codemode execute for the Code Mode SDK slide
    if (url.pathname === "/api/codemode-execute" && request.method === "POST") {
      const { code } = (await request.json()) as { code: string };
      const logs: string[] = [];

      // Parse codemode.* calls from the code to build a realistic mock
      const calls = code.match(/codemode\.(\w+)/g) ?? [];
      const calledFns = calls.map((c) => c.replace("codemode.", ""));

      const mocks: Record<string, unknown> = {
        listWorkers: [
          { name: "codemode-talk", modified_on: "2026-04-09T10:00:00Z" },
          { name: "agents-mcp", modified_on: "2026-04-08T14:30:00Z" },
          { name: "pm-saas", modified_on: "2026-04-07T09:15:00Z" },
        ],
        deployWorker: { id: "w-" + crypto.randomUUID().slice(0, 8), name: "hello-world-" + Math.random().toString(36).slice(2, 8), etag: "v1" },
        createAccessApp: { id: "app-" + crypto.randomUUID().slice(0, 8), name: "hello-world-demo", domain: "hello-world-demo.mattzcarey.workers.dev" },
        createAccessPolicy: { id: "pol-" + crypto.randomUUID().slice(0, 8), decision: "allow" },
        listZones: [{ id: "z-abc123", name: "mattzcarey.com", status: "active" }],
        listDnsRecords: [
          { id: "r1", type: "A", name: "mattzcarey.com", content: "192.0.2.1", proxied: true },
          { id: "r2", type: "CNAME", name: "www", content: "mattzcarey.com", proxied: true },
        ],
        purgeCache: { id: "purge-" + crypto.randomUUID().slice(0, 8), success: true },
      };

      // Build a result that looks like the code ran
      let result: unknown;
      if (calledFns.length === 1 && calledFns[0] in mocks) {
        const raw = mocks[calledFns[0]];
        if (Array.isArray(raw) && code.includes(".slice(0, 3)")) {
          result = (raw as unknown[]).slice(0, 3).map((w: unknown) => {
            const worker = w as Record<string, unknown>;
            return { name: worker.name, modified: worker.modified_on };
          });
        } else {
          result = raw;
        }
      } else {
        // Multi-call: return a composite
        const composite: Record<string, unknown> = {};
        for (const fn of calledFns) {
          if (fn in mocks) composite[fn] = mocks[fn];
        }
        if (code.includes("deployed")) {
          composite.deployed = "hello-world-" + Math.random().toString(36).slice(2, 8);
          composite.url = composite.deployed + ".mattzcarey.workers.dev";
        }
        if (code.includes("access")) {
          composite.access = "matt-only";
        }
        if (code.includes("toISOString")) {
          composite.at = new Date().toISOString();
        }
        result = composite;
      }

      for (const fn of calledFns) logs.push(`codemode.${fn}() → ok`);
      return Response.json({ result, logs });
    }

    // Execute raw code in a V8 isolate (dynamic-workers slide)
    if (url.pathname === "/api/execute" && request.method === "POST") {
      try {
        const { code, globalOutbound, nodeCompat } = (await request.json()) as {
          code: string;
          globalOutbound?: string | null;
          nodeCompat?: boolean;
        };
        const allowOutbound = globalOutbound === "default";

        const wrappedCode = `async () => { ${code} }`;
        const module = [
          'import { WorkerEntrypoint } from "cloudflare:workers";',
          "export default class Exec extends WorkerEntrypoint {",
          "  async evaluate() {",
          "    const __logs = [];",
          '    console.log = (...a) => { __logs.push(a.map(String).join(" ")); };',
          '    console.warn = (...a) => { __logs.push("[warn] " + a.map(String).join(" ")); };',
          '    console.error = (...a) => { __logs.push("[error] " + a.map(String).join(" ")); };',
          "    try {",
          "      const result = await Promise.race([",
          `        (${wrappedCode})(),`,
          "        new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), 30000))",
          "      ]);",
          "      return { result, logs: __logs };",
          "    } catch (err) {",
          "      return { result: undefined, error: err.message, logs: __logs };",
          "    }",
          "  }",
          "}",
        ].join("\n");

        const config: Record<string, unknown> = {
          compatibilityDate: "2025-06-01",
          compatibilityFlags: nodeCompat !== false ? ["nodejs_compat"] : [],
          mainModule: "executor.js",
          modules: { "executor.js": module },
        };
        if (!allowOutbound) {
          config.globalOutbound = null;
        }

        const worker = env.LOADER.get(
          `exec-${crypto.randomUUID()}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          () => config as any
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (worker.getEntrypoint() as any).evaluate() as {
          result?: unknown;
          error?: string;
          logs?: string[];
        };
        return Response.json(result);
      } catch (err) {
        return Response.json(
          { ok: false, error: err instanceof Error ? err.message : "Execution failed" },
          { status: 500 }
        );
      }
    }

    // Terminal WebSocket connections for sandbox
    if (url.pathname.startsWith("/ws/terminal/")) {
      const sessionId = url.pathname.split("/")[3];
      if (!sessionId) {
        return new Response("Session ID required", { status: 400 });
      }
      try {
        const sandbox = getSandbox(env.Sandbox, "sandbox-v7");
        const session = await sandbox.getSession(sessionId);
        return await session.terminal(request);
      } catch (err) {
        console.error("Terminal connection error:", err);
        return new Response(
          `Terminal error: ${err instanceof Error ? err.message : "Unknown error"}`,
          { status: 500 }
        );
      }
    }

    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
