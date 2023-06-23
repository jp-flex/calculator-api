FROM node:18

WORKDIR /server

COPY package.json ./

COPY . .

RUN npm install pg --save

RUN npm install

RUN node -v


# Expose the app port
EXPOSE 8080


CMD [ "npm", "start" ]
