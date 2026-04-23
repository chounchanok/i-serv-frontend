<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          12Weeks
        </h4>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn variant="tonal" color="secondary">
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
                  <AppSelect 
                    v-model="select_store" 
                    label="ร้านค้า"
                    placeholder="เลือกร้านค้า" 
                    :items="items" 
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="show_product"
                    @click:clear="show_product" />
                </VCol>

               <VCol cols="12" md="2">
                  <AppDateTimePicker v-model="date_start" label="วันที่ทำรายงาน" placeholder="เลือกวันที่" />
                </VCol>
                <VCol cols="12" md="2">
                  <AppDateTimePicker v-model="date_start" label="วันที่เริ่มของ Week 1" placeholder="เลือกวันที่" />
                </VCol>
              </VRow>
            </VCardText>

            <VDivider />


          <VCardText>

            <template v-if="show_p" v-for="(v,i) in rowdata" :key="i">
              <VRow :style="(i%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                <VCol cols="12" md="6">
                  <AppTextField v-model="v.product_name"  placeholder="" type="text" :label="(i+1)+'.สินค้า'"  />
                </VCol>
                <VCol cols="12" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.t_rank" placeholder="0" type="number" label="T Rank" />
                </VCol>
                <VCol cols="12" md="5">
                  <AppTextField v-model="v.note" placeholder="" type="text" label="หมายเหตุ" />
                </VCol>
                 
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week1" placeholder="0" type="number" label="Week1" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week2" placeholder="0" type="number" label="Week2" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week3" placeholder="0" type="number" label="Week3" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week4" placeholder="0" type="number" label="Week4" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week5" placeholder="0" type="number" label="Week5" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week6" placeholder="0" type="number" label="Week6" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week7" placeholder="0" type="number" label="Week7" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week8" placeholder="0" type="number" label="Week8" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week9" placeholder="0" type="number" label="Week9" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week10" placeholder="0" type="number" label="Week10" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week11" placeholder="0" type="number" label="Week11" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.week12" placeholder="0" type="number" label="Week12" />
                </VCol>
                <VDivider />
                
              </VRow>
            </template>
          </VCardText>
        </VCard>

      </VCol>

    </VRow>
  </div>
</template>










<script>
export default {
    data: () => ({
      select_store:'',
      date_start:new Date(),
      date_start2:new Date(),
      date_end:new Date(),
      rowdata:[{
          product_name:'',
          note:'',
          t_rank:'',
          week1:'',
          week2:'',
          week3:'',
          week4:'',
          week5:'',
          week6:'',
          week7:'',
          week8:'',
          week9:'',
          week10:'',
          week11:'',
          week12:''
        },{
          product_name:'',
          note:'',
          t_rank:'',
          week1:'',
          week2:'',
          week3:'',
          week4:'',
          week5:'',
          week6:'',
          week7:'',
          week8:'',
          week9:'',
          week10:'',
          week11:'',
          week12:''
        },{
          product_name:'',
          note:'',
          t_rank:'',
          week1:'',
          week2:'',
          week3:'',
          week4:'',
          week5:'',
          week6:'',
          week7:'',
          week8:'',
          week9:'',
          week10:'',
          week11:'',
          week12:''
        }],
      show_p:false,
      items:[
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
      ]
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
      }

    },
    mounted(){

        this.$nextTick(function(){
            
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
