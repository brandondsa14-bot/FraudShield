"""FraudShield educational fraud intelligence API; SQLite read-mostly local prototype."""
from __future__ import annotations
import csv
import io
import json
import sqlite3
from pathlib import Path
from typing import Literal

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

ROOT=Path(__file__).resolve().parents[1]
DB=ROOT/'database/fraudshield.sqlite'
MODEL=ROOT/'models/selected_model.joblib'
SCORES=ROOT/'models/heldout_scores.npz'
SUMMARY=ROOT/'analytics/summary.json'
DIST=ROOT/'frontend/dist'

app=FastAPI(title='FraudShield API',version='1.0.0',description='Student demonstration; predictions are not evidence of crime.')
app.add_middleware(CORSMiddleware,allow_origins=['http://localhost:5173','http://127.0.0.1:5173','http://localhost:8000','http://127.0.0.1:8000'],allow_methods=['GET','PUT','POST'],allow_headers=['*'])

def connection():
    if not DB.exists():raise HTTPException(503,'Derived database missing. Run python scripts/build_data.py --csv data/creditcard_2023.csv')
    conn=sqlite3.connect(DB,timeout=15)
    conn.row_factory=sqlite3.Row
    conn.execute('PRAGMA foreign_keys=ON')
    return conn

def summary():
    if not SUMMARY.exists():raise HTTPException(503,'Analytics summary missing. Re-run data build.')
    return json.loads(SUMMARY.read_text())

def rowdict(row):return dict(row) if row is not None else None

@app.get('/api/health')
def health():
    return {'status':'ok','database_ready':DB.exists(),'model_ready':MODEL.exists(),'scored_evaluation_ready':SCORES.exists(),'data_mode':'derived index from original Kaggle CSV'}

@app.get('/api/overview')
def overview(threshold:float=Query(.5,ge=0,le=1)):
    with connection() as db:
        overview_record=rowdict(db.execute('SELECT COUNT(*) AS total, SUM(label) AS labelled_fraud, SUM(amount) AS total_amount, AVG(risk_score) AS average_risk FROM transactions').fetchone())
        alert_record=rowdict(db.execute('''SELECT COUNT(*) AS flagged, COALESCE(SUM(CASE WHEN label=0 THEN 1 ELSE 0 END),0) AS false_positives,
          COALESCE(SUM(CASE WHEN label=1 THEN 1 ELSE 0 END),0) AS true_positives
          FROM transactions WHERE risk_score>=?''',(threshold,)).fetchone())
        rows=[rowdict(r) for r in db.execute('''SELECT CAST(MIN(9, risk_score*10) AS INTEGER) AS bucket,
            COUNT(*) AS transactions,SUM(label) AS fraud_labels FROM transactions GROUP BY bucket ORDER BY bucket''')]
        statuses=[rowdict(r) for r in db.execute('SELECT status,COUNT(*) AS count FROM reviews GROUP BY status')]
    q=summary()
    return {'dataset':{**overview_record,'legitimate':overview_record['total']-overview_record['labelled_fraud'],
              'fraud_rate':overview_record['labelled_fraud']/overview_record['total']},
            'alerts':alert_record,'threshold':threshold,'risk_histogram':rows,'review_statuses':statuses,
            'model':{'name':q['selected_model'],'heldout':q['models'][q['selected_model']]['test']},
            'scope':'Alert counts include all model-scored records, including training rows; evaluation metrics use held-out test only.'}

@app.get('/api/insights')
def insights():
    with connection() as db:
        rows=[rowdict(r) for r in db.execute('''SELECT CASE WHEN amount<5000 THEN '0–5k' WHEN amount<10000 THEN '5–10k'
           WHEN amount<15000 THEN '10–15k' WHEN amount<20000 THEN '15–20k' ELSE '20k+' END AS band,
           MIN(CAST(amount/5000 AS INTEGER),4) AS band_order, COUNT(*) AS total, SUM(label) AS labelled_fraud,
           AVG(risk_score) AS average_score, SUM(amount) AS total_amount
           FROM transactions GROUP BY band,band_order ORDER BY band_order''')]
    q=summary()
    return {'bands':rows,'correlations':q['feature_correlations'][:12],
            'importances':q['feature_importances'][:12],'importance_explanation':q['feature_importance_explanation'],
            'amount_stats':q['quality']['amount_stats'],'histograms':q['amount_hist'],'hist_bins':q['amount_hist_bins'],
            'warning':'Anonymized V features cannot be mapped to specific customer behaviours; no timestamps or geographical fields.'}

@app.get('/api/quality')
def quality():
    q=summary()
    return {'quality':q['quality'],'methodology':q['methodology'],'source':q['source'],
            'checks':[{'name':'Expected row count','passed':q['quality']['source_rows']==568630},
              {'name':'31-column schema','passed':q['quality']['columns']==31},
              {'name':'No null values','passed':q['quality']['missing_cells']==0},
              {'name':'Unique transaction IDs','passed':q['quality']['duplicate_ids']==0},
              {'name':'Nonnegative amounts','passed':q['quality']['negative_amounts']==0},
              {'name':'Duplicate feature vectors identified','passed':True,'detail':f"{q['quality']['duplicate_feature_vectors']} excluded from model splits"},
              {'name':'Balanced classes verified','passed':q['quality']['class_counts'].get('0')==q['quality']['class_counts'].get('1')}]}

@app.get('/api/models')
def models():
    q=summary()
    return {'selected':q['selected_model'],'models':q['models'],'curves':q['curves'],
            'methodology':q['methodology'],'importances':q['feature_importances'][:10]}

def test_counts(threshold):
    if not SCORES.exists():raise HTTPException(503,'Heldout score file missing')
    with np.load(SCORES) as data:
        y=data['label'];scores=data['score']
        pred=scores>=threshold
        tp=int(np.count_nonzero(pred&(y==1)))
        tn=int(np.count_nonzero((~pred)&(y==0)))
        fp=int(np.count_nonzero(pred&(y==0)))
        fn=int(np.count_nonzero((~pred)&(y==1)))
    p=tp/(tp+fp) if tp+fp else 0.0
    r=tp/(tp+fn) if tp+fn else 0.0
    return {'tp':tp,'tn':tn,'fp':fp,'fn':fn,'flagged':tp+fp,'tested':tp+tn+fp+fn,
            'precision':p,'recall':r,'f1':2*p*r/(p+r) if p+r else 0.0,
            'accuracy':(tp+tn)/(tp+tn+fp+fn),'fpr':fp/(tn+fp) if tn+fp else 0.0,
            'fnr':fn/(tp+fn) if tp+fn else 0.0,'threshold':threshold}

@app.get('/api/decision')
def decision(threshold:float=Query(.5,ge=0,le=1),prevalence:float=Query(.01,ge=.0001,le=.5),
             review_cost:float=Query(2,ge=0,le=100000),missed_cost:float=Query(150,ge=0,le=1000000),
             volume:int=Query(10000,ge=100,le=1000000)):
    c=test_counts(threshold)
    legitimate=volume*(1-prevalence);fraud=volume*prevalence
    est_fp=legitimate*c['fpr'];est_tp=fraud*c['recall'];est_fn=fraud*c['fnr']
    return {'metrics':c,'scenario':{'prevalence':prevalence,'review_cost':review_cost,'missed_cost':missed_cost,'volume':volume,
            'flagged':est_fp+est_tp,'false_alarms':est_fp,'estimated_missed_fraud':est_fn,'expected_review_cost':(est_fp+est_tp)*review_cost,
            'expected_missed_fraud_cost':est_fn*missed_cost,
            'total_hypothetical_cost':(est_fp+est_tp)*review_cost+est_fn*missed_cost},
            'disclaimer':'Illustrative scenario: rates estimated from an artificially balanced dataset; costs and operational fraud prevalence are assumptions, not observed savings.'}

SORTABLE={'id':'t.id','amount':'t.amount','risk_score':'t.risk_score','label':'t.label','partition':'t.partition','review_status':'COALESCE(r.status,\'unreviewed\')'}

def filtered_query(q, label, min_amount, max_amount, risk_min, risk_max, threshold, status, partition):
    where=[];params=[]
    if q is not None and str(q).strip():
        if not str(q).strip().isdigit():raise HTTPException(422,'Transaction search accepts numeric ID only')
        where.append('t.id=?');params.append(int(str(q).strip()))
    if label is not None:where.append('t.label=?');params.append(label)
    if min_amount is not None:where.append('t.amount>=?');params.append(min_amount)
    if max_amount is not None:where.append('t.amount<=?');params.append(max_amount)
    if risk_min is not None:where.append('t.risk_score>=?');params.append(risk_min)
    if risk_max is not None:where.append('t.risk_score<=?');params.append(risk_max)
    if threshold is not None:where.append('t.risk_score>=?');params.append(threshold)
    if status is not None:where.append("COALESCE(r.status,'unreviewed')=?");params.append(status)
    if partition is not None:where.append('t.partition=?');params.append(partition)
    return (' WHERE '+' AND '.join(where) if where else ''),params

@app.get('/api/transactions')
def transactions(page:int=Query(1,ge=1),page_size:int=Query(12,ge=1,le=100),q:str|None=None,
                 label:int|None=Query(None,ge=0,le=1),min_amount:float|None=Query(None,ge=0),
                 max_amount:float|None=Query(None,ge=0),risk_min:float|None=Query(None,ge=0,le=1),
                 risk_max:float|None=Query(None,ge=0,le=1),threshold:float|None=Query(None,ge=0,le=1),
                 status:Literal['unreviewed','investigating','escalated','cleared']|None=None,
                 partition:Literal['train','validation','test','excluded']|None=None,
                 sort:Literal['id','amount','risk_score','label','partition','review_status']='risk_score',
                 direction:Literal['asc','desc']='desc'):
    where,params=filtered_query(q,label,min_amount,max_amount,risk_min,risk_max,threshold,status,partition)
    joins=' FROM transactions t LEFT JOIN reviews r ON t.id=r.transaction_id '
    with connection() as db:
        count=db.execute('SELECT COUNT(*)'+joins+where,params).fetchone()[0]
        query=('''SELECT t.id,t.amount,t.label,t.risk_score,t.partition,
                 COALESCE(r.status,'unreviewed') AS review_status,r.note,r.updated_at'''+joins+where+
                 f' ORDER BY {SORTABLE[sort]} {direction.upper()}, t.id ASC LIMIT ? OFFSET ?')
        rows=[rowdict(r) for r in db.execute(query,[*params,page_size,(page-1)*page_size])]
    return {'rows':rows,'total':count,'page':page,'page_size':page_size,'pages':(count+page_size-1)//page_size}

@app.get('/api/transactions/export')
def export_transactions(q:str|None=None,label:int|None=Query(None,ge=0,le=1),min_amount:float|None=Query(None,ge=0),
                        max_amount:float|None=Query(None,ge=0),risk_min:float|None=Query(None,ge=0,le=1),
                        risk_max:float|None=Query(None,ge=0,le=1),threshold:float|None=Query(None,ge=0,le=1),
                        status:Literal['unreviewed','investigating','escalated','cleared']|None=None,
                        partition:Literal['train','validation','test','excluded']|None=None):
    where,params=filtered_query(q,label,min_amount,max_amount,risk_min,risk_max,threshold,status,partition)
    query='''SELECT t.id,t.amount,t.label,t.risk_score,t.partition,COALESCE(r.status,'unreviewed')
              FROM transactions t LEFT JOIN reviews r ON t.id=r.transaction_id'''+where+' ORDER BY t.risk_score DESC'
    def stream():
        db=connection()
        try:
            buff=io.StringIO();writer=csv.writer(buff)
            writer.writerow(['id','amount','known_class','model_risk_score','partition','review_status'])
            yield buff.getvalue();buff.seek(0);buff.truncate(0)
            cursor=db.execute(query,params)
            while rows:=cursor.fetchmany(600):
                for r in rows:writer.writerow(list(r))
                yield buff.getvalue();buff.seek(0);buff.truncate(0)
        finally: db.close()
    return StreamingResponse(stream(),media_type='text/csv',headers={'Content-Disposition':'attachment; filename="fraudshield_filtered_transactions.csv"'})

@app.get('/api/transactions/{transaction_id}')
def transaction_detail(transaction_id:int):
    with connection() as db:
        row=db.execute('''SELECT t.id,t.amount,t.label,t.risk_score,t.partition,
             COALESCE(r.status,'unreviewed') AS review_status,r.note,r.updated_at
             FROM transactions t LEFT JOIN reviews r ON t.id=r.transaction_id WHERE t.id=?''',(transaction_id,)).fetchone()
    if row is None:raise HTTPException(404,'Transaction ID not found')
    return {'transaction':rowdict(row),'explanation':'Risk score is a model estimate. The distributed derived index omits raw anonymized V1–V28 feature vectors; individual causal explanations are unavailable.','global_importances':summary()['feature_importances'][:6]}

class ReviewUpdate(BaseModel):
    status:Literal['unreviewed','investigating','escalated','cleared']
    note:str=Field('',max_length=2000)

@app.put('/api/reviews/{transaction_id}')
def save_review(transaction_id:int,body:ReviewUpdate):
    with connection() as db:
        exists=db.execute('SELECT 1 FROM transactions WHERE id=?',(transaction_id,)).fetchone()
        if not exists:raise HTTPException(404,'Transaction not found')
        db.execute('''INSERT INTO reviews(transaction_id,status,note) VALUES(?,?,?) ON CONFLICT(transaction_id)
             DO UPDATE SET status=excluded.status,note=excluded.note,updated_at=datetime('now')''',
             (transaction_id,body.status,body.note))
        db.commit()
        row=db.execute('SELECT * FROM reviews WHERE transaction_id=?',(transaction_id,)).fetchone()
    return rowdict(row)

class Prediction(BaseModel):
    amount:float=Field(ge=0)
    features:dict[str,float]

@app.post('/api/predict')
def predict(body:Prediction):
    names=[f'V{i}' for i in range(1,29)]
    if set(body.features)!=set(names):raise HTTPException(422,'Exactly V1 through V28 are required')
    if not MODEL.exists():raise HTTPException(503,'Trained model missing')
    import math
    v=[body.features[k] for k in names]+[body.amount]
    if not all(math.isfinite(x) for x in v):raise HTTPException(422,'Finite numeric values required')
    try:score=float(joblib.load(MODEL).predict_proba(np.asarray([v],dtype=np.float32))[0,1])
    except Exception:raise HTTPException(500,'Model inference failed')
    return {'risk_score':score,'is_flagged_at_default_threshold':score>=.5,
            'disclaimer':'Demonstration model estimate based on anonymized numeric features, not proof of fraud.'}

@app.get('/api/reports')
def reports():
    return {'documentation':[{'title':'Business requirements','file':'docs/BRD.md'},
              {'title':'Architecture & SQL','file':'docs/ARCHITECTURE.md'},
              {'title':'Data science methodology','file':'docs/METHODOLOGY.md'},
              {'title':'Test plan & UAT','file':'docs/TEST_PLAN.md'},
              {'title':'Recruiter interview guide','file':'docs/INTERVIEW_GUIDE.md'}]}

# One host / one command local demo; API routes stay available under /api.
if DIST.is_dir():
    assets=DIST/'assets'
    vendor=DIST/'vendor'
    if assets.is_dir():app.mount('/assets',StaticFiles(directory=assets),name='assets')
    if vendor.is_dir():app.mount('/vendor',StaticFiles(directory=vendor),name='vendor')
    @app.get('/')
    def home():return FileResponse(DIST/'index.html')
    @app.get('/{route:path}')
    def page(route:str):
        if route.startswith('api/'):raise HTTPException(404,'Not found')
        return FileResponse(DIST/'index.html')
