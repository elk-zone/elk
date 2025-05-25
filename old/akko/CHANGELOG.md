# Changelog

## [6.10.1](https://github.com/neet/masto.js/compare/v6.10.0...v6.10.1) (2024-10-23)


### Bug Fixes

* Unset `ws` of WebSocketConnectorImpl after close event ([0a73a2a](https://github.com/neet/masto.js/commit/0a73a2a1fba0189373a9f45e78dd056b24e3b6dc))

## [6.10.0](https://github.com/neet/masto.js/compare/v6.9.0...v6.10.0) (2024-10-21)


### Features

* Support new `accounts` field in `PreviewCard` of status introduced by Mastodon 4.3.0 ([96a84f2](https://github.com/neet/masto.js/commit/96a84f2c0f66006731850e187b0364211df1466c))


### Bug Fixes

* Fix duplicated WebSocket connection created when acquiring connection before one established ([dbfd4c8](https://github.com/neet/masto.js/commit/dbfd4c8bbd9c3601de25aa85f10eedfde2e5ccb7))
* Fix WebSocket client to maintain subscription even if other subscription with same parameter ends ([e6d6bd0](https://github.com/neet/masto.js/commit/e6d6bd02255077b9e403ec5d634ef0a6b7fd9bf2))
* Unsubscribe from WebSocket stream when iterator ended ([b7732ed](https://github.com/neet/masto.js/commit/b7732ed404b15378bef28249bee59e240e23e529))

## [6.9.0](https://github.com/neet/masto.js/compare/v6.8.2...v6.9.0) (2024-10-14)


### Features

* Support Mastodon 4.3.0 ([103a130](https://github.com/neet/masto.js/commit/103a130f201bb299981fdd66be3b96d1292c2caf))

## [6.8.2](https://github.com/neet/masto.js/compare/v6.8.1...v6.8.2) (2024-10-13)


### Bug Fixes

* Add missing `v1.instance.extendedDescription` API ([#1212](https://github.com/neet/masto.js/issues/1212)) ([74681b3](https://github.com/neet/masto.js/commit/74681b3ca019563d6c7f21c4db986142614a5bf4))
* Add missing public domain block API ([#1214](https://github.com/neet/masto.js/issues/1214)) ([884b83d](https://github.com/neet/masto.js/commit/884b83d145636ecb87ad26367a6e212f566888d9))

## [6.8.1](https://github.com/neet/masto.js/compare/v6.8.0...v6.8.1) (2024-10-11)


### Bug Fixes

* Add dependabot.yml to use prefix deps ([c43bc7d](https://github.com/neet/masto.js/commit/c43bc7dbcf90e5e4d944dd3059eafd69fe349dfd))
* Add dependabot.yml to use prefix deps ([3f8310b](https://github.com/neet/masto.js/commit/3f8310b0a054804cb9fdc47dc149f720ff365e68))
* Add missing `offset` to SearchAccountsParams ([#1164](https://github.com/neet/masto.js/issues/1164)) ([54089da](https://github.com/neet/masto.js/commit/54089da4e088220d7b620b15259a50968a0fd424))
* Add missing `offset` to v2 SearchParams ([#1163](https://github.com/neet/masto.js/issues/1163)) ([4ae3951](https://github.com/neet/masto.js/commit/4ae3951e3a971c9f0362ff42cee4cfac6fcc0712))
* Fix type of AccountSource.fields ([#1161](https://github.com/neet/masto.js/issues/1161)) ([bd885de](https://github.com/neet/masto.js/commit/bd885de23a5d966213ae9b1b86d8bf99d9f4bf90))
* Remove ERR_INCLUSION test ([101c7ff](https://github.com/neet/masto.js/commit/101c7ff4d614a1c0f1eec35874ce05fdde6dbafd))

## [6.8.0](https://github.com/neet/masto.js/compare/v6.7.7...v6.8.0) (2024-06-02)


### Features

* Support Mastodon v4.2.9 ([b2fd141](https://github.com/neet/masto.js/commit/b2fd141bc6bf07f737115fb76bc46a2537dc5d8d))

## [6.7.7](https://github.com/neet/masto.js/compare/v6.7.6...v6.7.7) (2024-05-03)


### Bug Fixes

* Eliminate direct imports from `ws` ([37049df](https://github.com/neet/masto.js/commit/37049df7c1a7e9ed1094be9189ce5092e6561de1))
* Refactor FormData, querystring and websocket utils ([1052740](https://github.com/neet/masto.js/commit/105274064f37e235a3b684483675c0947e1db8eb))
* Refactor WebSocketSubscription and remove unused code ([6870df2](https://github.com/neet/masto.js/commit/6870df2bae6aeb633d78528b82f2b88ed382294b))

## [6.7.6](https://github.com/neet/masto.js/compare/v6.7.5...v6.7.6) (2024-04-29)


### Bug Fixes

* Add missing `language` attribute to PreviewCard type ([6c6fdef](https://github.com/neet/masto.js/commit/6c6fdef48c56bd7314751f0ae93763156fb78224))
* Restore missing `skipPolling` param ([620c895](https://github.com/neet/masto.js/commit/620c8956bd32664532a1d58b81c22344ca9cee2e))

## [6.7.5](https://github.com/neet/masto.js/compare/v6.7.4...v6.7.5) (2024-04-27)


### Bug Fixes

* Remove unnecessary merging of AbortSignal to avoid overhead ([8967643](https://github.com/neet/masto.js/commit/896764329a9036c2190afab00ab4422f9aba3299))

## [6.7.4](https://github.com/neet/masto.js/compare/v6.7.3...v6.7.4) (2024-04-27)


### Bug Fixes

* Change `timeout: undefined` to fall back to Fetch API default timeout ([dfbaaa6](https://github.com/neet/masto.js/commit/dfbaaa6577d13e3be331c7ac76e5320035fe2775))

## [6.7.3](https://github.com/neet/masto.js/compare/v6.7.2...v6.7.3) (2024-04-23)


### Bug Fixes

* Fix BaseCreateTokenParams["scope"] type to accept null ([ab197c5](https://github.com/neet/masto.js/commit/ab197c5155c956e28656e9eb0ac0f8ad96df5d34))
* Run npm publish from release-please ([4e6b5af](https://github.com/neet/masto.js/commit/4e6b5af9b2234bee2048885e61f2513a508d8c4a))
* Use personal access token on release-please CI ([2c6c0be](https://github.com/neet/masto.js/commit/2c6c0be46c0d00317f337796fa5d8e68b51c01af))

## [6.7.2](https://github.com/neet/masto.js/compare/v6.7.1...v6.7.2) (2024-04-13)


### Chores

* **deps-dev:** bump @typescript-eslint/parser from 7.1.0 to 7.5.0 ([a9f1c43](https://github.com/neet/masto.js/commit/a9f1c43cfedc977b1da0a4b0869f79f39bf3e2a7))
* **deps:** bump tar from 6.2.0 to 6.2.1 ([dcb8307](https://github.com/neet/masto.js/commit/dcb8307e39953781c2801e0253db37ebec375c54))

## [6.7.1](https://github.com/neet/masto.js/compare/v6.7.0...v6.7.1) (2024-04-06)


### Chores

* **deps-dev:** bump @typescript-eslint/eslint-plugin ([5a1ceeb](https://github.com/neet/masto.js/commit/5a1ceeb3ed1f51e10c13ce8acc66313291fa3885))
* **deps-dev:** bump cspell from 8.5.0 to 8.6.1 ([92b3fc2](https://github.com/neet/masto.js/commit/92b3fc2f9ed3b766bf46c6c663439ae0c071e0f6))
* **deps-dev:** bump rollup from 4.12.0 to 4.14.0 ([0a279e9](https://github.com/neet/masto.js/commit/0a279e9096911694a20b36bc19b0ad1ced093fce))
* **deps-dev:** bump size-limit and @size-limit/preset-small-lib ([09bb46d](https://github.com/neet/masto.js/commit/09bb46d61dd22b7a47973b613447429a60faccf5))
* **deps-dev:** bump typedoc from 0.25.9 to 0.25.12 ([86af832](https://github.com/neet/masto.js/commit/86af83206d58dc09b8e1f0c90b81440d51b6ca82))
* **deps-dev:** bump undici from 6.6.2 to 6.11.1 ([b0d3ac8](https://github.com/neet/masto.js/commit/b0d3ac8097387a5e8b44e5b634eee976fc06b79e))

## [6.7.0](https://github.com/neet/masto.js/compare/v6.6.4...v6.7.0) (2024-03-16)


### Features

* Support `grant_type: authorization_code` and `client_credentials`. ([1f6b3ca](https://github.com/neet/masto.js/commit/1f6b3caed3e892c7d30bf6280f6c847e8aad6f4d))

## [6.6.4](https://github.com/neet/masto.js/compare/v6.6.3...v6.6.4) (2024-03-03)


### Chores

* **deps-dev:** bump @types/node from 20.11.19 to 20.11.24 ([f07c8e5](https://github.com/neet/masto.js/commit/f07c8e55f1c2db7951364a8ecd933ed905af86f5))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([6e9e6d4](https://github.com/neet/masto.js/commit/6e9e6d4ad1539ab2a85963b71428afd3a46bee44))
* **deps-dev:** bump @typescript-eslint/parser from 7.0.2 to 7.1.0 ([f582b6b](https://github.com/neet/masto.js/commit/f582b6bb3afbb18a1fa1eb0f6d25d698fcf73961))
* **deps-dev:** bump cspell from 8.4.1 to 8.5.0 ([194dee9](https://github.com/neet/masto.js/commit/194dee9928671bd3b4003505cfe82944adc2bfdc))
* **deps-dev:** bump eslint from 8.56.0 to 8.57.0 ([5dc7e62](https://github.com/neet/masto.js/commit/5dc7e62eb0553922745fab6cce32f710c6c4bc10))
* **deps-dev:** bump typedoc from 0.25.8 to 0.25.9 ([ebf330d](https://github.com/neet/masto.js/commit/ebf330d7f30f382afa8fad78703560a3dbdfed66))

## [6.6.3](https://github.com/neet/masto.js/compare/v6.6.2...v6.6.3) (2024-03-01)


### Bug Fixes

* Use PUT for update for Mastodon-fork compatibility ([304d2fd](https://github.com/neet/masto.js/commit/304d2fdd37d9e7d1398b2a9ea0d1d104bf5e2252))

## [6.6.2](https://github.com/neet/masto.js/compare/v6.6.1...v6.6.2) (2024-02-29)


### Bug Fixes

* Fix property name for streaming API URL in v2.Instance ([a66f087](https://github.com/neet/masto.js/commit/a66f0875219c1e76d0b71d93887289ce1e4c2bc1))

## [6.6.1](https://github.com/neet/masto.js/compare/v6.6.0...v6.6.1) (2024-02-25)


### Chores

* **docs:** Add descriptions for config parameters ([ade9eb2](https://github.com/neet/masto.js/commit/ade9eb2f6bfa90475ead5814cbfee92f1bb95460))

## [6.6.0](https://github.com/neet/masto.js/compare/v6.5.4...v6.6.0) (2024-02-23)


### Features

* Implement Disposable for mastodon.streaming.Client ([d926649](https://github.com/neet/masto.js/commit/d926649d29d34bc7d6048ac91be9d9bd3e67327e))


### Bug Fixes

* Handle `skipPolling` option properly ([4dbccbc](https://github.com/neet/masto.js/commit/4dbccbc02cf725555ec2f0a20c2ac66d9f1eaca0))

## [6.5.4](https://github.com/neet/masto.js/compare/v6.5.3...v6.5.4) (2024-02-22)


### Bug Fixes

* Fix "Masquerading as ESM" ([4d88a43](https://github.com/neet/masto.js/commit/4d88a4343fdfc72d1c5a8ea5d13d521e7a3d712b))
* Prevent REST API client to be a type of function ([42abe50](https://github.com/neet/masto.js/commit/42abe50ae93221a4b8a69741d34ee9bb2d8f04e2))


### Chores

* **deps:** Update dependencies ([75107a4](https://github.com/neet/masto.js/commit/75107a4eebbdd395e0c8c3a047bc988b068e7922))
* **refactor:** Refactor HTTP dispatcher ([90f6c0e](https://github.com/neet/masto.js/commit/90f6c0eb0a6c7f0da0eefbf84592ebe1e01cf794))

## [6.5.3](https://github.com/neet/masto.js/compare/v6.5.2...v6.5.3) (2024-02-22)


### Chores

* **test:** Use docker-compose for E2E testing and reduce file I/O ([63ebc29](https://github.com/neet/masto.js/commit/63ebc295721f1822dac56862e6e8c28cc7b5e19e))

## [6.5.2](https://github.com/neet/masto.js/compare/v6.5.1...v6.5.2) (2023-12-27)


### Bug Fixes

* Fix search API to return paginator ([2691c27](https://github.com/neet/masto.js/commit/2691c274b789ea80c561b2baa12305e0dfed859a))
* Fix type of hashtags to be an array in `Search` entity ([35cad26](https://github.com/neet/masto.js/commit/35cad2681e61c95b60e7e91c5ea1a666bd777a70))

## [6.5.1](https://github.com/neet/masto.js/compare/v6.5.0...v6.5.1) (2023-11-18)


### Chores

* Update CONTRIBUTING.md [skip ci] ([0dc5158](https://github.com/neet/masto.js/commit/0dc5158e9637edf9b0faecf33b5b7456ddf7f25c))

## [6.5.0](https://github.com/neet/masto.js/compare/v6.4.2...v6.5.0) (2023-11-13)


### Features

* Add token.revoke to OAuth client ([47688e0](https://github.com/neet/masto.js/commit/47688e0502318a331f9da5c3f69cf2cb3f575d16))

## [6.4.2](https://github.com/neet/masto.js/compare/v6.4.1...v6.4.2) (2023-11-03)


### Chores

* Simplify logger service ([3cedcf8](https://github.com/neet/masto.js/commit/3cedcf80aea5fba6c40d42f7a3f7f44b0945c395))

## [6.4.1](https://github.com/neet/masto.js/compare/v6.4.0...v6.4.1) (2023-11-02)


### Bug Fixes

* Use `Blob | string` as a type annotation for media ([cca5c30](https://github.com/neet/masto.js/commit/cca5c309fc770920b56467fac077c47d9fd37308))


### Chores

* Add size limit ([14d5387](https://github.com/neet/masto.js/commit/14d5387e8eacd8abf88343ff81ede0b27cdc57b7))
* Configure size-limit ([70c67a4](https://github.com/neet/masto.js/commit/70c67a46542543c16c3bacc6a7c0975bec452dfc))

## [6.4.0](https://github.com/neet/masto.js/compare/v6.3.3...v6.4.0) (2023-10-29)


### Features

* Add experimental support for explicit resource management ([077bc09](https://github.com/neet/masto.js/commit/077bc092795c686bcbae45a51b5bf0f1c3b8945a))


### Chores

* Add `dotenv` to envrc [skip ci] ([4c6fbde](https://github.com/neet/masto.js/commit/4c6fbdeee2cba0a8cdb7738f4f94fc574f0e1a7d))
* Bump dependencies ([f22af2a](https://github.com/neet/masto.js/commit/f22af2a8606b46467a5cd5929129b8bdd805ff4f))
* **deps:** bump @babel/traverse from 7.20.1 to 7.23.2 ([e448f1e](https://github.com/neet/masto.js/commit/e448f1ea1b0b171b5cfe8f91ea0ba5fa17ad75e0))
* Use @rollup/plugin-typescript ([a7630b6](https://github.com/neet/masto.js/commit/a7630b6a45729d5cae93820141d52e5f20379923))

## [6.3.3](https://github.com/neet/masto.js/compare/v6.3.2...v6.3.3) (2023-10-22)


### Chores

* Add new keywords to package.json ([#997](https://github.com/neet/masto.js/issues/997)) ([22f3d46](https://github.com/neet/masto.js/commit/22f3d46a4e5ef0836779c06d88b240691cefd74f))

## [6.3.2](https://github.com/neet/masto.js/compare/v6.3.1...v6.3.2) (2023-10-19)


### Chores

* **test:** Add sleep after new account creation ([39dd99f](https://github.com/neet/masto.js/commit/39dd99f91f53a7cc92528a2bb2ae1454c0ab495b))

## [6.3.1](https://github.com/neet/masto.js/compare/v6.3.0...v6.3.1) (2023-09-28)


### Chores

* **dev:** Add Nix Flake config ([b77bae5](https://github.com/neet/masto.js/commit/b77bae52866ac63ee7820029af524b30cc8bfc9d))

## [6.3.0](https://github.com/neet/masto.js/compare/v6.2.0...v6.3.0) (2023-09-21)


### Features

* Support `duration` parameter for account muting ([a09f1a5](https://github.com/neet/masto.js/commit/a09f1a5cd9b1235e7ac36ed93aba7e05a67bc092))

## [6.2.0](https://github.com/neet/masto.js/compare/v6.1.0...v6.2.0) (2023-08-25)


### Features

* Support Mastodon v4.2.0 beta2 ([3732a24](https://github.com/neet/masto.js/commit/3732a24afec2ecaee29acd9b019b77385a210c3f))

## [6.1.0](https://github.com/neet/masto.js/compare/v6.0.6...v6.1.0) (2023-08-11)


### Features

* Add `allowedMentions` to v1.status.create ([f307eff](https://github.com/neet/masto.js/commit/f307eff0f84116a5e33510d49b48a4f2ca4d4f66))
* Mastodon 4.2.0 beta ([88703ac](https://github.com/neet/masto.js/commit/88703acf94a105648a0f4a0caa2c2ef130c3a459))


### Bug Fixes

* Fix /v1/instance/translation_languages assertion ([a531d3c](https://github.com/neet/masto.js/commit/a531d3c97e6f7a939e37758df31a2a3b6281a324))
* Fix missing `DefaultPaginationParams` export ([1894934](https://github.com/neet/masto.js/commit/18949343aa4cd39a7661735be332c547b1e0c68d))
* Remove port number from admin username ([f5d83e1](https://github.com/neet/masto.js/commit/f5d83e15776759eec0ece5f027b6c7e45add4407))


### Chores

* **test:** Add test todos ([2676c69](https://github.com/neet/masto.js/commit/2676c691b04a2963d309b7910d6a21da8e8232ce))

## [6.0.6](https://github.com/neet/masto.js/compare/v6.0.5...v6.0.6) (2023-08-10)


### Bug Fixes

* Add missing `group`, `limited`, `noindex` attributes to Account ([3294a8d](https://github.com/neet/masto.js/commit/3294a8d7e2df3cf1b5c0022e439a7219112709ec))
* **test:** Remove port number from OAuth grant ([d095916](https://github.com/neet/masto.js/commit/d09591636d86695d4a0aa72c8f0c38bdd2ec81bd))

## [6.0.5](https://github.com/neet/masto.js/compare/v6.0.4...v6.0.5) (2023-08-02)


### Chores

* **docs:** Update examples and docs ([a3908d7](https://github.com/neet/masto.js/commit/a3908d78f0cfc24bde29084a3558f2498847b65b))

## [6.0.4](https://github.com/neet/masto.js/compare/v6.0.3...v6.0.4) (2023-08-01)


### Bug Fixes

* Handle camelCase selection in proxy as an exception ([df6e78b](https://github.com/neet/masto.js/commit/df6e78b75403b78566899e0fe53f72ef49c833c4))
* Remove parse-link-header and restore original implementation ([f8215af](https://github.com/neet/masto.js/commit/f8215af862dfd12f04ea94af4fd7a78fbd8bf1d2))

## [6.0.3](https://github.com/neet/masto.js/compare/v6.0.2...v6.0.3) (2023-07-30)


### Bug Fixes

* Fix `dispatch` to return non-promise value ([9fb38e7](https://github.com/neet/masto.js/commit/9fb38e7911a1c9b4b597622dc861c0c1738e2c23))

## [6.0.2](https://github.com/neet/masto.js/compare/v6.0.1...v6.0.2) (2023-07-28)


### Bug Fixes

* Fix Paginator#setDirection to return a new instance ([b004e95](https://github.com/neet/masto.js/commit/b004e958b4e2fe9de2b3ad879f70f496e932d0ea))


### Chores

* **ci:** Integrate CI workflow configurations ([4c5d57b](https://github.com/neet/masto.js/commit/4c5d57be2480c1db8fe58c4992221852300ab38f))

## [6.0.1](https://github.com/neet/masto.js/compare/v6.0.0...v6.0.1) (2023-07-27)


### Bug Fixes

* Add missing exports for error classes ([6dc0937](https://github.com/neet/masto.js/commit/6dc0937e8fcab4be0fa0deccd4bd6c4fdd6c9314))


### Chores

* **deps-dev:** bump @rollup/plugin-commonjs from 25.0.2 to 25.0.3 ([9ce1eee](https://github.com/neet/masto.js/commit/9ce1eee76e6b857f021424fe37d7a4975f21d99b))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([a20d9c5](https://github.com/neet/masto.js/commit/a20d9c5e82779b59b51f467c1fd6dae54316befc))
* **deps-dev:** bump @typescript-eslint/parser from 5.60.1 to 5.62.0 ([0bc86e5](https://github.com/neet/masto.js/commit/0bc86e5709bd2e81c251202b1b3fcbebc655874b))
* **deps-dev:** bump rollup from 3.26.0 to 3.26.3 ([6b108f3](https://github.com/neet/masto.js/commit/6b108f327f59d7cb39267155371578662548f545))
* **deps:** bump semver from 5.7.1 to 5.7.2 ([8b682c6](https://github.com/neet/masto.js/commit/8b682c61234f7ef7f1357d80c55e8a0d851940f1))
* **deps:** Move Undici to devDependencies ([237cb71](https://github.com/neet/masto.js/commit/237cb71948dd34768d036ca4b2718f6020a9ec1a))
* Update README.md [skip ci] ([32daa9c](https://github.com/neet/masto.js/commit/32daa9c254208309af4542c640a9d827542e6315))

## [6.0.0](https://github.com/neet/masto.js/compare/v5.11.4...v6.0.0) (2023-07-27)


### ⚠ BREAKING CHANGES

* Drop Node.js 16 support
* Use ts-custom-error
* Change WebSocket to AsyncIterator
* Use Proxy API to reduce bundle size
* Eliminate version check feature Idea: Drop version check feature #883
* Remove SubscriptionPolicy, api.v1.admin.{account, report, domainEmailBlocks}

### Features

* Add `setDirection` and `getDirection` to paginator ([2ad2da7](https://github.com/neet/masto.js/commit/2ad2da77ec457fe96df2ac70141f437e364b1e93))
* Add ability to use custom WebSocket implementation ([6e410ce](https://github.com/neet/masto.js/commit/6e410ce329e0cf10b689a4b94b288ce9caf921b1))
* Change WebSocket to AsyncIterator ([fcdc5ec](https://github.com/neet/masto.js/commit/fcdc5ec9ce9b03d21abb3d27d1bdc1ef5cbb3e8a))
* Use Proxy API to reduce bundle size ([6e61c3d](https://github.com/neet/masto.js/commit/6e61c3df99d5ae78a42963429ce57a08aaec479d))
* **websocket:** Add `retry` option ([4b06ae1](https://github.com/neet/masto.js/commit/4b06ae15ba96e6c7497679aa8813937208855e1f))
* **websocket:** Support auto retry ([fe47102](https://github.com/neet/masto.js/commit/fe4710264f4b8dc7e902c95d1456714462b55a30))


### Bug Fixes

* Add type guard to Notification ([26e0684](https://github.com/neet/masto.js/commit/26e068405a8d0476c23ae97dd9b6e3d098f6b5cc))
* **build:** Fix releaserc to run only in main branch ([bc3d297](https://github.com/neet/masto.js/commit/bc3d297ff919fb68779e12568bc54f8db8746136))
* Fix /accounts/update_credentials encoding ([31ad84d](https://github.com/neet/masto.js/commit/31ad84d05af6084176bc9598f2630234b0e688f2))
* Fix constructor types ([2864d17](https://github.com/neet/masto.js/commit/2864d17c8c66ae98ab83e8aaae1136bc5d624684))
* Fix streaming timelines test ([ddbb022](https://github.com/neet/masto.js/commit/ddbb02280b8ebf44fa875f23bd773afbce81df05))
* Map app.verifyCredentials action type ([212f4c0](https://github.com/neet/masto.js/commit/212f4c0accb7ad9e8b5b2f37d471954fa5e13424))


### Chores

* Add detectOpenHandles option ([d8625b1](https://github.com/neet/masto.js/commit/d8625b146dc9c0d8886f6a144132d1c11f993a11))
* Add sideEffects: [secure] ([029544c](https://github.com/neet/masto.js/commit/029544cda43fdd999d6e9bfe22c8f99451317e14))
* Add unsubscribe method ([30a0a95](https://github.com/neet/masto.js/commit/30a0a95ac79d42142477a7cf087db1f5c022421f))
* Auto-set encoding ([604c3d6](https://github.com/neet/masto.js/commit/604c3d60427fadf76a06fe98f0fb8e283987bcd7))
* **build:** Use ES Module for config files ([d9806ed](https://github.com/neet/masto.js/commit/d9806edc505879e7fd9993b722351e9b00c978ef))
* Bump dependencies ([5d14b67](https://github.com/neet/masto.js/commit/5d14b67fbcb023bb4f0fa37b8f120ec74ed21f28))
* Clean up dependencies ([64b62ba](https://github.com/neet/masto.js/commit/64b62ba947b91a30f4a2cade76d7697e20d8bc42))
* **config:** Segregate ws and rest configs ([fc23e5d](https://github.com/neet/masto.js/commit/fc23e5d765855671d84241d6e7961acfa8aa713e))
* **docs:** Update CONTRIBUTING.md ([c48a03b](https://github.com/neet/masto.js/commit/c48a03b73f05989f76bca89100728f684f9e31ef))
* **docs:** Update example ([da940be](https://github.com/neet/masto.js/commit/da940be252bfdad1f9966e2157ed67ef1569ce0e))
* Drop Node.js 16 support ([9cc1286](https://github.com/neet/masto.js/commit/9cc1286cfeacd4f8cca377902d8ff64597d87b14))
* Eliminate version check feature Idea: Drop version check feature [#883](https://github.com/neet/masto.js/issues/883) ([68448ff](https://github.com/neet/masto.js/commit/68448fff79f9d4a119fab3cc09192775fd3f95f1))
* Fix events test ([c34a0d0](https://github.com/neet/masto.js/commit/c34a0d0de2d28e832c87ca34d104b7437255f3cd))
* Fix naming convention ([4c2cf74](https://github.com/neet/masto.js/commit/4c2cf748a6d2db1e1a96f0e7d54a30bd74141a94))
* Remove qs module ([a00f3b2](https://github.com/neet/masto.js/commit/a00f3b2797d3216f0186af5fe2e631c7b0b08249))
* Remove SubscriptionPolicy, api.v1.admin.{account, report, domainEmailBlocks} ([a1c727b](https://github.com/neet/masto.js/commit/a1c727bcd6a792edb75ca25a21e246ca27890395))
* Rename select to $select ([0aa23ca](https://github.com/neet/masto.js/commit/0aa23ca9a61a2a64b694e74a1f6e6b2733de0ec4))
* **rest:** Restore auto media awaiting ([31e20e4](https://github.com/neet/masto.js/commit/31e20e4025609e772004da8487b318e5847fac57))
* Revert target and module to ES6 ([1bab465](https://github.com/neet/masto.js/commit/1bab4656a18079a7fb648706595864f16787f0cd))
* Segregate rest and streaming directory ([#915](https://github.com/neet/masto.js/issues/915)) ([e42295f](https://github.com/neet/masto.js/commit/e42295f71143eeed5fd9e2d8fc8468b228165179))
* Tag 6.0.0 alpha7 ([a25b80c](https://github.com/neet/masto.js/commit/a25b80c753c2dc9aae0a02a84f4c04fd560dd4fa))
* Tag 6.0.0-alpha.4 ([4fbfde0](https://github.com/neet/masto.js/commit/4fbfde03d2e8cb24837e68b692b38e9cb8d08ff4))
* Tag Alpha 1 ([0fc1c4b](https://github.com/neet/masto.js/commit/0fc1c4b0e965e643db8b4036389ff35a1991a038))
* Tag alpha 2 ([ba36be1](https://github.com/neet/masto.js/commit/ba36be17785b43d01407c1a5ff62bc72f994d381))
* Tag alpha.0 ([1d28068](https://github.com/neet/masto.js/commit/1d28068412a6edf91ed9546338781b9dd17fa280))
* **test:** Enable concurrent test ([fd8f203](https://github.com/neet/masto.js/commit/fd8f203370ee0536d19ec857bbb46fa2fc0afb5b))
* **test:** Improve test readability ([6079201](https://github.com/neet/masto.js/commit/60792019f30753b612fb2abd85f47d214fae0b6e))
* **test:** Override tsconfig in jest.config ([ac89a3f](https://github.com/neet/masto.js/commit/ac89a3ffd9f680bdfbcca019e72f1643c4d5931f))
* **tests:** Add tests for WebSocket and Proxy API ([507fe44](https://github.com/neet/masto.js/commit/507fe444289bb356640a4bb83ac47ead382bd907))
* **tests:** Create token on demand ([cc7e15f](https://github.com/neet/masto.js/commit/cc7e15ffbba18c7f83c5c1212b64218d693deadb))
* **test:** Set max-workers on CI ([4f370eb](https://github.com/neet/masto.js/commit/4f370eb5fc32a66a56e5242777f96112c7b2b84a))
* **test:** Use --report-unused-disable-directives ([bc4a94a](https://github.com/neet/masto.js/commit/bc4a94a970c804a7015458839685c9e8c90c05d4))
* **test:** Use maxWorkers=1 temporarily ([61759ff](https://github.com/neet/masto.js/commit/61759ffd20405e8dc6469a5660462b5d2f6792b8))
* Use ts-custom-error ([d439af9](https://github.com/neet/masto.js/commit/d439af9dd6ea99b2baba813a218549eb37822b4a))

## [5.11.4](https://github.com/neet/masto.js/compare/v5.11.3...v5.11.4) (2023-07-15)


### Bug Fixes

* Fix type error in V1::instance ([#940](https://github.com/neet/masto.js/issues/940)) ([f80bec7](https://github.com/neet/masto.js/commit/f80bec7834d3c3406d246cc8b368c831fba4fe26))

## [5.11.3](https://github.com/neet/masto.js/compare/v5.11.2...v5.11.3) (2023-05-03)


### Bug Fixes

* Add 'report' attribute to the Notification entity ([#900](https://github.com/neet/masto.js/issues/900)) ([bab715f](https://github.com/neet/masto.js/commit/bab715fb4205f0ef6b82d6c11cf4ea9a6e2b5e95))
* Add public Report entity ([946288c](https://github.com/neet/masto.js/commit/946288cf14e50215c484885d12f95dcb9cb13364))
* Link header parsing when order is first prev and then next link ([853da99](https://github.com/neet/masto.js/commit/853da993787d81f75022e007d8518251cd713e3f))
* Skip /v1/statuses/:id/translate test on PRs from forks ([67470d1](https://github.com/neet/masto.js/commit/67470d1efd25afc4c5d060fa9b82c2d45a242d75))


### Chores

* **deps-dev:** bump @typescript-eslint/eslint-plugin ([aa424fb](https://github.com/neet/masto.js/commit/aa424fb2d396897706b53d41346a86f3f5a14b4d))
* **deps-dev:** bump @typescript-eslint/parser from 5.51.0 to 5.59.2 ([3baba6e](https://github.com/neet/masto.js/commit/3baba6e4564833a6d085af31ad8cb3774423fda9))
* **deps-dev:** bump cspell from 6.22.0 to 6.31.1 ([639bea1](https://github.com/neet/masto.js/commit/639bea10ee75dd5ae55d8df0db4ce06623af1445))
* **deps-dev:** bump eslint from 8.34.0 to 8.39.0 ([3a0ca0c](https://github.com/neet/masto.js/commit/3a0ca0c21a6e36600912b0d3e85bc00ffc460fb7))
* **deps-dev:** bump jest and @types/jest ([70d634c](https://github.com/neet/masto.js/commit/70d634ccf62d399788c7654f3d36ccf4c1cf52b5))
* **deps-dev:** bump rollup-plugin-dts from 5.1.1 to 5.3.0 ([6fc2406](https://github.com/neet/masto.js/commit/6fc24065954c9d5186a070f42bf45fafef81edcd))
* **deps-dev:** bump semantic-release from 20.1.0 to 21.0.2 ([a7990da](https://github.com/neet/masto.js/commit/a7990da75ab04391dc83e95903f63a4bde165b66))
* **deps-dev:** bump typedoc from 0.23.24 to 0.24.6 ([742b33c](https://github.com/neet/masto.js/commit/742b33cb0ddef0143be00b2356801cdd6cd8b63a))
* **deps:** bump http-cache-semantics from 4.1.0 to 4.1.1 ([6e21135](https://github.com/neet/masto.js/commit/6e2113575232f33297edd412962b495ce391c050))
* **deps:** bump ws from 8.12.0 to 8.13.0 ([6230497](https://github.com/neet/masto.js/commit/623049777cb43bf4b039ed932cc2528110ddd16f))

## [5.11.2](https://github.com/neet/masto.js/compare/v5.11.1...v5.11.2) (2023-04-23)


### Chores

* Generate docs on GitHub Actions ([81e4d52](https://github.com/neet/masto.js/commit/81e4d527212f0117c5a335bdad396117be402569))

## [5.11.1](https://github.com/neet/masto.js/compare/v5.11.0...v5.11.1) (2023-04-10)


### Bug Fixes

* **tests:** Add delay before translate API test ([9789f8d](https://github.com/neet/masto.js/commit/9789f8d7eaa7655105aab5c1c351ff8968b05c39))
* wholeWord is a boolean ([c625a20](https://github.com/neet/masto.js/commit/c625a20b9c9927c948c39591b05728952739434f))

## [5.11.0](https://github.com/neet/masto.js/compare/v5.10.0...v5.11.0) (2023-04-09)


### Features

* Add `sensitized` flag to AdminAccount ([18e2221](https://github.com/neet/masto.js/commit/18e222147dcd6e1106977c0ed7e50d6b7f96e339))


### Bug Fixes

* Enable carry forward ([d68c2c6](https://github.com/neet/masto.js/commit/d68c2c67e702d1f639b64d13263e5a7e159f9101))
* Fix email confirmation endpoint ([fb23044](https://github.com/neet/masto.js/commit/fb2304486ca7e100b6de94c7b9ed4478e12ed6b6))
* Fix filter.fetchStatus URL ([75a310b](https://github.com/neet/masto.js/commit/75a310b00a036d9612c9830ed6e4c55b3db303b9))
* Fix keys of v1.preferences.fetch ([436b72e](https://github.com/neet/masto.js/commit/436b72e18d08a5f353fabbb7ce202b6ff116f9a0))
* Fix poll.vote parameters ([1a7114e](https://github.com/neet/masto.js/commit/1a7114e4f415df5b849d436c5f58048200dd201c))
* wholeWord is a boolean, not a string ([1fc082a](https://github.com/neet/masto.js/commit/1fc082a458378bb3bb8c7ab8942673e6e7939e9c))


### Chores

* **test:** Add cache layer to test tokens ([df5a307](https://github.com/neet/masto.js/commit/df5a307e277253b3ce3c9bd2e2d332094537c659))
* **test:** Add E2E tests with multiple accounts ([8b4b46f](https://github.com/neet/masto.js/commit/8b4b46ff6337906149223ee9365f56965b281143))
* **test:** Add test for _destroy parameter for filters.update ([0381091](https://github.com/neet/masto.js/commit/03810918819e617cb065f65de5b871d8c77fd373))
* **tests:** Add tests for accounts, bookmarks, etc ([71e11ca](https://github.com/neet/masto.js/commit/71e11caf6765fd1d6b98914d46ad32c3e308775b))
* **tests:** Add tests for admin APIs ([7efa306](https://github.com/neet/masto.js/commit/7efa3068beab769364505f702d3230b194e18443))
* **tests:** Add tests for lists, notifications, etc ([8494316](https://github.com/neet/masto.js/commit/84943169621bd4c3af0787bfb9b2f139c872e2e9))
* **tests:** Suppress verbose logs ([767675f](https://github.com/neet/masto.js/commit/767675f691e8f8fadf97cb1e8fc67fde4b37e06a))

## [5.10.0](https://github.com/neet/masto.js/compare/v5.9.2...v5.10.0) (2023-02-19)


### Features

* Add translate API ([02cecf1](https://github.com/neet/masto.js/commit/02cecf1e8140749af6c71316fb6ef1586b452d70))

## [5.9.2](https://github.com/neet/masto.js/compare/v5.9.1...v5.9.2) (2023-02-18)


### Bug Fixes

* Remove JSON content type when body is empty ([8bff0fb](https://github.com/neet/masto.js/commit/8bff0fbad51a5c591984f338dda7d6bb1e387d9f))

## [5.9.1](https://github.com/neet/masto.js/compare/v5.9.0...v5.9.1) (2023-02-12)


### Bug Fixes

* Fix `disableVersionCheck` being ignored ([196fa8f](https://github.com/neet/masto.js/commit/196fa8f1208adcb86a9e61301009cb6437582dd9))

## [5.9.0](https://github.com/neet/masto.js/compare/v5.8.0...v5.9.0) (2023-02-12)


### Features

* Add `mediaAttributes` to statuses.update ([e34c47e](https://github.com/neet/masto.js/commit/e34c47e35c3b3ac1744aea87a63faf5627410048))
* Add `requestedBy` to Relationship entity ([af6198b](https://github.com/neet/masto.js/commit/af6198b09aaca05b58632bdbab2cb86602d02c04))
* Add Instance.configuration.urls.status ([0e98d51](https://github.com/neet/masto.js/commit/0e98d51270d8402df0fd09330bf9c4ac90c93bcf))


### Chores

* Update dependencies ([b2e58df](https://github.com/neet/masto.js/commit/b2e58dffa58726fb7ae5ae6bf9ee167ccb26462a))

## [5.8.0](https://github.com/neet/masto.js/compare/v5.7.0...v5.8.0) (2023-02-05)


### Features

* Add `roles` attribute to `Account` ([7e04944](https://github.com/neet/masto.js/commit/7e049446c5f3cfc75524931492b3cf621926aa00))

## [5.7.0](https://github.com/neet/masto.js/compare/v5.6.1...v5.7.0) (2023-01-27)


### Features

* Add `policy` field to WebPushSubscription ([20ccc90](https://github.com/neet/masto.js/commit/20ccc90e209823547acb27bd685057e2bbe73821))


### Chores

* Fix test for subscription ([2e5dff2](https://github.com/neet/masto.js/commit/2e5dff288f58a7c0e6a94361f46d19ba0b7d92a6))

## [5.6.1](https://github.com/neet/masto.js/compare/v5.6.0...v5.6.1) (2023-01-23)


### Bug Fixes

* Add missing repliesPolicy to List ([25dc358](https://github.com/neet/masto.js/commit/25dc358b9e3e728f4d8a71c34dd91ca1322d20ce))
* Correct version range of /api/v2/search ([5d5cae7](https://github.com/neet/masto.js/commit/5d5cae70fc6a7c48c293c848ee3912700bbaa9b7))

## [5.6.0](https://github.com/neet/masto.js/compare/v5.5.1...v5.6.0) (2023-01-22)


### Features

* Add `hideCollections` to v1.account.updateCredentials parameters ([a0b6167](https://github.com/neet/masto.js/commit/a0b61674eb92ffddab38b49e3cc9316a055ba9cf))
* Add `reading:autoplay:gifs` to Preference ([82f7402](https://github.com/neet/masto.js/commit/82f7402ab3ce2af3c4ed473fbf8243a8dbcbfc76))

## [5.5.1](https://github.com/neet/masto.js/compare/v5.5.0...v5.5.1) (2023-01-18)


### Bug Fixes

* Fix chore to be included in release note ([5230d25](https://github.com/neet/masto.js/commit/5230d2527586e3fabc9d28f5395c3ca3738a16c3))


### Chores

* Add tests for streaming API ([65e992f](https://github.com/neet/masto.js/commit/65e992ffb618a559f9d42db17f4d02d383b12d80))

# [5.5.0](https://github.com/neet/masto.js/compare/v5.4.0...v5.5.0) (2023-01-17)


### Bug Fixes

* Add logger to Client argument ([cc9c848](https://github.com/neet/masto.js/commit/cc9c84862411f44ffc30c679a9a0c1b61060325f))
* Exclude spec.ts from coverage ([9d0ef17](https://github.com/neet/masto.js/commit/9d0ef17ceaeb4c2031f8908f0f80137c81e677e7))
* Fix isObject to work with Jest ([469e79f](https://github.com/neet/masto.js/commit/469e79f5477a1fd25d4035ab105e0d74d93c5724))
* Fix Token.createdAt ([00839b2](https://github.com/neet/masto.js/commit/00839b2639b58dc8c16bcfad3e1aef86cd2bff74))
* **paginator:** parse array in url query string correctly ([e3b629e](https://github.com/neet/masto.js/commit/e3b629e13f72168f2a537cdc98ccca3cf629d3ce))


### Features

* Add experimental oauth repository ([7257f22](https://github.com/neet/masto.js/commit/7257f224d25d94b490532b1f7b9aed80df1870a6))

# [5.4.0](https://github.com/neet/masto.js/compare/v5.3.0...v5.4.0) (2023-01-13)


### Bug Fixes

* add missing fields for entity ([c90871f](https://github.com/neet/masto.js/commit/c90871f7d21c157dcf31d1b5b2b2d97491f271e7))


### Features

* Change streamingApiUrl to optional ([1c53e0b](https://github.com/neet/masto.js/commit/1c53e0b51e5ed93aad1e353e0e5133467dfe4e95))

# [5.3.0](https://github.com/neet/masto.js/compare/v5.2.2...v5.3.0) (2023-01-12)


### Features

* create client from known instance ([3e89eaa](https://github.com/neet/masto.js/commit/3e89eaaf2d9aed83038fac29cfb7a19aaee70a88))

## [5.2.2](https://github.com/neet/masto.js/compare/v5.2.1...v5.2.2) (2023-01-11)


### Bug Fixes

* Fix v1.accounts.create content-type and return type ([3d083f5](https://github.com/neet/masto.js/commit/3d083f583a078358c2845130db8aa0f4ae38a2cc))

## [5.2.1](https://github.com/neet/masto.js/compare/v5.2.0...v5.2.1) (2023-01-11)


### Bug Fixes

* add value type of done result ([f809cbd](https://github.com/neet/masto.js/commit/f809cbd425b6a713135087f0fdd89b8ada8bf868))

# [5.2.0](https://github.com/neet/masto.js/compare/v5.1.3...v5.2.0) (2023-01-10)


### Bug Fixes

* Add missing filters.createStatus ([6a0586a](https://github.com/neet/masto.js/commit/6a0586a473eac0ab23925759ed9b3d4db569c539))
* Clear timeout regardless response status ([7b4e170](https://github.com/neet/masto.js/commit/7b4e1709352f60592ed74e4138cd3b4afa2461b5))
* FilterResult type ([d85a8e5](https://github.com/neet/masto.js/commit/d85a8e5f83ba203d74a7d044d1cea613dc64dcdb))
* Fix typo on listKeywords ([eb82682](https://github.com/neet/masto.js/commit/eb82682a1bf5cfb08fdcdc6fff92cc180094e6dc))
* Fix v2.filters.updateKeyword URL ([144435c](https://github.com/neet/masto.js/commit/144435c959745853f9c648340c0a6c8e9e0fa7bc))
* v2 instance api version ([3a491e4](https://github.com/neet/masto.js/commit/3a491e486a525a0eaaca457774ba5ded2f2b8e56))


### Features

* add clone for Paginator ([0c74998](https://github.com/neet/masto.js/commit/0c749983f5d4664582981fbe18d633f861b1e314))
* Add missing filter features ([a839b03](https://github.com/neet/masto.js/commit/a839b030f358fe401e8b376e5d253b4cd0f1b3fd))

## [5.1.3](https://github.com/neet/masto.js/compare/v5.1.2...v5.1.3) (2023-01-09)


### Bug Fixes

* allow omitting one timeline when creating marker ([ca1070c](https://github.com/neet/masto.js/commit/ca1070c4dfd291585e3ba37275061ab069f0d211))

## [5.1.2](https://github.com/neet/masto.js/compare/v5.1.1...v5.1.2) (2023-01-08)


### Bug Fixes

* update `moved` field type of Account ([1fa6546](https://github.com/neet/masto.js/commit/1fa6546cad14519cfbe251a5c8687e5845e5bfc3))

## [5.1.1](https://github.com/neet/masto.js/compare/v5.1.0...v5.1.1) (2023-01-05)


### Bug Fixes

* Change searchParams type to Record ([2ae64ed](https://github.com/neet/masto.js/commit/2ae64ed14044cb08eb69e5ec5f9e52e54c7d7f62)), closes [#672](https://github.com/neet/masto.js/issues/672)

# [5.1.0](https://github.com/neet/masto.js/compare/v5.0.5...v5.1.0) (2023-01-01)


### Features

* Support admin dashboard API ([#778](https://github.com/neet/masto.js/issues/778)) ([c1f2dfa](https://github.com/neet/masto.js/commit/c1f2dfa555a60ed423194b2b09ff944311d72b9c))

## [5.0.5](https://github.com/neet/masto.js/compare/v5.0.4...v5.0.5) (2022-12-26)

## [5.0.4](https://github.com/neet/masto.js/compare/v5.0.3...v5.0.4) (2022-12-25)


### Bug Fixes

* Node.js < 18 media uploading ([987dac7](https://github.com/neet/masto.js/commit/987dac729e6bda7dee942773f9a34ca4da835800))

## [5.0.3](https://github.com/neet/masto.js/compare/v5.0.2...v5.0.3) (2022-12-25)


### Bug Fixes

* Add default filename only when field value is a blob ([fd6d3fb](https://github.com/neet/masto.js/commit/fd6d3fb5f18667048afa708ca2ec684308a8f89f))
* Clear timeout when request completed ([f6b2f9c](https://github.com/neet/masto.js/commit/f6b2f9ce9cd406bc9f90fad57c7d86fbbe2243c8))

## [5.0.2](https://github.com/neet/masto.js/compare/v5.0.1...v5.0.2) (2022-12-25)


### Bug Fixes

* Add default filename for form-data ([9a7489f](https://github.com/neet/masto.js/commit/9a7489fae14e2b8b363600252da8aa4d2a764a0c))
* Change return type of Paginator#next to Promise ([3399892](https://github.com/neet/masto.js/commit/3399892aa888428db9476730e42489b3f7ba6392))
* Fix MastoTimeoutError to be thrown instead of AbortError ([8de20a4](https://github.com/neet/masto.js/commit/8de20a4284ee800747c82e1033ea482662b58a22))
* Update target to ES6 ([3a3acec](https://github.com/neet/masto.js/commit/3a3acecb0ad258569d07f78e8e3ff432c61030a1))

## [5.0.1](https://github.com/neet/masto.js/compare/v5.0.0...v5.0.1) (2022-12-24)

# [5.0.0](https://github.com/neet/masto.js/compare/v4.11.1...v5.0.0) (2022-12-23)


### Bug Fixes

* Fix `instanceof` operator for error classes ([7893b4d](https://github.com/neet/masto.js/commit/7893b4d9d7128295ee81582ab12194085c4dfad9))
* Fix broken test for paginator ([584d1dc](https://github.com/neet/masto.js/commit/584d1dc77e6a8d6bc5930c4e35fa455538829152))
* Fix http-native-impl to use getContentType ([875c371](https://github.com/neet/masto.js/commit/875c371d24fad4f0f8ae872153a1b2b4ef080049))
* Fix setupFilesAfterEnv to include isomorphic-fetch ([2fd41e3](https://github.com/neet/masto.js/commit/2fd41e3c744b7eef9a865d97308306b2f8ce7719))
* Fix tests ([58ba2c7](https://github.com/neet/masto.js/commit/58ba2c755551028b9544ab470245eb9ac8fd3f5e))
* Fix tsc errors in domain blocks ([4f8700e](https://github.com/neet/masto.js/commit/4f8700ed4809a904887cb68db866cb801a76da1b))
* Fix v2 search path ([b3d95f8](https://github.com/neet/masto.js/commit/b3d95f87ed261ddce68d5906bcd67bab2adcfb32))
* Remove "DOM" from TypeScript lib dependency ([61a9467](https://github.com/neet/masto.js/commit/61a946750ee9c074abce7c29f15b9972bc657456))
* Remove Array constraint from IRepository ([ced6608](https://github.com/neet/masto.js/commit/ced6608e02cd33e7469c8f60cb13a84f03d37312))
* Remove MimeType and change it to string ([129a17a](https://github.com/neet/masto.js/commit/129a17af7d860930e270a07bc902d2293b8f0bbf))
* Rename methods that returns an array to start with `list` ([68e8ff9](https://github.com/neet/masto.js/commit/68e8ff90dd9749d45364e1a30da5d86e0b20a6c7))
* Repository#delete -> Repository#remove ([b4e06a5](https://github.com/neet/masto.js/commit/b4e06a5ef4ee44a21c21de6cc709c7ec531dbc83))
* Update resource name to comply with the current Mastodon document ([6a20ad9](https://github.com/neet/masto.js/commit/6a20ad91b5b011d1368bf24cba2513ee08322f30))
* Use version check as error handling ([d24ab9a](https://github.com/neet/masto.js/commit/d24ab9ae0e18db4b583e0613ab4baf5b18f566ae))


### Features

* Add explicit API versions to methods ([d4dd3fa](https://github.com/neet/masto.js/commit/d4dd3fae008ca7335612c7ec3054d8421938bde9))
* Add logging interface ([bedc623](https://github.com/neet/masto.js/commit/bedc62300cac03d5ebf2a728a5a606629aa26b21))
* Drop Axios support ([903c09d](https://github.com/neet/masto.js/commit/903c09d82966b278549d0939af5a76ad16c836ef))
* Move entities and repositories under the namespace ([5da5773](https://github.com/neet/masto.js/commit/5da57738fb56f1c9528799158c628fc0c74bdf3b))
* Remove deprecated class aliases ([17582c1](https://github.com/neet/masto.js/commit/17582c1d5c60fea922f55bab11363cca9349d9e1))
* Remove next() argument ([5370e0c](https://github.com/neet/masto.js/commit/5370e0cf12c11fb696d65a8ceb93dd287882ac8a))


### BREAKING CHANGES

* Outdated resource names are updated with the current Mastodon document. Including `WebPushSubscription`, `CustomEmoji`, `AccountField`, etc
* You have to import `mastodon` to use any entity instead of importing single entity directly
* Paginator#next no longer accepts an argument. Please recreate Paginator if you want to reset the internal state
* fetchAll, fetchMany and other methods that returns an array is now prefixed with list*
* Alias for iteration methods and error classes are now removed
* All API calls now require masto.v1 or masto.v2 as a prefix.
* headers option for login() now should be a WHATWG object. Proxy support is also dropped.

## [4.11.1](https://github.com/neet/masto.js/compare/v4.11.0...v4.11.1) (2022-12-22)


### Bug Fixes

* Change HTTP methods to uppercase ([873a8e2](https://github.com/neet/masto.js/commit/873a8e2dd53ac8fb104facc651c6ae6c687a8384))

# [4.11.0](https://github.com/neet/masto.js/compare/v4.10.2...v4.11.0) (2022-12-20)


### Bug Fixes

* Add backwards-compatible type declarations ([#761](https://github.com/neet/masto.js/issues/761)) ([e957388](https://github.com/neet/masto.js/commit/e9573884f70013e1598f27dcb65cb181006e5ca6))
* Add missing exclude_reblogs and tagged to fetching account statuses ([#760](https://github.com/neet/masto.js/issues/760)) ([59cd02a](https://github.com/neet/masto.js/commit/59cd02abd65d0afbda3a3fa3f544ae13e6b2f155))


### Features

* Support Canonical email block ([#759](https://github.com/neet/masto.js/issues/759)) ([464f4fe](https://github.com/neet/masto.js/commit/464f4fe5898cfafda9c58c0b26cbbc31a2c24b39))

## [4.10.2](https://github.com/neet/masto.js/compare/v4.10.1...v4.10.2) (2022-12-19)


### Bug Fixes

* Change Content-Type to undefined when body is a FormData ([6edac35](https://github.com/neet/masto.js/commit/6edac351b981e98cff727a6855cbddd0f310c893))

## [4.10.1](https://github.com/neet/masto.js/compare/v4.10.0...v4.10.1) (2022-12-18)

# [4.10.0](https://github.com/neet/masto.js/compare/v4.9.2...v4.10.0) (2022-12-15)


### Bug Fixes

* Remove JSON.parse for delete event type ([#754](https://github.com/neet/masto.js/issues/754)) ([b5cb960](https://github.com/neet/masto.js/commit/b5cb96061786de902788f79a5cea7d0555a32b3e))


### Features

* Support /v1/admin/ip_blocks ([#752](https://github.com/neet/masto.js/issues/752)) ([89e0098](https://github.com/neet/masto.js/commit/89e00985885669e663d2d5461bf44e470827a6e9))

## [4.9.2](https://github.com/neet/masto.js/compare/v4.9.1...v4.9.2) (2022-12-14)


### Bug Fixes

* Remove re-exports of HTTP implementations ([#753](https://github.com/neet/masto.js/issues/753)) ([bafb4cb](https://github.com/neet/masto.js/commit/bafb4cbc57a60ef379a1a30e5f1fb184bdc71c7b))

## [4.9.1](https://github.com/neet/masto.js/compare/v4.9.0...v4.9.1) (2022-12-09)


### Bug Fixes

* Fix wrong types on fetch instance information ([#747](https://github.com/neet/masto.js/issues/747)) ([3657eae](https://github.com/neet/masto.js/commit/3657eaeb6519d64ac0b38f73430cd47231c12eda))

# [4.9.0](https://github.com/neet/masto.js/compare/v4.8.0...v4.9.0) (2022-12-06)


### Features

* Support /api/v1/admin/email_domain_blocks ([#746](https://github.com/neet/masto.js/issues/746)) ([785b617](https://github.com/neet/masto.js/commit/785b617f5d97d7da89769345a7fd4851c3079029))

# [4.8.0](https://github.com/neet/masto.js/compare/v4.7.5...v4.8.0) (2022-12-05)


### Bug Fixes

* Fix Card.{width,height} to be number ([#745](https://github.com/neet/masto.js/issues/745)) ([8941096](https://github.com/neet/masto.js/commit/8941096fe37fd818f836500628d48e43883d3dad)), closes [#737](https://github.com/neet/masto.js/issues/737)
* Fix CreatePushSubscriptionParams#policy to be on the root and required ([80ee853](https://github.com/neet/masto.js/commit/80ee85302871e4f4404d0dc277998f055f848c0d))
* Fix domain blocks to follow the naming convention ([ab8191b](https://github.com/neet/masto.js/commit/ab8191bfa5e6b0f8396f1eb4627fd1f9cb69030d))


### Features

* Support /api/v1/admin/domain_allows ([#744](https://github.com/neet/masto.js/issues/744)) ([dbdf59f](https://github.com/neet/masto.js/commit/dbdf59f9e0a823675a5f4064d663740886e69587))
* Support `/api/v1/admin/domain_blocks` ([#741](https://github.com/neet/masto.js/issues/741)) ([005e749](https://github.com/neet/masto.js/commit/005e749ea62d64ba069ebb2168b9895d3c9e695d))

## [4.7.5](https://github.com/neet/masto.js/compare/v4.7.4...v4.7.5) (2022-12-04)


### Bug Fixes

* Add FilterResult interface and Status.filtered optional prop ([581d4f9](https://github.com/neet/masto.js/commit/581d4f9a8936c5826afb5f5f82b45869919bd629)), closes [#737](https://github.com/neet/masto.js/issues/737)
* Add missing filterAction ([021a332](https://github.com/neet/masto.js/commit/021a3324f5bdca9b84036eb311bbe26fba0c6c68))

## [4.7.4](https://github.com/neet/masto.js/compare/v4.7.3...v4.7.4) (2022-12-03)


### Bug Fixes

* Fix the type of Filter.wholeWorld to boolean ([#726](https://github.com/neet/masto.js/issues/726)) ([525f4e5](https://github.com/neet/masto.js/commit/525f4e5eee0c0c7e4ee84a88ede6b6dc76759ddb))

## [4.7.3](https://github.com/neet/masto.js/compare/v4.7.2...v4.7.3) (2022-12-02)


### Bug Fixes

* Use builtin Object.fromEntries ([6a64264](https://github.com/neet/masto.js/commit/6a642646ee6f961affa74e6ceff18f3744092b6c))

## [4.7.2](https://github.com/neet/masto.js/compare/v4.7.1...v4.7.2) (2022-12-01)

## [4.7.1](https://github.com/neet/masto.js/compare/v4.7.0...v4.7.1) (2022-11-30)


### Bug Fixes

* Correct iterable used when fetching following accounts ([9dc35fb](https://github.com/neet/masto.js/commit/9dc35fbca470bb99a7bfc047fc621615ad21ad5b))
* Fix suggestion API URL ([2887c98](https://github.com/neet/masto.js/commit/2887c98ef29e4256e199c2bbe10ae4baa4e3f1b9))
* Rename fetchAll to fetchTags ([027e57c](https://github.com/neet/masto.js/commit/027e57cf066d7463f72ba9c47aa6e008adc626cd))
* Use Sec-Websocket-Protocols when disabling version check ([7755fbd](https://github.com/neet/masto.js/commit/7755fbd2772c43d0fce04d7c250664d2dca44b49))

# [4.7.0](https://github.com/neet/masto.js/compare/v4.6.10...v4.7.0) (2022-11-29)


### Features

* Support tag follow / unfollow ([#709](https://github.com/neet/masto.js/issues/709)) ([6883fb9](https://github.com/neet/masto.js/commit/6883fb9e2da2cb382d61d88b6b9a89b5792c03ee))

## [4.6.10](https://github.com/neet/masto.js/compare/v4.6.9...v4.6.10) (2022-11-27)


### Bug Fixes

* Allow passing null and undefined as a query parameter ([#707](https://github.com/neet/masto.js/issues/707)) ([1436dc6](https://github.com/neet/masto.js/commit/1436dc6c2186712ebff81c21089410456a781b87))

## [4.6.9](https://github.com/neet/masto.js/compare/v4.6.8...v4.6.9) (2022-11-26)


### Bug Fixes

* Actually send user-specified headers in `HttpAxiosImpl` ([b602fe4](https://github.com/neet/masto.js/commit/b602fe4cb16aad9dd41bf5ddaabee97a53720a0b)), closes [#697](https://github.com/neet/masto.js/issues/697)
* Encode URI components in serializer ([8a2be08](https://github.com/neet/masto.js/commit/8a2be086c6c8a63711e280ef1f1f290e45f4780d))
* **fetch:** Normalize header to be lowercase ([f7fce11](https://github.com/neet/masto.js/commit/f7fce11f55b0426ddfe74467071c4dc1e44eda57))
* Fix failing test in [#702](https://github.com/neet/masto.js/issues/702) ([a2a4c26](https://github.com/neet/masto.js/commit/a2a4c26df904d54d35eec0388b0e37fefcf70c59))
* read next link from response ([68c71bd](https://github.com/neet/masto.js/commit/68c71bd8f3154df72a2e309d848e7fd7b066da9d))
* Set `Paginator.nextParams` to an empty object after first request ([4ce57a6](https://github.com/neet/masto.js/commit/4ce57a63dd84a57faf6284c85287c9201a2ea582)), closes [#698](https://github.com/neet/masto.js/issues/698)
* Unmark `DefaultPaginationParams.{maxId, sinceId}` as internal parameters ([257359e](https://github.com/neet/masto.js/commit/257359e60b69d9afb0f98b265b8483cd975e97ce)), closes [#698](https://github.com/neet/masto.js/issues/698)
* Update Notification.type types ([#706](https://github.com/neet/masto.js/issues/706)) ([50c5c5c](https://github.com/neet/masto.js/commit/50c5c5c8adf4362d2b9daf7ce7c64bcfd3d02118))

## [4.6.8](https://github.com/neet/masto.js/compare/v4.6.7...v4.6.8) (2022-11-24)


### Bug Fixes

* Force to use Axios 1.1.3 ([#696](https://github.com/neet/masto.js/issues/696)) ([e3a94b8](https://github.com/neet/masto.js/commit/e3a94b8880f8cfb77c7f61e8cc5b63a17496ff30))

## [4.6.7](https://github.com/neet/masto.js/compare/v4.6.6...v4.6.7) (2022-11-24)


### Bug Fixes

* Use `serializeQueryString` in base-ws ([#693](https://github.com/neet/masto.js/issues/693)) ([fc6a00d](https://github.com/neet/masto.js/commit/fc6a00db9bcc39a89b976dd17456dfdbd88827ec))

## [4.6.6](https://github.com/neet/masto.js/compare/v4.6.5...v4.6.6) (2022-11-21)


### Bug Fixes

* Transform of URL search params' cases ([#690](https://github.com/neet/masto.js/issues/690)) ([a9582ff](https://github.com/neet/masto.js/commit/a9582ff1b29ef444f2bf0a719f367eeb3ded8a0b))

## [4.6.5](https://github.com/neet/masto.js/compare/v4.6.4...v4.6.5) (2022-11-20)


### Bug Fixes

* Use `params` instead of `data` in pagination ([#687](https://github.com/neet/masto.js/issues/687)) ([e333ac1](https://github.com/neet/masto.js/commit/e333ac12252742403f5c5683e827bd67e10e1465))

## [4.6.4](https://github.com/neet/masto.js/compare/v4.6.3...v4.6.4) (2022-11-19)


### Bug Fixes

* add suspended flag to account ([#685](https://github.com/neet/masto.js/issues/685)) ([fa8a45f](https://github.com/neet/masto.js/commit/fa8a45f0b81ae4d85d420da2bd195774f1b97acb))

## [4.6.3](https://github.com/neet/masto.js/compare/v4.6.2...v4.6.3) (2022-11-18)


### Bug Fixes

* Fix eslint warning in 682 ([1c860eb](https://github.com/neet/masto.js/commit/1c860eba015b3a4f8e2b121a20e428032af61836))

## [4.6.2](https://github.com/neet/masto.js/compare/v4.6.1...v4.6.2) (2022-11-16)


### Bug Fixes

* Add missing env variables to github actions ([a98a52c](https://github.com/neet/masto.js/commit/a98a52c467feda874f7d59a8b1f002a2b303d215))
* Remove legacy URL module to support non-Node.js env ([458340e](https://github.com/neet/masto.js/commit/458340e07c3d4b0fd6061c4bc14fe3345a2bb2c3))

## [4.6.1](https://github.com/neet/masto.js/compare/v4.6.0...v4.6.1) (2022-11-13)


### Bug Fixes

* Add missing non-iterable methods for timelines ([496aa04](https://github.com/neet/masto.js/commit/496aa0452b65fadc966d584714b726f75e7993bb))
* Fix URL /lists/:id/accounts ([fb20092](https://github.com/neet/masto.js/commit/fb20092902b357d09f5bfa8fc732a7b98c53c4cb))

# [4.6.0](https://github.com/neet/masto.js/compare/v4.5.1...v4.6.0) (2022-11-12)


### Bug Fixes

* Use Rails formed URL search params ([ff5daad](https://github.com/neet/masto.js/commit/ff5daadd11655bcd8ac5b37786f500efaff51cff))


### Features

* Add non-iterable fetch methods ([c158e0e](https://github.com/neet/masto.js/commit/c158e0e99c299fb71885299873070f5233849b52))

## [4.5.1](https://github.com/neet/masto.js/compare/v4.5.0...v4.5.1) (2022-11-11)


### Bug Fixes

* Remove obsolete debug code ([79cb0d8](https://github.com/neet/masto.js/commit/79cb0d803a70b6e8863766f20787c0aebebe5bc1))

# [4.5.0](https://github.com/neet/masto.js/compare/v4.4.1...v4.5.0) (2022-11-10)


### Features

* Add an option to disable version check ([782fa60](https://github.com/neet/masto.js/commit/782fa60909e12f409ffd7cd7528e64770c90a502))

## [4.4.1](https://github.com/neet/masto.js/compare/v4.4.0...v4.4.1) (2022-11-04)


### Bug Fixes

* Apply typescript-eslint only for ts files ([f69603e](https://github.com/neet/masto.js/commit/f69603e3ea685e7b57b54f4364d55d7d7c210eb5))
* Use cjs for rollup.config.js ([80cc322](https://github.com/neet/masto.js/commit/80cc322f2b373fb9505b881e7b7fd68142e4c36d))
* Use exports ([4383fe4](https://github.com/neet/masto.js/commit/4383fe4654fb92e78737dcd0da7bea48e7c3a362))

# [4.4.0](https://github.com/neet/masto.js/compare/v4.3.4...v4.4.0) (2022-06-20)


### Bug Fixes

* Fix build script ([24b1830](https://github.com/neet/masto.js/commit/24b183028c5e5f635159e66d78a06c02c9007566))
* Fix npm config ([b189848](https://github.com/neet/masto.js/commit/b189848747c687976fc0fd7556b19e1d87a9386f))


### Features

* Support Node.js 18 Fetch API ([f3085e6](https://github.com/neet/masto.js/commit/f3085e6a5a62a9a352c797fa44777ecf1c3ba444))

## [4.3.4](https://github.com/neet/masto.js/compare/v4.3.3...v4.3.4) (2022-06-19)


### Bug Fixes

* Change getContentType to case insensitive ([b20bf4c](https://github.com/neet/masto.js/commit/b20bf4c0a6c886dcbbbccc89bf2f44d589704794))
* HttpNativeImpl.request()'s return type ([5536100](https://github.com/neet/masto.js/commit/5536100ac7d002d5e33b56edaa5b5de9cf1f7907))
* Let HttpNativeImpl make multipart/form-data w/ appropriate boundary ([f277388](https://github.com/neet/masto.js/commit/f2773886f77b146435834aa5c5bce91481227e86))
* Throw error when content-type is not set on response ([b6e4a8c](https://github.com/neet/masto.js/commit/b6e4a8cb9f97d308b403069480af5064824e68b2))
* Trim content type params from HTTP responses ([281cfcb](https://github.com/neet/masto.js/commit/281cfcb8aae35b6ac6f58e6232a2275cd4f2c404))

## [4.3.3](https://github.com/neet/masto.js/compare/v4.3.2...v4.3.3) (2022-06-11)

## [4.3.2](https://github.com/neet/masto.js/compare/v4.3.1...v4.3.2) (2022-06-05)

## [4.3.1](https://github.com/neet/masto.js/compare/v4.3.0...v4.3.1) (2022-04-11)


### Bug Fixes

* Fix unhandled promise rejection of examples ([d205bf8](https://github.com/neet/masto.js/commit/d205bf8a893473aa0005279fe93cc7a1e7dc85e5))

# [4.3.0](https://github.com/neet/masto.js/compare/v4.2.7...v4.3.0) (2022-04-04)


### Features

* Add familiar followers, remove from followers ([2761173](https://github.com/neet/masto.js/commit/2761173aa18946965926845df5e3468cf594c307))
* Add ruleIds and category param to reports ([44edad9](https://github.com/neet/masto.js/commit/44edad94cb6425995e18c9a560ac412bbcbc5c2f))
* Add type field to FetchNotificationsParams ([7e44e22](https://github.com/neet/masto.js/commit/7e44e22a5fee1fddee2e5c3ce0713a7482241d89))
* Remove follow scope ([bafc5df](https://github.com/neet/masto.js/commit/bafc5df3b845b35e33a190588b23821889831b5b))
* Support status edit api ([8621213](https://github.com/neet/masto.js/commit/862121396fa120739b965ae7d29fd4481776ca1d))
* Update trends api ([3d1d236](https://github.com/neet/masto.js/commit/3d1d236d2fe804e632fac7fa9983512e1f6909a4))

## [4.2.7](https://github.com/neet/masto.js/compare/v4.2.6...v4.2.7) (2022-03-19)


### Bug Fixes

* Use getter for timeline.{home,public} ([99e1c23](https://github.com/neet/masto.js/commit/99e1c235cf278fb0eb476d8224bad4f4b13e9932))

## [4.2.6](https://github.com/neet/masto.js/compare/v4.2.5...v4.2.6) (2022-02-17)

## [4.2.5](https://github.com/neet/masto.js/compare/v4.2.4...v4.2.5) (2022-02-06)

## [4.2.4](https://github.com/neet/masto.js/compare/v4.2.3...v4.2.4) (2022-01-04)

## [4.2.3](https://github.com/neet/masto.js/compare/v4.2.2...v4.2.3) (2022-01-03)

## [4.2.2](https://github.com/neet/masto.js/compare/v4.2.1...v4.2.2) (2021-12-02)

## [4.2.1](https://github.com/neet/masto.js/compare/v4.2.0...v4.2.1) (2021-11-22)


### Bug Fixes

* Use streamingApiUrl to resolve streaming api ([451203f](https://github.com/neet/masto.js/commit/451203fe10aa92b82f9f48f1ed094bc50f35cf13))

# [4.2.0](https://github.com/neet/masto.js/compare/v4.1.19...v4.2.0) (2021-11-08)


### Features

* Support instance configuration ([b7e5f23](https://github.com/neet/masto.js/commit/b7e5f23ac7320d73f76086a71bfa13234970db59))

## [4.1.19](https://github.com/neet/masto.js/compare/v4.1.18...v4.1.19) (2021-11-03)

## [4.1.18](https://github.com/neet/masto.js/compare/v4.1.17...v4.1.18) (2021-10-10)

## [4.1.17](https://github.com/neet/masto.js/compare/v4.1.16...v4.1.17) (2021-10-03)

## [4.1.16](https://github.com/neet/masto.js/compare/v4.1.15...v4.1.16) (2021-09-21)


### Bug Fixes

* Remove mock exports ([e50d27c](https://github.com/neet/masto.js/commit/e50d27c53355c0b3f411ba1a94ce31246e89d012))

## [4.1.15](https://github.com/neet/masto.js/compare/v4.1.14...v4.1.15) (2021-09-17)

## [4.1.14](https://github.com/neet/masto.js/compare/v4.1.13...v4.1.14) (2021-09-12)


### Bug Fixes

* Avoid unintuitive keyword like "facade" ([7f6b9bf](https://github.com/neet/masto.js/commit/7f6b9bfe6aa8b1181e6f35e04368245fa4bbaa27))
* Remove exports field in rollup config ([4c60880](https://github.com/neet/masto.js/commit/4c608803de221d4efa2a2d6f466f4b62f430465b))
* Remove imports of isomorhpic-form-data ([f61bfe5](https://github.com/neet/masto.js/commit/f61bfe5dae8f737fcb36ef6c2ae8c100583a98c9))
* Use rollup-plugin-auto-external ([ead7c36](https://github.com/neet/masto.js/commit/ead7c3686a2061848b50fb8984324d0baf0c113f))

## [4.1.13](https://github.com/neet/masto.js/compare/v4.1.12...v4.1.13) (2021-09-11)


### Bug Fixes

* Add exception handling for JSON.parse ([bb6c7d0](https://github.com/neet/masto.js/commit/bb6c7d0d34588fff0a985ec583e4cc61f1b3eebc))
* Include statusCode in the default MastoError ([88fa4dc](https://github.com/neet/masto.js/commit/88fa4dc6cc552eca1666e3d69cf5e02e87454352))

## [4.1.12](https://github.com/neet/masto.js/compare/v4.1.11...v4.1.12) (2021-09-03)

## [4.1.11](https://github.com/neet/masto.js/compare/v4.1.10...v4.1.11) (2021-09-02)

## [4.1.10](https://github.com/neet/masto.js/compare/v4.1.9...v4.1.10) (2021-08-18)


### Bug Fixes

* FIx NODE_IGNORE_MASTO_WARNINGS ([c84a6cf](https://github.com/neet/masto.js/commit/c84a6cfb2cbdc5e71fcd1c6b715b4a6615dc01bc))
* Fix prettier warning ([efe9d5a](https://github.com/neet/masto.js/commit/efe9d5ac26cff9e3d05c921de42a5f81c6389251))
* Fix tsc error about Account ([38f848d](https://github.com/neet/masto.js/commit/38f848dff0bc6e168cc4cb34a702f40c68eec731))

## [4.1.9](https://github.com/neet/masto.js/compare/v4.1.8...v4.1.9) (2021-08-12)

## [4.1.8](https://github.com/neet/masto.js/compare/v4.1.7...v4.1.8) (2021-08-05)

## [4.1.7](https://github.com/neet/masto.js/compare/v4.1.6...v4.1.7) (2021-08-04)

## [4.1.6](https://github.com/neet/masto.js/compare/v4.1.5...v4.1.6) (2021-08-03)

## [4.1.5](https://github.com/neet/masto.js/compare/v4.1.4...v4.1.5) (2021-07-03)

## [4.1.4](https://github.com/neet/masto.js/compare/v4.1.3...v4.1.4) (2021-06-11)

## [4.1.3](https://github.com/neet/masto.js/compare/v4.1.2...v4.1.3) (2021-06-04)

## [4.1.2](https://github.com/neet/masto.js/compare/v4.1.1...v4.1.2) (2021-06-03)

## [4.1.1](https://github.com/neet/masto.js/compare/v4.1.0...v4.1.1) (2021-05-30)

# [4.1.0](https://github.com/neet/masto.js/compare/v4.0.4...v4.1.0) (2021-05-11)


### Features

* Add /api/v1/email/confirmations ([0f47ad2](https://github.com/neet/masto.js/commit/0f47ad292bb6fadceac9f01192ce722057ef3c80))
* Add details field for MastoError ([5a369f6](https://github.com/neet/masto.js/commit/5a369f6b6927a28c20beb915dae42d23af34d050))
* Add lookup API ([4e1f593](https://github.com/neet/masto.js/commit/4e1f5938c9dd41220bbcb83c70f54debf2139dce))
* Add policy to PushSubscriptionRepository#create ([eba850e](https://github.com/neet/masto.js/commit/eba850eba5bf580c50051bf31c787d9e8264b6a1))

## [4.0.4](https://github.com/neet/masto.js/compare/v4.0.3...v4.0.4) (2021-05-03)

## [4.0.3](https://github.com/neet/masto.js/compare/v4.0.2...v4.0.3) (2021-04-30)

## [4.0.2](https://github.com/neet/masto.js/compare/v4.0.1...v4.0.2) (2021-04-25)


### Bug Fixes

* Transform arrays inside an object ([d22a145](https://github.com/neet/masto.js/commit/d22a145da48ada5bff24d6c6b972164cf3fa6705))

## [4.0.1](https://github.com/neet/masto.js/compare/v4.0.0...v4.0.1) (2021-04-18)


### Bug Fixes

* Use build commit as a patch ([63b46ea](https://github.com/neet/masto.js/commit/63b46ea9198335e50edd34ff3e4ae2bcbb205cb4))

# [4.0.0](https://github.com/neet/masto.js/compare/v3.7.0...v4.0.0) (2021-03-26)


### Bug Fixes

* Add RC suffix to prerelease ([cb1e88a](https://github.com/neet/masto.js/commit/cb1e88a1e239fd99b4eeb5855823d3969e311b33))
* Fix curcular bug on flattenObject ([bd4463a](https://github.com/neet/masto.js/commit/bd4463acbb3538b4b72c5382c8f52c7d365e78f1))
* Fix EventType ([a8d35ae](https://github.com/neet/masto.js/commit/a8d35ae456fe1bc9c1d669ef2a181171d35c25b1))
* Fix naming convention for Admin API ([c5759cd](https://github.com/neet/masto.js/commit/c5759cd59b63429eddb01139fe876284f1978c08))
* Fix paging ([a1e499c](https://github.com/neet/masto.js/commit/a1e499cab860b4c6ce550cab02551d2974d9c941))
* Fix transform-keys for primitive data ([93c2a14](https://github.com/neet/masto.js/commit/93c2a149130af1cc7d06fd2adb46ea476b660e4e))
* Fix typo ([4a6733f](https://github.com/neet/masto.js/commit/4a6733f428890572cf7d041ea0b28c54fb74ff96))
* Fix ws connection issue ([71f6a90](https://github.com/neet/masto.js/commit/71f6a90767fdb8988a1535489329316630853015))
* Remove --prerelease ([8e6cd48](https://github.com/neet/masto.js/commit/8e6cd48bddb551d11afdc84a6782098588f4c088))


### Features

* Add abstraction for AxiosRequestConfig ([23be967](https://github.com/neet/masto.js/commit/23be9678775c84b75774d146f4b40c4859bd0992))
* Enable polling of media attachment by default ([03625e6](https://github.com/neet/masto.js/commit/03625e6b2a3ce339db1fd864a4eb48b0e626daef))
* Introduce new APIs ([69f6131](https://github.com/neet/masto.js/commit/69f6131a19fbe7a14a3fd8aea52ab003438a7203))
* **233:** Better error handling ([bbafee1](https://github.com/neet/masto.js/commit/bbafee11cb6dc3f4b0a8091846ebe026fe77d663))


### BREAKING CHANGES

* Monolithic `Masto` class has been segregated into several different classes and now you can access through the facede class

## 3.0.0
This is the 3rd major version of Masto.js 🎉

### Breaking Changes
- The response objects are now `camelCase` #224 #230
- Renamed `uploadMediaAttachment` to `createMediaAttachment` #229
- Decouple 3rd party packages from Masto.js #228 #225

### Added
- Add missing `readCoversation` and `removeConversation`

### Fixed
- Better version handling #231

### Updated
- Follow TSDoc comments to docs.joinmastodon.org
- Update dependencies

### Internal changes
- Added `eslint-simple-import-sort` 0dba63b3920e0d83b0205a41d36021238df1b75c
- Updated examples

## 2.8.2
### Chagnes
- Use @rollup/* packages instead of rollup-* #194 #193
- Use cSpell #195
- Update dependencies

## 2.8.1
### Fixes
- Fix URL of `dismissNotification` #170 #169
- Fix typo of `dismissNotification`

### Changes
- Upgrade dependencies #171

## 2.8.0
- Bump TypeScript 3.7.0 #166
  - Also removes ts-optchain
- Bump Rollup.js and rollup-plugin-typescript2 #140

## 2.7.2
### Fixed
- Add `reason` param to CreateAccountParams #153
- Deprecate `fetchStatusCard` #152

### Updated
- Bump dependencies

## 2.7.1
> Accidentally published.

## 2.7.0
### Added
- Mastodon 3.0 support (#129, #130, #139)
	- Add Masto.fetchTrends for `GET /api/v1/trends`
	- Add Masto.fetchMarkers for `GET /api/v1/markers`
	- Add Masto.createMarkers for `POST /api/v1/markers`
	- Add Masto.fetchFeaturedTags for `GET /api/v1/featured_tags`
	- Add Masto.createFeaturedTag for `POST /api/v1/featured_tags`
	- Add Masto.removeFeaturedTag for `DELETE /api/v1/featured_tags`
	- Add Masto.fetchDirectory for `DELETE /api/v1/directory`
	- Add `exclude_unreviewed` option to Masto.search
	- Add `category` to Emoji entity
	- Add return type to `authorizeFollowRequest` and `rejectFollowRequest`

### Changed
- Updated dependencies #130
- Use GitHub Actions instead of Circle CI #131
