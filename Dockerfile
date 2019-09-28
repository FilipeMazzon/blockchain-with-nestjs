FROM node:10-alpine
WORKDIR /app

RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*

RUN chown node /app
USER node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm","run","start:dev"]
