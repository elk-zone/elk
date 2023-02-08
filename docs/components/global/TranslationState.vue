<script setup lang="ts">
// replace this with import.meta.glob('/locales.json')
import localesStatuses from 'virtual:elk-locales'
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
      <tr v-for="({ title, translated, missing, total }, key) in localesStatuses" :key="key">
        <td>{{ title }}</td>
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
