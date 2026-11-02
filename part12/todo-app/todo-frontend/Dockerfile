FROM node:22 AS build-stage

WORKDIR /usr/src/app

COPY . .

ARG VITE_BACKEND_URL=http://localhost:8080/api

RUN npm ci

RUN npm test

RUN npm run build

# This is a new stage, everything before this is gone, except for the files that we want to COPY
FROM nginx:1.29-alpine

# COPY the directory dist from the build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
