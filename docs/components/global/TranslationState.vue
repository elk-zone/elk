<script setup lang="ts">
import type { TranslationStatus } from '../../types'

const localesStatuses: TranslationStatus = await import('../../translation-status.json').then(m => m.default)

const totalReference = localesStatuses.en.total

type Tab = 'missing' | 'outdated'

const hidden = ref(true)
const locale = ref()
const localeTab = ref<Tab>('missing')
const copied = ref(false)

const currentLocale = computed(() => {
  if (hidden.value || !locale.value)
    return undefined

  return localesStatuses as Record<string, any>
})

const localeTitle = computed(() => {
  if (hidden.value || !locale.value)
    return undefined

  return localeTab.value === 'missing'
    ? `Missing keys in ${locale.value.file}`
    : `Outdated keys in ${locale.value.file}`
})

const missingEntries = computed<string[]>(() => {
  if (hidden.value || !currentLocale.value || localeTab.value !== 'missing')
    return []

  return localesStatuses[locale.value].missing
})

const outdatedEntries = computed<string[]>(() => {
  if (hidden.value || !currentLocale.value || localeTab.value !== 'outdated')
    return []

  return localesStatuses[locale.value]!.outdated
})

function showDetail(key: string, tab: Tab = 'missing', fromTab = false) {
  if (key === locale.value && tab === localeTab.value) {
    if (fromTab)
      return

    nextTick().then(() => hidden.value = !hidden.value)

    return
  }

  locale.value = key
  localeTab.value = tab
  nextTick().then(() => hidden.value = false)
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText([
      `# ${localeTitle.value}`,
      (localeTab.value === 'missing' ? missingEntries.value : outdatedEntries.value).join('\n'),
    ].join('\n'))
    copied.value = true
    setTimeout(() => copied.value = false, 750)
  }
  catch {}
}
</script>

<template>
  <div>
    <table class="w-full">
      <caption>
        <div>You can see the detail (missing and outdated keys) by clicking on the corresponding row.</div>
        <div>
          If you want to send a PR, click on <strong>Edit</strong> link on the corresponding translation file, it will open <strong>Codeflow</strong>:
          <NuxtLink
            class="inline"
            target="_blank"
            href="https://developer.stackblitz.com/codeflow/working-in-codeflow-ide#making-a-pr-with-codeflow-ide"
            title="How to make a PR with Codeflow IDE (opens in new window)"
          >
            read the following guide
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413Q19.825 21 19 21Zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4Z" />
            </svg>
          </NuxtLink>
        </div>
      </caption>
      <thead>
        <tr>
          <th>Language</th>
          <th title="Keys correctly translated">
            Translated
          </th>
          <th title="Keys missing from source which need translation for the language">
            Missing
          </th>
          <th title="Keys which could be safely removed">
            Outdated
          </th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="({ title, useFile, translated, missing, outdated, total, isSource }, key) in localesStatuses" :key="key">
          <tr
            v-if="totalReference > 0"
            :class="[{ expandable: !isSource }]"
            :title="!isSource ? 'Click to show detail' : undefined"
            @click="!isSource && showDetail(key, 'missing')"
          >
            <td :class="[{ expandable: !isSource }]">
              <div>
                <ToggleIcon v-if="!isSource" :up="hidden || key !== locale" />
                {{ title }}
              </div>
            </td>
            <template v-if="isSource">
              <td colspan="4" class="source-text">
                <div>
                  {{ total }} keys as source
                </div>
              </td>
              <td>
                <NuxtLink
                  :href="`https://pr.new/github.com/elk-zone/elk/tree/main/locales/${useFile}`"
                  target="_blank"
                  class="codeflow"
                  title="Raise a PR with Codeflow (opens in new window)"
                  @click.stop
                >
                  Edit
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413Q19.825 21 19 21Zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4Z" />
                  </svg>
                </NuxtLink>
              </td>
            </template>
            <template v-else>
              <td>
                <strong>{{ `${translated?.length ?? 0}` }}</strong> {{ `(${(100 * (translated?.length ?? 0) / totalReference).toFixed(1)}%)` }}
              </td>
              <td>
                <strong>{{ `${missing?.length ?? 0}` }}</strong> {{ `(${(100 * (missing?.length ?? 0) / totalReference).toFixed(1)}%)` }}
              </td>
              <td>
                <strong>{{ `${outdated?.length ?? 0}` }}</strong> {{ `(${(100 * (outdated?.length ?? 0) / totalReference).toFixed(1)}%)` }}
              </td>
              <td><strong>{{ `${total}` }}</strong></td>
              <td>
                <NuxtLink
                  :href="`https://pr.new/github.com/elk-zone/elk/tree/main/locales/${useFile}`"
                  target="_blank"
                  class="codeflow"
                  title="Raise a PR with Codeflow (opens in new window)"
                  @click.stop
                >
                  Edit
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h14v-7h2v7q0 .825-.587 1.413Q19.825 21 19 21Zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4Z" />
                  </svg>
                </NuxtLink>
              </td>
            </template>
          </tr>
          <template v-if="key === locale && !hidden">
            <tr>
              <td colspan="6">
                <div class="detail">
                  <header>
                    <h2 class="tabs">
                      <button
                        :class="localeTab === 'missing' ? 'current' : null"
                        @click="showDetail(key, 'missing', true)"
                      >
                        Missing keys
                      </button>
                      <button
                        :class="localeTab === 'outdated' ? 'current' : null"
                        @click="showDetail(key, 'outdated', true)"
                      >
                        Outdated keys
                      </button>
                    </h2>
                  </header>
                  <ul v-if="localeTab === 'missing'">
                    <li v-for="entry in missingEntries" :key="entry">
                      <pre>{{ entry }}</pre>
                    </li>
                  </ul>
                  <ul v-else>
                    <li v-for="entry in outdatedEntries" :key="entry">
                      <pre>{{ entry }}</pre>
                    </li>
                  </ul>
                  <button @click="copyToClipboard()">
                    <ClipboardIcon :copy="!copied" />
                    Copy to clipboard
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  font-size: 0.9rem;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}

pre {
  font-size: 0.75rem;
}

caption {
  padding: 0.3rem;
  background: #eee;
  border: 1px solid #ccc;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: none;
}
caption a {
  text-decoration: underline;
}

th {
  text-align: left;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem;
}
th:not(:first-of-type),
td:not(:first-of-type) {
  border-left: 1px solid #eee;
}
td {
  padding: 0.5rem;
}
tr.expandable td:first-of-type {
  padding-left: 4px;
}
tr.expandable, tr.expandable td {
  cursor: pointer;
}

a.codeflow,
a.inline,
td.expandable div {
  display: flex;
  align-items: center;
  flex-direction: row;
  column-gap: 4px;
}
td.expandable > svg {
  color: currentColor;
}

tbody tr td {
  border-bottom: 1px solid #eee;
}

th[title] {
  text-decoration: underline dotted white;
}

.source-text {
  text-align: center;
  font-weight: bold;
  padding: 10px 0;
  text-transform: uppercase;
}

.detail {
  border: 1px solid #ccc;
  border-radius: 3px;
}
.detail header {
  padding: 0 0.3rem;
  display: flex;
  background: #eee;
  justify-content: space-between;
  align-items: center;
}

.detail header h2 button {
  font-weight: bold;
  padding: 0.5rem;
  background-color: #eee;
}

.detail header .tabs button.current {
  background-color: white;
}

.detail header .tabs + .heading-buttons {
  display: flex;
  flex-direction: row;
  column-gap: 0.4rem;
  align-items: center;
}

.detail ul {
  padding: 0.3rem 0.5rem;
  max-height: 250px;
  min-height: 250px;
  overflow-y: auto;
  border-bottom: 1px solid #eee;
}

.detail > button {
  display: flex;
  /*justify-content: space-between;*/
  align-items: center;
  column-gap: 0.3rem;
  padding: 0.3rem 0.5rem;
  background: transparent;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  .detail header {
    background: #333;
    color: #fff;
  }

  .detail header h2 button {
    background-color: #333;
    color: #fff;
  }

  .detail header .tabs button.current {
    background-color: white;
    color: #333;
  }

  table caption {
    background: #333;
    color: #fff;
  }
}
</style>
