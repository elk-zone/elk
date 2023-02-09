<script setup lang="ts">
const localesStatuses = await import('~/translation-status.json').then(m => m.default)

const totalRerence = localesStatuses.en.total
</script>

<template>
  <table class="w-full">
    <caption>If you want to send a PR click on <strong>Open in Codeflow</strong> on the corresponding translation file</caption>
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
      <template v-for="({ title, file, translated, missing, outdated, total, isSource }, key) in localesStatuses" :key="key">
        <tr v-if="totalRerence > 0">
          <td>{{ title }}</td>
          <template v-if="isSource">
            <td colspan="4" class="source-text">
              <div>
                {{ total }} keys as source
              </div>
            </td>
            <td>
              <NuxtLink :href="`https://pr.new/github.com/elk-zone/elk/tree/main/locales/${file}`" title="Raise a PR">
                <img
                  alt="Open in Codeflow"
                  src="https://developer.stackblitz.com/img/open_in_codeflow_small.svg"
                >
              </NuxtLink>
            </td>
          </template>
          <template v-else>
            <td><strong>{{ `${translated?.length ?? 0}` }}</strong> {{ `(${(100 * (translated?.length ?? 0) / totalRerence).toFixed(1)}%)` }}</td>
            <td><strong>{{ `${missing?.length ?? 0}` }}</strong> {{ `(${(100 * (missing?.length ?? 0) / totalRerence).toFixed(1)}%)` }}</td>
            <td><strong>{{ `${outdated?.length ?? 0}` }}</strong> {{ `(${(100 * (outdated?.length ?? 0) / totalRerence).toFixed(1)}%)` }}</td>
            <td><strong>{{ `${total}` }}</strong></td>
            <td>
              <NuxtLink :href="`https://pr.new/github.com/elk-zone/elk/tree/main/locales/${file}`" title="Raise a PR">
                <img
                  alt="Open in Codeflow"
                  src="https://developer.stackblitz.com/img/open_in_codeflow_small.svg"
                >
              </NuxtLink>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
table {
  font-size: 0.9rem;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}

caption {
  padding: 0.3rem;
  background: #eee;
  border: 1px solid #ccc;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: none;
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
</style>
