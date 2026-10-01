<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const apiurl = import.meta.env.VITE_API_URL;
const router = useRouter()
const ability = useAbility()

// TODO: Get type from backend
const userData = useCookie('userData')

const logout = async () => {
  // 🌟 1. ล้างข้อมูลด้วย useCookie (วิธีของ Template)
  useCookie('accessToken').value = null
  useCookie('_accessToken').value = null // เผื่อกรณี Admin
  useCookie('refreshToken').value = null
  useCookie('_refreshToken').value = null
  useCookie('userAbilityRules').value = null
  userData.value = null

  // 🌟 2. ย้ำการลบ Cookie ด้วยคำสั่งของ Browser โดยตรง (เพื่อให้ชัวร์ว่าหายจากระบบ 100%)
  const cookiesToClear = ['accessToken', '_accessToken', 'refreshToken', '_refreshToken', 'userData', 'userAbilityRules'];
  cookiesToClear.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  // 🌟 3. เคลียร์ LocalStorage เผื่อมีหลงเหลือ
  localStorage.removeItem('accessToken');
  localStorage.removeItem('_accessToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('userAbilityRules');

  // 🌟 เพิ่มบรรทัดนี้ เพื่อลบ URL ตอน Logout
  localStorage.removeItem('apiBaseUrl');

  // Reset ability to initial ability
  ability.update([])

  // Redirect to login page
  await router.push('/login')
}

const userProfileList = [];
// const userProfileList = [
//   { type: 'divider' },
//   {
//     type: 'navItem',
//     icon: 'tabler-user',
//     title: 'Profile',
//     to: {
//       name: 'apps-user-view-id',
//       params: { id: 21 },
//     },
//   },
//   {
//     type: 'navItem',
//     icon: 'tabler-settings',
//     title: 'Settings',
//     to: {
//       name: 'pages-account-settings-tab',
//       params: { tab: 'account' },
//     },
//   },
//   {
//     type: 'navItem',
//     icon: 'tabler-file-dollar',
//     title: 'Billing Plan',
//     to: {
//       name: 'pages-account-settings-tab',
//       params: { tab: 'billing-plans' },
//     },
//     badgeProps: {
//       color: 'error',
//       content: '4',
//     },
//   },
//   { type: 'divider' },
//   {
//     type: 'navItem',
//     icon: 'tabler-currency-dollar',
//     title: 'Pricing',
//     to: { name: 'pages-pricing' },
//   },
//   {
//     type: 'navItem',
//     icon: 'tabler-question-mark',
//     title: 'FAQ',
//     to: { name: 'pages-faq' },
//   },
// ]
</script>

<template>
  <VBadge
    v-if="userData"
    dot
    bordered
    location="bottom right"
    offset-x="1"
    offset-y="2"
    color="success"
  >
    <VAvatar
      size="38"
      class="cursor-pointer"
      :color="!(userData && userData.picture) ? 'primary' : undefined"
      :variant="!(userData && userData.picture) ? 'tonal' : undefined"
    >
      <VImg
        v-if="userData && userData.picture"
        :src="apiurl+userData.picture || userData.avatar"
      />
      <VIcon
        v-else
        icon="tabler-user"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="240"
        location="bottom end"
        offset="12px"
      >
        <VList>
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  <VAvatar
                    :color="!(userData && userData.picture) ? 'primary' : undefined"
                    :variant="!(userData && userData.picture) ? 'tonal' : undefined"
                  >
                    <VImg
                      v-if="userData && userData.picture"
                      :src="apiurl+userData.picture || userData.avatar"
                    />
                    <VIcon
                      v-else
                      icon="tabler-user"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ userData.fullName || userData.username }}
            </VListItemTitle>
            <VListItemSubtitle>{{ userData.position_name }}</VListItemSubtitle>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                v-if="item.type === 'navItem'"
                :to="item.to"
              >
                <template #prepend>
                  <VIcon
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template
                  v-if="item.badgeProps"
                  #append
                >
                  <VBadge
                    rounded="sm"
                    class="me-3"
                    v-bind="item.badgeProps"
                  />
                </template>
              </VListItem>

              <VDivider
                v-else
                class="my-2"
              />
            </template>

            <div class="px-4 py-2">
              <VBtn
                block
                size="small"
                color="error"
                append-icon="tabler-logout"
                @click="logout"
              >
                Logout
              </VBtn>
            </div>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
