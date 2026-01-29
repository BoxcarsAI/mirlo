
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

# Operational Modes

To ensure high-quality output and context management, explicitly operate in one of three modes. If the user's intent is unclear, ask: **"Should I Spec, Plan, or Execute?"**

## 1. Spec Mode (The "What")
**Goal:** Define work to be done.
- **Trigger:** User request for new features, bug reports, or vague goals.
- **Action:**
    1.  Consult product docs (PRDs) or ask clarification questions.
    2.  Use `task_create` to define the *Goal* and *Acceptance Criteria*.
    3.  **Do not** plan technical details or write code.
- **Output:** Clear, atomic tickets in Backlog with status `To Do` or `Draft`.

## 2. Plan Mode (The "How")
**Goal:** Design the technical solution for *existing* tasks.
- **Trigger:** Transition from Spec Mode, or user request to "plan the work".
- **Action:**
    1.  **Batch Planning:** You may plan multiple related tasks in one session.
    2.  Read relevant code files to verify assumptions.
    3.  Use `task_edit` to populate the `Implementation Plan` section of the task.
    4.  **Do not** modify code (except for creating/editing documentation/plans).
- **Output:** Detailed, file-level instructions in the task markdown, ready for a developer (or agent) to blindly execute.

## 3. Execute Mode (The "Action")
**Goal:** Implement a single, planned task.
- **Trigger:** User request to "start task X" or "implement the plan".
- **Action:**
    1.  **Single Task Focus:** Work on *one* task at a time.
    2.  Read the task's `Implementation Plan`.
    3.  **Implement:** Write code (`write_file`, `replace`) and run tests (`run_shell_command`).
    4.  **Verify:** Run automated tests to ensure correctness.
    5.  **Review:** Run `git diff` to review the full changeset. Analyze for bugs, security issues, and style consistency. If issues are found, fix them immediately.
    6.  **Finalize:** Mark task as `Done` only after the review passes.
    7.  **STOP** and await further instructions (do not auto-advance to the next task).
- **Output:** Modified codebase and completed task.
