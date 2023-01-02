# Elk
*A nimble Mastodon web client*

<p align="center">
  <a href="https://elk.zone" target="_blank" rel="noopener noreferrer">
    <img width="180" height="180" src="./logo.svg" alt="Vite logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://chat.elk.zone"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
  <a href="https://pr.new/elk-zone/elk"><img src="https://developer.stackblitz.com/img/start_pr_dark_small.svg" alt="Start new PR in StackBlitz Codeflow"></a>
</p>
<br/>

# Elk is in early alpha ⚠️ 

It is already quite usable, but it isn't ready for wide adoption yet. We recommend you to use if if you would like to help us building it. We appreciate your feedback and contributions. Check out the [Open Issues](https://github.com/elk-zone/elk/issues) and jump in the action. Join the [Elk discord server](https://chat.elk.zone) to chat with us and learn more about the project.

The client is deployed to [elk.zone](https://elk.zone), you can share screenshots on social media but we prefer you avoid sharing this URL directly until the app is more polished. Feel free to share the URL with your friedns and invite others you think could be interested in helping to improve Elk.

## Sponsors

We want to thanks the generous sponsoring and help of:

<div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
  <div style="border-radius: 20px; background-color: #22272e; width: 500px; height: 100px; display: grid; align-items: center; justify-items: center;">
    <a href="https://nuxtlabs.com/" target="_blank" rel="noopener noreferrer" >
      <img src="https://user-images.githubusercontent.com/11247099/210197359-83cb4232-3647-4400-8ac8-b68909ed4516.svg" alt="NuxtLabs" height="50">
    </a>
  </div>
  <div style="border-radius: 20px; background-color: #22272e; width: 500px; height: 100px; display: grid; align-items: center; justify-items: center;">
    <a href="https://stackblitz.com/" target="_blank" rel="noopener noreferrer"  style="transform: translate(0, 5px);">
      <img src="https://user-images.githubusercontent.com/11247099/210197445-61a76633-2907-47cc-8a9a-f5e1669552fa.svg" alt="StackBlitz" height="70">
    </a>
  </div>
</div>

And all the companies and individuals sponsoring Elk Team members. If you're enjoying the app, consider sponsoring our team:

- [Anthony Fu](https://github.com/sponsors/antfu)
- [Daniel Roe](https://github.com/sponsors/danielroe)
- [三咲智子 Kevin Deng](https://github.com/sponsors/sxzz)
- [Patak](https://github.com/sponsors/patak-dev)

We would also appreciate sponsoring other contributors to the Elk project. If someone helps you solve an issue or implement a feature you wanted, supporting them would help make this project and OS more sustainable.

## Contributing

We're really excited that you're interested in contributing to Elk! Before submitting your contribution, please read through the following guide.

### Online

You can use [StackBlitz CodeFlow](https://stackblitz.com/codeflow) to fix bugs or implement features. You'll also see a CodeFlow button on PRs to review them without a local setup. Once the elk repo has been cloned in CodeFlow, the dev server will start automatically and print the URL to open the App. You should receive a prompt in the bottom-right suggesting to open it in the Editor or in another Tab. To learn more, check out the [CodeFlow docs](https://developer.stackblitz.com/codeflow/what-is-codeflow). 

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/elk-zone/elk)

### Local Setup

Clone the repository and run on the root folder:

```
pnpm i
pnpm run dev
```

`Warning`: you will need `corepack` enabled, check out the [Elk Contributing Guide](./CONTRIBUTING.md) for a detailed guide on how to set up the project locally.

We recommend installing [ni](https://github.com/antfu/ni#ni), that will use the right package manager in each of your projects. If `ni` is installed, you can instead run:

```
ni
nr dev
```

### Testing

Elk uses [Vitest](https://vitest.dev). You can run the test suite with:

```
nr test
```

## Stack

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Nuxt](https://nuxt.com/) - The Intuitive Web Framework
- [Vue](https://vuejs.org/) - The Progressive JavaScript Framework
- [VueUse](https://vueuse.org/) - Collection of Vue Composition Utilities
- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using
- [Vue Macros](https://vue-macros.sxzz.moe/) - More macros and syntax sugar for Vue
- [UnoCSS](https://uno.antfu.me/) - The instant on-demand atomic CSS engine
- [Iconify](https://github.com/iconify/icon-sets#iconify-icon-sets-in-json-format) - Iconify icon sets in JSON format
- [Masto.js](https://neet.github.io/masto.js) - Mastodon API client in TypeScript
- [shiki](https://shiki.matsu.io/) - A beautiful Syntax Highlighter
- [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) - Prompt for update and push notifications

## License

[MIT](./LICENSE) &copy; 2022-PRESENT Elk contributors
