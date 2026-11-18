from fastapi.testclient import TestClient
from backend.main import app
from pathlib import Path

def test_app_assets_present_and_served():
    root=Path(__file__).resolve().parents[1]
    assert (root/'frontend/src/main.tsx').exists()
    assert (root/'frontend/dist/assets/app.js').exists()
    client=TestClient(app)
    assert client.get('/').status_code==200
    assert 'FraudShield' in client.get('/').text
    assert client.get('/assets/app.js').status_code==200
    assert client.get('/assets/style.css').status_code==200
    assert client.get('/vendor/react.min.js').status_code==200
