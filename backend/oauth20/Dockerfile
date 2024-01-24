FROM node:16-alpine
ADD . /oauth20v2
WORKDIR /oauth20v2

RUN yarn add global yarn \
&& yarn install \
&& yarn cache clean

EXPOSE 3005

CMD ["yarn", "start"]

