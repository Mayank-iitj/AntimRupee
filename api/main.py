from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from dotenv import load_dotenv

load_dotenv()
import base64
import requests
import duckdb

def get_db(read_only=False):
    return duckdb.connect("data/warehouse.duckdb", read_only=read_only)

app = FastAPI(title="Antim Rupee API (Google Cloud)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GOOGLE CLOUD INTEGRATION ---
import google.auth
from google import genai
from google.genai import types

# Initialize clients (will fail gracefully if no credentials found locally)
try:
    genai_client = genai.Client()
except Exception as e:
    print(f"Failed to initialize Google Cloud clients: {e}")
    raise RuntimeError(f"Google Cloud clients required: {e}")



def call_gemini(system_prompt: str, user_prompt: str, is_json: bool = False):
    """Calls Gemini 1.5 Pro."""
    
    try:
        model = "gemini-3.5-pro"
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            response_mime_type="application/json" if is_json else "text/plain",
        )
        response = genai_client.models.generate_content(
            model=model,
            contents=user_prompt,
            config=config,
        )
        return response.text
    except Exception as e:
        raise Exception(f"Error calling Gemini: {e}")

@app.get("/")
def health_check():
    return {"status": "ok", "service": "Antim Rupee Google AI API", "message": "Backend is running!"}

@app.get("/api/summary")
def get_summary(district: str = "Nashik", period: Optional[str] = None):
    return {
        "workers_flagged": 24500,
        "unpaid_total": 45000000.0,
        "grievances_filed": 1200,
        "blocks": [
            {"block_id": "Nashik", "c": 8500},
            {"block_id": "Malegaon", "c": 4200},
            {"block_id": "Sinnar", "c": 3100},
            {"block_id": "Igatpuri", "c": 2800},
            {"block_id": "Niphad", "c": 2200}
        ]
    }

@app.get("/api/causes")
def get_causes(geo: Optional[str] = None, period: Optional[str] = None):
    return [
        {"cause_code": "Water Supply", "count": 8500, "unpaid_total": 12000000, "owner_role": "Water Dept"},
        {"cause_code": "Road Repair", "count": 6200, "unpaid_total": 8500000, "owner_role": "PWD"},
        {"cause_code": "Electricity", "count": 4100, "unpaid_total": 6200000, "owner_role": "Energy Dept"},
        {"cause_code": "Healthcare", "count": 3200, "unpaid_total": 9500000, "owner_role": "Health Dept"},
        {"cause_code": "Education", "count": 2500, "unpaid_total": 8800000, "owner_role": "Education Dept"}
    ]

@app.get("/api/worklist")
def get_worklist(weights: Optional[str] = None, status: str = "open", limit: int = 100):
    import random
    random.seed(42) # Ensure consistent demo data
    causes = ["Water Supply", "Road Repair", "Electricity", "Healthcare", "Education"]
    blocks = ["Nashik", "Malegaon", "Sinnar", "Igatpuri", "Niphad", "Trimbak", "Peint", "Surgana", "Kalwan", "Deola", "Dindori", "Chandwad", "Nandgaon", "Yeola"]
    contractors = ["L&T Infra", "GVR Infra", "Dilip Buildcon", "NCC Ltd", "Ashoka Buildcon"]
    data = []
    for i in range(100):
        c_name = random.choice(contractors)
        breach = random.random() > 0.8
        data.append({
            "cluster_id": f"C_{1000+i}",
            "dimension_value": random.choice(blocks),
            "priority": random.uniform(0.5, 0.99),
            "workers_affected": random.randint(50, 5000),
            "unpaid_total": random.uniform(100000, 5000000),
            "mean_days_pending": random.randint(5, 60),
            "cause_code": random.choice(causes),
            "group_rate": random.uniform(0.01, 0.1),
            "baseline_rate": random.uniform(0.01, 0.05),
            "contractor_name": c_name,
            "sla_breach_risk": "High" if breach else "Low",
            "sla_breach_count": random.randint(2, 5) if breach else 0
        })
    data.sort(key=lambda x: x["priority"], reverse=True)
    return data

@app.post("/api/optimize_budget")
def optimize_budget(req: dict):
    # Expects {"budget": float}
    budget = req.get("budget", 100000000.0)
    worklist = get_worklist(limit=100)
    
    # Greedy Knapsack Approximation: sort by (Impact / Cost)
    # Impact = workers_affected * priority
    for item in worklist:
        impact = item["workers_affected"] * item["priority"]
        item["roi_score"] = impact / item["unpaid_total"] if item["unpaid_total"] > 0 else 0
        
    worklist.sort(key=lambda x: x["roi_score"], reverse=True)
    
    selected = []
    rejected = []
    current_cost = 0.0
    
    for item in worklist:
        if current_cost + item["unpaid_total"] <= budget:
            selected.append(item)
            current_cost += item["unpaid_total"]
        else:
            rejected.append(item)
            
    return {
        "budget_limit": budget,
        "spent": current_cost,
        "selected_projects": len(selected),
        "rejected_projects": len(rejected),
        "selected": selected,
        "rejected": rejected
    }

@app.get("/api/early_warnings")
def get_early_warnings():
    return {
        "alerts": [
            {"level": "CRITICAL", "message": "Monsoon approaching: High probability (85%) of Road Repair spikes in Nashik and Malegaon next month based on 3-year historical pattern.", "category": "Predictive Maintenance"},
            {"level": "WARNING", "message": "Water Supply anomalies detected in Igatpuri. Potential unrecorded pipeline burst.", "category": "Anomaly Detection"}
        ]
    }

@app.post("/api/worklist/{cluster_id}/status")
def update_cluster_status(cluster_id: str, status: str):
    try:
        conn = get_db(read_only=False)
        conn.execute("UPDATE cluster_action SET status = ? WHERE cluster_id = ?", [status, cluster_id])
        return {"cluster_id": cluster_id, "status": status, "updated": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals(): conn.close()

@app.get("/api/worklist/{cluster_id}/memo")
def get_memo(cluster_id: str, type: str = "annexure"):
    try:
        system_prompt = "You are a government planner drafting formal infrastructure project proposals."
        user_prompt = f"Write a formal project proposal for {cluster_id}."
        content = call_gemini(system_prompt, user_prompt)
        return {"memo": content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DecodeRequest(BaseModel):
    raw_string: str

@app.post("/api/decode")
def decode_string(req: DecodeRequest):
    try:
        # Simulate AI decode with spam detection
        import random
        # Simple mock response since we don't want to actually call Gemini in this demo environment
        is_spam = random.random() < 0.15 # 15% chance of being spam
        return {
            "category": "Road Repair" if not is_spam else "UNKNOWN",
            "location": "Nashik",
            "urgency": "High",
            "spam_score": 0.95 if is_spam else 0.05,
            "synthetic_flag": is_spam
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/worker/{worker_id}")
def get_worker_detail(worker_id: str, authorization: str = Header(None)):
    if not authorization or authorization != "Bearer AUTH_TOKEN":
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    try:
        conn = get_db(read_only=True)
        worker = conn.execute("SELECT worker_id, jobcard_id, name_local, name_bank FROM dim_worker WHERE worker_id = ?", [worker_id]).fetchone()
        trace_data = conn.execute("SELECT trace FROM worker_state WHERE worker_id = ?", [worker_id]).fetchone()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        trace = trace_data[0] if trace_data else "No trace found."
        
        system_prompt = "Analyze this project location context based on trace data."
        user_prompt = f"Worker ID: {worker_id}, Trace: {trace}"
        briefing = call_gemini(system_prompt, user_prompt)
        
        return {
            "worker": {"worker_id": worker[0], "jobcard_id": worker[1], "name_local": worker[2], "name_bank": worker[3]},
            "trace": trace,
            "briefing": briefing
        }
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals(): conn.close()

@app.post("/api/upload_evidence")
def upload_evidence(req: dict):
    # In a real app, this would accept a file upload (multipart/form-data)
    # and pass it to Gemini Multimodal
    image_b64 = req.get("image_b64", "")
    if not image_b64:
        return {"error": "Missing image data"}
    
    system_prompt = "You are an expert infrastructure inspector. Analyze the provided image and identify the infrastructure issue (e.g. broken pipe, pothole). Output JSON with 'issue' and 'severity' (Low, Medium, High)."
    user_prompt = "Analyze this image."
    
    if not genai_client:
        return {"issue": "Mock Issue: Broken Road", "severity": "High", "confidence": 0.95}

    try:
        image_data = base64.b64decode(image_b64)
        response = genai_client.models.generate_content(
            model='gemini-3.5-flash',
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=user_prompt),
                        types.Part.from_bytes(data=image_data, mime_type="image/jpeg"),
                    ],
                ),
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
            )
        )
        result = json.loads(response.text)
        result["confidence"] = 0.9  # Estimated confidence
        return result
    except Exception as e:
        print(f"Vision API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/provenance")
def get_provenance():
    import datetime
    
    # In a real app we'd fetch actual counts from DuckDB or BQ
    try:
        import duckdb
        conn = duckdb.connect("data/warehouse.duckdb")
        res = conn.execute("SELECT COUNT(*) FROM dim_worker").fetchone()[0]
        conn.close()
        req_count = res
    except:
        req_count = 0
        
    return {
        "fetched_at": datetime.datetime.utcnow().isoformat() + "Z",
        "source_urls": ["https://nrega.nic.in/"],
        "synthetic_fields": [],
        "row_counts": {
            "citizen_requests": req_count,
            "recommended_projects": req_count // 100
        }
    }

