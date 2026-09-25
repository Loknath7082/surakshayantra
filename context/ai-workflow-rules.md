# AI Workflow Rules

## Approach

- Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and the current state of progress. Always implement against these specs — do not infer or invent behavior from scratch.
- Specs live in `context/feature-specs/` and follow the naming format `XX-[kebab-case-name].md` (e.g. `01-design-system.md`, `02-auth-rbac.md`). Two-digit padded numbering defines the explicit implementation order.
- When assigned a spec, follow this standard sequence: read `AGENTS.md` first (it defines the required context reading order) → read the assigned spec completely → mark the unit status as **IN PROGRESS** in `context/progress-tracker.md` → implement exactly what the spec requires → do not add unrequested features, refactors, dependencies, or architectural changes.
- Only one spec unit may be actively implemented in a session. Start a new chat/session only when moving to a new spec unit. Never reuse a session across unrelated specs. All corrective fixes, bug fixes, and review fixes for the active unit remain in the same session.
- **Project initialization exception:** Before any feature-spec file exists, a single session may perform project setup (Next.js init, Tailwind, shadcn/ui, design tokens, `lib/utils.ts`, etc.) and author the first feature spec. Once `context/feature-specs/01-*.md` exists, the normal one-unit-per-session rule applies. Do not implement Unit 01 in the same session that authors the spec.
- Corrective prompts: when an error, test failure, or code review issue is raised during implementation — clearly state what is wrong, clearly state what is expected, fix only the identified issue and make only the code changes necessary to resolve it, do not rewrite the entire implementation, do not refactor unrelated working code, do not modify unrelated files, and do not add improvements, features, or changes outside the identified issue. Core rule: fix the identified problem and change nothing unrelated.
- Final workflow: New Spec → New Session → Read `AGENTS.md` + Required Context → Mark IN PROGRESS → Implement → Update `progress-tracker.md` after meaningful changes → Local Verification → Commit → Push Feature Branch → Create PR → CodeRabbit Review (or Manual Review if unavailable) → Fix Issues in Same Session → Re-review → Final Verification → Mark COMPLETE → Merge into `development` → Release to `main`.

## Scoping Rules

- Work on one feature unit at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.
- If a feature or idea is not explicitly defined in the active spec or the in-scope list within `context/project-overview.md`, do not build it.
- Do not add "nice-to-have" improvements unless explicitly requested or approved.
- Out-of-scope ideas must not be implemented as part of the current unit. Log them under `## Future Enhancements / Backlog` in `context/progress-tracker.md`. This is the only additional section permitted in the tracker file.

## When to Split Work

Split an implementation step if it combines:

- UI changes and database schema changes
- UI changes and API route changes
- Multiple unrelated API routes
- Multiple unrelated pages
- Behavior not clearly defined in the context files

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files.
- If a requirement is missing, ambiguous, or underspecified, STOP and ask the human developer for clarification.
- Do not make assumptions, especially regarding security baselines, authorization rules, database schemas, system architecture, or data handling.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.

## Protected Files

Do not modify the following unless the assigned spec or an explicitly approved change specifically demands it:

- `components/ui/` (design system base — vendored shadcn/ui primitives)
- `proxy.ts` (routing and request security middleware)
- `prisma/schema.prisma` — modify only when the assigned spec explicitly requires a database schema change. All schema modifications must be applied via Prisma migrations using `npx prisma migrate dev`.
- `lib/env.ts` (environment variable validation schemas)
- `context/*.md` and `context/feature-specs/*.md` — **exception:** `context/progress-tracker.md` is explicitly permitted for status tracking updates.
- `package.json` / `package-lock.json` — modify only when adding or changing dependencies explicitly required by the active spec or explicitly approved.
- `globals.css` — modify only when the active spec explicitly requires a change to global styles or design tokens defined by `ui-context.md`. For Tailwind v4, the token → utility mapping belongs in the `@theme` block in this file.
- `tailwind.config.ts` / `tailwind.config.js` — modify only when extending the theme for design tokens (colors, radii, shadows, etc.) as required by the active spec. For Tailwind v4, prefer the `@theme` block in `globals.css` instead of this file when that is the project convention.
- `next.config.ts` / `next.config.js` / `next.config.mjs` — modify only when the active spec explicitly requires a Next.js config change.

Do not modify these files indirectly or as side effects to resolve unrelated issues.

During project initialization (before `01-*.md` exists), the files above that are required for setup may be created and configured as part of that work. After initialization, the per-file conditions above apply.

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes system architecture or boundaries, storage model decisions, code conventions or standards, or feature scope.

Approval chain:

1. STOP and request explicit approval from the human developer only.
2. AI agents are strictly forbidden from approving architectural, security, scope, database, or rule changes.
3. Only after receiving human approval, update the relevant `context/*.md` file before continuing implementation.

**Exception — `context/progress-tracker.md`:** This file is exempt from the approval chain above. It is updated freely after every meaningful implementation change without approval, including: marking units IN PROGRESS, marking units COMPLETE, logging session notes, recording architecture decisions, recording audit findings, and appending out-of-scope ideas under `## Future Enhancements / Backlog`. No human approval is required for tracker updates.

Additional rules:

- Agents must never silently alter project rules, architecture, specifications, security boundaries, or documented decisions on their own initiative.
- `context/progress-tracker.md` must be updated after each important or meaningful implementation change, using its existing structure.
- `context/progress-tracker.md` must also be updated with the final completion state before closing the unit.
- No additional sections may be added to `progress-tracker.md` by the agent — the only permitted extra section is `## Future Enhancements / Backlog`.

## Before Moving to the Next Unit

The current unit satisfies its defined scope and acceptance criteria. Run all applicable verification checks before closing any unit:

- [ ] TypeScript / type-check passes (`npx tsc --noEmit` or `npm run typecheck`).
- [ ] ESLint passes (`npm run lint`).
- [ ] Dependency security audit runs (`npm audit --audit-level=high`) — informational check, not an automatic blocker. Findings are recorded in `context/progress-tracker.md`. An audit failure alone does not block closure unless the active change introduces a serious direct security risk.
- [ ] Production build passes (`npm run build`).
- [ ] Spec-specific acceptance criteria checklist passes completely.
- [ ] Zero out-of-scope code changes introduced.
- [ ] Zero unintended file or dependency modifications made.
- [ ] No invariant defined in `context/architecture-context.md` was violated.
- [ ] CodeRabbit review issues (or manual review issues if CodeRabbit is unavailable) have been fixed and re-reviewed.
- [ ] `context/progress-tracker.md` reflects the completed work and is updated with the final completion state.

Close & Git Policy: units may only be closed after all verification checks above pass successfully.

- The unit must be marked **COMPLETE** in `context/progress-tracker.md` after final verification.
- Work uses the `feat/NN-spec-name` branch convention. AI agents must never push directly to the `development` branch.
- If the `development` branch does not exist on a new repo, it must be created from `main` during project setup. Then the normal flow applies: feature branch → PR → `development` → `main`.
- Exact order: Implement → Local Verification → Commit → Push Feature Branch → Create PR → CodeRabbit Review → Fix → Commit → Push → Re-review → Final Verification → Mark COMPLETE.
- If Git is initialized and configured, creating a local conventional commit is mandatory: `feat(scope): complete Unit XX - [spec-name]`.
- If Git is uninitialized or unavailable on Day 1, implementation is not blocked. Once Git is available, completed units must be committed.
- Never commit or push broken, failing, or incomplete work.
- The `development` branch is merged into `main` / production through the project's release workflow.

CodeRabbit review: CodeRabbit must review every Pull Request targeting `development`. Any required issues must be fixed and re-reviewed before the Pull Request is merged. Day 1 fallback: if CodeRabbit is not yet configured, a manual review is performed and implementation is not blocked. Once CodeRabbit is configured: PR → CodeRabbit Review → Fix → Re-review → Merge.