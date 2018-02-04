FROM node:8-alpine

COPY . /app
WORKDIR /app

CMD ["node", "app.js"]
