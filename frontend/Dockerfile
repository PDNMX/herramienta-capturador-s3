FROM node:18-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /capturador
WORKDIR /capturador

RUN npm install \
&& npm cache clean --force 

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
