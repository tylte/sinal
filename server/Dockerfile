FROM node:alpine3.14

WORKDIR /usr/src/app

# install packages
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Copy sources
COPY data/. data/.
COPY src/. src/.
COPY tsconfig.json ./

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]