# Install packages and build
FROM node:18-alpine as builder

WORKDIR /app

COPY . /app

RUN yarn install

# Install packages and build (react)
FROM node:18-alpine as react-builder

WORKDIR /app

COPY ./wizard /app

RUN yarn install

RUN yarn build

# Copy build to production image
FROM node:18-alpine

ENV NODE_ENV production

USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/yarn.lock ./
COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/ ./

COPY --from=react-builder --chown=node:node /app/build/ ./wizard/build/

# 실행시킬 파일명이 index.js가 아니라면 적절히 변경해주세요
CMD ["node", "new.js"]