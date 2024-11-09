FROM node:18-alpine as builder

WORKDIR /app

COPY pasckage*.json ./

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build



FROM node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /app

COPY pasckage*.json ./

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./

EXPOSE 5501

CMD ["node", "src/server.js"]