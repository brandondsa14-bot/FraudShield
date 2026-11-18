import sqlite3
from backend.main import DB

def test_sql_views_and_reconciliation():
    db=sqlite3.connect(DB)
    try:
        total,fraud=db.execute('SELECT COUNT(*),SUM(label) FROM transactions').fetchone()
        assert (total,fraud)==(568630,284315)
        n,fr=db.execute('SELECT SUM(transactions),SUM(fraud_labels) FROM v_amount_bands').fetchone()
        assert (n,fr)==(total,fraud)
        assert db.execute('PRAGMA foreign_key_list(reviews)').fetchall()
        assert db.execute('SELECT COUNT(*) FROM v_review_queue').fetchone()[0]==total
        m=db.execute('SELECT name FROM model_runs WHERE chosen=1').fetchone()
        assert m and 'gradient' in m[0].lower()
    finally:db.close()

def test_sql_cte_and_window_functions():
    db=sqlite3.connect(DB)
    try:
        query='''WITH ranked AS (SELECT id, ROW_NUMBER() OVER (ORDER BY risk_score DESC,id) rnk
                   FROM transactions WHERE partition='test') SELECT MIN(rnk),MAX(rnk),COUNT(*) FROM ranked'''
        assert db.execute(query).fetchone()==(1,85295,85295)
        assert db.execute("SELECT COUNT(*) FROM transactions WHERE risk_score>=0.5 AND partition='test'").fetchone()[0]==42714
    finally:db.close()
