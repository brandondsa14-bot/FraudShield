# Verification plan, executed results & simulated UAT
**Version:** 1.0 · 2026-11-18. **Evidence policy:** a test is only PASS when it was actually run; theoretical UAT steps are never marked executed.

## Execution environment
- Python 3.13.5, scikit-learn 1.8.0, FastAPI 0.128.2, NumPy 2.3.5; CPU training.
- User-uploaded CSV, 568,630 rows, checked and used for model outputs.
- Node 22.16 used to compile the TypeScript browser bundle offline using installed TypeScript 5.8.3.
- Headless Chromium was available but **site navigation was blocked by administrator policy**. Full interactive screenshot / visual sign-off could not be verified in this environment.

## Automated test cases
| ID | Check | Expected | Result |
|---|---|---|---|
| T01 | Health | Database, model, score files available | PASS |
| T02 | Executive data reconciliation | Exactly 568,630 rows and 284,315 fraud labels | PASS |
| T03 | SQL amount analytics | Five derived amount bands | PASS |
| T04 | Data quality | Detect one duplicate feature vector and no missing | PASS |
| T05 | Model comparison | Real test F1 and chosen model exposed | PASS |
| T06 | Threshold change | Raising threshold never increases alerts or recall | PASS |
| T07 | SQL pagination and numeric ID search | Correct page, sorted IDs, correct match | PASS |
| T08 | SQL filter validation | SQL-looking sort and invalid ID query rejected | PASS |
| T09 | Simulated review persistence | PUT and subsequent GET agree | PASS |
| T10 | Review invalid status | 422 validation | PASS |
| T11 | Filtered CSV export | Correct header, matching row | PASS |
| T12 | Real model inference | 29 features accepted; missing features rejected | PASS |
| T13 | Prebuilt React JS syntax | JavaScript parses via `node --check` | PASS |
| T13a | Static HTML and JS served | HTTP GET from built FastAPI | PASS |
| T13b | SQL schema, views, foreign keys | Materialized DB queries reconcile | PASS |
| T14 | Full visual navigation and responsiveness | Every page renders and operates | NOT EXECUTED — headless browser blocked by policy |
| T15 | Chrome/Safari run on Mac | Visual sign-off | NOT EXECUTED — requires user's device |
| T16 | Actual bank/user acceptance | Stakeholder approves solution | NOT EXECUTED — simulated business case only |

**Automated test execution:** `pytest -q` returned **11 passed** (API, SQL and static assets; several functions check multiple conditions). Separate `compileall` and `node --check` completed. If results change after editing, rerun and update this table. Pending visual issues may exist until local browser sign-off.

## Suggested UAT scripts (NOT EXECUTED)
| ID | Simulated persona | Steps | Acceptance condition | Status |
|---|---|---|---|---|
| UAT-01 | Fraud Analyst | Open Alerts, set threshold 80%, inspect first record | All listed scores >=80%, descending by default | Not executed |
| UAT-02 | Fraud Analyst | Change status to Investigating, enter note, save, refresh | Status/note persists in SQLite | Not executed in browser (API persistence tested) |
| UAT-03 | Risk Manager | Change 20% threshold to 80% in Decision Lab | Confusion matrix/precision/recall update from test scores | Not executed in browser (API tested) |
| UAT-04 | Risk Manager | Change assumed prevalence, review cost, missed-case cost | Estimated impact updates, caveats remain visible | Not executed |
| UAT-05 | Data Analyst | Filter Class=1 and amount min 10,000, export | Export rows meet predicates and include model scores | Not executed in browser (API export tested) |
| UAT-06 | Data Analyst | Open Insights and compare amount bands | Five groups, class split, labelled values and explanation | Not executed |
| UAT-07 | Audit | Open Quality page | Verified checks, caveats, dataset provenance visible | Not executed |
| UAT-08 | Accessibility | Tab through nav/filter/table/dialog at mobile width | Visible focus, no blocked interactions | Not executed |

## Security / testing constraints
- No actual user acceptance study or financial-risk validation.
- Browser automation is not verified on a local machine. Database and API tests pass, but screenshots from the actual UI must be captured after manual local verification.
- Cost model is simulated. No audited financial outcomes.
- Local API is intentionally unauthenticated for student demonstration; never expose with customer data.
- No performance load tests or security penetration tests executed.

## Release readiness
**API, data science, derived SQL and static bundle:** generated and validated as above. **Desktop/mobile rendering and clickable UI:** implemented, not browser-verified here. **Deployment:** not performed. **Stakeholder approvals:** not requested.
