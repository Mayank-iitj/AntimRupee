from google.cloud import bigquery
import os

def setup_bigquery():
    # Initialize a BigQuery client
    try:
        client = bigquery.Client()
    except Exception as e:
        print(f"Failed to initialize BigQuery client: {e}. Please ensure you have GOOGLE_APPLICATION_CREDENTIALS set.")
        return

    project_id = client.project
    dataset_id = "antim_rupee"
    dataset_ref = f"{project_id}.{dataset_id}"

    # Create dataset if it doesn't exist
    dataset = bigquery.Dataset(dataset_ref)
    dataset.location = "asia-south1"
    try:
        dataset = client.create_dataset(dataset, exists_ok=True)
        print(f"Dataset {dataset.dataset_id} created or already exists.")
    except Exception as e:
        print(f"Error creating dataset: {e}")
        return

    # Schema for citizen_requests
    requests_schema = [
        bigquery.SchemaField("original_text", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("english_text", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("source", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("category", "STRING", mode="NULLABLE"),
        bigquery.SchemaField("timestamp", "TIMESTAMP", mode="NULLABLE", default_value_expression="CURRENT_TIMESTAMP()"),
    ]
    requests_table_ref = f"{dataset_ref}.citizen_requests"
    requests_table = bigquery.Table(requests_table_ref, schema=requests_schema)

    # Schema for recommended_projects
    projects_schema = [
        bigquery.SchemaField("cluster_id", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("dimension_value", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("priority", "FLOAT", mode="REQUIRED"),
        bigquery.SchemaField("workers_affected", "INTEGER", mode="REQUIRED"),
        bigquery.SchemaField("unpaid_total", "FLOAT", mode="REQUIRED"),
        bigquery.SchemaField("mean_days_pending", "INTEGER", mode="REQUIRED"),
        bigquery.SchemaField("cause_code", "STRING", mode="REQUIRED"),
        bigquery.SchemaField("group_rate", "FLOAT", mode="REQUIRED"),
        bigquery.SchemaField("baseline_rate", "FLOAT", mode="REQUIRED"),
        bigquery.SchemaField("status", "STRING", mode="NULLABLE", default_value_expression="'open'"),
    ]
    projects_table_ref = f"{dataset_ref}.recommended_projects"
    projects_table = bigquery.Table(projects_table_ref, schema=projects_schema)

    try:
        client.create_table(requests_table, exists_ok=True)
        print(f"Table citizen_requests created or already exists.")
        client.create_table(projects_table, exists_ok=True)
        print(f"Table recommended_projects created or already exists.")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    setup_bigquery()
