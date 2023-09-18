FROM node:current-alpine3.12
LABEL org.opencontainers.image.source https://github.com/tonyxu-io/ics_filter

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .

ENV PORT 80
EXPOSE 8081

CMD ["npm", "start"]
