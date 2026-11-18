# Optional Power BI & Tableau workflow

**No Power BI `.pbix` or Tableau `.twb` project was opened or verified in this Linux build environment.** Instead, the project includes an executable export script and documented metrics, so the user can build native BI visuals without inventing results.

Run `python scripts/export_bi.py` from the project root; this writes actual derived aggregated CSV exports in `bi/exports/`:
- `amount_bands.csv`: amount group, total records, fraud-labelled count, aggregate amount.
- `risk_deciles.csv`: model-score decile, count, fraud labels.
- `model_partition.csv`: dataset split counts, fraud labels, average model score.

Open Power BI Desktop (Windows) or Tableau (Mac/Windows), connect each CSV as a separate fact summary. **Do not JOIN these aggregate tables on arbitrary keys**; they have different grains. Define a distinct dashboard section for each dataset or source directly from SQLite / a PostgreSQL table if needed.

## Business KPIs and DAX (amount_bands table)
```dax
Total Transactions = SUM(amount_bands[total])
Fraud Label Records = SUM(amount_bands[fraud_label_count])
Dataset Fraud Label Share = DIVIDE([Fraud Label Records], [Total Transactions])
Recorded Amount = SUM(amount_bands[amount_total])
```

## Suggested views
1. Cards: Total Transactions, Fraud Label Records, Dataset Fraud Label Share.
2. Clustered bar: total records and fraud label records by source amount band; include correct axis units.
3. Column: number of model scores by decile (risk_deciles.csv), not a timeline.
4. Model partition: source train/validation/test counts (no invented monthly axis).
5. Information note: anonymized predictors, 50/50 class balance, no dates / merchants, source currency unverified.

**Reconciliation:** Sum of amount_bands total = 568,630 and fraud_label_count = 284,315. SQL source is `database/queries.sql`. Do not claim a Power BI dashboard was implemented/tested until you actually build one.
