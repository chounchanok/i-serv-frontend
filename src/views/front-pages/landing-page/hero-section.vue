<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import heroDashboardImgDark from '@images/front-pages/landing-page/hero-dashboard-dark.png'
import heroDashboardImgLight from '@images/front-pages/landing-page/hero-dashboard-light.png'
import heroElementsImgDark from '@images/front-pages/landing-page/hero-elements-dark.png'
import heroElementsImgLight from '@images/front-pages/landing-page/hero-elements-light.png'
import photoplus from '@images/front-pages/photo-plus.png'

import Artboard4BGApp_0 from '@images/pages/Artboard4BGApp_0.png'
import { useMouse } from '@vueuse/core'
import { useDisplay, useTheme } from 'vuetify'

import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const props = defineProps({ activeId: String })

definePage({ meta: { layout: 'blank' } })

const activeSectionId = ref()
const refHome = ref()
const refFeatures = ref()
const refTeam = ref()
const refContact = ref()
const refFaq = ref()

useIntersectionObserver([
  refHome,
  refFeatures,
  refTeam,
  refContact,
  refFaq,
], ([{ isIntersecting, target }]) => {
  if (isIntersecting)
    activeSectionId.value = target.id
}, { threshold: 0.25 })

const display = useDisplay()
const route = useRoute()
const router = useRouter()
const sidebar = ref(false)

watch(() => display, () => {
  return display.mdAndUp ? sidebar.value = false : sidebar.value
}, { deep: true })

const theme = useTheme()
const heroElementsImg = useGenerateImageVariant(heroElementsImgLight, heroElementsImgDark)
const heroDashboardImg = useGenerateImageVariant(heroDashboardImgLight, heroDashboardImgDark)
const { x, y } = useMouse({ touch: false })

const translateMouse = computed(() => {
  if (typeof window !== 'undefined') {
    const rotateX = ref((window.innerHeight - 2 * y.value) / 100)
    
    return { transform: `perspective(1200px) rotateX(${ rotateX.value < -40 ? -20 : rotateX.value }deg) rotateY(${ (window.innerWidth - 2 * x.value) / 100 }deg) scale3d(1,1,1)` }
  }
})
</script>

<template>
  <div>
    <VNavigationDrawer
      v-model="sidebar"
      width="275"
      disable-resize-watcher
    >
      <!-- Nav items -->
      <div>
        <div class="d-flex flex-column gap-y-4 pa-4">
          <RouterLink
            v-for="(item, index) in [
              {
                url:'/report/oos/add', 
                name:'OOS & Stock', 
              },
              {
                url:'/report/offtake/add', 
                name:'Offtake', 
              },{
                url:'/report/weeks/add', 
                name:'12 Weeks', 
              },{
                url:'/report/price/add', 
                name:'Price & Promotion', 
              },
            ]"
            :key="index"
            :to="item.url"
            class="nav-link font-weight-medium"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>

      <!-- Navigation drawer close icon -->
      <VIcon
        id="navigation-drawer-close-btn"
        icon="tabler-x"
        size="20"
        @click="sidebar = !sidebar"
      />
    </VNavigationDrawer>

    <!-- 👉 Navbar for desktop devices  -->
    <div class="front-page-navbar">
      <div class="front-page-navbar">
        <VAppBar
          :color="$vuetify.theme.current.dark ? 'rgba(var(--v-theme-surface),0.38)' : 'rgba(var(--v-theme-surface), 0.38)'"
          :class="y > 10 ? 'app-bar-scrolled' : [$vuetify.theme.current.dark ? 'app-bar-dark' : 'app-bar-light', 'elevation-0']"
          class="navbar-blur"
        >
          <!-- toggle icon for mobile device -->
          <IconBtn
            id="vertical-nav-toggle-btn"
            class="ms-n3 me-2 d-inline-block d-md-none"
            @click="sidebar = !sidebar"
          >
            <VIcon
              size="26"
              icon="tabler-menu-2"
              color="rgba(var(--v-theme-on-surface))"
            />
          </IconBtn>
          <!-- Title and Landing page sections -->
          <div class="d-flex align-center">
            <VAppBarTitle class="me-6">
              <RouterLink
                to="/"
                class="d-flex gap-x-4"
                :class="$vuetify.display.mdAndUp ? 'd-none' : 'd-block'"
              >
                <div class="app-logo">
                  <VNodeRenderer :nodes="themeConfig.app.logo" />
                  <h1 class="app-logo-title">
                    <!-- {{ themeConfig.app.title }} -->
                  </h1>
                </div>
              </RouterLink>
            </VAppBarTitle>

            <!-- landing page sections -->
            <div class="text-base align-center d-none d-md-flex">
              <RouterLink
                v-for="(item, index) in [
                  {
                    url:'/report/oos/add', 
                    name:'OOS & Stock', 
                  },
                  {
                    url:'/report/offtake/add', 
                    name:'Offtake', 
                  },{
                    url:'/report/weeks/add', 
                    name:'12 Weeks', 
                  },{
                    url:'/report/price/add', 
                    name:'Price & Promotion', 
                  },
                ]"
                :key="index"
                :to="item.url"
                class="nav-link font-weight-medium py-2 px-2 px-lg-4"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>

          <VSpacer />

          <div class="d-flex gap-x-4">
            <!--
              <a v-if="currentTabx=='compliance'" :href="apiurl+'/api/backend/excelcompliance/'+userData.id+'/'+store_id+'/'+user_id" target="_blank">
              <VBtn color="info" variant="elevated"
              rel="noopener noreferrer" class="responsive-btn">Export</VBtn>
              </a>
              <a v-if="currentTabx=='extra'" :href="apiurl+'/api/backend/excelcomplianceextra/'+userData.id+'/'+store_id_extra+'/'+user_id" target="_blank">
              <VBtn color="info" variant="elevated"
              rel="noopener noreferrer" class="responsive-btn">Export</VBtn>
              </a> 
            -->

            <VRow>
              <VCol
                v-if="userData.position_name != 'พนักงาน'"
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="startDate_select"
                  label="วันที่เริ่มต้น"
                  type="date"
                  density="compact"
                />
              </VCol>
              <VCol
                v-if="userData.position_name != 'พนักงาน'"
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="endDate_select"
                  label="วันที่สิ้นสุด"
                  type="date"
                  density="compact"
                />
              </VCol>
            </VRow>

            <div v-if="currentTabx=='compliance'">
              <VBtn
                color="info"
                variant="elevated"
                class="responsive-btn"
                @click="exportData('compliance')"
              >
                Export
              </VBtn>
            </div>

            <div v-if="currentTabx=='extra'">
              <VBtn
                color="info"
                variant="elevated"
                class="responsive-btn"
                @click="exportData('extra')"
              >
                Export
              </VBtn>
            </div>

            <VBtn
              variant="elevated"
              rel="noopener noreferrer"
              class="responsive-btn"
              :disabled="isBtnDisabled"
              @click="testclick"
            >
              บันทึก
            </VBtn>
          </div>
        </VAppBar>
      </div>
    </div>
      
    <div
      id="home"
      :style="{ background: 'rgb(var(--v-theme-surface))' }"
    >
      <div id="landingHero">
        <div
          class="landing-hero"
          :style="'background-image: url('+Artboard4BGApp_0+');background-size: cover;'"
        >
          <VContainer>
            <!--
              <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
              <div class="d-flex flex-column justify-center">
              <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
                    
              <div class="position-relative ms-2">
              <div class="section-title text-white">
              Compliance
              </div>
              </div>
              </h4>
              </div>

              <div class="d-flex gap-4 align-center flex-wrap">
              <VBtn>บันทึก</VBtn>
              </div>
              </div> 
            -->
              
            <VCard>
              <!-- ปุ่มแท็บ -->
              <VBtnToggle
                v-model="currentTabx"
                divided
                class="mb-4"
                density="comfortable"
                style="width: 100% !important;"
              >
                <VBtn
                  value="compliance"
                  style="width: 50% !important;"
                >
                  <VIcon
                    icon="tabler-book-2"
                    class="mr-1"
                  />
                  Compliance
                </VBtn>
                <VBtn
                  value="extra"
                  style="width: 50% !important;"
                >
                  <VIcon
                    icon="tabler-tag"
                    class="mr-1"
                  />
                  Extra
                </VBtn>
              </VBtnToggle>

              <VCardText>
                <div v-if="currentTabx === 'compliance'">
                  <VCard class="mb-6">
                    <VCardText>
                      <VRow style="padding: 15px;">
                        <VCol
                          v-if="userData.position_name != 'พนักงาน'"
                          cols="12"
                          md="3"
                        >
                          <AppAutocomplete 
                            v-model="user_id" 
                            label="พนักงาน"
                            placeholder="เลือก พนักงาน" 
                            :items="user_for_admin" 
                            item-title="newname"
                            item-value="id"
                            clearable 
                            clear-icon="tabler-x"
                            @update:model-value="getall_select_user"
                          />
                        </VCol>
                        <VCol
                          cols="12"
                          md="4"
                          class="long-text-dropdown"
                        >
                          <AppAutocomplete 
                            v-model="store_id" 
                            label="Store"
                            placeholder="เลือก Store" 
                            :items="datalist" 
                            item-title="store_name_report"
                            item-value="store_id"
                            clearable 
                            clear-icon="tabler-x"
                            @update:model-value="set_group_id"
                          />
                          <!--
                            <AppAutocomplete 
                            v-model="group_id" 
                            label="ร้านค้า"
                            placeholder="เลือกร้านค้า" 
                            :items="datalist" 
                            item-title="name"
                            item-value="id"
                            clearable 
                            clear-icon="tabler-x"
                            @update:modelValue="set_group_id"/> 
                          -->
                        </VCol>

                        <VCol
                          cols="12"
                          md="2"
                        >
                          <AppDateTimePicker 
                            v-model="datesave" 
                            label="วันที่ทำรายงาน" 
                            placeholder="เลือกวันที่" 
                            @change="set_group_id_date"
                          />
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                  <VCard class="mb-6">
                    <VDivider />

                    <VCardText
                      v-if="Newlist.complianceDetails"
                      style="padding-block: 5px;padding-inline: 0;"
                    >
                      <VRow style="padding: 15px;">
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <template
                            v-for="(value3,index3) in Newlist.complianceDetails"
                            :key="index3"
                          >
                            <VRow :style="(index3%2) == 0 ? 'border-bottom: 1px solid #000;' : 'background-color: #f9f9f9;border-bottom: 1px solid #000;'">
                              <VCol
                                cols="12"
                                md="1"
                                class="d-flex align-self-end text-center"
                                style="justify-content: center;"
                              >
                                <template v-if="Array.isArray(value3?.mapProductStoreList?.product?.picture) && value3.mapProductStoreList.product.picture.length > 0">
                                  <a 
                                    v-for="(pic, index) in value3.mapProductStoreList.product.picture"
                                    :key="index"
                                    :data-fancybox="'gallery-'+value3.mapProductStoreList.id"
                                    :href="pic.url"
                                    :data-caption="pic.name || 'no image'"
                                    style="display: inline-block; margin: 0 2px;"
                                  >
                                    <img 
                                      :src="pic.url" 
                                      class="card-img-top"
                                      :alt="pic.name || 'no image'" 
                                      style="block-size: 50px; inline-size: 50px; object-fit: cover;"
                                    >
                                  </a>
                                </template>

                                <div
                                  v-else-if="value3.mapStoreComplianceList && value3.mapStoreComplianceList.product"
                                  class="img-width"
                                >
                                  <a 
                                    :href="'https://test.iservreport.com/' + value3.mapStoreComplianceList.product.picture" 
                                    data-fancybox="single-image"
                                  >
                                    <img 
                                      :src="'https://test.iservreport.com/' + value3.mapStoreComplianceList.product.picture" 
                                      class="card-img-top" 
                                      style="block-size: 50px; inline-size: 50px; object-fit: cover;" 
                                    >
                                  </a>
                                </div>

                                <div
                                  v-else
                                  class="img-width"
                                >
                                  <img 
                                    src="https://test.iservreport.com/images/picture/noimage.jpg" 
                                    class="card-img-top" 
                                    style="block-size: 50px; inline-size: 50px; object-fit: cover;" 
                                  >
                                </div>
                              </VCol>

                              <VCol
                                cols="12"
                                md="3"
                                style="display: flex;align-items: center;"
                              >
                                ชื่อรายการ: {{ value3.mapStoreComplianceList.mapStoreCompliance.name }}<br>
                                {{ (index3+1) }}. {{ value3.mapStoreComplianceList.product.name }} {{ (value3.mapStoreComplianceList.product.flavor?'('+value3.mapStoreComplianceList.product.flavor+')':'') }}
                              </VCol>
                                      
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.status_area" 
                                  label="สถานะพื้นที่"
                                  placeholder="สถานะพื้นที่" 
                                  :items="status_list" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  @update:model-value="check_status_area(index3)"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.placement_point_id" 
                                  label="บริเวณพื้นที่"
                                  placeholder="บริเวณพื้นที่" 
                                  :items="PlacementPointlist" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  :disabled="value3.status_area==1"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.rental_area_unit_id" 
                                  label="พื้นที่"
                                  placeholder="พื้นที่" 
                                  :items="groupedRentalAreaUnit" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  :disabled="value3.status_area==0 || value3.status_area==1"
                                  @update:model-value="get_unit(index3)"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppTextField 
                                  v-model="value3.qty" 
                                  placeholder="0" 
                                  type="number" 
                                  label="จำนวน" 
                                  step="0.01"
                                  :min="0" 
                                  :disabled="value3.status_area==0 || value3.status_area==1"
                                  @keydown="preventInvalidKeys"
                                  @keyup="change_data(i)"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.rental_area_unit_name" 
                                  label="หน่วย"
                                  placeholder="หน่วย" 
                                  :items="value3.user_list" 
                                  item-title="unit"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  :disabled="value3.user_list.length === 0 || value3.status_area==0 || value3.status_area==1"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.substitute_products_id" 
                                  label="สินค้าทดแทน"
                                  placeholder="สินค้าทดแทน" 
                                  :items="substitute_products_list" 
                                  item-title="newname"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  chips
                                  multiple
                                  closable-chips
                                  :disabled="value3.user_list.length === 0 || value3.status_area!=2"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.posm_id" 
                                  label="สื่อส่งเสริมการขาย"
                                  placeholder="สื่อส่งเสริมการขาย" 
                                  :items="posmlist" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  :disabled="value3.status_area==1" 
                                />
                              </VCol>
                              <VCol
                                v-if="value3.status_area == 1"
                                cols="12"
                                md="4"
                              >
                                <AppAutocomplete 
                                  v-model="value3.reason_for_not_getting_space_id" 
                                  label="สาเหตุ"
                                  placeholder="สาเหตุ" 
                                  :items="reasonlist" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppTextField
                                  v-model="value3.note"
                                  placeholder=""
                                  type="text"
                                  label="หมายเหตุ"
                                />
                              </VCol>

                              <VCol
                                cols="6"
                                md="1"
                                class="d-flex align-self-center"
                              >
                                <a href="#forselect1">
                                  <VIcon
                                    size="30"
                                    icon="tabler-edit"
                                    @click="show_preview2(index3,value3.id)"
                                  />
                                </a>
                              </VCol>

                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.competitor_area" 
                                  label="พื้นที่คู่แข่ง"
                                  placeholder="พื้นที่คู่แข่ง" 
                                  :items="status_list2" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  @update:model-value="get_all_Competitor_filter(i)"
                                />
                              </VCol>
                              <VCol
                                v-if="value3.competitor_area == 0"
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.competitor_id" 
                                  label="แบรนด์คู่แข่ง"
                                  placeholder="แบรนด์คู่แข่ง" 
                                  :items="Competitorlist" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                />
                              </VCol>
                                      
                              <VCol
                                v-if="value3.competitor_area == 0"
                                cols="6"
                                md="3"
                              >
                                <DemoDateTimePickerRange
                                  v-model="value3.daterange"
                                  label="ช่วงวันที่แบรนด์คู่แข่ง"
                                  placeholder="ช่วงวันที่แบรนด์คู่แข่ง"
                                />
                              </VCol>
                            </VRow>
                            <VCard
                              v-if="row_id == value3.id"
                              id="forselect1"
                              :style="'background-image: url('+Artboard4BGApp_0+');background-position: center;background-repeat: no-repeat;background-size: cover;margin-top:1em;margin-bottom:1em;'"
                            >
                              <VCardTitle class="d-flex justify-space-between align-center">
                                <span
                                  class="text-h6"
                                  style="color: white;font-size: 1.5375rem !important;padding-block-start: 10px;"
                                >อัพโหลดรูปภาพรายสัปดาห์</span>
                                <span
                                  class="text-h6"
                                  style="color: white;cursor: pointer;font-size: 1.5375rem !important;padding-block-start: 10px;"
                                  @click="row_id = null"
                                >X</span>
                              </VCardTitle>

                              <VCardText>
                                <VContainer>
                                  <!-- วนลูป Week1 - Week4 -->
                                  <VRow
                                    v-for="(weekImages, weekIndex) in imagePreviews"
                                    :key="'week' + weekIndex"
                                    style="padding: 5px;border: 0.5px solid rgb(196, 196, 196);background: white;"
                                  >
                                    <VCol
                                      cols="12"
                                      style=" display: flex;align-items: center;justify-content: space-between;background-color: #ffb400;color: white;gap: 5px;"
                                    >
                                      <h4 style="color: white;">
                                        Week {{ weekIndex + 1 }}
                                      </h4>
                                      <div class="d-flex align-center gap-3">
                                        <VImg
                                          :height="30"
                                          :width="30"
                                          :src="photoplus"
                                          class="mx-auto"
                                          style="filter: invert(1) brightness(2);"
                                          @click="selectFiles(weekIndex)"
                                        />
                                        <input
                                          :id="'fileInput' + weekIndex"
                                          type="file"
                                          multiple
                                          accept="image/png, image/jpeg, image/jpg, image/gif"
                                          style="display: none;"
                                          @change="(event) => handleFiles(event, weekIndex, row_key)"
                                        >
                                      </div>
                                    </VCol>

                                    <!-- แสดงรูปภาพที่อัพโหลด -->
                                    <VCol
                                      v-for="(image, imageIndex) in weekImages"
                                      :key="imageIndex"
                                      cols="12"
                                      sm="6"
                                      md="3"
                                      lg="2"
                                    >
                                      <div
                                        class="position-relative"
                                        :style="'cursor: pointer;background-image: url('+ image.url +');background-size: cover;background-position: center center;background-repeat: no-repeat;width: 218px;height: 227px;opacity: 1;transform: translate3d(0px, 0px, 0px);'"
                                      >
                                        <button
                                          class="delete-button csseye"
                                          :data-id="image.id"
                                          :data-name="image.name"
                                          @click="show_preview1(weekImages,imageIndex)"
                                        >
                                          <VIcon
                                            size="30"
                                            icon="tabler-eye"
                                          />
                                        </button>
                                        <button
                                          class="delete-button"
                                          :data-id="image.id"
                                          :data-name="image.name"
                                          style="position: absolute;z-index: 99999; width: 20px; border: none; background: red; color: white; cursor: pointer; font-size: 18px; inset-block-start: 10px; inset-inline-end: 10px;"
                                          @click="complianceDetailsdeleteImage(image.id, image.filename, imageIndex, weekIndex,row_key)"
                                        >
                                          X
                                        </button>
                                      </div>
                                      <!-- 📌 ปรับ `AppDateTimePicker` ให้แสดงตำแหน่งถูกต้อง -->
                                      <AppDateTimePicker 
                                        v-model="image.datecreate" 
                                        label="วันที่ถ่ายรูป" 
                                        placeholder="เลือกวันที่"
                                        attach="body"
                                        :menu-props="{ contentClass: 'custom-datepicker-menu', eager: true }"
                                      />
                                      <span style="font-size: 12px;font-weight: bold;">วันที่อัพเดท : </span><span style="font-size: 12px;">{{ image.dateupdate }} น.</span>
                                    </VCol>
                                  </VRow>
                                </VContainer>
                              </VCardText>
                            </VCard>
                          </template>
                        </VCol> 
                      </VRow> 
                    </VCardText>

                    <!--
                      <VRow style="padding: 10px 0px;">
                      <VCol cols="12" md="1" class="d-flex align-self-end text-center" style="justify-content: center;">
                      <div class="img-width">
                      <img :src="noimg" class="card-img-top" style="width: 50px;height: 50px;"/>
                      </div>
                      </VCol>
                      <VCol cols="12" md="3" style="display: flex;align-items: center;">
                      1. xxxxx
                      </VCol>
                      <VCol cols="12" md="1" class="d-flex align-self-end">
                      <AppTextField placeholder="" type="text" label="สถานะพื้นที่" />
                      </VCol>
                      <VCol cols="12" md="5">
                      <AppTextField placeholder="" type="text" label="ตำแหน่ง" />
                      </VCol>
                          
                      <VCol cols="6" md="1" class="d-flex align-self-end">
                      <AppTextField placeholder="" type="text" label="พื้นที่" />
                      </VCol>
                      <VCol cols="6" md="1" class="d-flex align-self-end">
                      <AppTextField placeholder="" type="text" label="จำนวน" />
                      </VCol>
                      <VCol cols="6" md="1" class="d-flex align-self-end">
                      <AppTextField placeholder="" type="text" label="ประเภท" />
                      </VCol>
                      <VCol cols="6" md="1" class="d-flex align-self-end">
                      <AppTextField placeholder="" type="text" label="สินค้าทดแทน" />
                      </VCol>
                      <VCol cols="6" md="1" class="d-flex align-self-end">
                      <AppTextField placeholder="" type="text" label="สื่อส่งเสริมการขาย" />
                      </VCol>
                      <VCol cols="6" md="1" class="d-flex align-self-end">
                      ภาพ
                      </VCol>
                      <VCol cols="6" md="1" class="d-flex align-self-end">
                      <AppTextField placeholder="" type="text" label="หมายเหตุ" />
                      </VCol>
                      <VCol cols="6" md="1" class="d-flex align-self-end">
                      <AppSelect
                      aria-label="พื้นที่คู่แข่ง"
                      placeholder="พื้นที่คู่แข่ง"
                      :items="status_list2"
                      item-title="name"
                      item-value="id"
                      clearable
                      clear-icon="tabler-x"
                      />
                      </VCol>
                      </VRow> 
                    -->
                  </VCard>
                </div>

                <div
                  v-else-if="currentTabx === 'extra'"
                  style="padding: 4px;"
                >
                  <VCard class="mb-6">
                    <VCardText>
                      <VRow style="padding: 15px;">
                        <VCol
                          v-if="userData.position_name != 'พนักงาน'"
                          cols="12"
                          md="3"
                        >
                          <AppAutocomplete 
                            v-model="user_id" 
                            label="พนักงาน"
                            placeholder="เลือก พนักงาน" 
                            :items="user_for_admin" 
                            item-title="newname"
                            item-value="id"
                            clearable 
                            clear-icon="tabler-x"
                            style="font-size: 12px;"
                            @update:model-value="getall_select_user_extra"
                          />
                        </VCol>
                        <VCol
                          cols="12"
                          md="4"
                          class="long-text-dropdown"
                        >
                          <AppAutocomplete 
                            v-model="store_id_extra" 
                            label="Store"
                            placeholder="เลือก Store" 
                            :items="datalist" 
                            item-title="store_name_report"
                            item-value="store_id"
                            clearable 
                            clear-icon="tabler-x"
                            style="font-size: 12px;"
                            @update:model-value="set_group_id_extra"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="2"
                        >
                          <AppDateTimePicker 
                            v-model="datesave_extra" 
                            label="วันที่ทำรายงาน" 
                            placeholder="เลือกวันที่" 
                            style="font-size: 12px;"
                            @change="set_group_id_extra_date"
                          />
                        </VCol>
                        <VCol
                          v-if="store_id_extra"
                          cols="12"
                          md="2"
                          style="    display: flex;align-items: end;justify-content: center;"
                        >
                          <VBtn @click="addrow">
                            เพิ่มพื้นที่
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                  <VCard class="mb-6">
                    <VDivider />

                    <VCardText
                      v-if="NewlistExtra.complianceextraDetails"
                      style="padding-block: 5px;padding-inline: 0;"
                    >
                      <VRow style="padding: 15px;">
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <template
                            v-for="(value3,index3) in NewlistExtra.complianceextraDetails"
                            :key="index3"
                          >
                            <VRow :style="(index3%2) == 0 ? 'border-bottom: 1px solid #000;' : 'background-color: #f9f9f9;border-bottom: 1px solid #000;'">
                              <VCol
                                cols="12"
                                md="2"
                                class="long-text-dropdown"
                              >
                                <AppAutocomplete
                                  v-model="value3.substitute_products_id"
                                  label="สินค้า"
                                  placeholder="เลือก สินค้า"
                                  :items="productlist"
                                  item-title="new_name"
                                  item-value="id"
                                  clearable
                                  clear-icon="tabler-x"
                                  chips
                                  multiple
                                  closable-chips
                                >
                                  <template #item="{ item, props }">
                                    <VListItem
                                      v-bind="props"
                                      class="custom-list-item"
                                    >
                                      <VListItemTitle class="custom-list-title">
                                        {{ item.new_name }}
                                      </VListItemTitle>
                                    </VListItem>
                                  </template>
                                </AppAutocomplete>
                              </VCol>

                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.placement_point_id" 
                                  label="บริเวณพื้นที่"
                                  placeholder="บริเวณพื้นที่" 
                                  :items="PlacementPointlist" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.rental_area_unit_id" 
                                  label="พื้นที่"
                                  placeholder="พื้นที่" 
                                  :items="groupedRentalAreaUnit" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  @update:model-value="get_unitExtra(index3)"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppTextField 
                                  v-model="value3.qty" 
                                  placeholder="0" 
                                  type="number"
                                  step="0.01" 
                                  :min="0" 
                                  label="จำนวน"
                                  @keydown="preventInvalidKeys"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.rental_area_unit_name" 
                                  label="หน่วย"
                                  placeholder="หน่วย" 
                                  :items="value3.user_list" 
                                  item-title="unit"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                />
                              </VCol>
                                      
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppAutocomplete 
                                  v-model="value3.posm_id" 
                                  label="สื่อส่งเสริมการขาย"
                                  placeholder="สื่อส่งเสริมการขาย" 
                                  :items="posmlist" 
                                  item-title="name"
                                  item-value="id"
                                  clearable 
                                  clear-icon="tabler-x"
                                  chips
                                  multiple
                                  closable-chips
                                />
                              </VCol>
                              <VCol
                                cols="6"
                                md="3"
                              >
                                <DemoDateTimePickerRange
                                  v-model="value3.daterange"
                                  label="ช่วงวันที่"
                                  placeholder="ช่วงวันที่"
                                />
                              </VCol>
                              <VCol
                                cols="12"
                                md="2"
                              >
                                <AppTextField
                                  v-model="value3.note"
                                  placeholder=""
                                  type="text"
                                  label="หมายเหตุ"
                                />
                              </VCol>
                              <VCol
                                cols="6"
                                md="1" 
                                class="d-flex align-self-center" 
                                style="align-items: end; justify-content: center;"
                                :style="(value3.not_sell==true || value3.not_sell=='Y'?'display: none !important;':'display: flex;')"
                              >
                                <a href="#forselect2">
                                  <VIcon
                                    size="30"
                                    icon="tabler-edit"
                                    @click="show_preview2Extra(index3,index3)"
                                  />
                                </a>
                                <IconBtn>
                                  <VIcon
                                    icon="tabler-trash"
                                    style="color: red;"
                                    @click="delete_rowExtra_confirm(value3,index3)"
                                  />
                                </IconBtn>
                              </VCol>
                            </VRow>
                                    
                            <VCard
                              v-if="row_idExtra == index3"
                              id="forselect2"
                              :style="'background-image: url('+Artboard4BGApp_0+');background-position: center;background-repeat: no-repeat;background-size: cover;margin-top:1em;margin-bottom:1em;'"
                            >
                              <VCardTitle class="d-flex justify-space-between align-center">
                                <span
                                  class="text-h6"
                                  style="color: white;font-size: 1.5375rem !important;padding-block-start: 10px;"
                                >อัพโหลดรูปภาพรายสัปดาห์</span>
                                <span
                                  class="text-h6"
                                  style="color: white;cursor: pointer;font-size: 1.5375rem !important;padding-block-start: 10px;"
                                  @click="row_idExtra = null"
                                >X</span>
                              </VCardTitle>

                              <VCardText>
                                <VContainer>
                                  <!-- วนลูป Week1 - Week4 -->
                                  <VRow
                                    v-for="(weekImages, weekIndex) in imagePreviewsExtra"
                                    :key="'week' + weekIndex"
                                    style="padding: 5px;border: 0.5px solid rgb(196, 196, 196);background: white;"
                                  >
                                    <VCol
                                      cols="12"
                                      style=" display: flex;align-items: center;justify-content: space-between;background-color: #ffb400;color: white;gap: 5px;"
                                    >
                                      <h4 style="color: white;">
                                        Week {{ weekIndex + 1 }}
                                      </h4>
                                      <div class="d-flex align-center gap-3">
                                        <VImg
                                          :height="30"
                                          :width="30"
                                          :src="photoplus"
                                          class="mx-auto"
                                          style="filter: invert(1) brightness(2);"
                                          @click="selectFilesExtra(weekIndex)"
                                        />
                                        <input
                                          :id="'fileInputExtra' + weekIndex"
                                          type="file"
                                          multiple
                                          accept="image/png, image/jpeg, image/jpg, image/gif"
                                          style="display: none;"
                                          @change="(event) => handleFilesExtra(event, weekIndex, row_keyExtra)"
                                        >
                                      </div>
                                    </VCol>

                                    <!-- แสดงรูปภาพที่อัพโหลด -->
                                    <VCol
                                      v-for="(image, imageIndex) in weekImages"
                                      :key="imageIndex"
                                      cols="12"
                                      sm="6"
                                      md="3"
                                      lg="2"
                                    >
                                      <!-- <div class="position-relative" :style="'cursor: pointer;background-image: url(https://test.iservreport.com/'+image.filename+');background-size: cover;background-position: center center;background-repeat: no-repeat;width: 218px;height: 227px;opacity: 1;transform: translate3d(0px, 0px, 0px);'"> -->
                                              
                                      <div
                                        class="position-relative"
                                        :style="{
                                          cursor: 'pointer',
                                          backgroundImage: image.url ? `url('${image.url}')` : `url('https://test.iservreport.com/${image.filename}')`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center center',
                                          backgroundRepeat: 'no-repeat',
                                          width: '218px',
                                          height: '227px',
                                          opacity: 1,
                                          transform: 'translate3d(0px, 0px, 0px)',
                                        }"
                                      >
                                        <button
                                          class="delete-button csseye"
                                          :data-id="image.id"
                                          :data-name="image.name"
                                          @click="show_preview1Extra(weekImages,imageIndex)"
                                        >
                                          <VIcon
                                            size="30"
                                            icon="tabler-eye"
                                          />
                                        </button>
                                        <button
                                          class="delete-button"
                                          :data-id="image.id"
                                          :data-name="image.name"
                                          style="position: absolute;z-index: 99999; width: 20px; border: none; background: red; color: white; cursor: pointer; font-size: 18px; inset-block-start: 10px; inset-inline-end: 10px;"
                                          @click="complianceDetailsdeleteImageExtra(image.id, image.filename, imageIndex, weekIndex,row_keyExtra)"
                                        >
                                          X
                                        </button>
                                      </div>
                                      <!-- 📌 ปรับ `AppDateTimePicker` ให้แสดงตำแหน่งถูกต้อง -->
                                      <AppDateTimePicker 
                                        v-model="image.datecreate" 
                                        label="วันที่ถ่ายรูป" 
                                        placeholder="เลือกวันที่"
                                        attach="body"
                                        :menu-props="{ contentClass: 'custom-datepicker-menu', eager: true }"
                                      />
                                      <span style="font-size: 12px;font-weight: bold;">วันที่อัพเดท : </span><span style="font-size: 12px;">{{ image.dateupdate }} น.</span>
                                    </VCol>
                                  </VRow>
                                </VContainer>
                              </VCardText>
                            </VCard>
                          </template>
                        </VCol> 
                      </VRow> 
                    </VCardText>
                  </VCard>
                </div>
              </VCardText>
            </VCard>
          </VContainer>
        </div>
      </div>
    </div>

      
    <VDialog
      v-model="isDialogVisible"
      fullscreen
      persistent
      max-width="none"
      width="100vw"
    >
      <!-- Dialog close button -->
      <DialogCloseBtn
        style="background-color: rgb(231 231 231) !important;inset-block-start: 1.5em;inset-inline-end: 2em;"
        @click="isDialogVisible = false"
      />
    </VDialog>

    <VDialog
      v-model="isDialogVisibleExtra"
      fullscreen
      persistent
      max-width="none"
      width="100vw"
    >
      <!-- Dialog close button -->
      <DialogCloseBtn
        style="background-color: rgb(231 231 231) !important;inset-block-start: 1.5em;inset-inline-end: 2em;"
        @click="isDialogVisibleExtra = false"
      />
    </VDialog>
  </div>
</template>


<script>
import apiService from '@/services/api'
import Swal from 'sweetalert2'

export default {
  data: () => ({
    dis_date: true,
    currentTabx: 'item-1',
    currentTab: 'item-1',
    breadcrumbs: [],

    isDialogVisible: false,
    isDialogVisibleExtra: false,

    // imagePreviews: [],
    imagePreviews: [[], [], [], []],
    imagePreviewsExtra: [[], [], [], []],
    compliance_list: [{
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ไม่ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้ทดแทน",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }, {
      "product_name": "Product 1",
      "status": "ได้",
      "position": "ทางเดินหน้าแคชเชียร์",
      "area": "4 way",
      "qty": "1",
      "row_type": "4 way",
      "product_substitute": "Product 6",
      "point_of_sale": "Standee",
      "picture": "",
      "note": "test",
    }],
    status_list: [
      {
        id: 0,
        name: 'ได้',
      },
      {
        id: 1,
        name: 'ไม่ได้',
      },
      {
        id: 2,
        name: 'ได้ทดแทน',
      },
    ],
    status_list2: [
      {
        id: 0,
        name: 'ได้',
      },
      {
        id: 1,
        name: 'ไม่ได้',
      },
    ],
    position_list: [
      {
        title: 'ทางเดินหน้าแคชเชียร์',
        value: 'ทางเดินหน้าแคชเชียร์',
      },
    ],
    area_list: [
      {
        title: '4 way',
        value: '4 way',
      },
    ],
    row_type_list: [
      {
        title: '4 way',
        value: '4 way',
      },
    ],
    product_substitute_list: [
      {
        title: 'Product 6',
        value: 'Product 6',
      },
    ],
    select_store: '',
    userData: {},
    date_now_create: new Date(),
    date_now: null,
    datesave: new Date().getFullYear() + '-' + 
                      String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                      String(new Date().getDate()).padStart(2, '0'),
    datesave_extra: new Date().getFullYear() + '-' + 
                      String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                      String(new Date().getDate()).padStart(2, '0'),
    maxDate: new Date().toISOString().split("T")[0], // วันที่ปัจจุบัน
    minDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 วันก่อนหน้า
    currentMonth: new Date().toLocaleString('default', { month: '2-digit' }),
    currentYear: new Date().getFullYear(),
    specificDisabledDates: [],
    groupedData: [],
    groupedData2: [],
    date_end: new Date(),
    datalist: [],
    user_id: null,
    Productlist: [],
    Productlist_old: [],
    group_id: null,
    datePickerConfig: {},
    datePickerKey: 0,
    rowdata: [{
      product_name: '',
      amount: '',
      note: '',
    }, {
      product_name: '',
      amount: '',
      note: '',
    }, {
      product_name: '',
      amount: '',
      note: '',
    }],
    show_p: false,
    items: [
      {
        title: 'เลือก',
        value: '',
      },
      {
        title: 'ร้านค้า 1',
        value: '1',
      },
      {
        title: 'ร้านค้า 2',
        value: '2',
      },
      {
        title: 'ร้านค้า 3',
        value: '3',
      },
    ],
    MapProductStore: [],
    PlacementPoint: [],

    storelist: [],
    Newlist: [],
    NewlistExtra: {
      complianceDetails: [],
    },
    PlacementPointlist: [],
    groupedRentalAreaUnit: [],
    unitlist: [],
    reasonlist: [],
    Competitorlist: [],
    posmlist: [],
    substitute_products_list: [],
    row_id: null,
    store_id: null,
    store_id_extra: null,
    row_key: null,

    row_idExtra: null,
    row_keyExtra: null,

    productlist: [],
    user_for_admin: [],

    // ✅ ไม่ต้องใช้ ref() ใน data ของ Options API
    startDate_select: new Date().toISOString().slice(0, 10),
    endDate_select: new Date().toISOString().slice(0, 10),
    apiurl: import.meta.env.VITE_API_URL,
  }),
  computed: {
    buttonColor() {
      const vm = this

      console.log(vm.color_active2)
      console.log(vm.color_active3)
      
      return (vm.color_active > 0  || vm.color_active2==1 || vm.color_active3==1? 'primary' : 'secondary')
    },
    filteredGroupedData() {
      return this.filterGroupedData(this.groupedData)
    },
    filteredGroupedData2() {
      return this.filterGroupedData(this.groupedData2)
    },
  },
  watch: {
    date_now(newDate) {
      const selectedDate = new Date(newDate)
      const minDate = new Date(this.minDate)
      const maxDate = new Date(this.maxDate)

      if (selectedDate < minDate) {
        this.date_now = this.minDate // ตั้งค่าเป็น minDate หากเลือกย้อนหลังเกิน 7 วัน
      } else if (selectedDate > maxDate) {
        this.date_now = this.maxDate // ตั้งค่าเป็น maxDate หากเลือกวันที่อนาคต
      }
    },
    specificDisabledDates: {
      handler() {
        this.updateDatePickerConfig() // เรียกฟังก์ชันเพื่ออัปเดต config เมื่อ specificDisabledDates เปลี่ยนแปลง
      },
      immediate: true, // เรียกใช้งานทันทีเมื่อโหลดครั้งแรก
    },
  },
  mounted(){

    this.$nextTick(function(){
      const userData = useCookie('userData')

      this.userData = userData.value
      this.apiurl = import.meta.env.VITE_API_URL
      console.log(this.userData)
      this.getall()
      this.updateDatePickerConfig()
      this.get_user_for_admin()

      // window.addEventListener('beforeunload', function (e) {
      //   // Custom message to be displayed in the dialog
      //   const message = "Are you sure you want to leave? Changes you made may not be saved.";

      //   // Set the returnValue property of the event to the message (for compatibility)
      //   e.returnValue = message; 

      //   // Return the message (some browsers may ignore the message)
      //   return message;
      // });
      // const observer = new MutationObserver(() => {
      //     document.querySelectorAll('.nav-link').forEach(element => {
      //         // ตรวจสอบว่า event listener มีอยู่แล้วหรือไม่
      //         if (!element.hasAttribute('data-confirm-added')) {
      //             element.addEventListener('click', (event) => {
      //                 alert('ข้อมูลของคุณจะไม่ได้บันทึกหากเปลี่ยนเมนู');
      //             });

      //             // ทำเครื่องหมายว่าได้เพิ่ม event listener แล้ว
      //             element.setAttribute('data-confirm-added', 'true');
      //         }
      //     });
      // });

      // เริ่มสังเกตการณ์การเปลี่ยนแปลงใน body หรือ container หลัก
      // observer.observe(document.body, {
      //     childList: true,
      //     subtree: true
      // });
    })
  },
  methods: {
    exportData(type) {
      // ✅ เข้าถึง data ด้วย this.ชื่อตัวแปร
      if (!this.startDate_select || !this.endDate_select) {
        alert('กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด')
        
        return
      }

      let baseUrl = `${this.apiurl}/api/backend/`
      if (type === 'extra') {
        baseUrl += `excelcomplianceextra/${this.userData.id}/${this.store_id_extra || 'null'}/${this.user_id || 'null'}`
      } else if (type === 'compliance') {
        baseUrl += `excelcompliance/${this.userData.id}/${this.store_id || 'null'}/${this.user_id || 'null'}`
      } else {
        return
      }

      // ✅ แก้ไข URL ให้ส่งเป็น Query Parameters (?key=value) ซึ่งเข้ากับ Backend ที่เคยทำไว้
      const finalUrl = `${baseUrl}/${this.startDate_select}/${this.endDate_select}`
        
      console.log("Exporting to URL:", finalUrl)

      window.open(finalUrl, '_blank')
    },
    preventInvalidKeys(e) {
      const invalidKeys = ['-', '+', 'e', 'E', ',']
      if (invalidKeys.includes(e.key)) {
        e.preventDefault()
      }
    },
    testclick(){
      console.log(this.currentTabx)
      this.isBtnDisabled = true
      if(this.currentTabx == 'compliance'){
        this.save_Compliance_confirm()
      }else{
        this.save_Compliance_confirmExtra()
      }
        
    },
    addrow(){
      const vm = this
      
      this.NewlistExtra.complianceextraDetails.push({
        id: null,
        product_id: null,
        placement_point_id: null,
        rental_area_unit_name: null,
        qty: null,
        rental_area_unit_id: null,
        posm_id: null,
        reason_for_not_getting_space_id: null,
        daterange: null,
        note: null,
        imageDetails: [{
          files: [],
          week: 1,
        }, {
          files: [],
          week: 2,
        }, {
          files: [],
          week: 3,
        }, {
          files: [],
          week: 4,
        }],
      })
      console.log(this.NewlistExtra.complianceextraDetails)
    },
    calculateWeekRange(startDate) {
      const endDate = new Date(startDate)

      endDate.setDate(startDate.getDate() + 6) // เพิ่ม 6 วันสำหรับ 1 สัปดาห์

      const format = date =>
        `${date.getDate()}/${date.getMonth() + 1}`

      return `${format(startDate)} - ${format(endDate)}`
    },
    get_notsell(k){
      const vm = this

      console.log(vm.Productlist.ComplianceDetails[k].not_sell)
      vm.Productlist.ComplianceDetails[k].qty = 0
        
      if (k < 0 || k >= vm.Productlist_old.ComplianceDetails.length) return
      if (vm.Productlist_old.ComplianceDetails[k].not_sell_old != vm.Productlist.ComplianceDetails[k].not_sell) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    async getall_select_user(){
      this.store_id = null
      this.Newlist = []
      this.getall()
    },
    async getall_select_user_extra(){
      this.store_id_extra = null
      this.NewlistExtra = []
      this.getall()
    },
    async getall(){
      try {
        const form = {
          group_customer_id: this.userData.group_customer_id,
          user_id: this.userData.id,
          select_user_id: this.user_id,
          user_code: this.userData.code,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_store_user2(form)

        this.datalist = response.data.data.filter(x => x.account_name != null && x.store_code != null && x.account_type_name != null && x.store_name != null && x.name_in_thai != null)
        this.datalist.forEach((item, index) => {
          this.userData.group_customer_id = item.group_customer_id
          item.store_name_report = item.account_name+' '+item.store_code+' '+item.account_type_name+' '+item.store_name+' '+item.name_in_thai

          // item.store_name_report = item.account_name+item.branch_name+item.province_name;
        })

        // const form = {
        //   user_id: this.userData.id,
        //   select_user_id: this.user_id,
        //   area_manager: this.userData.area_manager,
        //   area_supervisor: this.userData.area_supervisor,
        //   position_name: this.userData.position_name,
        //   group_customer_id: this.userData.group_customer_id
        // };
        // const response = await apiService.get_all_MapStoreCompliance(form);
        // this.datalist = response.data.data;
        // this.datalist.forEach((item, index) => {
        //   // this.datalist[index].Active = item.isActive == 'Y' ? true : false;
        //   // this.datalist[index].id = item.store.id;
        //   this.datalist[index].name = item.store.store_name_report_full;
        //   this.datalist[index].new_name = item.store.account.name+','+item.store.store_code+','+item.store.store_name;
        // });
          
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_user_for_admin(){
      try {
        const form = {
          group_customer_id: this.userData.group_customer_id,
          user_id: this.userData.id,
          user_code: this.userData.code,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_user_for_admin(form)

        this.user_for_admin = response.data.data
        this.user_for_admin.forEach((item, index) => {
          item.newname = item.code+' '+item.name+' '+item.last_name
        })
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async set_group_id(){
      this.get_all_Compliance_date2()
      this.dis_date = false
    },
    async set_group_id_date(){
      if(this.store_id){
        this.get_all_Compliance_date2()
        this.dis_date = false
      }else{
        Swal.fire({
          title: 'กรุณาเลือก Store!',
          icon: 'warning',
          confirmButtonText: 'OK',
        })
      }
    },
    async set_group_id_extra(){
      this.get_all_Compliance_date_extra()
      this.dis_date = false
    },
    async set_group_id_extra_date(){
      if(this.store_id_extra){
        this.get_all_Compliance_date_extra()
        this.dis_date = false
      }else{
        Swal.fire({
          title: 'กรุณาเลือก Store!',
          icon: 'warning',
          confirmButtonText: 'OK',
        })
      }
    },
    async get_all_Compliance_date2(){
      const vm = this
      if(this.store_id){
        try {
          const dateTime = new Date()
          const dateOnly = new Date(dateTime).toISOString().split('T')[0]

          const form = {
            store_id: this.store_id,
            datenow: (this.datenow?this.datenow:dateOnly),
            datesave: (this.datesave?this.datesave:dateOnly),
            user_id: this.userData.id,
            position_name: this.userData.position_name,
          }

          const response = await apiService.get_all_Compliance(form)
          if(!response.data.data){
            Swal.fire({
              title: response.data.message,
              icon: 'warning',
              confirmButtonText: 'OK',
            })
            this.Newlist = []
          }else{
            this.Newlist = response.data.data
            if(this.userData.position_name == 'SuperAdmin'){
              this.userData.group_customer_id = this.Newlist.store.group_customer_id
            }
            vm.get_all_PlacementPoint()
            vm.get_all_rental_area_unit()
            vm.get_all_reason_filter()
            vm.get_all_posm_filter()
            vm.get_all_product_filter()
              
              
            // console.log(vm.datalist);
            // console.log(vm.store_id);
            // vm.get_product_by_groupcustomerid(vm.datalist,vm.store_id);
            this.Newlist.complianceDetails.forEach((item, index) => {
              // if(item.rental_area_unit_id > 0){
              item.old_data = item
              item.substitute_products_id = item.substitute_products_id && item.substitute_products_id !== "0"
                ? String(item.substitute_products_id).split(",").map(id => Number(id.trim())) // ✅ แปลง String เป็น Array of Numbers
                : null // ✅ ถ้าเป็น 0 หรือ null ให้เป็น null
              //item.substitute_products_id = item.substitute_products_id!=0?item.substitute_products_id:null;
              item.posm_id = item.posm_id!=0?item.posm_id:null
              item.competitor_area = item.competitor_area
              if(item.competitor_area == 0){
                vm.get_all_Competitor_filter()
              }
              item.reason_for_not_getting_space_id = item.reason_for_not_getting_space_id!=0?item.reason_for_not_getting_space_id:null
              item.competitor_id = item.competitor_id!=0?item.competitor_id:null
              item.note = item.note!='null'?item.note:null
              item.previews = []
              if(item){
                if(item.picture){
                  if(item.picture.length > 0){
                    item.previews = item.picture
                  }
                }
              }

              //   vm.get_unit(index);
              // }
              // if(item.rental_area_unit_name > 0){
              //   vm.get_unit2(item.rental_area_unit_name);
              // }
            })
            console.log(vm.Newlist)
              
              
          }
        } catch (error) {
          console.error('Error:', error)
        }
      }else{
        this.Newlist = []
      }
        
    },
    async get_all_Compliance_date_extra(){
      const vm = this
      if(this.store_id_extra){
        try {
          const dateTime = new Date()
          const dateOnly = new Date(dateTime).toISOString().split('T')[0]

          const form = {
            store_id: this.store_id_extra,
            datenow: (this.datenow?this.datenow:dateOnly),
            datesave: (this.datesave_extra?this.datesave_extra:dateOnly),
            user_id: this.userData.id,
            position_name: this.userData.position_name,
          }

          const response = await apiService.get_all_Compliance2(form)
          if(response.data.data){
            this.NewlistExtra = response.data.data
            if(this.userData.position_name == 'SuperAdmin'){
              // this.userData.group_customer_id = this.NewlistExtra.store.group_customer_id
            }
          }
          vm.get_all_PlacementPoint()
          vm.get_all_rental_area_unitExtra()
          vm.get_all_reason_filter()
          vm.get_all_posm_filter()
          vm.get_product_by_groupcustomerid()
          if(response.data.data){
              
            this.NewlistExtra.complianceextraDetails.forEach((item, index) => {
              item.old_data = item
              item.substitute_products_id = item.substitute_products_id && item.substitute_products_id !== "0"
                ? String(item.substitute_products_id).split(",").map(id => Number(id.trim())) // ✅ แปลง String เป็น Array of Numbers
                : null // ✅ ถ้าเป็น 0 หรือ null ให้เป็น null
                // item.posm_id = item.posm_id!=0?item.posm_id:null;
              item.posm_id = item.posm_id && item.posm_id !== "0"
                ? String(item.posm_id).split(",").map(id => Number(id.trim())) // ✅ แปลง String เป็น Array of Numbers
                : null // ✅ ถ้าเป็น 0 หรือ null ให้เป็น null
              item.product_id = item.product_id!=0?item.product_id:null
              item.competitor_area = item.competitor_area
              if(item.competitor_area == 0){
                vm.get_all_Competitor_filter()
              }
              item.reason_for_not_getting_space_id = item.reason_for_not_getting_space_id!=0?item.reason_for_not_getting_space_id:null
              item.competitor_id = item.competitor_id!=0?item.competitor_id:null
              item.note = item.note!='null'?item.note:null
              item.previews = []
              if(item){
                if(item.picture){
                  if(item.picture.length > 0){
                    item.previews = item.picture
                  }
                }
              }
            })
          }
            
          console.log(vm.NewlistExtra)
        } catch (error) {
          console.error('Error:', error)
        }
      }else{
          
        this.NewlistExtra = {
          complianceDetails: [],
        }
      }
        
    },
    async get_product_by_groupcustomerid(){
      const vm = this
      if(this.userData.group_customer_id){
        const response = await apiService.get_product_by_groupcustomerid(this.userData.group_customer_id)

        vm.productlist = response.data.data
        vm.productlist.forEach((item, index) => {
          item.new_name = item.name+' '+(item.flavor?'('+item.flavor+')':'')
        })
      }else{
        vm.productlist = []
      }
    },
    async get_all_Compliance_date_extra_bk(){
      const vm = this
      try {
        const dateTime = new Date()
        const dateOnly = new Date(dateTime).toISOString().split('T')[0]

        const form = {
          store_id: this.store_id,
          datenow: (this.date_now?this.date_now:dateOnly),
        }

        const response = await apiService.get_all_Compliance_date2(form)

        this.NewlistExtra = response.data.data
        vm.get_all_PlacementPoint()
        vm.get_all_rental_area_unitExtra() 
        vm.get_all_reason_filter()
        vm.get_all_posm_filter()
        vm.get_all_product_filter()
          
        this.NewlistExtra.complianceextraDetails.forEach((item, index) => {
          // if(item.rental_area_unit_id > 0){
          item.old_data = item
          item.substitute_products_id = item.substitute_products_id!=0?item.substitute_products_id:null
          item.posm_id = item.posm_id!=0?item.posm_id:null
          item.competitor_area = item.competitor_area
          if(item.competitor_area == 0){
            vm.get_all_Competitor_filter()
          }
          item.reason_for_not_getting_space_id = item.reason_for_not_getting_space_id!=0?item.reason_for_not_getting_space_id:null
          item.competitor_id = item.competitor_id!=0?item.competitor_id:null
          item.note = item.note!='null'?item.note:null
          item.previews = []
          if(item){
            if(item.picture){
              if(item.picture.length > 0){
                item.previews = item.picture
              }
            }
          }
        })
        console.log(vm.NewlistExtra)
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_all_Compliance() {
      const vm = this

      this.color_active = 0
      this.color_active2 = 0
      this.color_active3 = 0
      try {
        if (this.group_id) {
          const form = {
            group_id: this.group_id,
            datenow: this.date_now,
            datesave: this.datesave,
            msl: (this.msl?'Y':'N'),
            user_id: this.userData.id,
          }

          const response = await apiService.get_all_Compliance(form)
          var data = response.data.data
          var Productlist = []
          var Productlist_old = []
          Productlist = data
          Productlist_old = data
          this.specificDisabledDates = response.data.specificDisabledDates // อัปเดต specificDisabledDates แบบเรียลไทม์
          var groupedData = response.data.groupedData
          var groupedData2 = response.data.groupedData2
            
          if (typeof groupedData === 'object' && groupedData !== null) {
            Object.keys(groupedData).forEach(key => {
              const groupedItem = groupedData[key]
                
              // ตรวจสอบว่า groupedItem เป็น Object
              if (typeof groupedItem === 'object' && groupedItem !== null) {
                Object.keys(groupedItem).forEach(subKey => {
                  const subItems = groupedItem[subKey]
                    
                  // ตรวจสอบว่า subItems เป็น Array
                  if (typeof subItems === 'object' && subItems !== null) {
                      
                    Object.keys(subItems).forEach(subKey2 => {
                      // ดำเนินการเพิ่ม item เข้า testform2
                      const item = subItems[subKey2]
                        
                      if (Array.isArray(item)) {
                        item.forEach(nestedItem => {
                          nestedItem.previews = []
                          if(nestedItem){
                            if(nestedItem.picture_cut){
                              if(nestedItem.picture_cut.length > 0){
                                nestedItem.previews = nestedItem.picture_cut
                              }
                            }
                          }
                        })
                      } else {
                          
                      }
                    })
                  }
                })
              }
            })
          }
          if (typeof groupedData2 === 'object' && groupedData2 !== null) {
            Object.keys(groupedData2).forEach(key => {
              const groupedItem = groupedData2[key]
                
              // ตรวจสอบว่า groupedItem เป็น Object
              if (typeof groupedItem === 'object' && groupedItem !== null) {
                Object.keys(groupedItem).forEach(subKey => {
                  const subItems = groupedItem[subKey]
                    
                  // ตรวจสอบว่า subItems เป็น Array
                  if (typeof subItems === 'object' && subItems !== null) {
                      
                    Object.keys(subItems).forEach(subKey2 => {
                      // ดำเนินการเพิ่ม item เข้า testform2
                      const item = subItems[subKey2]
                        
                      if (Array.isArray(item)) {
                        item.forEach(nestedItem => {
                          nestedItem.previews = []
                          if(nestedItem){
                            if(nestedItem.picture_cut){
                              if(nestedItem.picture_cut.length > 0){
                                nestedItem.previews = nestedItem.picture_cut
                              }
                            }
                          }
                        })
                      } else {
                          
                      }
                    })
                  }
                })
              }
            })
          }

          this.groupedData = groupedData
          this.groupedData2 = groupedData2
            
          // let ComplianceDetails = Productlist.ComplianceDetails;
          // ComplianceDetails.forEach((item, index) => {
              
          //   item.stock_old = item.stock;
          //   item.note_old = item.note;
          //   item.previews = [];
          //   if(item.picture_cut.length > 0){
          //     item.previews = item.picture_cut;
          //   }
          // });
          this.Productlist = Productlist
          this.Productlist_old = Productlist_old
          console.log(this.Productlist)
          console.log(this.groupedData)

          // console.log(this.Productlist_old);
          vm.readdata_Compliance()
        } else {
          this.Productlist = []
          this.Productlist_old = []

          // Swal.fire({
          //   title: 'ไม่พบข้อมูล!',
          //   icon: 'warning',
          //   confirmButtonText: 'OK'
          // });
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async readdata_Compliance() {
      const vm = this
      try {
        if (this.group_id) {
          const form = {
            group_id: this.group_id,
            datenow: this.date_now,
            datesave: this.datesave,
          }

          const response = await apiService.readdata_Compliance(form)

          vm.MapProductStore = response.data.MapProductStore
          vm.PlacementPoint = response.data.PlacementPoint
          vm.PlacementPoint.unshift({
            id: 0,
            name: 'กรุณาเลือก',
          })
          console.log(vm.PlacementPoint)
        } else {
          vm.PlacementPoint = []
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    updateDatePickerConfig() {
      const today = new Date()

      // ตั้งค่าวันเป็นวันที่ 1 เดือนที่แล้ว
      const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())

      // ดึงวันที่ เดือน และปี ในรูปแบบที่ต้องการ
      const day = String(previousMonthDate.getDate()).padStart(2, '0')
      const month = String(previousMonthDate.getMonth() + 1).padStart(2, '0') // เดือนใน JavaScript เริ่มจาก 0
      const year = previousMonthDate.getFullYear()

      var lastmonth = `${year}-${month}-${day}`
      console.log(this.specificDisabledDates)
      if(this.userData.position_id == 3){
        this.datePickerConfig = {
          dateFormat: 'Y-m-d',
        }
      }else{
        this.datePickerConfig = {
          dateFormat: 'Y-m-d',
          disable: [
            { from: `${lastmonth}`, to: this.minDate }, // ปิดการใช้งานช่วงวันที่ก่อน minDate
            ...this.specificDisabledDates.map(date => ({ from: date, to: date })), // ปิดการใช้งานวันที่เฉพาะเจาะจง
          ],
        }
      }
        
      // บังคับให้ AppDateTimePicker รีเรนเดอร์ใหม่
      this.datePickerKey += 1
    },
    async save_Compliance_confirm(){
      Swal.fire({
        title: "กรอกข้อมูลตามความเป็นจริง",
        text: "และตรวจสอบความถูกต้องก่อนบันทึก",  
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then(result => {
        if (result.isConfirmed) {

          Swal.fire({
            title: 'กำลังบันทึกข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })
            
          this.save_Compliance2()
        }
      })
    },
    async save_Compliance2(){
      try {
        const dateTime = new Date()
        const dateOnly = new Date(dateTime).toISOString().split('T')[0]

        const form = {
          store_id: this.store_id,
          datenow: (this.datenow?this.datenow:dateOnly),
          datesave: this.datesave,
          extra: 0,
          user_id: this.userData.id,
          position_name: this.userData.position_name,
        }

        const response2 = await apiService.create_Compliance(form)
        var data = response2.data.data
        this.save_Compliance()
          
      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },
    async save_Compliance() {
      const vm = this
      try {
        console.log(vm.Newlist.complianceDetails)

        const hasImages = Array.isArray(vm.Newlist?.complianceDetails) && vm.Newlist.complianceDetails.some(item =>
          Array.isArray(item.imageDetails) && item.imageDetails.some(imageDetail => imageDetail.files.length > 0),
        )

        if (hasImages) {
          const formRequests = vm.Newlist.complianceDetails.flatMap(item => {
            return item.imageDetails.flatMap(imageDetail => {
              if (imageDetail.files.length === 0) return []

              const formData = new FormData()

              imageDetail.files.forEach(preview => {
                formData.append('file_id', preview.id)
                formData.append('picture', preview.file)
                formData.append('datecreate', preview.datecreate)
                formData.append('dateupdate', preview.dateupdate)
              })

              formData.append('week', imageDetail.week)
              formData.append('compliance_list_id', item.id)
              formData.append('id', item.id)
              formData.append('group_id', vm.store_id)
              formData.append('datesave', vm.datesave)
              formData.append('status_area', item.status_area)
              formData.append('placement_point_id', item.placement_point_id)
              formData.append('qty', item.qty)
              formData.append('rental_area_unit_id', item.rental_area_unit_id)
              formData.append('substitute_products_id', item.substitute_products_id)
              formData.append('rental_area_unit_name', item.rental_area_unit_name)
              formData.append('posm_id', item.posm_id)
              formData.append('reason_for_not_getting_space_id', item.reason_for_not_getting_space_id)
              formData.append('note', item.note)
              formData.append('competitor_area', item.competitor_area)
              formData.append('competitor_id', item.competitor_id)
              formData.append('daterange', item.daterange)
              formData.append('user_id', this.userData.id)
              
              return apiService.createOrUpdate_ComplianceList(formData)
            })
          })

          await Promise.allSettled(formRequests)

          const updateData = vm.Newlist.complianceDetails.map(item => ({
            id: item.id,
            group_id: vm.store_id,
            datesave: vm.datesave,
            status_area: item.status_area,
            placement_point_id: item.placement_point_id,
            qty: item.qty,
            rental_area_unit_id: item.rental_area_unit_id,
            substitute_products_id: item.substitute_products_id,
            rental_area_unit_name: item.rental_area_unit_name,
            posm_id: item.posm_id,
            reason_for_not_getting_space_id: item.reason_for_not_getting_space_id,

            note: item.note,
            competitor_area: item.competitor_area,
            competitor_id: item.competitor_id,
            daterange: item.daterange,
            user_id: this.userData.id,
          }))

          console.log("Sending to API:", updateData) // ตรวจสอบว่าข้อมูลถูกต้อง
          await apiService.updateOnlyComplianceList(updateData)
        } else {
          const updateData = vm.Newlist.complianceDetails.map(item => ({
            id: item.id,
            group_id: vm.store_id,
            datesave: vm.datesave,
            status_area: item.status_area,
            placement_point_id: item.placement_point_id,
            qty: item.qty,
            rental_area_unit_id: item.rental_area_unit_id,
            substitute_products_id: item.substitute_products_id,
            rental_area_unit_name: item.rental_area_unit_name,
            posm_id: item.posm_id,
            reason_for_not_getting_space_id: item.reason_for_not_getting_space_id,

            note: item.note,
            competitor_area: item.competitor_area,
            competitor_id: item.competitor_id,
            daterange: item.daterange,
            user_id: this.userData.id,
          }))

          console.log("Sending to API:", updateData) // ตรวจสอบว่าข้อมูลถูกต้อง
          await apiService.updateOnlyComplianceList(updateData)
        }
        Swal.fire({
          html: '<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading(),
          willClose: () => window.location.reload(),
        })

        // Swal.fire({
        //     title: "บันทึกสำเร็จ!",
        //     icon: "success",
        //     timer: 2000,
        //     timerProgressBar: true,
        //     didOpen: () => Swal.showLoading(),
        //     willClose: () => window.location.reload()
        // });

      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: error.message || "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    },

    async delete_row_confirm(val, index){
      Swal.fire({
        title: "ยืนยันการลบ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
      }).then(result => {
        if (result.isConfirmed) {
          this.delete_row(val, index)
        }
      })
    },
    async delete_rowExtra_confirm(val, index){
      Swal.fire({
        title: "ยืนยันการลบ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
      }).then(result => {
        if (result.isConfirmed) {
          this.delete_rowExtra(val, index)
        }
      })
    },
    async delete_row(val, index){
      try {
        const form = {
          id: val.id,
        }

        const response2 = await apiService.delete_ComplianceList(form)

        Swal.fire({
          html: '<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading(),
          willClose: () => window.location.reload(),
        })
          
      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },        
    async delete_rowExtra(val, index){
      try {
        console.log(val)
        if(val.id){
          const form = {
            id: val.id,
          }

          const response2 = await apiService.delete_ComplianceListExtra(form)

          Swal.fire({
            html: '<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => Swal.showLoading(),

            // willClose: () => window.location.reload()
          })
          this.set_group_id_extra()
        }else{
          this.NewlistExtra.complianceextraDetails.splice(index, 1)
        }
          
          
      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },           

    async save_Compliance_confirmExtra(){
      Swal.fire({
        title: "กรอกข้อมูลตามความเป็นจริง",
        text: "และตรวจสอบความถูกต้องก่อนบันทึก",  
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then(result => {
        if (result.isConfirmed) {

          Swal.fire({
            title: 'กำลังบันทึกข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })
            
          this.save_Compliance2Extra()
        }
      })
    },
    async save_Compliance2Extra(){
      const vm = this
      try {
        const dateTime = new Date()
        const dateOnly = new Date(dateTime).toISOString().split('T')[0]

        const form = {
          store_id: this.store_id_extra,
          datenow: (this.datenow?this.datenow:dateOnly),
          datesave: this.datesave,
          extra: 1,
          user_id: this.userData.id,
          position_name: this.userData.position_name,
        }

        const response2 = await apiService.create_Compliance2(form)
        var data = response2.data.data
        vm.NewlistExtra.complianceextraDetails.forEach(item => {
          item.complianceextra_id = data.id
        })
        console.log(vm.NewlistExtra.complianceextraDetails)
        this.save_ComplianceExtra()
          
      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },
      
    async save_ComplianceExtra() {
      const vm = this
      try {
        console.log(vm.NewlistExtra.complianceextraDetails)

        for (const item of vm.NewlistExtra.complianceextraDetails) {
          // ✅ กรณีมีรูปภาพ
          if (item.imageDetails.some(imageDetail => imageDetail.files.length > 0)) {
            const updateData = {
              compliance_list_id: item.id,
              id: item.id,
              old_id: item.old_id,
              complianceextra_id: item.complianceextra_id,
              product_id: item.product_id,
              old_Compliance_id: item.old_Compliance_id,
              group_id: this.store_id_extra,
              datesave: this.datesave,
              status_area: item.status_area,
              map_storecompliance_list_id: item.map_storecompliance_list_id,
              placement_point_id: item.placement_point_id,
              rental_area_unit_name: item.rental_area_unit_name,
              qty: item.qty,
              rental_area_unit_id: item.rental_area_unit_id,
              substitute_products_id: item.substitute_products_id,
              posm_id: item.posm_id,
              reason_for_not_getting_space_id: item.reason_for_not_getting_space_id,
              note: item.note,
              competitor_area: item.competitor_area,
              competitor_id: item.competitor_id,
              daterange: item.daterange,
              user_id: this.userData.id,
            }

            console.log("📤 Sending Data (No Image):", updateData)

            const response2 = await apiService.createOrUpdate_ComplianceListExtra(updateData)
                  
            for (const imageDetail of item.imageDetails) {
              if (imageDetail.files.length === 0) continue // ✅ ข้ามถ้าไม่มีไฟล์รูป

              const formData = new FormData()

              imageDetail.files.forEach(preview => {
                formData.append('file_id', preview.id || "null") // ถ้าไม่มี ID ให้เป็น "null"
                formData.append('picture', preview.file) // ✅ ตรวจสอบว่า `file` เป็น Blob หรือ File จริง
                formData.append('datecreate', preview.datecreate || new Date().toISOString())
                formData.append('dateupdate', preview.dateupdate || new Date().toISOString())
              })

              formData.append('week', imageDetail.week)
              formData.append('compliance_list_id', response2.data.id)
              formData.append('id', response2.data.id)
              formData.append('old_id', item.old_id)
              formData.append('product_id', item.product_id)
              formData.append('complianceextra_id', item.complianceextra_id)
              formData.append('old_Compliance_id', item.old_Compliance_id)
              formData.append('group_id', this.store_id_extra)
              formData.append('datesave', this.datesave)
              formData.append('status_area', item.status_area)
              formData.append('map_storecompliance_list_id', item.map_storecompliance_list_id)
              formData.append('placement_point_id', item.placement_point_id)
              formData.append('rental_area_unit_name', item.rental_area_unit_name)
              formData.append('qty', item.qty)
              formData.append('rental_area_unit_id', item.rental_area_unit_id)
              formData.append('substitute_products_id', item.substitute_products_id)
              formData.append('posm_id', item.posm_id)
              formData.append('reason_for_not_getting_space_id', item.reason_for_not_getting_space_id)
              formData.append('note', item.note)
              formData.append('competitor_area', item.competitor_area)
              formData.append('competitor_id', item.competitor_id)
              formData.append('daterange', item.daterange)
              formData.append('user_id', this.userData.id)

              console.log("📤 Sending FormData (With Image):", formData)
              await apiService.createOrUpdate_ComplianceListExtraImage(formData)
            }
          } else {
            // ✅ กรณีไม่มีรูปภาพ: ส่งข้อมูลไปที่ `createOrUpdate_ComplianceListExtra`
            const updateData = {
              compliance_list_id: item.id,
              id: item.id,
              old_id: item.old_id,
              complianceextra_id: item.complianceextra_id,
              product_id: item.product_id,
              old_Compliance_id: item.old_Compliance_id,
              group_id: this.store_id_extra,
              datesave: this.datesave,
              status_area: item.status_area,
              map_storecompliance_list_id: item.map_storecompliance_list_id,
              placement_point_id: item.placement_point_id,
              rental_area_unit_name: item.rental_area_unit_name,
              qty: item.qty,
              rental_area_unit_id: item.rental_area_unit_id,
              substitute_products_id: item.substitute_products_id,
              posm_id: item.posm_id,
              reason_for_not_getting_space_id: item.reason_for_not_getting_space_id,
              note: item.note,
              competitor_area: item.competitor_area,
              competitor_id: item.competitor_id,
              daterange: item.daterange,
              user_id: this.userData.id,
            }

            console.log("📤 Sending Data (No Image):", updateData)
            await apiService.createOrUpdate_ComplianceListExtra(updateData)
          }
        }

        // ✅ แสดงข้อความแจ้งเตือนสำเร็จ
        Swal.fire({
          html: '<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading(),
          willClose: () => window.location.reload(),
        })

        // Swal.fire({
        //     title: "บันทึกสำเร็จ!",
        //     icon: "success",
        //     timer: 2000,
        //     timerProgressBar: true,
        //     didOpen: () => Swal.showLoading(),
        //     willClose: () => window.location.reload()
        // });

      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: error.message || "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    },
    async save_ComplianceExtrabk1() {
      const vm = this
      try {
        console.log(vm.NewlistExtra.complianceextraDetails)

        const formRequests = []

        vm.NewlistExtra.complianceextraDetails.forEach(item => {
          // ✅ กรณีมีรูปภาพ
          if (item.imageDetails.some(imageDetail => imageDetail.files.length > 0)) {
            item.imageDetails.forEach(imageDetail => {
              if (imageDetail.files.length === 0) return // ✅ ข้ามถ้าไม่มีไฟล์รูป

              const formData = new FormData()

              imageDetail.files.forEach(preview => {
                formData.append('file_id', preview.id || "null") // ถ้าไม่มี ID ให้เป็น "null"
                formData.append('picture', preview.file) // ✅ ตรวจสอบว่า `file` เป็น Blob หรือ File จริง
                formData.append('datecreate', preview.datecreate || new Date().toISOString())
                formData.append('dateupdate', preview.dateupdate || new Date().toISOString())
              })

              formData.append('week', imageDetail.week)
              formData.append('compliance_list_id', item.id)
              formData.append('id', item.id)
              formData.append('old_id', item.old_id)
              formData.append('product_id', item.product_id)
              formData.append('complianceextra_id', item.complianceextra_id)
              formData.append('old_Compliance_id', item.old_Compliance_id)
              formData.append('group_id', this.store_id_extra)
              formData.append('datesave', this.datesave)
              formData.append('status_area', item.status_area)
              formData.append('map_storecompliance_list_id', item.map_storecompliance_list_id)
              formData.append('placement_point_id', item.placement_point_id)
              formData.append('rental_area_unit_name', item.rental_area_unit_name)
              formData.append('qty', item.qty)
              formData.append('rental_area_unit_id', item.rental_area_unit_id)
              formData.append('substitute_products_id', item.substitute_products_id)
              formData.append('posm_id', item.posm_id)
              formData.append('reason_for_not_getting_space_id', item.reason_for_not_getting_space_id)
              formData.append('note', item.note)
              formData.append('competitor_area', item.competitor_area)
              formData.append('competitor_id', item.competitor_id)
              formData.append('daterange', item.daterange)
              formData.append('user_id', this.userData.id)

              console.log("📤 Sending FormData (With Image):", formData)
              setTimeout(() => {
                formRequests.push(apiService.createOrUpdate_ComplianceListExtraImage(formData))
              }, 100)
                        
            })
          } else {
            // ✅ กรณีไม่มีรูปภาพ: ส่งข้อมูลไปที่ `createOrUpdate_ComplianceListExtra`
            const updateData = {
              compliance_list_id: item.id,
              id: item.id,
              old_id: item.old_id,
              complianceextra_id: item.complianceextra_id,
              product_id: item.product_id,
              old_Compliance_id: item.old_Compliance_id,
              group_id: this.store_id_extra,
              datesave: this.datesave,
              status_area: item.status_area,
              map_storecompliance_list_id: item.map_storecompliance_list_id,
              placement_point_id: item.placement_point_id,
              rental_area_unit_name: item.rental_area_unit_name,
              qty: item.qty,
              rental_area_unit_id: item.rental_area_unit_id,
              substitute_products_id: item.substitute_products_id,
              posm_id: item.posm_id,
              reason_for_not_getting_space_id: item.reason_for_not_getting_space_id,
              note: item.note,
              competitor_area: item.competitor_area,
              competitor_id: item.competitor_id,
              daterange: item.daterange,
              user_id: this.userData.id,
            }

            console.log("📤 Sending Data (No Image):", updateData)
            setTimeout(() => {
              formRequests.push(apiService.createOrUpdate_ComplianceListExtra(updateData))
            }, 100)
                    
          }
        })

        // ✅ ส่งทุกคำขอพร้อมกัน
        await Promise.allSettled(formRequests)

        // ✅ แสดงข้อความแจ้งเตือนสำเร็จ
        Swal.fire({
          html: '<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading(),

          // willClose: () => window.location.reload()
        })

        // Swal.fire({
        //     title: "บันทึกสำเร็จ!",
        //     icon: "success",
        //     timer: 2000,
        //     timerProgressBar: true,
        //     didOpen: () => Swal.showLoading(),
        //     willClose: () => window.location.reload()
        // });

      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: error.message || "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    },
    async save_ComplianceExtrabk() {
      const vm = this
      try {
        console.log(vm.NewlistExtra.complianceextraDetails)

        // ✅ ตรวจสอบว่ามีภาพที่ต้องอัปโหลดหรือไม่
        const hasImages = vm.NewlistExtra.complianceextraDetails.some(item =>
          item.imageDetails.some(imageDetail => imageDetail.files.length > 0),
        )

        if (hasImages) {
          // ✅ กรณีมีภาพที่ต้องอัปโหลด: วนลูปและส่ง API แยกตาม `week`
          const formRequests = vm.NewlistExtra.complianceextraDetails.flatMap(item => {
            return item.imageDetails.flatMap(imageDetail => {
              if (imageDetail.files.length === 0) return [] // ✅ ข้ามถ้าไม่มีไฟล์รูป

              const formData = new FormData()

              imageDetail.files.forEach(preview => {
                formData.append('file_id', preview.id || "null") // ถ้าไม่มี ID ให้เป็น "null"
                formData.append('picture', preview.file) // ✅ ตรวจสอบว่า `file` เป็น Blob หรือ File จริง
                formData.append('datecreate', preview.datecreate || new Date().toISOString())
                formData.append('dateupdate', preview.dateupdate || new Date().toISOString())
              })

              formData.append('week', imageDetail.week)
              formData.append('compliance_list_id', item.id)
              formData.append('id', item.id)
              formData.append('old_id', item.old_id)
              formData.append('product_id', item.product_id)
              formData.append('complianceextra_id', item.complianceextra_id)
              formData.append('old_Compliance_id', item.old_Compliance_id)
              formData.append('group_id', this.store_id_extra)
              formData.append('datesave', this.datesave)
              formData.append('status_area', item.status_area)
              formData.append('map_storecompliance_list_id', item.map_storecompliance_list_id)
              formData.append('placement_point_id', item.placement_point_id)
              formData.append('rental_area_unit_name', item.rental_area_unit_name)
              formData.append('qty', item.qty)
              formData.append('rental_area_unit_id', item.rental_area_unit_id)
              formData.append('substitute_products_id', item.substitute_products_id)
              formData.append('posm_id', item.posm_id)
              formData.append('reason_for_not_getting_space_id', item.reason_for_not_getting_space_id)
              formData.append('note', item.note)
              formData.append('competitor_area', item.competitor_area)
              formData.append('competitor_id', item.competitor_id)
              formData.append('daterange', item.daterange)
              formData.append('user_id', this.userData.id)

              console.log("📤 Sending FormData:", formData)
              
              return apiService.createOrUpdate_ComplianceListExtraImage(formData)
            })
          }).filter(request => request.length !== 0) // ✅ กรองเฉพาะ request ที่มีข้อมูล

          await Promise.allSettled(formRequests)
        } else {
          // ✅ กรณีไม่มีภาพที่ต้องอัปโหลด: ส่ง API อัปเดตข้อมูลแค่ **ครั้งเดียว**
          const updateData = vm.NewlistExtra.complianceextraDetails.map(item => ({
            compliance_list_id: item.id,
            id: item.id,
            old_id: item.old_id,
            complianceextra_id: item.complianceextra_id,
            product_id: item.product_id,

            old_Compliance_id: item.old_Compliance_id,
            group_id: this.store_id_extra,
            datesave: this.datesave,
            status_area: item.status_area,
            map_storecompliance_list_id: item.map_storecompliance_list_id,
            placement_point_id: item.placement_point_id,
            rental_area_unit_name: item.rental_area_unit_name,
            qty: item.qty,
            rental_area_unit_id: item.rental_area_unit_id,
            substitute_products_id: item.substitute_products_id,
            posm_id: item.posm_id,
            reason_for_not_getting_space_id: item.reason_for_not_getting_space_id,
            note: item.note,
            competitor_area: item.competitor_area,
            competitor_id: item.competitor_id,
            daterange: item.daterange,
            user_id: this.userData.id,
          }))

          await apiService.createOrUpdate_ComplianceListExtra(updateData)
        }

        // ✅ แสดงข้อความแจ้งเตือนสำเร็จ
        Swal.fire({
          html: '<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading(),

          // willClose: () => window.location.reload()
        })

        // Swal.fire({
        //     title: "บันทึกสำเร็จ!",
        //     icon: "success",
        //     timer: 2000,
        //     timerProgressBar: true,
        //     didOpen: () => Swal.showLoading(),
        //     willClose: () => window.location.reload()
        // });

      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: error.message || "ไม่สามารถบันทึกข้อมูลได้",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    },











    async save_Compliance_bk(){
      const vm = this
      try {
        console.log(vm.Newlist.complianceDetails)

        const formRequests = vm.Newlist.complianceDetails.map(item => {
          const formData = new FormData()
          if (item.imageDetail.pictures.length > 0) {
            item.imageDetail.pictures.forEach(preview => {
              formData.append('picture', preview.file)
              formData.append('datecreate', preview.datecreate)
              formData.append('dateupdate', preview.dateupdate)
            })
          } else {
            formData.append('picture', [])
            formData.append('datecreate', [])
            formData.append('dateupdate', [])
          }
          formData.append('week', item.imageDetail.week)  // ✅ เพิ่ม week เพื่อบอกว่าเป็นของ week ไหน
          formData.append('compliance_list_id', item.id) // ✅ ใช้ compliance_list_id เป็น FK
                
          formData.append('id', item.id)
          formData.append('old_id', item.old_id)
          formData.append('old_Compliance_id', item.old_Compliance_id)
          formData.append('group_id', this.store_id)

          formData.append('datesave', this.datesave)
          formData.append('status_area', item.status_area)
          formData.append('placement_point_id', item.placement_point_id)
          formData.append('rental_area_unit_name', item.rental_area_unit_name)
          formData.append('qty', item.qty)
          formData.append('rental_area_unit_id', item.rental_area_unit_id)
          formData.append('substitute_products_id', item.substitute_products_id)
          formData.append('posm_id', item.posm_id)
          formData.append('reason_for_not_getting_space_id', item.reason_for_not_getting_space_id)
          formData.append('note', item.note)
          formData.append('competitor_area', item.competitor_area)
          formData.append('competitor_id', item.competitor_id)
          formData.append('daterange', item.daterange)

          console.log(formData)

          // ส่ง request แต่ละรายการแยกกัน
          return apiService.createOrUpdate_ComplianceList(formData)
        })

        // รอจนกว่าทุก request จะสำเร็จ
        await Promise.allSettled(formRequests)
          
        // console.log(testform2);
        // const response2 = await apiService.createOrUpdate_weekList(testform2);
        Swal.fire({
          title: 'บันทึกสำเร็จ!',
          icon: 'success',
          confirmButtonText: 'OK',
          time: 2000,
        })
        let timerInterval
        Swal.fire({
          title: "บันทึกสำเร็จ!",
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()

            const timer = Swal.getPopup().querySelector("b")

            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          },
        }).then(result => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            window.location.reload()
          }
        })

        // vm.get_all_week();
      } catch (error) {
        console.error('Error:', error)
      }
    },
    change_checkboxt(i) {
      const vm = this
      if (i < 0 || i >= vm.Productlist_old.ComplianceDetails.length) return
      if (vm.Productlist_old.ComplianceDetails[i].price_status_old != vm.Productlist.ComplianceDetails[i].price_status) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    change_data(i) {
      const vm = this

      console.log(vm.Productlist_old.ComplianceDetails[i].qty_old)
      console.log(parseFloat(vm.Productlist.ComplianceDetails[i].qty))
      if (i < 0 || i >= vm.Productlist_old.ComplianceDetails.length) return
      if (vm.Productlist_old.ComplianceDetails[i].qty_old != parseFloat(vm.Productlist.ComplianceDetails[i].qty)) {
        vm.color_active2 = 1
      }else{
        vm.color_active2 = 0
      }
      console.log(vm.color_active2)
    },
    change_data2(i) {
      const vm = this
      if (i < 0 || i >= vm.Productlist_old.ComplianceDetails.length) return
      if (vm.Productlist_old.ComplianceDetails[i].note_old != vm.Productlist.ComplianceDetails[i].note) {
        vm.color_active3 = 1
      }else{
        vm.color_active3 = 0
      }
    },
    handleBeforeUnload(e) {
      const message = "Are you sure you want to leave? Changes you made may not be saved."

      e.returnValue = message // สำหรับเบราว์เซอร์บางตัว
      
      return message // สำหรับเบราว์เซอร์อื่น ๆ
    },

      














    show_preview2(index, id) {
      // this.isDialogVisible = true;
      // รับค่า imageDetails จาก API และแปลงเป็น imagePreviews
      const details = this.Newlist.complianceDetails[index].imageDetails || []

      this.imagePreviews = details.map(week => week.files || [])
      if(this.row_id){
        this.row_id = null
      }else{
        this.row_id = id
      }
      this.row_key = index
    },
    selectFiles(weekIndex) {
      document.getElementById('fileInput' + weekIndex).click()
    },

    handleFiles(event, weekIndex, row_key) {
      const files = event.target.files
      if (!files || files.length === 0) return

      for (let file of files) {

        if (file.size > 2048 * 1024) { 
          Swal.fire({
            title: 'ขนาดไฟล์เกินกำหนด!',
            text: `ไฟล์ "${file.name}" มีขนาดใหญ่กว่า 2MB กรุณาอัพโหลดไฟล์ขนาดไม่เกิน 2MB`,
            icon: 'warning',
            confirmButtonText: 'OK',
          })
          continue; // ข้ามไฟล์นี้ไป ไม่ทำการอัพโหลด
        }

        const reader = new FileReader()

        reader.onload = e => {
          const now = new Date()

          // ✅ แปลงวันที่ให้เป็น YYYY-MM-DD (ตามโซนเวลาท้องถิ่น)
          const formattedDate = now.toLocaleDateString('en-CA') 

          // ✅ แปลงวันเวลาให้เป็น YYYY-MM-DD HH:MM:SS (ตามโซนเวลาท้องถิ่น)
          const formattedDateTime = now.toLocaleString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).replace(',', '').replace(/\//g, '-')

          const newImage = {
            file: file,
            url: e.target.result,
            filename: file.name,
            name: file.name,
            id: null,
            datecreate: formattedDate,
            dateupdate: formattedDateTime,
            new: true,
          }

          if (!this.Newlist.complianceDetails[row_key].imageDetails) {
            this.Newlist.complianceDetails[row_key].imageDetails = []
          }

          if (!this.Newlist.complianceDetails[row_key].imageDetails[weekIndex]) {
            this.Newlist.complianceDetails[row_key].imageDetails[weekIndex] = { files: [] }
          }

          this.Newlist.complianceDetails[row_key].imageDetails[weekIndex].files.push(newImage)
        }
        reader.readAsDataURL(file)
      }
      event.target.value = ''
    },
    show_preview1(data, imageIndex) {
      console.log(data)

      const imagePreviews = data

      console.log(imagePreviews)
      Fancybox.close()
      Fancybox.show(
        imagePreviews.map(image => ({
          src: 'https://test.iservreport.com/'+image.filename,
          type: "image",
          caption: `
                    <div style="position: relative;">
                        <span>Image Preview</span>
                    </div>
                `,
        })),
        {
          startIndex: imageIndex,
          loop: true,
          afterShow: () => {
          },
        },
      )
    },
    async complianceDetailsdeleteImage(imageId, imageName, imageIndex, weekIndex, row_key) {
      const imageList = this.Newlist.complianceDetails[row_key].imageDetails[weekIndex].files

      if (imageList[imageIndex].new) {
        imageList.splice(imageIndex, 1)
        
        return
      }

      Swal.fire({
        title: 'ยืนยันการลบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
      }).then(result => {
        if (result.isConfirmed) {
          this.confirm_complianceDetailsdeleteImage(imageId, imageName, imageIndex, weekIndex, row_key)
        }
      })
    },

    async confirm_complianceDetailsdeleteImage(imageId, imageName, imageIndex, weekIndex, row_key) {
      try {
        const form = {
          id: this.row_id,
          week: weekIndex + 1,
          filename: imageName,
        }

        const response = await apiService.complianceDetailsdeleteImage(form)
        if (response.data.status === 'success') {
          Swal.fire({
            title: 'ลบสำเร็จ!',
            text: 'รูปภาพถูกลบออกเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'OK',
          })
          this.Newlist.complianceDetails[row_key].imageDetails[weekIndex].files.splice(imageIndex, 1)
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message || 'ไม่สามารถลบรูปภาพได้',
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },

    show_preview2Extra(index, id) {
      // this.isDialogVisibleExtra = true;
      // รับค่า imageDetails จาก API และแปลงเป็น imagePreviews
      console.log(this.NewlistExtra.complianceextraDetails)

      const details = this.NewlistExtra.complianceextraDetails[index].imageDetails || []

      this.imagePreviewsExtra = details.map(week => week.files || [])
      console.log(this.row_idExtra)
      if(this.row_idExtra){
        this.row_idExtra = null
      }else{
        this.row_idExtra = id
      }
        
      this.row_keyExtra = index
    },
    selectFilesExtra(weekIndex) {
      console.log(weekIndex)
      document.getElementById('fileInputExtra' + weekIndex).click()
    },
    handleFilesExtra(event, weekIndex, row_key) {
      const files = event.target.files
      if (!files || files.length === 0) return

      for (let file of files) {

        if (file.size > 2048 * 1024) { 
          Swal.fire({
            title: 'ขนาดไฟล์เกินกำหนด!',
            text: `ไฟล์ "${file.name}" มีขนาดใหญ่กว่า 2MB กรุณาอัพโหลดไฟล์ขนาดไม่เกิน 2MB`,
            icon: 'warning',
            confirmButtonText: 'OK',
          })
          continue; // ข้ามไฟล์นี้ไป ไม่ทำการอัพโหลด
        }

        const reader = new FileReader()

        reader.onload = e => {
          const now = new Date()

          // ✅ แปลงวันที่ให้เป็น YYYY-MM-DD (ตามโซนเวลาท้องถิ่น)
          const formattedDate = now.toLocaleDateString('en-CA') 

          // ✅ แปลงวันเวลาให้เป็น YYYY-MM-DD HH:MM:SS (ตามโซนเวลาท้องถิ่น)
          const formattedDateTime = now.toLocaleString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).replace(',', '').replace(/\//g, '-')

          const newImage = {
            file: file,
            url: e.target.result,
            filename: file.name,
            name: file.name,
            id: null,
            datecreate: formattedDate,
            dateupdate: formattedDateTime,
            new: true,
          }

          console.log('row_key : '+row_key)
          console.log('row_key 0 : '+this.NewlistExtra.complianceextraDetails?.[0]?.imageDetails)
          console.log('row_key find : '+this.NewlistExtra.complianceextraDetails[row_key].imageDetails)
          if (!this.NewlistExtra.complianceextraDetails[row_key].imageDetails) {
            this.NewlistExtra.complianceextraDetails[row_key].imageDetails = []
          }

          if (!this.NewlistExtra.complianceextraDetails[row_key].imageDetails[weekIndex]) {
            this.NewlistExtra.complianceextraDetails[row_key].imageDetails[weekIndex] = { files: [] }
          }

          this.NewlistExtra.complianceextraDetails[row_key].imageDetails[weekIndex].files.push(newImage)
        }
        reader.readAsDataURL(file)
      }
      event.target.value = ''
    },

    // handleFilesExtra_bk(event, weekIndex, row_key) {
    //   const files = event.target.files;
    //   if (!files || files.length === 0) return;

    //   for (let file of files) {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //       const now = new Date();
    //       const formattedDate = now.toISOString().split('T')[0];
    //       const formattedDateTime = now.toISOString().replace('T', ' ').split('.')[0];
            
    //       const newImage = {
    //         file: file,
    //         url: e.target.result,
    //         name: file.name,
    //         id: null,
    //         datecreate: formattedDate,
    //         dateupdate: formattedDateTime,
    //         new: true,
    //       };

    //       if (!this.NewlistExtra.complianceextraDetails[row_key].imageDetails) {
    //         this.NewlistExtra.complianceextraDetails[row_key].imageDetails = [];
    //       }
            
    //       if (!this.NewlistExtra.complianceextraDetails[row_key].imageDetails[weekIndex]) {
    //         this.NewlistExtra.complianceextraDetails[row_key].imageDetails[weekIndex] = { files: [] };
    //       }

    //       this.NewlistExtra.complianceextraDetails[row_key].imageDetails[weekIndex].files.push(newImage);
    //     };
    //     reader.readAsDataURL(file);
    //   }
    //   event.target.value = '';
    // },
    show_preview1Extra(data, imageIndex) {
      console.log(data)

      const imagePreviews = data

      console.log(imagePreviews)
      Fancybox.close()
      Fancybox.show(
        imagePreviews.map(image => ({
          src: 'https://test.iservreport.com/'+image.filename,
          type: "image",
          caption: `
                    <div style="position: relative;">
                        <span>Image Preview</span>
                    </div>
                `,
        })),
        {
          startIndex: imageIndex,
          loop: true,
          afterShow: () => {
          },
        },
      )
    },
    async complianceDetailsdeleteImageExtra(imageId, imageName, imageIndex, weekIndex, row_key) {
      console.log(this.NewlistExtra.complianceextraDetails[row_key])

      const imageList = this.NewlistExtra.complianceextraDetails[row_key].imageDetails[weekIndex].files

      if (imageList[imageIndex].new) {
        imageList.splice(imageIndex, 1)
        
        return
      }

      Swal.fire({
        title: 'ยืนยันการลบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
      }).then(result => {
        if (result.isConfirmed) {
          this.confirm_complianceDetailsdeleteImageExtra(imageId, imageName, imageIndex, weekIndex, row_key)
        }
      })
    },

    async confirm_complianceDetailsdeleteImageExtra(imageId, imageName, imageIndex, weekIndex, row_key) {
      try {
        if(imageId > 0){
          var form = {
            id: imageId,
            week: weekIndex + 1,
            filename: imageName,
          }
        }else{
          var form = {
            id: this.row_idExtra,
            week: weekIndex + 1,
            filename: imageName,
          }
        }
          
        const response = await apiService.complianceDetailsdeleteImageExtra(form)
        if (response.data.status === 'success') {
          Swal.fire({
            title: 'ลบสำเร็จ!',
            text: 'รูปภาพถูกลบออกเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'OK',
          })
          this.NewlistExtra.complianceextraDetails[row_key].imageDetails[weekIndex].files.splice(imageIndex, 1)
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message || 'ไม่สามารถลบรูปภาพได้',
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },











    openInNewTab(base64Url) {
      const newTab = window.open()

      newTab.document.body.innerHTML = `<img src="${base64Url}" style="max-width: 100%; max-height: 100%;">`
    },

    // Picture
    handleFiles_old(event, index3, id) {
      // ตรวจสอบว่ามี event และ target ก่อนใช้งาน
      if (event && event.target) {
        console.log(index3) // แสดงค่า i ใน console
        this.selectedFiles = Array.from(event.target.files)


        // this.Productlist.complianceDetails[i].previews = Array.from(event.target.files).map(file => ({ file }));
        // console.log(this.Productlist.complianceDetails[i]);
        const files = this.selectedFiles

        this.previewImages(files, index3, id)
      } else {
        console.error('Event หรือ event.target ไม่พร้อมใช้งาน')
      }
    },
    selectFiles_old(index3, id) {
      // ใช้ document.querySelector เพื่อเลือก input และเรียก click()
      document.querySelector('#fileInput'+id).click()
    },
    handleDrop(event) {
      const files = event.dataTransfer.files

      this.previewImages(files)
    },
    previewImages(files, index3, id) {
        
      Array.from(files).forEach(file => {
        if (this.Newlist.complianceDetails[index3].previews.length >= 40) return // Limit to 40 images
        const reader = new FileReader()

        reader.onload = e => {
          this.Newlist.complianceDetails[index3].previews.push({
            name: file.name,
            file: file, // เก็บไฟล์ไว้เพื่อส่งให้ API
            url: e.target.result,
            filename: file.name,
          })
        }
        reader.readAsDataURL(file)
      })
      console.log(this.Newlist.complianceDetails[index3])
    },
    deleteImage_old(id, name, index) {
      console.log(id)
      console.log(name)
      console.log(this.imagePreviews)

      // this.imagePreviews.splice(index, 1);
    },

    // Picture
    show_preview1_old(index3) {
      const imagePreviews = this.Newlist.complianceDetails[index3].previews

      console.log(imagePreviews)
      Fancybox.close()
      Fancybox.show(
        imagePreviews.map(image => ({
          src: 'https://test.iservreport.com/'+image.filename,
          type: "image",
          caption: `
                    <div style="position: relative;">
                        <span>Image Preview</span>
                    </div>
                `,
        })),
        {
          startIndex: index3,
          loop: true,
          afterShow: () => {
            // ตรวจสอบปุ่มลบเมื่อเปิด Fancybox
            // document.querySelectorAll('.delete-button').forEach(button => {
            //     button.addEventListener('click', (event) => {
            //         const id = event.target.getAttribute('data-id');
            //         const name = event.target.getAttribute('data-name');
            //         this.deleteImage(id, name); // เรียกฟังก์ชันลบในโปรเจกต์ของคุณ
            //         Fancybox.close(); // ปิด Fancybox หลังจากลบ
            //     });
            // });
          },
        },
      )
    },
      
      
    // Picture
    handleFiles_promotion(event, index, indexx, index2, index3, id) {
      // ตรวจสอบว่ามี event และ target ก่อนใช้งาน
      if (event && event.target) {
        console.log(index, indexx, index2, index3) // แสดงค่า i ใน console
        this.selectedFiles = Array.from(event.target.files)


        // this.Productlist.complianceDetails[i].previews = Array.from(event.target.files).map(file => ({ file }));
        // console.log(this.Productlist.complianceDetails[i]);
        const files = this.selectedFiles

        this.previewImages_promotion(files, index, indexx, index2, index3, id)
      } else {
        console.error('Event หรือ event.target ไม่พร้อมใช้งาน')
      }
    },
    selectFiles_promotion(index, indexx, index2, index3, id) {
      // ใช้ document.querySelector เพื่อเลือก input และเรียก click()
      document.querySelector('#fileInput'+id).click()
    },
    handleDrop_promotion(event) {
      const files = event.dataTransfer.files

      this.previewImages_promotion(files)
    },
    previewImages_promotion(files, index, indexx, index2, index3, id) {
        
      Array.from(files).forEach(file => {
        if (this.groupedData2[index][indexx][index2][index3].previews.length >= 40) return // Limit to 40 images
        const reader = new FileReader()

        reader.onload = e => {
          this.groupedData2[index][indexx][index2][index3].previews.push({
            name: file.name,
            file: file, // เก็บไฟล์ไว้เพื่อส่งให้ API
            url: e.target.result,
          })
        }
        reader.readAsDataURL(file)
      })
      console.log(this.groupedData2[index][indexx][index2][index3])
    },
    deleteImage_promotion(id, name, index) {
      console.log(id)
      console.log(name)
      console.log(this.imagePreviews_promotion)

      // this.imagePreviews.splice(index, 1);
    },

    // Picture
    show_preview1_promotion(index, indexx, index2, index3) {
      const imagePreviews = this.groupedData2[index][indexx][index2][index3].previews

      console.log(imagePreviews)
      Fancybox.close()
      Fancybox.show(
        imagePreviews.map(image => ({
          src: 'https://test.iservreport.com/'+image.filename,
          type: "image",
          caption: `
                    <div style="position: relative;">
                        <span>Image Preview</span>
                    </div>
                `,
        })),
        {
          startIndex: index3,
          loop: true,
          afterShow: () => {
            // ตรวจสอบปุ่มลบเมื่อเปิด Fancybox
            // document.querySelectorAll('.delete-button').forEach(button => {
            //     button.addEventListener('click', (event) => {
            //         const id = event.target.getAttribute('data-id');
            //         const name = event.target.getAttribute('data-name');
            //         this.deleteImage(id, name); // เรียกฟังก์ชันลบในโปรเจกต์ของคุณ
            //         Fancybox.close(); // ปิด Fancybox หลังจากลบ
            //     });
            // });
          },
        },
      )
    },
    show_preview2_promotion(index, indexx, index2, index3) {
      this.isDialogVisible_promotion = true
      this.imagePreviews_promotion = this.groupedData2[index][indexx][index2][index3].previews
    },

    openInNewTab_old(base64Url) {
      // สร้างลิงก์ชั่วคราวแล้วใช้ open() เพื่อเปิดในแท็บใหม่
      const newTab = window.open()

      newTab.document.body.innerHTML = `<img src="${base64Url}" style="max-width: 100%; max-height: 100%;">`
    },
      

    filterGroupedData(data) {
      const vm = this
      if (!this.filterMSL) {
        // หากไม่ได้ติ๊ก MSL คืนค่าข้อมูลทั้งหมด
        return data
      }

      // กรองข้อมูลเฉพาะที่มี msl: "Y" และ key มิติที่ 2 มีค่าข้างใน
      const filteredData = {}

      Object.keys(data).forEach(category => {
        const filteredCategory = {}

        Object.keys(data[category]).forEach(brand => {
          const filteredBrand = {}

          Object.keys(data[category][brand]).forEach(subbrand => {
            const filteredBrandItems = data[category][brand][subbrand].filter(
              item => item.mapProductStoreList.msl == "Y",
            )

            if (filteredBrandItems.length > 0) {
              filteredBrand[subbrand] = filteredBrandItems
            }
          })

          // เก็บเฉพาะ brand ที่มี subbrand ที่ผ่านการกรองแล้ว
          if (Object.keys(filteredBrand).length > 0) {
            filteredCategory[brand] = filteredBrand
          }
        })

        // เก็บเฉพาะ category ที่มี brand ที่ผ่านการกรองแล้ว
        if (Object.keys(filteredCategory).length > 0) {
          filteredData[category] = filteredCategory
        }
      })

      console.log(filteredData)

      vm.currentTab = 0
      vm.currentTab2 = 0
      
      return filteredData
    },


    async get_all_store(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          position_name: this.userData.position_name,
        }
        const response = await apiService.get_all_store(form)

        this.storelist = response.data.data
        this.storelist.forEach((item, index) => {
          this.storelist[index].new_name = item.account.name+','+item.store_code+','+item.store_name
        })
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_all_PlacementPoint(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_all_PlacementPoint(form)

        this.PlacementPointlist = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_unit(i){
      const selectedItem = this.groupedRentalAreaUnit.find(
        item => item.id === this.Newlist.complianceDetails[i].rental_area_unit_id,
      )

      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          name: selectedItem.name,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_unit(form)

        this.Newlist.complianceDetails[i].rental_area_unit_name = null
        this.Newlist.complianceDetails[i].user_list = response.data.data
          
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_unitExtra(i){
      const selectedItem = this.groupedRentalAreaUnit.find(
        item => item.id === this.NewlistExtra.complianceextraDetails[i].rental_area_unit_id,
      )


      // this.NewlistExtra[i].rental_area_unit_name = null;
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          name: selectedItem.name,
          position_name: this.userData.position_name,
          store_id: this.store_id_extra,
        }
        const response = await apiService.get_unit(form)

        this.NewlistExtra.complianceextraDetails[i].rental_area_unit_name = null
        this.NewlistExtra.complianceextraDetails[i].user_list = response.data.data
          
      } catch (error) {
        console.error('Error:', error)
      }
    }, 
    async get_unit2(rental_area_unit_id){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          id: rental_area_unit_id,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_unit2(form)

        this.unitlist = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_all_rental_area_unit(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_all_rental_area_unit(form)

        this.rental_area_unitlist = response.data.data


        // กรองข้อมูลซ้ำโดยอิงตาม id อย่างเดียว
        const uniqueById = new Map()

        this.rental_area_unitlist.forEach(item => {
          if (!uniqueById.has(item.id)) {
            uniqueById.set(item.id, item) // เก็บทั้ง item (name ซ้ำได้)
          }
        })
        this.groupedRentalAreaUnit = Array.from(uniqueById.values())

        // ✅ กำหนดค่าเริ่มต้นให้ value3.rental_area_unit_name เป็น name
        this.Newlist.complianceDetails.forEach(value3 => {
          const selectedUnit = this.groupedRentalAreaUnit.find(unit => unit.id === value3.rental_area_unit_id)

          value3.rental_area_unit_name = selectedUnit ? selectedUnit.unit : null
        })
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_all_rental_area_unitExtra(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          position_name: this.userData.position_name,
          store_id: this.store_id_extra,
        }
        const response = await apiService.get_all_rental_area_unit(form)

        this.rental_area_unitlist = response.data.data


        // กรองข้อมูลซ้ำโดยอิงตาม id อย่างเดียว
        const uniqueById = new Map()

        this.rental_area_unitlist.forEach(item => {
          if (!uniqueById.has(item.id)) {
            uniqueById.set(item.id, item) // เก็บทั้ง item (name ซ้ำได้)
          }
        })
        this.groupedRentalAreaUnit = Array.from(uniqueById.values())

        // ✅ กำหนดค่าเริ่มต้นให้ value3.rental_area_unit_name เป็น name
        this.NewlistExtra.complianceextraDetails.forEach(value3 => {
          const selectedUnit = this.groupedRentalAreaUnit.find(unit => unit.id === value3.rental_area_unit_id)

          value3.rental_area_unit_name = selectedUnit ? selectedUnit.unit : null
        })
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_all_reason_filter(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
        }
        const response = await apiService.get_all_reason_filter(form)

        this.reasonlist = response.data.data
        this.reasonlist.push({
          id: 9999,
          name: 'อื่นๆ',
        })
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_all_Competitor_filter(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
        }
        const response = await apiService.get_all_Competitor_filter(form)

        this.Competitorlist = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_all_posm_filter(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
        }
        const response = await apiService.get_all_posm_filter(form)

        this.posmlist = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_all_product_filter(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
        }
        const response = await apiService.get_all_product_filter2(form)

        this.substitute_products_list = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },  

    // async get_product_by_groupcustomerid(storelist,store_id){
    //   const vm = this;
    //   const groupCustomerId = vm.getGroupCustomerId(storelist, store_id);
    //     if(groupCustomerId){
    //       const response = await apiService.get_product_by_groupcustomerid(groupCustomerId);
    //       vm.productlist = response.data.data;
    //     }else{
    //       vm.productlist = [];
    //     }
    // },
    async check_status_area(key){
      // this.Newlist.complianceDetails[key].placement_point_id = null;
    },
  },
}
</script>

<style scoped>
/* ปรับขนาดโลโก้และตัวหนังสือ */
.app-logo-image {
  max-block-size: 60px;
  transition: max-block-size 0.3s ease;
}

.app-logo-title {
  font-size: 1.25rem;
  margin-inline-start: 8px;
  transition: font-size 0.3s ease;
}

/* ปรับปุ่ม */
.responsive-btn {
  font-size: 1rem;
  padding-block: 6px;
  padding-inline: 16px;
  transition: all 0.3s ease;
}

/* ✅ Responsive เมื่อหน้าจอเล็กกว่า 470px */
@media (max-width: 470px) {
  .app-logo-image {
    inline-size: 100%;
    max-block-size: 60px;
  }

  .app-logo-image svg {
    width: 100% !important; /* stylelint-disable-line liberty/use-logical-spec */
    max-width: 120px; /* stylelint-disable-line liberty/use-logical-spec */
    height: auto !important; /* stylelint-disable-line liberty/use-logical-spec */
  }

  .app-logo-title {
    font-size: 0.9rem;
  }

  .responsive-btn {
    font-size: 0.75rem;
    padding-block: 4px;
    padding-inline: 10px;
  }
}

.custom-list-title {
  max-width: 100% !important;
  line-height: 1.4 !important;
  overflow-wrap: break-word;
  white-space: normal !important;
  word-break: break-word !important;
}

.v-overlay-content .v-list-item-title {
  max-width: 100% !important;
  line-height: 1.4 !important;
  overflow-wrap: break-word;
  white-space: normal !important;
  word-break: break-word !important;
}

.v-chip {
  max-width: 100% !important;
  line-height: 1.2;
  white-space: normal !important;
  word-break: break-word !important;
}

@media (max-width: 600px) {
  .v-overlay-content {
    width: 100vw !important;
    max-width: 100vw !important;
    padding-inline: 12px;
  }
}
</style>

<style lang="scss" scoped>
@media (min-width: 960px) {
  .v-container {
    max-inline-size: 100%;
  }
}

.landing-hero {
  border-radius: 0 0 50px 50px;
  padding-block: 6.75rem 10rem;

  // padding-block: 9.75rem 22rem;
}

.hero-animation-img {
  inline-size: 90%;
  inset-block-start: -25rem;
  inset-inline-start: 4.425rem;
  margin-inline: auto;
}

section {
  display: block;
}

.blank-section {
  background-color: rgba(var(--v-theme-surface));
  min-block-size: 25rem;
}

@media (min-width: 1280px) and (max-width: 1440px) {
  .blank-section {
    min-block-size: 18rem;
  }

  .landing-hero {
    padding-block-end: 22rem;
  }

  .hero-animation-img {
    inset-block-start: -25rem;
  }
}

@media (min-width: 900px) and (max-width: 1279px) {
  .blank-section {
    min-block-size: 13rem;
  }

  .landing-hero {
    padding-block-end: 14rem;
  }

  .hero-animation-img {
    inset-block-start: -17rem;
    inset-inline-start: 2.75rem;
  }
}

@media (min-width: 768px) and (max-width: 899px) {
  .blank-section {
    min-block-size: 12rem;
  }

  .landing-hero {
    padding-block-end: 12rem;
  }

  .hero-animation-img {
    inset-block-start: -15rem;
    inset-inline-start: 2.5rem;
  }
}

@media (min-width: 600px) and (max-width: 767px) {
  .blank-section {
    min-block-size: 12rem;
  }

  .landing-hero {
    padding-block-end: 8rem;
  }

  .hero-animation-img {
    inset-block-start: -11rem;
    inset-inline-start: 2rem;
  }
}

@media (min-width: 425px) and (max-width: 600px) {
  .blank-section {
    min-block-size: 8rem;
  }

  .landing-hero {
    padding-block-end: 8rem;
  }

  .hero-animation-img {
    inset-block-start: -9rem;
    inset-inline-start: 1.7rem;
  }
}

@media (min-width: 300px) and (max-width: 424px) {
  .blank-section {
    min-block-size: 4rem;
  }

  .landing-hero {
    padding-block-end: 6rem;
  }

  .hero-animation-img {
    inset-block-start: -7rem;
    inset-inline-start: 1.25rem;
  }
}

.landing-hero::before {
  position: absolute;
  background-repeat: no-repeat;
  inset-block: 0;
  opacity: 0.5;
}

.landing-hero-dark-bg {
  background-color: #25293c;
  background-image: url("@images/front-pages/backgrounds/hero-bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.landing-hero-light-bg {
  background: url("@images/front-pages/backgrounds/hero-bg.png") center no-repeat, linear-gradient(138.18deg, #eae8fd 0%, #fce5e6 94.44%);
  background-size: cover;
}

@media (min-width: 650px) {
  .hero-text-box {
    inline-size: 38rem;
    margin-block-end: 1rem;
    margin-inline: auto;
  }
}

@media (max-width: 599px) {
  .hero-title {
    font-size: 1.5rem !important;
    line-height: 2.375rem !important;
  }
}

.hero-title {
  animation: shine 2s ease-in-out infinite alternate;
  background: linear-gradient(135deg, #28c76f 0%, #5a4aff 47.92%, #ff3739 100%);
  //  stylelint-disable-next-line property-no-vendor-prefix
  -webkit-background-clip: text;
  background-clip: text;
  font-size: 42px;
  font-weight: 800;
  line-height: 48px;
  -webkit-text-fill-color: rgba(0, 0, 0, 0%);
}

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }

  80% {
    background-position: 50% 90%;
  }

  100% {
    background-position: 91% 100%;
  }
}

.hero-dashboard-img {
  margin-block: 0;
  margin-inline: auto;
  transform-style: preserve-3d;
  transition: all 0.35s;

  img {
    inline-size: 100%;
  }
}

.hero-elements-img {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
}

.feature-cards {
  margin-block-start: 6.25rem;
}

.hero-btn-item {
  inset-block-start: 80%;
  inset-inline-start: 5%;
}
</style>

<style lang="scss" scoped>
.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  &:not(:hover) {
    color: rgb(var(--v-theme-on-surface));
  }
}

.page-link {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

@media (max-width: 1280px) {
  .nav-menu {
    gap: 2.25rem;
  }
}

@media (min-width: 1920px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1440px - 32px);
    }
  }
}

@media (min-width: 1280px) and (max-width: 1919px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1200px - 32px);
    }
  }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(900px - 32px);
    }
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 64px);
    }
  }
}

@media (max-width: 600px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 32px);
    }
  }
}

.nav-item-img {
  border: 10px solid rgb(var(--v-theme-background));
  border-radius: 10px;
}

.active-link {
  color: rgb(var(--v-theme-primary)) !important;
}

.app-bar-light {
  border: 2px solid rgba(var(--v-theme-surface), 68%);
  border-radius: 0.5rem;
  background-color: rgba(var(--v-theme-surface), 38%);
  transition: all 0.1s ease-in-out;
}

.app-bar-dark {
  border: 2px solid rgba(var(--v-theme-surface), 68%);
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 4%);
  transition: all 0.1s ease-in-out;
}

.app-bar-scrolled {
  border-radius: 0.5rem;
  background-color: rgb(var(--v-theme-surface)) !important;
  transition: all 0.1s ease-in-out;
}

.front-page-navbar::after {
  position: fixed;
  z-index: 2;
  backdrop-filter: saturate(100%) blur(6px);
  block-size: 5rem;
  content: "";
  inline-size: 100%;
}
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutMixins;

.mega-menu {
  position: fixed !important;
  inset-block-start: 5.4rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);

  @include layoutMixins.rtl {
    transform: translateX(50%);
  }
}

.front-page-navbar {
  .v-toolbar__content {
    padding-inline: 30px !important;
  }

  .v-toolbar {
    inset-inline: 0 !important;
    margin-block-start: 1rem !important;
    margin-inline: auto !important;
  }
}

.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

#navigation-drawer-close-btn {
  position: absolute;
  cursor: pointer;
  inset-block-start: 0.5rem;
  inset-inline-end: 1rem;
}

.fancybox__container {
  z-index: 9999;
}

.csseye {
  position: absolute;
  z-index: 99999;
  border: none;
  border-radius: 100%;
  background: white;
  color: #ffb400;
  cursor: pointer;
  font-size: 18px;
  inset-block-start: 10px;
  inset-inline-start: 10px;
}

div:where(.swal2-container) {
  z-index: 9999 !important;
}
</style>

<style scoped>
.custom-datepicker-menu {
  position: absolute !important;
  z-index: 9999 !important;
  inset-block-start: auto !important;
  inset-inline-start: auto !important;
  transform: none !important;
}
</style>
