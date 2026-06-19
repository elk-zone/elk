# Omedia Social (Elk Fork)

Internal Mastodon web client for the Omedia team.

This repository is a fork of Elk and includes Omedia-specific customizations:
- Omedia branding (logo, colors, naming)
- single-instance defaults (`omedia.social`)
- additional UI customizations

---

## Quick Start (Local Development)

### Requirements
- Node.js `lts/*`
- `pnpm` (`pnpm@11.5.2`)
- `corepack` enabled

### Run locally
```bash
corepack enable
pnpm install
pnpm dev
```

App runs on: `http://localhost:5314`

### Mocked mode (no real login required)
```bash
pnpm dev:mocked
```

---

## Environment Variables

Copy and edit:
```bash
cp .env.example .env
```

### Most important variables

#### Public (client)
- `NUXT_PUBLIC_DEFAULT_SERVER`
  Default server shown to users.
  Recommended: `omedia.social`

- `NUXT_PUBLIC_SINGLE_INSTANCE`
  Restrict app to one instance.
  Recommended: `true`

- `NUXT_PUBLIC_GIPHY_API_KEY`
  Needed for GIF picker.

- `NUXT_PUBLIC_TRANSLATE_API`
  Optional translation API URL.

- `NUXT_PUBLIC_PRIVACY_POLICY_URL`
  Optional privacy policy link.

#### Storage / server
- `NUXT_STORAGE_DRIVER`
  One of: `fs`, `vercel`, `cloudflare`
  - Local dev: `fs`
  - Self-hosted / Docker production: `fs` (must be backed by a **persistent volume**)
  - Serverless production: `vercel` or `cloudflare` (use these only on those platforms)

- `NUXT_STORAGE_FS_BASE`
  Path for filesystem storage (used when driver = `fs`). In Docker this is `/elk/data`, mounted to a persistent volume.

#### Admin / integration (optional)
- `NUXT_ADMIN_KEY`
- `NUXT_GITHUB_CLIENT_ID`
- `NUXT_GITHUB_CLIENT_SECRET`
- `NUXT_GITHUB_INVITE_TOKEN`

### Production note (important)
Login flow and server state require persistent storage.
Do **not** use ephemeral `memory` storage in production.

---

## Docker

This repo already includes:
- `Dockerfile`
- `docker-compose.yaml`

### Run with Docker Compose
```bash
mkdir -p elk-storage
sudo chown 911:911 ./elk-storage
docker compose up --build -d
```

App will be available on port `5314`.

### Why `chown 911:911`?
Container runs as non-root user `elk` (`UID/GID 911`) and needs write access to `/elk/data` for persistent app data.

### Environment in Docker
You can pass env vars via:
- `.env` file
- `environment:` block in `docker-compose.yaml`
- runtime `-e` flags

Example minimum set:
```env
NUXT_PUBLIC_DEFAULT_SERVER=omedia.social
NUXT_PUBLIC_SINGLE_INSTANCE=true
NUXT_STORAGE_DRIVER=fs
NUXT_STORAGE_FS_BASE=/elk/data
```

---

## Build and Run (without Docker)

```bash
pnpm build
pnpm start
```

---

## Useful Scripts

- `pnpm dev` - development server
- `pnpm dev:mocked` - development with mocked user
- `pnpm build` - production build
- `pnpm start` - run built output
- `pnpm lint` - lint project
- `pnpm typecheck` - Nuxt type checks
- `pnpm test` - run tests

---

## Tech Stack
- Nuxt 3 + Nitro
- Vue 3
- UnoCSS
- Masto.js
- pnpm

---

## License

MIT (inherits from upstream Elk fork licensing model).
