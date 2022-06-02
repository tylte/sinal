FROM node:alpine3.14

WORKDIR /usr/src/app

# install packages
COPY package.json ./
RUN yarn

# Copy sources
COPY data/. data/.
COPY src/. src/.
COPY .docker.env ./.env
COPY tsconfig.json ./

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]