FROM node:alpine

RUN mkdir -p /usr/app

WORKDIR /usr/app

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

COPY ./ ./

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]