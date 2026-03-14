import type { BuildInfo } from './shared/types'
import { resolveModulePath } from 'exsolve'
import { createResolver, useNuxt } from 'nuxt/kit'
import { isCI, isDevelopment, isTest, isWindows } from 'std-env'
import { isPreview } from './config/env'
import { currentLocales } from './config/i18n'
import { pwa } from './config/pwa'

const TIPTAP_IMPORT_RE = /(?:^|\/)@tiptap\//
const PROSEMIRROR_IMPORT_RE = /(?:^|\/)prosemirror/

const { resolve } = createResolver(import.meta.url)

const mockProxy = resolveModulePath('mocked-exports/proxy', {
  from: import.meta.url,
})

export default defineNuxtConfig({
  compatibilityDate: '2025-07-11',
  typescript: {
    tsConfig: {
      include: ['../tests/nuxt'],
      exclude: ['../service-worker'],
      compilerOptions: {
        // TODO: enable this once we fix the issues
        noUncheckedIndexedAccess: false,
      },
      vueCompilerOptions: {
        target: 3.5,
      },
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vue-macros/nuxt',
    '@nuxtjs/i18n',
    // temporary disable module during test
    // ref. https://github.com/nuxt-modules/color-mode/issues/335
    ...(isTest ? [] : ['@nuxtjs/color-mode']),
    '@unlazy/nuxt',
    '@nuxt/test-utils/module',
    ...(isDevelopment || isWindows ? [] : ['nuxt-security']),
  ],
  vue: {
    propsDestructure: true,
  },
  macros: {
    setupSFC: true,
    betterDefine: false,
    defineModels: false,
    reactivityTransform: false,
  },
  devtools: {
    enabled: true,
  },
  features: {
    inlineStyles: false,
  },
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    // Temporary workaround to avoid hash mismatch issue
    // ref. https://github.com/elk-zone/elk/issues/3385#issuecomment-3335167005
    entryImportMap: false,
  },
  css: [
    '@unocss/reset/tailwind.css',
    'floating-vue/dist/style.css',
    '~/styles/default-theme.css',
    '~/styles/vars.css',
    '~/styles/global.css',
    '~/styles/scrollbars.css',
    '~/styles/tiptap.css',
    '~/styles/dropdown.css',
  ],
  alias: {
    'change-case': 'scule',
    'semver': resolve('./mocks/semver'),
  },
  imports: {
    dirs: [
      './composables/masto',
      './composables/push-notifications',
      './composables/settings',
      './composables/tiptap/index.ts',
    ],
    imports: [
      {
        name: 'useI18n',
        from: '~/utils/i18n',
        priority: 100,
      },
    ],
    injectAtEnd: true,
  },
  vite: {
    define: {
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
      'process.mock':
        ((!isCI || isPreview) && process.env.MOCK_USER) || 'false',
      'process.test': 'false',
    },
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      include: [
        '@tiptap/vue-3',
        'string-length',
        'vue-virtual-scroller',
        'emoji-mart',
        'iso-639-1',
        '@tiptap/extension-placeholder',
        '@tiptap/extension-document',
        '@tiptap/extension-paragraph',
        '@tiptap/extension-text',
        '@tiptap/extension-mention',
        '@tiptap/extension-hard-break',
        '@tiptap/extension-bold',
        '@tiptap/extension-italic',
        '@tiptap/extension-code',
        '@tiptap/extension-history',
        'prosemirror-state',
        'browser-fs-access',
        'blurhash',
        '@vueuse/integrations/useFocusTrap',
        '@tiptap/extension-code-block',
        'prosemirror-highlight',
        '@tiptap/core',
        'tippy.js',
        'prosemirror-highlight/shiki',
        '@fnando/sparkline',
        '@vueuse/gesture',
        'github-reserved-names',
        'file-saver',
        'slimeform',
        'vue-advanced-cropper',
        'workbox-window',
        'workbox-precaching',
        'workbox-routing',
        'workbox-cacheable-response',
        'workbox-strategies',
        'workbox-expiration',
      ],
    },
    lint: {
      "plugins": [
        "oxc",
        "typescript",
        "unicorn",
        "import"
      ],
      "categories": {
        "correctness": "warn"
      },
      "env": {
        "builtin": true,
        "es2026": true,
        "browser": true,
        "node": true
      },
      "ignorePatterns": [
        "**/node_modules",
        "**/*.log",
        "**/dist",
        "**/.output",
        "**/.pnpm-store",
        "**/.nuxt",
        "**/.data",
        "**/.env",
        "**/.DS_Store",
        "**/.idea/",
        "**/.vite-inspect",
        "**/.netlify/",
        "**/.eslintcache",
        "**/elk-translation-status.json",
        "public/emojis",
        "**/*~",
        "**/*swp",
        "**/*swo",
        "**/package-lock.json",
        "**/yarn.lock",
        "**/pnpm-lock.yaml",
        "**/bun.lockb",
        "**/output",
        "**/coverage",
        "**/temp",
        "**/.temp",
        "**/tmp",
        "**/.tmp",
        "**/.history",
        "**/.vitepress/cache",
        "**/.next",
        "**/.svelte-kit",
        "**/.vercel",
        "**/.changeset",
        "**/.idea",
        "**/.cache",
        "**/.yarn",
        "**/vite.config.*.timestamp-*",
        "**/CHANGELOG*.md",
        "**/*.min.*",
        "**/LICENSE*",
        "**/__snapshots__",
        "**/auto-import?(s).d.ts",
        "**/components.d.ts",
        "public/**",
        "public-dev/**",
        "public-staging/**",
        "https-dev-config/**",
        "elk-translation-status.json",
        "docs/translation-status.json"
      ],
      "globals": {
        "computed": "readonly",
        "defineEmits": "readonly",
        "defineExpose": "readonly",
        "defineProps": "readonly",
        "onMounted": "readonly",
        "onUnmounted": "readonly",
        "reactive": "readonly",
        "ref": "readonly",
        "shallowReactive": "readonly",
        "shallowRef": "readonly",
        "toRef": "readonly",
        "toRefs": "readonly",
        "watch": "readonly",
        "watchEffect": "readonly"
      },
      "rules": {
        "accessor-pairs": [
          "error",
          {
            "enforceForClassMembers": true,
            "setWithoutGet": true
          }
        ],
        "antfu/no-top-level-await": "error",
        "array-callback-return": "error",
        "block-scoped-var": "error",
        "constructor-super": "error",
        "default-case-last": "error",
        "@typescript-eslint/dot-notation": [
          "error",
          {
            "allowKeywords": true
          }
        ],
        "eqeqeq": [
          "error",
          "smart"
        ],
        "new-cap": [
          "error",
          {
            "capIsNew": false,
            "newIsCap": true,
            "properties": true
          }
        ],
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-async-promise-executor": "error",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-class-assign": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign": [
          "error",
          "always"
        ],
        "no-console": [
          "error",
          {
            "allow": [
              "warn",
              "error"
            ]
          }
        ],
        "no-const-assign": "error",
        "no-control-regex": "error",
        "no-debugger": "error",
        "no-delete-var": "error",
        "no-dupe-class-members": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-empty": [
          "error",
          {
            "allowEmptyCatch": true
          }
        ],
        "no-empty-character-class": "error",
        "no-empty-pattern": "error",
        "no-eval": "error",
        "no-ex-assign": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-boolean-cast": "error",
        "no-fallthrough": "error",
        "no-func-assign": "error",
        "no-global-assign": "error",
        "no-import-assign": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "error",
        "no-iterator": "error",
        "no-labels": [
          "error",
          {
            "allowLoop": false,
            "allowSwitch": false
          }
        ],
        "no-lone-blocks": "error",
        "no-loss-of-precision": "error",
        "no-misleading-character-class": "error",
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-native-nonconstructor": "error",
        "no-new-wrappers": "error",
        "no-obj-calls": "error",
        "no-proto": "error",
        "no-prototype-builtins": "error",
        "no-redeclare": [
          "error",
          {
            "builtinGlobals": false
          }
        ],
        "no-regex-spaces": "error",
        "no-restricted-globals": [
          "error",
          {
            "message": "Use `globalThis` instead.",
            "name": "global"
          },
          {
            "message": "Use `globalThis` instead.",
            "name": "self"
          }
        ],
        "no-self-assign": [
          "error",
          {
            "props": true
          }
        ],
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow-restricted-names": "error",
        "no-sparse-arrays": "error",
        "no-template-curly-in-string": "error",
        "no-this-before-super": "error",
        "no-throw-literal": "error",
        "no-undef": "error",
        "no-unexpected-multiline": "error",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": [
          "error",
          {
            "defaultAssignment": false
          }
        ],
        "no-unreachable": "error",
        "no-unsafe-finally": "error",
        "no-unsafe-negation": "error",
        "no-unused-expressions": [
          "error",
          {
            "allowShortCircuit": true,
            "allowTaggedTemplates": true,
            "allowTernary": true
          }
        ],
        "no-unused-vars": [
          "error",
          {
            "args": "none",
            "caughtErrors": "none",
            "ignoreRestSiblings": true,
            "vars": "all"
          }
        ],
        "no-use-before-define": [
          "error",
          {
            "classes": false,
            "functions": false,
            "variables": true
          }
        ],
        "no-useless-backreference": "error",
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-with": "error",
        "prefer-const": [
          "warn",
          {
            "destructuring": "all",
            "ignoreReadBeforeAssign": true
          }
        ],
        "prefer-exponentiation-operator": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "symbol-description": "error",
        "unicode-bom": [
          "error",
          "never"
        ],
        "unused-imports/no-unused-imports": "warn",
        "unused-imports/no-unused-vars": [
          "error",
          {
            "args": "after-used",
            "argsIgnorePattern": "^_",
            "ignoreRestSiblings": true,
            "vars": "all",
            "varsIgnorePattern": "^_"
          }
        ],
        "use-isnan": [
          "error",
          {
            "enforceForIndexOf": true,
            "enforceForSwitchCase": true
          }
        ],
        "valid-typeof": [
          "error",
          {
            "requireStringLiterals": true
          }
        ],
        "vars-on-top": "error",
        "yoda": [
          "error",
          "never"
        ],
        "eslint-comments/no-aggregating-enable": "error",
        "eslint-comments/no-duplicate-disable": "error",
        "eslint-comments/no-unlimited-disable": "error",
        "eslint-comments/no-unused-enable": "error",
        "command/command": "error",
        "perfectionist/sort-exports": [
          "error",
          {
            "order": "asc",
            "type": "natural"
          }
        ],
        "perfectionist/sort-imports": [
          "error",
          {
            "groups": [
              "type-import",
              [
                "type-parent",
                "type-sibling",
                "type-index",
                "type-internal"
              ],
              "value-builtin",
              "value-external",
              "value-internal",
              [
                "value-parent",
                "value-sibling",
                "value-index"
              ],
              "side-effect",
              "ts-equals-import",
              "unknown"
            ],
            "newlinesBetween": "ignore",
            "newlinesInside": "ignore",
            "order": "asc",
            "type": "natural"
          }
        ],
        "perfectionist/sort-named-exports": [
          "error",
          {
            "order": "asc",
            "type": "natural"
          }
        ],
        "perfectionist/sort-named-imports": [
          "error",
          {
            "order": "asc",
            "type": "natural"
          }
        ],
        "antfu/import-dedupe": "error",
        "antfu/no-import-dist": "error",
        "antfu/no-import-node-modules-by-path": "error",
        "import/consistent-type-specifier-style": [
          "error",
          "top-level"
        ],
        "import/first": "error",
        "import/no-duplicates": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
        "e18e/prefer-array-at": "error",
        "e18e/prefer-array-fill": "error",
        "e18e/prefer-includes": "error",
        "e18e/prefer-array-to-reversed": "error",
        "e18e/prefer-array-to-sorted": "error",
        "e18e/prefer-array-to-spliced": "error",
        "e18e/prefer-nullish-coalescing": "error",
        "e18e/prefer-object-has-own": "error",
        "e18e/prefer-spread-syntax": "error",
        "e18e/prefer-url-canparse": "error",
        "e18e/ban-dependencies": "error",
        "e18e/prefer-array-from-map": "error",
        "e18e/prefer-timer-args": "error",
        "e18e/prefer-date-now": "error",
        "e18e/prefer-regex-test": "error",
        "e18e/prefer-array-some": "error",
        "e18e/prefer-static-regex": "error",
        "unicorn/consistent-empty-array-spread": "error",
        "unicorn/error-message": "error",
        "unicorn/escape-case": "error",
        "unicorn/new-for-builtins": "error",
        "unicorn/no-instanceof-builtins": "error",
        "unicorn/no-new-array": "error",
        "unicorn/no-new-buffer": "error",
        "unicorn/number-literal-case": "error",
        "unicorn/prefer-dom-node-text-content": "error",
        "unicorn/prefer-includes": "error",
        "unicorn/prefer-node-protocol": "error",
        "unicorn/prefer-number-properties": "error",
        "unicorn/prefer-string-starts-ends-with": "error",
        "unicorn/prefer-type-error": "error",
        "unicorn/throw-new-error": "error",
        "@stylistic/array-bracket-spacing": [
          "error",
          "never"
        ],
        "@stylistic/arrow-parens": [
          "error",
          "as-needed",
          {
            "requireForBlockBody": true
          }
        ],
        "@stylistic/arrow-spacing": [
          "error",
          {
            "after": true,
            "before": true
          }
        ],
        "@stylistic/block-spacing": [
          "error",
          "always"
        ],
        "@stylistic/brace-style": [
          "error",
          "stroustrup",
          {
            "allowSingleLine": true
          }
        ],
        "@stylistic/comma-dangle": [
          "error",
          "always-multiline"
        ],
        "@stylistic/comma-spacing": [
          "error",
          {
            "after": true,
            "before": false
          }
        ],
        "@stylistic/comma-style": [
          "error",
          "last"
        ],
        "@stylistic/computed-property-spacing": [
          "error",
          "never",
          {
            "enforceForClassMembers": true
          }
        ],
        "@stylistic/dot-location": [
          "error",
          "property"
        ],
        "@stylistic/eol-last": "error",
        "@stylistic/generator-star-spacing": [
          "error",
          {
            "after": true,
            "before": false
          }
        ],
        "@stylistic/indent": [
          "error",
          2,
          {
            "ArrayExpression": 1,
            "CallExpression": {
              "arguments": 1
            },
            "flatTernaryExpressions": false,
            "FunctionDeclaration": {
              "body": 1,
              "parameters": 1,
              "returnType": 1
            },
            "FunctionExpression": {
              "body": 1,
              "parameters": 1,
              "returnType": 1
            },
            "ignoreComments": false,
            "ignoredNodes": [
              "TSUnionType",
              "TSIntersectionType"
            ],
            "ImportDeclaration": 1,
            "MemberExpression": 1,
            "ObjectExpression": 1,
            "offsetTernaryExpressions": true,
            "outerIIFEBody": 1,
            "SwitchCase": 1,
            "tabLength": 2,
            "VariableDeclarator": 1
          }
        ],
        "@stylistic/indent-binary-ops": [
          "error",
          2
        ],
        "@stylistic/key-spacing": [
          "error",
          {
            "afterColon": true,
            "beforeColon": false
          }
        ],
        "@stylistic/keyword-spacing": [
          "error",
          {
            "after": true,
            "before": true
          }
        ],
        "@stylistic/lines-between-class-members": [
          "error",
          "always",
          {
            "exceptAfterSingleLine": true
          }
        ],
        "@stylistic/max-statements-per-line": [
          "error",
          {
            "max": 1
          }
        ],
        "@stylistic/member-delimiter-style": [
          "error",
          {
            "multiline": {
              "delimiter": "none",
              "requireLast": false
            },
            "multilineDetection": "brackets",
            "overrides": {
              "interface": {
                "multiline": {
                  "delimiter": "none",
                  "requireLast": false
                }
              }
            },
            "singleline": {
              "delimiter": "comma"
            }
          }
        ],
        "@stylistic/multiline-ternary": [
          "error",
          "always-multiline"
        ],
        "@stylistic/new-parens": "error",
        "@stylistic/no-extra-parens": [
          "error",
          "functions"
        ],
        "@stylistic/no-floating-decimal": "error",
        "@stylistic/no-mixed-operators": [
          "error",
          {
            "allowSamePrecedence": true,
            "groups": [
              [
                "==",
                "!=",
                "===",
                "!==",
                ">",
                ">=",
                "<",
                "<="
              ],
              [
                "&&",
                "||"
              ],
              [
                "in",
                "instanceof"
              ]
            ]
          }
        ],
        "@stylistic/no-mixed-spaces-and-tabs": "error",
        "@stylistic/no-multi-spaces": "error",
        "@stylistic/no-multiple-empty-lines": [
          "error",
          {
            "max": 1,
            "maxBOF": 0,
            "maxEOF": 0
          }
        ],
        "@stylistic/no-tabs": "error",
        "@stylistic/no-trailing-spaces": "error",
        "@stylistic/no-whitespace-before-property": "error",
        "@stylistic/object-curly-spacing": [
          "error",
          "always"
        ],
        "@stylistic/operator-linebreak": [
          "error",
          "before"
        ],
        "@stylistic/padded-blocks": [
          "error",
          {
            "blocks": "never",
            "classes": "never",
            "switches": "never"
          }
        ],
        "@stylistic/quote-props": [
          "error",
          "consistent-as-needed"
        ],
        "@stylistic/quotes": [
          "error",
          "single",
          {
            "allowTemplateLiterals": "always",
            "avoidEscape": false
          }
        ],
        "@stylistic/rest-spread-spacing": [
          "error",
          "never"
        ],
        "@stylistic/semi": [
          "error",
          "never"
        ],
        "@stylistic/semi-spacing": [
          "error",
          {
            "after": true,
            "before": false
          }
        ],
        "@stylistic/space-before-blocks": [
          "error",
          "always"
        ],
        "@stylistic/space-before-function-paren": [
          "error",
          {
            "anonymous": "always",
            "asyncArrow": "always",
            "named": "never"
          }
        ],
        "@stylistic/space-in-parens": [
          "error",
          "never"
        ],
        "@stylistic/space-infix-ops": "error",
        "@stylistic/space-unary-ops": [
          "error",
          {
            "nonwords": false,
            "words": true
          }
        ],
        "@stylistic/spaced-comment": [
          "error",
          "always",
          {
            "block": {
              "balanced": true,
              "exceptions": [
                "*"
              ],
              "markers": [
                "!"
              ]
            },
            "line": {
              "exceptions": [
                "/",
                "#"
              ],
              "markers": [
                "/"
              ]
            }
          }
        ],
        "@stylistic/template-curly-spacing": "error",
        "@stylistic/template-tag-spacing": [
          "error",
          "never"
        ],
        "@stylistic/type-annotation-spacing": [
          "error",
          {}
        ],
        "@stylistic/type-generic-spacing": "error",
        "@stylistic/type-named-tuple-spacing": "error",
        "@stylistic/wrap-iife": [
          "error",
          "any",
          {
            "functionPrototypeMethods": true
          }
        ],
        "@stylistic/yield-star-spacing": [
          "error",
          {
            "after": true,
            "before": false
          }
        ],
        "@stylistic/jsx-closing-bracket-location": "error",
        "@stylistic/jsx-closing-tag-location": "error",
        "@stylistic/jsx-curly-brace-presence": [
          "error",
          {
            "propElementValues": "always"
          }
        ],
        "@stylistic/jsx-curly-newline": "error",
        "@stylistic/jsx-curly-spacing": [
          "error",
          "never"
        ],
        "@stylistic/jsx-equals-spacing": "error",
        "@stylistic/jsx-first-prop-new-line": "error",
        "@stylistic/jsx-function-call-newline": [
          "error",
          "multiline"
        ],
        "@stylistic/jsx-indent-props": [
          "error",
          2
        ],
        "@stylistic/jsx-max-props-per-line": [
          "error",
          {
            "maximum": 1,
            "when": "multiline"
          }
        ],
        "@stylistic/jsx-one-expression-per-line": [
          "error",
          {
            "allow": "single-child"
          }
        ],
        "@stylistic/jsx-quotes": "error",
        "@stylistic/jsx-tag-spacing": [
          "error",
          {
            "afterOpening": "never",
            "beforeClosing": "never",
            "beforeSelfClosing": "always",
            "closingSlash": "never"
          }
        ],
        "@stylistic/jsx-wrap-multilines": [
          "error",
          {
            "arrow": "parens-new-line",
            "assignment": "parens-new-line",
            "condition": "parens-new-line",
            "declaration": "parens-new-line",
            "logical": "parens-new-line",
            "prop": "parens-new-line",
            "propertyValue": "parens-new-line",
            "return": "parens-new-line"
          }
        ],
        "antfu/consistent-list-newline": "error",
        "antfu/consistent-chaining": "error",
        "antfu/curly": "error",
        "antfu/if-newline": "error",
        "antfu/top-level-function": "error",
        "regexp/confusing-quantifier": "warn",
        "regexp/control-character-escape": "error",
        "regexp/match-any": "error",
        "regexp/negation": "error",
        "regexp/no-contradiction-with-assertion": "error",
        "regexp/no-dupe-characters-character-class": "error",
        "regexp/no-dupe-disjunctions": "error",
        "regexp/no-empty-alternative": "warn",
        "regexp/no-empty-capturing-group": "error",
        "regexp/no-empty-character-class": "error",
        "regexp/no-empty-group": "error",
        "regexp/no-empty-lookarounds-assertion": "error",
        "regexp/no-empty-string-literal": "error",
        "regexp/no-escape-backspace": "error",
        "regexp/no-extra-lookaround-assertions": "error",
        "regexp/no-invalid-regexp": "error",
        "regexp/no-invisible-character": "error",
        "regexp/no-lazy-ends": "warn",
        "regexp/no-legacy-features": "error",
        "regexp/no-misleading-capturing-group": "error",
        "regexp/no-misleading-unicode-character": "error",
        "regexp/no-missing-g-flag": "error",
        "regexp/no-non-standard-flag": "error",
        "regexp/no-obscure-range": "error",
        "regexp/no-optional-assertion": "error",
        "regexp/no-potentially-useless-backreference": "warn",
        "regexp/no-super-linear-backtracking": "error",
        "regexp/no-trivially-nested-assertion": "error",
        "regexp/no-trivially-nested-quantifier": "error",
        "regexp/no-unused-capturing-group": "error",
        "regexp/no-useless-assertions": "error",
        "regexp/no-useless-backreference": "error",
        "regexp/no-useless-character-class": "error",
        "regexp/no-useless-dollar-replacements": "error",
        "regexp/no-useless-escape": "error",
        "regexp/no-useless-flag": "warn",
        "regexp/no-useless-lazy": "error",
        "regexp/no-useless-non-capturing-group": "error",
        "regexp/no-useless-quantifier": "error",
        "regexp/no-useless-range": "error",
        "regexp/no-useless-set-operand": "error",
        "regexp/no-useless-string-literal": "error",
        "regexp/no-useless-two-nums-quantifier": "error",
        "regexp/no-zero-quantifier": "error",
        "regexp/optimal-lookaround-quantifier": "warn",
        "regexp/optimal-quantifier-concatenation": "error",
        "regexp/prefer-character-class": "error",
        "regexp/prefer-d": "error",
        "regexp/prefer-plus-quantifier": "error",
        "regexp/prefer-predefined-assertion": "error",
        "regexp/prefer-question-quantifier": "error",
        "regexp/prefer-range": "error",
        "regexp/prefer-set-operation": "error",
        "regexp/prefer-star-quantifier": "error",
        "regexp/prefer-unicode-codepoint-escapes": "error",
        "regexp/prefer-w": "error",
        "regexp/simplify-set-operations": "error",
        "regexp/sort-flags": "error",
        "regexp/strict": "error",
        "regexp/use-ignore-case": "error"
      },
      "jsPlugins": [
        "eslint-plugin-antfu",
        "eslint-plugin-unused-imports",
        "eslint-plugin-eslint-comments",
        "eslint-plugin-command",
        "eslint-plugin-perfectionist",
        "eslint-plugin-e18e",
        "@stylistic/eslint-plugin",
        "eslint-plugin-regexp"
      ],
      "overrides": [
        {
          "files": [
            "**/*.?([cm])[jt]s?(x)"
          ],
          "rules": {
            "node/no-exports-assign": "error",
            "node/no-new-require": "error",
            "node/no-path-concat": "error",
            "jsdoc/check-access": "warn",
            "jsdoc/check-property-names": "warn",
            "jsdoc/empty-tags": "warn",
            "jsdoc/implements-on-classes": "warn",
            "jsdoc/no-defaults": "warn",
            "jsdoc/require-param-name": "warn",
            "jsdoc/require-property": "warn",
            "jsdoc/require-property-description": "warn",
            "jsdoc/require-property-name": "warn",
            "jsdoc/require-returns-description": "warn"
          },
          "plugins": [
            "node",
            "jsdoc"
          ]
        },
        {
          "files": [
            "**/*.?([cm])ts",
            "**/*.?([cm])tsx",
            "**/*.vue"
          ],
          "rules": {
            "constructor-super": "off",
            "getter-return": "off",
            "no-class-assign": "off",
            "no-const-assign": "off",
            "no-dupe-keys": "off",
            "no-func-assign": "off",
            "no-import-assign": "off",
            "no-new-native-nonconstructor": "off",
            "no-obj-calls": "off",
            "no-redeclare": [
              "error",
              {
                "builtinGlobals": false
              }
            ],
            "no-setter-return": "off",
            "no-this-before-super": "off",
            "no-undef": "off",
            "no-unreachable": "off",
            "no-unsafe-negation": "off",
            "no-with": "off",
            "prefer-const": "error",
            "@typescript-eslint/ban-ts-comment": [
              "error",
              {
                "ts-expect-error": "allow-with-description"
              }
            ],
            "@typescript-eslint/no-duplicate-enum-values": "error",
            "@typescript-eslint/no-empty-object-type": [
              "error",
              {
                "allowInterfaces": "always"
              }
            ],
            "@typescript-eslint/no-extra-non-null-assertion": "error",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-namespace": "error",
            "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-this-alias": "error",
            "@typescript-eslint/no-unnecessary-type-constraint": "error",
            "@typescript-eslint/no-unsafe-declaration-merging": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",
            "no-unused-expressions": [
              "error",
              {
                "allowShortCircuit": true,
                "allowTaggedTemplates": true,
                "allowTernary": true
              }
            ],
            "no-unused-vars": "off",
            "no-useless-constructor": "off",
            "@typescript-eslint/no-wrapper-object-types": "error",
            "@typescript-eslint/prefer-as-const": "error",
            "@typescript-eslint/prefer-literal-enum-member": "error",
            "@typescript-eslint/prefer-namespace-keyword": "error",
            "no-use-before-define": [
              "error",
              {
                "classes": false,
                "functions": false,
                "variables": true
              }
            ],
            "@typescript-eslint/consistent-type-definitions": [
              "error",
              "interface"
            ],
            "@typescript-eslint/consistent-type-imports": [
              "error",
              {
                "disallowTypeAnnotations": false,
                "fixStyle": "separate-type-imports",
                "prefer": "type-imports"
              }
            ],
            "@typescript-eslint/method-signature-style": [
              "error",
              "property"
            ],
            "@typescript-eslint/no-import-type-side-effects": "error"
          },
          "jsPlugins": [
            "@typescript-eslint/eslint-plugin"
          ]
        },
        {
          "files": [
            "**/__tests__/**/*.?([cm])[jt]s?(x)",
            "**/*.spec.?([cm])[jt]s?(x)",
            "**/*.test.?([cm])[jt]s?(x)",
            "**/*.bench.?([cm])[jt]s?(x)",
            "**/*.benchmark.?([cm])[jt]s?(x)"
          ],
          "rules": {
            "test/consistent-test-it": [
              "error",
              {
                "fn": "it",
                "withinDescribe": "it"
              }
            ],
            "test/no-identical-title": "error",
            "test/no-import-node-test": "error",
            "test/no-only-tests": "warn",
            "test/prefer-hooks-in-order": "error",
            "test/prefer-lowercase-title": "error",
            "antfu/no-top-level-await": "off",
            "no-unused-expressions": "off"
          },
          "jsPlugins": [
            "eslint-plugin-vitest",
            "eslint-plugin-antfu"
          ]
        },
        {
          "files": [
            "**/*.vue"
          ],
          "rules": {
            "vue/no-arrow-functions-in-watch": "error",
            "vue/no-deprecated-destroyed-lifecycle": "error",
            "vue/no-export-in-script-setup": "error",
            "vue/no-lifecycle-after-await": "error",
            "vue/prefer-import-from-vue": "error",
            "vue/valid-define-emits": "error",
            "vue/valid-define-props": "error",
            "vue/no-multiple-slot-args": "warn",
            "vue/no-required-prop-with-default": "warn",
            "antfu/no-top-level-await": "off"
          },
          "jsPlugins": [
            "eslint-plugin-antfu"
          ],
          "plugins": [
            "vue"
          ]
        },
        {
          "files": [
            "**/*.json",
            "**/*.json5",
            "**/*.jsonc"
          ],
          "rules": {
            "jsonc/no-bigint-literals": "error",
            "jsonc/no-binary-expression": "error",
            "jsonc/no-binary-numeric-literals": "error",
            "jsonc/no-dupe-keys": "error",
            "jsonc/no-escape-sequence-in-identifier": "error",
            "jsonc/no-floating-decimal": "error",
            "jsonc/no-hexadecimal-numeric-literals": "error",
            "jsonc/no-infinity": "error",
            "jsonc/no-multi-str": "error",
            "jsonc/no-nan": "error",
            "jsonc/no-number-props": "error",
            "jsonc/no-numeric-separators": "error",
            "jsonc/no-octal": "error",
            "jsonc/no-octal-escape": "error",
            "jsonc/no-octal-numeric-literals": "error",
            "jsonc/no-parenthesized": "error",
            "jsonc/no-plus-sign": "error",
            "jsonc/no-regexp-literals": "error",
            "jsonc/no-sparse-arrays": "error",
            "jsonc/no-template-literals": "error",
            "jsonc/no-undefined-value": "error",
            "jsonc/no-unicode-codepoint-escapes": "error",
            "jsonc/no-useless-escape": "error",
            "jsonc/space-unary-ops": "error",
            "jsonc/valid-json-number": "error",
            "jsonc/vue-custom-block/no-parsing-error": "error",
            "jsonc/array-bracket-spacing": [
              "error",
              "never"
            ],
            "jsonc/comma-dangle": [
              "error",
              "never"
            ],
            "jsonc/comma-style": [
              "error",
              "last"
            ],
            "jsonc/indent": [
              "error",
              2
            ],
            "jsonc/key-spacing": [
              "error",
              {
                "afterColon": true,
                "beforeColon": false
              }
            ],
            "jsonc/object-curly-newline": [
              "error",
              {
                "consistent": true,
                "multiline": true
              }
            ],
            "jsonc/object-curly-spacing": [
              "error",
              "always"
            ],
            "jsonc/object-property-newline": [
              "error",
              {
                "allowAllPropertiesOnSameLine": true
              }
            ],
            "jsonc/quote-props": "error",
            "jsonc/quotes": "error"
          },
          "jsPlugins": [
            "eslint-plugin-jsonc"
          ]
        },
        {
          "files": [
            "**/package.json"
          ],
          "rules": {
            "jsonc/sort-array-values": [
              "error",
              {
                "order": {
                  "type": "asc"
                },
                "pathPattern": "^files$"
              }
            ],
            "jsonc/sort-keys": [
              "error",
              {
                "order": [
                  "publisher",
                  "name",
                  "displayName",
                  "type",
                  "version",
                  "private",
                  "packageManager",
                  "description",
                  "author",
                  "contributors",
                  "license",
                  "funding",
                  "homepage",
                  "repository",
                  "bugs",
                  "keywords",
                  "categories",
                  "sideEffects",
                  "imports",
                  "exports",
                  "main",
                  "module",
                  "unpkg",
                  "jsdelivr",
                  "types",
                  "typesVersions",
                  "bin",
                  "icon",
                  "files",
                  "engines",
                  "activationEvents",
                  "contributes",
                  "scripts",
                  "peerDependencies",
                  "peerDependenciesMeta",
                  "dependencies",
                  "optionalDependencies",
                  "devDependencies",
                  "pnpm",
                  "overrides",
                  "resolutions",
                  "husky",
                  "simple-git-hooks",
                  "lint-staged",
                  "eslintConfig"
                ],
                "pathPattern": "^$"
              },
              {
                "order": {
                  "type": "asc"
                },
                "pathPattern": "^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$"
              },
              {
                "order": {
                  "type": "asc"
                },
                "pathPattern": "^(?:resolutions|overrides|pnpm.overrides)$"
              },
              {
                "order": {
                  "type": "asc"
                },
                "pathPattern": "^workspaces\\.catalog$"
              },
              {
                "order": {
                  "type": "asc"
                },
                "pathPattern": "^workspaces\\.catalogs\\.[^.]+$"
              },
              {
                "order": [
                  "types",
                  "import",
                  "require",
                  "default"
                ],
                "pathPattern": "^exports.*$"
              },
              {
                "order": [
                  "pre-commit",
                  "prepare-commit-msg",
                  "commit-msg",
                  "post-commit",
                  "pre-rebase",
                  "post-rewrite",
                  "post-checkout",
                  "post-merge",
                  "pre-push",
                  "pre-auto-gc"
                ],
                "pathPattern": "^(?:gitHooks|husky|simple-git-hooks)$"
              }
            ]
          },
          "jsPlugins": [
            "eslint-plugin-jsonc"
          ]
        },
        {
          "files": [
            "**/[jt]sconfig.json",
            "**/[jt]sconfig.*.json"
          ],
          "rules": {
            "jsonc/sort-keys": [
              "error",
              {
                "order": [
                  "extends",
                  "compilerOptions",
                  "references",
                  "files",
                  "include",
                  "exclude"
                ],
                "pathPattern": "^$"
              },
              {
                "order": [
                  "incremental",
                  "composite",
                  "tsBuildInfoFile",
                  "disableSourceOfProjectReferenceRedirect",
                  "disableSolutionSearching",
                  "disableReferencedProjectLoad",
                  "target",
                  "jsx",
                  "jsxFactory",
                  "jsxFragmentFactory",
                  "jsxImportSource",
                  "lib",
                  "moduleDetection",
                  "noLib",
                  "reactNamespace",
                  "useDefineForClassFields",
                  "emitDecoratorMetadata",
                  "experimentalDecorators",
                  "libReplacement",
                  "baseUrl",
                  "rootDir",
                  "rootDirs",
                  "customConditions",
                  "module",
                  "moduleResolution",
                  "moduleSuffixes",
                  "noResolve",
                  "paths",
                  "resolveJsonModule",
                  "resolvePackageJsonExports",
                  "resolvePackageJsonImports",
                  "typeRoots",
                  "types",
                  "allowArbitraryExtensions",
                  "allowImportingTsExtensions",
                  "allowUmdGlobalAccess",
                  "allowJs",
                  "checkJs",
                  "maxNodeModuleJsDepth",
                  "strict",
                  "strictBindCallApply",
                  "strictFunctionTypes",
                  "strictNullChecks",
                  "strictPropertyInitialization",
                  "allowUnreachableCode",
                  "allowUnusedLabels",
                  "alwaysStrict",
                  "exactOptionalPropertyTypes",
                  "noFallthroughCasesInSwitch",
                  "noImplicitAny",
                  "noImplicitOverride",
                  "noImplicitReturns",
                  "noImplicitThis",
                  "noPropertyAccessFromIndexSignature",
                  "noUncheckedIndexedAccess",
                  "noUnusedLocals",
                  "noUnusedParameters",
                  "useUnknownInCatchVariables",
                  "declaration",
                  "declarationDir",
                  "declarationMap",
                  "downlevelIteration",
                  "emitBOM",
                  "emitDeclarationOnly",
                  "importHelpers",
                  "importsNotUsedAsValues",
                  "inlineSourceMap",
                  "inlineSources",
                  "mapRoot",
                  "newLine",
                  "noEmit",
                  "noEmitHelpers",
                  "noEmitOnError",
                  "outDir",
                  "outFile",
                  "preserveConstEnums",
                  "preserveValueImports",
                  "removeComments",
                  "sourceMap",
                  "sourceRoot",
                  "stripInternal",
                  "allowSyntheticDefaultImports",
                  "esModuleInterop",
                  "forceConsistentCasingInFileNames",
                  "isolatedDeclarations",
                  "isolatedModules",
                  "preserveSymlinks",
                  "verbatimModuleSyntax",
                  "erasableSyntaxOnly",
                  "skipDefaultLibCheck",
                  "skipLibCheck"
                ],
                "pathPattern": "^compilerOptions$"
              }
            ]
          },
          "jsPlugins": [
            "eslint-plugin-jsonc"
          ]
        },
        {
          "files": [
            "package.json",
            "**/package.json"
          ],
          "rules": {
            "pnpm/json-enforce-catalog": [
              "error",
              {
                "autofix": false,
                "ignores": [
                  "@types/vscode"
                ]
              }
            ],
            "pnpm/json-prefer-workspace-settings": [
              "error",
              {
                "autofix": false
              }
            ],
            "pnpm/json-valid-catalog": [
              "error",
              {
                "autofix": false
              }
            ]
          },
          "jsPlugins": [
            "eslint-plugin-pnpm"
          ]
        },
        {
          "files": [
            "pnpm-workspace.yaml"
          ],
          "rules": {
            "pnpm/yaml-enforce-settings": [
              "error",
              {
                "settings": {
                  "shellEmulator": true,
                  "trustPolicy": "no-downgrade"
                }
              }
            ],
            "pnpm/yaml-no-duplicate-catalog-item": "error",
            "pnpm/yaml-no-unused-catalog-item": "error",
            "yml/sort-keys": [
              "error",
              {
                "order": [
                  "cacheDir",
                  "catalogMode",
                  "cleanupUnusedCatalogs",
                  "dedupeDirectDeps",
                  "deployAllFiles",
                  "enablePrePostScripts",
                  "engineStrict",
                  "extendNodePath",
                  "hoist",
                  "hoistPattern",
                  "hoistWorkspacePackages",
                  "ignoreCompatibilityDb",
                  "ignoreDepScripts",
                  "ignoreScripts",
                  "ignoreWorkspaceRootCheck",
                  "managePackageManagerVersions",
                  "minimumReleaseAge",
                  "minimumReleaseAgeExclude",
                  "modulesDir",
                  "nodeLinker",
                  "nodeVersion",
                  "optimisticRepeatInstall",
                  "packageManagerStrict",
                  "packageManagerStrictVersion",
                  "preferSymlinkedExecutables",
                  "preferWorkspacePackages",
                  "publicHoistPattern",
                  "registrySupportsTimeField",
                  "requiredScripts",
                  "resolutionMode",
                  "savePrefix",
                  "scriptShell",
                  "shamefullyHoist",
                  "shellEmulator",
                  "stateDir",
                  "supportedArchitectures",
                  "symlink",
                  "tag",
                  "trustPolicy",
                  "trustPolicyExclude",
                  "updateNotifier",
                  "packages",
                  "overrides",
                  "patchedDependencies",
                  "catalog",
                  "catalogs",
                  "allowedDeprecatedVersions",
                  "allowNonAppliedPatches",
                  "configDependencies",
                  "ignoredBuiltDependencies",
                  "ignoredOptionalDependencies",
                  "neverBuiltDependencies",
                  "onlyBuiltDependencies",
                  "onlyBuiltDependenciesFile",
                  "packageExtensions",
                  "peerDependencyRules"
                ],
                "pathPattern": "^$"
              },
              {
                "order": {
                  "type": "asc"
                },
                "pathPattern": ".*"
              }
            ]
          },
          "jsPlugins": [
            "eslint-plugin-pnpm",
            "eslint-plugin-yml"
          ]
        },
        {
          "files": [
            "**/*.y?(a)ml"
          ],
          "rules": {
            "@stylistic/spaced-comment": "off",
            "yml/block-mapping": "error",
            "yml/block-sequence": "error",
            "yml/no-empty-key": "error",
            "yml/no-empty-sequence-entry": "error",
            "yml/no-irregular-whitespace": "error",
            "yml/plain-scalar": "error",
            "yml/vue-custom-block/no-parsing-error": "error",
            "yml/block-mapping-question-indicator-newline": "error",
            "yml/block-sequence-hyphen-indicator-newline": "error",
            "yml/flow-mapping-curly-newline": "error",
            "yml/flow-mapping-curly-spacing": "error",
            "yml/flow-sequence-bracket-newline": "error",
            "yml/flow-sequence-bracket-spacing": "error",
            "yml/indent": [
              "error",
              2
            ],
            "yml/key-spacing": "error",
            "yml/no-tab-indent": "error",
            "yml/quotes": [
              "error",
              {
                "avoidEscape": true,
                "prefer": "single"
              }
            ],
            "yml/spaced-comment": "error"
          },
          "jsPlugins": [
            "@stylistic/eslint-plugin",
            "eslint-plugin-yml"
          ]
        },
        {
          "files": [
            "**/*.toml"
          ],
          "rules": {
            "@stylistic/spaced-comment": "off",
            "toml/comma-style": "error",
            "toml/keys-order": "error",
            "toml/no-space-dots": "error",
            "toml/no-unreadable-number-separator": "error",
            "toml/precision-of-fractional-seconds": "error",
            "toml/precision-of-integer": "error",
            "toml/tables-order": "error",
            "toml/vue-custom-block/no-parsing-error": "error",
            "toml/array-bracket-newline": "error",
            "toml/array-bracket-spacing": "error",
            "toml/array-element-newline": "error",
            "toml/indent": [
              "error",
              2
            ],
            "toml/inline-table-curly-spacing": "error",
            "toml/key-spacing": "error",
            "toml/padding-line-between-pairs": "error",
            "toml/padding-line-between-tables": "error",
            "toml/quoted-keys": "error",
            "toml/spaced-comment": "error",
            "toml/table-bracket-spacing": "error"
          },
          "jsPlugins": [
            "@stylistic/eslint-plugin",
            "eslint-plugin-toml"
          ]
        },
        {
          "files": [
            "**/*.md"
          ],
          "rules": {
            "markdown/fenced-code-language": "off",
            "markdown/heading-increment": "error",
            "markdown/no-duplicate-definitions": "error",
            "markdown/no-empty-definitions": "error",
            "markdown/no-empty-images": "error",
            "markdown/no-empty-links": "error",
            "markdown/no-invalid-label-refs": "error",
            "markdown/no-missing-atx-heading-space": "error",
            "markdown/no-missing-label-refs": "off",
            "markdown/no-missing-link-fragments": "error",
            "markdown/no-multiple-h1": "error",
            "markdown/no-reference-like-urls": "error",
            "markdown/no-reversed-media-syntax": "error",
            "markdown/no-space-in-emphasis": "error",
            "markdown/no-unused-definitions": "error",
            "markdown/require-alt-text": "error",
            "markdown/table-column-count": "error",
            "command/command": "off",
            "no-irregular-whitespace": "off",
            "perfectionist/sort-exports": "off",
            "perfectionist/sort-imports": "off",
            "regexp/no-legacy-features": "off",
            "regexp/no-missing-g-flag": "off",
            "regexp/no-useless-dollar-replacements": "off",
            "regexp/no-useless-flag": "off",
            "@stylistic/indent": "off"
          },
          "jsPlugins": [
            "@eslint/eslint-plugin-markdown",
            "eslint-plugin-command",
            "eslint-plugin-perfectionist",
            "eslint-plugin-regexp",
            "@stylistic/eslint-plugin"
          ]
        },
        {
          "files": [
            "**/*.md/**/*.?([cm])[jt]s?(x)",
            "**/*.md/**/*.vue"
          ],
          "rules": {
            "antfu/no-top-level-await": "off",
            "no-alert": "off",
            "no-console": "off",
            "no-labels": "off",
            "no-lone-blocks": "off",
            "no-undef": "off",
            "no-unused-expressions": "off",
            "no-unused-labels": "off",
            "no-unused-vars": "off",
            "@stylistic/comma-dangle": "off",
            "@stylistic/eol-last": "off",
            "@stylistic/padding-line-between-statements": "off",
            "unicode-bom": "off",
            "unused-imports/no-unused-imports": "off",
            "unused-imports/no-unused-vars": "off"
          },
          "jsPlugins": [
            "eslint-plugin-antfu",
            "@stylistic/eslint-plugin",
            "eslint-plugin-unused-imports"
          ]
        },
        {
          "files": [
            "**/scripts/**/*.?([cm])[jt]s?(x)",
            "**/cli/**/*.?([cm])[jt]s?(x)",
            "**/cli.?([cm])[jt]s?(x)"
          ],
          "rules": {
            "antfu/no-top-level-await": "off",
            "no-console": "off"
          },
          "jsPlugins": [
            "eslint-plugin-antfu"
          ]
        },
        {
          "files": [
            "**/bin/**/*",
            "**/bin.?([cm])[jt]s?(x)"
          ],
          "rules": {
            "antfu/no-import-dist": "off",
            "antfu/no-import-node-modules-by-path": "off"
          },
          "jsPlugins": [
            "eslint-plugin-antfu"
          ]
        },
        {
          "files": [
            "**/*.d.?([cm])ts"
          ],
          "rules": {
            "eslint-comments/no-unlimited-disable": "off",
            "unused-imports/no-unused-vars": "off"
          },
          "jsPlugins": [
            "eslint-plugin-eslint-comments",
            "eslint-plugin-unused-imports"
          ]
        },
        {
          "files": [
            "**/*.config.?([cm])[jt]s?(x)",
            "**/*.config.*.?([cm])[jt]s?(x)"
          ],
          "rules": {
            "antfu/no-top-level-await": "off",
            "no-console": "off"
          },
          "jsPlugins": [
            "eslint-plugin-antfu"
          ]
        },
        {
          "files": [
            "locales/**.json"
          ],
          "rules": {
            "jsonc/sort-keys": "error"
          },
          "jsPlugins": [
            "eslint-plugin-jsonc"
          ]
        }
      ],
      "options": {
        "typeAware": true,
        "typeCheck": true
      }
    },
  },
  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
  appConfig: {
    storage: {
      driver: process.env.NUXT_STORAGE_DRIVER ?? (isCI ? 'cloudflare' : 'fs'),
    },
  },
  runtimeConfig: {
    adminKey: '',
    cloudflare: {
      accountId: '',
      namespaceId: '',
      apiToken: '',
    },
    vercel: {
      url: '',
      token: '',
      env: '',
      base: '',
    },
    public: {
      privacyPolicyUrl: '',
      // We use LibreTranslate (https://github.com/LibreTranslate/LibreTranslate) as
      // our default translation server #76
      translateApi: '',
      // Use the instance where Elk has its Mastodon account as the default
      defaultServer: 'm.webtoo.ls',
      singleInstance: false,
    },
    storage: {
      fsBase: 'node_modules/.cache/app',
    },
  },
  routeRules: {
    // Static generation
    '/': { prerender: true },
    '/settings/**': { prerender: false },
    // incremental regeneration
    '/api/list-servers': { swr: true },
    // CDN cache rules
    '/manifest.webmanifest': {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    },
  },
  nitro: {
    alias: {
      'isomorphic-ws': mockProxy,
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: true,
    },
    publicAssets: [
      {
        dir: resolve('./public/avatars'),
        maxAge: 24 * 60 * 60 * 30, // 30 days
        baseURL: '/avatars',
      },
      {
        dir: resolve('./public/emojis'),
        maxAge: 24 * 60 * 60 * 15, // 15 days, matching service worker
        baseURL: '/emojis',
      },
      {
        dir: resolve('./public/fonts'),
        maxAge: 24 * 60 * 60 * 365, // 1 year (versioned)
        baseURL: '/fonts',
      },
    ],
  },
  sourcemap: isDevelopment,
  hooks: {
    'prepare:types': function ({ references }) {
      references.push({ types: '@types/wicg-file-system-access' })
    },
    'nitro:config': function (config) {
      const nuxt = useNuxt()
      config.virtual = config.virtual || {}
      config.virtual['#storage-config']
        = `export const driver = ${JSON.stringify(nuxt.options.appConfig.storage.driver)}`
    },
    'vite:extendConfig': function (config, { isServer }) {
      if (isServer) {
        const alias = config.resolve!.alias as Record<string, string>
        for (const dep of ['eventemitter3', 'isomorphic-ws'])
          alias[dep] = resolve('./mocks/class')
        for (const dep of ['fuse.js']) alias[dep] = mockProxy
        const resolver = createResolver(import.meta.url)

        config.plugins!.unshift({
          name: 'mock',
          enforce: 'pre',
          resolveId(id) {
            if (TIPTAP_IMPORT_RE.test(id))
              return resolver.resolve('./mocks/tiptap.ts')
            if (PROSEMIRROR_IMPORT_RE.test(id))
              return resolver.resolve('./mocks/prosemirror.ts')
          },
        })

        const noExternal = config.ssr!.noExternal as string[]
        noExternal.push(
          'masto',
          '@fnando/sparkline',
          'vue-i18n',
          '@mastojs/ponyfills',
        )
      }
    },
  },
  app: {
    keepalive: true,
    head: {
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      bodyAttrs: {
        class: 'overflow-x-hidden',
      },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        // open graph social image
        { property: 'og:title', content: 'Elk' },
        { property: 'og:description', content: 'A nimble Mastodon web client' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://elk.zone/elk-og.png' },
        { property: 'og:image:width', content: '3800' },
        { property: 'og:image:height', content: '1900' },
        { property: 'og:site_name', content: 'Elk' },
        { name: 'twitter:site', content: '@elk_zone' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },

  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore nuxt-security is conditional
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        'default-src': ['\'self\''],
        'base-uri': ['\'self\''],
        'connect-src': ['\'self\'', 'https:', 'http:', 'wss:', 'ws:'],
        'font-src': ['\'self\''],
        'form-action': ['\'none\''],
        'frame-ancestors': ['\'none\''],
        'frame-src': ['https:'],
        'img-src': ['\'self\'', 'https:', 'http:', 'data:', 'blob:'],
        'manifest-src': ['\'self\''],
        'media-src': ['\'self\'', 'https:', 'http:'],
        'object-src': ['\'none\''],
        'script-src': ['\'self\'', '\'unsafe-inline\'', '\'wasm-unsafe-eval\''],
        'script-src-attr': ['\'none\''],
        'style-src': ['\'self\'', '\'unsafe-inline\''],
        'upgrade-insecure-requests': true,
      },
      permissionsPolicy: {
        fullscreen: '*',
      },
    },
    rateLimiter: false,
  },
  colorMode: { classSuffix: '' },
  i18n: {
    locales: currentLocales,
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    // relative to i18n dir on rootDir: not yet v4 compat layout
    langDir: '../locales',
    defaultLocale: 'en-US',
    vueI18n: '../config/i18n.config.ts',
  },
  pwa,
  unlazy: {
    ssr: false,
  },
})

declare module '@nuxt/schema' {
  interface AppConfig {
    storage: any
    env: BuildInfo['env']
    buildInfo: BuildInfo
  }
}
