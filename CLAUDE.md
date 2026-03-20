<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_workflow_overview()` tool to load the tool-oriented overview (it lists the matching guide tools).

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and finalization
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->

# How We Work

Read `mission.md` for what Mirlo is and why it exists. Read `pm.md` for the PM operating model.

## Workflow

Think before you build, but don't overthink it.

1. **Understand** — Read the relevant code, docs, and backlog before proposing changes. Know what exists before adding to it.
2. **Scope** — For non-trivial work, define what you're doing and why before writing code. A few sentences in the backlog task is enough. For straightforward tasks, just do them.
3. **Build** — One task at a time. If you discover new work, create a backlog task — don't context-switch.
4. **Verify** — Test what you built. Review your own changes for consistency, security, and correctness.
5. **Ship** — Commit with a clear message: `feat:`, `fix:`, or `chore:` prefix + `[TASK-ID]` when applicable. Stage specific files, not `git add -A`.

## Principles

- **Ship first.** A shipped imperfect thing beats an unshipped perfect thing.
- **One milestone at a time.** Finish before scoping the next.
- **Automate what repeats.** If you do something twice, script it the third time.
- **Log decisions when non-obvious.** If you chose between meaningful alternatives, note why in the task or `backlog/decisions/`.
- **Don't over-engineer.** Solve the problem in front of you. Three similar lines beat a premature abstraction.

## Project Structure

```
src/              — Extension source code
backlog/          — Tasks, milestones, completed work (managed by Backlog.md)
product/          — PRDs and product specs
marketing/        — Store copy, screenshots, promotional assets
docs/             — Developer guides, brand, code patterns
reports/          — Weekly status reports
scripts/          — Build and utility scripts
```

## Key Files

- `mission.md` — What we're building and why
- `pm.md` — PM responsibilities and session workflow
- `product/prd-i18n-ga.md` — Current PRD (i18n GA launch)
- `marketing/SCREENSHOT-GUIDE.md` — How to create store screenshots
- `docs/START_HERE.md` — Developer onboarding
- `docs/brand.md` — Design system and brand guidelines
