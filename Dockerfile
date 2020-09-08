FROM mhart/alpine-node:12

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install --production

FROM mhart/alpine-node:slim-12

WORKDIR /app
COPY --from=0 /app .
COPY . .

COPY startup.sh /
RUN chmod -R 777 /startup.sh
ENV NODE_ENV docker_dev
EXPOSE 3002

ENTRYPOINT [ "/bin/sh" ]
CMD [ "/startup.sh" ]
