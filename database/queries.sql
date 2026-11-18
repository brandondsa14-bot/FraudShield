-- FraudShield's real SQLite analytics queries. Open with: sqlite3 database/fraudshield.sqlite
-- All inputs in the API are parameters, never interpolated as executable SQL.

-- Q01 Executive KPI: sourced from transactions (not hard-coded).
SELECT COUNT(*) transactions, SUM(label) fraud_label_count,
       ROUND(100.0*AVG(label),2) fraud_label_pct, ROUND(SUM(amount),2) total_amount
FROM transactions;

-- Q02 CASE + GROUP BY: amount bands used in Analytics page.
SELECT CASE WHEN amount<5000 THEN '0–5k' WHEN amount<10000 THEN '5–10k'
 WHEN amount<15000 THEN '10–15k' WHEN amount<20000 THEN '15–20k' ELSE '20k+' END amount_band,
 COUNT(*) AS records, SUM(label) AS fraud_label_count,
 ROUND(100.0*AVG(label),2) AS fraud_label_pct
FROM transactions GROUP BY amount_band ORDER BY MIN(amount);

-- Q03 JOIN: analyst queue + persisted simulated reviews (no invented customer dimension).
SELECT t.id,t.amount,t.risk_score,t.label,
       COALESCE(r.status,'unreviewed') review_status,r.note
FROM transactions t LEFT JOIN reviews r ON r.transaction_id=t.id
WHERE t.risk_score >= 0.50 ORDER BY t.risk_score DESC LIMIT 20;

-- Q04 CTE: held-out model alerts, known labels versus model decisions.
WITH decisions AS (
 SELECT id,label, risk_score, CASE WHEN risk_score>=0.50 THEN 1 ELSE 0 END flagged
 FROM transactions WHERE partition='test')
SELECT SUM(CASE WHEN label=1 AND flagged=1 THEN 1 ELSE 0 END) tp,
 SUM(CASE WHEN label=0 AND flagged=0 THEN 1 ELSE 0 END) tn,
 SUM(CASE WHEN label=0 AND flagged=1 THEN 1 ELSE 0 END) fp,
 SUM(CASE WHEN label=1 AND flagged=0 THEN 1 ELSE 0 END) fn
FROM decisions;

-- Q05 HAVING: bins with at least 1000 records for stable descriptive statistics.
SELECT CAST(risk_score*10 AS INT) risk_decile, COUNT(*) records,
 ROUND(AVG(label),3) share_labelled_fraud
FROM transactions GROUP BY risk_decile HAVING COUNT(*) >= 1000 ORDER BY risk_decile;

-- Q06 Window functions: rank model alerts within an evaluation split, not by timeline.
SELECT id,partition,risk_score,
 ROW_NUMBER() OVER(PARTITION BY partition ORDER BY risk_score DESC,id) alert_rank,
 ROUND(AVG(risk_score) OVER(PARTITION BY partition),4) split_average_risk
FROM transactions WHERE partition='test' ORDER BY alert_rank LIMIT 15;

-- Q07 Subquery: transactions with above-average risk within their actual source label.
SELECT id,amount,label,risk_score FROM transactions t
WHERE risk_score > (SELECT AVG(risk_score) FROM transactions t2 WHERE t2.label=t.label)
ORDER BY risk_score DESC LIMIT 15;

-- Q08 Data quality: cardinality and legal-value checks.
SELECT COUNT(*) total,COUNT(DISTINCT id) distinct_ids,
 SUM(CASE WHEN amount<0 OR risk_score<0 OR risk_score>1 OR label NOT IN (0,1) THEN 1 ELSE 0 END) invalid
FROM transactions;

-- Q09 View: reusable saved review queue.
SELECT id, risk_score,review_status FROM v_review_queue
WHERE review_status!='unreviewed' ORDER BY risk_score DESC LIMIT 25;

-- Q10 Join model lineage to derived predictions; no artificial relationship.
SELECT m.name model_name,m.train_rows,m.test_pr_auc,COUNT(t.id) AS test_records
FROM model_runs m JOIN transactions t ON t.partition='test'
WHERE m.chosen=1 GROUP BY m.run_id,m.name,m.train_rows,m.test_pr_auc;
