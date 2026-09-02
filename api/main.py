from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import requests

app = FastAPI(title="Antim Rupee API (Google Cloud)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GOOGLE CLOUD MOCKS ---
# In a real implementation, we would use:
# from google.cloud import bigquery
# from vertexai.generative_models import GenerativeModel
# from google.cloud import speech

def query_bigquery_mock(query: str):
    """Mocks a call to BigQuery."""
    print(f"Mocking BigQuery execution: {query}")
    pass

def call_gemini_vertex(system_prompt: str, user_prompt: str, is_json: bool = False):
    """Mocks a call to Gemini 1.5 Pro via Vertex AI."""
    print(f"Mocking Vertex AI call...")
    
    if is_json:
        return '{"category": "Road Repair", "action": "Dispatch Field Team"}'
    return "This is a mock response from Gemini 1.5 Pro via Vertex AI. The infrastructure request indicates critical distress."

@app.get("/")
def health_check():
    return {"status": "ok", "service": "Antim Rupee Google AI API", "message": "Backend is running!"}

@app.get("/api/summary")
def get_summary(district: str = "Nashik", period: Optional[str] = None):
    query_bigquery_mock("SELECT COUNT(*) FROM `project.dataset.citizen_requests`")
    return {
        "workers_flagged": 128453,
        "unpaid_total": 4200000.0,
        "grievances_filed": 0,
        "blocks": [
            {"block_id": "Pune, MH", "c": 12400},
            {"block_id": "Nashik, MH", "c": 8300},
            {"block_id": "Nagpur, MH", "c": 7500}
        ]
    }

@app.get("/api/causes")
def get_causes(geo: Optional[str] = None, period: Optional[str] = None):
    query_bigquery_mock("SELECT category, COUNT(*) FROM `project.dataset.citizen_requests` GROUP BY category")
    return [
        {"cause_code": "Road Repair", "count": 45200, "unpaid_total": 0, "owner_role": "PWD"},
        {"cause_code": "Water Supply", "count": 38100, "unpaid_total": 0, "owner_role": "Jal Board"},
        {"cause_code": "Electricity", "count": 21500, "unpaid_total": 0, "owner_role": "Energy Dept"}
    ]

@app.get("/api/worklist")
def get_worklist(weights: Optional[str] = None, status: str = "open", limit: int = 50):
    query_bigquery_mock("SELECT * FROM `project.dataset.recommended_projects`")
    return [
        {"cluster_id": "PRJ-01", "dimension_value": "Nashik", "priority": 0.98, "workers_affected": 12500, "unpaid_total": 42000000, "mean_days_pending": 10, "cause_code": "Water Supply", "group_rate": 0.5, "baseline_rate": 0.1}
    ]

@app.post("/api/worklist/{cluster_id}/status")
def update_cluster_status(cluster_id: str, status: str):
    query_bigquery_mock("UPDATE `project.dataset.recommended_projects` SET status = 'approved'")
    return {"cluster_id": cluster_id, "status": status, "updated": True}

@app.get("/api/worklist/{cluster_id}/memo")
def get_memo(cluster_id: str, type: str = "annexure"):
    try:
        system_prompt = "You are a government planner drafting formal infrastructure project proposals."
        user_prompt = f"Write a formal project proposal for {cluster_id}."
        content = call_gemini_vertex(system_prompt, user_prompt)
        return {"memo": content.strip()}
    except Exception as e:
        return {"memo": f"Error generating memo: {e}"}

class DecodeRequest(BaseModel):
    raw_string: str

@app.post("/api/decode")
def decode_string(req: DecodeRequest):
    try:
        system_prompt = "You are an AI extracting intent from citizen requests."
        user_prompt = f"Analyze: '{req.raw_string}'"
        content = call_gemini_vertex(system_prompt, user_prompt, is_json=True)
        return json.loads(content)
    except Exception as e:
        return {"category": "ERROR", "action": str(e)}

@app.get("/api/worker/{worker_id}")
def get_worker_detail(worker_id: str, authorization: str = Header(None)):
    if not authorization or authorization != "Bearer AUTH_TOKEN":
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    system_prompt = "Analyze this project location context."
    user_prompt = f"Project ID: {worker_id}"
    briefing = call_gemini_vertex(system_prompt, user_prompt)
    
    return {
        "worker": {"worker_id": worker_id, "jobcard_id": "PRJ-101", "name_local": "Nashik Water Plant", "name_bank": "PWD"},
        "trace": "Citizen feedback analysis indicates critical water shortage in this sector.",
        "briefing": briefing
    }

@app.get("/api/provenance")
def get_provenance():
    return {
        "fetched_at": "2026-04-16T12:00:00Z",
        "source_urls": ["https://data.gov.in/ (Mock)"],
        "synthetic_fields": ["location", "category"],
        "row_counts": {
            "citizen_requests": 128453,
            "recommended_projects": 43
        }
    }

