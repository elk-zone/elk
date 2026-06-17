<script setup lang="ts">
const router = useRouter()
const back = ref<any>('')

const nuxtApp = useNuxtApp()

function onClickLogo() {
  nuxtApp.hooks.callHook('elk-logo:click')
}

onMounted(() => {
  back.value = router.options.history.state.back
})
router.afterEach(() => {
  back.value = router.options.history.state.back
})
</script>

<template>
  <div flex justify-between sticky top-0 bg-base z-1 py-4>
    <NuxtLink
      flex items-end gap-3
      py2 px-5
      text-2xl
      select-none
      focus-visible:ring="2 current"
      to="/home"
      @click.prevent="onClickLogo"
    >
      <span shrink-0 aspect="1/1" sm:h-8 xl:h-10 sm:w-8 xl:w-10 class="rtl-flip">
        <NavOmediaIcon w-full h-full />
      </span>
      <div v-show="isHydrated" hidden xl:block text-secondary>
        {{ $t('app_name') }}
      </div>
    </NuxtLink>
    <div hidden xl:flex items-center me-6 mt-2 gap-1>
      <CommonTooltip :content="$t('nav.back')" :distance="0">
        <button
          type="button"
          :aria-label="$t('nav.back')"
          btn-text p-3 :class="{ 'pointer-events-none op0': !back || back === '/', 'xl:flex': $route.name !== 'tag' }"
          @click="$router.go(-1)"
        >
          <div text-xl i-ri:arrow-left-line class="rtl-flip" />
        </button>
      </CommonTooltip>
    </div>
  </div>
</template>
