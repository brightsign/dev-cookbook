FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY server.js ./
COPY autorun ./autorun
COPY content ./content

RUN mkdir -p /app/data

EXPOSE 3000

ENV PORT=3000
ENV DB_PATH=/app/data/provisioning.db

CMD ["node", "server.js"]
