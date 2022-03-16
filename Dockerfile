FROM node:15-alpine
WORKDIR /app

RUN apk update

COPY package.json .
COPY yarn.lock .
RUN yarn install --ignore-engines

COPY . .

CMD [ "yarn", "start" ]
