FROM node:18-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /capturador
WORKDIR /capturador

ARG VITE_URL_API                       
ENV VITE_URL_API=$VITE_URL_API 

ARG VITE_URL_OAUTH                       
ENV VITE_URL_OAUTH=$VITE_URL_OAUTH 

ARG VITE_CLIENT_ID                       
ENV VITE_CLIENT_ID=$VITE_CLIENT_ID 

ARG VITE_CLIENT_SECRET                       
ENV VITE_CLIENT_SECRET=$VITE_CLIENT_SECRET 

RUN npm i -g yarn --force \
&& yarn install \
&& yarn build \
&& yarn global add serve \
&& yarn cache clean

CMD ["serve", "-s", "dist", "-l", "5000"]
