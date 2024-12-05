FROM node:20.16.0-alpine3.20

RUN apk add curl --no-cache
RUN apk update && apk upgrade
RUN addgroup -g 1001 dnd && adduser -D -u 1001 -G dnd dnd

WORKDIR /app

COPY --chown=dnd .next/standalone/ ./
COPY --chown=dnd .next/static/ ./.next/static
COPY --chown=dnd public ./public

USER root
RUN npm install cross-spawn@7.0.5 --save-exact --force

ENV NODE_ENV=production
ENV PORT=3000

USER dnd

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://$(ip -o -4 addr list | grep eth0 | awk '{print $4}' | sed 's/...$//'):3000/

CMD [ "node", "server.js" ]