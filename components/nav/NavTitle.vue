<script setup lang="ts">
const { env } = useBuildInfo()
const router = useRouter()
const back = ref<any>('')

const nuxtApp = useNuxtApp()

const onClickLogo = () => {
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
  <div flex justify-between>
    <NuxtLink
      flex items-end gap-4
      py2 px-5
      text-2xl
      select-none
      focus-visible:ring="2 current"
      to="/home"
      @click.prevent="onClickLogo"
    >
      <NavLogo shrink-0 aspect="1/1" sm:h-8 xl:h-10 class="rtl-flip" />
      <div hidden xl:block text-secondary>
        {{ $t('app_name') }} <sup text-sm italic mt-1>{{ env === 'release' ? 'alpha' : env }}</sup>
      </div>
    </NuxtLink>
    <div
      hidden xl:flex items-center me-8 mt-2
      :class="{ 'pointer-events-none op0': !back || back === '/', 'xl:flex': $route.name !== 'tag' }"
    >
      <NuxtLink
        :aria-label="$t('nav.back')"
        @click="$router.go(-1)"
      >
        <div i-ri:arrow-left-line class="rtl-flip" btn-text />
      </NuxtLink>
    </div>
  </div>
</template>
