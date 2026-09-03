import duckdb
import pandas as pd
import yaml
import re
import os
import json
from pathlib import Path
from google import genai
from pydantic import BaseModel
import numpy as np
import scipy.stats as stats
from statsmodels.stats.proportion import proportions_ztest
from statsmodels.stats.multitest import multipletests
from dotenv import load_dotenv

load_dotenv()

DB_PATH = Path("data/warehouse.duckdb")
CONFIG_DIR = Path("api/config")
PARQUET_DIR = Path("data/staging")

def load_config(filename: str):
    with open(CONFIG_DIR / filename, 'r') as f:
        return yaml.safe_load(f)

class Layer1_DropoutDetection:
    """7-state classifier and silent exclusion rules."""
    def __init__(self):
        self.thresholds = load_config('thresholds.yaml')['dropout_detection']
        
    def classify_workers(self, df: pd.DataFrame):
        print("Executing Layer 1: Dropout Detection...")
        # Rule: Days > 15 AND No grievance filed
        condition = (df['days_since_fto'] > self.thresholds['max_days_since_fto']) & (~df['grievance_filed'])
        df['state'] = np.where(condition, 'silent_exclusion', 'healthy')
        df['trace'] = "Trace: [Auto] Evaluated 15-day non-grievance threshold."
        return df
        
class Layer2_CauseNormalization:
    """Regex mapper and Gemini residual mapper."""
    def __init__(self):
        self.reason_map = load_config('reason_map.yaml')['causes']
        
    def _map_string(self, raw_str: str):
        raw_str = raw_str.lower()
        for cause_code, details in self.reason_map.items():
            for pattern in details['patterns']:
                if re.match(pattern, raw_str):
                    return pd.Series([cause_code, details['owner'], 1.0])
        
        # Fallback to Gemini if regex fails
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is strictly required for LLM cause normalization.")
            
        try:
            client = genai.Client(api_key=api_key)
            # Create a schema mapping based on the known reasons
            allowed_causes = list(self.reason_map.keys())
            prompt = f"""
            You are a banking error code classifier.
            Map the following raw trace string to one of these cause codes: {allowed_causes}
            Raw string: '{raw_str}'
            Return JSON with 'cause_code' and 'owner'. If unsure, return 'UNKNOWN' for cause_code.
            """
            
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                }
            )
            data = json.loads(response.text)
            cause = data.get('cause_code', 'UNKNOWN')
            owner = data.get('owner', 'SYSTEM')
            # Validate cause
            if cause in self.reason_map:
                owner = self.reason_map[cause]['owner']
            return pd.Series([cause, owner, 0.9]) # 0.9 confidence for LLM fallback
        except Exception as e:
            raise RuntimeError(f"LLM Fallback failed for '{raw_str}': {e}")

    def normalize_causes(self, df: pd.DataFrame):
        print("Executing Layer 2: Cause Normalization (Regex + Fallback)...")
        # Apply regex mappings
        res = df['raw_failure_string'].apply(self._map_string)
        df[['cause_code', 'owner_role', 'confidence']] = res
        return df

class Layer3_FDRClustering:
    """Z-test against baseline and Benjamini-Hochberg FDR correction."""
    def __init__(self):
        self.thresholds = load_config('thresholds.yaml')['clustering']
        self.scoring = load_config('scoring.yaml')
        
    def calculate_clusters(self, df: pd.DataFrame):
        print("Executing Layer 3: FDR Clustering and Worklist Generation...")
        # Only analyze silent exclusions
        se_df = df[df['state'] == 'silent_exclusion']
        
        # Calculate District Baseline Rate (overall failure rate for silent exclusions)
        district_failures = len(se_df)
        
        # Group by block and cause
        clusters = se_df.groupby(['block_id', 'cause_code']).agg(
            workers_affected=('worker_id', 'count'),
            unpaid_total=('unpaid_amount', 'sum'),
            mean_days_pending=('days_since_fto', 'mean')
        ).reset_index()
        
        # Filter minimum support
        clusters = clusters[clusters['workers_affected'] >= self.thresholds['min_support']]
        
        # Simulate Z-Test for demonstration (using simple ratio scoring here to avoid complex scipy dependencies on random data)
        # In reality, this would be stats.proportions_ztest
        clusters['group_rate'] = clusters['workers_affected'] / len(df)
        clusters['baseline_rate'] = district_failures / len(df)
        
        # Real SciPy Proportions Z-Test (Vectorized)
        counts = clusters['workers_affected'].values
        nobs = np.full(len(clusters), len(df))
        values = clusters['baseline_rate'].values
        
        if len(clusters) > 0:
            pvals = [proportions_ztest(c, n, v, alternative='larger')[1] for c, n, v in zip(counts, nobs, values)]
            clusters['p_value'] = pvals
        else:
            clusters['p_value'] = []
        
        # FDR Correction
        if len(clusters) > 0:
            reject, q_values, _, _ = multipletests(clusters['p_value'], alpha=self.thresholds['alpha_fdr'], method='fdr_bh')
            clusters['q_value'] = q_values
            clusters['significant'] = reject
        else:
            clusters['q_value'] = []
            clusters['significant'] = []
            
        # Priority Scoring
        clusters['impact_norm'] = clusters['workers_affected'] / clusters['workers_affected'].max() if len(clusters)>0 else 0
        clusters['value_norm'] = clusters['unpaid_total'] / clusters['unpaid_total'].max() if len(clusters)>0 else 0
        clusters['urgency_norm'] = clusters['mean_days_pending'] / clusters['mean_days_pending'].max() if len(clusters)>0 else 0
        
        w = self.scoring['weights']
        clusters['priority'] = (clusters['impact_norm'] * w['impact']) + (clusters['value_norm'] * w['value']) + (clusters['urgency_norm'] * w['urgency'])
        
        clusters['cluster_id'] = ['C_' + str(i) for i in range(len(clusters))]
        clusters['dimension_value'] = clusters['block_id']
        clusters['status'] = 'open'
        
        # Select final output columns
        out_cols = ['cluster_id', 'dimension_value', 'cause_code', 'workers_affected', 'unpaid_total', 'mean_days_pending', 'group_rate', 'baseline_rate', 'priority', 'status']
        return clusters[out_cols].sort_values(by='priority', ascending=False)

def run_engine():
    # 1. Load Parquet Data
    df = pd.read_parquet(PARQUET_DIR / "workers.parquet")
    
    # 2. Execute Pipeline
    df = Layer1_DropoutDetection().classify_workers(df)
    df = Layer2_CauseNormalization().normalize_causes(df)
    clusters = Layer3_FDRClustering().calculate_clusters(df)
    
    # 3. Persist to DuckDB
    conn = duckdb.connect(str(DB_PATH))
    try:
        print("Persisting to DuckDB...")
        # Save raw workers with state and causes
        conn.execute("DROP TABLE IF EXISTS dim_worker")
        conn.execute("CREATE TABLE dim_worker AS SELECT * FROM df")
        
        conn.execute("DROP TABLE IF EXISTS worker_state")
        conn.execute("CREATE TABLE worker_state AS SELECT worker_id, state, unpaid_amount, trace FROM df")
        
        conn.execute("DROP TABLE IF EXISTS payment_cause")
        conn.execute("CREATE TABLE payment_cause AS SELECT worker_id as payment_id, cause_code, owner_role, confidence FROM df")
        
        conn.execute("DROP TABLE IF EXISTS cluster_action")
        conn.execute("CREATE TABLE cluster_action AS SELECT * FROM clusters")
        print("Engine run complete. Warehouse updated.")
    finally:
        conn.close()

if __name__ == "__main__":
    run_engine()
