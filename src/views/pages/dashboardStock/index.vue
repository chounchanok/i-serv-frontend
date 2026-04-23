<script setup>

const search = ref('')
// const currentTab = ref('item-1');
const headers = [
  {
    title: 'SKU',
    key: 'sku',
  },
  {
    title: 'Big C',
    key: 'account',
  },
  {
    title: 'Lotus',
    key: 'account',
  },
  {
    title: 'Makro',
    key: 'account',
  },
]
const area_managerlist = ref([]);
const form = ref({
  area_manager:null
});
</script>

<template>
  <VCard
    title="Stock"
    subtitle=""
  >

    <VCardText>
      <VExpansionPanels variant="accordion">
        <VExpansionPanel>
          <VExpansionPanelTitle>
            Filter
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <DemoDateTimePickerRange v-model="daterange" label="ช่วงวันที่" placeholder="ช่วงวันที่"/>
              </VCol>
              <VCol
                cols="12"
                md="2"
                style="display: flex;align-items: end;"
              >
                <VBtn color="primary" @click="dashboard_stock_test" style="inline-size: 100%;">Search</VBtn>
              </VCol>
              <VCol cols="12" md="12" style="padding: 0;"></VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="group_customer_id" 
                  label="Manager (VIP1) กลุ่มลูกค้า"
                  placeholder="Select" 
                  :items="allFilter.GroupCustomers" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="select_group_customer_id"
                  :disabled="userData.position_name == 'Assistant Management' || userData.position_name == 'Supervisor' || userData.position_name == 'พนักงาน'"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="area_manager" 
                  label="Area Manager (VIP2)"
                  placeholder="Select" 
                  :items="allFilter.areaManagers" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="select_area_manager"
                  :disabled="userData.position_name == 'Assistant Management' || userData.position_name == 'Supervisor' || userData.position_name == 'พนักงาน'"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="area_supervisor" 
                  label="เขต Supervisor"
                  placeholder="Select" 
                  :items="allFilter.areaSupervisors" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="select_area_supervisor"
                  :disabled="userData.position_name == 'Supervisor' || userData.position_name == 'พนักงาน'"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="user_id" 
                  label="พนักงาน"
                  placeholder="Select" 
                  :items="allFilter.users" 
                  item-title="users_name_report"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="select_user_id"
                  :disabled="userData.position_name == 'พนักงาน'"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="channel_id" 
                  label="Channel"
                  placeholder="Select" 
                  :items="allFilter.channels" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="get_all_filters_account"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="account_id" 
                  label="Account"
                  placeholder="Select" 
                  :items="allFilter.accounts" 
                  item-title="account_name"
                  item-value="account_id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="get_all_filters_Store"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="store_id" 
                  label="Store name"
                  placeholder="Select" 
                  :items="allFilter.stores" 
                  item-title="store_name_report"
                  item-value="store_id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="get_all_filters_provinces"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="provinces_id" 
                  label="Province"
                  placeholder="Select" 
                  :items="allFilter.provinces" 
                  item-title="name_in_thai"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="categoryId" 
                  label="Category"
                  placeholder="Select" 
                  :items="allFilter.categories" 
                  item-title="category.name"
                  item-value="category.id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="get_all_filters_Brands"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="brand_id" 
                  label="Brand"
                  placeholder="Select" 
                  :items="allFilter.brands" 
                  item-title="brand.name"
                  item-value="brand.id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="get_all_filters_subBrands"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="sub_brand_id" 
                  label="Sub Brand"
                  placeholder="Select" 
                  :items="allFilter.subBrands" 
                  item-title="subBrand.name"
                  item-value="subBrand.id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:modelValue="get_all_filters_products"
                  />
              </VCol>
              <VCol cols="12" md="3">
                <AppAutocomplete 
                  v-model="product_name" 
                  label="Product name"
                  placeholder="Select" 
                  :items="allFilter.products" 
                  item-title="new_name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  />
              </VCol>
              
            </VRow>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
      
    </VCardText>
    
    
    <VCardText>
      <VRow>
        <VCol
            cols="12"
            md="8"
            xl="8"
            lg="8"
          >
          <VCard>
            <VRow>
              <VCol
                v-for="account in stockData" :key="account.account_id" class="account-chart"
                cols="12"
                md="6"
                xl="6"
                lg="6"
              >
                <h3 style="padding: 16px;text-align: center;">{{ account.account_name }}</h3>

                <div>
                  <VueApexCharts
                    type="donut"
                    height="300"
                    :options="getPieChartConfig(account.brands)"
                    :series="account.brands.map(b => parseInt(b.total_stock))"
                  />
                  
                </div>
              </VCol>

            </VRow>
          </VCard>
        </VCol>
        <VCol
            cols="12"
            md="4"
            xl="4"
            lg="4"
          >
          <VCol
            cols="12"
            md="12"
            xl="12"
            lg="12"
            style="padding: 0;"
          >
            <VCard>
              <VCardItem title="Stock Top 5"></VCardItem>
              <VCardText>
                <VList class="card-list">
                  <VListItem
                    v-for="(course, index) in top5_stock_products"
                    :key="index"
                  >
                  <template #prepend>
                    <VAvatar
                      rounded
                      variant="tonal"
                      color="primary"
                      style="inline-size: 50px;"
                    >
                    {{ formatNumber(course.total_stock) }}
                    </VAvatar>
                  </template>

                    <VListItemTitle class="me-4">
                      <div class="d-flex flex-column">
                        <h6 class="text-h6" style="white-space: normal !important;" :title="course.product_name+' '+(course.flavor?'('+course.flavor+')':'')">
                          {{ course.product_name }} {{ (course.flavor?'('+course.flavor+')':'') }}
                        </h6>
                      </div>
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VCardText>
            </VCard>
          </VCol>
          <VCol
            cols="12"
            md="12"
            xl="12"
            lg="12"
            style="padding-block: 24px;padding-inline: 0;"
          >
            <VCard>
              <VCardItem title="Stock Less 5"></VCardItem>
              <VCardText>
                <VList class="card-list">
                  <VListItem
                    v-for="(course, index) in less5_stock_products"
                    :key="index"
                  >
                  <template #prepend>
                    <VAvatar
                      rounded
                      variant="tonal"
                      color="primary"
                      style="inline-size: 50px;"
                    >
                    {{ formatNumber(course.total_stock) }}
                    </VAvatar>
                  </template>

                    <VListItemTitle class="me-4">
                      <div class="d-flex flex-column">
                        <h6 class="text-h6" style="white-space: normal !important;" :title="course.product_name+' '+(course.flavor?'('+course.flavor+')':'')">
                          {{ course.product_name }} {{ (course.flavor?'('+course.flavor+')':'') }}
                        </h6>
                      </div>
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VCardText>
            </VCard>
          </VCol>
        </VCol>
      </VRow>
      
    </VCardText>
    

    <VCardText>
      <VCard>
        <VCardText>
          <VTabs v-model="currentTabareaManagers" align-tabs="center">
            <VTab v-for="(value,index) in areaManagersList" :key="index" @click="areaSupervisor(value.id)">{{value.name}}</VTab>
          </VTabs>
              
          <VCardText style="padding-block: 5px;padding-inline: 0;">
            
            <VWindow v-model="currentTabareaManagers">
              <VWindowItem v-for="(value,index) in areaManagersList" :key="index">

                <VTabs v-model="currentTab2areaSupervisor" align-tabs="center">
                  <VTab v-for="(value2,index2) in areaSupervisorList" :key="index2" @click="getBrands(value2.id)">{{value2.name}}</VTab>
                </VTabs>

                <VCardText style="padding-block: 5px;padding-inline: 0;">
                  
                  <VWindow v-model="currentTab2areaSupervisor">
                    <VWindowItem v-for="(value2,index2) in areaSupervisorList" :key="index2">

                      <VTabs v-model="currentTab3brand" align-tabs="center">
                        <VTab v-for="(value3,index3) in brandList" :key="index3" @click="selectBrand(value3.id)">{{value3.name}}</VTab>
                      </VTabs>

                      <VCardText style="padding-block: 5px;padding-inline: 0;">
                        <VWindow >
                          <VWindowItem >
                            <!-- <div v-fod -->
                            <VRow>
                              <VCol
                                cols="12"
                                md="4"
                              >
                                <AppTextField
                                  v-model="searchQueryx"
                                  placeholder="Search ..."
                                  append-inner-icon="tabler-search"
                                  single-line
                                  hide-details
                                  dense
                                  outlined
                                  @keyup="getTableProduct"
                                />
                              </VCol>
                            </VRow>
                            <div >
                              <div  style="display: flex;align-items: center;">
                                <div style="display: flex;align-items: center;padding: 12px;inline-size: 400px;">
                                        
                                </div>
                                
                                <div v-for="(value3xxx,index3xxx) in accountDataNew" :key="index3xxx" style="display: flex;align-items: center;padding: 12px;inline-size: 150px;">
                                  {{ value3xxx.account_name }}
                                </div>
                              </div>
                              <!-- <div v-for="(value3xxx,index3xxx) in value2" :key="index3xxx"> -->
                                <div v-for="(value4,index4) in groupedDataNew" :key="index4">
                                      <div style="display: flex;align-items: center;">
                                        <div style="display: flex;align-items: center;padding: 12px;inline-size: 400px;">
                                          {{ value4.name }} {{ (value4.flavor?'('+value4.flavor+')':'') }}
                                        </div>
                                        <div v-for="(value4x,index4x) in value4.accounts" :key="index4x" style="display: flex;align-items: center;padding: 12px;inline-size: 150px;">
                                          {{ value4x.qty }}
                                        </div>
                                      </div>
                                  </div>
                                <!-- <VRow >
                                  <VCol v-for="(value2,index2) in valuexx" :key="index2" cols="12" md="12">
                                    <div style="display: flex;align-items: center;">
                                          <div style="display: flex;align-items: center;padding: 12px;width: 400px;">
                                            
                                          </div>
                                          <div  v-for="(value3,index3) in value2.accounts" :key="index3" style="display: flex;align-items: center;padding: 12px;width: 150px;">
                                            {{ value3.account_name }}
                                          </div>
                                        </div>
                                  </VCol> 
                                </VRow>  -->
                              <!-- </div> -->
                            </div>
                            
                            
                          </VWindowItem>
                        </VWindow>
                      </VCardText>
                    </VWindowItem>
                  </VWindow>
                </VCardText>
              </VWindowItem>
            </VWindow>
          </VCardText>
          
        </VCardText>
        
      </VCard>
    </VCardText>
  </VCard>
</template>
<script>
import apiService from '@/services/api';
import Swal from 'sweetalert2';
export default {
    data: () => ({
      tab_manager:0,
      tab_supervisor:0,
      tab_brand:0,
      currentTabareaManagers:0,
      currentTab2areaSupervisor:0,
      currentTab3brand:0,
      currentTab:0,
      currentTab2:0,
      currentTab3:0,
      userData:{},
      allFilter:{},
      accountData:{},
      groupedData:{},
      accountDataNew:{},
      groupedDataNew:{},
      group_customer_id:null,
      area_manager:null,
      area_supervisor:null,
      user_id:null,

      channel_id:null,
      account_id:null,
      store_id:null,
      provinces_id:null,

      categoryId:null,
      brand_id:null,
      sub_brand_id:null,
      product_name:null,
      
      daterange:null,

      

      form:{
        group_customer_id:null,
        channel_id:null,
        account_id:null,
        provinces_id:null,
      },

      oos:{},
      logisticData : [
        {
          icon: 'tabler-truck',
          color: 'primary',
          title: 'OOS',
          value: 'x %',
          isHover: false,
        },
        {
          icon: 'tabler-alert-triangle',
          color: 'warning',
          title: 'OSA',
          value: 'x %',
          isHover: false,
        },
        {
          icon: 'tabler-git-fork',
          color: 'error',
          title: 'MSL OOS',
          value: 'x %',
          isHover: false,
        },
        {
          icon: 'tabler-clock',
          color: 'info',
          title: 'MSL OSA',
          value: 'x %',
          isHover: false,
        },
      ],

      topicsData:[],
      topicsChartSeries : [],
      
      account_oos_data: [
        { title: 'Account 1', value: 35 },
        { title: 'Account 2', value: 20 },
        { title: 'Account 3', value: 14 },
        { title: 'Account 4', value: 12 },
        { title: 'Account 5', value: 10 },
        { title: 'Account 6', value: 9 },
      ],

      topicsChartConfig:{},
      stockData: [],
      top5_stock_products: [],
      less5_stock_products: [],
      searchQuery:null,
      searchQueryx:null,
      datalist:[],

      areaManagersList:[],
      areaSupervisorList:[],
      brandList:[],
    }),
    created() {
      this.setDefaultDateRange();
    },
    methods: {
      setDefaultDateRange() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // ✅ ใช้ 'en-CA' เพื่อให้รูปแบบเป็น YYYY-MM-DD ตรงโซนเวลา
        const formatDate = date => date.toLocaleDateString('en-CA');

        this.daterange = `${formatDate(firstDayOfMonth)} to ${formatDate(today)}`;
      },
      formatNumber(value) {
        if (value >= 1e9) {
          return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'G';
        } else if (value >= 1e6) {
          return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (value >= 1e3) {
          return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
        } else {
          return value.toString();
        }
      },
      getDonutChartConfig(data) {
        const donutColors = [
          '#fdd835', // Yellow
          '#00d4bd', // Cyan
          '#826bf8', // Purple
          '#32baff', // Blue
          '#ffa1a1', // Red
          '#ff8c00', // Orange
        ];

        return {
          chart: { type: 'donut', height: 300, toolbar: { show: false } },
          labels: data.map(item => item.title),
          colors: donutColors.slice(0, data.length),
          series: data.map(item => item.value),
          dataLabels: {
            enabled: true,
            formatter: val => `${Number.parseInt(val, 10)}%`,
          },
          legend: {
            position: 'bottom',
            markers: { offsetX: -3 },
            fontSize: '13px',
            labels: { colors: '#ffb400' },
            itemMargin: { vertical: 3, horizontal: 10 },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: { fontSize: '1.125rem' },
                  value: {
                    fontSize: '1.125rem',
                    color: '#ffb400',
                    formatter: val => `${Math.round(val)}%`,
                  },
                  total: {
                    show: true,
                    fontSize: '1.125rem',
                    label: 'Total Stock',
                    formatter: () => `${data.reduce((sum, item) => sum + item.value, 0)}%`,
                    color: '#ffb400',
                  },
                },
              },
            },
          },
          responsive: [
            {
              breakpoint: 992,
              options: { chart: { height: 380 }, legend: { position: 'bottom' } },
            },
            {
              breakpoint: 576,
              options: {
                chart: { height: 320 },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                        name: { fontSize: '0.9375rem' },
                        value: { fontSize: '0.9375rem' },
                        total: { fontSize: '0.9375rem' },
                      },
                    },
                  },
                },
              },
            },
          ],
        };
      },
      getPieChartConfig(brands) {
        console.log(brands)
        return {
          chart: { type: "donut", height: 250 },
          labels: brands.map(b => b.brand_name),
          series: brands.map(b => b.value),
          colors: ["#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#f4c542",'#fdd835','#00d4bd', '#826bf8','#32baff','#ffa1a1','#ff8c00'],
          legend: { position: 'bottom',
            markers: { offsetX: -3 },
            fontSize: '13px',
            labels: { colors: '#ffb400' },
            itemMargin: { vertical: 3, horizontal: 10 }, },
          dataLabels: {
            enabled: true,
            formatter: val => `${Math.round(val)}%`
          },
          responsive: [
            {
              breakpoint: 992,
              options: { chart: { height: 380 }, legend: { position: 'bottom' } },
            },
            {
              breakpoint: 576,
              options: {
                chart: { height: 320 },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                        name: { fontSize: '0.9375rem' },
                        value: { fontSize: '0.9375rem' },
                        total: { fontSize: '0.9375rem' },
                      },
                    },
                  },
                },
              },
            },
          ],
        };
      },
      async dashboard_stock_test() {
        const vm = this;
        try {
          const form = {
            user_code: this.userData.code,
            position_id: this.userData.position_id,

            daterange:vm.daterange,

            group_customer_id:vm.group_customer_id,
            area_manager:vm.area_manager,
            area_supervisor:vm.area_supervisor,
            user_id:vm.user_id,

            channel_id:vm.channel_id,
            account_id:vm.account_id,
            store_id:vm.store_id,
            provinces_id:vm.provinces_id,

            categoryId:vm.categoryId,
            brand_id:vm.brand_id,
            sub_brand_id:vm.sub_brand_id,
            product_name:vm.product_name,
          };
          const response = await apiService.dashboard_stock_test(form);
          console.log(response.data.status);
          if (response.data.status === "success") {
            this.stockData = response.data.data;
            this.top5_stock_products = response.data.top5_stock_products;
            this.less5_stock_products = response.data.less5_stock_products;
            vm.getTableProduct();
            vm.areaManagers();
          }

          // vm.logisticData[0].value = response.data.total_oos_percentage || 0
          // vm.logisticData[1].value = response.data.total_osa_percentage || 0
          // vm.logisticData[2].value = response.data.msl_oos_percentage || 0
          // vm.logisticData[3].value = response.data.msl_osa_percentage || 0
          // console.log(response.data.oos_percentages);
          // console.log(response.data.account_names);
          
          // vm.topicsData = response.data.account_oos_data
          // vm.topicsChartSeries = response.data.oos_percentages
          // this.topicsChartConfig = this.getDonutChartConfig(response.data.account_oos_data); // ✅ อัปเดตกำหนดค่ากราฟ
          // console.log(this.topicsChartConfig);
          
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
      async dashboard_stock_table() {
        const vm = this;
        try {
          const form = {
            user_code: this.userData.code,
            position_id: this.userData.position_id,

            daterange:vm.daterange,

            group_customer_id:vm.group_customer_id,
            area_manager:vm.area_manager,
            area_supervisor:vm.area_supervisor,
            user_id:vm.user_id,

            channel_id:vm.channel_id,
            account_id:vm.account_id,
            store_id:vm.store_id,
            provinces_id:vm.provinces_id,

            categoryId:vm.categoryId,
            brand_id:vm.brand_id,
            sub_brand_id:vm.sub_brand_id,
            product_name:vm.product_name,

            position_name: this.userData.position_name,
          };
          const response = await apiService.dashboard_stock_table(form);
          if (response.data.status === "success") {
            this.groupedData = response.data.groupedData;
            //this.accountData = response.data.uniqueAccountsList;
          }
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

      async get_all_filters() {
        const vm = this;
        try {
          const form = {
            user_code: this.userData.code,
            group_customer_id: vm.group_customer_id,
            position_id: this.userData.position_id,
            channel_id: this.channel_id,
            account_id: this.account_id,
            provinces_id: this.provinces_id,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters(form);
          vm.allFilter = response.data.data
          vm.allFilter.users.forEach((item, index) => {
            item.users_name_report = item.name+' '+item.last_name;
          });
          vm.allFilter.products.forEach((item, index) => {
            item.new_name = item.name+' '+(item.flavor?'('+item.flavor+')':'');
          });
          if(this.userData.position_name == "Assistant Management"){
            var checkManager = vm.allFilter.areaManagers.filter(item => item.id == vm.userData.area_manager);
            if(checkManager.length) vm.area_manager = vm.userData.area_manager;
          }
          if(this.userData.position_name == "Supervisor" || this.userData.position_name == "พนักงาน"){
            var checkManager = vm.allFilter.areaManagers.filter(item => item.id == vm.userData.area_manager);
            var checkSupervisor = vm.allFilter.areaSupervisors.filter(item => item.id == vm.userData.area_supervisor);
            if(checkManager.length) vm.area_manager = vm.userData.area_manager;
            if(checkSupervisor.length) vm.area_supervisor = vm.userData.area_supervisor;
          }
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
      async get_all_filters_areaManagers() {
        const vm = this;
        try {
          const form = {
            group_customer_id: this.group_customer_id,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters_areaManagers(form);
          vm.allFilter.areaManagers = response.data.data
          console.log(vm.allFilter);
          vm.get_all_filters_Store()
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
      async get_all_filters_areaSupervisors() {
        const vm = this;
        try {
          const form = {
            group_customer_id: vm.group_customer_id,
            area_manager_id: vm.area_manager,
            position_name: this.userData.position_name,
          };
          vm.area_supervisor = null
          vm.user_id = null
          const response = await apiService.get_all_filters_areaSupervisors(form);
          vm.allFilter.areaSupervisors = response.data.data
          console.log(vm.allFilter);
          vm.get_all_filters_users()
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
      async get_all_filters_users() {
        const vm = this;
        try {
          const form = {
            group_customer_id: this.group_customer_id,
            area_manager: this.area_manager,
            area_supervisor: this.area_supervisor,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters_users(form);
          vm.allFilter.users = response.data.data
          vm.allFilter.users.forEach((item, index) => {
            item.users_name_report = item.name+' '+item.last_name;
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
      async get_all_filters_channel() {
        const vm = this;
        try {
          vm.store_id = null
          const form = {
            user_id: this.userData.id,
            user_code: this.userData.code,
            group_customer_id: this.group_customer_id,
            area_manager: this.area_manager,
            area_supervisor: this.area_supervisor,
            filter_user_id:this.user_id,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters_channel(form);
          vm.allFilter.channels = response.data.data
          console.log(vm.allFilter);
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
      async get_all_filters_account() {
        const vm = this;
        try {
          vm.store_id = null
          const form = {
            user_id: this.userData.id,
            user_code: this.userData.code,
            group_customer_id: this.group_customer_id,
            area_manager: this.area_manager,
            area_supervisor: this.area_supervisor,
            filter_user_id:this.user_id,
            channel_id: this.channel_id,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters_account(form);
          vm.allFilter.accounts = response.data.data
          console.log(vm.allFilter);
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
      async get_all_filters_provinces() {
        const vm = this;
        try {
          vm.provinces_id = null
          const form = {
            user_id: this.userData.id,
            user_code: this.userData.code,
            group_customer_id: this.group_customer_id,
            channel_id: this.channel_id,
            account_id: this.account_id,
            store_id: this.store_id,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters_provinces(form);
          vm.allFilter.provinces = response.data.data
          console.log(vm.allFilter);
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
      async get_all_filters_Store() {
        const vm = this;
        try {
          vm.store_id = null
          const form = {
            user_id: this.userData.id,
            user_code: this.userData.code,
            group_customer_id: this.group_customer_id,
            area_manager: this.area_manager,
            area_supervisor: this.area_supervisor,
            filter_user_id:this.user_id,
            channel_id: this.channel_id,
            account_id: this.account_id,
            provinces_id: this.provinces_id,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters_Store(form);
          vm.allFilter.stores = response.data.data
          vm.allFilter.stores.forEach((item, index) => {
            // item.store_name_report = item.account_name+item.store_id+item.branch_name;
          });
          if(!this.account_id){
            vm.provinces_id = null
            vm.get_all_filters_provinces();
          }
          console.log(vm.allFilter);
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
      async get_all_filters_Brands() {
        const vm = this;
        try {
          const form = {
            group_customer_id: this.group_customer_id,
            categoryId: this.categoryId,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters_Brands(form);
          vm.allFilter.brands = response.data.data
          vm.get_all_filters_products();
          console.log(vm.allFilter);
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
      async get_all_filters_subBrands() {
        const vm = this;
        try {
          const form = {
            brand_id: this.brand_id,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_all_filters_subBrands(form);
          vm.allFilter.subBrands = response.data.data
          vm.get_all_filters_products();
          console.log(vm.allFilter);
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
      async get_all_filters_products() {
        const vm = this;
        try {
          const form = {
            categoryId: this.categoryId,
            brand_id: this.brand_id,
            sub_brand_id: this.sub_brand_id,
            position_name: this.userData.position_name,
            group_customer_id: this.group_customer_id,
          };
          const response = await apiService.get_all_filters_products(form);
          vm.allFilter.products = response.data.data
          vm.allFilter.products.forEach((item, index) => {
            item.new_name = item.name+' '+(item.flavor?'('+item.flavor+')':'');
          });
          console.log(vm.allFilter);
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
      search_all() {
        const vm = this;
      },
      async select_group_customer_id() {
        const vm = this;
        vm.get_all_filters_areaManagers()
        vm.get_all_filters_areaSupervisors()
        vm.get_all_filters_users()
        vm.get_all_filters_channel()
        vm.get_all_filters_account()
        vm.get_all_filters_Store()
      },
      async select_area_manager() {
        const vm = this;
        vm.get_all_filters_areaSupervisors()
        vm.get_all_filters_users()
        vm.get_all_filters_channel()
        vm.get_all_filters_account()
        vm.get_all_filters_Store()
      },
      async select_area_supervisor() {
        const vm = this;
        vm.get_all_filters_users()
        vm.get_all_filters_channel()
        vm.get_all_filters_account()
        vm.get_all_filters_Store()
      },
      async select_user_id() {
        const vm = this;
        vm.get_all_filters_channel()
        vm.get_all_filters_account()
        vm.get_all_filters_Store()
      },
      async areaManagers() {
        const vm = this;
        try {
          const form = {
            user_code: this.userData.code,
            position_id: this.userData.position_id,
            position_name: this.userData.position_name,
            daterange:vm.daterange,

            group_customer_id:vm.group_customer_id,
            area_manager:vm.area_manager,
            area_supervisor:vm.area_supervisor,
            user_id:vm.user_id,

            channel_id:vm.channel_id,
            account_id:vm.account_id,
            store_id:vm.store_id,
            provinces_id:vm.provinces_id,

            categoryId:vm.categoryId,
            brand_id:vm.brand_id,
            sub_brand_id:vm.sub_brand_id,
            product_name:vm.product_name,
          };
          const response = await apiService.areaManagers(form);
          vm.areaManagersList = response.data.areaManagers
          if(vm.areaManagersList && vm.areaManagersList.length > 0){
            console.log(vm.areaManagersList);
            vm.currentTabareaManagers = 0;
            vm.areaSupervisor(vm.areaManagersList[0].id)
          }else{
            this.groupedDataNew = [];
            this.accountDataNew = [];
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async areaSupervisor(id) {
        const vm = this;
        try {
          vm.tab_manager = id
          const form = {
            area_manager_id:id,
            user_code: this.userData.code,
            position_id: this.userData.position_id,
            position_name: this.userData.position_name,
            daterange:vm.daterange,

            group_customer_id:vm.group_customer_id,
            area_manager:vm.area_manager,
            area_supervisor:vm.area_supervisor,
            user_id:vm.user_id,

            channel_id:vm.channel_id,
            account_id:vm.account_id,
            store_id:vm.store_id,
            provinces_id:vm.provinces_id,

            categoryId:vm.categoryId,
            brand_id:vm.brand_id,
            sub_brand_id:vm.sub_brand_id,
            product_name:vm.product_name,
          };
          const response = await apiService.areaSupervisor(form);
          vm.areaSupervisorList = response.data.areaSupervisor
          if(vm.areaSupervisorList && vm.areaSupervisorList.length > 0){
            console.log(vm.areaSupervisorList);
            vm.currentTab2areaSupervisor = 0;
            vm.getBrands(vm.areaSupervisorList[0].id)
          }else{
            this.groupedDataNew = [];
            this.accountDataNew = [];
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async getBrands(id) {
        const vm = this;
        try {
          vm.tab_supervisor = id
          vm.currentTab3brand = 0
          const form = {
            area_manager_id:vm.tab_manager,
            area_supervisor_id:id,
            user_code: this.userData.code,
            position_id: this.userData.position_id,

            daterange:vm.daterange,

            group_customer_id:vm.group_customer_id,
            area_manager:vm.area_manager,
            area_supervisor:vm.area_supervisor,
            user_id:vm.user_id,

            channel_id:vm.channel_id,
            account_id:vm.account_id,
            store_id:vm.store_id,
            provinces_id:vm.provinces_id,

            categoryId:vm.categoryId,
            brand_id:vm.brand_id,
            sub_brand_id:vm.sub_brand_id,
            product_name:vm.product_name,
          };
          const response = await apiService.getBrands(form);
          vm.brandList = response.data.brand
          if(vm.brandList && vm.brandList.length > 0){
            vm.selectBrand(vm.brandList[0].id)
          }else{
            this.groupedDataNew = [];
            this.accountDataNew = [];
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
      async selectBrand(id) {
        this.tab_brand = id
        this.getTableProduct()
      },
      async getTableProduct() {
        const vm = this;
        try {
          const form = {
            product_name:vm.searchQueryx,
            area_manager_id:vm.tab_manager,
            area_supervisor_id:vm.tab_supervisor,
            brand_id:vm.tab_brand,
            user_code: this.userData.code,
            position_id: this.userData.position_id,

            daterange:vm.daterange,

            group_customer_id:vm.group_customer_id,
            area_manager:vm.area_manager,
            area_supervisor:vm.area_supervisor,
            user_id:vm.user_id,

            channel_id:vm.channel_id,
            account_id:vm.account_id,
            store_id:vm.store_id,
            provinces_id:vm.provinces_id,

            categoryId:vm.categoryId,
            sub_brand_id:vm.sub_brand_id,
          };
          const response = await apiService.getTableProduct(form);
          if (response.data.status === "success") {
            this.groupedDataNew = response.data.data;
            this.accountDataNew = response.data.uniqueAccountsList;
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
    },
    computed: {
      // ✅ ฟังก์ชันกรองข้อมูลสินค้า
      filteredGroupedData() {
        if (!this.searchQuery) return this.groupedData

        const searchTerm = this.searchQuery.toLowerCase()

        const filterProducts = (value4) => {
          const productName = value4.mapProductStoreList.product.name.toLowerCase()
          const productFlavor = value4.mapProductStoreList.product.flavor
            ? value4.mapProductStoreList.product.flavor.toLowerCase()
            : ''

          return productName.includes(searchTerm) || productFlavor.includes(searchTerm)
        }

        return Object.fromEntries(
          Object.entries(this.groupedData).map(([key, value]) => [
            key,
            Object.fromEntries(
              Object.entries(value).map(([key2, value2]) => [
                key2,
                Object.fromEntries(
                  Object.entries(value2).map(([key3, value3]) => [
                    key3,
                    value3.filter(filterProducts) // ✅ กรองสินค้าในแต่ละ `brandName`
                  ])
                )
              ])
            )
          ])
        )
      }
    },
    mounted(){

        this.$nextTick(function(){
          const vm = this;
          const userData = useCookie('userData')
          vm.userData = userData.value;
          if(vm.userData.position_name != 'SuperAdmin'){
            vm.group_customer_id = vm.userData.group_customer_id
          }
          vm.get_all_filters();
          setTimeout(() => {
            if(vm.userData.position_name != 'SuperAdmin'){
              // vm.group_customer_id = vm.userData.group_customer_id
              
              if(vm.userData.position_name == 'พนักงาน'){
                vm.user_id = vm.userData.id
                vm.area_manager = vm.userData.area_manager
                vm.area_supervisor = vm.userData.area_supervisor
              }
              // alert(vm.user_id);
              vm.dashboard_stock_test();
              
              // vm.dashboard_stock_table()
              // vm.get_all_filters_areaManagers()
            }
          }, 200);
          
        });

        
    }
}
</script>
