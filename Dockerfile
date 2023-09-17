FROM node:20.6-alpine

ENV node_env=production
EXPOSE 3000

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
ADD public /usr/src/app/public
ADD src /usr/src/app/src

RUN npm install
RUN npm install -g serve
RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]