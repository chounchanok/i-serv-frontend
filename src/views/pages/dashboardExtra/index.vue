<script setup>
const series = [85]

const getStatusColor = id => {
  switch (id) {
  case 0: return 'primary' // ได้
  case 1: return 'warning' // ไม่ได้
  case 2: return 'info'    // ได้ทดแทน
  default: return 'grey'
  }
}

const getStatusIcon = id => {
  switch (id) {
  case 0: return 'tabler-ticket' // ได้
  case 1: return 'tabler-clock'  // ไม่ได้
  case 2: return 'tabler-check'  // ได้ทดแทน
  default: return 'tabler-alert-circle'
  }
}

// const currentTab = ref(0)
const refVueApexChart = ref()

const datalist = []
const area_managerlist = []

const form = {
  area_manager: null,
}

const logisticData = [
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
]

const topicsData = [
  {
    title: 'Account 1',
    value: 35,
    color: 'primary',
  },
  {
    title: 'Account 2',
    value: 20,
    color: 'info',
  },
  {
    title: 'Account 3',
    value: 14,
    color: 'success',
  },
  {
    title: 'Account 4',
    value: 12,
    color: 'secondary',
  },
  {
    title: 'Account 5',
    value: 10,
    color: 'error',
  },
  {
    title: 'Account 6',
    value: 9,
    color: 'warning',
  },
]

const coursesData = [
  {
    title: 'กองโชว์',
    text: '120 Tasks',
    icon: 'tabler-brand-zoom',
    color: 'primary',
  },
  {
    title: 'หัวชั้น',
    text: '120 Tasks',
    icon: 'tabler-brand-zoom',
    color: 'primary',
  },
]

const coursesData2 = [
  {
    title: '1. Store   x%',
    icon: 'tabler-brand-zoom',
    color: 'primary',
  },
  {
    title: '1. Store   x%',
    icon: 'tabler-code',
    color: 'info',
  },
]

const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'

// Topics Charts config
const topicsChartSeries = [
  {
    data: [300, 200, 100, 50, 40, 30], // ข้อมูลสำหรับ "ได้"
  },
]

const assignmentData = [
  {
    title: 'กองโชว์',
    tasks: 120,
    progress: 72,
    color: 'primary',
  },
  {
    title: 'หัวชั้น',
    tasks: 32,
    progress: 48,
    color: 'success',
  },
  {
    title: 'Stand',
    tasks: 182,
    progress: 15,
    color: 'error',
  },
  {
    title: '4way',
    tasks: 56,
    progress: 24,
    color: 'info',
  },
  {
    title: 'สายแขวน',
    tasks: 56,
    progress: 24,
    color: 'info',
  },
  {
    title: 'อื่นๆ',
    tasks: 56,
    progress: 24,
    color: 'info',
  },
]

const supportTicket = [
  {
    avatarColor: 'primary',
    avatarIcon: 'tabler-ticket',
    title: 'ได้',
    subtitle: '142',
  },
  {
    avatarColor: 'info',
    avatarIcon: 'tabler-check',
    title: 'ได้ทดแทน',
    subtitle: '28',
  },
  {
    avatarColor: 'warning',
    avatarIcon: 'tabler-clock',
    title: 'ไม่ได้',
    subtitle: '1 Day',
  },
]

const moreList = [
  {
    title: 'View More',
    value: 'View More',
  },
]

// const chartOptions = computed(() => {
//   const currentTheme = vuetifyTheme.current.value.colors
//   const variableTheme = vuetifyTheme.current.value.variables
  
//   return {
//     labels: ['Completed Task'],
//     chart: { type: 'radialBar' },
//     plotOptions: {
//       radialBar: {
//         offsetY: 10,
//         startAngle: -140,
//         endAngle: 130,
//         hollow: { size: '65%' },
//         track: {
//           background: currentTheme.surface,
//           strokeWidth: '100%',
//         },
//         dataLabels: {
//           name: {
//             offsetY: -20,
//             color: `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`,
//             fontSize: '13px',
//             fontWeight: '400',
//             fontFamily: 'Public Sans',
//           },
//           value: {
//             offsetY: 10,
//             color: `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`,
//             fontSize: '38px',
//             fontWeight: '500',
//             fontFamily: 'Public Sans',
//           },
//         },
//       },
//     },
//     colors: [currentTheme.primary],
//     fill: {
//       type: 'gradient',
//       gradient: {
//         shade: 'dark',
//         shadeIntensity: 0.5,
//         gradientToColors: [currentTheme.primary],
//         inverseColors: true,
//         opacityFrom: 1,
//         opacityTo: 0.6,
//         stops: [
//           30,
//           70,
//           100,
//         ],
//       },
//     },
//     stroke: { dashArray: 10 },
//     grid: {
//       padding: {
//         top: -20,
//         bottom: 5,
//       },
//     },
//     states: {
//       hover: { filter: { type: 'none' } },
//       active: { filter: { type: 'none' } },
//     },
//     responsive: [{
//       breakpoint: 960,
//       options: { chart: { height: 280 } },
//     }],
//   }
// })
// const chartConfigs = computed(() => {
//   const currentTheme = vuetifyTheme.current.value.colors
//   const variableTheme = vuetifyTheme.current.value.variables
//   const labelPrimaryColor = `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`
//   const legendColor = `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`
//   const borderColor = `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`
//   const labelColor = `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`
  
//   return [
//     {
//       title: 'กองโชว์',
//       icon: 'tabler-chart-bar',
//       chartOptions: {
//         chart: {
//           parentHeightOffset: 0,
//           type: 'bar',
//           toolbar: { show: false },
//         },
//         plotOptions: {
//           bar: {
//             columnWidth: '32%',
//             borderRadiusApplication: 'end',
//             borderRadius: 4,
//             distributed: true,
//             dataLabels: { position: 'top' },
//           },
//         },
//         grid: {
//           show: false,
//           padding: {
//             top: 0,
//             bottom: 0,
//             left: -10,
//             right: -10,
//           },
//         },
//         colors: [
//           labelPrimaryColor,
//           labelPrimaryColor,
//           `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//         ],
//         dataLabels: {
//           enabled: true,
//           formatter(val) {
//             return `${ val }k`
//           },
//           offsetY: -25,
//           style: {
//             fontSize: '15px',
//             colors: [legendColor],
//             fontWeight: '600',
//             fontFamily: 'Public Sans',
//           },
//         },
//         legend: { show: false },
//         tooltip: { enabled: false },
//         xaxis: {
//           categories: [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//           ],
//           axisBorder: {
//             show: true,
//             color: borderColor,
//           },
//           axisTicks: { show: false },
//           labels: {
//             style: {
//               colors: labelColor,
//               fontSize: '13px',
//               fontFamily: 'Public Sans',
//             },
//           },
//         },
//         yaxis: {
//           labels: {
//             offsetX: -15,
//             formatter(val) {
//               return `${ val / 1 }k`
//             },
//             style: {
//               fontSize: '13px',
//               colors: labelColor,
//               fontFamily: 'Public Sans',
//             },
//             min: 0,
//             max: 60000,
//             tickAmount: 6,
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 1441,
//             options: { plotOptions: { bar: { columnWidth: '41%' } } },
//           },
//           {
//             breakpoint: 590,
//             options: {
//               plotOptions: { bar: { columnWidth: '40%' } },
//               yaxis: { labels: { show: false } },
//               dataLabels: {
//                 style: {
//                   fontSize: '12px',
//                   fontWeight: '400',
//                 },
//               },
//             },
//           },
//         ],
//       },
//       series: [{
//         data: [
//           28,
//           10,
//           45,
//           38,
//           15,
//           30,
//           35,
//           30,
//           8,
//         ],
//       }],
//     },
//     {
//       title: 'หัวชั้น',
//       icon: 'tabler-chart-bar',
//       chartOptions: {
//         chart: {
//           parentHeightOffset: 0,
//           type: 'bar',
//           toolbar: { show: false },
//         },
//         plotOptions: {
//           bar: {
//             columnWidth: '32%',
//             borderRadiusApplication: 'end',
//             borderRadius: 4,
//             distributed: true,
//             dataLabels: { position: 'top' },
//           },
//         },
//         grid: {
//           show: false,
//           padding: {
//             top: 0,
//             bottom: 0,
//             left: -10,
//             right: -10,
//           },
//         },
//         colors: [
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
//           labelPrimaryColor,
//           labelPrimaryColor,
//         ],
//         dataLabels: {
//           enabled: true,
//           formatter(val) {
//             return `${ val }k`
//           },
//           offsetY: -25,
//           style: {
//             fontSize: '15px',
//             colors: [legendColor],
//             fontWeight: '600',
//             fontFamily: 'Public Sans',
//           },
//         },
//         legend: { show: false },
//         tooltip: { enabled: false },
//         xaxis: {
//           categories: [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//           ],
//           axisBorder: {
//             show: true,
//             color: borderColor,
//           },
//           axisTicks: { show: false },
//           labels: {
//             style: {
//               colors: labelColor,
//               fontSize: '13px',
//               fontFamily: 'Public Sans',
//             },
//           },
//         },
//         yaxis: {
//           labels: {
//             offsetX: -15,
//             formatter(val) {
//               return `${ val / 1 }k`
//             },
//             style: {
//               fontSize: '13px',
//               colors: labelColor,
//               fontFamily: 'Public Sans',
//             },
//             min: 0,
//             max: 60000,
//             tickAmount: 6,
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 1441,
//             options: { plotOptions: { bar: { columnWidth: '41%' } } },
//           },
//           {
//             breakpoint: 590,
//             options: {
//               plotOptions: { bar: { columnWidth: '61%' } },
//               grid: { padding: { right: 0 } },
//               dataLabels: {
//                 style: {
//                   fontSize: '12px',
//                   fontWeight: '400',
//                 },
//               },
//               yaxis: { labels: { show: false } },
//             },
//           },
//         ],
//       },
//       series: [{
//         data: [
//           35,
//           25,
//           15,
//           40,
//           42,
//           25,
//           48,
//           8,
//           30,
//         ],
//       }],
//     },
//     {
//       title: 'stand',
//       icon: 'tabler-chart-bar',
//       chartOptions: {
//         chart: {
//           parentHeightOffset: 0,
//           type: 'bar',
//           toolbar: { show: false },
//         },
//         plotOptions: {
//           bar: {
//             columnWidth: '32%',
//             borderRadiusApplication: 'end',
//             borderRadius: 4,
//             distributed: true,
//             dataLabels: { position: 'top' },
//           },
//         },
//         grid: {
//           show: false,
//           padding: {
//             top: 0,
//             bottom: 0,
//             left: -10,
//             right: -10,
//           },
//         },
//         colors: [
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//         ],
//         dataLabels: {
//           enabled: true,
//           formatter(val) {
//             return `${ val }k`
//           },
//           offsetY: -25,
//           style: {
//             fontSize: '15px',
//             colors: [legendColor],
//             fontWeight: '600',
//             fontFamily: 'Public Sans',
//           },
//         },
//         legend: { show: false },
//         tooltip: { enabled: false },
//         xaxis: {
//           categories: [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//           ],
//           axisBorder: {
//             show: true,
//             color: borderColor,
//           },
//           axisTicks: { show: false },
//           labels: {
//             style: {
//               colors: labelColor,
//               fontSize: '13px',
//               fontFamily: 'Public Sans',
//             },
//           },
//         },
//         yaxis: {
//           labels: {
//             offsetX: -15,
//             formatter(val) {
//               return `${ val / 1 }k`
//             },
//             style: {
//               fontSize: '13px',
//               colors: labelColor,
//               fontFamily: 'Public Sans',
//             },
//             min: 0,
//             max: 60000,
//             tickAmount: 6,
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 1441,
//             options: { plotOptions: { bar: { columnWidth: '41%' } } },
//           },
//           {
//             breakpoint: 590,
//             options: {
//               plotOptions: { bar: { columnWidth: '61%' } },
//               grid: { padding: { right: 0 } },
//               dataLabels: {
//                 style: {
//                   fontSize: '12px',
//                   fontWeight: '400',
//                 },
//               },
//               yaxis: { labels: { show: false } },
//             },
//           },
//         ],
//       },
//       series: [{
//         data: [
//           10,
//           22,
//           27,
//           33,
//           42,
//           32,
//           27,
//           22,
//           8,
//         ],
//       }],
//     },
//     {
//       title: '4 Way',
//       icon: 'tabler-chart-bar',
//       chartOptions: {
//         chart: {
//           parentHeightOffset: 0,
//           type: 'bar',
//           toolbar: { show: false },
//         },
//         plotOptions: {
//           bar: {
//             columnWidth: '32%',
//             borderRadius: 6,
//             distributed: true,
//             borderRadiusApplication: 'end',
//             dataLabels: { position: 'top' },
//           },
//         },
//         grid: {
//           show: false,
//           padding: {
//             top: 0,
//             bottom: 0,
//             left: -10,
//             right: -10,
//           },
//         },
//         colors: [
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
//         ],
//         dataLabels: {
//           enabled: true,
//           formatter(val) {
//             return `${ val }k`
//           },
//           offsetY: -25,
//           style: {
//             fontSize: '15px',
//             colors: [legendColor],
//             fontWeight: '600',
//             fontFamily: 'Public Sans',
//           },
//         },
//         legend: { show: false },
//         tooltip: { enabled: false },
//         xaxis: {
//           categories: [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//           ],
//           axisBorder: {
//             show: true,
//             color: borderColor,
//           },
//           axisTicks: { show: false },
//           labels: {
//             style: {
//               colors: labelColor,
//               fontSize: '13px',
//               fontFamily: 'Public Sans',
//             },
//           },
//         },
//         yaxis: {
//           labels: {
//             offsetX: -15,
//             formatter(val) {
//               return `${ val / 1 }k`
//             },
//             style: {
//               fontSize: '13px',
//               colors: labelColor,
//               fontFamily: 'Public Sans',
//             },
//             min: 0,
//             max: 60000,
//             tickAmount: 6,
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 1441,
//             options: { plotOptions: { bar: { columnWidth: '41%' } } },
//           },
//           {
//             breakpoint: 590,
//             options: {
//               plotOptions: { bar: { columnWidth: '50%' } },
//               dataLabels: {
//                 style: {
//                   fontSize: '12px',
//                   fontWeight: '400',
//                 },
//               },
//               grid: { padding: { right: 0 } },
//               yaxis: { labels: { show: false } },
//             },
//           },
//         ],
//       },
//       series: [{
//         data: [
//           5,
//           9,
//           12,
//           18,
//           20,
//           25,
//           30,
//           36,
//           48,
//         ],
//       }],
//     },
//     {
//       title: 'stack',
//       icon: 'tabler-chart-bar',
//       chartOptions: {
//         chart: {
//           parentHeightOffset: 0,
//           type: 'bar',
//           toolbar: { show: false },
//         },
//         plotOptions: {
//           bar: {
//             columnWidth: '32%',
//             borderRadius: 6,
//             distributed: true,
//             borderRadiusApplication: 'end',
//             dataLabels: { position: 'top' },
//           },
//         },
//         grid: {
//           show: false,
//           padding: {
//             top: 0,
//             bottom: 0,
//             left: -10,
//             right: -10,
//           },
//         },
//         colors: [
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
//         ],
//         dataLabels: {
//           enabled: true,
//           formatter(val) {
//             return `${ val }k`
//           },
//           offsetY: -25,
//           style: {
//             fontSize: '15px',
//             colors: [legendColor],
//             fontWeight: '600',
//             fontFamily: 'Public Sans',
//           },
//         },
//         legend: { show: false },
//         tooltip: { enabled: false },
//         xaxis: {
//           categories: [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//           ],
//           axisBorder: {
//             show: true,
//             color: borderColor,
//           },
//           axisTicks: { show: false },
//           labels: {
//             style: {
//               colors: labelColor,
//               fontSize: '13px',
//               fontFamily: 'Public Sans',
//             },
//           },
//         },
//         yaxis: {
//           labels: {
//             offsetX: -15,
//             formatter(val) {
//               return `${ val / 1 }k`
//             },
//             style: {
//               fontSize: '13px',
//               colors: labelColor,
//               fontFamily: 'Public Sans',
//             },
//             min: 0,
//             max: 60000,
//             tickAmount: 6,
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 1441,
//             options: { plotOptions: { bar: { columnWidth: '41%' } } },
//           },
//           {
//             breakpoint: 590,
//             options: {
//               plotOptions: { bar: { columnWidth: '50%' } },
//               dataLabels: {
//                 style: {
//                   fontSize: '12px',
//                   fontWeight: '400',
//                 },
//               },
//               grid: { padding: { right: 0 } },
//               yaxis: { labels: { show: false } },
//             },
//           },
//         ],
//       },
//       series: [{
//         data: [
//           5,
//           9,
//           12,
//           18,
//           20,
//           25,
//           30,
//           36,
//           48,
//         ],
//       }],
//     },
//     {
//       title: 'สายแขวน',
//       icon: 'tabler-chart-bar',
//       chartOptions: {
//         chart: {
//           parentHeightOffset: 0,
//           type: 'bar',
//           toolbar: { show: false },
//         },
//         plotOptions: {
//           bar: {
//             columnWidth: '32%',
//             borderRadius: 6,
//             distributed: true,
//             borderRadiusApplication: 'end',
//             dataLabels: { position: 'top' },
//           },
//         },
//         grid: {
//           show: false,
//           padding: {
//             top: 0,
//             bottom: 0,
//             left: -10,
//             right: -10,
//           },
//         },
//         colors: [
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
//         ],
//         dataLabels: {
//           enabled: true,
//           formatter(val) {
//             return `${ val }k`
//           },
//           offsetY: -25,
//           style: {
//             fontSize: '15px',
//             colors: [legendColor],
//             fontWeight: '600',
//             fontFamily: 'Public Sans',
//           },
//         },
//         legend: { show: false },
//         tooltip: { enabled: false },
//         xaxis: {
//           categories: [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//           ],
//           axisBorder: {
//             show: true,
//             color: borderColor,
//           },
//           axisTicks: { show: false },
//           labels: {
//             style: {
//               colors: labelColor,
//               fontSize: '13px',
//               fontFamily: 'Public Sans',
//             },
//           },
//         },
//         yaxis: {
//           labels: {
//             offsetX: -15,
//             formatter(val) {
//               return `${ val / 1 }k`
//             },
//             style: {
//               fontSize: '13px',
//               colors: labelColor,
//               fontFamily: 'Public Sans',
//             },
//             min: 0,
//             max: 60000,
//             tickAmount: 6,
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 1441,
//             options: { plotOptions: { bar: { columnWidth: '41%' } } },
//           },
//           {
//             breakpoint: 590,
//             options: {
//               plotOptions: { bar: { columnWidth: '50%' } },
//               dataLabels: {
//                 style: {
//                   fontSize: '12px',
//                   fontWeight: '400',
//                 },
//               },
//               grid: { padding: { right: 0 } },
//               yaxis: { labels: { show: false } },
//             },
//           },
//         ],
//       },
//       series: [{
//         data: [
//           5,
//           9,
//           12,
//           18,
//           20,
//           25,
//           30,
//           36,
//           48,
//         ],
//       }],
//     },
//     {
//       title: 'อื่นๆ',
//       icon: 'tabler-chart-bar',
//       chartOptions: {
//         chart: {
//           parentHeightOffset: 0,
//           type: 'bar',
//           toolbar: { show: false },
//         },
//         plotOptions: {
//           bar: {
//             columnWidth: '32%',
//             borderRadius: 6,
//             distributed: true,
//             borderRadiusApplication: 'end',
//             dataLabels: { position: 'top' },
//           },
//         },
//         grid: {
//           show: false,
//           padding: {
//             top: 0,
//             bottom: 0,
//             left: -10,
//             right: -10,
//           },
//         },
//         colors: [
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           labelPrimaryColor,
//           `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
//         ],
//         dataLabels: {
//           enabled: true,
//           formatter(val) {
//             return `${ val }k`
//           },
//           offsetY: -25,
//           style: {
//             fontSize: '15px',
//             colors: [legendColor],
//             fontWeight: '600',
//             fontFamily: 'Public Sans',
//           },
//         },
//         legend: { show: false },
//         tooltip: { enabled: false },
//         xaxis: {
//           categories: [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//           ],
//           axisBorder: {
//             show: true,
//             color: borderColor,
//           },
//           axisTicks: { show: false },
//           labels: {
//             style: {
//               colors: labelColor,
//               fontSize: '13px',
//               fontFamily: 'Public Sans',
//             },
//           },
//         },
//         yaxis: {
//           labels: {
//             offsetX: -15,
//             formatter(val) {
//               return `${ val / 1 }k`
//             },
//             style: {
//               fontSize: '13px',
//               colors: labelColor,
//               fontFamily: 'Public Sans',
//             },
//             min: 0,
//             max: 60000,
//             tickAmount: 6,
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 1441,
//             options: { plotOptions: { bar: { columnWidth: '41%' } } },
//           },
//           {
//             breakpoint: 590,
//             options: {
//               plotOptions: { bar: { columnWidth: '50%' } },
//               dataLabels: {
//                 style: {
//                   fontSize: '12px',
//                   fontWeight: '400',
//                 },
//               },
//               grid: { padding: { right: 0 } },
//               yaxis: { labels: { show: false } },
//             },
//           },
//         ],
//       },
//       series: [{
//         data: [
//           5,
//           9,
//           12,
//           18,
//           20,
//           25,
//           30,
//           36,
//           48,
//         ],
//       }],
//     },
//   ]
// })
</script>

<template>
  <VCard
    title="Extra"
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
                  @click="dashboard_extra"
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
              <!--
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
              -->
              <VCol
                cols="12"
                md="3"
              >
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
              <VCol
                cols="12"
                md="3"
              >
                <AppAutocomplete 
                  v-model="rental_area_unit_id" 
                  label="พื้นที่"
                  placeholder="พื้นที่" 
                  :items="groupedRentalAreaUnit" 
                  item-title="name"
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
          <VRow>
            <VCol
              cols="12"
              md="12"
              xl="12"
              lg="12"
            >
              <VCard>
                <VCardItem title="Extra Display By Account" />
                <VRow>
                  <VCol
                    cols="12"
                    md="12"
                    xl="12"
                    lg="12"
                  >
                    <div>
                      <VueApexCharts
                        type="bar"
                        height="260"
                        :options="topicsChartConfig"
                        :series="topicsChartSeriesx"
                      />
                    </div>
                  </VCol>

                  <VCol
                    cols="12"
                    md="12"
                    lg="12"
                    xl="12"
                  >
                    <div
                      class="topic-progress d-flex flex-wrap gap-x-6 gap-y-10 ms-auto"
                      style="padding: 16px;"
                    >
                      <div
                        v-for="topic in topicsDatax"
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
        </VCol>

        <VCol
          cols="12"
          md="4"
          xl="4"
          lg="4"
        >
          <VCard>
            <VCardItem title="พื้นที่">
              <template #append />
            </VCardItem>
            <VCardText>
              <VList class="card-list">
                <VListItem
                  v-for="(val,index) in area"
                  :key="index"
                >
                  <template #prepend>
                    <VProgressCircular
                      v-model="val.area_percentage"
                      :size="54"
                      class="me-4"
                      color="rgb(255,180,0)"
                    >
                      <span class="text-body-1 text-high-emphasis font-weight-medium">
                        {{ val.area_percentage }}%
                      </span>
                    </VProgressCircular>
                  </template>
                  <VListItemTitle class="font-weight-medium mb-2 me-2">
                    {{ val.rental_area_unit_name }}
                  </VListItemTitle>

                  <VListItemSubtitle class="me-2">
                    {{ val.tasks }} Tasks
                  </VListItemSubtitle>
                  <template #append />
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
      
      <VRow>
        <VCol
          cols="12"
          md="12"
          xl="12"
          lg="12"
        >
          <VRow>
            <VCol
              cols="12"
              md="12"
              xl="12"
              lg="12"
            >
              <VCard title="Accumulate Extra Display">
                <template #append>
                  <div class="mt-n4 me-n2">
                    <!-- <MoreBtn :menu-list="moreList" /> -->
                  </div>
                </template>

                <VCardText>
                  <VSlideGroup
                    v-model="currentTab"
                    show-arrows
                    mandatory
                    class="mb-10"
                  >
                    <VSlideGroupItem
                      v-for="(report, index) in chartConfigsx"
                      :key="report.title"
                      v-slot="{ isSelected, toggle }"
                      :value="index"
                    >
                      <div
                        style="block-size: 100px; inline-size: 110px;"
                        :style="isSelected ? 'border-color:rgb(var(--v-theme-primary)) !important' : ''"
                        :class="isSelected ? 'border' : 'border border-dashed'"
                        class="d-flex flex-column justify-center align-center cursor-pointer rounded py-4 px-5 me-4"
                        @click="toggle"
                      >
                        <VAvatar
                          rounded
                          size="38"
                          :color="isSelected ? 'primary' : ''"
                          variant="tonal"
                          class="mb-2"
                        >
                          <VIcon
                            size="22"
                            :icon="report.icon"
                          />
                        </VAvatar>
                        <h6
                          class="text-base font-weight-medium mb-0"
                          style="font-size: 10px;"
                        >
                          {{ report.title }}
                        </h6>
                      </div>
                    </VSlideGroupItem>
                  </VSlideGroup>
                  <!-- {{ chartConfigsx[Number(currentTab)].chartOptions }} -->
                  <!-- {{ Number(currentTab) }} -->
                  <VueApexCharts
                    ref="refVueApexChart"
                    :key="currentTab"
                    :options="currentChartOptions"
                    :series="currentChartSeries"
                    height="230"
                    class="mt-3"
                  />
                  <!--
                    <VueApexCharts
                    ref="refVueApexChart"
                    :key="currentTab"
                    :options="chartConfigsx[Number(currentTab)].chartOptions"
                    :series="chartConfigsx[Number(currentTab)].series"
                    height="230"
                    class="mt-3"
                    /> 
                  -->
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import apiService from '@/services/api'
import Swal from 'sweetalert2'
import { computed, ref } from "vue"
import { useTheme } from 'vuetify'

export default {
  setup() {
    // ✅ ใช้ Vuetify Theme
    const vuetifyTheme = useTheme()

    // ✅ คำนวณสีจากธีมปัจจุบัน (Fallback เป็นค่าสี default)
    const themeColors = computed(() => vuetifyTheme.current.value.colors || {})
    const variables = computed(() => vuetifyTheme.current.value.variables || {})

    return {
      vuetifyTheme,
      themeColors, // ✅ ส่งค่า themeColors ออกไปใช้งาน
      variables,
    }
  },
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

    categoryId: null,
    brand_id: null,
    sub_brand_id: null,
    product_name: null,
      
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

    topicsDatax: [],
    topicsChartSeriesx: [],
    chartConfigsx: [],
    account_oos_data: [
      { title: 'Account 1', value: 35 },
      { title: 'Account 2', value: 20 },
      { title: 'Account 3', value: 14 },
      { title: 'Account 4', value: 12 },
      { title: 'Account 5', value: 10 },
      { title: 'Account 6', value: 9 },
    ],

    topicsChartConfig: {},
    stockData: [],
    top5_stock_products: [],
    less5_stock_products: [],
    searchQuery: null,
    datalist: [],
    area: [],
    complianceResult: [],
    accountData: [],
      
    groupedRentalAreaUnit: [],
    rental_area_unit_id: null,

    // chartOptionsxxx:{},
    // seriesxxx:{},
  }),
  computed: {
    // ✅ ฟังก์ชันกรองข้อมูลสินค้า
    filteredGroupedData() {
      if (!this.searchQuery) return this.groupedData

      const searchTerm = this.searchQuery.toLowerCase()

      const filterProducts = value4 => {
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
                  value3.filter(filterProducts), // ✅ กรองสินค้าในแต่ละ `brandName`
                ]),
              ),
            ]),
          ),
        ]),
      )
    },

    // กำหนดค่าเริ่มต้นเป็น 0 หาก currentTab ยังไม่ได้ถูกเลือก
    selectedTabIndex() {
      return Number(this.currentTab) || 0 
    },
      
    currentChartOptions() {
      // 1. ตรวจสอบว่า chartConfigsx โหลดแล้วหรือไม่
      if (!this.chartConfigsx || this.chartConfigsx.length === 0) {
        // คืนค่าโครงสร้างพื้นฐานป้องกัน Error ขณะโหลดข้อมูล
        return { chart: { type: 'line' } }
      }
          
      // 2. ดึง options ของ Tab ที่ถูกเลือก
      const config = this.chartConfigsx[this.selectedTabIndex]
          
      // 3. ตรวจสอบว่า chartOptions มีค่าก่อนคืนค่า
      return config && config.chartOptions ? config.chartOptions : { chart: { type: 'line' } }
    },
      
    currentChartSeries() {
      if (!this.chartConfigsx || this.chartConfigsx.length === 0) {
        return []
      }
          
      const config = this.chartConfigsx[this.selectedTabIndex]
      
      return config && config.series ? config.series : []
    },
  },
  watch: {
    // ✅ เมื่อ `chartConfigsx` มีค่าหลังจากโหลด API ให้ console.log เพื่อตรวจสอบ
    chartConfigsx(newVal) {
      console.log("🔥 chartConfigsx อัปเดต:", newVal)
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
          vm.get_all_rental_area_unit()

          // alert(vm.user_id);
          this.dashboard_extra()

          // vm.dashboard_stock_table()
          // vm.get_all_filters_areaManagers()
        }else{
          vm.get_all_rental_area_unit()
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
          formatter: val => `${Number.parseFloat(val, 2)}%`,
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
                  formatter: val => `${Number.parseFloat(val, 2)}%`,
                },
                total: {
                  show: true,
                  fontSize: '1.125rem',
                  label: 'Total Stock',
                  formatter: () => `${data.reduce((sum, item) => Number.parseFloat(sum + item.value, 2), 0)}%`,
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
    getPieChartConfig(brands) {
      console.log(brands)
      
      return {
        chart: { type: "pie", height: 250 },
        labels: brands.map(b => b.brand_name),
        colors: ["#ff5733", "#33ff57", "#3357ff", "#ff33a1", "#f4c542", '#fdd835', '#00d4bd', '#826bf8', '#32baff', '#ffa1a1', '#ff8c00'],
        legend: { position: 'bottom',
          markers: { offsetX: -3 },
          fontSize: '13px',
          labels: { colors: '#ffb400' },
          itemMargin: { vertical: 3, horizontal: 10 } },
        dataLabels: { enabled: true, formatter: val => `${Number.parseFloat(val, 2)}%` },
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
    async dashboard_extra() {
      const vm = this
      try {
        const form = {
          user_code: this.userData.code,
          position_id: this.userData.position_id,

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
          product_name: vm.product_name,

          rental_area_unit_id: vm.rental_area_unit_id,
        }

        const response = await apiService.dashboard_extra(form)

        console.log(response.data.status)
        if (response.data.status === "success") {
          this.currentTab = 0
          this.stockData = response.data.data
          this.area = response.data.area
          this.complianceResult = response.data.complianceResult
          this.accountData = response.data.accountData
            
          // ✅ กำหนดสีให้ Account
          const accountColors = ["primary", "info", "success", "secondary", "error", "warning"]

          // ✅ คำนวณเปอร์เซ็นต์ของแต่ละ Account และจัดรูปแบบข้อมูล
          const topicsData = this.accountData.map((account, index) => ({
            title: account.account_name,
            value: account.percentage, // ใช้ % ของ Account
            color: accountColors[index % accountColors.length], // ใช้สีวนซ้ำถ้าเกิน 6 Accounts
          }))

          // ✅ จัดรูปแบบข้อมูลสำหรับซีรีส์ในกราฟ
          const topicsChartSeries = [
            {
              name: "Total",
              data: this.accountData.map(account => account.percentage || 0),
            },
          ]

          vm.topicsDatax = topicsData
          vm.topicsChartSeriesx = topicsChartSeries

          const chartConfigsx = response.data.chartConfigs

          vm.chartConfigsx = chartConfigsx

          // ✅ ตรวจสอบค่าที่ได้
          console.log({ topicsData, topicsChartSeries, chartConfigsx })
          setTimeout(() => {
            vm.topicsChartConfig = {
              chart: {
                height: 270,
                type: 'bar',
                toolbar: { show: false },
                stacked: true,
              },
              plotOptions: {
                bar: {
                  horizontal: true, // แนวนอน
                  barHeight: '70%', // ความสูงของแถบ
                  distributed: false, // ไม่ใช้สีสุ่ม (ใช้สีที่กำหนดใน colors)
                  borderRadius: 7,
                  borderRadiusApplication: 'end',
                },
              },
              colors: [
                'rgba(var(--v-theme-primary),1)',
                'rgba(var(--v-theme-info),1)',
              ],
              grid: {
                strokeDashArray: 10,
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: false } },
                padding: {
                  top: -10,
                  bottom: -10,
                },

                // padding: {
                //   top: -35,
                //   bottom: -12,
                // },
              },
              dataLabels: {
                enabled: true,
                formatter: (val, { seriesIndex }) => {
                  // แสดงข้อความ "ได้" หรือ "ได้ทดแทน" บนแถบ
                  return seriesIndex === 0 ? `${Number.parseFloat(val, 2)}%` : "Total"
                },
                style: {
                  colors: ['#fff'], // สีข้อความ
                  fontSize: '12px',
                },
              },
              labels: response.data.account_names,
              xaxis: {
                categories: response.data.account_names,
                axisBorder: { show: false }, // ซ่อนเส้นแกน x
                axisTicks: { show: false }, // ซ่อน tick ของแกน x
                labels: {
                  style: {
                    colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
                    fontSize: '13px', // ขนาดข้อความแกน x
                  },
                },

                // categories: [
                //   '6',
                //   '5',
                //   '4',
                //   '3',
                //   '2',
                //   '1',
                // ],
                // labels: {
                //   style: {
                //     colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
                //     fontSize: '13px',
                //   },
                //   formatter(val) {
                //     return `${ val }%`
                //   },
                // },
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
                y: {
                  formatter: val => `${Number.parseFloat(val, 2)}%`, // แสดง tooltip เป็นเปอร์เซ็นต์
                },

                // onDatasetHover: { highlightDataSeries: false },
              },
              legend: {
                position: 'right', // วาง legend ด้านขวา
                offsetY: 0,
                offsetX: 0,
              },
            }

            // vm.chartOptionsxxx = 
          }, 200)

          // vm.dashboard_stock_table();
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

        const response = await apiService.get_all_filters(form)

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
        if(!vm.account_id){
          vm.provinces_id = null
          vm.get_all_filters_provinces()
        }
        if(vm.account_id){
          vm.get_all_rental_area_unit()
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
        vm.get_all_filters_products()
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
        vm.get_all_filters_products()
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
    async get_all_filters_products() {
      const vm = this
      try {
        const form = {
          categoryId: this.categoryId,
          brand_id: this.brand_id,
          sub_brand_id: this.sub_brand_id,
          position_name: this.userData.position_name,
          group_customer_id: this.group_customer_id,
        }

        const response = await apiService.get_all_filters_products(form)

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
    async get_all_rental_area_unit(){
      try {
        var form = {
          group_customer_id: this.group_customer_id,
          position_name: this.userData.position_name,
          store_id: this.store_id,
          account_id: this.account_id,
        }
        const response = await apiService.get_all_rental_area_unit(form)
        const rental_area_unitlist = response.data.data.filter(x=>x.isActive == 'Y')

        this.groupedRentalAreaUnit = Array.from(
          rental_area_unitlist.reduce((map, item) => {
            if (!map.has(item.unit)) {
              map.set(item.unit, { id: item.unit, name: item.unit })
            }
            
            return map
          }, new Map()).values(),
        )
      } catch (error) {
        console.error('Error:', error)
      }
    },  
  },
}
</script>

