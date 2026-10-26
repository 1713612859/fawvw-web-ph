// Marks <html data-hydrated> once the app is interactive. Automated tests wait for this
// before clicking, so they never act on the static HTML before Vue has taken over.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:suspense:resolve', () => {
    document.documentElement.dataset.hydrated = 'true'
  })
})
