# 90-Day Pilot Proposal

This document outlines the proposed 90-day pilot for deploying Antim Rupee in a single district (e.g., Muzaffarpur, Bihar).

## Parameters
- **Scope**: 1 District (Muzaffarpur)
- **Feeds**: 2 (NREGA MIS FTO Status, Bank Branch Rejection Report)
- **Personnel**: 1 dedicated operator at the District Program Coordinator (DPC) office.

## Success Metric (90-Day)
**The 90-Day Metric**: 80% reduction in the "mean days pending" for silent exclusion failures, and the recovery of at least ₹50 Lakhs in blocked wages currently invisible to the grievance system.

## Cost Structure
- **Cloud Run (API + Frontend)**: Scale-to-zero, estimated ~$15/month at pilot scale.
- **Gemini API (Layer 2 Fallback)**: ~$5/month (invoked only on the ~9% of unknown rejection strings).
- **Storage (DuckDB / Cache)**: < $2/month on standard block storage.

## What Doesn't Change
- **No new apps for workers**: Workers do not need to download an app or file a digital grievance. The system works proactively.
- **No changes to banking infrastructure**: The engine parses the existing, messy outputs of the current PMFS/State Bank integration.
- **No LLM in the decision loop**: The AI does not decide who gets paid or whose claim is rejected. It strictly normalizes text strings.
