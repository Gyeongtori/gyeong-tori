FROM node:lts-alpine as builder

WORKDIR /front

ENV PATH /front/node_modules/.bin:$PATH

COPY package.json /front/package.json


RUN npm install
RUN npm install react-scripts@3.0.1 -g


CMD ["npm", "start"]
