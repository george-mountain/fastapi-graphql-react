FROM node:23 as admin-build-stage
RUN echo "NODE Version:" && node --version
WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retry-maxtimeout 120000

RUN npm i --force

COPY . .

EXPOSE 3000


