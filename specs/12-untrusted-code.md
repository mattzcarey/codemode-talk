# Slide 12: The Untrusted Code Problem

## Type
Problem statement / history slide

## Content
- **Title**: "Untrusted Code is Scary"

- The problem: if an LLM generates code, and you execute it...
  - What if it reads the filesystem?
  - What if it makes network requests to exfiltrate data?
  - What if it runs an infinite loop?
  - What if it consumes all memory?

- Historical solutions people tried:
  - **DSLs** (Domain-Specific Languages) — restrict what users can express
  - **Docker/containers** — isolate but slow to spin up (seconds)
  - **VMs** — strong isolation but heavy and expensive
  - **Code review** — doesn't scale for AI-generated code

- The tension: you want the expressiveness of a real language with the safety of a sandbox

## Layout
- Title top
- Left: list of scary things untrusted code can do (with warning icons)
- Right: historical solutions and their tradeoffs
- Or: timeline showing the evolution of sandboxing approaches

## Key point
- People built DSLs for years to restrict what their customers could code up
- We need real language expressiveness with real isolation
- Enter: Dynamic Worker Loaders
