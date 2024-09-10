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

# Check if the project directory already exists
if [ -d "Smart_tool_deployment" ]; then
    echo "Project directory already exists. Updating..."
    cd Smart_tool_deployment
    git pull
else
    # Clone the repository (assuming the code is in a Git repository)
    git clone https://github.com/Pavithraravi29/Smart_tool_deployment.git
    cd Smart_tool_deployment
fi

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