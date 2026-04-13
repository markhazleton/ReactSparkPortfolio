# Tasks: Build Artifact Separation

**Input**: Design documents from `/.documentation/specs/001-build-artifact-separation/`
**Prerequisites**: plan.md (required), spec.md (required), research.md

**Tests**: Not requested — this is a configuration-only change with no new source code.

**Organization**: This is a quick-spec infrastructure change. Tasks are organized as sequential steps rather than user stories, since all steps are part of a single atomic change.

## Rationale Summary

### Core Problem

Every `npm run build` produces ~40+ changed files in `docs/` (hash-based Vite output). Because `docs/` is tracked in git, this creates massive noise in `git status`, pull request diffs, and commit history — obscuring actual meaningful code changes.

### Decision Summary

Stop tracking `docs/` and `coverage/` in git by adding them to `.gitignore` and untracking them. The CI/CD pipeline already builds from source, so committed build output is redundant.

### Key Drivers

- Developer experience: builds create 40+ file changes that are pure noise
- Git hygiene: commit history should reflect intentional code changes only
- CI/CD independence: Azure SWA workflow already builds from source (`skip_app_build: false`)

### Reviewer Guidance

Focus on: (1) `.gitignore` entries are correct and root-scoped, (2) `git rm --cached` removes tracking without deleting files, (3) CI/CD and local dev workflows still function after the change.

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- No user story labels — this is a single-concern infrastructure change
- Include exact file paths in descriptions

---

## Phase 1: Configuration Changes

**Purpose**: Update `.gitignore` and remove build artifacts from git tracking

- [x] T001 Add `docs/` entry to the "Build artifacts" section in `.gitignore`
- [x] T002 Untrack `docs/` directory from git index via `git rm -r --cached docs/`
- [x] T003 Untrack `coverage/` directory from git index via `git rm -r --cached coverage/` (already untracked — no action needed)

**Checkpoint**: After this phase, `docs/` and `coverage/` are ignored by git. Local files remain intact.

---

## Phase 2: Verification

**Purpose**: Confirm CI/CD and local dev workflows are unaffected

- [x] T004 Verify CI/CD workflow does not depend on committed `docs/` — confirm `skip_app_build: false` and `app_build_command: "npm run build"` in `.github/workflows/azure-static-web-apps-gentle-smoke-063be0b10.yml`
- [x] T005 Verify SWA CLI config uses `appBuildCommand` in `swa-cli.config.json` (builds on demand, not pre-existing output)
- [x] T006 Run `npm run build` and confirm `git status` shows no changes in `docs/`
- [x] T007 Run `npm run dev` and confirm local development server starts correctly

**Checkpoint**: All workflows verified — build artifacts are cleanly separated from source.

---

## Phase 3: Documentation & Commit

**Purpose**: Update docs and create the commit

- [x] T008 Update `README.md` to note that `docs/` is a build artifact (not committed) and `npm run build` is required before `npm run preview`
- [x] T009 Commit all changes with message `chore: stop tracking build artifacts (docs/, coverage/)`

**Checkpoint**: Feature complete — clean separation between source and build output.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (Configuration): No dependencies — start immediately
- **Phase 2** (Verification): Depends on Phase 1 completion
- **Phase 3** (Documentation): Depends on Phase 2 passing

### Within Phase 1

- T001 must complete before T002 (`.gitignore` must be updated before untracking, so the untracked files are immediately ignored)
- T002 and T003 can run in parallel after T001

### Parallel Opportunities

- T004 and T005 are read-only verifications that can run in parallel
- T006 and T007 are runtime verifications that should run sequentially (shared terminal)

---

## Implementation Strategy

### Single Atomic Change

This is a 9-task, single-commit change. All tasks contribute to one atomic commit:

1. Complete Phase 1: Update `.gitignore` + untrack directories
2. Complete Phase 2: Verify nothing breaks
3. Complete Phase 3: Update README + commit

**Total tasks**: 9
**Parallel opportunities**: T002/T003 (after T001), T004/T005
**Estimated git diff**: `.gitignore` (+1 line), `README.md` (minor update), plus ~100+ file deletions from `docs/` and `coverage/` untracking
**Post-merge git noise**: Zero — future builds will not create tracked file changes
