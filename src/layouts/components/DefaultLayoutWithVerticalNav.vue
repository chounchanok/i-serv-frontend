<script setup>
import navItems from '@/navigation/vertical'
import verticalAdmin from '@/navigation/verticalAdmin'
import verticalAssis from '@/navigation/verticalAssis'
import verticalEmp from '@/navigation/verticalEmp'
import verticalManagement from '@/navigation/verticalManagement'
import verticalSupervisor from '@/navigation/verticalSupervisor'


// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'


const router = useRouter()
const ability = useAbility()
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
            ?verticalEmp:(userData.value.position_name =='Supervisor')
            ?verticalSupervisor:(userData.value.position_name =='Assistant Management')
            ?verticalAssis:(userData.value.position_name =='Management')
            ?verticalManagement:(userData.value.position_name =='Admin')
            ?verticalAdmin:navItems);

// let menus = (userData.value.role=='admin'?navItems:navItems2);

console.log(menus);
console.log(userData.value.position_name);
</script>

<template>
  <VerticalNavLayout :nav-items="menus">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            size="26"
            icon="tabler-menu-2"
          />
        </IconBtn>
        
        <VSpacer />

        <NavBarNotifications class="me-2" />
        <NavbarThemeSwitcher class="me-2" />
        <UserProfile />
      </div>
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
  </VerticalNavLayout>
</template>
