<template>
  <div>
    <VRow>
      <!-- <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6"> -->
      <VCol
        cols="12"
        md="6"
      >
        <h4 class="text-h4 font-weight-medium">
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
        <VRow style="align-items: end;justify-content: end;">
          <VCol
            cols="6"
            md="2"
          >
            <VBtn
              v-if="Productlist.id>0"
              :color="buttonColor"
              @click="save_PricePromotionList_confirm"
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
                cols="12"
                md="4"
              >
                <AppAutocomplete 
                  v-model="group_id" 
                  label="ร้านค้า"
                  placeholder="เลือกร้านค้า" 
                  :items="datalist" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:model-value="get_price_check_day"
                />
              </VCol>
                
              <VCol
                cols="6"
                md="4"
              >
                <AppDateTimePicker 
                  :key="datePickerKey" 
                  v-model="date_now" 
                  label="โหลดข้อมูล" 
                  placeholder="โหลดข้อมูล" 
                  :min="minDate" 
                  :max="maxDate"
                  :config="datePickerConfig"
                  @change="get_all_PricePromotion"
                />
              </VCol>
            </VRow>
          </VCardText>
          <VDivider />

          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="4"
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
                  v-model="msl"
                  label="MSL"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText>
            <template
              v-for="(v,i) in Productlist.pricePromotionDetails"
              :key="i"
            >
              <VRow :style="(i%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppTextField
                    v-model="v.mapProductStoreList.product.name"
                    placeholder=""
                    type="text"
                    :label="(i+1)+'.SKU'"
                    readonly
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="1"
                  class="d-flex align-self-end"
                >
                  <AppTextField
                    v-model="v.price"
                    placeholder="0"
                    type="number"
                    :min="0"
                    label="ราคาปกติ"
                    @keydown="preventInvalidKeys"
                    @keyup="change_data2(i,1)"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="3"
                >
                  <AppSelect
                    v-model="v.promotion_id"
                    :items="['PO', '2For', '2Free1', 'Other']"
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
                    v-model="v.special_price"
                    placeholder="0"
                    type="number"
                    :min="0"
                    label="ราคาพิเศษ"
                    @keydown="preventInvalidKeys"
                    @keyup="change_data2(i,2)"
                  />
                </VCol>
                <VCol
                  cols="6"
                  md="3"
                >
                  <DemoDateTimePickerRange
                    v-model="v.daterange"
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
                    :id="'fileInput'+i"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    style="display: none;"
                    @change="(event) => handleFiles(event, i)"
                  >
                  <VIcon
                    size="30"
                    icon="tabler-photo-plus"
                    @click="selectFiles(i)"
                  />
                  <VIcon
                    v-if="v.previews.length>0"
                    size="30"
                    icon="tabler-eye"
                    @click="show_preview1(i)"
                  />
                  <VIcon
                    v-if="v.previews.length>0"
                    size="30"
                    icon="tabler-edit"
                    @click="show_preview2(i)"
                  />
                  {{ v.previews.url }}
                </VCol>
                  
                <VCol
                  cols="6"
                  md="1"
                  class="d-flex align-self-end"
                >
                  <AppTextField
                    v-model="v.qty_in"
                    placeholder="0"
                    type="number"
                    label="รับเข้า"
                    @keyup="change_data2(i,3)"
                  />
                </VCol>
                <VCol
                  cols="6"
                  md="1"
                  class="d-flex align-self-end"
                >
                  <AppTextField
                    v-model="v.qty_out"
                    placeholder="0"
                    type="number"
                    label="ใช้ไป"
                    @keyup="change_data2(i,4)"
                  />
                </VCol>
                <VCol
                  cols="6"
                  md="1"
                  class="d-flex align-self-end"
                >
                  <AppTextField
                    v-model="v.stock"
                    placeholder="0"
                    type="number"
                    label="คงเหลือ"
                    @keyup="change_data2(i,5)"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="8"
                >
                  <AppTextField
                    v-model="v.note"
                    placeholder=""
                    type="text"
                    label="หมายเหตุ"
                    @keyup="change_data2(i,6)"
                  />
                </VCol>
              </VRow>
            </template>
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
              <VImg
                :src="swiperImg.url"
                style="cursor: pointer;"
                @click="openInNewTab(swiperImg.url)"
              />
            </VCol>

            <!--
              <VCol
              cols="12"
              sm="12"
              md="12"
              >
              <swiper-container
              slides-per-view="4"
              grid-fill="rows"
              space-between="30"
              grid-rows="2"
              pagination-clickable="true"
              events-prefix="swiper-"
              >
              <swiper-slide
              v-for="(swiperImg,index) in imagePreviews"
              :key="index"
              >
              <VImg :src="swiperImg.url" />
              </swiper-slide>
              </swiper-container>
              </VCol> 
            -->
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

// import Fancybox from "@fancyapps/ui";

register()

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data: () => ({
    msl: true,
    images: [swiper31, swiper32, swiper33, swiper34, swiper35],
    isDialogVisible: false,
    datesave: new Date().getFullYear() + '-' + 
                      String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                      String(new Date().getDate()).padStart(2, '0'),
    date_now: null,
    maxDate: new Date().toISOString().split("T")[0], // วันที่ปัจจุบัน
    minDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 วันก่อนหน้า
    currentMonth: new Date().toLocaleString('default', { month: '2-digit' }),
    currentYear: new Date().getFullYear(),
    specificDisabledDates: [],
    select_store: '',
    breadcrumbs: [],

    // date_now:new Date(),
    date_start: new Date(),
    date_end: new Date(),
    rowdata: [],
    show_p: false,
    datalist: [],
    Productlist: [],
    Productlist_old: [],
    group_id: null,
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
  }),
  computed: {
    buttonColor() {
      const vm = this
      
      return (vm.color_active > 0  || vm.color_active1==1 || vm.color_active2==1 || vm.color_active3==1 || vm.color_active4==1 || vm.color_active5==1 || vm.color_active6==1? 'primary' : 'secondary')
    },
  },
  watch: {
    date_now(newDate) {
      const selectedDate = new Date(newDate)
      const minDate = new Date(this.minDate)
      const maxDate = new Date(this.maxDate)

      // if (selectedDate < minDate) {
      //   this.date_now = this.minDate; // ตั้งค่าเป็น minDate หากเลือกย้อนหลังเกิน 7 วัน
      // } else if (selectedDate > maxDate) {
      //   this.date_now = this.maxDate; // ตั้งค่าเป็น maxDate หากเลือกวันที่อนาคต
      // }
    },
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
      this.getall()
      this.updateDatePickerConfig()

      // window.addEventListener('beforeunload', function (e) {
      //   // Custom message to be displayed in the dialog
      //   const message = "Are you sure you want to leave? Changes you made may not be saved.";

      //   // Set the returnValue property of the event to the message (for compatibility)
      //   e.returnValue = message; 

      //   // Return the message (some browsers may ignore the message)
      //   return message;
      // });

      Fancybox.bind("[data-fancybox='gallery']", {
        // ตั้งค่าตัวเลือกต่าง ๆ ของ Fancybox (ถ้าต้องการ)
        loop: true, // เปิดการวนลูปสไลด์
        buttons: ["zoom", "slideShow", "thumbs", "close"],
      })
    })

        
  },
  methods: {
    preventInvalidKeys(e) {
      const invalidKeys = ['-', '+', 'e', 'E', '.', ',']
      if (invalidKeys.includes(e.key)) {
        e.preventDefault()
      }
    },
    get_notsell(k){
      const vm = this

      console.log(vm.Productlist.pricePromotionDetails[k].not_sell)
      vm.Productlist.pricePromotionDetails[k].stock = 0
        
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
    async get_all_PricePromotion() {
      this.color_active = 0
      this.color_active2 = 0
      this.color_active3 = 0
      try {
        if (this.group_id && this.date_now && this.datesave) {
          const form = {
            group_id: this.group_id,
            datenow: this.date_now,
            datesave: this.datesave,
          }

          const response = await apiService.get_all_PricePromotion(form)

          console.log(response.data.status)
          if(response.data.status == 'success'){
            var data = response.data.data
            var Productlist = []
            var Productlist_old = []
            Productlist = data
            Productlist_old = data
            this.specificDisabledDates = response.data.specificDisabledDates // อัปเดต specificDisabledDates แบบเรียลไทม์
              
            let pricePromotionDetails = Productlist.pricePromotionDetails
            pricePromotionDetails.forEach((item, index) => {
                
              item.stock_old = item.stock
              item.note_old = item.note
              item.previews = []
              if(item.picture_cut.length > 0){
                item.previews = item.picture_cut
              }
            })
            this.Productlist = Productlist
            this.Productlist_old = Productlist_old
            console.log(this.Productlist)
            console.log(this.Productlist_old)
          }else{
            this.Productlist = []
            this.Productlist_old = []
            if(response.data.status == 'error' && response.data.count == 0){
              Swal.fire({
                title: "ไม่พบข้อมูล!",
                text: "ต้องการสร้างครั้งแรกหรือไม่?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ยืนยัน",
              }).then(result => {
                if (result.isConfirmed) {
                  this.create_new_PricePromotion()
                    
                }
              })
            }else{
              Swal.fire({
                title: 'ไม่พบข้อมูล!',
                icon: 'warning',
                confirmButtonText: 'OK',
              })
            }
              
          }
            
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
    async get_price_check_day() {
      this.color_active = 0
      this.color_active2 = 0
      this.color_active3 = 0

      if (this.group_id && this.datesave) {
        const form = {
          group_id: this.group_id,
          datesave: this.datesave,
        }

        await apiService.get_price_check_day(form)
          .then(response => {
            if(response.data.status == 'success'){
              this.specificDisabledDates = response.data.specificDisabledDates
            }else{
              
            }
          })
          .catch(error => {
            console.error('Error :', error)
          })
      }
    },
    async create_new_PricePromotion() {
      const form = {
        group_id: this.group_id,
        datenow: this.date_now,
        datesave: this.datesave,
      }

      const response2 = await apiService.create_new_PricePromotion(form)
      if(response2.data.status == 'success'){
        var data = response2.data.data
        var Productlist = []
        var Productlist_old = []
        Productlist = data
        Productlist_old = data
        this.specificDisabledDates = response2.data.specificDisabledDates // อัปเดต specificDisabledDates แบบเรียลไทม์
          
        let pricePromotionDetails = Productlist.pricePromotionDetails
        pricePromotionDetails.forEach((item, index) => {
            
          item.stock_old = item.stock
          item.note_old = item.note
          item.previews = []
          if(item.picture_cut.length > 0){
            item.previews = item.picture_cut
          }
        })
        this.Productlist = Productlist
        this.Productlist_old = Productlist_old
        console.log(this.Productlist)
        console.log(this.Productlist_old)
      }
    },
    async create_new_PricePromotion2() {
      console.log(this.Productlist.pricePromotionDetails)
      var newdata = this.Productlist.pricePromotionDetails
      console.log(newdata)

      const formRequests = newdata.map(item => {
        const formData = new FormData()

        item.previews.forEach(preview => {
          formData.append('picture', preview.file)
        })
        formData.append('id', item.id)
        formData.append('old_id', item.old_id)
        formData.append('old_pricepromotion_id', item.old_pricepromotion_id)
        formData.append('group_id', this.group_id)

        formData.append('datenow', this.date_now)
          
        formData.append('datesave', this.datesave)
        formData.append('price', item.price)
        formData.append('promotion_id', item.promotion_id)
        formData.append('special_price', item.special_price)
        formData.append('daterange', item.daterange)
        formData.append('qty_in', item.qty_in)
        formData.append('qty_out', item.qty_out)
        formData.append('stock', item.stock)
        formData.append('note', item.note)
        console.log(formData)

        // ส่ง request แต่ละรายการแยกกัน
        return apiService.createOrUpdate_PricePromotionList(formData)
      })

      // รอจนกว่าทุก request จะสำเร็จ
      await Promise.allSettled(formRequests)
      Swal.fire({
        html: '<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => Swal.showLoading(),
        willClose: () => window.location.reload(),
      })

      // Swal.fire({
      //   title: 'บันทึกสำเร็จ!',
      //   icon: 'success',
      //   confirmButtonText: 'OK'
      // });

      this.get_all_PricePromotion()
    },
    updateDatePickerConfig() {
      this.datePickerConfig = {
        dateFormat: 'Y-m-d',
        disable: [
          { from: `01-01-${this.currentYear}`, to: this.minDate }, // ปิดการใช้งานช่วงวันที่ก่อน minDate
          ...this.specificDisabledDates.map(date => ({ from: date, to: date })), // ปิดการใช้งานวันที่เฉพาะเจาะจง
        ],
      }

      // บังคับให้ AppDateTimePicker รีเรนเดอร์ใหม่
      this.datePickerKey += 1
    },

    // async save_PricePromotionList() {
    //   try {
    //     const formData = new FormData();

    //     // รวมข้อมูลที่ไม่ใช่ไฟล์ทั้งหมดเป็นรายการเดียว
    //     this.Productlist.pricePromotionDetails.forEach((item, index) => {
    //       formData.append(`data[${index}][id]`, item.id);
    //       formData.append(`data[${index}][group_id]`, this.group_id);
    //       formData.append(`data[${index}][datenow]`, this.date_now);
    //       formData.append(`data[${index}][datesave]`, new Date(this.datesave).toISOString().split('T')[0]);
    //       formData.append(`data[${index}][map_product_store_list_id]`, item.map_product_store_list_id);
    //       formData.append(`data[${index}][price]`, item.price);
    //       formData.append(`data[${index}][promotion_id]`, item.promotion_id);
    //       formData.append(`data[${index}][special_price]`, item.special_price);
    //       formData.append(`data[${index}][daterange]`, item.daterange);
    //       formData.append(`data[${index}][qty_in]`, item.qty_in);
    //       formData.append(`data[${index}][qty_out]`, item.qty_out);
    //       formData.append(`data[${index}][stock]`, item.stock);
    //       formData.append(`data[${index}][note]`, item.note);

    //       // แยกไฟล์ออกมาแต่ละรูปภาพใน `FormData`
    //       item.previews.forEach((preview, fileIndex) => {
    //         formData.append(`data[${index}][pictures][${fileIndex}]`, preview.file);
    //       });
    //     });

    //     // ส่งข้อมูลทั้งหมดไปยัง API
    //     await apiService.createOrUpdate_PricePromotionList(formData);

    //     Swal.fire({
    //       title: 'บันทึกสำเร็จ!',
    //       icon: 'success',
    //       confirmButtonText: 'OK'
    //     });

    //     this.get_all_PricePromotion();
    //   } catch (error) {
    //     console.error('Error:', error);
    //     Swal.fire({
    //       title: 'เกิดข้อผิดพลาด!',
    //       text: error.message,
    //       icon: 'error',
    //       confirmButtonText: 'OK'
    //     });
    //   }
    // },
    async save_PricePromotionList_confirm(){
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
          this.save_PricePromotionList()
        }
      })
    },
    async save_PricePromotionList(){
      try {
        const form = {
          group_id: this.group_id,
          datenow: this.date_now,
          datesave: this.datesave,
        }

        const response2 = await apiService.create_new_PricePromotion2(form)
        var data = response2.data.data
        let pricePromotionDetails = data.pricePromotionDetails
        pricePromotionDetails.forEach((item, index) => {
          console.log(item)
          this.Productlist.pricePromotionDetails[index].old_id = this.Productlist.pricePromotionDetails[index].id
          this.Productlist.pricePromotionDetails[index].old_pricepromotion_id = this.Productlist.pricePromotionDetails[index].pricepromotion_id

          this.Productlist.pricePromotionDetails[index].id = item.id
          this.Productlist.pricePromotionDetails[index].pricepromotion_id = item.pricepromotion_id
            
        })
        console.log(this.Productlist.pricePromotionDetails)
        this.create_new_PricePromotion2()
          
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
    change_checkboxt(i) {
      const vm = this
        
    },
    change_data(i) {
      const vm = this

      console.log(vm.Productlist_old.pricePromotionDetails[i].stock_old)
      console.log(parseFloat(vm.Productlist.pricePromotionDetails[i].stock))
      if (i < 0 || i >= vm.Productlist_old.pricePromotionDetails.length) return
      if (vm.Productlist_old.pricePromotionDetails[i].stock_old != parseFloat(vm.Productlist.pricePromotionDetails[i].stock)) {
        vm.color_active2 = 1
      }else{
        vm.color_active2 = 0
      }
      console.log(vm.color_active2)
    },
    change_data2(i, id) {
      const vm = this
      if (i < 0 || i >= vm.Productlist_old.pricePromotionDetails.length) return
      if(id == 1){
        if (vm.Productlist_old.pricePromotionDetails[i].price_old != vm.Productlist.pricePromotionDetails[i].price) {
          vm.color_active1 = 1
        }else{
          vm.color_active1 = 0
        }
      }else if(id == 2){
        if (vm.Productlist_old.pricePromotionDetails[i].special_price_old != vm.Productlist.pricePromotionDetails[i].special_price) {
          vm.color_active2 = 1
        }else{
          vm.color_active2 = 0
        }
      }else if(id == 3){
        if (vm.Productlist_old.pricePromotionDetails[i].qty_in_old != vm.Productlist.pricePromotionDetails[i].qty_in) {
          vm.color_active3 = 1
        }else{
          vm.color_active3 = 0
        }
      }else if(id == 4){
        if (vm.Productlist_old.pricePromotionDetails[i].qty_out_old != vm.Productlist.pricePromotionDetails[i].qty_out) {
          vm.color_active4 = 1
        }else{
          vm.color_active4 = 0
        }
      }else if(id == 5){
        if (vm.Productlist_old.pricePromotionDetails[i].stock_old != vm.Productlist.pricePromotionDetails[i].stock) {
          vm.color_active5 = 1
        }else{
          vm.color_active5 = 0
        }
      }else{
        if (vm.Productlist_old.pricePromotionDetails[i].note_old != vm.Productlist.pricePromotionDetails[i].note) {
          vm.color_active6 = 1
        }else{
          vm.color_active6 = 0
        }
      }
        
    },

    // Picture
    handleFiles(event, i) {
      // ตรวจสอบว่ามี event และ target ก่อนใช้งาน
      if (event && event.target) {
        console.log(i) // แสดงค่า i ใน console
        this.selectedFiles = Array.from(event.target.files)


        // this.Productlist.pricePromotionDetails[i].previews = Array.from(event.target.files).map(file => ({ file }));
        // console.log(this.Productlist.pricePromotionDetails[i]);
        const files = this.selectedFiles

        this.previewImages(files, i)
      } else {
        console.error('Event หรือ event.target ไม่พร้อมใช้งาน')
      }
    },
    selectFiles(i) {
      // ใช้ document.querySelector เพื่อเลือก input และเรียก click()
      document.querySelector('#fileInput'+i).click()
    },
    handleDrop(event) {
      const files = event.dataTransfer.files

      this.previewImages(files)
    },
    previewImages(files, i) {
        
      Array.from(files).forEach(file => {
        if (this.Productlist.pricePromotionDetails[i].previews.length >= 40) return // Limit to 40 images
        const reader = new FileReader()

        reader.onload = e => {
          this.Productlist.pricePromotionDetails[i].previews.push({
            name: file.name,
            file: file, // เก็บไฟล์ไว้เพื่อส่งให้ API
            url: e.target.result,
          })
        }
        reader.readAsDataURL(file)
      })
      console.log(this.Productlist.pricePromotionDetails[i])
    },
    deleteImage(id, name) {
      console.log(id)
      console.log(name)

      // this.Productlist.pricePromotionDetails[i].previews.splice(index, 1);
    },

    // Picture
    show_preview1(index) {
      // this.isDialogVisible = true;
      // this.imagePreviews = this.Productlist.pricePromotionDetails[index].previews;
      const imagePreviews = this.Productlist.pricePromotionDetails[index].previews

      console.log(imagePreviews)
      Fancybox.close()
      Fancybox.show(
        imagePreviews.map(image => ({
          src: image.url,
          type: "image",
          caption: `
                    <div style="position: relative;">
                        <button class="delete-button" data-id="${image.id}" data-name="${image.name}"
                            style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 18px; cursor: pointer; color: red;">
                            ✖
                        </button>
                        <span>Image Preview</span>
                    </div>
                `,
        })),
        {
          startIndex: index,
          loop: true,
          afterShow: () => {
            // ตรวจสอบปุ่มลบเมื่อเปิด Fancybox
            document.querySelectorAll('.delete-button').forEach(button => {
              button.addEventListener('click', event => {
                const id = event.target.getAttribute('data-id')
                const name = event.target.getAttribute('data-name')

                this.deleteImage(id, name) // เรียกฟังก์ชันลบในโปรเจกต์ของคุณ
                Fancybox.close() // ปิด Fancybox หลังจากลบ
              })
            })
          },
        },
      )
    },
    show_preview2(index) {
      this.isDialogVisible = true
      this.imagePreviews = this.Productlist.pricePromotionDetails[index].previews

      // const imagePreviews = this.Productlist.pricePromotionDetails[index].previews;
      // Fancybox.close();
      // Fancybox.show(
      //     imagePreviews.map((image) => ({
      //         src: image.url,
      //         type: "image",
      //         caption: `
      //             <div style="position: relative;">
      //                 <button class="delete-button" data-id="${image.id}" data-name="${image.name}"
      //                     style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 18px; cursor: pointer; color: red;">
      //                     ✖
      //                 </button>
      //                 <span>Image Preview</span>
      //             </div>
      //         `,
      //     })),
      //     {
      //         startIndex: index,
      //         loop: true,
      //         afterShow: () => {
      //             // ตรวจสอบปุ่มลบเมื่อเปิด Fancybox
      //             document.querySelectorAll('.delete-button').forEach(button => {
      //                 button.addEventListener('click', (event) => {
      //                     const id = event.target.getAttribute('data-id');
      //                     const name = event.target.getAttribute('data-name');
      //                     this.deleteImage(id, name); // เรียกฟังก์ชันลบในโปรเจกต์ของคุณ
      //                     Fancybox.close(); // ปิด Fancybox หลังจากลบ
      //                 });
      //             });
      //         }
      //     }
      // );
    },
      
    openInNewTab(base64Url) {
      // สร้างลิงก์ชั่วคราวแล้วใช้ open() เพื่อเปิดในแท็บใหม่
      const newTab = window.open()

      newTab.document.body.innerHTML = `<img src="${base64Url}" style="max-width: 100%; max-height: 100%;">`
    },
  },
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
