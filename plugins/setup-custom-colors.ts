const inject = `
(() => {
  const update = () => {
    const colors = localStorage.getItem('elk-custom-colors');
    if (!colors) return;

    Object.entries(JSON.parse(colors)).forEach(([k, v]) => {
      document.documentElement.style.setProperty(\`--c-\${k}-custom\`, v);
    })
  }

  window.addEventListener('storage', (e) => {
    update();
  });

  update();
})();
`

export default defineNuxtPlugin(() => {
  useHead({
    script: [{ innerHTML: inject }],
  })
})
