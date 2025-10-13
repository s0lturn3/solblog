# backend/Dockerfile
# Multi-stage build for NestJS (or Node) application

### stage: deps (production deps) ###
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./

# Install only production deps for final image
RUN npm ci --omit=dev


### stage: build (install dev deps, compile) ###
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./

# Instala o Nest globalmente no container
RUN npm install -g @nestjs/cli

RUN npm ci

# Preserve node_modules ao bind‑muntar o restante
VOLUME [ "/app/node_modules" ]

COPY . .

# Build TypeScript to dist (assumes "npm run build" exists and creates /dist)
RUN npm run build


### stage: runner ###
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules and built artifacts
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Expose the default NestJS port (adjust if your app uses another)
EXPOSE 3000

# Run the compiled app (adjust path if different)
CMD [ "npm", "run", "start:dev" ]
