# syntax=docker/dockerfile:1

# Base
ARG NODE_VERSION=18
ARG NGINX_VERSION=1.27.0
ARG ANGULAR_VERSION=17.3.8

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
EXPOSE 4205


# Develop
FROM base AS development

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --include=dev

COPY . .

RUN npm install

RUN npm install -g @angular/cli@${ANGULAR_VERSION}

CMD ["ng", "serve", "--host", "0.0.0.0"]

# ----------
# QA
FROM node:${NODE_VERSION}-alpine AS test

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Run the application as a non-root user.
USER root

# Copy the rest of the source files into the image.
COPY --from=development /usr/src/app .

# Expose the port that the application listens on.
EXPOSE 4215

# Run the application.
RUN npm install -g @angular/cli@${ANGULAR_VERSION}

# RUN npm install
CMD ["ng", "serve", "--host", "0.0.0.0"]

# ----------
# Production
FROM base AS angular-production

COPY --from=development /usr/src/app .

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev

RUN npm install -g @angular/cli@${ANGULAR_VERSION}
RUN npm run build

# nginx production
FROM nginx:${NGINX_VERSION} AS nginx-prod

COPY --from=angular-production /usr/src/app/dist/frontend /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 81
