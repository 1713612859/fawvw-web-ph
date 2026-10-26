<template>
  <div class="flex min-h-screen flex-col">
    <PrototypeBanner />
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <FloatingContact />
    <CookieBanner />
  </div>
</template>
