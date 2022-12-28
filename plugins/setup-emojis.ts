export default defineNuxtPlugin(() => {
  if (process.server)
    return

  const promise = import('@emoji-mart/data').then(r => r.default)
  import('emoji-mart').then(r => r.init({
    data: () => promise,
  }))
})
