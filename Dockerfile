FROM node:15-alpine
WORKDIR /app

RUN apk update

COPY package.json .
RUN yarn

COPY . .

CMD [ "yarn", "start" ]