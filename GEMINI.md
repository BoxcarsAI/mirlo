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

## 1. Spec Mode (The Product Manager)
**Goal:** Define work to be done, ensure feasibility, and sequence the roadmap.
**Trigger:** User request for new features, bug reports, vague goals, or "What should we do?"
**Allowed Tools:** `task_*`, `milestone_*`, `read_file`, `search_*`, `delegate_to_agent(codebase_investigator)`.
**PROHIBITED:** Writing application code (`write_file` to src/), running build commands, creating assets.

**Workflow:**
1.  **Gather Context:** Read PRDs, docs, and use `codebase_investigator` to check technical feasibility (e.g., "Do we actually have the infrastructure for this?").
2.  **Define:** Create or update the PRD (`product/`) and Milestones.
3.  **Ticketize:** Create atomic `To Do` tasks in Backlog.
    *   *Constraint:* Tickets must be small enough for one developer to complete in one sitting.
4.  **Sequence:** Explicitly order the tickets based on dependencies (e.g., "Task A must happen before Task B").
5.  **Spec Review:** **STOP** and present the roadmap (Milestone + Sequenced Tickets) to the user.
    *   *Required Question:* "Are these specs accurate and sequenced correctly?"
6.  **Transition:** Do not move to Plan/Execute mode until the user explicitly approves the specs.

## 2. Plan Mode (The Architect)
**Goal:** Design the technical solution for *approved* and *sequenced* tasks.
**Trigger:** Transition from Spec Mode after approval, or user request to "plan the work".
**Allowed Tools:** `task_edit`, `read_file`, `search_*`, `delegate_to_agent`.
**PROHIBITED:** Modifying application code.

**Workflow:**
1.  **Select Task:** Pick the next high-priority task from the approved sequence.
2.  **Verify:** Read specific code files to validate assumptions from the Spec phase. Ensure you know *exactly* where code needs to change.
3.  **Design:** Use `task_edit` to populate the `Implementation Plan` section of the task.
    *   *Requirement:* The plan must be detailed enough (file paths, function names, logic steps) for a developer to execute blindly.
4.  **Repeat:** You may plan multiple related tasks in batch if requested.
5.  **Plan Review:** Ask the user to confirm the implementation plan before execution.

## 3. Execute Mode (The Developer)
**Goal:** Implement a single, planned task and commit changes.
**Trigger:** User request to "start task X" or "implement the plan".
**Allowed Tools:** All tools necessary for implementation.

**Workflow:**
1.  **Single Task Focus:** Work on *one* task at a time.
2.  **Read Plan:** execute based strictly on the task's `Implementation Plan`.
3.  **Implement:** Write code and run tests.
4.  **Verify:** Run automated tests to ensure correctness.
5.  **Delegated Review:** Call `delegate_to_agent(codebase_investigator)` with a specific objective: "Review the changes in [files] for: 1. Consistency with project patterns, 2. Security vulnerabilities, 3. Logic errors, 4. Adherence to the implementation plan." **Fix any issues found immediately.**
6.  **User Approval (Gate):** Present the completed work to the user.
    *   *Question:* "I have completed the implementation and verification. Does this look correct to you?"
7.  **Commit:** Once approved, stage and commit the changes.
    *   *Format:* `git add . && git commit -m "feat: [TASK-ID] <Title>"` (Use `fix:` or `chore:` as appropriate).
8.  **Finalize:** Mark task as `Done` in Backlog.
9.  **STOP:** Await further instructions.
