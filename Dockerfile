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

# Remove dev deps ( skip postinstall script after removing dev deps or it will fail )
RUN pnpm i -P --ignore-scripts

FROM base AS runner

ENV NODE_ENV=production

COPY ./package.json ./
COPY --from=builder /elk/node_modules ./node_modules
COPY --from=builder /elk/.output ./.output

EXPOSE 5314/tcp

CMD ["pnpm", "start"]
