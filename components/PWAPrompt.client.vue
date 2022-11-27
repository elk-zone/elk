<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const online = useOnline()

const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    setInterval(async () => {
      if (r?.installing)
        return

      if (!online.value)
        return

      const resp = await fetch(swUrl, {
        cache: 'no-store',
        headers: {
          'cache': 'no-store',
          'cache-control': 'no-cache',
        },
      })

      if (resp?.status === 200)
        await r!.update()
    }, 60 * 60 * 1000 /* 1 hour */)
  },
})
const close = async () => {
  needRefresh.value = false
}

// TODO: remove once finished (comment out for styling the prompt)
// onMounted(() => {
//   setTimeout(() => {
//     needRefresh.value = true
//   }, 1000)
// })
</script>

<!-- TODO: remove shadow on mobile and position it above the bottom nav -->
<template>
  <div
    v-if="needRefresh"
    role="alertdialog"
    aria-labelledby="pwa-toast-title"
    aria-describedby="pwa-toast-description"
    animate animate-back-in-up md:animate-back-in-right
    z11
    fixed
    bottom-14 md:bottom-0 right-0
    m-4 p-4
    bg-base border="~ base"
    rounded
    text-left
    shadow
  >
    <h2 id="pwa-toast-title" sr-only>
      New Elk version available
    </h2>
    <div id="pwa-toast-message">
      New version available, click on reload button to update.
    </div>
    <div m-t4 flex="~ colum" gap-x="4">
      <button type="button" btn-solid text-sm px-2 py-1 text-center @click="updateServiceWorker()">
        Reload
      </button>
      <button type="button" btn-outline px-2 py-1 text-sm text-center @click="close">
        Close
      </button>
    </div>
  </div>
</template>
