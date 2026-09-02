import duckdb
from pathlib import Path
import yaml
import math

def compute_scores(db_path: Path):
    print("Computing Layer 3: Priority Scoring...")
    conn = duckdb.connect(str(db_path))
    
    config_path = Path(__file__).parent.parent / "config" / "scoring.yaml"
    with open(config_path, "r") as f:
        weights = yaml.safe_load(f)['weights']
        
    query = "SELECT cluster_id, workers_affected, unpaid_total, mean_days_pending, estimated_actions FROM cluster_action"
    results = conn.execute(query).df()
    
    for _, row in results.iterrows():
        impact = row['workers_affected'] * weights['impact']
        value = math.log1p(row['unpaid_total']) * weights['value']
        urgency = row['mean_days_pending'] * weights['urgency']
        effort = row['estimated_actions'] if row['estimated_actions'] > 0 else 1
        severity = 0.2 * weights['severity'] # mock severity
        
        priority = (impact * value * urgency * (1 + severity)) / effort
        
        conn.execute("UPDATE cluster_action SET priority = ? WHERE cluster_id = ?", (priority, row['cluster_id']))
        
    print("Updated priority scores.")

if __name__ == "__main__":
    db_path = Path(r"C:\Users\MS\.gemini\antigravity-ide\scratch\antim-rupee\data\warehouse.duckdb")
    compute_scores(db_path)
