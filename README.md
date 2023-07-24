# Calculator API
This repository contains the source code for the Calculator API, built with NestJS. The API provides various arithmetic and one non-arithmetic operation, user authentication, and record management functionalities. The remote version of Calculator api is hosted at:
https://calculator-api-production-97a7.up.railway.app

## API Documentation
After running the server. The swagger api doc can be accessed via:
- local context http://localhost:3001/api-docs
or 
- remote context https://calculator-api-production-97a7.up.railway.app/api-docs

For running the api through swagger, Bearer auth is necessary:
- call login endpoint with credentials: test@test.com | @11aa
- copy the token
- click the Authorize button on top right
- paste the token and click Authorize
- now the non auth endpoints are authorized

## User test credentials for local and remote env
```shell
username: test@test.com
password: @11aa
```

## Features
- User signup and login with authentication
- Arithmetic operations (addition, subtraction, multiplication, division, square root)
- Non-arithmetic operations (generate random string)
- The logic related to the arithmetic and non-arithmetic ops are at calculator_usecase package
- Record management (retrieve operation records, delete operation records)
- Each operation have a pre configured cost and the user must has enough balance to proceed with the operation
- JWT Authentication (Bearer Auth)
- The initial balance for each user is 200 and can be changed at RecordService.USER_INITIAL_BALANCE
- The user balance is deducted by the cost of the operation
- Seeder (operation.seeder.ts) file which inserts new opearations and test credentials
- Security:
    - Bearer Auth for api acess
    - JWT for credentials management
    - CORS
    - Helmet

## Prerequisites
- Docker (env variables and local database configs are defined at the docker compose file)
- NodeJS
- NPM

## Getting Started in your local environment

There is a docker compose file which orchestrates the app and postgres image for local development
To get started with the Calculator API, follow the steps below:

1. Clone the repository:
   ```shell
   git clone https://github.com/jp-flex/calculator-api.git
   ```

2. Change into the project directory:
    ```shell
    cd calculator-api
    ```

3. Build and run the Docker containers using Docker Compose:
    ```shell
    docker-compose up -d --build
    ```
4. Run unit tests:
   by docker (after running the app):
    ```shell
    docker exec -it calculator-api npm test
    ```
   by local environment:
   npm install
   npm test

5. The server should be up and running at: http://localhost:3001


## Remote environment
The server is hosted at RailWay: 
https://calculator-api-production-97a7.up.railway.app/

Railway uses DockerFile to deploy the server
The Postgres server is also hosted at RailWay (the remote pg env variables are defined at RailWay)

## Tech Debt
- in the context of a real production app maybe in the future add a migration framework