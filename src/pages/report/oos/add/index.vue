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
          OOS & Stock
        </h4>
        <!-- <div class="text-body-1">
          Orders placed across your store
        </div> -->
      </VCol>

      <VCol cols="12" md="6">
        <!-- <VBtn variant="tonal" color="secondary" @click="get_all_Oos">
          โหลดข้อมูล
        </VBtn> -->
        <VRow class="fixed-new" style="align-items: end;justify-content: end;">
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
              @click="exportData('exceloos')"
              class="responsive-btn"
            >
              Export
            </VBtn>
            
            <VBtn v-if="Productlist.id>0 && userData.position_name != 'Assistant Management' && userData.position_name != 'Management'" color="primary" @click="save_oos_confirm">บันทึก</VBtn>
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
                <VCol cols="12" md="3">
                  <AppAutocomplete 
                    v-model="group_id" 
                    label="Group name"
                    placeholder="เลือก Group name" 
                    :items="datalist" 
                    item-title="new_name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="set_group_id"/>
                </VCol>
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
                    @change="get_all_Oos"
                  />
                </VCol>
                <VBtn
                  color="secondary"
                  style="margin-block-start: 36px;"
                  @click="confirmRenewProductOos"
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
              </VRow>
            </VCardText>
            <VDivider />

            <VCardText v-if="Productlist">
              <VTabs v-if="Productlist.oosDetails" v-model="currentTab" align-tabs="center">
                <VTab v-for="(value,index) in groupedData" :key="index">{{index}}</VTab>
              </VTabs>

              <VCardText v-if="Productlist.oosDetails" style="padding-block: 5px;padding-inline: 0;">
                <VWindow v-model="currentTab">
                  <VWindowItem v-for="(value,index) in groupedData" :key="index">
                    <VRow v-for="(value2,index2) in value" :key="index2">
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
                              <VCol cols="12" md="3" style="display: flex;align-items: center;">
                                {{(index3+1)}} {{ value3.mapProductStoreList.product.name }} {{ (value3.mapProductStoreList.product.flavor?'('+value3.mapProductStoreList.product.flavor+')':'') }}
                                <!-- <AppTextField v-model="value3.mapProductStoreList.product.name"  placeholder="" type="text" :label="(i+1)+'.SKU'" readonly /> -->
                              </VCol>
                                <VCol cols="6" md="2" class="d-flex align-self-center" style="display: flex;align-items: end;justify-content: center;padding: 0;">
                                <v-checkbox v-model="value3.not_sell" label="ไม่ขาย" @change="() => { value3.qty = value3.not_sell ? 0 : value3.qty;value3.note = value3.not_sell ? null : value3.note; get_notsell(i); }"></v-checkbox>
                                </VCol>
                                <VCol v-if="value3.mapProductStoreList.stock == 'Y'" cols="12" md="2" class="d-flex align-self-end" style="align-items: end;">
                                <AppTextField
                                  v-model="value3.qty"
                                  placeholder="0"
                                  type="number"
                                  label="สต๊อกคงเหลือ"
                                  @keyup="change_data(i)"
                                  :min="0"
                                  @keydown="preventInvalidKeys"
                                  :disabled="(value3.not_sell==true || value3.not_sell=='Y')"
                                />
                                <span style="inline-size: 100px;margin-block-end: 8px;margin-inline-start: 5px;">{{value3.mapProductStoreList.product.unit}}</span>
                                </VCol>

                              <VCol v-if="value3.mapProductStoreList.oos == 'Y'" cols="6" md="1" class="d-flex align-self-center" style="display: flex;align-items: end;justify-content: center;padding: 0;">
                                <v-radio-group
                                  v-model="value3.oos_status"
                                  inline
                                >
                                  <v-radio
                                    
                                    label="ไม่มี OOS"
                                    value="N"
                                    @change="change_checkboxt(i)"
                                    :disabled="(value3.not_sell==true || value3.not_sell=='Y')"
                                  ></v-radio>
                                  <v-radio  
                                    label="มี OOS"
                                    value="Y"
                                    @change="change_checkboxt(i)"
                                    :disabled="(value3.not_sell==true || value3.not_sell=='Y')"
                                  ></v-radio>
                                </v-radio-group>

                              </VCol>
                              

                              <VCol v-if="value3.mapProductStoreList.oos == 'Y'" cols="12" md="2">
                                <AppAutocomplete 
                                v-model="value3.note" 
                                label="เหตุผล"
                                placeholder="เหตุผล" 
                                :items="datalistNoteoosstock" 
                                item-title="name"
                                item-value="id"
                                clearable 
                                clear-icon="tabler-x"
                                :disabled="value3.oos_status === 'N' || value3.not_sell === true || value3.not_sell === 'Y'"/>
                                <!-- <AppTextField v-model="value3.note" placeholder="" type="text" label="เหตุผล" @keyup="change_data2(i)"/> -->
                              </VCol>
                            </VRow>
                        </template>
                      </VCol> 
                    </VRow> 
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
      dis_date:true,
      currentTab:'item-1',
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
      select_store:'',
      breadcrumbs:[],
      // date_now:new Date(),
      date_start:new Date(),
      date_end:new Date(),
      rowdata:[],
      show_p:false,
      storelist:[],
      datalist:[],
      datalistNoteoosstock:[],
      Productlist:[],
      Productlist_old:[],
      group_id:null,
      store_id:null,
      user_id:null,
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
        baseUrl += `exceloos/${this.userData.id}/${this.store_id || 'null'}/${this.group_id || 'null'}/${this.user_id || 'null'}`;

        const finalUrl = `${baseUrl}/${this.startDate_select}/${this.endDate_select}`;
        
        console.log("Exporting to URL:", finalUrl);

        window.open(finalUrl, '_blank');
      },
      async confirmRenewProductOos() {
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
            this.renewProductOos();
          }
        });
      },
      
      async renewProductOos() {
        if (!this.user_id || !this.store_id) {
          Swal.fire({ icon: 'warning', title: 'กรุณาเลือก User และ Store' });
          return;
        }
        try {
          const form = {
            user_id: this.user_id,
            store_id: this.store_id,
            datesave: this.datesave,
          };
          const response = await apiService.renew_product_oos(form);
          if (response.data.status === 'success') {
            Swal.fire({ icon: 'success', title: 'อัปเดตรายการสินค้าสำเร็จ' });
            this.get_all_Oos(); // โหลดข้อมูลใหม่
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
      get_notsell(k){
        const vm = this;
        // console.log(vm.Productlist.oosDetails[k].not_sell)
        vm.Productlist.oosDetails[k].qty = 0;
        
        if (k < 0 || k >= vm.Productlist_old.oosDetails.length) return;
        if (vm.Productlist_old.oosDetails[k].not_sell_old != vm.Productlist.oosDetails[k].not_sell) {
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
          this.storelist = response.data.data;
          this.storelist.forEach((item, index) => {
            // if(!item.store_name_report){
              item.store_name_report = item.account_name+' '+item.store_code+' '+item.account_type_name+' '+item.store_name+' '+item.name_in_thai;
            // }
              
          });
          //item.store_name_report = item.account_name+item.branch_name+item.province_name;
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
      async get_all_Noteoosstock(){
        try {
          var form = {
            group_id: this.userData.group_customer_id,
          }
          const response = await apiService.get_all_Noteoosstock_filter(form);
          this.datalistNoteoosstock = response.data.data;
          
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async get_group_name2(){
        try {
         
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
            report: 'oos'
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
        this.get_all_Oos_date();
        
        this.dis_date = false;
        if(!this.date_now){
          this.get_all_Oos_first()
        }else{
          this.get_all_Oos();
        }
      },
      async get_all_Oos_first() {
        const vm = this;
        this.color_active = 0;
        this.color_active2 = 0;
        this.color_active3 = 0;
        if(!this.date_now){
          try {
            if (this.group_id) {
              const form = {
                group_id: this.group_id,
                datenow: new Date().getFullYear() + '-' + 
                      String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                      String(new Date().getDate()).padStart(2, '0'),
                datesave: this.datesave,
                user_id: this.userData.id
              };
              
              const response = await apiService.get_all_Oos_first(form);
              // if(response.data.status == "success"){
                this.date_now = new Date().getFullYear() + '-' + 
                      String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                      String(new Date().getDate()).padStart(2, '0')
              // }
              
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      },
      async get_all_Oos_date(){
        try {
          const dateTime = new Date();
          const dateOnly = new Date(dateTime).toISOString().split('T')[0];
          const form = {
            group_id: this.group_id,
            datenow: (this.date_now?this.date_now:dateOnly),
            store_id: this.store_id,
          };
          const response = await apiService.get_all_Oos_date(form);
          this.specificDisabledDates = response.data.specificDisabledDates;
          this.get_all_Noteoosstock();
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async get_all_Oos() {
        const vm = this;
        this.color_active = 0;
        this.color_active2 = 0;
        this.color_active3 = 0;
        if(this.date_now != ""){
          try {
            if (this.group_id) {
              if(this.userData.position_name == 'พนักงาน'){
                this.user_id = this.userData.id;
              }
              const form = {
                group_id: this.group_id,
                store_id: this.store_id,
                datenow: this.date_now,
                datesave: this.datesave,
                user_id: this.user_id,              
                store_id: this.store_id,
                position_name: this.userData.position_name,
              };
              const response = await apiService.get_all_Oos(form);
              var data = response.data.data;
              var Productlist = [];
              var Productlist_old = [];
              Productlist = data;
              Productlist_old = data;
              this.specificDisabledDates = response.data.specificDisabledDates; // อัปเดต specificDisabledDates แบบเรียลไทม์
              this.groupedData = response.data.groupedData;
              
              if (typeof vm.groupedData === 'object' && vm.groupedData !== null) {
                Object.keys(vm.groupedData).forEach((key) => {
                  const groupedItem = vm.groupedData[key];
                  if (Array.isArray(groupedItem)) {
                    // ถ้า groupedItem เป็น Array ให้วนลูปปกติ
                    groupedItem.forEach((item) => {
                      item.note = (item.note?parseInt(item.note):null);
                      item.not_sell = item.not_sell == 'Y' ? true : false;
                      // item.oos_status = item.oos_status == 'Y' ? true : false;
                      // item.oos_status2 = item.oos_status2 == 'Y' ? true : false;
                    });
                  } else {
                    // ถ้า groupedItem ยังมี nested object ให้วนลูปในระดับถัดไป
                    Object.keys(groupedItem).forEach((subKey) => {
                      const subItems = groupedItem[subKey];
                      if (Array.isArray(subItems)) {
                        subItems.forEach((subItem) => {
                          subItem.note = (subItem.note?parseInt(subItem.note):null);
                          subItem.not_sell = subItem.not_sell == 'Y' ? true : false;
                          // subItem.oos_status = subItem.oos_status == 'Y' ? true : false;
                          // subItem.oos_status2 = subItem.oos_status2 == 'Y' ? true : false;
                        });
                      }
                    });
                  }
                });
              }
              console.log(this.groupedData);
              let oosDetails = Productlist.oosDetails;
              oosDetails.forEach((item, index) => {
                var oos_status = item.oos_status;
                var oos_status2 = item.oos_status2;
                
                var not_sell = item.not_sell;
                // item.oos_status = oos_status == 'Y' ? true : false;
                // item.oos_status2 = oos_status2 == 'Y' ? true : false;
                // console.log(item.oos_status);
                item.not_sell = not_sell == 'Y' ? true : false;

                item.oos_status_old = item.oos_status;
                item.oos_status2_old = item.oos_status2;
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
      validateOOSReasonBeforeSave() {
        // ฟังก์ชันวนเช็คทุกระดับใน groupedData
        const checkGroup = group => {
          if (Array.isArray(group)) {
            return group.every(item => {
              // ถ้า item เป็น array ซ้อน
              if (Array.isArray(item)) return checkGroup(item);
              // ถ้า item เป็น object ที่มี mapProductStoreList
              if (item && item.mapProductStoreList) {
                // เงื่อนไข: ช่องเหตุผล enable (oos_status === 'Y', oos == 'Y', not_sell !== true/ 'Y') แต่ note ว่าง
                if (
                  item.mapProductStoreList.oos === 'Y' &&
                  item.oos_status === 'Y' &&
                  item.not_sell !== true &&
                  item.not_sell !== 'Y' &&
                  (item.note === null || item.note === undefined || item.note === '')
                ) {
                  return false;
                }
              }
              return true;
            });
          } else if (typeof group === 'object' && group !== null) {
            return Object.values(group).every(checkGroup);
          }
          // ถ้าไม่ใช่ Array หรือ Object ให้ถือว่าผ่าน
          return true;
        };
        return checkGroup(this.groupedData);
      },
      async save_oos_confirm(){
        if (!this.validateOOSReasonBeforeSave()) {
          Swal.fire({
            icon: 'warning',
            title: 'กรุณาเลือกเหตุผล',
            text: 'กรุณาเลือกเหตุผลในกรณีที่มี OOS ให้ครบทุกช่อง',
            confirmButtonText: 'ตกลง'
          });
          return;
        }
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
            this.save_oos2();
          }
        });
      },
      async save_oos2(){
        try {
          const vm = this;
          const testform2 = [];
          console.log('groupedData:', JSON.stringify(vm.groupedData, null, 2));

          if (typeof vm.groupedData === 'object' && vm.groupedData !== null) {
            Object.keys(vm.groupedData).forEach((key) => {
              const groupedItem = vm.groupedData[key];
              if (Array.isArray(groupedItem)) {
                groupedItem.forEach((item) => {
                  testform2.push({
                    map_product_store_list_id: item.map_product_store_list_id,
                    qty: item.qty,
                    oos_status: item.oos_status,
                    oos_status2: item.oos_status2,
                    not_sell: (item.not_sell == true ? 'Y' : 'N'),
                    note: item.note,
                    stock: item.mapProductStoreList ? item.mapProductStoreList.stock : null
                  });
                });
              } else {
                Object.keys(groupedItem).forEach((subKey) => {
                  const subItems = groupedItem[subKey];
                  if (Array.isArray(subItems)) {
                    subItems.forEach((subItem) => {
                      testform2.push({
                        map_product_store_list_id: subItem.map_product_store_list_id,
                        qty: subItem.qty,
                        oos_status: subItem.oos_status,
                        oos_status2: subItem.oos_status2,
                        not_sell: (subItem.not_sell == true ? 'Y' : 'N'),
                        note: subItem.note,
                        stock: subItem.mapProductStoreList ? subItem.mapProductStoreList.stock : null
                      });
                    });
                  }
                });
              }
            });
          }

          if(this.userData.position_name == 'พนักงาน'){
            this.user_id = this.userData.id;
          } 

          // =================================================================
          // 🌟 ส่วนที่เพิ่มใหม่: เช็คประเภทรายงาน (OOS หรือ Stock) ที่ปรากฏบนฟอร์ม
          // =================================================================
          const typesToSubmit = [];
          
          console.log('Productlist:', vm.Productlist);
          console.log('oosDetailsctlist:', vm.Productlist.oosDetailsctlist);

          if (vm.Productlist && vm.Productlist.oosDetails) {
            // หาว่ามีฟอร์มไหนที่ถูกเปิดใช้ OOS หรือ Stock บ้าง
            const hasOOS = vm.Productlist.oosDetails.some(item => item.mapProductStoreList?.oos === 'Y');
            const hasStock = vm.Productlist.oosDetails.some(item => item.mapProductStoreList?.stock === 'Y');

            console.log('hasOOS:', hasOOS);
            console.log('hasStock:', hasStock);
            
            // ใช้ชื่อให้ตรงกับที่คุณตั้งในระบบ Task (เช่น OOS, Stock)
            if (hasOOS) typesToSubmit.push('OOS');
            if (hasStock) typesToSubmit.push('Stock');
          }
          // =================================================================

          const form = {
            group_id: this.group_id,
            store_id: this.store_id,
            datenow: this.date_now,
            datesave: this.datesave,
            user_id: this.user_id,
            testform2: testform2,
            reportTypesToSubmit: typesToSubmit // 🌟 ส่งแนบไปให้ Backend
          };

          const response2 = await apiService.create_oos2(form);
          var data = response2.data.data;
          this.save_oos(); // อัปเดต state ตัวเก่าให้ตรงกัน
          
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
      async save_oos(){
        const vm = this;
        try {
          const form2 = [];
          const testform2 = [];
          // console.log(Array.isArray(vm.groupedData));
          console.log('groupedData:', JSON.stringify(vm.groupedData, null, 2));

          if (typeof vm.groupedData === 'object' && vm.groupedData !== null) {
            Object.keys(vm.groupedData).forEach((key) => {
              const groupedItem = vm.groupedData[key];
              if (Array.isArray(groupedItem)) {
                // ถ้า groupedItem เป็น Array ให้วนลูปปกติ
                groupedItem.forEach((item) => {
                  testform2.push({
                    id: item.id,
                    qty: item.qty,
                    oos_status: item.oos_status,
                    oos_status2: item.oos_status2,
                    not_sell: (item.not_sell == true ? 'Y' : 'N'),
                    note: item.note,
                    stock: item.mapProductStoreList ? item.mapProductStoreList.stock : null
                  });
                });
              } else {
                // ถ้า groupedItem ยังมี nested object ให้วนลูปในระดับถัดไป
                Object.keys(groupedItem).forEach((subKey) => {
                  const subItems = groupedItem[subKey];
                  if (Array.isArray(subItems)) {
                    subItems.forEach((subItem) => {
                      testform2.push({
                        id: subItem.id,
                        qty: subItem.qty,
                        oos_status: subItem.oos_status,
                        oos_status2: subItem.oos_status2,
                        not_sell: (subItem.not_sell == true ? 'Y' : 'N'),
                        note: subItem.note,
                        stock: subItem.mapProductStoreList ? subItem.mapProductStoreList.stock : null
                      });
                    });
                  }
                });
              }
            });
          }

          vm.Productlist.oosDetails.forEach((item, index) => {
            form2.push({
              id:item.id,
              qty:item.qty,
              oos_status:item.oos_status,
              oos_status2:item.oos_status2,
              not_sell:(item.not_sell==true?'Y':'N'),
              note:item.note
            });
          });
          console.log(testform2);
          // const response2 = await apiService.createOrUpdate_OosList(testform2);
          Swal.fire({
              html:'<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
              icon: "success",
              timer: 3000,
              timerProgressBar: true,
              didOpen: () => Swal.showLoading(),
              willClose: () => window.location.reload()
          });
          // Swal.fire({
          //   title: 'บันทึกสำเร็จ!',
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // });
          // vm.get_all_Oos();
        } catch (error) {
          console.error('Error:', error);
        }
      },
      change_checkboxt(i) {
        const vm = this;
        if (i < 0 || i >= vm.Productlist_old.oosDetails.length) return;
        if (vm.Productlist_old.oosDetails[i].oos_status_old != vm.Productlist.oosDetails[i].oos_status) {
          vm.color_active++;
        }else{
          vm.color_active--;
        }
        const item = this.yourDataList[i]
        if (item.oos_status === 'N') {
          item.note = null
        }
      },
      change_checkboxt2(i) {
        const vm = this;
        if (i < 0 || i >= vm.Productlist_old.oosDetails.length) return;
        if (vm.Productlist_old.oosDetails[i].oos_status2_old != vm.Productlist.oosDetails[i].oos_status2) {
          vm.color_active++;
        }else{
          vm.color_active--;
        }
        const item = this.yourDataList[i]
        if (item.oos_status === 'N') {
          item.note = null
        }
      },
      change_data(i) {
        const vm = this;
        console.log(vm.Productlist_old.oosDetails[i].qty_old);
        console.log(parseFloat(vm.Productlist.oosDetails[i].qty));
        if (i < 0 || i >= vm.Productlist_old.oosDetails.length) return;
        if (vm.Productlist_old.oosDetails[i].qty_old != parseFloat(vm.Productlist.oosDetails[i].qty)) {
          vm.color_active2 = 1;
        }else{
          vm.color_active2 = 0;
        }
        console.log(vm.color_active2);
      },
      change_data2(i) {
        const vm = this;
        if (i < 0 || i >= vm.Productlist_old.oosDetails.length) return;
        if (vm.Productlist_old.oosDetails[i].note_old != vm.Productlist.oosDetails[i].note) {
          vm.color_active3 = 1;
        }else{
          vm.color_active3 = 0;
        }
      },
      handleBeforeUnload(e) {
          const message = "Are you sure you want to leave? Changes you made may not be saved.";
          e.returnValue = message; // สำหรับเบราว์เซอร์บางตัว
          return message; // สำหรับเบราว์เซอร์อื่น ๆ
      }
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
          // Swal.fire({
          //   title: 'อยู๋ระหว่างการพัฒนา!',
          //   icon: 'warning',
          //   confirmButtonText: 'รับทราบ'
          // });
          console.log(this.userData);
            // this.getall();
            this.get_all_store_user();
            this.get_user_for_admin();
            this.updateDatePickerConfig();
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
