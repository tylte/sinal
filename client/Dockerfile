FROM node:alpine3.14

WORKDIR /usr/src/app

# install packages
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Copy sources
COPY src/. src/.
COPY static/. static/.
COPY tsconfig.json ./

RUN yarn build


EXPOSE 3000

CMD ["yarn", "start"]