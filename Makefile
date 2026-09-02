.PHONY: ingest transform score demo test

ingest:
	@echo "Running Data Ingestion..."
	python api/ingest.py

transform:
	@echo "Running Layer 1-3 Transformation..."
	python api/engine.py

score:
	@echo "Running Live Rescoring..."
	# In actual implementation, trigger /api/worklist endpoint re-eval
	python api/engine.py

agent:
	@echo "Running Loop Closure Agent..."
	python api/agent.py

demo: ingest transform score
	@echo "Demo prepared. Network can now be disconnected."

test:
	@echo "Running Pytest suite..."
	pytest tests/ -v
