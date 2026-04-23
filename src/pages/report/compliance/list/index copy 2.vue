<script setup>
import noimg from '@images/noimg.png';
// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const headers = [
  {
    title: 'สินค้า',
    key: 'product_name',
  },
  {
    title: 'สถานะพื้นที่',
    key: 'status',
  },
  {
    title: 'ตำแหน่ง',
    key: 'position',
  },
  {
    title: 'พื้นที่',
    key: 'area',
  },
  {
    title: 'จำนวน',
    key: 'qty',
  },
  {
    title: 'ประเภท',
    key: 'row_type',
  },
  {
    title: 'สินค้าทดแทน',
    key: 'product_substitute',
  },
  {
    title: 'สื่อส่งเสริมการขาย',
    key: 'point_of_sale',
  },
  {
    title: 'ภาพ',
    key: 'picture',
  },
  {
    title: 'หมายเหตุ',
    key: 'note',
  }
]

</script>

<template>
  <section>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Compliance
        </h4>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn>บันทึก</VBtn>
      </div>
    </div>

    <VCard>
      <VTabs v-model="currentTab">
        <VTab>Compliance</VTab>
        <VTab>Extra</VTab>
      </VTabs>

      <VCardText>
        <VWindow v-model="currentTab">
          <VWindowItem>
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
                    <AppDateTimePicker v-model="date_start" label="วันที่" placeholder="วันที่" />
                  </VCol>

                  
                </VRow>
              </VCardText>
              <VDivider />
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
                    :items="status"
                    clearable
                    clear-icon="tabler-x"
                  />
                </VCol>
              </VRow>
            </VCard>
          </VWindowItem>

          <VWindowItem>
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
                      clear-icon="tabler-x"/>
                  </VCol>

                    <VCol cols="12" md="2">
                    <AppDateTimePicker v-model="date_start" label="วันที่" placeholder="วันที่" />
                  </VCol>

                  
                </VRow>
              </VCardText>
              <VDivider />
              
              <VRow>
                <VCol cols="12" md="12">
                  <VRow>
                    <VCol cols="12" md="1" class="d-flex align-self-end text-center" style="justify-content: center;">
                      <div class="img-width">
                          <img :src="noimg" class="card-img-top" style="width: 50px;height: 50px;"/>
                      </div>
                    </VCol>
                    <VCol cols="12" md="5" style="display: flex;align-items: center;">
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
                        :items="status"
                        clearable
                        clear-icon="tabler-x"
                      />
                    </VCol>
                  </VRow>
                </VCol> 
              </VRow> 
            </VCard>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
    
    
  </section>
</template>


<script>
export default {
    data: () => ({
      currentTab:'item-1',
      breadcrumbs:[],
      compliance_list:[{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ไม่ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้ทดแทน",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      },{
          "product_name": "Product 1",
          "status": "ได้",
          "position": "ทางเดินหน้าแคชเชียร์",
          "area": "4 way",
          "qty": "1",
          "row_type": "4 way",
          "product_substitute": "Product 6",
          "point_of_sale": "Standee",
          "picture": "",
          "note": "test"
      }],
      status_list:[
        {
          title: 'ได้',
          value: 'ได้',
        },
        {
          title: 'ไม่ได้',
          value: 'ไม่ได้',
        },
        {
          title: 'ได้ทดแทน',
          value: 'ได้ทดแทน',
        }
      ],
      position_list:[
        {
          title: 'ทางเดินหน้าแคชเชียร์',
          value: 'ทางเดินหน้าแคชเชียร์',
        }
      ],
      area_list:[
        {
          title: '4 way',
          value: '4 way',
        }
      ],
      row_type_list:[
        {
          title: '4 way',
          value: '4 way',
        }
      ],
      product_substitute_list:[
        {
          title: 'Product 6',
          value: 'Product 6',
        }
      ],
      select_store:'',
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
