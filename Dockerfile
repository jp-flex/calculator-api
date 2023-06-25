FROM node:18

WORKDIR /server

COPY package.json ./

RUN npm install

RUN node -v

COPY . .


EXPOSE 8080


CMD [ "npm", "start" ]
