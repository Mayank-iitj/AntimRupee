# Synthetic Data Snapshot (SNAPSHOT.md)

Because actual worker names, Aadhaar numbers, and granular bank account details are protected PII, this repository utilizes a **Calibrated Synthetic Panel Generator** (`SyntheticGenerator` in `ingest.py`) to hydrate the local DuckDB warehouse for demonstration purposes.

## Simulated vs. Real Data Statement
The **statistical distributions, block-level aggregations, and failure code ratios** represent real, published NREGA MIS marginals for the Muzaffarpur district (Q4 2023). 

However, all **individual person-level identifiers** are synthetically generated.

### Field Mappings

| Database Column | Is Synthetic? | Source / Marginal Match |
|-----------------|---------------|-------------------------|
| `worker_id` | YES | Surrogate UUID |
| `jobcard_id` | YES | Format simulated, length matched to state format |
| `name_local` | YES | Random selection from regional name dictionary |
| `name_bank` | YES | Synthetic mutation of `name_local` to simulate spelling errors |
| `ifsc_code` | YES | Simulated valid IFSCs distributed according to real bank market share |
| `block_id` | NO | Real administrative blocks in Muzaffarpur |
| `cause_code` | NO | Real rejection codes published by PFMS |
| `unpaid_amount` | NO | Drawn from actual published failure totals |

All synthetic columns carry an `is_synthetic_X` boolean flag in the schema, which is passed up to the UI to trigger the yellow "Data Notice" banner.
