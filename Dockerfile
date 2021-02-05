FROM node:alpine3.12

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install --production

FROM node:alpine3.12

WORKDIR /app
COPY --from=0 /app .
COPY . .

RUN echo "140.82.114.4 github.com" >> /etc/hosts

COPY startup.sh /
RUN chmod -R 777 /startup.sh
ENV NODE_ENV docker_dev
EXPOSE 3002

ENTRYPOINT [ "/bin/sh" ]
CMD [ "/startup.sh" ]
