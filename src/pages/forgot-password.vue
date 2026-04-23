
<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <!-- <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1> -->
    </div>
  </RouterLink>

  <VRow
    class="auth-wrapper bg-surface"
    no-gutters
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background w-100 me-0 setbg" :style="'background-image: url('+Artboard4BGApp_0+');'">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 6.25rem;"
        >
          <VImg
            max-width="613"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <!-- <img
          class="auth-footer-mask"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        > -->
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center setbg"
      :style="'background-image: url('+Artboard5BGApp_0+');'"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <div
            class="d-flex align-center justify-center w-100 h-100"
            style="padding-inline: 6.25rem;"
          >
            <VImg
              max-width="100%"
              :src="logo"
              class="auth-illustration mb-2"
            />
          </div>
          <h4 class="text-h4 mb-1">
            Forgot Password? 🔒
          </h4>
          <p class="mb-0">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="handleSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="forgot_email"
                  autofocus
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                  :rules="[requiredValidator]"
                />
                <span style="color: red">{{ emailError }}</span>
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                >
                  Send Reset Password
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    size="20"
                    class="me-1 flip-in-rtl"
                  />
                  <span>Back to login</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import logo from '@images/pages/logo.png';
import Artboard4BGApp_0 from '@images/pages/Artboard4BGApp_0.png';
import Artboard5BGApp_0 from '@images/pages/Artboard5BGApp_0.png';
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png';
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png';
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png';
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png';

import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const email = ref('')
// const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
</script>
<script lang="ts">
import apiService from '@/services/api'
import Swal from 'sweetalert2'

interface AdminData {
  id: number
  profile_img: string
  role: string
  email: string
}

export default {
  data: () => ({
    forgot_email: null,
    emailError: '',
  }),
  methods: {
    validateEmail(email: any) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailPattern.test(email)
    },
    handleSubmit() {
      this.emailError = ''

      // Validate email
      if (!this.validateEmail(this.forgot_email)) {
        this.emailError = 'รูปแบบอีเมลไม่ถูกต้อง'
      }

      // If no errors, submit the form
      if (!this.emailError) {
        // alert("Form submitted successfully!");
        this.send_forgot_email()
        // Here, you can proceed with form submission logic, e.g., calling an API.
      }
    },
    async send_forgot_email() {
      const vm = this
      var formdata = {
        email: vm.forgot_email,
      }
      console.log(vm.forgot_email)
      if (vm.forgot_email) {
        await apiService
          .send_forgot_email(formdata)
          .then((response: any) => {
            if (response.data.status == 'Email sent') {
              Swal.fire({
                title: 'รีเซ็สรหัสผ่านเรียบร้อย',
                text: 'กรุณาตรวจสอบอีเมลของท่าน',
                icon: 'success',
                timer: 2500,
                showConfirmButton: false,
              })
            } else {
              Swal.fire({
                title: 'ไม่พบอีเมล',
                text: 'กรุณาตรวจสอบใหม่อีกครั้ง',
                icon: 'warning',
                timer: 2500,
                showConfirmButton: false,
              })
            }
          })
          .catch((error: any) => {
            console.error('Error :', error)
          })
      } else {
        Swal.fire({
          title: 'กรุณาระบุ Email',
          icon: 'warning',
          timer: 2500,
          showConfirmButton: false,
        })
      }
    },
  },
  mounted() {
    this.$nextTick(function () {
      
    })
  },
}
</script>
<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
<style scoped>
  .setbg{
    /* height: 500px; */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  @media (max-width: 540px) {
    .auth-logo {
      inset-block-start: auto;
      inset-inline-start: 32%;
    }
  }
</style>
