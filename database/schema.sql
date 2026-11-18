PRAGMA journal_mode=DELETE;
PRAGMA foreign_keys=ON;
CREATE TABLE transactions (
 id INTEGER PRIMARY KEY,
 amount REAL NOT NULL CHECK(amount>=0),
 label INTEGER NOT NULL CHECK(label IN (0,1)),
 risk_score REAL NOT NULL CHECK(risk_score BETWEEN 0 AND 1),
 partition TEXT NOT NULL CHECK(partition IN ('train','validation','test','excluded'))
);
CREATE INDEX idx_transactions_score ON transactions(risk_score DESC);
CREATE INDEX idx_transactions_label ON transactions(label);
CREATE INDEX idx_transactions_amount ON transactions(amount);
CREATE INDEX idx_transactions_partition ON transactions(partition);
CREATE TABLE reviews (
 transaction_id INTEGER PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
 status TEXT NOT NULL CHECK(status IN ('unreviewed','investigating','escalated','cleared')),
 note TEXT NOT NULL DEFAULT '' CHECK(length(note)<=2000),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE model_runs (
 run_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, train_rows INTEGER NOT NULL,
 chosen INTEGER NOT NULL CHECK(chosen IN (0,1)), test_pr_auc REAL NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE VIEW v_amount_bands AS
 SELECT CASE WHEN amount<5000 THEN '0–5k' WHEN amount<10000 THEN '5–10k'
 WHEN amount<15000 THEN '10–15k' WHEN amount<20000 THEN '15–20k' ELSE '20k+' END AS band,
 COUNT(*) AS transactions, SUM(label) AS fraud_labels, ROUND(AVG(risk_score),4) AS mean_risk
 FROM transactions GROUP BY band;
CREATE VIEW v_review_queue AS
 SELECT t.id,t.amount,t.label,t.risk_score,t.partition,
 COALESCE(r.status,'unreviewed') AS review_status,r.note,r.updated_at
 FROM transactions t LEFT JOIN reviews r ON t.id=r.transaction_id;
