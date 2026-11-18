# FraudShield v1.0 — release notes (2026-11-18)

### Included
- Verified 568,630-row original user dataset analysis and feature-duplicate handling.
- Saved trained and selected model, scored 568,630-row derived SQLite index, held-out model scores.
- Six React/TypeScript page source files and precompiled self-hosted frontend bundle.
- FastAPI routes for KPIs, analytics, quality, model comparison, threshold decisions, server-side pagination and filtered CSV exports.
- SQLite review persistence (simulated status and notes).
- Business requirements, workflows, traceability, analytics method, reproducibility instructions, SQL examples, BI export instructions and interview guide.
- Automated API tests, TypeScript compile and static bundle syntax check.

### Known limitations
- Chrome was blocked from navigating to local pages by administrator policy in the build environment; **no genuine UI screenshots or end-to-end browser tests were produced**. Browser visual acceptance remains open.
- No live public deployment, client real-world validation, PostgreSQL runtime test, Power BI `.pbix`, or real fraud operations integration.
- Data is artificially balanced; underlying 2023 record dates and original synthesis provenance are not established.
- The UI uses vendored React 16.x for offline build compatibility; update runtime and retest before public production use.
- User-provided original CSV is not packaged. Derived transaction index should be excluded from Git commits until dataset license/redistribution rights are verified.
- Recorded Amount currency unknown; UI `$` denotes a shorthand for dataset values, not verified USD/CAD.

### Breaking change / upgrade
Rebuilding from the original CSV overwrites `database/fraudshield.sqlite`, including any simulated review notes.
