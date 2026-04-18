---
description: Address review comments (including Copilot comments) on the active pull request. Use when: responding to PR feedback, fixing review comments, resolving PR threads, implementing requested changes from reviewers, addressing code review, fixing PR issues.
---

## Prompt Resolution

Determine the current git user by running `git config user.name`.
Normalize to a folder-safe slug: lowercase, replace spaces with hyphens, strip non-alphanumeric/hyphen chars.

Read and execute the instructions from the **first file that exists**:
1. `.documentation/{git-user}/commands/devspark.address-pr-review.md` (personalized override)
2. `.documentation/commands/devspark.address-pr-review.md` (team customization)
3. `.devspark/defaults/commands/devspark.address-pr-review.md` (stock default)

Where `{git-user}` is the normalized slug from step above.
