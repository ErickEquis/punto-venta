# syntax=docker/dockerfile:1

# Base
ARG NODE_VERSION=12.22.0

FROM node:${NODE_VERSION}-alpine AS base
RUN apk --no-cache add curl
WORKDIR /usr/src/app
EXPOSE 8880

# Develop
FROM base AS development

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

RUN npm i nodemon

USER node

COPY . .

CMD npm start

# ----------
# QA
FROM node:${NODE_VERSION}-alpine AS test

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY --from=development /usr/src/app .

# Expose the port that the application listens on.
EXPOSE 8880

# Run the application.
CMD npm start

# ----------
# Production
FROM base AS production

ENV NODE_ENV production

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

RUN npm install pm2 -g

USER node

COPY --from=development /usr/src/app .

CMD pm2-runtime app.js
