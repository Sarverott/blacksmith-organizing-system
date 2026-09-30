# BOS in a container: mount a workshop at /workshop
FROM node:22-alpine

RUN apk add --no-cache git bash

WORKDIR /opt/bos
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY . .

ENV BOS_WORKSHOP=/workshop
VOLUME /workshop

ENTRYPOINT ["node", "src/cli.mjs"]
CMD ["status"]
