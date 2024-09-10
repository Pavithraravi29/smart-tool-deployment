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
if [ -d "Smart_tool_deployment" ]; then
    echo "Project directory already exists. Updating..."
    cd Smart_tool_deployment
    git pull
else
    git clone https://github.com/Pavithraravi29/Smart_tool_deployment.git
    cd Smart_tool_deployment
fi

# Function to create file if it doesn't exist
create_file_if_not_exists() {
    if [ ! -f "$1" ]; then
        echo "Creating $1"
        touch "$1"
        echo "$2" > "$1"
    fi
}

# Create necessary files if they don't exist
create_file_if_not_exists "backend/Dockerfile" "
FROM python:3.9-slim
WORKDIR /app
COPY . /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD [\"sh\", \"-c\", \"python init_db.py && uvicorn main:app --host 0.0.0.0 --port 8000\"]
"

create_file_if_not_exists "frontend/Dockerfile" "
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [\"nginx\", \"-g\", \"daemon off;\"]
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

  frontend:
    build: ./frontend
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

  nginx:
    image: nginx:alpine
    ports:
      - \"80:80\"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
"

create_file_if_not_exists "nginx.conf" "
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        
        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }

        location /api/ {
            proxy_pass http://backend:8000/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }

        location /ws {
            proxy_pass http://backend:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection \"upgrade\";
        }
    }
}
"

# Build and start the containers
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "Installation complete! The application is now running."
    echo "You can access it by opening a web browser and navigating to http://localhost"
else
    echo "Something went wrong. Please check the Docker logs for more information."
    docker-compose logs
    exit 1
fi