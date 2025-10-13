# frontend/Dockerfile
# Multi-stage build for an Angular app served by nginx

### stage 1: build ###
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (use package-lock / npm ci for deterministic installs)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .

# Use the Angular CLI build script. Adjust flags if you use a different script name.
RUN npm run build -- --configuration=production


### stage 2: runtime (nginx) ###
FROM nginx:stable-alpine AS runtime

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built files. This uses a wildcard to copy the project folder inside dist.
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Optional: copy a custom nginx.conf if you need SPA pushState routing.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
