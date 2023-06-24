FROM node:18

WORKDIR /server

COPY package.json ./


RUN npm install pg --save

RUN npm install

RUN node -v

COPY . .



# Expose the app port
EXPOSE 8080


CMD [ "npm", "start" ]
