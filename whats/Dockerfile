FROM node:14-alpine

RUN apk add --no-cache chromium 

WORKDIR /app

COPY package.json ./
COPY tokens .
COPY ormconfig.js .

RUN npm install --only=prod && npm i ts-node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY . .

RUN npm run build

CMD ["npm", "start"]
