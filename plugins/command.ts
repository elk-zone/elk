export default defineNuxtPlugin(() => {
  return {
    provide: {
      command: provideCommandRegistry(),
    },
  }
})
