<script setup>
import { hexToRgb } from '@layouts/utils'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

// const currentTab = ref('item-1');

const area_managerlist = ref([])

const form = ref({
  area_manager: null,
})

const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'

// Topics Charts config
const topicsChartConfig = {
  chart: {
    height: 270,
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
    borderColor,
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
      return topicsChartConfig.labels[opt.dataPointIndex]
    },
  },
  labels: [
    'Account 1',
    'Account 2',
    'Account 3',
    'Account 4',
    'Account 5',
    'Account 6',
  ],
  xaxis: {
    categories: [
      '6',
      '5',
      '4',
      '3',
      '2',
      '1',
    ],
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
    max: 35,
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

const topicsChartConfigBrand = {
  chart: {
    height: 270,
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
    borderColor,
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
      return topicsChartConfigBrand.labels[opt.dataPointIndex]
    },
  },
  labels: [
    'Brand 1',
    'Brand 2',
    'Brand 3',
    'Brand 4',
    'Brand 5',
    'Brand 6',
  ],
  xaxis: {
    categories: [
      '6',
      '5',
      '4',
      '3',
      '2',
      '1',
    ],
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
    max: 35,
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

const series = [
  60,
  40,
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelSuccessColor = `rgba(${ hexToRgb(currentTheme.success) },0.2)`
  const headingColor = `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`

  const chartColors = {
    donut: {
      series1: currentTheme.success,
      series2: '#28c76fb3',
    },
  }
  
  return {
    chart: {
      parentHeightOffset: 0,
      type: 'donut',
    },
    responsive: [
      {
        breakpoint: 768, // ปรับขนาดเมื่อหน้าจอเล็กกว่า 768px
        options: {
          chart: {
            width: "100%", // ปรับ width
            height: "100%",
          },
        },
      },
    ],
    labels: [
      'ใช้ไป (%)',
      'คงเหลือ (%)',
    ],
    colors: [
      chartColors.donut.series1,
      chartColors.donut.series2,
    ],
    stroke: { width: 0 },
    dataLabels: {
      enabled: false,
      formatter(val) {
        return `${ Number.parseInt(val) }%`
      },
    },
    legend: { show: false },
    tooltip: { theme: false },
    grid: {
      padding: {
        top: 15,
        right: -20,
        left: -20,
      },
    },
    states: { hover: { filter: { type: 'none' } } },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            value: {
              fontSize: '1.375rem',
              fontFamily: 'Public Sans',
              color: headingColor,
              fontWeight: 600,
              offsetY: -15,
              formatter(val) {
                return `${ Number.parseInt(val) }%`
              },
            },
            name: {
              offsetY: 20,
              fontFamily: 'Public Sans',
            },
            total: {
              show: true,
              showAlways: true,
              color: currentTheme.success,
              fontSize: '.8125rem',
              label: 'Total',
              fontFamily: 'Public Sans',
              formatter() {
                return '184'
              },
            },
          },
        },
      },
    },
    
  }
})
</script>

<template>
  <VCard
    title="Premium & Coupon"
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
                <DemoDateTimePickerRange
                  v-model="daterange"
                  label="ช่วงวันที่"
                  placeholder="ช่วงวันที่"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
                style="display: flex;align-items: end;"
              >
                <VBtn
                  color="primary"
                  style="inline-size: 100%;"
                  @click="dashboard_premium_test"
                >
                  Search
                </VBtn>
              </VCol>
              <VCol
                cols="12"
                md="12"
                style="padding: 0;"
              />
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="group_customer_id" 
                  label="Manager (VIP1) กลุ่มลูกค้า"
                  placeholder="Select" 
                  :items="allFilter.GroupCustomers" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  :disabled="userData.position_name == 'Assistant Management' || userData.position_name == 'Supervisor' || userData.position_name == 'พนักงาน'"
                  @update:model-value="select_group_customer_id"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="area_manager" 
                  label="Area Manager (VIP2)"
                  placeholder="Select" 
                  :items="allFilter.areaManagers" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  :disabled="userData.position_name == 'Assistant Management' || userData.position_name == 'Supervisor' || userData.position_name == 'พนักงาน'"
                  @update:model-value="select_area_manager"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="area_supervisor" 
                  label="เขต Supervisor"
                  placeholder="Select" 
                  :items="allFilter.areaSupervisors" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  :disabled="userData.position_name == 'Supervisor' || userData.position_name == 'พนักงาน'"
                  @update:model-value="select_area_supervisor"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="user_id" 
                  label="พนักงาน"
                  placeholder="Select" 
                  :items="allFilter.users" 
                  item-title="users_name_report"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  :disabled="userData.position_name == 'พนักงาน'"
                  @update:model-value="select_user_id"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="channel_id" 
                  label="Channel"
                  placeholder="Select" 
                  :items="allFilter.channels" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:model-value="get_all_filters_account"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="account_id" 
                  label="Account"
                  placeholder="Select" 
                  :items="allFilter.accounts" 
                  item-title="account_name"
                  item-value="account_id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:model-value="get_all_filters_Store"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="store_id" 
                  label="Store name"
                  placeholder="Select" 
                  :items="allFilter.stores" 
                  item-title="store_name_report"
                  item-value="store_id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:model-value="get_all_filters_provinces"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
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
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="product_type" 
                  label="ประเภทรายการ"
                  placeholder="Select" 
                  :items="productTypeList" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:model-value="get_all_filters_products_premium"
                />
              </VCol>
              <!--
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
                @update:modelValue="get_all_filters_products_premium"
                />
                </VCol> 
              -->
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="product_id" 
                  label="ชื่อรายการ"
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
      <VCard>
        <VCardText>
          <VTabs
            v-model="checkcurrentTab"
            align-tabs="center"
            touch="{false}"
          >
            <VTab
              v-if="!product_type || product_type==1"
              @click="currentTab=0"
            >
              Premium
            </VTab>
            <VTab
              v-if="!product_type || product_type==2"
              @click="currentTab=1"
            >
              Sampling
            </VTab>
            <VTab
              v-if="!product_type || product_type==3"
              @click="currentTab=2"
            >
              Coupon
            </VTab>
          </VTabs>

          <VCardText style="padding-block: 5px;padding-inline: 0;">
            <VWindow v-model="checkcurrentTab">
              <VWindowItem>
                <VCardText>
                  <VRow>
                    <VCol
                      v-for="account in stockData"
                      :key="account.account_id"
                      class="account-chart"
                      cols="12"
                      md="6"
                      xl="6"
                      lg="6"
                    >
                      <h3 style="padding: 16px;text-align: center;">
                        {{ account.product_name }}
                      </h3>
                      
                      <div>
                        <VueApexCharts
                          type="donut"
                          height="300"
                          :options="getPieChartConfig(account)"
                          :series="[
                            parseFloat(account.sum_qty_out.toFixed(2)),
                            parseFloat(account.last_stock_w4.toFixed(2)),
                          ]"
                        />
                      </div>
                    </VCol>
                  </VRow>
                </VCardText>
              </VWindowItem>
              <VWindowItem>
                <VCardText>
                  <VRow>
                    <VRow>
                      <VCol
                        v-for="account in stockData2"
                        :key="account.account_id"
                        class="account-chart"
                        cols="12"
                        md="6"
                        xl="6"
                        lg="6"
                      >
                        <h3 style="padding: 16px;text-align: center;">
                          {{ account.product_name }}
                        </h3>
                      
                        <div>
                          <VueApexCharts
                            type="donut"
                            height="300"
                            :options="getPieChartConfig(account)"
                            :series="[
                              parseFloat(account.sum_qty_out.toFixed(2)),
                              parseFloat(account.last_stock_w4.toFixed(2)),
                            ]"
                          />
                        </div>
                      </VCol>
                    </VRow>
                  </VRow>
                </VCardText>
              </VWindowItem>
              <VWindowItem>
                <VCardText>
                  <VRow>
                    <VRow>
                      <VCol
                        v-for="account in stockData3"
                        :key="account.account_id"
                        class="account-chart"
                        cols="12"
                        md="6"
                        xl="6"
                        lg="6"
                      >
                        <h3 style="padding: 16px;text-align: center;">
                          {{ account.product_name }}
                        </h3>
                      
                        <div>
                          <VueApexCharts
                            type="donut"
                            height="300"
                            :options="getPieChartConfig(account)"
                            :series="[
                              parseFloat(account.sum_qty_out.toFixed(2)),
                              parseFloat(account.last_stock_w4.toFixed(2)),
                            ]"
                          />
                        </div>
                      </VCol>
                    </VRow>
                  </VRow>
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
import apiService from '@/services/api'
import Swal from 'sweetalert2'

export default {
  data: () => ({
    currentTab: 0,
    currentTab2: 0,
    currentTab3: 0,
    userData: {},
    allFilter: {},
    accountData: {},
    groupedData: {},
    group_customer_id: null,
    area_manager: null,
    area_supervisor: null,
    user_id: null,

    channel_id: null,
    account_id: null,
    store_id: null,
    provinces_id: null,
    product_type: null,
    categoryId: null,
    brand_id: null,
    sub_brand_id: null,
    product_id: null,
      
    daterange: null,

      

    form: {
      group_customer_id: null,
      channel_id: null,
      account_id: null,
      provinces_id: null,
    },

    oos: {},
    logisticData: [
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

    topicsData: [],
    topicsChartSeries: [],
      
    account_oos_data: [
      { title: 'Account 1', value: 35 },
      { title: 'Account 2', value: 20 },
      { title: 'Account 3', value: 14 },
      { title: 'Account 4', value: 12 },
      { title: 'Account 5', value: 10 },
      { title: 'Account 6', value: 9 },
    ],
    productTypeList: [
      { name: 'Premium', id: 1 },
      { name: 'Sampling', id: 2 },
      { name: 'Coupon', id: 3 },
    ],
    topicsChartConfig: {},
    stockData: [],
    stockData2: [],
    stockData3: [],
    top5_stock_products: [],
    less5_stock_products: [],
  }),
  computed: {
    checkcurrentTab() {
      return this.currentTab || 0
    },
  },
  created() {
    this.setDefaultDateRange()
  },
  mounted(){

    this.$nextTick(function(){
      const vm = this
      const userData = useCookie('userData')

      vm.userData = userData.value
      if(vm.userData.position_name != 'SuperAdmin'){
        vm.group_customer_id = vm.userData.group_customer_id
      }
      vm.get_all_filters()
      setTimeout(() => {
        if(vm.userData.position_name != 'SuperAdmin'){
          // vm.group_customer_id = vm.userData.group_customer_id
              
          if(vm.userData.position_name == 'พนักงาน'){
            vm.user_id = vm.userData.id
            vm.area_manager = vm.userData.area_manager
            vm.area_supervisor = vm.userData.area_supervisor
          }

          // vm.user_id = vm.userData.id
          // alert(vm.user_id);
          vm.dashboard_premium_test()
              
          // vm.get_all_filters_areaManagers()
        }
      }, 200)
          
    })

        
  },
  methods: {
    setDefaultDateRange() {
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      // ✅ ใช้ 'en-CA' เพื่อให้รูปแบบเป็น YYYY-MM-DD ตรงโซนเวลา
      const formatDate = date => date.toLocaleDateString('en-CA')

      this.daterange = `${formatDate(firstDayOfMonth)} to ${formatDate(today)}`
    },
    formatNumber(value) {
      if (value >= 1e9) {
        return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'G'
      } else if (value >= 1e6) {
        return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
      } else if (value >= 1e3) {
        return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
      } else {
        return value.toString()
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
      ]

      return {
        chart: { type: 'donut', height: 300, toolbar: { show: false } },
        labels: data.map(item => item.title),
        colors: donutColors.slice(0, data.length),
        series: data.map(item => item.value),
        dataLabels: {
          enabled: true,
          formatter: val => `${Math.round(val)}%`,
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
      }
    },
    getPieChartConfig(product) {
      console.log(product.product_name)

      const chartColors = {
        donut: {
          series1: '#3299e7',
          series2: '#28c76fb3',
        },
      }

      return {
        chart: {
          parentHeightOffset: 0,
          type: 'donut',
        },
        responsive: [
          {
            breakpoint: 768, // ปรับขนาดเมื่อหน้าจอเล็กกว่า 768px
            options: {
              chart: {
                width: "100%", // ปรับ width
                height: "100%",
              },
            },
          },
        ],
        labels: [
          'ใช้ไป ('+parseFloat(product.percent.toFixed(2))+'%)',
          'คงเหลือ ('+parseFloat(product.percent2.toFixed(2))+'%)',
        ],
        colors: [
          chartColors.donut.series1,
          chartColors.donut.series2,
        ],
        stroke: { width: 0 },
        dataLabels: {
          enabled: false,
          formatter(val) {
            return `${ Number.parseInt(val) }%`
          },
        },
        legend: { show: false },
        tooltip: { theme: false },
        grid: {
          padding: {
            top: 15,
            right: -20,
            left: -20,
          },
        },
        states: { hover: { filter: { type: 'none' } } },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
              labels: {
                show: true,
                value: {
                  fontSize: '1.375rem',
                  fontFamily: 'Public Sans',
                  color: '#28c76fb3',
                  fontWeight: 600,
                  offsetY: -15,
                  formatter(val) {
                    return `${ Number.parseInt(val) }%`
                  },
                },
                name: {
                  offsetY: 20,
                  fontFamily: 'Public Sans',
                },
                total: {
                  show: true,
                  showAlways: true,
                  color: '#28c76fb3',
                  fontSize: '.8125rem',
                  label: 'Total',
                  fontFamily: 'Public Sans',
                  formatter() {
                    return parseFloat(product.sum_qty_in)
                  },
                },
              },
            },
          },
        },
      }
    },
    async dashboard_premium_test() {
      const vm = this
      try {
        const form = {
          login_user_id: this.userData.id,
          user_code: this.userData.code,
          position_id: this.userData.position_id,
          position_name: this.userData.position_name,
          daterange: vm.daterange,

          group_customer_id: vm.group_customer_id,
          area_manager: vm.area_manager,
          area_supervisor: vm.area_supervisor,
          user_id: vm.user_id,

          channel_id: vm.channel_id,
          account_id: vm.account_id,
          store_id: vm.store_id,
          provinces_id: vm.provinces_id,

          categoryId: vm.categoryId,
          brand_id: vm.brand_id,
          sub_brand_id: vm.sub_brand_id,
          product_id: vm.product_id,
          promotion_id: vm.product_type,
        }

        const response = await apiService.dashboard_premium_test(form)

        console.log(response.data.status)
        if (response.data.status === "success") {
          this.stockData = response.data.data
          this.stockData2 = response.data.data2
          this.stockData3 = response.data.data3
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
        console.error('Error:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },
      

    async get_all_filters() {
      const vm = this
      try {
        const form = {
          user_code: this.userData.code,
          group_customer_id: this.group_customer_id,
          position_id: this.userData.position_id,
          channel_id: this.channel_id,
          account_id: this.account_id,
          provinces_id: this.provinces_id,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_filters_premium(form)

        vm.allFilter = response.data.data
        vm.allFilter.users.forEach((item, index) => {
          item.users_name_report = item.name+' '+item.last_name
        })
        vm.allFilter.products.forEach((item, index) => {
          item.new_name = item.name+' '+(item.flavor?'('+item.flavor+')':'')
        })
        if(this.userData.position_name == "Assistant Management"){
          var checkManager = vm.allFilter.areaManagers.filter(item => item.id == vm.userData.area_manager)
          if(checkManager.length) vm.area_manager = vm.userData.area_manager
        }
        if(this.userData.position_name == "Supervisor" || this.userData.position_name == "พนักงาน"){
          var checkManager = vm.allFilter.areaManagers.filter(item => item.id == vm.userData.area_manager)
          var checkSupervisor = vm.allFilter.areaSupervisors.filter(item => item.id == vm.userData.area_supervisor)
          if(checkManager.length) vm.area_manager = vm.userData.area_manager
          if(checkSupervisor.length) vm.area_supervisor = vm.userData.area_supervisor
        }
        console.log(vm.allFilter)
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
    async get_all_filters_areaManagers() {
      const vm = this
      try {
        const form = {
          group_customer_id: this.group_customer_id,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_filters_areaManagers(form)

        vm.allFilter.areaManagers = response.data.data
        console.log(vm.allFilter)
        vm.get_all_filters_Store()
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
    async get_all_filters_areaSupervisors() {
      const vm = this
      try {
        const form = {
          group_customer_id: vm.group_customer_id,
          area_manager_id: vm.area_manager,
          position_name: this.userData.position_name,
        }

        vm.area_supervisor = null
        vm.user_id = null

        const response = await apiService.get_all_filters_areaSupervisors(form)

        vm.allFilter.areaSupervisors = response.data.data
        console.log(vm.allFilter)
        vm.get_all_filters_users()
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
    async get_all_filters_users() {
      const vm = this
      try {
        const form = {
          group_customer_id: this.group_customer_id,
          area_manager: this.area_manager,
          area_supervisor: this.area_supervisor,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_filters_users(form)

        vm.allFilter.users = response.data.data
        vm.allFilter.users.forEach((item, index) => {
          item.users_name_report = item.name+' '+item.last_name
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
    },
    async get_all_filters_channel() {
      const vm = this
      try {
        vm.store_id = null

        const form = {
          user_id: this.userData.id,
          user_code: this.userData.code,
          group_customer_id: this.group_customer_id,
          area_manager: this.area_manager,
          area_supervisor: this.area_supervisor,
          filter_user_id: this.user_id,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_filters_channel(form)

        vm.allFilter.channels = response.data.data
        console.log(vm.allFilter)
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
    async get_all_filters_account() {
      const vm = this
      try {
        vm.store_id = null

        const form = {
          user_id: this.userData.id,
          user_code: this.userData.code,
          group_customer_id: this.group_customer_id,
          area_manager: this.area_manager,
          area_supervisor: this.area_supervisor,
          filter_user_id: this.user_id,
          channel_id: this.channel_id,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_filters_account(form)

        vm.allFilter.accounts = response.data.data
        console.log(vm.allFilter)
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
    async get_all_filters_provinces() {
      const vm = this
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
        }

        const response = await apiService.get_all_filters_provinces(form)

        vm.allFilter.provinces = response.data.data
        console.log(vm.allFilter)
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
    async get_all_filters_Store() {
      const vm = this
      try {
        vm.store_id = null

        const form = {
          user_id: this.userData.id,
          user_code: this.userData.code,
          group_customer_id: this.group_customer_id,
          area_manager: this.area_manager,
          area_supervisor: this.area_supervisor,
          filter_user_id: this.user_id,
          channel_id: this.channel_id,
          account_id: this.account_id,
          provinces_id: this.provinces_id,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_filters_Store(form)

        vm.allFilter.stores = response.data.data
        vm.allFilter.stores.forEach((item, index) => {
          // item.store_name_report = item.account_name+item.store_id+item.branch_name;
        })
        if(!this.account_id){
          vm.provinces_id = null
          vm.get_all_filters_provinces()
        }
        console.log(vm.allFilter)
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
    async get_all_filters_Brands() {
      const vm = this
      try {
        const form = {
          group_customer_id: this.group_customer_id,
          categoryId: this.categoryId,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_filters_Brands(form)

        vm.allFilter.brands = response.data.data
        vm.get_all_filters_products_premium()
        console.log(vm.allFilter)
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
    async get_all_filters_subBrands() {
      const vm = this
      try {
        const form = {
          brand_id: this.brand_id,
          position_name: this.userData.position_name,
        }

        const response = await apiService.get_all_filters_subBrands(form)

        vm.allFilter.subBrands = response.data.data
        vm.get_all_filters_products_premium()
        console.log(vm.allFilter)
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
    async get_all_filters_products_premium() {
      const vm = this
      try {
        vm.product_id = null
        if(this.product_type == 1){
          vm.currentTab = 0
        }
        if(this.product_type == 2){
          vm.currentTab = 1
        }
        if(this.product_type == 3){
          vm.currentTab = 2
        }

        const form = {
          categoryId: this.categoryId,
          brand_id: this.brand_id,
          sub_brand_id: this.sub_brand_id,
          position_name: this.userData.position_name,
          group_customer_id: this.group_customer_id,
          promotion_id: this.product_type,
        }

        const response = await apiService.get_all_filters_products_premium(form)

        vm.allFilter.products = response.data.data
        vm.allFilter.products.forEach((item, index) => {
          item.new_name = item.name+' '+(item.flavor?'('+item.flavor+')':'')
        })
        console.log(vm.allFilter)
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
    search_all() {
      const vm = this
    },
    async select_group_customer_id() {
      const vm = this

      vm.get_all_filters_areaManagers()
      vm.get_all_filters_areaSupervisors()
      vm.get_all_filters_users()
      vm.get_all_filters_channel()
      vm.get_all_filters_account()
      vm.get_all_filters_Store()
    },
    async select_area_manager() {
      const vm = this

      vm.get_all_filters_areaSupervisors()
      vm.get_all_filters_users()
      vm.get_all_filters_channel()
      vm.get_all_filters_account()
      vm.get_all_filters_Store()
    },
    async select_area_supervisor() {
      const vm = this

      vm.get_all_filters_users()
      vm.get_all_filters_channel()
      vm.get_all_filters_account()
      vm.get_all_filters_Store()
    },
    async select_user_id() {
      const vm = this

      vm.get_all_filters_channel()
      vm.get_all_filters_account()
      vm.get_all_filters_Store()
    },
  },
}
</script>
