<script setup lang="ts">
import ISO639 from 'iso-639-1'
import localesStatuses from 'virtual:elk-locales'

const getLocaleName = (locale: string) => {
  const [localeCode, variant] = locale.split('-')
  const localeName = ISO639.getName(localeCode)

  return `${localeName} ${variant ? `(${variant})` : ''}`
}
</script>

<template>
  <table class="w-full">
    <thead>
      <tr>
        <th>Language</th>
        <th>Translated</th>
        <th>Missing</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="({ translated, missing, total }, key) in localesStatuses" :key="key">
        <td>{{ getLocaleName(key) }}</td>
        <td>{{ `${translated?.length ?? 0} (${(100 * (translated?.length ?? 0) / total).toFixed(1)}%)` }}</td>
        <td>{{ `${missing?.length ?? 0} (${(100 * (missing?.length ?? 0) / total).toFixed(1)}%)` }}</td>
        <td><button>Raise a PR</button></td>
      </tr>
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

button {

}
</style>
