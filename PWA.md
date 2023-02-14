# PWA

Elk provides a PWA (Progressive Web App) that can be installed on your desktop/device. This allows you to use Elk as a native app on your device, and it will work offline.

The main goal of the PWA is to provide a native app experience on mobile devices with Web Push Notifications and Web Share Target API capabilities.

Web Share Target will allow you to share content from other apps to Elk in mobile browsers.

## Mobile Support

Some mobile browsers will allow you to install the PWA as a native app, and some others will only allow you to add the PWA to your home screen.

If you're using a mobile browser that supports the PWA installation, you will see a banner at the bottom of the screen with the option to install the PWA.

If the browser also supports `beforeinstallprompt` event, ElK will show a prompt (on the right aside on wide screens, or at top on small screens) to allow you to install the PWA directly.

If the browser doesn't support the PWA installation, check following entries:

### Safari iOS

Right now, you cannot use Web Push Notifications on Safari mobile browsers, since it doesn't support the Web Push API yet at operating system level.

You can check the status of the Push API on Safari mobile browsers on [this page](https://caniuse.com/notifications).

Visit also [this site](https://firt.dev/notes/pwa-ios/) to check the status of PWA Capabilities on Safari mobile browsers.

To install a Progressive Web App (PWA) on Safari, follow these steps:
- Tap the "Share" icon at the bottom of the screen.
- Scroll down and tap "Add to Home Screen".
- Customize the name of the app (if desired) and tap "Add".
- The PWA should now appear on your home screen.

### Firefox

To install a Progressive Web App (PWA) on Firefox, follow these steps:
- Look for the install button or icon, usually located in the address bar or in a prompt that appears on the screen.
- Click on the install button or icon and follow the prompts to complete the installation.
- If you don't see an install button or icon, you can look for the PWA in the Firefox menu. Click on the three horizontal lines in the top/bottom right corner of the browser window to open the menu, then click on "Install" option.

### Chromium based browsers

To install a Progressive Web App (PWA) on Chromium based browsers, such as Google Chrome, Microsoft Edge, or Brave, follow these steps:
- Click on the menu button (three vertical dots) at the top right corner of the screen.
- Select "Install Elk as app" or "Install Elk to Home screen".
- Customize the name of the app (if desired) and click "Install" or "Add".
- The PWA should now appear on your device's home screen or in your app drawer.

## PWA Configuration in Elk project

By default, Elk will enable the PWA integration, but can be disabled by setting `VITE_DEV_PWA` to `false` in your `.env` file.

You can find the configuration options for the PWA in the [config/pwa.ts](./config/pwa.ts) module.

### PWA Web Manifest

Right now, there is no support for web manifest internationalization and theme color in any browser, we're using a custom module to generate web manifests for theme color and language variants.

Elk will generate 2 web manifests per locale, one for light theme and one for dark theme.

You can check web manifest generation on [modules/pwa/i18n.ts](./modules/pwa/i18n.ts) module.

### PWA UI Components

Elk will provide a set of UI components to allow you to customize the PWA installation prompt on browsers with `beforeinstallprompt` support.

You can find the PWA installation prompt in the [PwaInstallPrompt](./components/pwa/PwaInstallPrompt.client.vue) component: will be shown on the right aside on wide screens, or at top on small screens.

Elk is using prompt for update strategy, so the PWA prompt for update will be shown only if there is a new version of Elk available.

On small screens, the PWA prompt for update will be shown as a button on the head, you can find it in [PwaBadge](./components/pwa/PwaBadge.client.vue) component.

On wide screens, the PWA prompt for update will be shown as a prompt on the right aside, you can find it in [PwaPrompt](./components/pwa/PwaPrompt.client.vue) component.

PWA prompt for update will take preference over PWA installation prompt, so if there is a new version of Elk available, the PWA prompt for update will be shown instead of the PWA installation prompt.

All previous UI components don't have any logic, all them will use the logic provided by the [PWA plugin](./plugins/pwa.client.ts).

### Debugging PWA in development

To debug the PWA in development, you will need to run `dev:pwa` or `dev:mocked:pwa` script.

Running one of previous scripts will start a development server with the PWA enabled: you can review the web manifests and debug the service worker in your browser, use any Chromium based browser, since we're registering the service worker using `type: 'module'`.

You can debug Web Push Notifications in desktop and mobile browser and Web Share Target in your mobile device, using the same URL as the development server.

Right now, we can only debug on Android Chrome mobile browsers:
- Web Push Notifications: you don't need to install de PWA, just enable the notifications in the browser on notifications page or web push notifications settings page.
- Web Share Target: you need to install the PWA, and then you can share content from other apps to Elk.

### Debugging PWA in mobile browsers

To debug the PWA service worker in your mobile browser, you will need to:
1) Enable development options in your Android device:
  - Go to "Settings" on your device.
  - Scroll down to "About phone" and tap it.
  - Locate the "Build number" and tap it repeatedly (usually 7 times) until you see a message saying that you have enabled developer options.
  - Go back to "Settings" and you should now see "Developer options" listed.
  - Tap on "Developer options" and you can enable various settings such as USB debugging, mock locations, and more.
2) Connect your Android device to your computer using a USB cable.
3) Enable USB debugging in your Android device:
  - Go to "Settings" on your device.
  - Scroll down to "Developer options" and tap it.
  - Enable "USB debugging".
  - Confirm the prompt on your device to allow USB debugging.
  - Open Chrome/Edge browser in your device.
4) Open Chrome on your computer and go to `chrome://inspect/#devices`.
  - Enter `http://localhost:5314` in the open tab and click Open button.
  - Elk application should be listed in the "Remote Target" section after a few seconds (navigate to any page).
  - Click on the "Inspect" button to open the DevTools.
5) Remember to remove the service worker from your device browser using dev tools once you finish testing the service worker:
  - Go to `Application > Storage`, you should check following checkboxes:
    - Application: [x] Unregister service worker
    - Storage: [x] Local and session storage [x] IndexedDB
    - Cache: [x] Cache storage and [x] Application cache
  - Click on Clear site data button
  - Go to `Application > Service Workers` and check the current service worker is missing or has the status deleted or reduntant.
