# Data science methodology & evidence

## Source and provenance
**Uploaded user dataset:** `creditcard_2023.csv` from Nidula Elgiriyewithana, *Credit Card Fraud Detection Dataset 2023*, Kaggle: https://www.kaggle.com/datasets/nelgiriyewithana/credit-card-fraud-detection-dataset-2023 , DOI: https://doi.org/10.34740/KAGGLE/DSV/6492730 . Checked against the actual user-supplied ZIP, not a synthetic replacement created here.

**Caution:** although the upload is named 2023, there is **no timestamp column** and the record dates are unknown. The exactly balanced classes, anonymized components and unusually clean separation are consistent with a heavily curated/artificially balanced benchmark. The **specific synthetic generation methodology and original provenance could not be independently verified** from the accessible Kaggle page. Do not assert that all records represent authentic 2023 card activity. The separate, much older and highly imbalanced ULB 2013 dataset must not be conflated with this version. Before public redistribution, inspect original Kaggle dataset licensing.

## Validated data checks
- 568,630 records × 31 columns; id, V1–V28, Amount, Class.
- 284,315 label 0; 284,315 label 1, exactly 50%/50%.
- 0 missing cells; 0 duplicate source IDs; 1 duplicated model-feature vector excluding ID.
- Nonnegative amounts; minimum 50.01, maximum 24,039.93; 6,847,418,369.75 total in unspecified source amount units.
- Mean amount for label 0 ≈ 12,026.31; label 1 ≈ 12,057.60. Difference ≈ 31.29, far smaller than the broad amount dispersion. Do not infer that higher amounts cause fraud.
- Pearson absolute correlations with known label strongest for anonymized V14, V12, V4 and V11 (see generated summary for signed values).

## Model development
1. Read and validate source schema; keep `id` only for display, never as a model feature.
2. Drop a duplicate V-feature vector **before** splitting to prevent identical vector leakage; retain that one record in the full scored demonstration index and mark `excluded`.
3. Seed 42; stratified split approximately 70% train, 15% validation, 15% held-out test: **398,040 / 85,294 / 85,295**, plus 1 excluded.
4. Baseline: `StandardScaler` + logistic regression trained on 398,040 training records. Alternative: histogram gradient boosting trained on a fixed random 170,000 subset of the training split (for laptop-friendly CPU time) with early stopping on an internal training partition.
5. Select by validation PR-AUC **only**. Evaluate both on the test set, unaltered, at a 0.50 threshold. Save winner and scored index. Runtime threshold is independent of training.
6. No feature-specific causality claims. Selected boosting model's global importance uses permutation AP loss on 1,500 held-out records, two repeats; it is approximate.

## Test results (actual run 2026-11-18)
| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | PR-AUC | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Logistic regression | 96.456% | 97.742% | 95.109% | 96.407% | 99.359% | 99.449% | 2.197% | 4.891% |
| **Histogram gradient boosting (selected)** | **99.729%** | **99.651%** | **99.808%** | **99.729%** | **99.987%** | **99.986%** | **0.349%** | **0.192%** |

At threshold 0.50, chosen model on 85,295 untouched test rows: **TP 42,565; TN 42,499; FP 149; FN 82**. These are benchmark values, **not real bank false-positive rates**. Precision–recall AUC can be dramatically affected by the test-set class prevalence. A model with 99% accuracy would still be unsuitable if it missed costly fraud; therefore confusion cells, precision/recall, ROC-AUC, PR-AUC and threshold sensitivity are shown together.

## Impact model assumptions (illustrative)
For chosen threshold t: `TPR=TP/(TP+FN)`, `FPR=FP/(TN+FP)` on independent held-out test. Let volume=10,000, assumed prevalence=p, cost per alert review=cR, assumed cost per missed fraud=cM.

Estimated flagged ≈ `volume * (p*TPR + (1-p)*FPR)`; estimated missed ≈ `volume*p*(1-TPR)`; illustrative cost ≈ `flagged*cR + missed*cM`. All amount units are unspecified. These are **scenario assumptions**, not observed savings or validated costs.

## Limitations and next safeguards
- Artificial/unknown case sampling invalidates real-world prevalence, calibration and generalization claims.
- Strong results might reflect benchmark construction and undisclosed leakage in the dataset generation process.
- Records have no dates: no seasonality, trending, or temporal train/test validation possible.
- No merchants, geographies, customer attributes or actual analyst decisions.
- Population-level permutation importance is not an individual explanation; add SHAP or calibrated local attribution with access to source features if legally appropriate.
- No post-deployment drift study, fairness audit, external bank validation, cost estimates, adversarial testing or human adjudication.
- Evaluate on genuinely representative, time-stamped and naturally imbalanced bank data before operational consideration.

Recreate: place the source CSV at `data/creditcard_2023.csv`, then `python scripts/build_data.py --csv data/creditcard_2023.csv`. This replaces model outputs and the derived local SQLite demonstration index; **back up any local simulated review notes** first.
