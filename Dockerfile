FROM node:16-alpine

WORKDIR /client

COPY package.json ./

RUN npm install

RUN node -v

COPY . .

ENV REACT_APP_SERVER_HOST=http://localhost:3001/truenorth

EXPOSE 3000


CMD [ "npm", "start" ]
