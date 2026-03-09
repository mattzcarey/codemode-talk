interface Env {
  DB: D1Database;
}

type Handler = (req: Request, env: Env, params: Record<string, string>) => Promise<Response>;

const routes: Array<{ method: string; pattern: RegExp; keys: string[]; handler: Handler }> = [];

function route(method: string, path: string, handler: Handler) {
  const keys: string[] = [];
  const pattern = new RegExp(
    "^" + path.replace(/:(\w+)/g, (_, k) => { keys.push(k); return "([^/]+)"; }) + "$"
  );
  routes.push({ method, pattern, keys, handler });
}

function match(method: string, pathname: string) {
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = pathname.match(r.pattern);
    if (!m) continue;
    const params: Record<string, string> = {};
    r.keys.forEach((k, i) => { params[k] = m[i + 1]; });
    return { handler: r.handler, params };
  }
  return null;
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Access-Control-Allow-Origin": "*" } });
}

function id() {
  return crypto.randomUUID();
}

// ─── Projects ────────────────────────────────────────────────────────────────

route("GET", "/api/projects", async (_req, env) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM projects ORDER BY created_at DESC"
  ).all();
  return json(results);
});

route("POST", "/api/projects", async (req, env) => {
  const body = await req.json<{ name: string; description?: string }>();
  if (!body.name) return json({ error: "name is required" }, 400);
  const project = { id: id(), name: body.name, description: body.description ?? "" };
  await env.DB.prepare(
    "INSERT INTO projects (id, name, description) VALUES (?, ?, ?)"
  ).bind(project.id, project.name, project.description).run();
  return json(project, 201);
});

route("GET", "/api/projects/:id", async (_req, env, params) => {
  const row = await env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(params.id).first();
  if (!row) return json({ error: "Project not found" }, 404);
  return json(row);
});

route("PATCH", "/api/projects/:id", async (req, env, params) => {
  const body = await req.json<{ name?: string; description?: string }>();
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (body.name !== undefined) { sets.push("name = ?"); vals.push(body.name); }
  if (body.description !== undefined) { sets.push("description = ?"); vals.push(body.description); }
  if (!sets.length) return json({ error: "Nothing to update" }, 400);
  vals.push(params.id);
  await env.DB.prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
  const row = await env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(params.id).first();
  if (!row) return json({ error: "Project not found" }, 404);
  return json(row);
});

route("DELETE", "/api/projects/:id", async (_req, env, params) => {
  // Cascade: delete comments on tasks, then tasks, then sprints, then project
  await env.DB.batch([
    env.DB.prepare("DELETE FROM comments WHERE task_id IN (SELECT id FROM tasks WHERE project_id = ?)").bind(params.id),
    env.DB.prepare("DELETE FROM tasks WHERE project_id = ?").bind(params.id),
    env.DB.prepare("DELETE FROM sprints WHERE project_id = ?").bind(params.id),
    env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(params.id),
  ]);
  return json({ deleted: params.id });
});

// ─── Sprints ─────────────────────────────────────────────────────────────────

route("GET", "/api/projects/:projectId/sprints", async (_req, env, params) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM sprints WHERE project_id = ? ORDER BY created_at DESC"
  ).bind(params.projectId).all();
  return json(results);
});

route("POST", "/api/projects/:projectId/sprints", async (req, env, params) => {
  const body = await req.json<{ name: string; startDate?: string; endDate?: string }>();
  if (!body.name) return json({ error: "name is required" }, 400);
  const sprint = {
    id: id(),
    project_id: params.projectId,
    name: body.name,
    start_date: body.startDate ?? null,
    end_date: body.endDate ?? null,
    status: "planned",
  };
  await env.DB.prepare(
    "INSERT INTO sprints (id, project_id, name, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(sprint.id, sprint.project_id, sprint.name, sprint.start_date, sprint.end_date, sprint.status).run();
  return json(sprint, 201);
});

route("GET", "/api/sprints/:id", async (_req, env, params) => {
  const row = await env.DB.prepare("SELECT * FROM sprints WHERE id = ?").bind(params.id).first();
  if (!row) return json({ error: "Sprint not found" }, 404);
  return json(row);
});

route("PATCH", "/api/sprints/:id", async (req, env, params) => {
  const body = await req.json<{ name?: string; startDate?: string; endDate?: string; status?: string }>();
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (body.name !== undefined) { sets.push("name = ?"); vals.push(body.name); }
  if (body.startDate !== undefined) { sets.push("start_date = ?"); vals.push(body.startDate); }
  if (body.endDate !== undefined) { sets.push("end_date = ?"); vals.push(body.endDate); }
  if (body.status !== undefined) { sets.push("status = ?"); vals.push(body.status); }
  if (!sets.length) return json({ error: "Nothing to update" }, 400);
  vals.push(params.id);
  await env.DB.prepare(`UPDATE sprints SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
  const row = await env.DB.prepare("SELECT * FROM sprints WHERE id = ?").bind(params.id).first();
  if (!row) return json({ error: "Sprint not found" }, 404);
  return json(row);
});

route("DELETE", "/api/sprints/:id", async (_req, env, params) => {
  // Unlink tasks from this sprint, then delete sprint
  await env.DB.batch([
    env.DB.prepare("UPDATE tasks SET sprint_id = NULL WHERE sprint_id = ?").bind(params.id),
    env.DB.prepare("DELETE FROM sprints WHERE id = ?").bind(params.id),
  ]);
  return json({ deleted: params.id });
});

// ─── Tasks ───────────────────────────────────────────────────────────────────

route("GET", "/api/projects/:projectId/tasks", async (req, env, params) => {
  const url = new URL(req.url);
  const where = ["project_id = ?"];
  const vals: unknown[] = [params.projectId];

  const status = url.searchParams.get("status");
  if (status) { where.push("status = ?"); vals.push(status); }
  const priority = url.searchParams.get("priority");
  if (priority) { where.push("priority = ?"); vals.push(priority); }
  const assignee = url.searchParams.get("assignee");
  if (assignee) { where.push("assignee = ?"); vals.push(assignee); }
  const sprintId = url.searchParams.get("sprint_id");
  if (sprintId) { where.push("sprint_id = ?"); vals.push(sprintId); }

  const { results } = await env.DB.prepare(
    `SELECT * FROM tasks WHERE ${where.join(" AND ")} ORDER BY created_at DESC`
  ).bind(...vals).all();
  return json(results);
});

route("GET", "/api/tasks", async (req, env) => {
  const url = new URL(req.url);
  const where: string[] = [];
  const vals: unknown[] = [];

  const status = url.searchParams.get("status");
  if (status) { where.push("status = ?"); vals.push(status); }
  const priority = url.searchParams.get("priority");
  if (priority) { where.push("priority = ?"); vals.push(priority); }
  const assignee = url.searchParams.get("assignee");
  if (assignee) { where.push("assignee = ?"); vals.push(assignee); }

  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const { results } = await env.DB.prepare(
    `SELECT * FROM tasks ${clause} ORDER BY created_at DESC`
  ).bind(...vals).all();
  return json(results);
});

route("POST", "/api/projects/:projectId/tasks", async (req, env, params) => {
  const body = await req.json<{
    title: string; description?: string; status?: string;
    priority?: string; assignee?: string; sprintId?: string;
  }>();
  if (!body.title) return json({ error: "title is required" }, 400);
  const task = {
    id: id(),
    project_id: params.projectId,
    title: body.title,
    description: body.description ?? "",
    status: body.status ?? "todo",
    priority: body.priority ?? "medium",
    assignee: body.assignee ?? "",
    sprint_id: body.sprintId ?? null,
  };
  await env.DB.prepare(
    `INSERT INTO tasks (id, project_id, title, description, status, priority, assignee, sprint_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(task.id, task.project_id, task.title, task.description, task.status, task.priority, task.assignee, task.sprint_id).run();
  return json(task, 201);
});

route("GET", "/api/tasks/:id", async (_req, env, params) => {
  const row = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(params.id).first();
  if (!row) return json({ error: "Task not found" }, 404);
  return json(row);
});

route("PATCH", "/api/tasks/:id", async (req, env, params) => {
  const body = await req.json<{
    title?: string; description?: string; status?: string;
    priority?: string; assignee?: string; sprintId?: string;
  }>();
  const sets: string[] = ["updated_at = datetime('now')"];
  const vals: unknown[] = [];
  if (body.title !== undefined) { sets.push("title = ?"); vals.push(body.title); }
  if (body.description !== undefined) { sets.push("description = ?"); vals.push(body.description); }
  if (body.status !== undefined) { sets.push("status = ?"); vals.push(body.status); }
  if (body.priority !== undefined) { sets.push("priority = ?"); vals.push(body.priority); }
  if (body.assignee !== undefined) { sets.push("assignee = ?"); vals.push(body.assignee); }
  if (body.sprintId !== undefined) { sets.push("sprint_id = ?"); vals.push(body.sprintId); }
  if (vals.length === 0) return json({ error: "Nothing to update" }, 400);
  vals.push(params.id);
  await env.DB.prepare(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
  const row = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(params.id).first();
  if (!row) return json({ error: "Task not found" }, 404);
  return json(row);
});

route("DELETE", "/api/tasks/:id", async (_req, env, params) => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM comments WHERE task_id = ?").bind(params.id),
    env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(params.id),
  ]);
  return json({ deleted: params.id });
});

// ─── Comments ────────────────────────────────────────────────────────────────

route("GET", "/api/tasks/:taskId/comments", async (_req, env, params) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM comments WHERE task_id = ? ORDER BY created_at ASC"
  ).bind(params.taskId).all();
  return json(results);
});

route("POST", "/api/tasks/:taskId/comments", async (req, env, params) => {
  const body = await req.json<{ content: string; author?: string }>();
  if (!body.content) return json({ error: "content is required" }, 400);
  const comment = {
    id: id(),
    task_id: params.taskId,
    author: body.author ?? "user",
    content: body.content,
  };
  await env.DB.prepare(
    "INSERT INTO comments (id, task_id, author, content) VALUES (?, ?, ?, ?)"
  ).bind(comment.id, comment.task_id, comment.author, comment.content).run();
  return json(comment, 201);
});

route("DELETE", "/api/comments/:id", async (_req, env, params) => {
  await env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(params.id).run();
  return json({ deleted: params.id });
});

// ─── Stats (for demo) ───────────────────────────────────────────────────────

route("GET", "/api/stats", async (_req, env) => {
  const [projects, tasks, sprints, comments] = await env.DB.batch([
    env.DB.prepare("SELECT COUNT(*) as count FROM projects"),
    env.DB.prepare("SELECT COUNT(*) as count FROM tasks"),
    env.DB.prepare("SELECT COUNT(*) as count FROM sprints"),
    env.DB.prepare("SELECT COUNT(*) as count FROM comments"),
  ]);
  return json({
    projects: (projects.results[0] as { count: number }).count,
    tasks: (tasks.results[0] as { count: number }).count,
    sprints: (sprints.results[0] as { count: number }).count,
    comments: (comments.results[0] as { count: number }).count,
  });
});

// ─── Router ──────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/" || url.pathname === "/health") {
      return json({ status: "ok", service: "pm-saas" });
    }

    const matched = match(request.method, url.pathname);
    if (matched) {
      try {
        return await matched.handler(request, env, matched.params);
      } catch (err) {
        console.error(err);
        return json({ error: err instanceof Error ? err.message : "Internal error" }, 500);
      }
    }

    return json({ error: "Not found" }, 404);
  },
} satisfies ExportedHandler<Env>;
