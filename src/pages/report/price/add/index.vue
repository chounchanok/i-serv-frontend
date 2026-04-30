<script setup>
import noimg from '@images/noimg.png'
</script>

<template>
  <div>
    <VRow>
      <!-- <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6"> -->
      <VCol
        cols="12"
        md="6"
      >
        <h4
          class="text-h4 font-weight-medium"
          style="color: white;"
        >
          Price & Promotion
        </h4>
        <!--
          <div class="text-body-1">
          Orders placed across your store
          </div> 
        -->
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <!--
          <VBtn variant="tonal" color="secondary" @click="get_all_week">
          โหลดข้อมูล
          </VBtn> 
        -->

        <VRow
          class="fixed-new"
          style="align-items: end;justify-content: end;"
        >
          <VCol
            v-if="userData.position_name != 'พนักงาน'"
            cols="8"
            md="5"
            style="display: flex;align-items: center;justify-content: center;gap: 5px;"
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
            cols="8"
            md="5"
            style="display: flex;align-items: center;justify-content: center;gap: 5px;"
          >
            <VTextField
              v-model="endDate_select"
              label="วันที่สิ้นสุด"
              type="date"
              density="compact"
            />
          </VCol>
          
          <VCol
            cols="8"
            md="2"
            style="display: flex;align-items: center;justify-content: center;gap: 5px;"
          >
            <VBtn
              color="info"
              variant="elevated"
              class="responsive-btn"
              @click="exportData('excelprice')"
            >
              Export
            </VBtn>
            
            <VBtn
              v-if="Productlist.id>0 && userData.position_name != 'Assistant Management' && userData.position_name != 'Management'"
              color="primary"
              @click="save_PricePromotion_confirm"
            >
              บันทึก
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <VRow>
      <VCol md="12">
        <!-- 👉 Variants -->
        <VCard class="mb-6">
          <VCardText>
            <VRow>
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
                  @update:model-value="get_all_store_user"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete 
                  v-model="store_id" 
                  label="Store"
                  placeholder="เลือก Store" 
                  :items="storelist" 
                  item-title="store_name_report"
                  item-value="store_id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:model-value="get_group_name2"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppAutocomplete 
                  v-model="group_id" 
                  label="Group name"
                  placeholder="เลือก Group name" 
                  :items="datalist" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:model-value="set_group_id"
                />
              </VCol>
              <!--
                <VCol cols="12" md="4">
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
                </VCol> 
              -->
              <VCol
                cols="6"
                md="2"
              >
                <AppDateTimePicker 
                  :key="datePickerKey" 
                  v-model="date_now" 
                  label="โหลดข้อมูล" 
                  placeholder="โหลดข้อมูล" 
                  :min="minDate" 
                  :max="maxDate"
                  :config="datePickerConfig"
                  :disabled="dis_date"
                  @change="get_all_PricePromotion"
                />
              </VCol>
              <VBtn
                color="secondary"
                style="margin-block-start: 36px;"
                :disabled="!user_id || !store_id"
                @click="confirmRenewProductPricePromotion"
              >
                อัปเดตรายการสินค้า
              </VBtn>
            </VRow>
          </VCardText>
          <VDivider />
            
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="2"
              >
                <AppDateTimePicker 
                  v-model="datesave" 
                  label="วันที่ทำรายงาน" 
                  placeholder="เลือกวันที่" 
                  :readonly="true"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
                class="d-flex align-self-center"
              >
                <VCheckbox
                  v-model="filterMSL"
                  label="MSL"
                />
              </VCol>
            </VRow>
          </VCardText>
          <VDivider />

          <VCardText v-if="Productlist">
            <div
              v-if="Productlist.pricePromotionDetails"
              class="custom-tabs"
              style="text-align: center;"
            >
              <button
                v-for="(value, index_1) in filteredGroupedData"
                :key="'group1-' + index_1"
                :class="{ active: currentTab === index_1 }"
                @click="currentTab = index_1; currentTab2 = 0"
              >
                {{ index_1 }}
              </button>

              <button
                v-for="(value, index_2) in filteredGroupedData2"
                :key="'group2-' + index_2"
                :class="{ active: currentTab === index_2 }"
                @click="currentTab = index_2; currentTab2 = 0"
              >
                {{ index_2 }}
              </button>
            </div>

            <div
              v-if="Productlist.pricePromotionDetails"
              class="custom-tabs"
              style="padding-block: 5px; padding-inline: 0;"
            >
              <!-- Group 1 -->
              <div
                v-for="(value, index_3) in filteredGroupedData"
                v-show="currentTab === index_3"
                :key="'group1-tab-' + index_3"
              >
                <div
                  class="inner-tab-buttons"
                  style="margin-block-end: 15px;text-align: start;"
                >
                  <button
                    v-for="(valuex, indexx) in value"
                    :key="'inner1-' + indexx"
                    :class="{ active: currentTab2 === indexx }"
                    @click="currentTab2 = indexx"
                  >
                    {{ indexx }}
                  </button>
                </div>

                <div
                  v-for="(valuex, indexx) in value"
                  v-show="currentTab2 === indexx"
                  :key="'inner-content1-' + indexx"
                >
                  <VRow
                    v-for="(value2, index2) in valuex"
                    :key="index2"
                  >
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <VAlert
                        color="primary"
                        style="font-size: 1.3em;"
                      >
                        {{ index2 }}
                      </VAlert>
                    </VCol> 
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <template
                        v-for="(value3,index3) in value2"
                        :key="index3"
                      >
                        <VRow :style="(index3%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                          <VCol
                            cols="12"
                            md="1"
                            class="d-flex align-self-end text-center"
                            style="justify-content: center;"
                          >
                            <a
                              v-if="value3.mapProductStoreList.product.picture"
                              :data-fancybox="'booklet-gal'+value3.mapProductStoreList.id"
                              :href="apiurl+value3.mapProductStoreList.product.picture"
                              style="display: flex;align-items: center;justify-content: center;"
                            >
                              <div class="img-width">
                                <img
                                  :src="apiurl+value3.mapProductStoreList.product.picture"
                                  class="card-img-top"
                                  :alt="apiurl+value3.mapProductStoreList.product.picture"
                                  style="block-size: 50px;inline-size: 50px;"
                                >
                              </div>
                            </a>
                            <div
                              v-else
                              class="img-width"
                            >
                              <img
                                :src="noimg"
                                class="card-img-top"
                                style="block-size: 50px;inline-size: 50px;"
                              >
                            </div>
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                            style="display: flex;align-items: center;"
                          >
                            {{ (index3+1) }} {{ value3.mapProductStoreList.product.name }} {{ (value3.mapProductStoreList.product.flavor?'('+value3.mapProductStoreList.product.flavor+')':'') }}
                          </VCol>
                          <VCol
                            cols="6"
                            md="2"
                            class="d-flex align-self-center"
                            style="display: flex;align-items: end;justify-content: center;padding: 0;"
                          >
                            <VCheckbox
                              v-model="value3.not_sell"
                              label="ไม่ขาย"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="1"
                            class="d-flex align-self-end"
                          >
                            <AppTextField
                              v-model="value3.price"
                              placeholder="0"
                              type="number"
                              label="ราคาปกติ"
                              :min="0"
                              :disabled="(value3.not_sell==true || value3.not_sell=='Y')"
                              @keydown="preventInvalidKeys"
                              @keyup="change_data2(index,indexx,index2,index3,value3.id,1)"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="3"
                          >
                            <AppSelect
                              v-model="value3.promotion_id"
                              :items="promotionlist"
                              item-title="name"
                              item-value="id"
                              :disabled="(value3.not_sell==true || value3.not_sell=='Y')"
                              placeholder="เลือก"
                              label="Promotion"
                            />
                          </VCol>
                          <VCol
                            cols="6"
                            md="1"
                            class="d-flex align-self-end"
                          >
                            <AppTextField
                              v-model="value3.special_price"
                              placeholder="0"
                              type="number"
                              label="ราคาพิเศษ"
                              :min="0"
                              :disabled="value3.not_sell === true || value3.not_sell === 'Y' || isNormalPrice(value3.promotion_id)"
                              @keydown="preventInvalidKeys"
                              @keyup="change_data2(index,indexx,index2,index3,value3.id,2)"
                            />
                          </VCol>
                          <VCol
                            cols="6"
                            md="3"
                          >
                            <DemoDateTimePickerRange
                              v-model="value3.daterange"
                              label="ช่วงวันที่"
                              :disabled="value3.not_sell === true || value3.not_sell === 'Y' || isNormalPrice(value3.promotion_id)"
                              placeholder="ช่วงวันที่"
                            />
                          </VCol>
                          <VCol
                            cols="6"
                            md="1"
                            class="d-flex align-self-center"
                            :style="'display: '+(value3.not_sell==true || value3.not_sell=='Y'?'none !important':'flex')+'; align-items: end; justify-content: center;'"
                          >
                            <input
                              :id="'fileInput'+value3.id"
                              type="file"
                              multiple
                              accept="image/png, image/jpeg, image/jpg, image/gif"
                              style="display: none;"
                              @change="(event) => handleFiles(event, currentTab,indexx,index2,index3,value3.id)"
                            >
                            <VIcon
                              size="30"
                              icon="tabler-photo-plus"
                              @click="selectFiles(currentTab,indexx,index2,index3,value3.id)"
                            />
                            <VIcon
                              v-if="value3.previews.length>0"
                              size="30"
                              icon="tabler-eye"
                              @click="show_preview1(currentTab,indexx,index2,index3,value3.id)"
                            />
                            <VIcon
                              v-if="value3.previews.length>0"
                              size="30"
                              icon="tabler-edit"
                              @click="show_preview2(currentTab,indexx,index2,index3,value3.id)"
                            />
                            {{ value3.previews.url }}
                          </VCol>
                          <VCol
                            cols="12"
                            md="8"
                          >
                            <AppTextField
                              v-model="value3.note"
                              placeholder=""
                              type="text"
                              label="หมายเหตุ"
                              :disabled="value3.not_sell === true || value3.not_sell === 'Y' || isNormalPrice(value3.promotion_id)"
                              @keyup="change_data2(currentTab,indexx,index2,index3,value3.id,6)"
                            />
                          </VCol>
                        </VRow>
                      </template>
                    </VCol> 
                  </VRow>
                </div>
              </div>

              <!-- Group 2 -->
              <div
                v-for="(value, index) in filteredGroupedData2"
                v-show="currentTab === index"
                :key="'group2-tab-' + index"
              >
                <div
                  class="inner-tab-buttons"
                  style="margin-block-end: 15px;text-align: start;"
                >
                  <button
                    v-for="(valuex, indexx) in value"
                    :key="'inner2-' + indexx"
                    :class="{ active: currentTab2 === indexx }"
                    @click="currentTab2 = indexx"
                  >
                    {{ indexx }}
                  </button>
                </div>

                <div
                  v-for="(valuex, indexx) in value"
                  v-show="currentTab2 === indexx"
                  :key="'inner-content2-' + indexx"
                >
                  <VRow
                    v-for="(value2, index2) in valuex"
                    :key="index2"
                  >
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <VAlert
                        color="primary"
                        style="font-size: 1.3em;"
                      >
                        {{ index2 }}
                      </VAlert>
                    </VCol> 
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <template
                        v-for="(value3,index3) in value2"
                        :key="index3"
                      >
                        <VRow :style="(index3%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                          <VCol
                            cols="12"
                            md="1"
                            class="d-flex align-self-end text-center"
                            style="justify-content: center;"
                          >
                            <a
                              v-if="value3.mapProductStoreList.product.picture"
                              :data-fancybox="'booklet-gal'+value3.mapProductStoreList.id"
                              :href="apiurl+value3.mapProductStoreList.product.picture"
                              style="display: flex;align-items: center;justify-content: center;"
                            >
                              <div class="img-width">
                                <img
                                  :src="apiurl+value3.mapProductStoreList.product.picture"
                                  class="card-img-top"
                                  :alt="apiurl+value3.mapProductStoreList.product.picture[0].name"
                                  style="block-size: 50px;inline-size: 50px;"
                                >
                              </div>
                            </a>
                            <div
                              v-else
                              class="img-width"
                            >
                              <img
                                :src="noimg"
                                class="card-img-top"
                                style="block-size: 50px;inline-size: 50px;"
                              >
                            </div>
                          </VCol>
                          <VCol
                            cols="12"
                            md="4"
                            style="display: flex;align-items: center;"
                          >
                            {{ (index3+1) }} {{ value3.mapProductStoreList.product.name }} {{ (value3.mapProductStoreList.product.flavor?'('+value3.mapProductStoreList.product.flavor+')':'') }}
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
                            cols="6"
                            md="1"
                            class="d-flex align-self-center"
                            style="display: flex; align-items: end; justify-content: center;"
                          >
                            <input
                              :id="'fileInput'+value3.id"
                              type="file"
                              multiple
                              accept="image/png, image/jpeg, image/jpg, image/gif"
                              style="display: none;"
                              @change="(event) => handleFiles_promotion(event, currentTab,indexx,index2,index3,value3.id)"
                            >
                            <VIcon
                              size="30"
                              icon="tabler-photo-plus"
                              @click="selectFiles_promotion(currentTab,indexx,index2,index3,value3.id)"
                            />
                            <VIcon
                              v-if="value3.previews.length>0"
                              size="30"
                              icon="tabler-eye"
                              @click="show_preview1_promotion(currentTab,indexx,index2,index3,value3.id)"
                            />
                            <VIcon
                              v-if="value3.previews.length>0"
                              size="30"
                              icon="tabler-edit"
                              @click="show_preview2_promotion(currentTab,indexx,index2,index3,value3.id)"
                            />
                            {{ value3.previews.url }}
                          </VCol>
                          <VCol
                            cols="12"
                            md="3"
                          >
                            <AppTextField
                              v-model="value3.note"
                              placeholder=""
                              type="text"
                              label="หมายเหตุ"
                            />
                          </VCol>

                          <VCardText>
                            <VExpansionPanels variant="accordion">
                              <VExpansionPanel>
                                <VExpansionPanelTitle>
                                  4 Week
                                </VExpansionPanelTitle>
                                <VExpansionPanelText>
                                  <VRow>
                                    <VCol
                                      cols="12"
                                      md="6"
                                      class="d-flex align-self-end"
                                      style="padding: 4px;"
                                    >
                                      <VRow style="padding: 15px;">
                                        <VCol
                                          cols="12"
                                          md="12"
                                          class="d-flex align-self-end"
                                          style="display: flex;align-items: center;justify-content: center;border: 1px solid rgb(0, 0, 0);border-start-end-radius: 8px;border-start-start-radius: 8px;"
                                        >
                                          <div style="font-size: 18px;font-weight: bold;">
                                            week1
                                          </div>
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_start"
                                            placeholder="0"
                                            type="text"
                                            label="ตั้งต้น"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_in"
                                            placeholder="0"
                                            type="text"
                                            label="รับเข้า"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_out"
                                            placeholder="0"
                                            type="text"
                                            label="ใช้ไป"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.stock"
                                            placeholder="0"
                                            type="text"
                                            label="คงเหลือ"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id)"
                                          />
                                        </VCol>
                                      </VRow>
                                    </VCol>
                                    <VCol
                                      cols="12"
                                      md="6"
                                      class="d-flex align-self-end"
                                      style="padding: 4px;"
                                    >
                                      <VRow style="padding: 15px;">
                                        <VCol
                                          cols="12"
                                          md="12"
                                          class="d-flex align-self-end"
                                          style="display: flex;align-items: center;justify-content: center;border: 1px solid rgb(0, 0, 0);border-start-end-radius: 8px;border-start-start-radius: 8px;"
                                        >
                                          <div style="font-size: 18px;font-weight: bold;">
                                            week2
                                          </div>
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_start2"
                                            placeholder="0"
                                            type="text"
                                            label="ตั้งต้น"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,3)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_in2"
                                            placeholder="0"
                                            type="text"
                                            label="รับเข้า"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,3)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_out2"
                                            placeholder="0"
                                            type="text"
                                            label="ใช้ไป"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,4)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.stock2"
                                            placeholder="0"
                                            type="text"
                                            label="คงเหลือ"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,5)"
                                          />
                                        </VCol>
                                      </VRow>
                                    </VCol>
                                    <VCol
                                      cols="12"
                                      md="6"
                                      class="d-flex align-self-end"
                                      style="padding: 4px;"
                                    >
                                      <VRow style="padding: 15px;">
                                        <VCol
                                          cols="12"
                                          md="12"
                                          class="d-flex align-self-end"
                                          style="display: flex;align-items: center;justify-content: center;border: 1px solid rgb(0, 0, 0);border-start-end-radius: 8px;border-start-start-radius: 8px;"
                                        >
                                          <div style="font-size: 18px;font-weight: bold;">
                                            week3
                                          </div>
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_start3"
                                            placeholder="0"
                                            type="text"
                                            label="ตั้งต้น"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,3)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_in3"
                                            placeholder="0"
                                            type="text"
                                            label="รับเข้า"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,3)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_out3"
                                            placeholder="0"
                                            type="text"
                                            label="ใช้ไป"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,4)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.stock3"
                                            placeholder="0"
                                            type="text"
                                            label="คงเหลือ"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,5)"
                                          />
                                        </VCol>
                                      </VRow>
                                    </VCol>
                                    <VCol
                                      cols="12"
                                      md="6"
                                      class="d-flex align-self-end"
                                      style="padding: 4px;"
                                    >
                                      <VRow style="padding: 15px;">
                                        <VCol
                                          cols="12"
                                          md="12"
                                          class="d-flex align-self-end"
                                          style="display: flex;align-items: center;justify-content: center;border: 1px solid rgb(0, 0, 0);border-start-end-radius: 8px;border-start-start-radius: 8px;"
                                        >
                                          <div style="font-size: 18px;font-weight: bold;">
                                            week4
                                          </div>
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_start4"
                                            placeholder="0"
                                            type="text"
                                            label="ตั้งต้น"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,3)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_in4"
                                            placeholder="0"
                                            type="text"
                                            label="รับเข้า"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,3)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.qty_out4"
                                            placeholder="0"
                                            type="text"
                                            label="ใช้ไป"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,4)"
                                          />
                                        </VCol>
                                        <VCol
                                          cols="6"
                                          md="3"
                                          class="d-flex align-self-end"
                                          style="border: 1px solid rgb(0, 0, 0);"
                                        >
                                          <AppTextField
                                            v-model="value3.stock4"
                                            placeholder="0"
                                            type="text"
                                            label="คงเหลือ"
                                            @input="validateNumber($event)"
                                            @keyup="cal_stock1(index,indexx,index2,index3,value3.id,5)"
                                          />
                                        </VCol>
                                      </VRow>
                                    </VCol>
                                  </VRow>
                                </VExpansionPanelText>
                              </VExpansionPanel>
                            </VExpansionPanels>
                          </VCardText>
                        </VRow>
                      </template>
                    </VCol> 
                  </VRow>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VDialog
      v-model="isDialogVisible"
      max-width="600"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Preview">
        <VCardText>
          <VRow>
            <VCol
              v-for="(swiperImg,index) in imagePreviews"
              :key="index"
              cols="4"
              sm="4"
              md="4"
            >
              <div style="position: relative;">
                <button
                  class="delete-button"
                  :data-id="swiperImg.id"
                  :data-name="swiperImg.name"
                  style="position: absolute;z-index: 9; border: none; background: none; color: red; cursor: pointer; font-size: 18px; inset-block-start: 10px; inset-inline-end: 10px;"
                  @click="deleteImage(swiperImg.id,swiperImg.name,index)"
                >
                  ✖
                </button>
                <VImg
                  :src="swiperImg.url"
                  style="cursor: pointer;"
                  @click="openInNewTab(swiperImg.url)"
                />
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3" />
      </VCard>
    </VDialog>

    <VDialog
      v-model="isDialogVisible_promotion"
      max-width="600"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible_promotion = !isDialogVisible_promotion" />

      <!-- Dialog Content -->
      <VCard title="Preview">
        <VCardText>
          <VRow>
            <VCol
              v-for="(swiperImg,index) in imagePreviews_promotion"
              :key="index"
              cols="4"
              sm="4"
              md="4"
            >
              <div style="position: relative;">
                <button
                  class="delete-button"
                  :data-id="swiperImg.id"
                  :data-name="swiperImg.name"
                  style="position: absolute;z-index: 9; border: none; background: none; color: red; cursor: pointer; font-size: 18px; inset-block-start: 10px; inset-inline-end: 10px;"
                  @click="deleteImage_promotion(swiperImg.id,swiperImg.name,index)"
                >
                  ✖
                </button>
                <VImg
                  :src="swiperImg.url"
                  style="cursor: pointer;"
                  @click="openInNewTab(swiperImg.url)"
                />
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3" />
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import apiService from '@/services/api'
import Swal from 'sweetalert2'

import { register } from 'swiper/element/bundle'
import { Swiper, SwiperSlide } from 'swiper/vue'

import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'

register()

function getFormattedDateThreeMonthsAgo() {
  const date = new Date()
  
  // ตั้งค่าเดือนให้เป็น 3 เดือนก่อนหน้า (JavaScript จะจัดการเรื่องปีให้เอง)
  date.setMonth(date.getMonth() - 3)

  const year = date.getFullYear()

  // getMonth() คืนค่าเป็น 0-11 จึงต้อง +1 และ padStart เพื่อให้เป็น 2 หลักเสมอ (เช่น 08)
  const month = String(date.getMonth() + 1).padStart(2, '0')

  // getDate() และ padStart เพื่อให้เป็น 2 หลักเสมอ (เช่น 01, 09, 15)
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data: () => ({
    apiurl: null,
    filterMSL: false,
    images: [swiper31, swiper32, swiper33, swiper34, swiper35],
    isDialogVisible: false,
    isDialogVisible_promotion: false,
    dis_date: true,
    currentTab: 0,
    currentTab2: 0,
    userData: {},
    date_now_create: new Date(),
    date_now: null,
    datesave: new Date().getFullYear() + '-' + 
                      String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                      String(new Date().getDate()).padStart(2, '0'),
    maxDate: new Date().toISOString().split("T")[0], // วันที่ปัจจุบัน
    minDate: getFormattedDateThreeMonthsAgo(), // 3 เดือนก่อนหน้า
    currentMonth: new Date().toLocaleString('default', { month: '2-digit' }),
    currentYear: new Date().getFullYear(),
    specificDisabledDates: [],
    groupedData: [],
    groupedData2: [],
    select_store: '',
    breadcrumbs: [],

    // date_now:new Date(),
    date_end: new Date(),
    rowdata: [],
    show_p: false,
    datalist: [],
    user_id: null,
    storelist: [],
    promotionlist: [],
    Productlist: [],
    Productlist_old: [],
    group_id: null,
    store_id: null,
    datePickerConfig: {},
    datePickerKey: 0, // key สำหรับบังคับให้ AppDateTimePicker รีเรนเดอร์ใหม่
    color_active: 0,
    color_active1: 0,
    color_active2: 0,
    color_active3: 0,
    color_active4: 0,
    color_active5: 0,
    color_active6: 0,

    imagePreviews: [],
    imagePreviews_promotion: [],
    user_for_admin: [],
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
    // date_now(newDate) {
    //   const selectedDate = new Date(newDate);
    //   const minDate = new Date(this.minDate);
    //   const maxDate = new Date(this.maxDate);

    //   if (selectedDate < minDate) {
    //     this.date_now = this.minDate; // ตั้งค่าเป็น minDate หากเลือกย้อนหลังเกิน 7 วัน
    //   } else if (selectedDate > maxDate) {
    //     this.date_now = this.maxDate; // ตั้งค่าเป็น maxDate หากเลือกวันที่อนาคต
    //   }
    // },
    specificDisabledDates: {
      handler() {
        this.updateDatePickerConfig() // เรียกฟังก์ชันเพื่ออัปเดต config เมื่อ specificDisabledDates เปลี่ยนแปลง
      },
      immediate: true, // เรียกใช้งานทันทีเมื่อโหลดครั้งแรก
    },
  },
    
  // computed: {
  //   datePickerConfig() {
  //     return {
  //       dateFormat: 'Y-m-d',
  //       disable: [
  //         { from: `01-01-${this.currentYear}`, to: this.minDate }, // ปิดการใช้งานช่วงวันที่ก่อน minDate
  //         ...this.specificDisabledDates.map(date => ({ from: date, to: date })) // ปิดการใช้งานวันที่เฉพาะเจาะจง
  //       ]
  //     };
  //   }
  // },
  mounted(){

    this.$nextTick(function(){
      const userData = useCookie('userData')

      this.apiurl = import.meta.env.VITE_API_URL
      this.userData = userData.value
      console.log(this.userData)

      // this.getall();
      this.get_all_store_user()
      this.get_all_promotion()
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
      // เพิ่ม event listener ให้กับทุกองค์ประกอบที่มี class="nav-link"
      // document.querySelectorAll('.nav-link').forEach(element => {
      //     element.addEventListener('click', () => {
      //       console.log('คลิกเจอ');
      //     });
      // });
      // const observer = new MutationObserver(() => {
      //     document.querySelectorAll('.nav-link').forEach(element => {
      //         // ตรวจสอบว่า event listener มีอยู่แล้วหรือไม่
      //         if (!element.hasAttribute('data-confirm-added')) {
      //             element.addEventListener('click', (event) => {
      //                 alert('ข้อมูลของคุณจะไม่ได้บันทึกหากเปลี่ยนเมนู');
      //                 // const confirmLeave = confirm('Changes you made may not be saved.');
      //                 // if (!confirmLeave) {
      //                 //     console.log('กดยกเลิก');
      //                 //     event.preventDefault(); // ป้องกันการนำทางเมื่อกด Cancel
      //                 //     return false; // หยุดการนำทางในบางเบราว์เซอร์
      //                 // } else {
      //                 //     console.log('คลิกเจอ');
      //                 // }
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
      baseUrl += `excelprice/${this.userData.id || 'null'}/${this.store_id || 'null'}/${this.group_id || 'null'}/${this.user_id || 'null'}`

      const finalUrl = `${baseUrl}/${this.startDate_select}/${this.endDate_select}`
        
      console.log("Exporting to URL:", finalUrl)

      window.open(finalUrl, '_blank')
    },
    async confirmRenewProductPricePromotion() {
      Swal.fire({
        title: 'ยืนยันการ อัปเดตรายการสินค้าใหม่?',
        text: 'หากดำเนินการ ข้อมูลเดิมที่เคยกรอกไว้ของวันนี้จะหายไป',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      }).then(result => {
        if (result.isConfirmed) {
          this.renewProductPricePromotion()
        }
      })
    },

    async renewProductPricePromotion() {
      if (!this.user_id || !this.store_id) {
        Swal.fire({ icon: 'warning', title: 'กรุณาเลือก User และ Store' })
        
        return
      }
      try {
        const dateTime = new Date()
        const dateOnly = new Date(dateTime).toISOString().split('T')[0]

        const form = {
          user_id: this.user_id,
          store_id: this.store_id,
          datenow: (this.date_now?this.date_now:dateOnly),
        }

        const response = await apiService.renew_product_price(form)
        if (response.data.status === 'success') {
          Swal.fire({ icon: 'success', title: 'อัปเดตรายการสินค้าสำเร็จ' })
          this.get_all_PricePromotion() // โหลดข้อมูลใหม่
        } else {
          Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: response.data.message })
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message })
      }
    },

    isNormalPrice(promotionId) {
      const promo = this.promotionlist.find(p => p.id === promotionId)
      
      return promo?.name === 'ราคาปกติ'
    },
    preventInvalidKeys(e) {
      const invalidKeys = ['-', '+', 'e', 'E', '.', ',']
      if (invalidKeys.includes(e.key)) {
        e.preventDefault()
      }
    },
    validateNumber(event) {
      let value = event.target.value

      // อนุญาตให้กรอกเฉพาะตัวเลขและทศนิยม (0-9 และ .)
      value = value.replace(/[^\d.]/g, '')
        
      // ตรวจสอบไม่ให้มีจุดทศนิยมมากกว่า 1 จุด
      if ((value.match(/\./g) || []).length > 1) {
        value = value.substring(0, value.lastIndexOf('.'))
      }

      event.target.value = value
      
      return value
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

      console.log(vm.Productlist.pricePromotionDetails[k].not_sell)
      vm.Productlist.pricePromotionDetails[k].qty = 0
        
      if (k < 0 || k >= vm.Productlist_old.pricePromotionDetails.length) return
      if (vm.Productlist_old.pricePromotionDetails[k].not_sell_old != vm.Productlist.pricePromotionDetails[k].not_sell) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    async getall(){
      try {
        const response = await apiService.get_all_MapProductStore()

        this.datalist = response.data.data
        this.datalist.forEach((item, index) => {
          this.datalist[index].Active = item.isActive == 'Y' ? true : false
          this.datalist[index].num = index + 1
        })
          
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_group_name(){
      try {
        const selectedItem = this.storelist.find(
          item => item.id === this.store_id,
        )

        const form = {
          group_customer_id: selectedItem.group_customer_id,
          account_id: selectedItem.account_id,
          account_type_id: selectedItem.account_type_id,
          user_id: this.userData.id,
          user_code: this.userData.code,
          store_code: selectedItem.store_code,
          branch_name: selectedItem.branch_name,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_group_name(form)

        this.datalist = response.data.data
        this.group_id = null
        this.date_now = null
        this.groupedData = []
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_group_name2(){
      try {
        // alert(this.store_id);
        const selectedItem = this.storelist.find(
          item => item.store_id === this.store_id,
        )

        const form = {
          group_customer_id: selectedItem.group_customer_id,
          account_id: selectedItem.account_id,
          account_type_id: selectedItem.account_type_id,
          user_id: this.userData.id,
          user_code: this.userData.code,

          // store_code: selectedItem.store_code,
          // branch_name: selectedItem.branch_name,
          position_name: this.userData.position_name,
          store_id: this.store_id,
          report: 'price',
        }

        const response = await apiService.get_group_name2(form)

        this.datalist = response.data.data.filter(x => x.mapProductStoreList.length > 0)
        this.datalist.forEach((item, index) => {
          this.datalist[index].new_name = item.name+(item.branch_name?'('+item.branch_name+')':'')
        })
        this.group_id = null
        this.date_now = null
        this.groupedData = []
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async set_group_id(){
      this.get_all_PricePromotion_date()
        
      this.dis_date = false
      if(!this.date_now){
        this.get_all_PricePromotion_first()
      }else{
        this.get_all_PricePromotion()
      }
    },
    async get_all_PricePromotion_first() {
      try {
        const form = {
          group_id: this.group_id,
          datenow: new Date().getFullYear() + '-' + 
                      String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                      String(new Date().getDate()).padStart(2, '0'),
          datesave: this.datesave,
          msl: (this.msl?'Y':'N'),
          user_id: this.userData.id,
        }

        const response = await apiService.get_all_PricePromotion_first(form)


        // if(response.data.status == "success"){
        this.date_now = new Date().getFullYear() + '-' + 
                  String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                  String(new Date().getDate()).padStart(2, '0')

        // }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_all_PricePromotion_date(){
      try {
        const dateTime = new Date()
        const dateOnly = new Date(dateTime).toISOString().split('T')[0]

        const form = {
          group_id: this.group_id,
          datenow: (this.date_now?this.date_now:dateOnly),
          store_id: this.store_id,
          user_id: this.userData.id,
        }

        const response = await apiService.get_all_PricePromotion_date(form)

        this.specificDisabledDates = response.data.specificDisabledDates
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_all_PricePromotion() {
      const vm = this

      this.color_active = 0
      this.color_active2 = 0
      this.color_active3 = 0
      if(this.date_now != ""){
        try {
          if (this.group_id) {
            if(this.userData.position_name == 'พนักงาน'){
              this.user_id = this.userData.id
            }
 
            const form = {
              group_id: this.group_id,
              datenow: this.date_now,
              datesave: this.datesave,
              msl: (this.msl?'Y':'N'),
              user_id: this.user_id,
              store_id: this.store_id,
              position_name: this.userData.position_name,
            }

            const response = await apiService.get_all_PricePromotion(form)
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
                              // if(nestedItem.picture_cut){
                              //   if(nestedItem.picture_cut.length > 0){
                              //     nestedItem.previews = nestedItem.picture_cut;
                              //   }
                              // }
                              if (nestedItem.picture) {
                                nestedItem.previews = nestedItem.picture
                                  .split(',')
                                  .map(path => ({
                                    url: this.apiurl +'/'+ path.trim(),
                                    file: null, // ยังไม่มีไฟล์แนบจริง แต่ไว้ใช้ preview
                                    name: path.trim(),
                                    id: nestedItem.id,
                                  }))
                              }
                              if(nestedItem.promotion_id == 0){
                                nestedItem.promotion_id = null
                              }
                              if(nestedItem.not_sell == 'Y'){
                                nestedItem.not_sell = true
                              }else{
                                nestedItem.not_sell = false
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
                              // if(nestedItem.picture_cut){
                              //   if(nestedItem.picture_cut.length > 0){
                              //     nestedItem.previews = nestedItem.picture_cut;
                              //   }
                              // }
                              if (nestedItem.picture) {
                                nestedItem.previews = nestedItem.picture
                                  .split(',')
                                  .map(path => ({
                                    url: this.apiurl +'/'+ path.trim(),
                                    file: null, // ยังไม่มีไฟล์แนบจริง แต่ไว้ใช้ preview
                                    name: path.trim(),
                                    id: nestedItem.id,
                                  }))
                              }
                              if(nestedItem.promotion_id == 0){
                                nestedItem.promotion_id = null
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
              
            // let pricePromotionDetails = Productlist.pricePromotionDetails;
            // pricePromotionDetails.forEach((item, index) => {
                
            //   item.stock_old = item.stock;
            //   item.note_old = item.note;
            //   item.previews = [];
            //   if(item.picture_cut.length > 0){
            //     item.previews = item.picture_cut;
            //   }
            // });
            this.Productlist = Productlist
            this.Productlist_old = Productlist_old
            console.log(this.groupedData)
            console.log(this.Productlist)
            console.log(this.Productlist_old)
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
    async save_PricePromotion_confirm(){
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
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })
          this.save_PricePromotion2()
        }
      })
    },
    async save_PricePromotion2() {
      try {
        const vm = this
        const groupedDatax = []

        const extractItems = groupedData => {
          if (typeof groupedData === 'object' && groupedData !== null) {
            Object.keys(groupedData).forEach(key => {
              const groupedItem = groupedData[key]
              if (typeof groupedItem === 'object' && groupedItem !== null) {
                Object.keys(groupedItem).forEach(subKey => {
                  const subItems = groupedItem[subKey]
                  if (typeof subItems === 'object' && subItems !== null) {
                    Object.keys(subItems).forEach(subKey2 => {
                      const item = subItems[subKey2]
                      const nestedItems = Array.isArray(item) ? item : [item]

                      nestedItems.forEach(nestedItem => {
                        groupedDatax.push({
                          ...nestedItem,
                          not_sell: nestedItem.not_sell ? 'Y' : 'N',
                        })
                      })
                    })
                  }
                })
              }
            })
          }
        }

        extractItems(this.groupedData)
        extractItems(this.groupedData2)

        // Prepare payload
        const payload = groupedDatax.map(item => {
          const cleanItem = {
            id: item.id || '',
            map_product_store_list_id: item.map_product_store_list_id || '',
            price: item.price || 0,
            not_sell: item.not_sell ? item.not_sell : 'N',
            promotion_id: item.promotion_id || 0,
            special_price: item.special_price || 0,
            daterange: item.daterange || '',
            note: item.note || '',
          }

          // กรอก qty / stock รอบที่ 1-4
          for (let i = 1; i <= 4; i++) {
            if (i == 1) {
              cleanItem[`qty_start`] = item[`qty_start`] || 0
              cleanItem[`qty_in`] = item[`qty_in`] || 0
              cleanItem[`qty_out`] = item[`qty_out`] || 0
              cleanItem[`stock`] = item[`stock`] || 0
            } else {
              cleanItem[`qty_start${i}`] = item[`qty_start${i}`] || 0
              cleanItem[`qty_in${i}`] = item[`qty_in${i}`] || 0
              cleanItem[`qty_out${i}`] = item[`qty_out${i}`] || 0
              cleanItem[`stock${i}`] = item[`stock${i}`] || 0
            }
          }

          return cleanItem
        })

        // Build FormData
        const formData = new FormData()

        formData.append('datesave', this.datesave)
        formData.append('group_id', this.group_id)

        // 🔄 ส่ง JSON String ของ payload
        formData.append('data', JSON.stringify(payload))
        if(this.userData.position_name == 'พนักงาน'){
          this.user_id = this.userData.id
        }
        formData.append('user_id', JSON.stringify(this.user_id))
        formData.append('store_id', JSON.stringify(this.store_id))
        formData.append('datenow', JSON.stringify(this.date_now))
        formData.append('datesave', JSON.stringify(this.datesave))

        // =================================================================
        // 🌟 ส่วนที่เพิ่มใหม่: เช็คว่าฟอร์มมีข้อมูลจากหน้าไหนบ้าง 🌟
        // =================================================================
        const typesToSubmit = [];
        
        if (this.groupedData && Object.keys(this.groupedData).length > 0) {
            typesToSubmit.push('Price');
        }
        
        if (this.groupedData2 && Object.keys(this.groupedData2).length > 0) {
            typesToSubmit.push('Promotion');
        }
        
        // แนบตัวแปรไปกับ FormData (ถ้าไม่มีเลยจะเป็น [] ว่างๆ ฝั่ง Backend ก็แค่ไม่ทำงาน)
        formData.append('reportTypesToSubmit', JSON.stringify(typesToSubmit));
        console.log('Task to Auto Submit:', typesToSubmit);
        // =================================================================

        // Append images
        groupedDatax.forEach((item, index) => {
          if (item.previews && Array.isArray(item.previews)) {
            item.previews.forEach((preview, fileIndex) => {
              formData.append(`picture_${index}_${fileIndex}`, preview.file)
            })
          }
        })

        console.log('FormData:', formData)

        try {
          const response2 = await apiService.create_PricePromotion2(formData)
          var data = response2.data.data

          // this.save_PricePromotion();
          console.log('Response:', data)
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
    async save_PricePromotion() {
      try {

        // ส่งไป backend
        await apiService.createOrUpdate_PricePromotionList(formData)
        this.save_PricePromotion_dup() // ดำเนินการต่อหากต้องการ
      } catch (error) {
        console.error('Error saving promotion list:', error)
      }
    },
    async save_PricePromotionbk2() {
      try {
        const payload = []

        const extractItems = groupedData => {
          if (typeof groupedData === 'object' && groupedData !== null) {
            Object.keys(groupedData).forEach(key => {
              const groupedItem = groupedData[key]
              if (typeof groupedItem === 'object' && groupedItem !== null) {
                Object.keys(groupedItem).forEach(subKey => {
                  const subItems = groupedItem[subKey]
                  if (typeof subItems === 'object' && subItems !== null) {
                    Object.keys(subItems).forEach(subKey2 => {
                      const item = subItems[subKey2]
                      const nestedItems = Array.isArray(item) ? item : [item]

                      nestedItems.forEach(nestedItem => {
                        payload.push({
                          ...nestedItem,
                          not_sell: nestedItem.not_sell ? 'Y' : 'N',
                        })
                      })
                    })
                  }
                })
              }
            })
          }
        }

        extractItems(this.groupedData)
        extractItems(this.groupedData2)

        // Build FormData
        const formData = new FormData()

        formData.append('datesave', this.datesave)
        formData.append('group_id', this.group_id)

        payload.forEach((item, index) => {
          formData.append(`data[${index}][id]`, item.id || '')
          formData.append(`data[${index}][price]`, item.price || 0)
          formData.append(`data[${index}][not_sell]`, item.not_sell)
          formData.append(`data[${index}][promotion_id]`, item.promotion_id || 0)
          formData.append(`data[${index}][special_price]`, item.special_price || 0)
          formData.append(`data[${index}][daterange]`, item.daterange || '')

          for (let i = 1; i <= 4; i++) {
            formData.append(`data[${index}][qty_start${i}]`, item[`qty_start${i}`] || 0)
            formData.append(`data[${index}][qty_in${i}]`, item[`qty_in${i}`] || 0)
            formData.append(`data[${index}][qty_out${i}]`, item[`qty_out${i}`] || 0)
            formData.append(`data[${index}][stock${i}]`, item[`stock${i}`] || 0)
          }

          formData.append(`data[${index}][note]`, item.note || '')

          // Append image files if any
          if (item.previews && Array.isArray(item.previews)) {
            item.previews.forEach((preview, fileIndex) => {
              formData.append(`data[${index}][picture][${fileIndex}]`, preview.file)
            })
          }
        })

        await apiService.createOrUpdate_PricePromotionList(formData) // ใช้ API ใหม่
        this.save_PricePromotion_dup() // ดำเนินการต่อหากต้องการ
      } catch (error) {
        console.error('Error saving promotion list:', error)
      }
    },
    async save_PricePromotionbk(){
      const vm = this
      try {
        const form2 = []
        const testform2 = []

        // console.log(Array.isArray(vm.groupedData));
        // console.log('groupedData:', JSON.stringify(vm.groupedData, null, 2));

        if (typeof vm.groupedData === 'object' && vm.groupedData !== null) {
          Object.keys(vm.groupedData).forEach(key => {
            const groupedItem = vm.groupedData[key]
              
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
                        
                      // กรณีมี Array เพิ่มอีกชั้น
                      item.forEach(nestedItem => {
                        testform2.push({
                          id: nestedItem.id,
                          price: nestedItem.price,
                          not_sell: nestedItem.not_sell,
                          promotion_id: nestedItem.promotion_id,
                          special_price: nestedItem.special_price,
                          daterange: nestedItem.daterange,
                          picture: nestedItem.picture,
                          previews: nestedItem.previews,
                          price: nestedItem.price,
                          qty_start: nestedItem.qty_start,
                          qty_in: nestedItem.qty_in,
                          qty_out: nestedItem.qty_out,
                          stock: nestedItem.stock,

                          qty_start2: nestedItem.qty_start2,
                          qty_in2: nestedItem.qty_in2,
                          qty_out2: nestedItem.qty_out2,
                          stock2: nestedItem.stock2,

                          qty_start3: nestedItem.qty_start,
                          qty_in3: nestedItem.qty_in3,
                          qty_out3: nestedItem.qty_out3,
                          stock3: nestedItem.stock3,

                          qty_start4: nestedItem.qty_start4,
                          qty_in4: nestedItem.qty_in4,
                          qty_out4: nestedItem.qty_out4,
                          stock4: nestedItem.stock4,
                          note: nestedItem.note,
                        })
                      })
                    } else {
                      // ถ้าไม่มี Array เพิ่ม
                      testform2.push({
                        id: item.id,
                        price: item.price,
                        not_sell: item.not_sell,
                        promotion_id: item.promotion_id,
                        special_price: item.special_price,
                        daterange: item.daterange,
                        picture: item.picture,
                        previews: item.previews,
                        price: item.price,
                        qty_start: item.qty_start,
                        qty_in: item.qty_in,
                        qty_out: item.qty_out,
                        stock: item.stock,

                        qty_start2: item.qty_start2,
                        qty_in2: item.qty_in2,
                        qty_out2: item.qty_out2,
                        stock2: item.stock2,

                        qty_start3: item.qty_start,
                        qty_in3: item.qty_in3,
                        qty_out3: item.qty_out3,
                        stock3: item.stock3,

                        qty_start4: item.qty_start4,
                        qty_in4: item.qty_in4,
                        qty_out4: item.qty_out4,
                        stock4: item.stock4,
                          
                        note: item.note,
                      })
                    }
                  })
                }
              })
            }
          })
        }

        if (typeof vm.groupedData2 === 'object' && vm.groupedData2 !== null) {
          Object.keys(vm.groupedData2).forEach(key => {
            const groupedItem = vm.groupedData2[key]
              
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
                        
                      // กรณีมี Array เพิ่มอีกชั้น
                      item.forEach(nestedItem => {
                        testform2.push({
                          id: nestedItem.id,
                          price: nestedItem.price,
                          not_sell: nestedItem.not_sell,
                          promotion_id: nestedItem.promotion_id,
                          special_price: nestedItem.special_price,
                          daterange: nestedItem.daterange,
                          picture: nestedItem.picture,
                          previews: nestedItem.previews,
                          price: nestedItem.price,
                          qty_start: nestedItem.qty_start,
                          qty_in: nestedItem.qty_in,
                          qty_out: nestedItem.qty_out,
                          stock: nestedItem.stock,

                          qty_start2: nestedItem.qty_start2,
                          qty_in2: nestedItem.qty_in2,
                          qty_out2: nestedItem.qty_out2,
                          stock2: nestedItem.stock2,

                          qty_start3: nestedItem.qty_start,
                          qty_in3: nestedItem.qty_in3,
                          qty_out3: nestedItem.qty_out3,
                          stock3: nestedItem.stock3,

                          qty_start4: nestedItem.qty_start4,
                          qty_in4: nestedItem.qty_in4,
                          qty_out4: nestedItem.qty_out4,
                          stock4: nestedItem.stock4,
                          note: nestedItem.note,
                        })
                      })
                    } else {
                      // ถ้าไม่มี Array เพิ่ม
                      testform2.push({
                        id: item.id,
                        price: item.price,
                        not_sell: item.not_sell,
                        promotion_id: item.promotion_id,
                        special_price: item.special_price,
                        daterange: item.daterange,
                        picture: item.picture,
                        previews: item.previews,
                        price: item.price,
                        qty_start: item.qty_start,
                        qty_in: item.qty_in,
                        qty_out: item.qty_out,
                        stock: item.stock,

                        qty_start2: item.qty_start2,
                        qty_in2: item.qty_in2,
                        qty_out2: item.qty_out2,
                        stock2: item.stock2,

                        qty_start3: item.qty_start,
                        qty_in3: item.qty_in3,
                        qty_out3: item.qty_out3,
                        stock3: item.stock3,

                        qty_start4: item.qty_start4,
                        qty_in4: item.qty_in4,
                        qty_out4: item.qty_out4,
                        stock4: item.stock4,
                        note: item.note,
                      })
                    }
                  })
                }
              })
            }
          })
        }
          
        var newdata = testform2
        console.log(newdata)

        const formRequests = newdata.map(item => {
          const formData = new FormData()
          if(item.previews.length > 0){
            item.previews.forEach(preview => {
              formData.append('picture', preview.file)
            })
          }else{
            formData.append('picture', [])
          }
            
          formData.append('id', item.id)
          formData.append('old_id', item.old_id)
          formData.append('old_pricepromotion_id', item.old_pricepromotion_id)
          formData.append('group_id', this.group_id)

          formData.append('datenow', this.date_now)
            
          formData.append('datesave', this.datesave)
          formData.append('not_sell', (item.not_sell?'Y':'N'))

          formData.append('price', item.price)
          formData.append('promotion_id', item.promotion_id)
          formData.append('special_price', item.special_price)
          formData.append('daterange', item.daterange)

          formData.append('qty_start', item.qty_start)
          formData.append('qty_in', item.qty_in)
          formData.append('qty_out', item.qty_out)
          formData.append('stock', item.stock)

          formData.append('qty_start2', item.qty_start2)
          formData.append('qty_in2', item.qty_in2)
          formData.append('qty_out2', item.qty_out2)
          formData.append('stock2', item.stock2)

          formData.append('qty_start3', item.qty_start3)
          formData.append('qty_in3', item.qty_in3)
          formData.append('qty_out3', item.qty_out3)
          formData.append('stock3', item.stock3)

          formData.append('qty_start4', item.qty_start4)
          formData.append('qty_in4', item.qty_in4)
          formData.append('qty_out4', item.qty_out4)
          formData.append('stock4', item.stock4)

          formData.append('note', item.note)
          console.log(formData)

          // ส่ง request แต่ละรายการแยกกัน
          return apiService.createOrUpdate_PricePromotionList(formData)
        })

        // รอจนกว่าทุก request จะสำเร็จ
        await Promise.allSettled(formRequests)
        vm.save_PricePromotion_dup()

        // console.log(testform2);
        // const response2 = await apiService.createOrUpdate_weekList(testform2);

          

        // Swal.fire({
        //   title: 'บันทึกสำเร็จ!',
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // });
        // vm.get_all_week();
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async save_PricePromotion_dup(){
      const vm = this
      try {
        const testform2 = []
        if (typeof vm.groupedData === 'object' && vm.groupedData !== null) {
          Object.keys(vm.groupedData).forEach(key => {
            const groupedItem = vm.groupedData[key]
              
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
                        
                      // กรณีมี Array เพิ่มอีกชั้น
                      item.forEach(nestedItem => {
                        testform2.push({
                          id: nestedItem.id,
                          price: nestedItem.price,
                          not_sell: nestedItem.not_sell,
                          promotion_id: nestedItem.promotion_id,
                          special_price: nestedItem.special_price,
                          daterange: nestedItem.daterange,
                          picture: nestedItem.picture,
                          previews: nestedItem.previews,
                          price: nestedItem.price,
                          qty_start: nestedItem.qty_start,
                          qty_in: nestedItem.qty_in,
                          qty_out: nestedItem.qty_out,
                          stock: nestedItem.stock,

                          qty_start2: nestedItem.qty_start2,
                          qty_in2: nestedItem.qty_in2,
                          qty_out2: nestedItem.qty_out2,
                          stock2: nestedItem.stock2,

                          qty_start3: nestedItem.qty_start,
                          qty_in3: nestedItem.qty_in3,
                          qty_out3: nestedItem.qty_out3,
                          stock3: nestedItem.stock3,

                          qty_start4: nestedItem.qty_start4,
                          qty_in4: nestedItem.qty_in4,
                          qty_out4: nestedItem.qty_out4,
                          stock4: nestedItem.stock4,
                          note: nestedItem.note,
                        })
                      })
                    } else {
                      // ถ้าไม่มี Array เพิ่ม
                      testform2.push({
                        id: item.id,
                        price: item.price,
                        not_sell: item.not_sell,
                        promotion_id: item.promotion_id,
                        special_price: item.special_price,
                        daterange: item.daterange,
                        picture: item.picture,
                        previews: item.previews,
                        price: item.price,
                        qty_start: item.qty_start,
                        qty_in: item.qty_in,
                        qty_out: item.qty_out,
                        stock: item.stock,

                        qty_start2: item.qty_start2,
                        qty_in2: item.qty_in2,
                        qty_out2: item.qty_out2,
                        stock2: item.stock2,

                        qty_start3: item.qty_start,
                        qty_in3: item.qty_in3,
                        qty_out3: item.qty_out3,
                        stock3: item.stock3,

                        qty_start4: item.qty_start4,
                        qty_in4: item.qty_in4,
                        qty_out4: item.qty_out4,
                        stock4: item.stock4,
                          
                        note: item.note,
                      })
                    }
                  })
                }
              })
            }
          })
        }

        if (typeof vm.groupedData2 === 'object' && vm.groupedData2 !== null) {
          Object.keys(vm.groupedData2).forEach(key => {
            const groupedItem = vm.groupedData2[key]
              
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
                        
                      // กรณีมี Array เพิ่มอีกชั้น
                      item.forEach(nestedItem => {
                        testform2.push({
                          id: nestedItem.id,
                          price: nestedItem.price,
                          not_sell: nestedItem.not_sell,
                          promotion_id: nestedItem.promotion_id,
                          special_price: nestedItem.special_price,
                          daterange: nestedItem.daterange,
                          picture: nestedItem.picture,
                          previews: nestedItem.previews,
                          price: nestedItem.price,
                          qty_start: nestedItem.qty_start,
                          qty_in: nestedItem.qty_in,
                          qty_out: nestedItem.qty_out,
                          stock: nestedItem.stock,

                          qty_start2: nestedItem.qty_start2,
                          qty_in2: nestedItem.qty_in2,
                          qty_out2: nestedItem.qty_out2,
                          stock2: nestedItem.stock2,

                          qty_start3: nestedItem.qty_start,
                          qty_in3: nestedItem.qty_in3,
                          qty_out3: nestedItem.qty_out3,
                          stock3: nestedItem.stock3,

                          qty_start4: nestedItem.qty_start4,
                          qty_in4: nestedItem.qty_in4,
                          qty_out4: nestedItem.qty_out4,
                          stock4: nestedItem.stock4,
                          note: nestedItem.note,
                        })
                      })
                    } else {
                      // ถ้าไม่มี Array เพิ่ม
                      testform2.push({
                        id: item.id,
                        price: item.price,
                        not_sell: item.not_sell,
                        promotion_id: item.promotion_id,
                        special_price: item.special_price,
                        daterange: item.daterange,
                        picture: item.picture,
                        previews: item.previews,
                        price: item.price,
                        qty_start: item.qty_start,
                        qty_in: item.qty_in,
                        qty_out: item.qty_out,
                        stock: item.stock,

                        qty_start2: item.qty_start2,
                        qty_in2: item.qty_in2,
                        qty_out2: item.qty_out2,
                        stock2: item.stock2,

                        qty_start3: item.qty_start,
                        qty_in3: item.qty_in3,
                        qty_out3: item.qty_out3,
                        stock3: item.stock3,

                        qty_start4: item.qty_start4,
                        qty_in4: item.qty_in4,
                        qty_out4: item.qty_out4,
                        stock4: item.stock4,
                        note: item.note,
                      })
                    }
                  })
                }
              })
            }
          })
        }
          
        var newdata = testform2
        var PricePromotionListid = 0

        const formRequests = newdata.map(item => {
          PricePromotionListid = item.id
        })

        const response2 = await apiService.createOrUpdate_PricePromotionList_dup({ id: PricePromotionListid })

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
      }
    },
    change_checkboxt(i) {
      const vm = this
      if (i < 0 || i >= vm.Productlist_old.pricePromotionDetails.length) return
      if (vm.Productlist_old.pricePromotionDetails[i].price_status_old != vm.Productlist.pricePromotionDetails[i].price_status) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    change_data(i) {
      const vm = this

      console.log(vm.Productlist_old.pricePromotionDetails[i].qty_old)
      console.log(parseFloat(vm.Productlist.pricePromotionDetails[i].qty))
      if (i < 0 || i >= vm.Productlist_old.pricePromotionDetails.length) return
      if (vm.Productlist_old.pricePromotionDetails[i].qty_old != parseFloat(vm.Productlist.pricePromotionDetails[i].qty)) {
        vm.color_active2 = 1
      }else{
        vm.color_active2 = 0
      }
      console.log(vm.color_active2)
    },
    change_data2(i) {
      const vm = this
      if (i < 0 || i >= vm.Productlist_old.pricePromotionDetails.length) return
      if (vm.Productlist_old.pricePromotionDetails[i].note_old != vm.Productlist.pricePromotionDetails[i].note) {
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

    // Picture
    handleFiles(event, index, indexx, index2, index3, id) {
      // ตรวจสอบว่ามี event และ target ก่อนใช้งาน
      if (event && event.target) {
        console.log(index, indexx, index2, index3) // แสดงค่า i ใน console
        this.selectedFiles = Array.from(event.target.files)


        // this.Productlist.pricePromotionDetails[i].previews = Array.from(event.target.files).map(file => ({ file }));
        // console.log(this.Productlist.pricePromotionDetails[i]);
        const files = this.selectedFiles

        this.previewImages(files, index, indexx, index2, index3, id)
      } else {
        console.error('Event หรือ event.target ไม่พร้อมใช้งาน')
      }
    },
    selectFiles(index, indexx, index2, index3, id) {
      // ใช้ document.querySelector เพื่อเลือก input และเรียก click()
      document.querySelector('#fileInput'+id).click()
    },
    handleDrop(event) {
      const files = event.dataTransfer.files

      this.previewImages(files)
    },
    previewImages(files, index, indexx, index2, index3, id) {
        
      Array.from(files).forEach(file => {

        const maxSizeInMB = 2; // กำหนดขนาดสูงสุด (MB)
        const maxSize = maxSizeInMB * 1024 * 1024; // แปลงเป็น bytes

        if (file.size > maxSize) {
            Swal.fire({
                icon: 'warning',
                title: 'ขนาดไฟล์เกินกำหนด',
                text: `ไฟล์ "${file.name}" มีขนาดใหญ่กว่า ${maxSizeInMB}MB`,
                confirmButtonText: 'ตกลง'
            });
            return; // ข้ามไฟล์นี้ไป ไม่ทำการอัปโหลด
        }

        if (this.groupedData[index][indexx][index2][index3].previews.length >= 40) return // Limit to 40 images
        const reader = new FileReader()

        reader.onload = e => {
          this.groupedData[index][indexx][index2][index3].previews.push({
            name: file.name,
            file: file, // เก็บไฟล์ไว้เพื่อส่งให้ API
            url: e.target.result,
          })
        }
        reader.readAsDataURL(file)
      })
      console.log(this.groupedData[index][indexx][index2][index3])
    },
    async deleteImage(id, name, index) {
      console.log(id)
      console.log(name)
      console.log(this.imagePreviews)
      if(id > 0){
        try {
          const form = {
            id: id,
            name: name,
          }

          const response = await apiService.delete_image_price(form)

          this.imagePreviews.splice(index, 1)
          console.log(this.imagePreviews)
        } catch (error) {
          console.error('Error:', error)
        }
      }
      this.imagePreviews.splice(index, 1)
        
    },

    // Picture
    show_preview1(index, indexx, index2, index3) {
      const imagePreviews = this.groupedData[index][indexx][index2][index3].previews

      console.log(imagePreviews)
      Fancybox.close()
      Fancybox.show(
        imagePreviews.map(image => ({
          src: image.url,
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
    show_preview2(index, indexx, index2, index3) {
      this.isDialogVisible = true
      this.imagePreviews = this.groupedData[index][indexx][index2][index3].previews
    },
      
    // Picture
    handleFiles_promotion(event, index, indexx, index2, index3, id) {
      // ตรวจสอบว่ามี event และ target ก่อนใช้งาน
      if (event && event.target) {
        console.log(index, indexx, index2, index3) // แสดงค่า i ใน console
        this.selectedFiles = Array.from(event.target.files)


        // this.Productlist.pricePromotionDetails[i].previews = Array.from(event.target.files).map(file => ({ file }));
        // console.log(this.Productlist.pricePromotionDetails[i]);
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

        const maxSizeInMB = 2; // กำหนดขนาดสูงสุด (MB)
        const maxSize = maxSizeInMB * 1024 * 1024; // แปลงเป็น bytes

        if (file.size > maxSize) {
            Swal.fire({
                icon: 'warning',
                title: 'ขนาดไฟล์เกินกำหนด',
                text: `ไฟล์ "${file.name}" มีขนาดใหญ่กว่า ${maxSizeInMB}MB`,
                confirmButtonText: 'ตกลง'
            });
            return; // ข้ามไฟล์นี้ไป
        }

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
    async deleteImage_promotion(id, name, index) {
      console.log(id)
      console.log(name)
      console.log(this.imagePreviews_promotion)
      if(id > 0){
        try {
          const form = {
            id: id,
            name: name,
          }

          const response = await apiService.delete_image_price(form)


          // this.imagePreviews_promotion.splice(index, 1);
          console.log(this.imagePreviews_promotion)
        } catch (error) {
          console.error('Error:', error)
        }
      }
      this.imagePreviews_promotion.splice(index, 1)
    },

    // Picture
    show_preview1_promotion(index, indexx, index2, index3) {
      const imagePreviews = this.groupedData2[index][indexx][index2][index3].previews

      console.log(imagePreviews)
      Fancybox.close()
      Fancybox.show(
        imagePreviews.map(image => ({
          src: image.url,
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

    openInNewTab(base64Url) {
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
    async get_all_store_user(){
      try {
        const form = {
          group_customer_id: this.userData.group_customer_id,
          user_id: this.userData.id,
          select_user_id: this.user_id,
          user_code: this.userData.code,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_store_user2(form)

        this.storelist = response.data.data.filter(x => x.account_name != null && x.store_code != null && x.account_type_name != null && x.store_name != null && x.name_in_thai != null)
        this.storelist.forEach((item, index) => {
          item.store_name_report = item.account_name+' '+item.store_code+' '+item.account_type_name+' '+item.store_name+' '+item.name_in_thai

          // item.store_name_report = item.account_name+item.branch_name+item.province_name;
        })
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
    async get_all_promotion(){
      try {
        const form = {
          group_customer_id: this.userData.group_customer_id,
          user_id: this.userData.id,
          user_code: this.userData.code,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_promotion(form)

        this.promotionlist = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },
    cal_stock1(index, indexx, index2, index3, id){
      const vm = this
        
      var qty_start = vm.filteredGroupedData2[index][indexx][index2][index3].qty_start
      var qty_in = vm.filteredGroupedData2[index][indexx][index2][index3].qty_in
      var qty_out = vm.filteredGroupedData2[index][indexx][index2][index3].qty_out
      var stock = parseFloat(qty_start)+parseFloat(qty_in)-parseFloat(qty_out)
      vm.filteredGroupedData2[index][indexx][index2][index3].stock = stock
      vm.filteredGroupedData2[index][indexx][index2][index3].qty_start2 = stock

      var qty_start2 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_start2
      var qty_in2 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_in2
      var qty_out2 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_out2
      var stock2 = parseFloat(qty_start2)+parseFloat(qty_in2)-parseFloat(qty_out2)
      vm.filteredGroupedData2[index][indexx][index2][index3].stock2 = stock2
      vm.filteredGroupedData2[index][indexx][index2][index3].qty_start3 = stock2

      var qty_start3 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_start3
      var qty_in3 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_in3
      var qty_out3 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_out3
      var stock3 = parseFloat(qty_start3)+parseFloat(qty_in3)-parseFloat(qty_out3)
      vm.filteredGroupedData2[index][indexx][index2][index3].stock3 = stock3
      vm.filteredGroupedData2[index][indexx][index2][index3].qty_start4 = stock3

      var qty_start4 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_start4
      var qty_in4 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_in4
      var qty_out4 = vm.filteredGroupedData2[index][indexx][index2][index3].qty_out4
      var stock4 = parseFloat(qty_start4)+parseFloat(qty_in4)-parseFloat(qty_out4)
      vm.filteredGroupedData2[index][indexx][index2][index3].stock4 = stock4
      console.log(stock)
    },

      
  },
}
</script>

<style scoped>
.custom-tabs {
  display: flex;
  flex-wrap: wrap;
  margin-block-end: 10px;
}

.custom-tabs button {
  border: none;
  border-radius: 4px;
  margin: 4px;
  background: #eee;
  cursor: pointer;
  padding-block: 8px;
  padding-inline: 12px;
}

.custom-tabs button.active {
  background: #ff9800; /* orange */
  color: #fff;
}

.custom-tabs.inner button.active {
  background: #000; /* black */
}

@media (max-width: 670px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 8em !important;
  }
}

@media (max-width: 896px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 8.5em !important;
  }
}
</style>

<style lang="scss" scoped>
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }

  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;
    }

    .v-label.custom-input {
      border: none !important;
    }
  }
}

.v-checkbox.v-selection-control .v-label,
.v-checkbox-btn.v-selection-control .v-label {
  font-size: 14px;
}
</style>

<style scoped>
.week-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.week-label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-block-end: 5px;
}

.week-label span {
  font-size: 16px;
  font-weight: bold;
}

.week-label small {
  color: #888;
  font-size: 12px;
}

.fixed-new {
  position: fixed;
  z-index: 99;
  align-items: end;
  justify-content: end;
  inset-block-start: 1.7em;
  inset-inline-end: 14em;
}

@media (min-width: 1693px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 14em;
  }
}

@media (min-width: 1731px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 15em;
  }
}

@media (min-width: 1847px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 23em;
  }
}

@media (min-width: 2027px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 28em;
  }
}

@media (min-width: 2272px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 33em;
  }
}

@media (min-width: 2372px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 36em;
  }
}

@media (min-width: 2572px) {
  .fixed-new {
    position: fixed;
    z-index: 99;
    align-items: end;
    justify-content: end;
    inset-block-start: 1.7em;
    inset-inline-end: 63em;
  }
}
</style>
