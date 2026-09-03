import duckdb
from pathlib import Path
import yaml
import time

DB_PATH = Path("data/warehouse.duckdb")
CONFIG_DIR = Path("api/config")

class ADKReconciliationAgent:
    """Non-conversational background agent for loop closure."""
    
    def __init__(self):
        with open(CONFIG_DIR / 'thresholds.yaml', 'r') as f:
            self.thresholds = yaml.safe_load(f)['agent']

    def run_cycle(self):
        print("Starting ADK Reconciliation Cycle...")
        conn = duckdb.connect(str(DB_PATH))
        
        try:
            self._verify_followups(conn)
            self._escalate_thresholds(conn)
            self._generate_diff(conn)
        finally:
            conn.close()
            
    def _verify_followups(self, conn):
        print("Verifying follow-up resolution status against new FTOs...")
        try:
            conn.execute('''
                CREATE OR REPLACE TEMP TABLE cluster_stats AS 
                SELECT 
                    c.cluster_id,
                    COUNT(w.worker_id) as total_workers,
                    SUM(CASE WHEN ws.state = 'healthy' THEN 1 ELSE 0 END) as paid_workers
                FROM cluster_action c
                JOIN dim_worker w ON c.dimension_value = w.block_id
                JOIN payment_cause pc ON w.worker_id = pc.payment_id AND c.cause_code = pc.cause_code
                JOIN worker_state ws ON w.worker_id = ws.worker_id
                WHERE c.status = 'resolved'
                GROUP BY c.cluster_id
            ''')
        except duckdb.CatalogException:
            pass # Tables might not exist if engine hasn't run
        
    def _escalate_thresholds(self, conn):
        print("Checking payment thresholds...")
        threshold = self.thresholds['escalation_payment_threshold']
        try:
            conn.execute(f'''
                UPDATE cluster_action
                SET status = 'escalated'
                WHERE cluster_id IN (
                    SELECT cluster_id FROM cluster_stats
                    WHERE paid_workers * 1.0 / total_workers < {threshold}
                )
            ''')
        except duckdb.CatalogException:
            pass
        
    def _generate_diff(self, conn):
        print("Generating Cycle Diff (New, Resolved, Regressed)...")
        try:
            res = conn.execute("SELECT status, count(*) FROM cluster_action GROUP BY status").fetchall()
            for row in res:
                print(f"Status {row[0]}: {row[1]} clusters")
        except duckdb.CatalogException:
            print("No data available yet.")
if __name__ == "__main__":
    agent = ADKReconciliationAgent()
    agent.run_cycle()
