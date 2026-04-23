<script setup>
import navItems from '@/navigation/horizontal'
import horizontalAdmin from '@/navigation/horizontalAdmin'
import horizontalAssis from '@/navigation/horizontalAssis'
import horizontalEmp from '@/navigation/horizontalEmp'
import horizontalManagement from '@/navigation/horizontalManagement'
import horizontalSupervisor from '@/navigation/horizontalSupervisor'


import { themeConfig } from '@themeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { HorizontalNavLayout } from '@layouts'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref(null)

watch([
  isFallbackStateActive,
  refLoadingIndicator,
], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()
  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION
const userData = useCookie('userData')
let menus = (userData.value.position_name =='พนักงาน'
            ?horizontalEmp:(userData.value.position_name =='Supervisor')
            ?horizontalSupervisor:(userData.value.position_name =='Assistant Management')
            ?horizontalAssis:(userData.value.position_name =='Management')
            ?horizontalManagement:(userData.value.position_name =='Admin')
            ?horizontalAdmin:navItems);

// let menus = (userData.value.role=='admin'?navItems:navItems2);

console.log(menus);
console.log(userData.value.position_name);
</script>

<template>
  <HorizontalNavLayout :nav-items="menus">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink
        to="/"
        class="app-logo d-flex align-center gap-x-3"
      >
        <VNodeRenderer :nodes="themeConfig.app.logo" />

        <h1 class="app-title font-weight-bold leading-normal text-xl text-capitalize">
          <!-- {{ themeConfig.app.title }} -->
        </h1>
      </RouterLink>
      <VSpacer />

      <!-- <NavSearchBar trigger-btn-class="ms-lg-n3" /> -->

      <!-- <NavBarI18n
        v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
        :languages="themeConfig.app.i18n.langConfig"
      /> -->

      <NavbarThemeSwitcher />
      <!-- <NavbarShortcuts /> -->
      <!-- <NavBarNotifications class="me-2" /> -->
      <UserProfile />
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Suspense
        :timeout="0"
        @fallback="isFallbackStateActive = true"
        @resolve="isFallbackStateActive = false"
      >
        <Component :is="Component" />
      </Suspense>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <TheCustomizer />
  </HorizontalNavLayout>
</template>
