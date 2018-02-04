FROM node:8-alpine

COPY . /app
WORKDIR /app

EXPOSE 3000

CMD ["node", "app.js"]
