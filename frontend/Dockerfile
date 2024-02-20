FROM node:18-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /capturador
WORKDIR /capturador

RUN npm i -g yarn --force \
&& yarn install \
&& yarn build \
&& yarn global add serve \
&& yarn cache clean

CMD ["serve", "-s", "dist", "-l", "5000"]
