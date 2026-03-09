import { SlideContainer } from "@/components"
import { useState } from "react"
import { Highlight, themes } from "prism-react-renderer"

interface PMTool {
  name: string
  safeName: string
  description: string
  inputType: string
  outputType: string
}

const pmTools: PMTool[] = [
  // ─── Projects ───
  {
    name: "GET /api/projects",
    safeName: "listProjects",
    description: "List all projects",
    inputType: `type ListProjectsInput = {}`,
    outputType: `type ListProjectsOutput = {
  id: string;
  name: string;
  description: string;
  created_at: string;
}[]`,
  },
  {
    name: "POST /api/projects",
    safeName: "createProject",
    description: "Create a new project",
    inputType: `type CreateProjectInput = {
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
}`,
    outputType: `type CreateProjectOutput = {
  id: string;
  name: string;
  description: string;
}`,
  },
  {
    name: "GET /api/projects/:id",
    safeName: "getProject",
    description: "Get a single project by ID",
    inputType: `type GetProjectInput = {
  /** Project ID */
  id: string;
}`,
    outputType: `type GetProjectOutput = {
  id: string;
  name: string;
  description: string;
  created_at: string;
}`,
  },
  {
    name: "PATCH /api/projects/:id",
    safeName: "updateProject",
    description: "Update a project's name or description",
    inputType: `type UpdateProjectInput = {
  /** Project ID */
  id: string;
  /** New name */
  name?: string;
  /** New description */
  description?: string;
}`,
    outputType: `type UpdateProjectOutput = {
  id: string;
  name: string;
  description: string;
  created_at: string;
}`,
  },
  {
    name: "DELETE /api/projects/:id",
    safeName: "deleteProject",
    description: "Delete a project and all its data",
    inputType: `type DeleteProjectInput = {
  /** Project ID */
  id: string;
}`,
    outputType: `type DeleteProjectOutput = {
  deleted: string;
}`,
  },
  // ─── Sprints ───
  {
    name: "GET /api/projects/:id/sprints",
    safeName: "listSprints",
    description: "List sprints for a project",
    inputType: `type ListSprintsInput = {
  /** Project ID */
  projectId: string;
}`,
    outputType: `type ListSprintsOutput = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
}[]`,
  },
  {
    name: "POST /api/projects/:id/sprints",
    safeName: "createSprint",
    description: "Create a sprint for a project",
    inputType: `type CreateSprintInput = {
  /** Project ID */
  projectId: string;
  /** Sprint name */
  name: string;
  /** Start date (ISO 8601) */
  startDate?: string;
  /** End date (ISO 8601) */
  endDate?: string;
}`,
    outputType: `type CreateSprintOutput = {
  id: string;
  project_id: string;
  name: string;
  status: "planned";
  start_date: string | null;
  end_date: string | null;
}`,
  },
  {
    name: "GET /api/sprints/:id",
    safeName: "getSprint",
    description: "Get a single sprint by ID",
    inputType: `type GetSprintInput = {
  /** Sprint ID */
  id: string;
}`,
    outputType: `type GetSprintOutput = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
}`,
  },
  {
    name: "PATCH /api/sprints/:id",
    safeName: "updateSprint",
    description: "Update a sprint's name, dates, or status",
    inputType: `type UpdateSprintInput = {
  /** Sprint ID */
  id: string;
  /** New name */
  name?: string;
  /** @format date */
  startDate?: string;
  /** @format date */
  endDate?: string;
  /** Sprint status */
  status?: "planned" | "active" | "completed";
}`,
    outputType: `type UpdateSprintOutput = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
}`,
  },
  {
    name: "DELETE /api/sprints/:id",
    safeName: "deleteSprint",
    description: "Delete a sprint",
    inputType: `type DeleteSprintInput = {
  /** Sprint ID */
  id: string;
}`,
    outputType: `type DeleteSprintOutput = {
  deleted: string;
}`,
  },
  // ─── Tasks ───
  {
    name: "GET /api/projects/:id/tasks",
    safeName: "listProjectTasks",
    description: "List tasks for a project with filters",
    inputType: `type ListProjectTasksInput = {
  /** Project ID */
  projectId: string;
  /** Filter by status */
  status?: "todo" | "in_progress" | "in_review" | "done";
  /** Filter by priority */
  priority?: "low" | "medium" | "high" | "critical";
  /** Filter by assignee */
  assignee?: string;
  /** Filter by sprint */
  sprint_id?: string;
}`,
    outputType: `type ListProjectTasksOutput = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  sprint_id: string | null;
  created_at: string;
}[]`,
  },
  {
    name: "GET /api/tasks",
    safeName: "listAllTasks",
    description: "List all tasks across projects",
    inputType: `type ListAllTasksInput = {
  /** Filter by status */
  status?: "todo" | "in_progress" | "in_review" | "done";
  /** Filter by priority */
  priority?: "low" | "medium" | "high" | "critical";
  /** Filter by assignee */
  assignee?: string;
}`,
    outputType: `type ListAllTasksOutput = {
  id: string;
  project_id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  created_at: string;
}[]`,
  },
  {
    name: "POST /api/projects/:id/tasks",
    safeName: "createTask",
    description: "Create a task in a project",
    inputType: `type CreateTaskInput = {
  /** Project ID */
  projectId: string;
  /** Task title */
  title: string;
  /** Task description */
  description?: string;
  /** Task status */
  status?: "todo" | "in_progress" | "in_review" | "done";
  /** Task priority */
  priority?: "low" | "medium" | "high" | "critical";
  /** Assignee name */
  assignee?: string;
  /** Sprint ID */
  sprintId?: string;
}`,
    outputType: `type CreateTaskOutput = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  sprint_id: string | null;
}`,
  },
  {
    name: "GET /api/tasks/:id",
    safeName: "getTask",
    description: "Get a single task by ID",
    inputType: `type GetTaskInput = {
  /** Task ID */
  id: string;
}`,
    outputType: `type GetTaskOutput = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  sprint_id: string | null;
  created_at: string;
  updated_at: string;
}`,
  },
  {
    name: "PATCH /api/tasks/:id",
    safeName: "updateTask",
    description: "Update a task's fields like status, assignee, priority",
    inputType: `type UpdateTaskInput = {
  /** Task ID */
  id: string;
  /** New title */
  title?: string;
  /** New description */
  description?: string;
  /** New status */
  status?: "todo" | "in_progress" | "in_review" | "done";
  /** New priority */
  priority?: "low" | "medium" | "high" | "critical";
  /** New assignee */
  assignee?: string;
  /** New sprint */
  sprintId?: string;
}`,
    outputType: `type UpdateTaskOutput = {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  sprint_id: string | null;
  updated_at: string;
}`,
  },
  {
    name: "DELETE /api/tasks/:id",
    safeName: "deleteTask",
    description: "Delete a task and its comments",
    inputType: `type DeleteTaskInput = {
  /** Task ID */
  id: string;
}`,
    outputType: `type DeleteTaskOutput = {
  deleted: string;
}`,
  },
  // ─── Comments ───
  {
    name: "GET /api/tasks/:id/comments",
    safeName: "listComments",
    description: "List comments on a task",
    inputType: `type ListCommentsInput = {
  /** Task ID */
  taskId: string;
}`,
    outputType: `type ListCommentsOutput = {
  id: string;
  task_id: string;
  author: string;
  content: string;
  created_at: string;
}[]`,
  },
  {
    name: "POST /api/tasks/:id/comments",
    safeName: "addComment",
    description: "Add a comment to a task",
    inputType: `type AddCommentInput = {
  /** Task ID */
  taskId: string;
  /** Comment content */
  content: string;
  /** Comment author */
  author?: string;
}`,
    outputType: `type AddCommentOutput = {
  id: string;
  task_id: string;
  author: string;
  content: string;
}`,
  },
  {
    name: "DELETE /api/comments/:id",
    safeName: "deleteComment",
    description: "Delete a comment",
    inputType: `type DeleteCommentInput = {
  /** Comment ID */
  id: string;
}`,
    outputType: `type DeleteCommentOutput = {
  deleted: string;
}`,
  },
  // ─── Stats ───
  {
    name: "GET /api/stats",
    safeName: "getStats",
    description: "Get counts of projects, tasks, sprints, comments",
    inputType: `type GetStatsInput = {}`,
    outputType: `type GetStatsOutput = {
  projects: number;
  tasks: number;
  sprints: number;
  comments: number;
}`,
  },
]

function methodColor(name: string) {
  if (name.startsWith("GET")) return "text-ai-100"
  if (name.startsWith("POST")) return "text-compute-100"
  if (name.startsWith("PATCH")) return "text-media-100"
  if (name.startsWith("DELETE")) return "text-accent-100"
  return "text-foreground-200"
}

export function CodeModeSDKSlide() {
  const [selected, setSelected] = useState(0)
  const tool = pmTools[selected]

  const typesCode = `${tool.inputType}

${tool.outputType}`

  return (
    <SlideContainer showDots={false}>
      <div className="flex flex-col items-center gap-3 w-full max-w-5xl">
        <div className="text-center">
          <h2 className="text-foreground-100">
            <span className="text-accent-100">Code Mode</span>: Typed SDK
          </h2>
          <p className="text-foreground-200 text-sm mt-1">
            Tool descriptions + input schemas → TypeScript types
          </p>
        </div>

        <div className="flex gap-4 w-full flex-1 min-h-0">
          {/* Left: Tools list */}
          <div className="w-72 shrink-0 flex flex-col gap-1 max-h-[55vh] overflow-auto">
            <span className="text-[12px] font-mono text-foreground-200/50 px-1">
              {pmTools.length} tools
            </span>
            {pmTools.map((t, i) => (
              <button
                key={t.safeName}
                onClick={() => setSelected(i)}
                className={`text-left rounded-lg border px-2.5 py-1.5 transition-colors ${
                  i === selected
                    ? "border-accent-100 bg-accent-100/10"
                    : "border-border-100 bg-background-200 hover:border-accent-100/50"
                }`}
              >
                <p className={`text-[12px] font-mono ${methodColor(t.name)}`}>
                  {t.name}
                </p>
                <p className="text-[9px] text-foreground-200 truncate">
                  {t.description}
                </p>
              </button>
            ))}
          </div>

          {/* Right: Generated types */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 rounded-lg border border-accent-100/40 bg-background-200 overflow-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border-100">
                <span className="text-[12px] font-mono text-accent-100">
                  types.d.ts
                </span>
                <span className="text-[12px] text-foreground-200/50 ml-auto">
                  generated from schema
                </span>
              </div>
              <Highlight theme={themes.github} code={typesCode} language="typescript">
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="p-3 text-[13px] font-mono leading-relaxed whitespace-pre overflow-auto">
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </div>

        {/* Bottom callout */}
        <div className="rounded-lg border border-accent-100 bg-accent-100/10 px-6 py-3">
          <p className="text-center text-sm text-foreground-100">
            The model gets a <span className="text-accent-100 font-medium">typed SDK</span>, not a list of tools
          </p>
        </div>
      </div>
    </SlideContainer>
  )
}
