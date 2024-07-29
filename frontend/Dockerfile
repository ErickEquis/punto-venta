# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

# Develop
ARG NODE_VERSION=12.22.0

FROM node:${NODE_VERSION}-alpine AS development

# Use production node environment by default.
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER root

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 4205

# Run the application.
RUN npm install -g @angular/cli@8.3.29

RUN npm install

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
FROM node:${NODE_VERSION}-alpine AS angular-production

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Run the application as a non-root user.
USER root

# Copy the rest of the source files into the image.
COPY --from=development /usr/src/app .

# Run the application.
RUN npm install -g @angular/cli@8.3.29
RUN npm run build --prod

# nginx production
FROM nginx:latest AS nginx-prod

COPY --from=angular-production /usr/src/app/dist/frontend /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
COPY /ssl .

EXPOSE 80
