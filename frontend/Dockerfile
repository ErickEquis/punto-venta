# syntax=docker/dockerfile:1

# Base image con amd64 y glibc
ARG NODE_VERSION=20
ARG NGINX_VERSION=1.27.0
ARG ANGULAR_VERSION=17.3.8

# Usa una imagen de Node.js que sea compatible con amd64 y glibc
FROM --platform=linux/amd64 node:${NODE_VERSION}-bullseye-slim AS base
WORKDIR /usr/src/app
EXPOSE 4205

# Develop
FROM base AS development

# Copia solo los archivos necesarios para la instalación de dependencias primero
COPY package*.json .

# Instala dependencias asegurando que npm utiliza glibc
RUN npm i --platform=linux --arch=x64

# Copia el resto del código
COPY . .

# Usa la versión local de Angular CLI
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]

# ----------
# QA
FROM base AS test

# Usa el entorno de producción por defecto
ENV NODE_ENV production

WORKDIR /usr/src/app

# Run the application as a non-root user.
USER node

# Copia la aplicación desde el entorno de desarrollo
COPY --from=development /usr/src/app .

# Usa la versión local de Angular CLI
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]

# ----------
# Production
FROM base AS angular-production

# Copia la aplicación desde el entorno de desarrollo
COPY --from=development /usr/src/app .

# Construye la aplicación en modo producción
RUN npx ng build --configuration=production

# nginx production
FROM --platform=linux/amd64 nginx:${NGINX_VERSION} AS nginx-prod

# Copia los archivos compilados al servidor nginx
COPY --from=angular-production /usr/src/app/dist/frontend/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto que nginx usará
EXPOSE 81
