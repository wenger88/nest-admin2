FROM node:14.16.0 AS builder
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
RUN yarn build

CMD yarn start:dev

FROM node:14.16.0-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]
