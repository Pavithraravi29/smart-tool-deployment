import asyncio
import asyncpg
import os
import time

async def init_db():
    max_retries = 5
    retry_interval = 5

    for attempt in range(max_retries):
        try:
            conn = await asyncpg.connect(
                user=os.environ.get("POSTGRES_USER", "postgres"),
                password=os.environ.get("POSTGRES_PASSWORD", "password"),
                database=os.environ.get("POSTGRES_DB", "test_database"),
                host=os.environ.get("POSTGRES_HOST", "db")
            )

            # Create tables
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS login (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL
                )
            ''')

            await conn.execute('''
                CREATE TABLE IF NOT EXISTS graph (
                    id SERIAL PRIMARY KEY,
                    tension DECIMAL,
                    torsion DECIMAL,
                    bending_moment_x DECIMAL,
                    bending_moment_y DECIMAL,
                    time_seconds DECIMAL,
                    temperature DECIMAL
                )
            ''')

            await conn.close()
            print("Database initialized successfully")
            return
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_interval} seconds...")
                time.sleep(retry_interval)
            else:
                print("Max retries reached. Database initialization failed.")
                raise

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(init_db())