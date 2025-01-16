FROM docker.io/library/node:lts-alpine AS base

ENV NUXT_PUBLIC_DEFAULT_SERVER=bdx.town
ENV NUXT_PUBLIC_SINGLE_INSTANCE=false

# Prepare work directory
WORKDIR /elk

FROM base AS builder

# Prepare yarn
RUN corepack enable

# Prepare deps
RUN apk update
RUN apk add git --no-cache

# Prepare build deps ( ignore postinstall scripts for now )
COPY package.json ./
COPY .npmrc ./
COPY yarn.local.lock ./yarn.lock
RUN yarn install --ignore-scripts

# Copy all source files
COPY . ./

# Run full install with every postinstall script ( This needs project file )
RUN yarn install

# Build
RUN yarn build

FROM base AS runner

ENV NODE_ENV=production

ARG UID=911
ARG GID=911

# Create a dedicated user and group
RUN set -eux; \
    addgroup -g $GID elk; \
    adduser -u $UID -D -G elk elk;

USER elk

COPY --from=builder /elk/.output ./.output

EXPOSE 5314/tcp

ENV PORT=5314

# Specify container only environment variables ( can be overwritten by runtime env )
ENV NUXT_STORAGE_FS_BASE='/elk/data'

# Persistent storage data
VOLUME [ "/elk/data" ]

CMD ["node", ".output/server/index.mjs"]
