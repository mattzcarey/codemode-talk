import { tool } from "ai";
import { z } from "zod";

const API = "https://pm-saas.mattzcarey.workers.dev";

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  return res.json();
}

/** Build the PM tools that call the SaaS API over HTTP. */
export function createTools() {
  return {
    // ─── Projects ───
    listProjects: tool({
      description: "List all projects",
      inputSchema: z.object({}),
      execute: async () => api("/api/projects"),
    }),

    createProject: tool({
      description: "Create a new project",
      inputSchema: z.object({
        name: z.string().describe("Project name"),
        description: z.string().optional().describe("Project description"),
      }),
      execute: async ({ name, description }) =>
        api("/api/projects", {
          method: "POST",
          body: JSON.stringify({ name, description }),
        }),
    }),

    getProject: tool({
      description: "Get a single project by ID",
      inputSchema: z.object({ id: z.string().describe("Project ID") }),
      execute: async ({ id }) => api(`/api/projects/${id}`),
    }),

    updateProject: tool({
      description: "Update a project's name or description",
      inputSchema: z.object({
        id: z.string().describe("Project ID"),
        name: z.string().optional().describe("New name"),
        description: z.string().optional().describe("New description"),
      }),
      execute: async ({ id, ...body }) =>
        api(`/api/projects/${id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
    }),

    deleteProject: tool({
      description: "Delete a project and all its data",
      inputSchema: z.object({ id: z.string().describe("Project ID") }),
      execute: async ({ id }) =>
        api(`/api/projects/${id}`, { method: "DELETE" }),
    }),

    // ─── Sprints ───
    listSprints: tool({
      description: "List sprints for a project",
      inputSchema: z.object({
        projectId: z.string().describe("Project ID"),
      }),
      execute: async ({ projectId }) =>
        api(`/api/projects/${projectId}/sprints`),
    }),

    createSprint: tool({
      description: "Create a sprint for a project",
      inputSchema: z.object({
        projectId: z.string().describe("Project ID"),
        name: z.string().describe("Sprint name"),
        startDate: z.string().optional().describe("Start date (ISO 8601)"),
        endDate: z.string().optional().describe("End date (ISO 8601)"),
      }),
      execute: async ({ projectId, ...body }) =>
        api(`/api/projects/${projectId}/sprints`, {
          method: "POST",
          body: JSON.stringify(body),
        }),
    }),

    getSprint: tool({
      description: "Get a single sprint by ID",
      inputSchema: z.object({ id: z.string().describe("Sprint ID") }),
      execute: async ({ id }) => api(`/api/sprints/${id}`),
    }),

    updateSprint: tool({
      description: "Update a sprint's name, dates, or status",
      inputSchema: z.object({
        id: z.string().describe("Sprint ID"),
        name: z.string().optional().describe("New name"),
        startDate: z.string().optional().describe("Start date"),
        endDate: z.string().optional().describe("End date"),
        status: z.enum(["planned", "active", "completed"]).optional().describe("Sprint status"),
      }),
      execute: async ({ id, ...body }) =>
        api(`/api/sprints/${id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
    }),

    deleteSprint: tool({
      description: "Delete a sprint",
      inputSchema: z.object({ id: z.string().describe("Sprint ID") }),
      execute: async ({ id }) =>
        api(`/api/sprints/${id}`, { method: "DELETE" }),
    }),

    // ─── Tasks ───
    listProjectTasks: tool({
      description: "List tasks for a project with filters",
      inputSchema: z.object({
        projectId: z.string().describe("Project ID"),
        status: z.enum(["todo", "in_progress", "in_review", "done"]).optional().describe("Filter by status"),
        priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("Filter by priority"),
        assignee: z.string().optional().describe("Filter by assignee"),
        sprint_id: z.string().optional().describe("Filter by sprint"),
      }),
      execute: async ({ projectId, ...filters }) => {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(filters)) {
          if (v) params.set(k, v);
        }
        const qs = params.toString();
        return api(`/api/projects/${projectId}/tasks${qs ? `?${qs}` : ""}`);
      },
    }),

    listAllTasks: tool({
      description: "List all tasks across projects",
      inputSchema: z.object({
        status: z.enum(["todo", "in_progress", "in_review", "done"]).optional().describe("Filter by status"),
        priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("Filter by priority"),
        assignee: z.string().optional().describe("Filter by assignee"),
      }),
      execute: async (filters) => {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(filters)) {
          if (v) params.set(k, v);
        }
        const qs = params.toString();
        return api(`/api/tasks${qs ? `?${qs}` : ""}`);
      },
    }),

    createTask: tool({
      description: "Create a task in a project",
      inputSchema: z.object({
        projectId: z.string().describe("Project ID"),
        title: z.string().describe("Task title"),
        description: z.string().optional().describe("Task description"),
        status: z.enum(["todo", "in_progress", "in_review", "done"]).optional().describe("Task status"),
        priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("Task priority"),
        assignee: z.string().optional().describe("Assignee name"),
        sprintId: z.string().optional().describe("Sprint ID"),
      }),
      execute: async ({ projectId, ...body }) =>
        api(`/api/projects/${projectId}/tasks`, {
          method: "POST",
          body: JSON.stringify(body),
        }),
    }),

    getTask: tool({
      description: "Get a single task by ID",
      inputSchema: z.object({ id: z.string().describe("Task ID") }),
      execute: async ({ id }) => api(`/api/tasks/${id}`),
    }),

    updateTask: tool({
      description: "Update a task's fields like status, assignee, priority",
      inputSchema: z.object({
        id: z.string().describe("Task ID"),
        title: z.string().optional().describe("New title"),
        description: z.string().optional().describe("New description"),
        status: z.enum(["todo", "in_progress", "in_review", "done"]).optional().describe("New status"),
        priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("New priority"),
        assignee: z.string().optional().describe("New assignee"),
        sprintId: z.string().optional().describe("New sprint"),
      }),
      execute: async ({ id, ...body }) =>
        api(`/api/tasks/${id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
    }),

    deleteTask: tool({
      description: "Delete a task and its comments",
      inputSchema: z.object({ id: z.string().describe("Task ID") }),
      execute: async ({ id }) =>
        api(`/api/tasks/${id}`, { method: "DELETE" }),
    }),

    // ─── Comments ───
    listComments: tool({
      description: "List comments on a task",
      inputSchema: z.object({ taskId: z.string().describe("Task ID") }),
      execute: async ({ taskId }) => api(`/api/tasks/${taskId}/comments`),
    }),

    addComment: tool({
      description: "Add a comment to a task",
      inputSchema: z.object({
        taskId: z.string().describe("Task ID"),
        content: z.string().describe("Comment content"),
        author: z.string().optional().describe("Comment author"),
      }),
      execute: async ({ taskId, ...body }) =>
        api(`/api/tasks/${taskId}/comments`, {
          method: "POST",
          body: JSON.stringify(body),
        }),
    }),

    deleteComment: tool({
      description: "Delete a comment",
      inputSchema: z.object({ id: z.string().describe("Comment ID") }),
      execute: async ({ id }) =>
        api(`/api/comments/${id}`, { method: "DELETE" }),
    }),

    // ─── Stats ───
    getStats: tool({
      description: "Get counts of projects, tasks, sprints, comments",
      inputSchema: z.object({}),
      execute: async () => api("/api/stats"),
    }),
  };
}
