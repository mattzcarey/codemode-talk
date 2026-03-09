-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Sprints
CREATE TABLE IF NOT EXISTS sprints (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'planned',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sprints_project ON sprints(project_id);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assignee TEXT DEFAULT '',
  sprint_id TEXT REFERENCES sprints(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_sprint ON tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author TEXT DEFAULT 'user',
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_comments_task ON comments(task_id);
