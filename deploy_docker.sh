#!/bin/sh

if [[ $# -eq 1 ]]; then
    docker build server/. -t sinal/server

    docker build -f client/Dockerfile.prod client/. -t sinal/client

    docker save sinal/server | bzip2 | pv | ssh $1 docker load

    docker save sinal/client | bzip2 | pv | ssh $1 docker load

    ssh $1 "mkdir -p ~/prod/"

    scp docker-compose.prod.yml $1:~/prod/docker-compose.yml
else
  echo "Provide 1 arguments: ip addrs to send it to"
fi