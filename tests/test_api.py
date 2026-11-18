import csv
import io
import numpy as np
from fastapi.testclient import TestClient
from backend.main import app,test_counts as calculate_test_counts
client=TestClient(app)

def test_health():
    d=client.get('/api/health').json()
    assert d['status']=='ok' and d['database_ready'] and d['model_ready']

def test_overview_and_insights():
    j=client.get('/api/overview').json()
    assert j['dataset']['total']==568630
    assert j['dataset']['labelled_fraud']==284315
    assert j['alerts']['flagged']>=j['alerts']['false_positives']
    assert len(client.get('/api/insights').json()['bands'])==5

def test_quality_and_models():
    q=client.get('/api/quality').json()
    assert q['quality']['duplicate_feature_vectors']==1
    assert all(x['passed'] for x in q['checks'])
    m=client.get('/api/models').json()
    assert m['selected'] in m['models']
    assert m['models'][m['selected']]['test']['f1']>.9

def test_threshold_changes():
    x=client.get('/api/decision',params={'threshold':.15}).json()['metrics']
    y=client.get('/api/decision',params={'threshold':.85}).json()['metrics']
    assert x['flagged']>=y['flagged']
    assert x['recall']>=y['recall']
    assert x['fp']>=y['fp']
    assert calculate_test_counts(.5)['tested']==85295

def test_pagination_search_filter_sort():
    d=client.get('/api/transactions',params={'page_size':7,'label':1,'sort':'id','direction':'asc'}).json()
    assert d['total']==284315 and len(d['rows'])==7
    assert [x['id'] for x in d['rows']]==sorted(x['id'] for x in d['rows'])
    record=d['rows'][0]
    found=client.get('/api/transactions',params={'q':str(record['id'])}).json()
    assert found['total']==1 and found['rows'][0]['label']==1
    assert client.get('/api/transactions',params={'q':'x'}).status_code==422
    assert client.get('/api/transactions',params={'sort':'DROP TABLE transactions'}).status_code==422

def test_transaction_detail_and_review_persistence():
    item=client.get('/api/transactions',params={'page_size':1}).json()['rows'][0]
    id=item['id']
    try:
        r=client.put(f'/api/reviews/{id}',json={'status':'investigating','note':'Follow up — simulated case'}).json()
        assert r['status']=='investigating'
        assert client.get(f'/api/transactions/{id}').json()['transaction']['note'].startswith('Follow up')
    finally:
        client.put(f'/api/reviews/{id}',json={'status':'unreviewed','note':''})
    assert client.get('/api/transactions/99999999999').status_code==404
    assert client.put(f'/api/reviews/{id}',json={'status':'bad','note':''}).status_code==422

def test_export_matches_filters():
    resp=client.get('/api/transactions/export',params={'q':'1'})
    assert resp.status_code==200 and 'attachment' in resp.headers['content-disposition']
    lines=list(csv.DictReader(io.StringIO(resp.text)))
    assert len(lines)==1 and lines[0]['id']=='1'

def test_model_inference_and_feature_validation():
    example={f'V{i}':0. for i in range(1,29)}
    p=client.post('/api/predict',json={'amount':123,'features':example})
    assert p.status_code==200 and 0<=p.json()['risk_score']<=1
    assert client.post('/api/predict',json={'amount':123,'features':{'V1':0}}).status_code==422
