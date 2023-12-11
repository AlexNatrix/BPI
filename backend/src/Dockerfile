ARG NODE_VERSION=18.18.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /src

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD yarn run dev
