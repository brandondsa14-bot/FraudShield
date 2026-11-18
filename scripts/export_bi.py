"""Create compact Power BI/Tableau CSV exports from the derived SQLite analytics."""
import csv, sqlite3
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'bi/exports';out.mkdir(parents=True,exist_ok=True)
with sqlite3.connect(ROOT/'database/fraudshield.sqlite') as db:
 for name,sql in {
    'amount_bands':"""SELECT CASE WHEN amount<5000 THEN '0–5k' WHEN amount<10000 THEN '5–10k' WHEN amount<15000 THEN '10–15k' WHEN amount<20000 THEN '15–20k' ELSE '20k+' END band, COUNT(*) total, SUM(label) fraud_label_count, SUM(amount) amount_total FROM transactions GROUP BY band ORDER BY MIN(amount)""",
    'risk_deciles':'SELECT MIN(9,CAST(risk_score*10 AS INTEGER)) risk_decile, COUNT(*) records, SUM(label) fraud_labels FROM transactions GROUP BY risk_decile ORDER BY risk_decile',
    'model_partition':'SELECT partition, COUNT(*) records, SUM(label) fraud_labels, ROUND(AVG(risk_score),5) mean_risk FROM transactions GROUP BY partition',
 }.items():
    cur=db.execute(sql)
    with open(out/f'{name}.csv','w',newline='') as f:
      w=csv.writer(f);w.writerow([c[0] for c in cur.description]);w.writerows(cur)
    print(out/f'{name}.csv')
