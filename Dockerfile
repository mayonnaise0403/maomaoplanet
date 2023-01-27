From node:18.11.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

RUN npm install -g nodemon

RUN chmod a+x /usr/local/bin/nodemon 

RUN chown -R $USER:$GROUP ~/.npm 

CMD ["nodemon", "server.js"]

