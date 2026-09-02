import duckdb
from pathlib import Path
import yaml

def build_trace(row) -> str:
    # Deterministic trace string generator
    return (f"Worker {row['worker_id']} worked {row['days_worked']} days in period {row['period_id']}. "
            f"FTO {row['fto_id']} rejected on {row['fto_generated_date']} (reason: {row['rejection_reason_raw']}). "
            f"No regeneration. ₹{row['amount']} outstanding. No grievance on record.")

def compute_states(db_path: Path):
    print("Computing Layer 1: Dropout Detection & States...")
    conn = duckdb.connect(str(db_path))
    
    # Load thresholds
    config_path = Path(__file__).parent.parent / "config" / "thresholds.yaml"
    with open(config_path, "r") as f:
        thresholds = yaml.safe_load(f)

    # Simplified state computation logic for hackathon demo
    # Flags workers as 'silent_exclusion' if they have rejected payments and no grievances
    
    query = """
        SELECT 
            p.worker_id, p.period_id, p.fto_id, p.fto_generated_date, 
            p.rejection_reason_raw, p.amount, p.status, a.days_worked
        FROM fact_payment p
        JOIN fact_attendance a ON p.worker_id = a.worker_id AND p.period_id = a.period_id
        WHERE p.status = 'rejected' 
        AND NOT EXISTS (
            SELECT 1 FROM fact_grievance g WHERE g.worker_id = p.worker_id
        )
    """
    
    results = conn.execute(query).df()
    
    for _, row in results.iterrows():
        trace = build_trace(row)
        conn.execute(
            "INSERT OR REPLACE INTO worker_state VALUES (?, ?, ?, ?, ?, ?, ?)",
            (row['worker_id'], row['period_id'], 'silent_exclusion', 1.0, row['amount'], 3, trace)
        )
        
    print(f"Flagged {len(results)} workers as silent_exclusion.")

if __name__ == "__main__":
    db_path = Path(r"C:\Users\MS\.gemini\antigravity-ide\scratch\antim-rupee\data\warehouse.duckdb")
    compute_states(db_path)
