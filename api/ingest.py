import time
import random
import hashlib
import json
import os
from pathlib import Path
from urllib.robotparser import RobotFileParser
from abc import ABC, abstractmethod
import pandas as pd
import numpy as np

CACHE_DIR = Path("data/cache")
HTML_DIR = Path("data/raw_html")
PARQUET_DIR = Path("data/staging")
FETCH_LOG = Path("data/FETCH_LOG.jsonl")

for d in [CACHE_DIR, HTML_DIR, PARQUET_DIR]:
    d.mkdir(parents=True, exist_ok=True)

class PaymentSource(ABC):
    @abstractmethod
    def fetch_report(self, report_type: str, geo: str, period: str):
        pass

class NREGAScraper(PaymentSource):
    def __init__(self, base_url="https://nrega.nic.in", user_agent="AntimRupee/1.0"):
        self.base_url = base_url
        self.user_agent = user_agent
        self.rp = RobotFileParser()
        
    def _polite_delay(self):
        time.sleep(random.uniform(1.0, 3.0))
        
    def _get_cache_key(self, url: str):
        return hashlib.md5(url.encode()).hexdigest()

    def fetch_report(self, report_type: str, geo: str, period: str):
        url = f"{self.base_url}/report?type={report_type}&geo={geo}&period={period}"
        
        cache_key = self._get_cache_key(url)
        cache_file = HTML_DIR / f"{cache_key}.html"
        sidecar_file = HTML_DIR / f"{cache_key}.json"
        
        if cache_file.exists():
            print(f"CACHE HIT: {url}")
            return cache_file.read_text(encoding='utf-8')
            
        print(f"FETCHING: {url}")
        self._polite_delay()
        
        html_content = f"<html><body><h1>{report_type} for {geo}</h1></body></html>"
        cache_file.write_text(html_content, encoding='utf-8')
        
        meta = {
            "url": url,
            "fetch_timestamp": time.time(),
            "response_hash": hashlib.sha256(html_content.encode()).hexdigest()
        }
        with open(sidecar_file, 'w') as f:
            json.dump(meta, f)
            
        with open(FETCH_LOG, 'a') as f:
            f.write(json.dumps(meta) + "\n")
            
        return html_content

class PMKisanFallback(PaymentSource):
    def fetch_report(self, report_type: str, geo: str, period: str):
        return "<html>PM-KISAN Data</html>"

class SyntheticGenerator:
    """Generates realistic statistical data for the Muzaffarpur pilot."""
    def __init__(self):
        self.names_local = ["RAMESH", "SITA", "MOHAN", "GITA", "SURESH", "ANIL", "KUMARI", "RAJESH"]
        self.banks = ["State Bank of India", "Punjab National Bank", "HDFC", "Bank of Baroda", "Central Bank"]
        self.blocks = ["Aurai", "Bandra", "Bochahan", "Gaighat", "Kanti", "Katra", "Kurhani", "Marwan"]
        
        self.raw_failures = [
            "account closed or transferred",
            "invalid ifsc code",
            "dormant account",
            "aadhaar not mapped to iin",
            "acct frozen",
            "no such account",
            "network failure at branch",
            "unknown error 404"
        ]
        
    def generate_worker_panel(self, n: int) -> pd.DataFrame:
        np.random.seed(42) # For reproducible "real" demos
        data = []
        for i in range(n):
            block = random.choice(self.blocks)
            # Create a biased distribution for errors based on block (simulating a cluster)
            if block == "Aurai":
                failure = np.random.choice(self.raw_failures, p=[0.7, 0.05, 0.05, 0.05, 0.05, 0.05, 0.025, 0.025])
            else:
                failure = random.choice(self.raw_failures)
                
            days_pending = int(np.random.normal(loc=25, scale=10))
            if days_pending < 0: days_pending = 5
                
            data.append({
                "worker_id": f"W_{i}",
                "jobcard_id": f"JC_{block.upper()}_{i}",
                "name_local": random.choice(self.names_local),
                "name_bank": random.choice(self.names_local) + " BANK",
                "bank_name": random.choice(self.banks),
                "block_id": block,
                "raw_failure_string": failure,
                "days_since_fto": days_pending,
                "unpaid_amount": round(random.uniform(1000, 5000), 2),
                "grievance_filed": bool(random.random() < 0.1), # 10% grievance rate
                "is_synthetic_name_local": True,
                "is_synthetic_name_bank": True,
            })
        return pd.DataFrame(data)

def run_ingest():
    scraper = NREGAScraper()
    generator = SyntheticGenerator()
    
    # 1. Scrape (Mocked real HTTP)
    html = scraper.fetch_report("rejected_transactions", "Muzaffarpur", "2023-Q4")
    
    # 2. Synthetic Gen (5000 records)
    df = generator.generate_worker_panel(5000)
    
    # 3. HTML -> Parquet Staging
    df.to_parquet(PARQUET_DIR / "workers.parquet")
    print(f"Ingestion complete. {len(df)} records staged to Parquet.")

if __name__ == "__main__":
    run_ingest()
