<script setup lang="ts">
const emit = defineEmits(['close'])

/* TODOs:
 * - define shortcuts as const + render dynamically
 * - I18n
 */
</script>

<template>
  <div px-3 sm:px-5 py-2 sm:py-4 md:max-w-200 flex="~ col gap-4" relative max-h-screen>
    <button btn-action-icon absolute top-1 sm:top-2 right-1 sm:right-2 m1 aria-label="Close" @click="emit('close')">
      <div i-ri:close-fill />
    </button>
    <h2 text-xl font-700 mb3>
      Keyboard shortcuts
    </h2>
    <div mb2 leading-loose>
      <div>
        <span mr-2>Shortcut help</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>?</code>
      </div>
      <div>
        <span mr-2>Command mode</span>
        <!-- TODO: diff Mac vs. Non-Mac (command vs. strg) -->
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>cmd</code>
        <span mx1 text-sm op80>+</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>/</code>
      </div>
      <div>
        <span mr-2>Compose</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>c</code>
      </div>
      <div>
        <span mr-2>Compose</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>c</code>
        <span mx1 text-sm op80>or</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>n</code>
      </div>
      <h3 font-700 mt-3>
        Navigation
      </h3>
      <div>
        <span mr-2>Home</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>g</code>
        <span mx1 text-sm op80>then</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>h</code>
      </div>
      <div>
        <span mr-2>Notifications</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>g</code>
        <span mx1 text-sm op80>then</span>
        <code class="px2 py-0.5 " rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>n</code>
      </div>
    </div>
  </div>
</template>
