FROM node:lts-alpine as builder

WORKDIR /front

ENV PATH /front/node_modules/.bin:$PATH

COPY package.json /front/package.json

RUN npm install

COPY . ./
RUN npm run build

EXPOSE 3000
