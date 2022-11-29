<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div p8 flex="~ col gap4">
    <div text-sm text-secondary>
      {{ t('sys.sign_in_desc') }}
    </div>
    <button class="btn-solid text-center" @click="openSigninDialog()">
      {{ t('sys.sign_in') }}
    </button>
  </div>
</template>
