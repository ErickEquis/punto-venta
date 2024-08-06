# syntax=docker/dockerfile:1

# Base
ARG NODE_VERSION=12.22.0
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

RUN npm install -g @angular/cli@8.3.29

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
RUN npm install -g @angular/cli@8.3.29

# RUN npm install
CMD ["ng", "serve", "--host", "0.0.0.0"]

# ----------
# Production
FROM base AS angular-production

COPY --from=development /usr/src/app .

RUN npm install -g @angular/cli@8.3.29
RUN npm run build --prod

# nginx production
FROM nginx:latest AS nginx-prod

COPY --from=angular-production /usr/src/app/dist/frontend /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 81
