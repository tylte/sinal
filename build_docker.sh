#!/bin/sh

docker build client/. -t sinal/client

docker build server/. -t sinal/server