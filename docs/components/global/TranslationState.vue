<script setup lang="ts">
const localesStatuses = await import('~/translation-status.json').then(m => m.default)

const totalRerence = localesStatuses.en.total
</script>

<template>
  <table class="w-full">
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
            <td colspan="5" class="source-text">
              <div>
                {{ total }} keys as source
              </div>
            </td>
          </template>
          <template v-else>
            <td><strong>{{ `${translated?.length ?? 0}` }}</strong> {{ `(${(100 * (translated?.length ?? 0) / totalRerence).toFixed(1)}%)` }}</td>
            <td><strong>{{ `${missing?.length ?? 0}` }}</strong> {{ `(${(100 * (missing?.length ?? 0) / totalRerence).toFixed(1)}%)` }}</td>
            <td><strong>{{ `${outdated?.length ?? 0}` }}</strong> {{ `(${(100 * (outdated?.length ?? 0) / totalRerence).toFixed(1)}%)` }}</td>
            <td><strong>{{ `${total}` }}</strong></td>
            <td>
              <NuxtLink target="_blank" :href="`https://pr.new/github.com/elk-zone/elk/tree/main/locales/${file}`">
                <img
                  alt="Raise a PR"
                  src="https://developer.stackblitz.com/img/open_in_codeflow.svg"
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
  width: 100%
}

th {
  text-align: left;
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
