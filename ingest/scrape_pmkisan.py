import json
import os
import random
from pathlib import Path
from datetime import datetime

# Fallback script for data ingestion using PM-KISAN mock data, adhering to the 4-hour hard stop rule.
# Generates a synthetic PM-KISAN rejected payments dataset to populate the warehouse.

def generate_mock_pmkisan_data(output_dir: Path):
    print(f"[{datetime.now().isoformat()}] Using PM-KISAN fallback data generation...")
    # Simulated data generation matching aggregate margins
    
    # 1. Blocks and Panchayats
    blocks = [f"Block_{i}" for i in range(1, 17)]
    
    # 2. Rejection Reasons matching taxonomy
    reasons = [
        "aadhaar number not mapped",
        "inactive aadhaar number",
        "does not tally",
        "account blocked or frozen",
        "no such account",
        "invalid account type",
        "account closed or transferred",
        "invalid ifsc",
        "document pending for act. holder",
        "customer to refer to the branch",
        "account holder turning major",
        "network failure",
        "cbs timeout",
        "unclaimed",
        "some weird new reason"
    ]
    
    # Generate mock rejected FTOs
    records = []
    
    # Generate 1 major cluster: 312 workers, same IFSC, same cause
    major_ifsc = "SBIN0001234"
    major_cause = "aadhaar number not mapped"
    major_block = "Block_1"
    for i in range(312):
        records.append({
            "worker_id": f"W_CLUSTER_{i}",
            "block_id": major_block,
            "rejection_reason_raw": major_cause,
            "ifsc": major_ifsc,
            "status": "rejected",
            "period_id": 202601,
            "fto_generated_date": "2026-04-10",
            "amount": 2280.0
        })
        
    # Generate background noise
    for _ in range(4688): # Remaining to reach 5000
        block = random.choice(blocks)
        reason = random.choice(reasons)
        ifsc = random.choice([major_ifsc, "SBIN0002222", "SBIN0003333", "SBIN0004444"]) # limit branches to force some minor clusters
        worker_id = f"W_{random.randint(100000, 999999)}"
        
        record = {
            "worker_id": worker_id,
            "block_id": block,
            "rejection_reason_raw": reason,
            "ifsc": ifsc,
            "status": "rejected",
            "period_id": random.choice([202601, 202602]),
            "fto_generated_date": "2026-04-10",
            "amount": 2280.0
        }
        records.append(record)
    
    os.makedirs(output_dir, exist_ok=True)
    out_file = output_dir / "pmkisan_staged.json"
    with open(out_file, "w") as f:
        json.dump(records, f)
        
    print(f"Generated {len(records)} mock PM-KISAN records at {out_file}")

if __name__ == "__main__":
    output_dir = Path(r"C:\Users\MS\.gemini\antigravity-ide\scratch\antim-rupee\data\staged")
    generate_mock_pmkisan_data(output_dir)
