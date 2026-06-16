# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A fork of [Elk](https://github.com/elk-zone/elk) — a Nuxt 3 web client for Mastodon — customized for **omedia.social**. Fork-specific work is committed under the `feat(omedia): ...` prefix and lives on the `customizations` branch (upstream `main` tracks elk-zone). Customizations so far: single-instance auth with new-tab OAuth, inline comments on posts, GIPHY + emoji pickers in composers, brand/terminology changes, a "new members" sidebar widget, and a Wordle game at `/wordle`.

## Commands

Package manager is **pnpm** (`pnpm@11.5.2`); Node is `lts/*`. Dev server runs on **port 5314**.

- `pnpm dev` — dev server against a live Mastodon server
- `pnpm dev:mocked` — dev server with a mocked logged-in user (`@elkdev@universeodon.com`), no real server needed; uses `.env.mock`
- `pnpm dev:pwa` / `pnpm dev:mocked:pwa` — same, with the PWA enabled
- `pnpm build` — production build (Nitro auto-selects the deploy preset, e.g. Vercel when `VERCEL=1`)
- `pnpm start` — run the built server from `.output/`
- `pnpm lint` / `pnpm lint:fix` — ESLint (a pre-commit hook runs `eslint --fix` on staged files via nano-staged)
- `pnpm typecheck` — `nuxt typecheck`
- `pnpm test` / `pnpm test:ci` — Vitest. Run a single test with `pnpm vitest run tests/<file>.test.ts` or filter with `pnpm vitest -t "<name>"`

After dependency or config changes, run `pnpm nuxi prepare` (also runs via `postinstall`) to regenerate `.nuxt/` types — TypeScript errors about missing auto-imports usually mean this is stale.

## Architecture

**Nuxt 3 SSR + Nitro.** `app/` holds the client app (Nuxt 4-style `srcDir`); `server/` holds Nitro API routes; `shared/` holds code used by both.

**Mastodon API layer** — `app/composables/masto/` wraps [Masto.js](https://github.com/neet/masto.js). `masto.ts` creates the REST + streaming clients and is exposed app-wide as `useMasto()` / `useMastoClient()`. Login (`mastoLogin`) builds clients from a stored `UserLogin` (server + token) and handles v1/v2 instance API fallback. The other files (`account.ts`, `status.ts`, `publish.ts`, `timeline.ts`, etc.) are feature-specific wrappers — prefer extending these over calling the raw client.

**Auto-imports** — composables, components, and utils are auto-imported by Nuxt; there are usually no import statements for them. `nuxt.config.ts` registers extra auto-import dirs (`composables/masto`, `composables/push-notifications`, `composables/settings`, `composables/tiptap`) and overrides `useI18n` to come from `~/utils/i18n`. When adding code under these, no manual import is needed.

**Server / OAuth** (`server/`) — `server/api/[server]/login.ts` and `oauth/[origin].ts` implement dynamic per-origin OAuth: an app is registered with the target Mastodon server on first use and its `client_id`/`client_secret` are cached in unstorage. **The login flow spans two requests (login → callback) that may hit different serverless instances, so the storage MUST be persistent** — `memory`/`fs` drivers break login on serverless.

**Storage driver** (`server/utils/shared.ts`, `appConfig.storage.driver`) — selected by `NUXT_STORAGE_DRIVER`: `fs` (local dev default), `cloudflare`, `vercel`, or `memory`. **Gotcha:** when `isCI` is true (true during cloud builds) and `NUXT_STORAGE_DRIVER` is unset, it defaults to `cloudflare`. On Vercel set `NUXT_STORAGE_DRIVER=vercel` plus `NUXT_VERCEL_URL`/`NUXT_VERCEL_TOKEN` (the code passes these explicitly, so blank values break the KV connection even if `KV_REST_API_*` exist).

**Runtime config** (`nuxt.config.ts` `runtimeConfig`) — public config maps from `NUXT_PUBLIC_*` env vars. This fork defaults to `defaultServer: 'omedia.social'` and `singleInstance: true`. `NUXT_PUBLIC_GIPHY_API_KEY` powers the GIPHY picker.

**Rich text** — composers use TipTap (`app/composables/tiptap/`) pinned to `2.27.2` across all `@tiptap/*` packages; keep them in lockstep. `content-parse.ts` / `content-render.ts` convert Mastodon HTML to/from the editor model.

**i18n** — `@nuxtjs/i18n` + vue-i18n. Locale files live in `locales/`; the locale list and per-language options (RTL `dir`, custom `pluralRule`, country variants) are configured in `config/i18n.ts`. Run `pnpm prepare-translation-status` after locale changes.

**Routing/rendering** — `routeRules` in `nuxt.config.ts` prerender `/`, disable prerender for `/settings/**`, and SWR-cache `/api/list-servers`. Routes such as the Wordle page own the keyboard via `app/plugins/magic-keys.client.ts` (extend `shortcutsDisabled` there when adding fullscreen/game routes).

**Styling** — UnoCSS (`unocss.config.ts`) with attributify-style class usage in templates (`hidden xl:block`, etc.); global CSS in `app/styles/`. Icons use the `i-<collection>:<name>` UnoCSS icon syntax (e.g. `i-ri:gamepad-line`).

**PWA / service worker** — `modules/pwa/` and `service-worker/`, configured in `config/pwa.ts`. PWA is only active with the `dev:pwa` scripts or in production.

## Conventions

- Commit messages use Conventional Commits; fork features use the `feat(omedia): ...` scope.
- `nuxt-security` is enabled in production only (off in dev and on Windows) — CSP/header behavior differs between dev and prod.
