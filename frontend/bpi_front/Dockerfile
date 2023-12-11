FROM node:18.18.0

WORKDIR /frontend

COPY package*.json ./

RUN yarn install

COPY . .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 24678
EXPOSE 3000

CMD ["yarn", "run", "dev"]
