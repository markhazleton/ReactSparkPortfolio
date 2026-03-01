# Copilot Archive

This directory contains **working documents** and **"sausage being made"** artifacts that are no longer actively relevant.

## Purpose

Archive temporary documentation created during development work:
- Dependency update checklists and remediation plans
- CSP audits and domain analysis
- Implementation summaries from completed features
- Migration plans after completion
- Investigation notes after conclusion

## Naming Convention

All archived documents MUST use date-prefixed filenames:

```
YYYY-MM-DD_topic-description.md
```

Examples:
- `2026-03-01_dependabot-remediation.md`
- `2026-02-15_csp-audit.md`
- `2026-01-20_feature-001-implementation.md`

## Lifecycle

1. **Create** working docs here with date prefix during active work
2. **Keep** ONLY while actively relevant (days, not weeks)
3. **Clean up** when work completes:
   - Extract permanent insights to `/.documentation/*.md`
   - Delete the working doc OR move to dated subfolder
   - Remove all references from code/configs

## Cleanup Triggers

Delete or deeply archive when:
- ✅ Feature/fix merged to main
- ✅ Dependencies updated and tested
- ✅ Audit complete and actions taken
- ✅ Migration/refactoring finished
- ✅ Investigation concluded

## Quarterly Audits

Every quarter, review this directory and:
- Delete docs older than 90 days
- Archive to year-based subfolders if historical value exists
- Update permanent docs with any missing insights

---

**Philosophy**: Documentation that is out of sync with code is worse than no documentation. Less is more.
