FROM node:15-alpine
WORKDIR /app

RUN apk update

COPY . .

RUN chmod -R u+rwx ./init.sh
CMD [ "./init.sh" ]