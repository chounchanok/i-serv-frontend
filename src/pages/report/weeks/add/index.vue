<script setup>
import noimg from '@images/noimg.png';
</script>
<style>
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
<template>
  <div>
    <VRow >
    <!-- <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6"> -->
      <VCol cols="12" md="6">
        <h4 class="text-h4 font-weight-medium" style="color: white;">
          12 Weeks
        </h4>
        <!-- <div class="text-body-1">
          Orders placed across your store
        </div> -->
      </VCol>

      <VCol cols="12" md="6">
        <!-- <VBtn variant="tonal" color="secondary" @click="get_all_week">
          โหลดข้อมูล
        </VBtn> -->

        <VRow class="fixed-new" style="align-items: end;justify-content: inherit; padding-right: 10px;">
          <VCol cols="8" md="5" style="display: flex;align-items: center;justify-content: center;gap: 5px;" v-if="userData.position_name != 'พนักงาน'">
            <VTextField
              v-model="startDate_select"
              label="วันที่เริ่มต้น"
              type="date"
              density="compact"
            />
          </VCol>
          <VCol cols="8" md="5" style="display: flex;align-items: center;justify-content: center;gap: 5px;" v-if="userData.position_name != 'พนักงาน'">
            <VTextField
              v-model="endDate_select"
              label="วันที่สิ้นสุด"
              type="date"
              density="compact"
            />
          </VCol>
          
          <VCol cols="8" md="2" style="display: flex;align-items: center;justify-content: center;gap: 5px;">
            <VBtn
              color="info"
              variant="elevated"
              @click="exportData('excelweek')"
              class="responsive-btn"
            >
              Export
            </VBtn>
            
            <VBtn v-if="Productlist.id>0 && userData.position_name != 'Assistant Management' && userData.position_name != 'Management'" color="primary" @click="save_week_confirm">บันทึก</VBtn>
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
                <VCol v-if="userData.position_name != 'พนักงาน'" cols="12" md="3">
                  <AppAutocomplete 
                  v-model="user_id" 
                  label="พนักงาน"
                  placeholder="เลือก พนักงาน" 
                  :items="user_for_admin" 
                  item-title="newname"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="get_all_store_user"/>
                </VCol>
                <VCol cols="12" md="4">
                  <AppAutocomplete 
                  v-model="store_id" 
                  label="Store"
                  placeholder="เลือก Store" 
                  :items="storelist" 
                  item-title="store_name_report"
                  item-value="store_id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="get_group_name2"/>
                </VCol>
                <VCol cols="12" md="4">
                  <AppAutocomplete 
                    v-model="group_id" 
                    label="Group name"
                    placeholder="เลือก Group name" 
                    :items="datalist" 
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="set_group_id"/>
                </VCol>
                <!-- <VCol cols="12" md="4">
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
                </VCol> -->
                <VCol cols="6" md="2">
                  <AppDateTimePicker 
                    v-model="date_now" 
                    label="โหลดข้อมูล" 
                    placeholder="โหลดข้อมูล" 
                    :min="minDate" 
                    :max="maxDate" 
                    :config="datePickerConfig"
                    :key="datePickerKey"
                    :disabled="dis_date"
                    @change="get_all_week"
                  />
                </VCol>
                <VBtn
                  color="secondary"
                  style="margin-block-start: 36px;"
                  @click="confirmRenewProductWeek"
                  :disabled="!user_id || !store_id"
                >
                  อัปเดตรายการสินค้า
                </VBtn>
              </VRow>
            </VCardText>
            <VDivider />
            
            <VCardText>
              <VRow>
                
                <VCol cols="12" md="2">
                  <AppDateTimePicker 
                    v-model="datesave" 
                    label="วันที่ทำรายงาน" 
                    placeholder="เลือกวันที่" 
                    :readonly="true"
                  />
                </VCol>
                <VCol cols="12" md="2">
                  <AppDateTimePicker v-model="startweek" label="วันที่เริ่มของ Week 1" placeholder="เลือกวันที่" @change="generateWeekRanges_set"/>
                </VCol>
              </VRow>
            </VCardText>
            <VDivider />

            <VCardText v-if="Productlist">
              <VTabs v-if="Productlist.weekDetails" v-model="currentTab" align-tabs="center">
                <VTab v-for="(value,index) in groupedData" :key="index" @click="currentTab2=0">{{index}}</VTab>
                <VTab v-for="(value,index) in groupedData2" :key="index" @click="currentTab2=0">{{index}}</VTab>
              </VTabs>
              
              <VCardText v-if="Productlist.weekDetails" style="padding-block: 5px;padding-inline: 0;">
                
                <VWindow v-model="currentTab">
                  <VWindowItem v-for="(value,index) in groupedData" :key="index">
                    <VTabs v-model="currentTab2" align-tabs="center">
                      <VTab v-for="(valuex,indexx) in value" :key="indexx">{{indexx}}</VTab>
                    </VTabs>
                    <VCardText style="padding-block: 5px;padding-inline: 0;">
                      <VWindow v-model="currentTab2">
                        <VWindowItem v-for="(valuex,indexx) in value" :key="indexx">
                          <VRow v-for="(value2,index2) in valuex" :key="index2">
                            <VCol cols="12" md="12">
                              <VAlert color="primary" style="font-size: 1.3em;">
                                {{index2}}
                              </VAlert>
                            </VCol> 
                            <VCol cols="12" md="12">
                              <template v-for="(value3,index3) in value2" :key="index3">
                                  <VRow :style="(index3%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                                    <VCol cols="12" md="1" class="d-flex align-self-end text-center" style="justify-content: center;">
                                      <a v-if="value3.mapProductStoreList.product.picture" :data-fancybox="'booklet-gal'+value3.mapProductStoreList.id" :href="apiurl+value3.mapProductStoreList.product.picture" style="display: flex;align-items: center;justify-content: center;">
                                          <div class="img-width">
                                              <img :src="apiurl+value3.mapProductStoreList.product.picture" class="card-img-top" :alt="apiurl+value3.mapProductStoreList.product.picture" style="block-size: 50px;inline-size: 50px;"/>
                                          </div>
                                      </a>
                                      <div v-else class="img-width">
                                          <img :src="noimg" class="card-img-top" style="block-size: 50px;inline-size: 50px;"/>
                                      </div>
                                    </VCol>
                                    <VCol cols="12" md="5" style="display: flex;align-items: center;">
                                      {{(index3+1)}} {{ value3.mapProductStoreList.product.name }} {{ (value3.mapProductStoreList.product.flavor?'('+value3.mapProductStoreList.product.flavor+')':'') }}
                                    </VCol>
                                    <VCol cols="12" md="1" class="d-flex align-self-end">
                                      <AppTextField v-model="value3.t_rank" placeholder="0" type="number" label="T Rank" :min="0" @keydown="preventInvalidKeys" />
                                    </VCol>
                                    <VCol cols="12" md="5">
                                      <AppTextField v-model="value3.note" placeholder="" type="text" label="หมายเหตุ" />
                                    </VCol>
                                    
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week1</span>
                                          <small>{{ week1Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week1"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                      <!-- <AppTextField v-model="value3.week1" placeholder="0" type="number" label="Week1" /> -->
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week2</span>
                                          <small>{{ week2Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week2"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week3</span>
                                          <small>{{ week3Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week3"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week4</span>
                                          <small>{{ week4Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week4"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week5</span>
                                          <small>{{ week5Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week5"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week6</span>
                                          <small>{{ week6Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week6"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week7</span>
                                          <small>{{ week7Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week7"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week8</span>
                                          <small>{{ week8Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week8"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week9</span>
                                          <small>{{ week9Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week9"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week10</span>
                                          <small>{{ week10Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week10"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week11</span>
                                          <small>{{ week11Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week11"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week12</span>
                                          <small>{{ week12Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week12"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                  </VRow>
                              </template>
                            </VCol> 
                          </VRow> 
                        </VWindowItem>
                      </VWindow>
                    </VCardText>
                  </VWindowItem>

                  <VWindowItem v-for="(value,index) in groupedData2" :key="index">
                    <VTabs v-model="currentTab2" align-tabs="center">
                      <VTab v-for="(valuex,indexx) in value" :key="indexx">{{indexx}}</VTab>
                    </VTabs>
                    <VCardText style="padding-block: 5px;padding-inline: 0;">
                      <VWindow v-model="currentTab2">
                        <VWindowItem v-for="(valuex,indexx) in value" :key="indexx">
                          <VRow v-for="(value2,index2) in valuex" :key="index2">
                            <VCol cols="12" md="12">
                              <VAlert color="primary" style="font-size: 1.3em;">
                                {{index2}}
                              </VAlert>
                            </VCol> 
                            <VCol cols="12" md="12">
                              <template v-for="(value3,index3) in value2" :key="index3">
                                  <VRow :style="(index3%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                                    <VCol cols="12" md="1" class="d-flex align-self-end text-center" style="justify-content: center;">
                                      <a v-if="value3.mapProductStoreList.product.picture" :data-fancybox="'booklet-gal'+value3.mapProductStoreList.id" :href="apiurl+value3.mapProductStoreList.product.picture" style="display: flex;align-items: center;justify-content: center;">
                                          <div class="img-width">
                                              <img :src="apiurl+value3.mapProductStoreList.product.picture" class="card-img-top" :alt="apiurl+value3.mapProductStoreList.product.picture" style="block-size: 50px;inline-size: 50px;"/>
                                          </div>
                                      </a>
                                      <div v-else class="img-width">
                                          <img :src="noimg" class="card-img-top" style="block-size: 50px;inline-size: 50px;"/>
                                      </div>
                                    </VCol>
                                    <VCol cols="12" md="5" style="display: flex;align-items: center;">
                                      {{(index3+1)}} {{ value3.mapProductStoreList.product.name }} {{ (value3.mapProductStoreList.product.flavor?'('+value3.mapProductStoreList.product.flavor+')':'') }}
                                    </VCol>
                                    <VCol cols="12" md="1" class="d-flex align-self-end">
                                      <AppTextField v-model="value3.t_rank" placeholder="0" type="number" label="T Rank" :min="0" @keydown="preventInvalidKeys" />
                                    </VCol>
                                    <VCol cols="12" md="5">
                                      <AppTextField v-model="value3.note" placeholder="" type="text" label="หมายเหตุ" />
                                    </VCol>
                                    
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week1</span>
                                          <small>{{ week1Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week1"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                      <!-- <AppTextField v-model="value3.week1" placeholder="0" type="number" label="Week1" /> -->
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week2</span>
                                          <small>{{ week2Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week2"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week3</span>
                                          <small>{{ week3Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week3"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week4</span>
                                          <small>{{ week4Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week4"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week5</span>
                                          <small>{{ week5Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week5"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week6</span>
                                          <small>{{ week6Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week6"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week7</span>
                                          <small>{{ week7Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week7"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week8</span>
                                          <small>{{ week8Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week8"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week9</span>
                                          <small>{{ week9Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week9"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week10</span>
                                          <small>{{ week10Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week10"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week11</span>
                                          <small>{{ week11Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week11"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                    <VCol cols="6" md="1" class="d-flex align-self-end">
                                      <div class="week-container">
                                        <label class="week-label">
                                          <span>Week12</span>
                                          <small>{{ week12Range }}</small>
                                        </label>
                                        <AppTextField
                                          v-model="value3.week12"
                                          placeholder="0"
                                          type="number" :min="0" @keydown="preventInvalidKeys"
                                        />
                                      </div>
                                    </VCol>
                                  </VRow>
                              </template>
                            </VCol> 
                          </VRow> 
                        </VWindowItem>
                      </VWindow>
                    </VCardText>
                  </VWindowItem>

                </VWindow>
              </VCardText>
            </VCardText>
            
                
            
        </VCard>

      </VCol>

    </VRow>
  </div>
</template>

<script>
import apiService from '@/services/api';
import Swal from 'sweetalert2';

function getFormattedDateThreeMonthsAgo() {
  const date = new Date();
  
  // ตั้งค่าเดือนให้เป็น 3 เดือนก่อนหน้า (JavaScript จะจัดการเรื่องปีให้เอง)
  date.setMonth(date.getMonth() - 3);

  const year = date.getFullYear();
  // getMonth() คืนค่าเป็น 0-11 จึงต้อง +1 และ padStart เพื่อให้เป็น 2 หลักเสมอ (เช่น 08)
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // getDate() และ padStart เพื่อให้เป็น 2 หลักเสมอ (เช่น 01, 09, 15)
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default {
    data: () => ({
      apiurl:null,
      value3: {
        week1: 0,
      },
      week1Range: "",
      week2Range: "",
      week3Range: "",
      week4Range: "",
      week5Range: "",
      week6Range: "",
      week7Range: "",
      week8Range: "",
      week9Range: "",
      week10Range: "",
      week11Range: "",
      week12Range: "",
      dis_date:true,
      currentTab:0,
      currentTab2:0,
      userData:{},
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
      groupedData:[],
      groupedData2:[],
      select_store:'',
      breadcrumbs:[],
      // date_now:new Date(),
      startweek:new Date(),
      date_end:new Date(),
      rowdata:[],
      show_p:false,
      datalist:[],
      user_id:null,
      storelist:[],
      Productlist:[],
      Productlist_old:[],
      group_id:null,
      store_id:null,
      datePickerConfig: {},
      datePickerKey: 0, // key สำหรับบังคับให้ AppDateTimePicker รีเรนเดอร์ใหม่
      color_active:0,
      color_active2:0,
      color_active3:0,
      user_for_admin:[],
      startDate_select: new Date().toISOString().slice(0, 10),
      endDate_select: new Date().toISOString().slice(0, 10),
      apiurl: import.meta.env.VITE_API_URL,
    }),
    methods: {
      exportData(type) {
        // ✅ เข้าถึง data ด้วย this.ชื่อตัวแปร
        if (!this.startDate_select || !this.endDate_select) {
          alert('กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด');
          return;
        }
        
        let baseUrl = `${this.apiurl}/api/backend/`;
        baseUrl += `excelweek/${this.userData.id || 'null'}/${this.store_id || 'null'}/${this.group_id || 'null'}/${this.user_id || 'null'}`;

        const finalUrl = `${baseUrl}/${this.startDate_select}/${this.endDate_select}`;
        
        console.log("Exporting to URL:", finalUrl);

        window.open(finalUrl, '_blank');
      },
      async confirmRenewProductWeek() {
        Swal.fire({
          title: 'ยืนยันการ อัปเดตรายการสินค้าใหม่?',
          text: 'หากดำเนินการ ข้อมูลเดิมที่เคยกรอกไว้ของวันนี้จะหายไป',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'ยืนยัน',
          cancelButtonText: 'ยกเลิก',
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            this.renewProductWeek();
          }
        });
      },

      async renewProductWeek() {
        if (!this.user_id || !this.store_id) {
          Swal.fire({ icon: 'warning', title: 'กรุณาเลือก User และ Store' });
          return;
        }
        try {
          const dateTime = new Date();
          const dateOnly = new Date(dateTime).toISOString().split('T')[0];
          const form = {
            user_id: this.user_id,
            store_id: this.store_id,
            datenow: (this.date_now?this.date_now:dateOnly),
          };
          const response = await apiService.renew_product_week(form);
          if (response.data.status === 'success') {
            Swal.fire({ icon: 'success', title: 'อัปเดตรายการสินค้าสำเร็จ' });
            this.get_all_week(); // โหลดข้อมูลใหม่
          } else {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: response.data.message });
          }
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
        }
      },

      preventInvalidKeys(e) {
        const invalidKeys = ['-', '+', 'e', 'E', '.', ','];
        if (invalidKeys.includes(e.key)) {
          e.preventDefault();
        }
      },
      calculateWeekRange(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // เพิ่ม 6 วันสำหรับ 1 สัปดาห์
        const format = (date) =>
          `${date.getDate()}/${date.getMonth() + 1}`;
        return `${format(startDate)} - ${format(endDate)}`;
      },
      generateWeekRanges_set(){
        this.generateWeekRanges(new Date(this.startweek));
      },
      generateWeekRanges(startDate) {
          const formatDateRange = (start, end) =>
              `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;

          let currentWeekStart = new Date(startDate); // กำหนดวันที่เริ่มต้น
          for (let i = 1; i <= 12; i++) {
              const currentWeekEnd = new Date(currentWeekStart);
              currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // กำหนดวันสิ้นสุดสัปดาห์
              this[`week${i}Range`] = formatDateRange(currentWeekStart, currentWeekEnd);
              currentWeekStart.setDate(currentWeekStart.getDate() + 7); // เพิ่ม 7 วันเพื่อไปยังสัปดาห์ถัดไป
          }
      },
      get_notsell(k){
        const vm = this;
        console.log(vm.Productlist.weekDetails[k].not_sell)
        vm.Productlist.weekDetails[k].qty = 0;
        
        if (k < 0 || k >= vm.Productlist_old.weekDetails.length) return;
        if (vm.Productlist_old.weekDetails[k].not_sell_old != vm.Productlist.weekDetails[k].not_sell) {
          vm.color_active++;
        }else{
          vm.color_active--;
        }
      },
      async getall(){
        try {
          const response = await apiService.get_all_MapProductStore();
          this.datalist = response.data.data;
          this.datalist.forEach((item, index) => {
            this.datalist[index].Active = item.isActive == 'Y' ? true : false;
            this.datalist[index].num = index + 1;
          });
          
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async get_group_name(){
        try {
          const selectedItem = this.storelist.find(
            (item) => item.id === this.store_id
          );
          const form = {
            group_customer_id: selectedItem.group_customer_id,
            account_id: selectedItem.account_id,
            account_type_id: selectedItem.account_type_id,
            user_id: this.userData.id,
            user_code: this.userData.code,
            store_code: selectedItem.store_code,
            branch_name: selectedItem.branch_name,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_group_name(form);
          this.datalist = response.data.data;
          this.group_id = null;
          this.date_now = null;
          this.groupedData = [];
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async get_group_name2(){
        try {
          // alert(this.store_id);
          const selectedItem = this.storelist.find(
            (item) => item.store_id === this.store_id
          );
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
            report: 'week'
          };
          const response = await apiService.get_group_name2(form);
          this.datalist = response.data.data.filter(x => x.mapProductStoreList.length > 0);
          this.datalist.forEach((item, index) => {
            this.datalist[index].new_name = item.name+(item.branch_name?'('+item.branch_name+')':'');
          });
          this.group_id = null;
          this.date_now = null;
          this.groupedData = [];
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async set_group_id(){
        this.get_all_week_date();
        // this.get_all_week();
        this.dis_date = false;
        if(!this.date_now){
          this.get_all_week_first()
        }else{
          this.get_all_week();
        }
      },
      async get_all_week_first() {
        this.color_active = 0;
        this.color_active2 = 0;
        this.color_active3 = 0;
        try {
          const startweek = new Date(this.startweek).toISOString().split('T')[0];
          const form = {
            group_id: this.group_id,
            datenow: new Date().getFullYear() + '-' + 
                      String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                      String(new Date().getDate()).padStart(2, '0'),
            datesave: this.datesave,
            startweek: startweek,
            user_id: this.userData.id
          };
          const response = await apiService.get_all_week_first(form);
          this.date_now = new Date().getFullYear() + '-' + 
                  String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                  String(new Date().getDate()).padStart(2, '0')
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async get_all_week_date(){
        try {
          const dateTime = new Date();
          const dateOnly = new Date(dateTime).toISOString().split('T')[0];
          const form = {
            group_id: this.group_id,
            store_id: this.store_id,
            datenow: (this.date_now?this.date_now:dateOnly)
          };
          const response = await apiService.get_all_week_date(form);
          this.specificDisabledDates = response.data.specificDisabledDates;
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async get_all_week() {
        this.color_active = 0;
        this.color_active2 = 0;
        this.color_active3 = 0;
        if(this.date_now != ""){
          try {
            if (this.group_id) {
              const startweek = new Date(this.startweek).toISOString().split('T')[0];
              if(this.userData.position_name == 'พนักงาน'){
                this.user_id = this.userData.id;
              }
              const form = {
                group_id: this.group_id,
                datenow: this.date_now,
                datesave: this.datesave,
                startweek: startweek,
                user_id: this.user_id,
                store_id: this.store_id,
                position_name: this.userData.position_name,
              };
              const response = await apiService.get_all_week(form);
              var data = response.data.data;
              var Productlist = [];
              var Productlist_old = [];
              Productlist = data;
              Productlist_old = data;
              this.specificDisabledDates = response.data.specificDisabledDates; // อัปเดต specificDisabledDates แบบเรียลไทม์
              this.groupedData = response.data.groupedData;
              this.groupedData2 = response.data.groupedData2;
              this.startweek = response.data.data.startweek;
              let weekDetails = Productlist.weekDetails;
              weekDetails.forEach((item, index) => {
                var week_status = item.week_status;
                console.log(week_status);
                var not_sell = item.not_sell;
                item.week_status = week_status == 'Y' ? true : false;
                console.log(item.week_status);
                item.not_sell = not_sell == 'Y' ? true : false;

                item.week_status_old = item.week_status;
                item.not_sell_old = item.not_sell;
                item.qty_old = item.qty;
                item.note_old = item.note;
              });
              this.Productlist = Productlist;
              this.Productlist_old = Productlist_old;
              console.log(this.Productlist);
              console.log(this.Productlist_old);
            } else {
              this.Productlist = [];
              this.Productlist_old = [];
              // Swal.fire({
              //   title: 'ไม่พบข้อมูล!',
              //   icon: 'warning',
              //   confirmButtonText: 'OK'
              // });
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      },
      updateDatePickerConfig() {
        const today = new Date();

        // ตั้งค่าวันเป็นวันที่ 1 เดือนที่แล้ว
        const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        // ดึงวันที่ เดือน และปี ในรูปแบบที่ต้องการ
        const day = String(previousMonthDate.getDate()).padStart(2, '0');
        const month = String(previousMonthDate.getMonth() + 1).padStart(2, '0'); // เดือนใน JavaScript เริ่มจาก 0
        const year = previousMonthDate.getFullYear();

        var lastmonth = `${year}-${month}-${day}`;
        console.log(this.specificDisabledDates);
        if(this.userData.position_id == 3){
          this.datePickerConfig = {
            dateFormat: 'Y-m-d',
          };
        }else{
          this.datePickerConfig = {
            dateFormat: 'Y-m-d',
            disable: [
              { from: `${lastmonth}`, to: this.minDate }, // ปิดการใช้งานช่วงวันที่ก่อน minDate
              ...this.specificDisabledDates.map(date => ({ from: date, to: date })) // ปิดการใช้งานวันที่เฉพาะเจาะจง
            ]
          };
        }
        
        // บังคับให้ AppDateTimePicker รีเรนเดอร์ใหม่
        this.datePickerKey += 1;
      },
      async save_week_confirm(){
        Swal.fire({
          title: "กรอกข้อมูลตามความเป็นจริง",
          text: "และตรวจสอบความถูกต้องก่อนบันทึก",  
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'กำลังบันทึกข้อมูล...',
              allowOutsideClick: false,
              showConfirmButton: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            this.save_week2();
          }
        });
      },
      async save_week2(){
        try {

          const vm = this;
          const testform2 = [];
          // console.log(Array.isArray(vm.groupedData));
          // console.log('groupedData:', JSON.stringify(vm.groupedData, null, 2));

          if (typeof vm.groupedData === 'object' && vm.groupedData !== null) {
            Object.keys(vm.groupedData).forEach((key) => {
              const groupedItem = vm.groupedData[key];
              
              // ตรวจสอบว่า groupedItem เป็น Object
              if (typeof groupedItem === 'object' && groupedItem !== null) {
                Object.keys(groupedItem).forEach((subKey) => {
                  const subItems = groupedItem[subKey];
                  // ตรวจสอบว่า subItems เป็น Array
                  if (typeof subItems === 'object' && subItems !== null) {
                    
                    Object.keys(subItems).forEach((subKey2) => {
                      // ดำเนินการเพิ่ม item เข้า testform2
                      const item = subItems[subKey2];
                      if (Array.isArray(item)) {
                        
                        // กรณีมี Array เพิ่มอีกชั้น
                        item.forEach((nestedItem) => {
                          testform2.push({
                            id: nestedItem.id,
                            t_rank: nestedItem.t_rank,
                            map_product_store_list_id: nestedItem.map_product_store_list_id,
                            week1: nestedItem.week1,
                            week2: nestedItem.week2,
                            week3: nestedItem.week3,
                            week4: nestedItem.week4,
                            week5: nestedItem.week5,
                            week6: nestedItem.week6,
                            week7: nestedItem.week7,
                            week8: nestedItem.week8,
                            week9: nestedItem.week9,
                            week10: nestedItem.week10,
                            week11: nestedItem.week11,
                            week12: nestedItem.week12,
                            note: nestedItem.note,
                          });
                        });
                      } else {
                        // ถ้าไม่มี Array เพิ่ม
                        testform2.push({
                          id: item.id,
                          t_rank: item.t_rank,
                          map_product_store_list_id: item.map_product_store_list_id,
                          week1: item.week1,
                          week2: item.week2,
                          week3: item.week3,
                          week4: item.week4,
                          week5: item.week5,
                          week6: item.week6,
                          week7: item.week7,
                          week8: item.week8,
                          week9: item.week9,
                          week10: item.week10,
                          week11: item.week11,
                          week12: item.week12,
                          note: item.note,
                        });
                      }
                    });
                  }
                });
              }
            });
          }

          if (typeof vm.groupedData2 === 'object' && vm.groupedData2 !== null) {
            Object.keys(vm.groupedData2).forEach((key) => {
              const groupedItem = vm.groupedData2[key];
              
              // ตรวจสอบว่า groupedItem เป็น Object
              if (typeof groupedItem === 'object' && groupedItem !== null) {
                Object.keys(groupedItem).forEach((subKey) => {
                  const subItems = groupedItem[subKey];
                  // ตรวจสอบว่า subItems เป็น Array
                  if (typeof subItems === 'object' && subItems !== null) {
                    
                    Object.keys(subItems).forEach((subKey2) => {
                      // ดำเนินการเพิ่ม item เข้า testform2
                      const item = subItems[subKey2];
                      if (Array.isArray(item)) {
                        
                        // กรณีมี Array เพิ่มอีกชั้น
                        item.forEach((nestedItem) => {
                          testform2.push({
                            id: nestedItem.id,
                            map_product_store_list_id: nestedItem.map_product_store_list_id,
                            t_rank: nestedItem.t_rank,
                            week1: nestedItem.week1,
                            week2: nestedItem.week2,
                            week3: nestedItem.week3,
                            week4: nestedItem.week4,
                            week5: nestedItem.week5,
                            week6: nestedItem.week6,
                            week7: nestedItem.week7,
                            week8: nestedItem.week8,
                            week9: nestedItem.week9,
                            week10: nestedItem.week10,
                            week11: nestedItem.week11,
                            week12: nestedItem.week12,
                            note: nestedItem.note,
                          });
                        });
                      } else {
                        // ถ้าไม่มี Array เพิ่ม
                        testform2.push({
                          id: item.id,
                          map_product_store_list_id: item.map_product_store_list_id,
                          t_rank: item.t_rank,
                          week1: item.week1,
                          week2: item.week2,
                          week3: item.week3,
                          week4: item.week4,
                          week5: item.week5,
                          week6: item.week6,
                          week7: item.week7,
                          week8: item.week8,
                          week9: item.week9,
                          week10: item.week10,
                          week11: item.week11,
                          week12: item.week12,
                          note: item.note,
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          
          console.log(testform2);

          const startweek = new Date(this.startweek).toISOString().split('T')[0];
          if(this.userData.position_name == 'พนักงาน'){
            this.user_id = this.userData.id;
          } 
          const form = {
            group_id: this.group_id,
            store_id: this.store_id,
            datenow: this.date_now,
            datesave: this.datesave,
            user_id: this.user_id,
            startweek: startweek,
            testform2: testform2,
          };
          const response2 = await apiService.create_week2(form);
          var data = response2.data.data;
          // this.save_week();

          Swal.fire({
              html:'<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
              icon: "success",
              timer: 3000,
              timerProgressBar: true,
              didOpen: () => Swal.showLoading(),
              willClose: () => window.location.reload()
          });

        } catch (error) {
          console.error('Error:', error);
          Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      // async save_week(){
      //   const vm = this;
      //   try {
      //     const form2 = [];
          
      //     const response2 = await apiService.createOrUpdate_weekList(testform2);

      //     // vm.save_week_dup();
          
      //     // Swal.fire({
      //     //   title: 'บันทึกสำเร็จ!',
      //     //   icon: 'success',
      //     //   confirmButtonText: 'OK'
      //     // });
      //     // vm.get_all_week();
      //   } catch (error) {
      //     console.error('Error:', error);
      //   }
      // },
      async save_week_dup(){
        const vm = this;
        try {
          const testform2 = [];
          if (typeof vm.groupedData === 'object' && vm.groupedData !== null) {
            Object.keys(vm.groupedData).forEach((key) => {
              const groupedItem = vm.groupedData[key];
              
              // ตรวจสอบว่า groupedItem เป็น Object
              if (typeof groupedItem === 'object' && groupedItem !== null) {
                Object.keys(groupedItem).forEach((subKey) => {
                  const subItems = groupedItem[subKey];
                  // ตรวจสอบว่า subItems เป็น Array
                  if (typeof subItems === 'object' && subItems !== null) {
                    
                    Object.keys(subItems).forEach((subKey2) => {
                      // ดำเนินการเพิ่ม item เข้า testform2
                      const item = subItems[subKey2];
                      if (Array.isArray(item)) {
                        
                        // กรณีมี Array เพิ่มอีกชั้น
                        item.forEach((nestedItem) => {
                          testform2.push({
                            id: nestedItem.id,
                            t_rank: nestedItem.t_rank,
                            week1: nestedItem.week1,
                            week2: nestedItem.week2,
                            week3: nestedItem.week3,
                            week4: nestedItem.week4,
                            week5: nestedItem.week5,
                            week6: nestedItem.week6,
                            week7: nestedItem.week7,
                            week8: nestedItem.week8,
                            week9: nestedItem.week9,
                            week10: nestedItem.week10,
                            week11: nestedItem.week11,
                            week12: nestedItem.week12,
                            note: nestedItem.note,
                          });
                        });
                      } else {
                        // ถ้าไม่มี Array เพิ่ม
                        testform2.push({
                          id: item.id,
                          t_rank: item.t_rank,
                          week1: item.week1,
                          week2: item.week2,
                          week3: item.week3,
                          week4: item.week4,
                          week5: item.week5,
                          week6: item.week6,
                          week7: item.week7,
                          week8: item.week8,
                          week9: item.week9,
                          week10: item.week10,
                          week11: item.week11,
                          week12: item.week12,
                          note: item.note,
                        });
                      }
                    });
                  }
                });
              }
            });
          }

          if (typeof vm.groupedData2 === 'object' && vm.groupedData2 !== null) {
            Object.keys(vm.groupedData2).forEach((key) => {
              const groupedItem = vm.groupedData2[key];
              
              // ตรวจสอบว่า groupedItem เป็น Object
              if (typeof groupedItem === 'object' && groupedItem !== null) {
                Object.keys(groupedItem).forEach((subKey) => {
                  const subItems = groupedItem[subKey];
                  // ตรวจสอบว่า subItems เป็น Array
                  if (typeof subItems === 'object' && subItems !== null) {
                    
                    Object.keys(subItems).forEach((subKey2) => {
                      // ดำเนินการเพิ่ม item เข้า testform2
                      const item = subItems[subKey2];
                      if (Array.isArray(item)) {
                        
                        // กรณีมี Array เพิ่มอีกชั้น
                        item.forEach((nestedItem) => {
                          testform2.push({
                            id: nestedItem.id,
                            t_rank: nestedItem.t_rank,
                            week1: nestedItem.week1,
                            week2: nestedItem.week2,
                            week3: nestedItem.week3,
                            week4: nestedItem.week4,
                            week5: nestedItem.week5,
                            week6: nestedItem.week6,
                            week7: nestedItem.week7,
                            week8: nestedItem.week8,
                            week9: nestedItem.week9,
                            week10: nestedItem.week10,
                            week11: nestedItem.week11,
                            week12: nestedItem.week12,
                            note: nestedItem.note,
                          });
                        });
                      } else {
                        // ถ้าไม่มี Array เพิ่ม
                        testform2.push({
                          id: item.id,
                          t_rank: item.t_rank,
                          week1: item.week1,
                          week2: item.week2,
                          week3: item.week3,
                          week4: item.week4,
                          week5: item.week5,
                          week6: item.week6,
                          week7: item.week7,
                          week8: item.week8,
                          week9: item.week9,
                          week10: item.week10,
                          week11: item.week11,
                          week12: item.week12,
                          note: item.note,
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          
          var newdata = testform2;
          var WeekListid = 0;
          const formRequests = newdata.map((item) => {
            WeekListid = item.id;
          });
          const response2 = await apiService.createOrUpdate_WeekList_dup({id:WeekListid});
          
            Swal.fire({
              html:'<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
              icon: "success",
              timer: 3000,
              timerProgressBar: true,
              didOpen: () => Swal.showLoading(),
              willClose: () => window.location.reload()
            });
        } catch (error) {
          console.error('Error:', error);
        }
      },
      change_checkboxt(i) {
        const vm = this;
        if (i < 0 || i >= vm.Productlist_old.weekDetails.length) return;
        if (vm.Productlist_old.weekDetails[i].week_status_old != vm.Productlist.weekDetails[i].week_status) {
          vm.color_active++;
        }else{
          vm.color_active--;
        }
      },
      change_data(i) {
        const vm = this;
        console.log(vm.Productlist_old.weekDetails[i].qty_old);
        console.log(parseFloat(vm.Productlist.weekDetails[i].qty));
        if (i < 0 || i >= vm.Productlist_old.weekDetails.length) return;
        if (vm.Productlist_old.weekDetails[i].qty_old != parseFloat(vm.Productlist.weekDetails[i].qty)) {
          vm.color_active2 = 1;
        }else{
          vm.color_active2 = 0;
        }
        console.log(vm.color_active2);
      },
      change_data2(i) {
        const vm = this;
        if (i < 0 || i >= vm.Productlist_old.weekDetails.length) return;
        if (vm.Productlist_old.weekDetails[i].note_old != vm.Productlist.weekDetails[i].note) {
          vm.color_active3 = 1;
        }else{
          vm.color_active3 = 0;
        }
      },
      handleBeforeUnload(e) {
          const message = "Are you sure you want to leave? Changes you made may not be saved.";
          e.returnValue = message; // สำหรับเบราว์เซอร์บางตัว
          return message; // สำหรับเบราว์เซอร์อื่น ๆ
      },
      async get_all_store_user(){
        try {
          const form = {
            group_customer_id: this.userData.group_customer_id,
            user_id: this.userData.id,
            select_user_id: this.user_id,
            user_code: this.userData.code,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_store_user2(form);
          this.storelist = response.data.data.filter(x => x.account_name != null && x.store_code != null && x.account_type_name != null && x.store_name != null && x.name_in_thai != null);
          this.storelist.forEach((item, index) => {
            item.store_name_report = item.account_name+' '+item.store_code+' '+item.account_type_name+' '+item.store_name+' '+item.name_in_thai;

              // item.store_name_report = item.account_name+item.branch_name+item.province_name;
          });
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async get_user_for_admin(){
        try {
          const form = {
            group_customer_id: this.userData.group_customer_id,
            user_id: this.userData.id,
            user_code: this.userData.code,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_user_for_admin(form);
          this.user_for_admin = response.data.data
          this.user_for_admin.forEach((item, index) => {
            item.newname = item.code+' '+item.name+' '+item.last_name;
          });
        } catch (error) {
          console.error('Error:', error);
        }
      },
    },
    computed: {
      buttonColor() {
        const vm = this;
        console.log(vm.color_active2);
        console.log(vm.color_active3);
        return (vm.color_active > 0  || vm.color_active2==1 || vm.color_active3==1? 'primary' : 'secondary');
      }
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
          this.updateDatePickerConfig(); // เรียกฟังก์ชันเพื่ออัปเดต config เมื่อ specificDisabledDates เปลี่ยนแปลง
        },
        immediate: true // เรียกใช้งานทันทีเมื่อโหลดครั้งแรก
      }
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
          this.apiurl = import.meta.env.VITE_API_URL;
          this.userData = userData.value;
          console.log(this.userData);
            // this.getall();
            this.get_all_store_user();
            this.generateWeekRanges(new Date(this.startweek));
            // this.week1Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week2Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week3Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week4Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week5Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week6Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week7Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week8Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week9Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week10Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week11Range = this.calculateWeekRange(new Date(this.startweek));
            // this.week12Range = this.calculateWeekRange(new Date(this.startweek));
            this.updateDatePickerConfig();
            this.get_user_for_admin();
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
        });

        
    }
}
</script>

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
