# Calculator API
This repository contains the source code for the Calculator API, built with NestJS. The API provides various arithmetic and non-arithmetic operations, user authentication, and record management functionalities.

## Features
- User signup and login with authentication
- Arithmetic operations (addition, subtraction, multiplication, division)
- Non-arithmetic operations (generate random string)
- Record management (retrieve operation records, delete operation records)

## Prerequisites
- Docker
- Docker Compose

## Getting Started

To get started with the Calculator API, follow the steps below:

1. Clone the repository:
   ```shell
   git clone https://github.com/your-repository/calculator-api.git
   ```

2. Change into the project directory:
```shell
cd calculator-api
```

3. Build and run the Docker containers using Docker Compose:
```shell
docker-compose up --build
```
This command will download the necessary Docker images, build the application, and start the API server.

## API Documentation
After running the server. There is an api swagger doc at http://localhost:3001/api-docs 