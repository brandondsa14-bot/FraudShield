#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ ! -d .venv ]; then
  echo 'Creating Python virtual environment...'
  python3 -m venv .venv
fi
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
printf '\nFraudShield starting at http://127.0.0.1:8000\n'
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
