# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

Elk is a nimble Mastodon web client built with Nuxt 4, Vue 3, and TypeScript. It talks to any Mastodon-compatible instance via [Masto.js](https://neet.github.io/masto.js) and can run as a PWA.

## Contribution policy

The full contribution policy — including how AI assistance may be used — is in [CONTRIBUTING.md](./CONTRIBUTING.md) and is the single source of truth. The gist: the human contributor must understand and take responsibility for every change (including anything an agent drafts) and write PR, commit, and issue text in their own words.

One rule is directed specifically at automated agents: **never add the DCO sign-off.** It certifies a *human's* review, so it must be a deliberate human act. If you are an AI agent, do not run `git commit -s` or `git rebase --signoff`, do not insert a `Signed-off-by:` line by any other means, and leave commits unsigned for the contributor to sign.

## Commands

Package manager is **pnpm** (via corepack). Node LTS (`.nvmrc` = `lts/*`).

```bash
pnpm i                        # install; postinstall runs `nuxt prepare`
pnpm dev                      # dev server on http://localhost:5314
pnpm dev:mocked               # dev with a mocked logged-in user (@elkdev@universeodon.com) — no real instance needed
pnpm dev:pwa                  # dev with PWA/service worker enabled (test in a Chromium private window only)
pnpm build                    # production build
```

Quality gates (run both before opening a PR — CI enforces them):

```bash
pnpm test:unit:ci             # the script that will run vitest once
pnpm test:typecheck           # vue-tsc -b --noEmit — the TS check CI runs (NOT `nuxt typecheck`)
pnpm lint                     # eslint (antfu config); `pnpm lint:fix` to autofix
```

Running a single test:

```bash
pnpm vitest tests/unit/language.test.ts       # one file
pnpm vitest -t "timeline reordering"          # by test name (matches the describe block)
```

Tests live in `tests/unit/` (plain vitest) and `tests/nuxt/` (run in the `nuxt` vitest project with a Nuxt environment + IndexedDB/IntersectionObserver mocks; see `vitest.config.ts` and `tests/setup.ts`). Content-rendering tests use snapshots in `tests/nuxt/__snapshots__/`.

## Architecture

### Nuxt auto-imports are pervasive
Composables, components, and utils are auto-imported — do **not** add manual imports for them. Beyond Nuxt defaults, `nuxt.config.ts` registers these dirs for auto-import: `app/composables/masto`, `app/composables/push-notifications`, `app/composables/settings`, `app/composables/tiptap`. `useI18n` is overridden to come from `~/utils/i18n` (priority import), so use the app's `useI18n`, not vue-i18n's directly.

Path aliases: `~` / `@` → `app/`, `#shared` → `shared/` (types shared between app and server).

### State: module-level refs, not a conventional store
Despite Pinia being installed, most global state is **module-scoped `ref`s exported from composables**, persisted via VueUse `useLocalStorage`/IndexedDB. The canonical example is `app/composables/users.ts`:
- `currentUser`, `currentInstance`, `currentServer`, `currentUserHandle` are computed/refs exported at module scope — import and use them directly anywhere.
- Multi-account: `users` holds all logged-in accounts; switching accounts swaps `currentUserHandle`.
- Instance metadata is cached in `instanceStorage` (localStorage) keyed by server domain.

### Mastodon API access (`app/composables/masto/`)
- `useMasto()` / `useMastoClient()` return the Masto.js REST client wired up in `masto.ts`. Streaming (WebSocket) goes through `useStreaming()`.
- `mastoLogin()` builds the REST + streaming clients for a user session and backfills instance info (with a v2→v1 instance-API fallback for older/GoToSocial servers).
- Domain logic is split by concern: `status.ts`, `account.ts`, `relationship.ts`, `publish.ts`, `notification.ts`, `search.ts`, `statusDrafts.ts`, `translate.ts`, `routes.ts`.
- Pagination is handled by `usePaginator` (`app/composables/paginator.ts`); timelines and their reordering logic live in `app/composables/timeline.ts`.

### SSR mocking of client-only deps
`nuxt.config.ts` `vite:extendConfig` hook replaces heavy client-only packages (all `@tiptap/*`, `prosemirror*`, `fuse.js`, `eventemitter3`, `isomorphic-ws`) with stubs from `mocks/` during **server** builds. When adding a dependency that only works in the browser (editor, DOM, WebSocket), it likely needs a mock entry here or SSR will break.

### Rich text & content rendering
- Composing uses **TipTap/ProseMirror** (`app/composables/tiptap*`, `app/components/tiptap/`) with custom emoji, mention, and Shiki code-block extensions.
- Rendering Mastodon HTML into Vue is a custom pipeline: `content-parse.ts` (parse via `ultrahtml`/`cheerio`) → `content-render.ts` (render to VNodes). Changes here are what the `tests/nuxt/content-rich.test.ts` snapshots guard.

### Server routes (`server/`)
Nitro API routes handle the OAuth flow and instance list: `server/api/[server]/login.ts`, `oauth/[origin].ts`, `list-servers.ts`. Server-side storage uses `unstorage`; the driver is chosen at build time (`fs` locally, `cloudflare`/`vercel`/`upstash` in prod) via `NUXT_STORAGE_DRIVER` and the `#storage-config` virtual module.

### Custom Nuxt modules (`modules/`)
`modules/pwa/` is a local module wrapping vite-plugin-pwa with i18n-aware manifest generation. `build-env.ts` injects build/git info, `purge-comments.ts` and `emoji-mart-translation.ts` are build-time transforms.

### Styling: UnoCSS
Styling is **UnoCSS** utility classes (config in `unocss.config.ts`), not Tailwind. Global CSS and CSS variables are in `app/styles/`. Icons come from Iconify presets — reference them as classes (e.g. `i-ri:home-line`).

## Conventions

### RTL support is mandatory
Elk supports RTL languages, and HTML `dir` alone is insufficient. **Never use physical direction utilities** — use logical ones:
- `pl-*`/`pr-*` → `ps-*`/`pe-*`; `ml-*`/`mr-*` → `ms-*`/`me-*`
- `left-0`/`right-0` (absolute) → `inset-is-0`/`inset-ie-0`
- Rounded corners → logical variants (`rounded-is`, `rounded-ie`, `rounded-bs-is-*`, etc.)
- Icons needing mirroring get `class="rtl-flip"` — but only outside `dir="auto"` regions (e.g. not inside the timeline).

### Links
Use `<NuxtLink>`, never a raw `<a>` — ESLint enforces this (`vue/no-restricted-syntax`).

### Internationalization
Strings live in `locales/*.json` (source is `locales/en.json`); locale registration is in `config/i18n.ts`. Only edit `en.json` for new strings — other locales are community-translated. See `CONTRIBUTING.md` for the full guide on adding a language, country variants, pluralization, and the `{n}`/`{v}`/`{0}` number-interpolation rules (these distinctions matter and are easy to get wrong).

### Commits & PRs
Conventional Commits are required (semantic-PR check in CI). A `pre-commit` hook runs `eslint --fix` on staged files via nano-staged.
