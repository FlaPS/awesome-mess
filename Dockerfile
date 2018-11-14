FROM node:carbon-alpine

WORKDIR /usr/app

COPY package.json ./
COPY lerna.json ./
COPY tslint.json ./
COPY .stylelintrc ./

COPY ./typings ./typings
COPY ./packages ./packages


RUN npm set registry http://192.168.0.216:4873
RUN npm run clear

RUN npm install -g lerna
RUN npm install
RUN lerna bootstrap

CMD [ "npm", "run", "lerna:test" ]
