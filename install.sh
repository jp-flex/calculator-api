#!/bin/bash

# Install Docker if not already installed
apt-get update
apt-get install -y docker.io

# Build and run the Docker containers
cd /var/www/calculator_api
docker-compose up -d