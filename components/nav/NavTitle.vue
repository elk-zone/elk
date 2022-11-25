<template>
  <!-- Use external to force refresh page and jump to top of timeline -->
  <NuxtLink flex items-center text-2xl gap-2 to="/" external>
    <img aria-label="Elk Logo" src="/logo.svg" w-10 h-10>
    <div>
      Elk <sup text-sm italic op50 mt-1>alpha</sup>
    </div>
  </NuxtLink>
</template>
