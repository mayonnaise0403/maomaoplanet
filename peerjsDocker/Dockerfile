From node:18.11.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g peer

RUN npm install peerjs

COPY . /usr/src/app

EXPOSE 8081

# CMD ["peerjs", "--port", "8081"]

ENTRYPOINT ["peerjs"]
CMD ["--port", "8081"]