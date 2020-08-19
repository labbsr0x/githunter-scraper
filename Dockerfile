FROM mhart/alpine-node

WORKDIR /app
COPY . .

ENV NODE_ENV docker_dev

RUN npm install --production

COPY startup.sh /
RUN chmod -R 777 /startup.sh

EXPOSE 3002

ENTRYPOINT [ "/bin/sh" ]
CMD [ "/startup.sh" ]