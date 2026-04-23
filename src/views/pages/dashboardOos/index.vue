<script setup>

</script>

<template>
  <VCard
    title="OOS"
    subtitle=""
  >

  <VBtn color="primary" @click="dashboard_oos_test" style="float: inline-end; margin-block-start: -50px; margin-inline-end: 25px;">ดึงข้อมูล</VBtn>

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
                <VBtn color="primary" @click="dashboard_oos_test" style="inline-size: 100%;">Search</VBtn>
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
          v-for="(data, index) in logisticData"
          :key="index"
          cols="12"
          md="3"
          sm="6"
        >
          <div>
            <VCard
              class="logistics-card-statistics cursor-pointer"
              :style="data.isHover ? `border-block-end-color: rgb(var(--v-theme-${data.color}))` : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.38)`"
              @mouseenter="data.isHover = true"
              @mouseleave="data.isHover = false"
            >
              <VCardText>
                <div class="d-flex align-center gap-x-4 mb-1">
                  <VAvatar
                    variant="tonal"
                    :color="data.color"
                    rounded
                  >
                    <VIcon
                      :icon="data.icon"
                      size="28"
                    />
                  </VAvatar>
                  <h4 class="text-h4">
                    {{ data.value }}%
                  </h4>
                </div>
                <div class="text-body-1 mb-1">
                  {{ data.title }}
                </div>
              </VCardText>
            </VCard>
          </div>
        </VCol>
      </VRow>
    </VCardText>
    
    <VCardText>
      <VRow>
        <VCol
            cols="12"
            md="12"
            xl="12"
            lg="12"
          >
          <VCard>
            <VCardItem title="OOS %"></VCardItem>
            <VRow>
              <VCol
                cols="12"
                md="6"
                xl="8"
                lg="7"
              >
                <div>
                  <VueApexCharts
                    type="bar"
                    height="600"
                    :options="topicsChartConfig"
                    :series="topicsChartSeries"
                  />
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
                lg="5"
                xl="4"
              >
                <div class="topic-progress d-flex flex-wrap gap-x-6 gap-y-10 ms-auto">
                  <div
                    v-for="topic in topicsData"
                    :key="topic.title"
                    class="d-flex gap-x-2"
                  >
                    <VBadge
                      dot
                      inline
                      class="mt-1 custom-badge"
                      :color="topic.color"
                    />
                    <div>
                      <div
                        class="text-body-1"
                        style="min-inline-size: 90px;"
                      >
                        {{ topic.title }}
                      </div>
                      <h5 class="text-h5">
                        {{ topic.value }}%
                      </h5>
                    </div>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCard>
        </VCol>
        
      </VRow>
      
    </VCardText>
    
    <VCardText>
      <VRow>
        <VCol
            cols="12"
            md="6"
            xl="6"
            lg="6"
          >
          <VCard>
            <VCardItem title="Top 5 OOS"></VCardItem>
            <VCardText>
              <VList class="card-list">
                <VListItem
                  v-for="(course, index) in oos.top5_oos_products"
                  :key="index"
                >
                  <template #prepend>
                    <VAvatar
                      rounded
                      variant="tonal"
                      color="primary"
                      style="inline-size: 50px;"
                    >
                    {{ course.oos_percentage }} %
                    </VAvatar>
                  </template>

                  <VListItemTitle class="me-4">
                    <div class="d-flex flex-column">
                      <h6 class="text-h6" style="white-space: normal !important;">
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
            md="6"
            xl="6"
            lg="6"
          >
          <VCard>
            <VCardItem title="Top 5 OOS"></VCardItem>
            <VCardText>
              <VList class="card-list">
                <VListItem
                  v-for="(course, index) in oos.top5_oos_stores"
                  :key="index"
                >
                  <template #prepend>
                    <VAvatar
                      rounded
                      variant="tonal"
                      color="primary"
                      style="inline-size: 50px;"
                    >
                      {{ course.oos_percentage }}
                      <!-- <VIcon
                        icon="tabler-star v-icon notranslate v-theme--light"
                        size="24"
                      /> -->
                    </VAvatar>
                  </template>

                  <VListItemTitle class="me-4">
                    <div class="d-flex flex-column">
                      <h6 class="text-h6" style="white-space: normal !important;">
                        {{ course.account_name }} {{ course.store_name }} 
                      </h6>
                    </div>
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
      
    </VCardText>
    
  </VCard>
</template>
<script>
import apiService from '@/services/api';
import Swal from 'sweetalert2';
export default {
    data: () => ({
      userData:{},
      allFilter:{},

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
      topicsChartSeries : [{
        data: [],
      }],
      // coursesData:[
      //   {
      //     title: '1. Product   x%',
      //     icon: 'tabler-brand-zoom',
      //     color: 'primary',
      //   },
      //   {
      //     title: '1. Product   x%',
      //     icon: 'tabler-code',
      //     color: 'info',
      //   }
      // ],
      // coursesData2:[
      //   {
      //     title: '1. Store   x%',
      //     icon: 'tabler-brand-zoom',
      //     color: 'primary',
      //   },
      //   {
      //     title: '1. Store   x%',
      //     icon: 'tabler-code',
      //     color: 'info',
      //   }
      // ],
      // Topics Charts config
      topicsChartConfig:{},
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
      async dashboard_oos_test() {
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
          const response = await apiService.dashboard_oos_test(form);
          vm.oos = response.data

          vm.logisticData[0].value = response.data.total_oos_percentage || 0
          vm.logisticData[1].value = response.data.total_osa_percentage || 0
          vm.logisticData[2].value = response.data.msl_oos_percentage || 0
          vm.logisticData[3].value = response.data.msl_osa_percentage || 0
          console.log(response.data.oos_percentages);
          console.log(response.data.account_names);
          
          vm.topicsData = response.data.account_oos_data
          vm.topicsChartSeries = [{
            data: response.data.oos_percentages,
          }]

          setTimeout(() => {
            vm.topicsChartConfig = {
              chart: {
                height: '600',
                type: 'bar',
                toolbar: { show: false },
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  barHeight: '70%',
                  distributed: true,
                  borderRadius: 7,
                  borderRadiusApplication: 'end',
                },
              },
              colors: [
                'rgba(var(--v-theme-primary),1)',
                'rgba(var(--v-theme-info),1)',
                'rgba(var(--v-theme-success),1)',
                'rgba(var(--v-theme-secondary),1)',
                'rgba(var(--v-theme-error),1)',
                'rgba(var(--v-theme-warning),1)',
              ],
              grid: {
                strokeDashArray: 10,
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: false } },
                padding: {
                  top: -35,
                  bottom: -12,
                },
              },
              dataLabels: {
                enabled: true,
                style: {
                  colors: ['#fff'],
                  fontWeight: 200,
                  fontSize: '13px',
                },
                offsetX: 0,
                dropShadow: { enabled: false },
                formatter(val, opt) {
                  return vm.topicsChartConfig.labels[opt.dataPointIndex]
                },
              },
              labels: response.data.account_names,
              xaxis: {
                categories: response.data.account_names,
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: {
                  style: {
                    colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
                    fontSize: '13px',
                  },
                  formatter(val) {
                    return `${ val }%`
                  },
                },
              },
              yaxis: {
                max: 100,
                labels: {
                  style: {
                    colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
                    fontSize: '13px',
                  },
                },
              },
              tooltip: {
                enabled: true,
                style: { fontSize: '12px' },
                onDatasetHover: { highlightDataSeries: false },
              },
              legend: { show: false },
            }
          }, 200);
          console.log(vm.oos);
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
            group_customer_id: this.group_customer_id,
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
          
          // console.log(checkManager);
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
          // console.log(vm.allFilter);
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
          // vm.allFilter.stores.forEach((item, index) => {
          //   item.store_name_report = item.account_name+item.store_id+item.branch_name;
          // });
          if(!this.account_id){
            vm.provinces_id = null
            vm.get_all_filters_provinces();
          }
          // console.log(vm.allFilter);
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
    },
    mounted(){

        this.$nextTick(function(){
          const vm = this;
          const userData = useCookie('userData')
          vm.userData = userData.value;
          if(vm.userData.position_name != 'SuperAdmin'){
              vm.group_customer_id = vm.userData.group_customer_id
              // if(vm.userData.position_name != 'Admin'){
              //   vm.area_manager = vm.userData.area_manager
              //   vm.area_supervisor = vm.userData.area_supervisor
              // }
              if(vm.userData.position_name == 'พนักงาน'){
                vm.user_id = vm.userData.id
                vm.area_manager = vm.userData.area_manager
                vm.area_supervisor = vm.userData.area_supervisor
              }
              // vm.dashboard_oos_test();
            }
          vm.get_all_filters();
          setTimeout(() => {
            // if(vm.userData.position_name != 'SuperAdmin'){
            //   vm.group_customer_id = vm.userData.group_customer_id
              // if(vm.userData.position_name != 'Admin'){
              //   vm.area_manager = vm.userData.area_manager
              //   vm.area_supervisor = vm.userData.area_supervisor
              // }
            //   if(vm.userData.position_name == 'พนักงาน'){
            //     vm.user_id = vm.userData.id
              // }
              // vm.user_id = vm.userData.id

              // vm.dashboard_oos_test();
              // vm.get_all_filters_areaManagers()
            // }
          }, 200);
          
        });

        
    }
}
</script>
