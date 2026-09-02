import duckdb
import json
from pathlib import Path

def create_schema_and_load(db_path: Path, data_path: Path):
    print("Building DuckDB Warehouse schema and calibrating synthetic panel...")
    conn = duckdb.connect(str(db_path))
    
    # Create Dimensions
    conn.execute("""
        CREATE TABLE dim_worker (
            worker_id VARCHAR PRIMARY KEY,
            jobcard_id VARCHAR,
            household_id VARCHAR,
            name_local VARCHAR,
            name_bank VARCHAR,
            gender VARCHAR,
            age_band VARCHAR,
            social_category VARCHAR,
            panchayat_id VARCHAR,
            block_id VARCHAR,
            district_id VARCHAR,
            bank_name VARCHAR,
            ifsc VARCHAR,
            account_type VARCHAR,
            aadhaar_seeded BOOLEAN,
            npci_mapped BOOLEAN,
            account_verified BOOLEAN,
            synthetic_fields VARCHAR[]
        )
    """)
    
    conn.execute("""
        CREATE TABLE dim_location (
            panchayat_id VARCHAR PRIMARY KEY, panchayat_name VARCHAR,
            block_id VARCHAR, block_name VARCHAR,
            district_id VARCHAR, district_name VARCHAR,
            lat DOUBLE, lon DOUBLE, population INTEGER
        )
    """)
    
    conn.execute("""
        CREATE TABLE dim_bank_branch (
            ifsc VARCHAR PRIMARY KEY, bank_name VARCHAR, branch_name VARCHAR,
            block_id VARCHAR, lat DOUBLE, lon DOUBLE
        )
    """)
    
    # Create Facts
    conn.execute("""
        CREATE TABLE fact_attendance (
            worker_id VARCHAR, period_id INTEGER,
            days_worked INTEGER, muster_roll_id VARCHAR,
            PRIMARY KEY (worker_id, period_id)
        )
    """)
    
    conn.execute("""
        CREATE TABLE fact_payment (
            payment_id VARCHAR PRIMARY KEY,
            worker_id VARCHAR, period_id INTEGER,
            fto_id VARCHAR, fto_generated_date DATE, signatory_id VARCHAR, operator_id VARCHAR,
            amount DECIMAL(12,2),
            status VARCHAR,
            bank_response_date DATE,
            rejection_reason_raw VARCHAR,
            ifsc VARCHAR,
            parent_payment_id VARCHAR
        )
    """)
    
    conn.execute("""
        CREATE TABLE fact_grievance (
            grievance_id VARCHAR PRIMARY KEY, worker_id VARCHAR,
            filed_date DATE, channel VARCHAR, status VARCHAR
        )
    """)
    
    # Engine Outputs
    conn.execute("""
        CREATE TABLE worker_state (
            worker_id VARCHAR, as_of_period INTEGER,
            state VARCHAR, confidence DOUBLE,
            unpaid_amount DECIMAL(12,2), periods_since_last_payment INTEGER,
            trace VARCHAR,
            PRIMARY KEY (worker_id, as_of_period)
        )
    """)
    
    conn.execute("""
        CREATE TABLE payment_cause (
            payment_id VARCHAR PRIMARY KEY,
            cause_code VARCHAR, owner_role VARCHAR,
            mapping_method VARCHAR,
            mapping_confidence DOUBLE
        )
    """)
    
    conn.execute("""
        CREATE TABLE cluster_action (
            cluster_id VARCHAR PRIMARY KEY,
            dimension VARCHAR, dimension_value VARCHAR, cause_code VARCHAR,
            workers_affected INTEGER, unpaid_total DECIMAL(14,2),
            mean_days_pending DOUBLE, group_rate DOUBLE, baseline_rate DOUBLE,
            p_value DOUBLE, q_value DOUBLE,
            estimated_actions INTEGER, priority DOUBLE,
            status VARCHAR DEFAULT 'open',
            contacted_at TIMESTAMP, resolved_at TIMESTAMP,
            followup_verified BOOLEAN, followup_paid_count INTEGER
        )
    """)
    
    print("Schema created.")
    
    # Load staged PM-KISAN data into fact_payment and generate synthetic workers
    print(f"Loading staged data from {data_path}...")
    try:
        with open(data_path, "r") as f:
            records = json.load(f)
            
        for i, r in enumerate(records):
            # Insert worker (synthetic)
            conn.execute(
                f"INSERT OR IGNORE INTO dim_worker VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (r['worker_id'], f"JC_{r['worker_id']}", "HH_1", "LocalName", "BankName", "M", "30-40", "SC",
                 "P_1", r['block_id'], "Muzaffarpur", "State Bank", r['ifsc'], "bank", True, False, False,
                 ['name_local', 'name_bank', 'ifsc', 'block_id'])
            )
            # Insert payment
            conn.execute(
                f"INSERT INTO fact_payment VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (f"PAY_{i}", r['worker_id'], r['period_id'], f"FTO_{i}", r['fto_generated_date'], "SIG1", "OP1",
                 r['amount'], r['status'], "2026-04-15", r['rejection_reason_raw'], r['ifsc'], None)
            )
            # Insert attendance to allow dropping off (silent exclusion)
            conn.execute(
                f"INSERT OR IGNORE INTO fact_attendance VALUES (?, ?, ?, ?)",
                (r['worker_id'], r['period_id'], 14, "MR_1")
            )
            
        print(f"Loaded {len(records)} synthesized worker/payment records.")
    except Exception as e:
        print(f"Failed to load data: {e}")

if __name__ == "__main__":
    db_path = Path(r"C:\Users\MS\.gemini\antigravity-ide\scratch\antim-rupee\data\warehouse.duckdb")
    data_path = Path(r"C:\Users\MS\.gemini\antigravity-ide\scratch\antim-rupee\data\staged\pmkisan_staged.json")
    create_schema_and_load(db_path, data_path)
