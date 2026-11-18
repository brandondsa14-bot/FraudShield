"""Reproducible data, model and analytics build from the original Kaggle CSV.

Run: python scripts/build_data.py --csv data/creditcard_2023.csv
Stores derived scored data (not the original feature vectors) in a portable SQLite file.
"""
from __future__ import annotations
import argparse
import json
import sqlite3
import hashlib
from pathlib import Path
import time

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
                             average_precision_score, confusion_matrix, roc_curve, precision_recall_curve,
                             brier_score_loss)
from sklearn.inspection import permutation_importance

ROOT = Path(__file__).resolve().parents[1]
FEATURES = [f'V{i}' for i in range(1,29)] + ['Amount']
BANDS = [0, 5000, 10000, 15000, 20000, float('inf')]

def safe_json(obj):
    if isinstance(obj, (np.integer,)): return int(obj)
    if isinstance(obj, (np.floating,)): return float(obj)
    if isinstance(obj, (np.ndarray,)): return obj.tolist()
    if isinstance(obj, Path): return str(obj)
    raise TypeError(str(type(obj)))

def evaluate(y, scores, threshold=.5):
    preds = scores >= threshold
    tn, fp, fn, tp = [int(v) for v in confusion_matrix(y, preds, labels=[0,1]).ravel()]
    return {'accuracy':float(accuracy_score(y,preds)), 'precision':float(precision_score(y,preds,zero_division=0)),
            'recall':float(recall_score(y,preds,zero_division=0)), 'f1':float(f1_score(y,preds,zero_division=0)),
            'roc_auc':float(roc_auc_score(y,scores)), 'pr_auc':float(average_precision_score(y,scores)),
            'fpr':fp/(fp+tn), 'fnr':fn/(fn+tp), 'brier':float(brier_score_loss(y,scores)),
            'tp':tp,'tn':tn,'fp':fp,'fn':fn,'flagged':tp+fp,'sample_size':len(y)}

def curve_samples(x, y, maxpoints=110):
    idx=np.unique(np.linspace(0,len(x)-1,min(maxpoints,len(x)),dtype=int))
    return [{'x':round(float(x[i]),5),'y':round(float(y[i]),5)} for i in idx]

def build(csv_path):
    start=time.time()
    print('Reading actual uploaded CSV:',csv_path,flush=True)
    source_sha256=hashlib.sha256()
    with open(csv_path,'rb') as fh:
        for block in iter(lambda:fh.read(4*1024*1024),b''):
            source_sha256.update(block)
    df=pd.read_csv(csv_path,low_memory=False)
    expected=['id',*FEATURES,'Class']
    if list(df.columns)!=expected: raise ValueError(f'Unexpected schema: {list(df.columns)}')
    if len(df)!=568630: raise ValueError(f'Expected 568630 records, found {len(df)}')
    if set(df.Class.unique()) != {0,1} or not df.id.is_unique: raise ValueError('Invalid classes or ids')
    if not np.isfinite(df[FEATURES].to_numpy()).all(): raise ValueError('Invalid or nonfinite features')
    labels=df.Class.to_numpy(dtype='int8')
    feats=df[FEATURES].to_numpy(dtype='float32')
    duplicate_mask=df.duplicated(subset=FEATURES,keep='first')
    duplicate_features=int(duplicate_mask.sum())
    clean_ids=np.flatnonzero(~duplicate_mask.to_numpy())
    t_idx, eval_idx=train_test_split(clean_ids,test_size=.30,stratify=labels[clean_ids],random_state=42)
    v_idx, test_idx=train_test_split(eval_idx,test_size=.50,stratify=labels[eval_idx],random_state=42)
    partition=np.full(len(df),'train',dtype='<U10')
    partition[v_idx]='validation';partition[test_idx]='test';partition[duplicate_mask.to_numpy()]='excluded'
    print('Split sizes', {p:int((partition==p).sum()) for p in ['train','validation','test','excluded']},flush=True)
    # Logistic regression baseline trains on the complete training split; histogram boosting
    # deliberately caps training rows for reproducible CPU-only builds on student laptops.
    candidates={
      'Logistic regression':make_pipeline(StandardScaler(),LogisticRegression(max_iter=180,random_state=42)),
      'Histogram gradient boosting':HistGradientBoostingClassifier(max_iter=105,max_leaf_nodes=19,max_depth=7,
         learning_rate=.10,l2_regularization=1.,random_state=42,early_stopping=True,validation_fraction=.12)
    }
    train_sub=np.random.default_rng(42).choice(t_idx,size=min(len(t_idx),170000),replace=False)
    results={}; fitted={};val_scores={}
    for name,estimator in candidates.items():
        sample=train_sub if name.startswith('Histogram') else t_idx
        print('Training',name,len(sample),flush=True)
        estimator.fit(feats[sample],labels[sample])
        val=estimator.predict_proba(feats[v_idx])[:,1]
        test=estimator.predict_proba(feats[test_idx])[:,1]
        results[name]={'train_rows':int(len(sample)),'validation':evaluate(labels[v_idx],val),'test':evaluate(labels[test_idx],test)}
        fitted[name]=estimator;val_scores[name]=val
        print(name,'validation AP',results[name]['validation']['pr_auc'],'test',results[name]['test']['f1'],flush=True)
    chosen=max(candidates,key=lambda k:results[k]['validation']['pr_auc'])
    selected=fitted[chosen]
    print('Selected',chosen,flush=True)
    scores_all=selected.predict_proba(feats)[:,1].astype('float32')
    test_scores=scores_all[test_idx]
    roc_fpr,roc_tpr,_=roc_curve(labels[test_idx],test_scores)
    pr_precision,pr_recall,_=precision_recall_curve(labels[test_idx],test_scores)
    # Interpret anonymized predictors statistically, without claiming their domain meaning.
    corr=df[FEATURES+['Class']].corr(numeric_only=True)['Class'].drop('Class').sort_values(key=abs,ascending=False)
    if chosen=='Logistic regression':
        weights=np.abs(selected[-1].coef_[0]); importance=weights/weights.sum()
        importance_info='Absolute standardized logistic-regression coefficients (global association, not causality).'
    else:
        sub=np.random.default_rng(123).choice(test_idx,size=min(1500,len(test_idx)),replace=False)
        perm=permutation_importance(selected,feats[sub],labels[sub],n_repeats=2,random_state=42,
                                    scoring='average_precision',n_jobs=1)
        weights=np.maximum(0,perm.importances_mean);importance=weights/max(weights.sum(),1e-12)
        importance_info='Permutation importance: drop in average precision after shuffling one feature (1500 held-out rows, 2 repeats).'
    feature_importances=sorted([{'feature':f,'value':round(float(v),5)} for f,v in zip(FEATURES,importance)],
                               key=lambda x:x['value'],reverse=True)
    quality={'source_rows':int(len(df)),'columns':int(df.shape[1]),'missing_cells':int(df.isna().sum().sum()),
             'duplicate_ids':int(df.id.duplicated().sum()),'duplicate_feature_vectors':duplicate_features,
             'negative_amounts':int((df.Amount<0).sum()),'class_counts':df.Class.value_counts().sort_index().to_dict(),
             'unique_ids':int(df.id.nunique()),'no_timestamps':True,'no_merchants':True,
             'schema':expected,'split_counts':{k:int((partition==k).sum()) for k in ('train','validation','test','excluded')},
             'amount_total':float(df.Amount.sum()),'amount_mean':float(df.Amount.mean()),
             'amount_median':float(df.Amount.median()),'amount_min':float(df.Amount.min()),'amount_max':float(df.Amount.max()),
             'amount_stats':{str(i):{'count':int(z.shape[0]),'mean':float(z.Amount.mean()),'median':float(z.Amount.median()),'total':float(z.Amount.sum())}
                 for i,z in df.groupby('Class')}}
    summary={'uploaded_csv_sha256':source_sha256.hexdigest(),'generated_from':'creditcard_2023.csv','source':'https://www.kaggle.com/datasets/nelgiriyewithana/credit-card-fraud-detection-dataset-2023',
             'quality':quality,'selected_model':chosen,'models':results,'feature_importances':feature_importances,
             'feature_importance_explanation':importance_info,
             'feature_correlations': [{'feature':f,'correlation':float(v)} for f,v in corr.items()],
             'curves':{'roc':curve_samples(roc_fpr,roc_tpr),'pr':curve_samples(pr_recall,pr_precision)},
             'methodology':{'split':'Stratified 70/15/15; 42 seed; identical feature vector duplicates removed prior to splitting',
                 'model_selection':'Highest validation average precision',
                 'test':'Test set never used for model selection; report at 0.50 threshold',
                 'features':'V1–V28 and Amount; id and Class excluded from training',
                 'caveat':'50/50 synthetic/balanced class sample; test metrics are not real-world operating performance'},
             'amount_hist':{str(c):np.histogram(df[df.Class==c].Amount,bins=25,range=(0,25000))[0].tolist() for c in [0,1]},
             'amount_hist_bins':np.linspace(0,25000,26).tolist()}
    ROOT.joinpath('models').mkdir(exist_ok=True);ROOT.joinpath('database').mkdir(exist_ok=True)
    joblib.dump(selected,ROOT/'models/selected_model.joblib',compress=3)
    np.savez_compressed(ROOT/'models/heldout_scores.npz',label=labels[test_idx],score=test_scores)
    (ROOT/'analytics/summary.json').write_text(json.dumps(summary,indent=2,default=safe_json))
    # Only an aggregate/derived scored transaction index is redistributed, never the
    # original V1-V28 vectors. Class and amount retained for educational investigation.
    db=ROOT/'database/fraudshield.sqlite'
    if db.exists():db.unlink()
    conn=sqlite3.connect(db)
    conn.executescript((ROOT/'database/schema.sql').read_text())
    rows=zip((int(x) for x in df.id.to_numpy()),(float(x) for x in df.Amount.to_numpy()),
             (int(x) for x in labels),(float(x) for x in scores_all),(str(x) for x in partition))
    cur=conn.cursor()
    cur.executemany('INSERT INTO transactions(id, amount, label, risk_score, partition) VALUES(?,?,?,?,?)',rows)
    cur.execute('INSERT INTO model_runs(name, train_rows, chosen, test_pr_auc) VALUES(?,?,?,?)',
                (chosen,results[chosen]['train_rows'],1,results[chosen]['test']['pr_auc']))
    conn.commit();conn.close()
    print('Saved model + held-out scores + derived SQLite, elapsed sec',round(time.time()-start,1),flush=True)
    return summary

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--csv',default=str(ROOT/'data/creditcard_2023.csv'))
    build(Path(p.parse_args().csv))
