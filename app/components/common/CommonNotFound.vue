<template>
  <div flex="~ col" items-center>
    <div i-ri:forbid-line text-10 mt10 mb2 />
    <div text-lg>
      <slot>{{ $t('common.not_found') }}</slot>
    </div>
  </div>
</template>
