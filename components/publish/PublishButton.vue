<template>
  <button color-primary btn-outline rounded-full ml-7 lg:ml-3 w-9 lg:w-auto font-bold py2 lg:py4 flex="~ gap2 center" @click="openPublishDialog()">
    <div i-ri:quill-pen-line />
    <span hidden lg:block>{{ $t('action.compose') }}</span>
  </button>
</template>
