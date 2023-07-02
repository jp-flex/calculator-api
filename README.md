# Calculator API
This repository contains the source code for the Calculator API, built with NestJS. The API provides various arithmetic and non-arithmetic operations, user authentication, and record management functionalities.

## Features
- User signup and login with authentication
- Arithmetic operations (addition, subtraction, multiplication, division)
- Non-arithmetic operations (generate random string)
- Record management (retrieve operation records, delete operation records)
- Each operation have a pre configured cost and the user must has enough balance to proceed with the operation
- The initial balance for each user is 200 and can be changed at RecordService.USER_INITIAL_BALANCE
- The user balance is deducted by the cost of the operation 

## Prerequisites
- Docker
- NodeJS
- NPM

## Getting Started in your local environment

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
    docker-compose up -d --build
    ```
4. The server should be up and running at: http://localhost:3001

## API Documentation
After running the server. There is an api swagger doc at http://localhost:3001/api-docs 