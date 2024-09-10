import csv
import os
import psycopg2
from psycopg2.extras import execute_values

# Database connection parameters
db_params = {
    "dbname": os.getenv("POSTGRES_DB", "test_database"),
    "user": os.getenv("POSTGRES_USER", "postgres"),
    "password": os.getenv("POSTGRES_PASSWORD", "password"),
    "host": os.getenv("POSTGRES_HOST", "db"),
}

def import_csv_data(file_path):
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cur:
            with open(file_path, 'r') as csvfile:
                csvreader = csv.reader(csvfile)
                next(csvreader)  # Skip the header row
                data = [tuple(row) for row in csvreader]
                
                insert_query = """
                INSERT INTO graph (tension, torsion, bending_moment_x, bending_moment_y, time_seconds, temperature)
                VALUES %s
                ON CONFLICT DO NOTHING
                """
                execute_values(cur, insert_query, data)
            
            conn.commit()
    print("Data imported successfully")

if __name__ == "__main__":
    import_csv_data('/app/graph.csv')