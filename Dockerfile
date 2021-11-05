FROM node:current-alpine3.12
LABEL org.opencontainers.image.source https://github.com/quinten1333/ics_filter

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .

ENV PORT 80
EXPOSE 80

CMD ["npm", "start"]
