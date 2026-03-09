# PM SaaS

A minimal project management API used as the backing service for the Code Mode talk demos. Runs on Cloudflare Workers + D1.

## Setup

```bash
npm install
npm run db:migrate
npm start
```

## Deploy

```bash
npm run db:migrate:prod
npm run deploy
```

## API

Base URL: `https://pm-saas.mattzcarey.workers.dev`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get a project |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| GET | `/api/projects/:id/tasks` | List tasks (filterable) |
| POST | `/api/projects/:id/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/projects/:id/sprints` | List sprints |
| POST | `/api/projects/:id/sprints` | Create a sprint |
| GET | `/api/sprints/:id` | Get a sprint |
| PATCH | `/api/sprints/:id` | Update a sprint |
| DELETE | `/api/sprints/:id` | Delete a sprint |
| GET | `/api/tasks/:id/comments` | List comments |
| POST | `/api/tasks/:id/comments` | Add a comment |
| DELETE | `/api/comments/:id` | Delete a comment |
| GET | `/api/stats` | Get counts |

## Stack

- Cloudflare Workers
- D1 (SQLite)
