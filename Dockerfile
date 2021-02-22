FROM node:15.8.0-buster

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install --production

FROM node:15.8.0-buster

WORKDIR /app
COPY --from=0 /app .
COPY . .

COPY startup.sh /
RUN chmod -R 777 /startup.sh
ENV NODE_ENV docker_dev
EXPOSE 3002

ENTRYPOINT [ "/bin/sh" ]
CMD [ "/startup.sh" ]
