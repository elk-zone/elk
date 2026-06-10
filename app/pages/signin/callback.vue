<script setup lang="ts">
definePageMeta({
  layout: 'none',
  middleware: 'auth',
})

const router = useRouter()

if (import.meta.client) {
  if (window.opener && !window.opener.closed) {
    // The plugin (0.setup-users.ts) is processing the token concurrently.
    // Give it a few seconds to write the user to shared localStorage, then close.
    // The main window polls popup.closed and reloads when this closes.
    setTimeout(() => {
      try {
        window.close()
      }
      catch {}
    }, 2500)
  }
  else {
    router.push('/home')
  }
}
</script>

<template>
  <div
    :style="{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif',
      background: 'var(--c-bg-base, #fafafa)',
      color: 'var(--c-text-base, #232323)',
    }"
  >
    <div style="text-align: center; padding: 0 2rem; max-width: 400px;">
      <div
        :style="{
          width: '48px',
          height: '48px',
          margin: '0 auto 1rem',
          border: '4px solid var(--c-border, #eee)',
          borderTopColor: 'var(--c-primary, #f5322d)',
          borderRadius: '50%',
          animation: 'omedia-spin 1s linear infinite',
        }"
      />
      <p style="font-size: 1.125rem; font-weight: 500; margin: 0;">
        Signing you in to Omedia…
      </p>
      <p style="font-size: 0.875rem; opacity: 0.6; margin: 0.5rem 0 0;">
        This window will close automatically.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes omedia-spin {
  to { transform: rotate(360deg); }
}
</style>
