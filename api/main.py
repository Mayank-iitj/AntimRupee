from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import duckdb
from pathlib import Path
from typing import List, Optional
import math
import os
import json
import requests

app = FastAPI(title="Antim Rupee API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use env var for DB path, default to relative path from this script's directory
default_db_path = Path(__file__).parent.parent / "data" / "warehouse.duckdb"
DB_PATH = Path(os.environ.get("DB_PATH", default_db_path))

def get_db():
    return duckdb.connect(str(DB_PATH))

# --- OPENROUTER HELPER ---
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_MODEL = "z-ai/glm-5.2:free"

def call_openrouter(system_prompt: str, user_prompt: str, is_json: bool = False):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    }
    
    if is_json:
        payload["response_format"] = {"type": "json_object"}
        
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]

@app.get("/api/summary")
def get_summary(district: str = "Muzaffarpur", period: Optional[str] = None):
    conn = get_db()
    try:
        flagged = conn.execute("SELECT COUNT(*) FROM worker_state WHERE state = 'silent_exclusion'").fetchone()[0]
        unpaid = conn.execute("SELECT SUM(unpaid_amount) FROM worker_state WHERE state = 'silent_exclusion'").fetchone()[0] or 0
        grievances = conn.execute("SELECT COUNT(*) FROM fact_grievance").fetchone()[0]
        blocks = conn.execute("SELECT block_id, COUNT(*) as c FROM dim_worker GROUP BY block_id ORDER BY c DESC").df().to_dict('records')
        return {
            "workers_flagged": flagged,
            "unpaid_total": float(unpaid),
            "grievances_filed": grievances,
            "blocks": blocks
        }
    finally:
        conn.close()

@app.get("/api/causes")
def get_causes(geo: Optional[str] = None, period: Optional[str] = None):
    conn = get_db()
    try:
        query = """
            SELECT c.cause_code, COUNT(*) as count, SUM(w.unpaid_amount) as unpaid_total, MAX(c.owner_role) as owner_role
            FROM payment_cause c
            JOIN fact_payment p ON c.payment_id = p.payment_id
            JOIN worker_state w ON p.worker_id = w.worker_id
            WHERE w.state = 'silent_exclusion'
            GROUP BY c.cause_code
            ORDER BY count DESC
        """
        df = conn.execute(query).df()
        total = df['count'].sum() if not df.empty else 1
        df['share'] = df['count'] / total
        df['cumulative_share'] = df['share'].cumsum()
        return df.to_dict('records')
    finally:
        conn.close()

@app.get("/api/worklist")
def get_worklist(weights: Optional[str] = None, status: str = "open", limit: int = 50):
    conn = get_db()
    try:
        query = "SELECT * FROM cluster_action WHERE status = ? ORDER BY priority DESC LIMIT ?"
        return conn.execute(query, (status, limit)).df().to_dict('records')
    finally:
        conn.close()

@app.post("/api/worklist/{cluster_id}/status")
def update_cluster_status(cluster_id: str, status: str):
    conn = get_db()
    try:
        conn.execute("UPDATE cluster_action SET status = ? WHERE cluster_id = ?", (status, cluster_id))
        return {"cluster_id": cluster_id, "status": status, "updated": True}
    finally:
        conn.close()

@app.get("/api/worklist/{cluster_id}/memo")
def get_memo(cluster_id: str, type: str = "annexure"):
    conn = get_db()
    try:
        cluster = conn.execute("SELECT * FROM cluster_action WHERE cluster_id = ?", (cluster_id,)).df()
        if cluster.empty:
            raise HTTPException(status_code=404, detail="Cluster not found")
        
        row = cluster.iloc[0]
        if type == "annexure":
            try:
                system_prompt = "You are a government official drafting formal legal annexure letters."
                user_prompt = f"""
                Write a formal legal annexure letter to the Branch Manager of {row['dimension_value']}.
                Subject: Immediate rectification of rejected MGNREGA payments due to {row['cause_code']}.
                Context: {row['workers_affected']} workers have been blocked from receiving their wages, totaling Rs {row['unpaid_total']}.
                Tone: Professional, urgent, official government correspondence.
                Keep it under 150 words. Do not use markdown bolding or formatting, just plain text suitable for a .txt file.
                """
                content = call_openrouter(system_prompt, user_prompt)
                return {"memo": content.strip()}
            except Exception as e:
                return {"memo": f"Error generating memo: {e}"}
                
        return {"memo": "Memo type not supported."}
    finally:
        conn.close()

class DecodeRequest(BaseModel):
    raw_string: str

@app.post("/api/decode")
def decode_string(req: DecodeRequest):
    try:
        system_prompt = "You are a banking error code classifier for Antim Rupee. Return only valid JSON with EXACTLY two keys: 'cause' and 'action'. Do not return any other text, markdown blocks, or explanation."
        user_prompt = f"""
        Analyze the raw trace string: '{req.raw_string}'
        Extract the likely underlying cause and a short recommended action for the clerk.
        Return JSON with exactly two keys: 'cause' and 'action'.
        """
        content = call_openrouter(system_prompt, user_prompt, is_json=True)
        # Handle cases where model wraps in markdown
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"Decode error: {e}")
        return {"cause": "ERROR", "action": str(e)}

@app.get("/api/preventive")
def get_preventive():
    # Mock Layer 4 (Preventive Name Matching) response
    return [
        {"worker_id_masked": "W_...99", "mismatch_risk": 0.92, "suggested_correction": "RAMESH BHAI -> RAMESH"},
        {"worker_id_masked": "W_...21", "mismatch_risk": 0.88, "suggested_correction": "SITA DEVI -> SITA"},
    ]

@app.get("/api/worker/{worker_id}")
def get_worker_detail(worker_id: str, authorization: str = Header(None)):
    if not authorization or authorization != "Bearer AUTH_TOKEN":
        raise HTTPException(status_code=403, detail="Unauthorized: Audit log requires authentication")
    
    conn = get_db()
    try:
        # Log to audit_log (mocked here)
        print(f"AUDIT LOG: User accessed PII for {worker_id}")
        
        worker = conn.execute("SELECT * FROM dim_worker WHERE worker_id = ?", (worker_id,)).df()
        if worker.empty:
            raise HTTPException(status_code=404, detail="Worker not found")
            
        trace = conn.execute("SELECT trace FROM worker_state WHERE worker_id = ?", (worker_id,)).fetchone()
        trace_str = trace[0] if trace else "No trace found."
        
        # Generate dynamic briefing using AI
        system_prompt = "You are a specialized AI assistant analyzing banking trace errors for government workers."
        user_prompt = f"""
        Worker ID: {worker_id}
        Bank Trace Log: {trace_str}
        
        Write a concise, professional 2-3 sentence briefing on why this worker's payments are blocked and what the recommended action is. 
        Focus strictly on the error in the trace log.
        """
        try:
            briefing = call_openrouter(system_prompt, user_prompt)
        except Exception as e:
            briefing = f"Error generating briefing: {e}"
        
        return {
            "worker": worker.to_dict('records')[0],
            "trace": trace_str,
            "briefing": briefing
        }
    finally:
        conn.close()

@app.get("/api/provenance")
def get_provenance():
    return {
        "fetched_at": "2026-04-16T12:00:00Z",
        "source_urls": ["https://pmkisan.gov.in/ (Fallback Mock)"],
        "synthetic_fields": ["name_local", "name_bank", "ifsc", "block_id", "gender", "social_category"],
        "row_counts": {
            "dim_worker": 5000,
            "fact_payment": 5000
        }
    }
