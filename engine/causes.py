import duckdb
from pathlib import Path
import yaml
import json

def normalize_causes(db_path: Path):
    print("Computing Layer 2: Cause Normalization...")
    conn = duckdb.connect(str(db_path))
    
    config_path = Path(__file__).parent.parent / "config" / "reason_map.yaml"
    with open(config_path, "r") as f:
        reason_map = yaml.safe_load(f)['mappings']
        
    # Map raw strings to codes deterministically
    query = "SELECT payment_id, rejection_reason_raw FROM fact_payment WHERE status = 'rejected'"
    results = conn.execute(query).df()
    
    for _, row in results.iterrows():
        raw_reason = row['rejection_reason_raw'].lower()
        mapped_code = 'UNKNOWN'
        owner = 'Triage queue'
        
        for code, details in reason_map.items():
            if any(p in raw_reason for p in details.get('patterns', [])):
                mapped_code = code
                owner = details['owner']
                break
                
        conn.execute(
            "INSERT OR REPLACE INTO payment_cause VALUES (?, ?, ?, ?, ?)",
            (row['payment_id'], mapped_code, owner, 'deterministic', 1.0)
        )
        
    print(f"Normalized causes for {len(results)} payments.")

if __name__ == "__main__":
    db_path = Path(r"C:\Users\MS\.gemini\antigravity-ide\scratch\antim-rupee\data\warehouse.duckdb")
    normalize_causes(db_path)
