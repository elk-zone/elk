FROM docker.io/library/node:lts-alpine AS base

# Prepare work directory
WORKDIR /elk

FROM base AS builder

# Prepare pnpm https://pnpm.io/installation#using-corepack
# workaround for npm registry key change
# ref. `pnpm@10.1.0` / `pnpm@9.15.4` cannot be installed due to key id mismatch · Issue #612 · nodejs/corepack
# - https://github.com/nodejs/corepack/issues/612#issuecomment-2629496091
RUN npm i -g corepack@latest && corepack enable

# Prepare deps
RUN apk update
RUN apk add git --no-cache

# Prepare build deps ( ignore postinstall scripts for now )
COPY package.json ./
COPY .npmrc ./
COPY pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm i --frozen-lockfile --ignore-scripts

# Copy all source files
COPY . ./

# Run full install with every postinstall script ( This needs project file )
RUN pnpm i --frozen-lockfile

# Build
RUN pnpm build

FROM base AS runner

ARG UID=911
ARG GID=911

# Create a dedicated user and group
RUN set -eux; \
    addgroup -g $GID elk; \
    adduser -u $UID -D -G elk elk;

USER elk

ENV NODE_ENV=production

COPY --from=builder /elk/.output ./.output

EXPOSE 5314/tcp

ENV PORT=5314

# Specify container only environment variables ( can be overwritten by runtime env )
ENV NUXT_STORAGE_FS_BASE='/elk/data'

# Persistent storage data
VOLUME [ "/elk/data" ]

CMD ["node", ".output/server/index.mjs"]
