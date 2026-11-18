# User Guide — FraudShield

## Start the local prototype
In the ZIP project's top-level folder: create a Python virtual environment, install `backend/requirements.txt`, and run `python -m uvicorn backend.main:app --reload`. Open http://127.0.0.1:8000 . The archive already contains the derived SQLite index, selected model and precompiled frontend; original Kaggle CSV is **not** required for first launch. Do not delete the SQLite file until you have the CSV ready to regenerate it.

## Six navigable pages
1. **Overview:** real source totals, held-out model scorecard, full-data risk histogram, adjustable alert threshold.
2. **Transactions:** search by numeric ID, filter amount / class / score / dataset split; change order; open a row, paginate, export filtered CSV.
3. **Alert investigation:** raises minimum score to current threshold, shows flagged queue; click a row, select a **simulated** status, enter a note and save to your local database.
4. **Analytics & insights:** amount-band class comparison, amount histograms, feature-to-label correlations, selected model permutation importance and interpretation caveats.
5. **Model decision lab:** move threshold to recompute held-out TP/TN/FP/FN and precision/recall; change assumed fraud prevalence/costs to update **illustrative** costs per 10,000 records.
6. **Data & documentation:** source dictionary, actual checks, requirements/documentation index and limitations.

## What labels mean
- `Known label` = supplied Kaggle class (0/1).
- `Model risk score` = estimated probability produced by training pipeline.
- `Review status` = locally saved simulated investigation; not a verified fraud case outcome.
- `Data split` = train / validation / independent test / excluded exact duplicate.
- A threshold of 50% flags scores >= 0.50, not 50% of transactions.
- Amount field is in unspecified source units; the UI displays the numerical amount without a verified currency symbol. For stakeholder presentation, clarify that real currency is not established.

## Import your own original Kaggle file to reproduce outputs
Put the downloaded CSV at `data/creditcard_2023.csv` (never commit it) and run `python scripts/build_data.py --csv data/creditcard_2023.csv`. The script fully rebuilds the derived database and trained model; it removes local review notes, so back up the DB if needed.

## API specification
Visit http://127.0.0.1:8000/docs for interactive FastAPI OpenAPI information. `/api/predict` requires a JSON object with `amount` and `features` dictionary containing **exactly V1 through V28**. It is a real model inference endpoint, but UI focuses on stored dataset records for investigation.

## Troubleshooting
- Port occupied: stop the earlier process; use `--port 8001` if necessary and open corresponding URL.
- `uvicorn` missing: activate `.venv`, rerun `pip install -r backend/requirements.txt`.
- `model_ready: false`: re-run `scripts/build_data.py` with the source CSV.
- React UI blank: open browser Developer Tools Console and check requests for `/vendor/*`, `/assets/*`, `/api/health`; `frontend/dist` is the precompiled build.
- Raw Kaggle CSV should remain outside public repository. The ZIP includes only a derived score index plus model files; licensing should be checked before redistribution.
