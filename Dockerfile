FROM node:lts-alpine AS base

# Prepare work directory
WORKDIR /elk

# Prepare pnpm ( refer to https://pnpm.io/installation#on-alpine-linux )
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

FROM base AS builder

COPY . ./

# Prepare deps
RUN apk update
RUN apk add git --no-cache

# Build
RUN pnpm i
RUN pnpm build

FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /elk/.output ./.output

EXPOSE 5314/tcp

ENV PORT=5314
CMD ["node", ".output/server/index.mjs"]
