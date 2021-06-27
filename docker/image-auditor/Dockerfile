FROM node:latest

MAINTAINER Christian Gomes <christian.gomes@heig-vd.ch>

COPY src /opt/app

WORKDIR /opt/app

RUN npm install

# Command to be executed when running a container
ENTRYPOINT ["node", "auditor.js"]