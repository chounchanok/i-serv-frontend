<script setup>
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
              <!-- SECTION datatable -->
              <VDataTableServer
                v-model:items-per-page="itemsPerPage"
                v-model:page="page"
                :items="compliance_list"
                :items-length="compliance_list.length"
                :headers="headers"
                class="text-no-wrap"
                @update:options="updateOptions"
                :show-select="false"
              >
                <!-- Status -->
                <template #item.status="{ item }">
                  <AppSelect 
                      v-model="item.status" 
                      label=""
                      placeholder="" 
                      :items="status_list" 
                      style="width:130px;min-width:130px;"/>
                </template>

                <!-- position -->
                <template #item.position="{ item }">
                  <AppSelect 
                      v-model="item.position" 
                      label=""
                      placeholder="" 
                      :items="position_list" 
                      style="width:130px;min-width:130px;"/>
                </template>

                <!-- area -->
                <template #item.area="{ item }">
                  <AppSelect 
                      v-model="item.area" 
                      label=""
                      placeholder="" 
                      :items="area_list" 
                      style="width:130px;min-width:130px;"/>
                </template>

                <!-- row_type -->
                <template #item.row_type="{ item }">
                  <AppSelect 
                      v-model="item.row_type" 
                      label=""
                      placeholder="" 
                      :items="row_type_list" 
                      style="width:130px;min-width:130px;"/>
                </template>

                <!-- area -->
                <template #item.product_substitute="{ item }">
                  <AppSelect 
                      v-model="item.product_substitute" 
                      label=""
                      placeholder="" 
                      :items="product_substitute_list" 
                      style="width:130px;min-width:130px;"/>
                </template>
                
                <!-- pagination -->
                <template #bottom>
                  <TablePagination
                    v-model:page="page"
                    :items-per-page="itemsPerPage"
                    :total-items="compliance_list.length"
                  />
                </template>
              </VDataTableServer>
              <!-- SECTION -->
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
              <!-- SECTION datatable -->
              <VDataTableServer
                v-model:items-per-page="itemsPerPage"
                v-model:page="page"
                :items="compliance_list"
                :items-length="compliance_list.length"
                :headers="headers"
                class="text-no-wrap"
                @update:options="updateOptions"
                :show-select="false"
              >
                <!-- Status -->
                <template #item.status="{ item }">
                  <AppSelect 
                      v-model="item.status" 
                      label=""
                      placeholder="" 
                      :items="status_list" 
                      style="width:130px;min-width:130px;"/>
                </template>

                <!-- position -->
                <template #item.position="{ item }">
                  <AppSelect 
                      v-model="item.position" 
                      label=""
                      placeholder="" 
                      :items="position_list" 
                      style="width:130px;min-width:130px;"/>
                </template>

                <!-- area -->
                <template #item.area="{ item }">
                  <AppSelect 
                      v-model="item.area" 
                      label=""
                      placeholder="" 
                      :items="area_list" 
                      style="width:130px;min-width:130px;"/>
                </template>

                <!-- row_type -->
                <template #item.row_type="{ item }">
                  <AppSelect 
                      v-model="item.row_type" 
                      label=""
                      placeholder="" 
                      :items="row_type_list" 
                      style="width:130px;min-width:130px;"/>
                </template>

                <!-- area -->
                <template #item.product_substitute="{ item }">
                  <AppSelect 
                      v-model="item.product_substitute" 
                      label=""
                      placeholder="" 
                      :items="product_substitute_list" 
                      style="width:130px;min-width:130px;"/>
                </template>
                
                <!-- pagination -->
                <template #bottom>
                  <TablePagination
                    v-model:page="page"
                    :items-per-page="itemsPerPage"
                    :total-items="compliance_list.length"
                  />
                </template>
              </VDataTableServer>
              <!-- SECTION -->
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
