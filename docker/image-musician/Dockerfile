FROM node:latest

MAINTAINER Christian Gomes <christian.gomes@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app

RUN npm install 

ENTRYPOINT ["node", "musician.js"]