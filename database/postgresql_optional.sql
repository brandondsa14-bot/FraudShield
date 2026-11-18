-- OPTIONAL PostgreSQL example, not used for the packaged local demo.
-- This schema mirrors the tested SQLite schema; import a permitted user-generated CSV export.
CREATE TABLE IF NOT EXISTS transactions (
 id BIGINT PRIMARY KEY,
 amount NUMERIC(14,2) NOT NULL CHECK (amount>=0),
 label SMALLINT NOT NULL CHECK (label IN (0,1)),
 risk_score DOUBLE PRECISION NOT NULL CHECK (risk_score BETWEEN 0 AND 1),
 partition VARCHAR(10) NOT NULL CHECK(partition IN ('train','validation','test','excluded'))
);
CREATE INDEX IF NOT EXISTS idx_risk_score ON transactions(risk_score DESC);
CREATE TABLE IF NOT EXISTS reviews (
 transaction_id BIGINT PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
 status VARCHAR(14) NOT NULL CHECK(status IN ('unreviewed','investigating','escalated','cleared')),
 note VARCHAR(2000) NOT NULL DEFAULT '',
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS model_runs (
 run_id BIGSERIAL PRIMARY KEY,
 name TEXT NOT NULL,
 train_rows INTEGER NOT NULL,
 chosen BOOLEAN NOT NULL,
 test_pr_auc DOUBLE PRECISION NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE VIEW v_review_queue AS SELECT t.*, COALESCE(r.status,'unreviewed') AS review_status,
 r.note, r.updated_at FROM transactions t LEFT JOIN reviews r ON t.id=r.transaction_id;
-- PostgreSQL is not required to run the packaged demo or its tested API.
-- Import with: \copy transactions(id,amount,label,risk_score,partition) FROM 'derived_index.csv' WITH CSV HEADER
