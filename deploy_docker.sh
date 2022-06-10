#!/bin/sh

docker build server/. -t sinal/server

docker build client/. -t sinal/client

docker save sinal/server | bzip2 | pv | ssh sinal@51.91.57.172 docker load

docker save sinal/client | bzip2 | pv | ssh sinal@51.91.57.172 docker load

ssh sinal@51.91.57.172 mkdir -p /home/sinal/prod/

scp docker-compose.prod.yml sinal@51.91.57.172:/home/sinal/prod/docker-compose.yml