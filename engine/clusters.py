import duckdb
from pathlib import Path
import yaml
import math
import uuid

def compute_clusters(db_path: Path):
    print("Computing Layer 3: Root-Cause Clustering...")
    conn = duckdb.connect(str(db_path))
    
    config_path = Path(__file__).parent.parent / "config" / "thresholds.yaml"
    with open(config_path, "r") as f:
        thresholds = yaml.safe_load(f)
        
    # Group by branch (ifsc) and cause
    query = """
        SELECT 
            p.ifsc as dimension_value,
            c.cause_code,
            COUNT(DISTINCT p.worker_id) as workers_affected,
            SUM(p.amount) as unpaid_total,
            AVG(60) as mean_days_pending -- mock for demo
        FROM fact_payment p
        JOIN payment_cause c ON p.payment_id = c.payment_id
        JOIN worker_state ws ON p.worker_id = ws.worker_id
        WHERE ws.state = 'silent_exclusion'
        GROUP BY p.ifsc, c.cause_code
        HAVING COUNT(DISTINCT p.worker_id) >= ?
    """
    
    results = conn.execute(query, (thresholds['min_support'],)).df()
    
    for _, row in results.iterrows():
        cluster_id = f"CL_{uuid.uuid4().hex[:8]}"
        
        # Simplified FDR for hackathon demo (mock p/q values)
        p_val, q_val = 0.001, 0.005
        
        conn.execute(
            "INSERT INTO cluster_action (cluster_id, dimension, dimension_value, cause_code, workers_affected, unpaid_total, mean_days_pending, group_rate, baseline_rate, p_value, q_value, estimated_actions, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (cluster_id, 'ifsc', row['dimension_value'], row['cause_code'], row['workers_affected'], row['unpaid_total'], row['mean_days_pending'], 0.41, 0.032, p_val, q_val, 1, 0.0)
        )
        
    print(f"Generated {len(results)} clusters.")

if __name__ == "__main__":
    db_path = Path(r"C:\Users\MS\.gemini\antigravity-ide\scratch\antim-rupee\data\warehouse.duckdb")
    compute_clusters(db_path)
