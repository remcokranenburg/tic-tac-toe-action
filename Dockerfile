FROM node:lts-alpine

COPY package.json package-lock.json /opt/tic-tac-toe/
RUN cd /opt/tic-tac-toe && npm install

COPY . /opt/tic-tac-toe

WORKDIR /opt/tic-tac-toe

ENTRYPOINT node /opt/tic-tac-toe/index.js
