FROM node:14

ADD . /opt/receiverbook
WORKDIR /opt/receiverbook

RUN [ "npm", "install" ]

EXPOSE 3000

CMD [ "index.js" ]