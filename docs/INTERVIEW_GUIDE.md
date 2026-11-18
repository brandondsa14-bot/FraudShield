# FraudShield — Recruiter pitch & project defence

## Resume entry (student portfolio project, November 2026)
**FraudShield — Financial Fraud Detection & Risk Intelligence** | Python, SQL (SQLite), FastAPI, scikit-learn, React, TypeScript, Vite
- Built a six-page local risk analytics prototype on **568,630** Kaggle transactions, integrating a SQL-backed FastAPI, paginated exploration, model-scored alerts, and simulated investigation notes.
- Compared logistic regression and histogram gradient boosting using stratified train/validation/held-out splits; selected by validation PR-AUC and measured **99.73% F1** on **85,295 held-out** records, clearly documenting artificial class balance.
- Designed threshold-based confusion-matrix and assumed-cost scenarios, validated model/data/API behaviours with automated tests, and produced a requirements traceability matrix and analyst workflow documentation.

**Use only after you personally open and exercise the website.** Claims above reflect generated artifacts and automated backend tests; browser-rendered UI sign-off remains a local step.

## 60-second explanation
“I built FraudShield as a portfolio application to explore how fraud operations teams could make better detection decisions. I used a real Kaggle dataset with 568,630 labelled transaction records, then implemented data validation, SQL-based analytics, two classification models and a FastAPI backend. I created a six-page React interface where an analyst can explore records, adjust the detection threshold and simulate case review notes. The model decision lab recalculates precision, recall and false alarms using saved predictions from an independent test set, instead of static charts. I also wrote stakeholder requirements, user stories and tests to show how business needs informed the features. One key insight is that the dataset has an artificial 50/50 class split; my strong benchmark metrics cannot be presented as production bank performance. The project demonstrates how I connect data analysis, systems design and accountable reporting.”

## Common interview questions
**Why this problem?** Missing fraud and false alarms have different consequences; visualizing both makes risk trade-offs understandable.

**Why SQL?** It drives actual filters, queries, reusable views and review-note relationships. The source is a single table; `reviews` is legitimately derived as a separate simulation entity, not an invented merchant or customer table.

**Why model selection by PR-AUC?** Precision–recall trade-offs matter to alert work queues; test data was not used to select the model. PR-AUC on an artificial 50/50 set can still be misleading for live bank rates.

**Why the high F1?** Strong separation likely relates partly to the dataset design and its anonymized numeric structure. It is not evidence that operational fraud is solved. I would demand a representative out-of-time validation sample before deployment.

**What about leakage?** ID never enters the feature matrix; one identical vector is excluded before splitting. StandardScaler fits only the training subset for logistic regression. There could still be unobservable leakage in original source generation.

**How did you choose business metrics?** Users see source class counts separately from model predictions; TP/FP/TN/FN are derived on held-out scores, and hypothetical impact separates prevalence/cost assumptions from test-set rates.

**Why avoid merchant or time trends?** Source has no timestamp, merchant, customer, geography or other categorical fields. Making them up would make the report unreliable.

**What does feature importance mean?** Global decrease in test average precision when an anonymized V feature is permuted. It is not a statement about actual customer attributes or causation.

**How is it tested?** pytest exercises API routes, transformations, threshold behaviour, search, export, review persistence and inference. TypeScript bundle compiles and parses. Live browser walkthrough and mobile screenshots must be verified locally.

**What would you improve?** Deployed authentication/roles, managed Postgres, real event time, model drift calibration, secure observability, true prevalence testing, external test data, auditable investigation workflow and fair outcomes assessment.

**Most important caveat:** this is a student-built research prototype. There is no real banking integration, financial savings measure, or interviewed stakeholder sign-off.
