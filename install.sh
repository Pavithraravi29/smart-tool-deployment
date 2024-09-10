#!/bin/bash

set -e

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Clone or update the repository
if [ -d "smart-tool-deployment" ]; then
    echo "Project directory already exists. Updating..."
    cd smart-tool-deployment
    git pull
else
    git clone https://github.com/Pavithraravi29/smart-tool-deployment.git
    cd smart-tool-deployment
fi

# Function to create file if it doesn't exist
create_file_if_not_exists() {
    if [ ! -f "$1" ]; then
        echo "Creating $1"
        mkdir -p "$(dirname "$1")"
        touch "$1"
        echo "$2" > "$1"
    fi
}

# Create necessary files if they don't exist
create_file_if_not_exists "backend/Dockerfile" "
FROM python:3.9-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD [\"sh\", \"-c\", \"python import_data.py && uvicorn main:app --host 0.0.0.0 --port 8000\"]
"

create_file_if_not_exists "backend/import_data.py" "
import csv
import os
import psycopg2
from psycopg2.extras import execute_values

# Database connection parameters
db_params = {
    \"dbname\": os.getenv(\"POSTGRES_DB\", \"test_database\"),
    \"user\": os.getenv(\"POSTGRES_USER\", \"postgres\"),
    \"password\": os.getenv(\"POSTGRES_PASSWORD\", \"password\"),
    \"host\": os.getenv(\"POSTGRES_HOST\", \"db\"),
}

def import_csv_data(file_path):
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cur:
            with open(file_path, 'r') as csvfile:
                csvreader = csv.reader(csvfile)
                next(csvreader)  # Skip the header row
                data = [tuple(row) for row in csvreader]
                
                insert_query = \"\"\"
                INSERT INTO graph (tension, torsion, bending_moment_x, bending_moment_y, time_seconds, temperature)
                VALUES %s
                ON CONFLICT DO NOTHING
                \"\"\"
                execute_values(cur, insert_query, data)
            
            conn.commit()
    print(\"Data imported successfully\")

if __name__ == \"__main__\":
    import_csv_data('graph.csv')
"

create_file_if_not_exists "backend/graph.csv" "
tension,torsion,bending_moment_x,bending_moment_y,time_seconds,temperature
100.5,50.2,75.3,60.1,0,25.0
102.0,51.5,76.0,61.2,1,25.2
103.2,52.1,76.5,62.0,2,25.3
101.8,50.9,75.8,61.5,3,25.1
104.0,53.0,77.2,62.8,4,25.5
"

create_file_if_not_exists "backend/requirements.txt" "
fastapi
uvicorn
psycopg2-binary
"

create_file_if_not_exists "frontend/Dockerfile" "
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:14-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 3000
CMD [\"serve\", \"-s\", \".\", \"-l\", \"3000\"]
"

create_file_if_not_exists "docker-compose.yml" "
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=test_database
      - POSTGRES_HOST=db
    depends_on:
      - db
    ports:
      - \"8000:8000\"

  frontend:
    build: ./frontend
    ports:
      - \"3000:3000\"
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=test_database
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
"

# Build and start the containers
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "Installation complete! The application is now running."
    echo "You can access the frontend by opening a web browser and navigating to http://localhost:3000"
    echo "The backend API is available at http://localhost:8000"
else
    echo "Something went wrong. Please check the Docker logs for more information."
    docker-compose logs
    exit 1
fi