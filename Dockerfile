# syntax=docker/dockerfile:1

FROM node:16.13-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY . .

RUN npm ci --production=false

CMD [ "npm", "run", "start" ]