<script setup lang="ts">
const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<template>
  <div my-8 px-3 sm:px-8 md:max-w-200 flex="~ col gap-4" relative>
    <button btn-action-icon absolute top--8 right-0 m1 aria-label="Close" @click="emit('close')">
      <div i-ri:close-line />
    </button>

    <img :alt="$t('app_logo')" src="/logo.svg" w-20 h-20 height="80" width="80" mxa class="rtl-flip">
    <h1 mxa text-4xl mb4>
      {{ $t('help.title') }}
    </h1>
    <p>
      {{ $t('help.desc_para1') }}
    </p>
    <p>
      <b text-primary>{{ $t('help.desc_highlight') }}</b>
      {{ $t('help.desc_para2') }}
    </p>
    <p>
      {{ $t('help.desc_para4') }}
      <NuxtLink font-bold text-primary href="https://github.com/elk-zone/elk" target="_blank">
        {{ $t('help.desc_para5') }}
      </NuxtLink>
      {{ $t('help.desc_para6') }}
    </p>
    {{ $t('help.desc_para3') }}
    <p flex="~ gap-2 wrap" mxa>
      <template v-for="team of elkTeamMembers" :key="team.github">
        <NuxtLink :href="`https://github.com/sponsors/${team.github}`" target="_blank" external rounded-full transition duration-300 border="~ transparent" hover="scale-105 border-primary">
          <img :src="`/avatars/${team.github}-100x100.png`" :alt="team.display" rounded-full w-15 h-15 height="60" width="60">
        </NuxtLink>
      </template>
    </p>
    <p italic flex justify-center w-full>
      <NuxtLink href="https://github.com/sponsors/elk-zone" target="_blank">
        <span text-xl font-script hover:text-primary transition duration-300>The Elk Team</span>
      </NuxtLink>
    </p>

    <button btn-solid mxa tabindex="2" @click="emit('close')">
      {{ $t('action.enter_app') }}
    </button>
  </div>
</template>
