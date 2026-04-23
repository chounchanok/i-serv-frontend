<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium" style="color:white;">
          Offtake
        </h4>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn color="secondary">
          โหลดข้อมูล
        </VBtn>
        <VBtn>บันทึก</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="12">

        <!-- 👉 Variants -->
        <VCard class="mb-6">

          <VCardText>
              <VRow>
                <VCol cols="12" md="4">
                  <AppAutocomplete 
                    v-model="group_id" 
                    label="เลือก Group name"
                    placeholder="Group name" 
                    :items="datalist" 
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="get_store_for_report"
                    @click:clear="get_store_for_report" />
                </VCol>
                <VCol cols="12" md="4">
                  <AppSelect 
                    v-model="select_store" 
                    label="ร้านค้า"
                    placeholder="เลือกร้านค้า" 
                    :items="storelist" 
                    item-title="store_name_report"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="show_product"
                    @click:clear="show_product" />
                </VCol>

                 <VCol cols="12" md="2">
                  <AppDateTimePicker v-model="date_start" label="เริ่มต้น" placeholder="วันเริ่มต้น" />
                </VCol>
                <VCol cols="12" md="2">
                  <AppDateTimePicker v-model="date_end" label="สิ้นสุด" placeholder="วันสิ้นสุด" />
                </VCol>

                
              </VRow>
            </VCardText>

            <VDivider />


          <VCardText>

            <template v-if="show_p" v-for="(v,i) in rowdata" :key="i">
              <VRow :style="(i%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                <VCol cols="12" md="4">
                  <AppTextField v-model="v.product_name"  placeholder="" type="text" :label="(i+1)+'.สินค้า'"  />
                </VCol>
                <VCol cols="6" md="2" class="d-flex align-self-center" style="display: flex;align-items: end;justify-content: center;">
                  <v-checkbox v-model="v.not_sell" label="ไม่ขาย" @change="get_notsell(i);"></v-checkbox>
                </VCol>
                <!-- <VCol cols="12" md="2" class="d-flex align-self-end">
                  <AppTextField v-model="v.amount" placeholder="0" type="number" label="ยอดขาย (ชิ้น)" />
                </VCol> -->
                <VCol cols="12" md="2" class="d-flex align-self-end" style="align-items: end;">
                  <AppTextField v-model="v.amount" placeholder="0" type="number" label="ยอดขาย"/>
                  <span style="width: 100px;margin-bottom: 8px;margin-left: 5px;">แพค</span>
                </VCol>
                <VCol cols="12" md="4">
                  <AppTextField v-model="v.note" placeholder="" type="text" label="หมายเหตุ" />
                </VCol>
              </VRow>
            </template>
          </VCardText>
        </VCard>

      </VCol>

    </VRow>
  </div>
</template>










<script>
import apiService from '@/services/api';
import Swal from 'sweetalert2';

export default {
  data: () => ({
      select_store:null,
      date_start:new Date(),
      date_end:new Date(),
      rowdata:[{
          product_name:'',
          amount:'',
          note:''
        },{
          product_name:'',
          amount:'',
          note:''
        },{
          product_name:'',
          amount:'',
          note:''
        }],
      show_p:false,
      datalist:[],
      storelist:[]
    }),
  methods: {
    show_product(){
      console.log(this.select_store)
      if(this.select_store == null){
        this.select_store = '';
      }
      if(this.select_store == ''){
        this.show_p = false
      }else{
        this.show_p = true
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
    async get_store_for_report(){
      try {
        const form = {
          id: this.group_id
        };
        const response = await apiService.get_store_for_report(form);
        this.storelist = response.data.data;
      } catch (error) {
        console.error('Error:', error);
      }
    },
  },
  mounted(){

      this.$nextTick(function(){
        this.getall();
        Swal.fire({
            title: 'อยู๋ระหว่างการพัฒนา!',
            icon: 'warning',
            confirmButtonText: 'รับทราบ'
          });
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
</style>
