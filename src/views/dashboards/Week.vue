<script setup>
import { hexToRgb } from '@layouts/utils';
import { useTheme } from 'vuetify';

const vuetifyTheme = useTheme()
const currentTab = ref(0)
const refVueApexChart = ref()

const chartConfigs = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelPrimaryColor = `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`
  const legendColor = `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`
  const borderColor = `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`
  const labelColor = `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`
  
  return [
    {
      title: 'Orders',
      icon: 'tabler-shopping-cart',
      chartOptions: {
        chart: {
          parentHeightOffset: 0,
          type: 'bar',
          toolbar: { show: true },
        },
        plotOptions: {
          bar: {
            columnWidth: '32%',
            borderRadiusApplication: 'end',
            borderRadius: 4,
            distributed: true,
            dataLabels: { position: 'top' },
          },
        },
        grid: {
          show: true,
          padding: {
            top: 0,
            bottom: 0,
            left: -10,
            right: -10,
          },
        },
        colors: [
          `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
          `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
          `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
          `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
          `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
          `rgba(${ hexToRgb(currentTheme.primary) }, 1)`,
          labelPrimaryColor,
          labelPrimaryColor,
          labelPrimaryColor,
        ],
        dataLabels: {
          enabled: true,
          formatter(val) {
            return `${ val }k`
          },
          offsetY: -25,
          style: {
            fontSize: '15px',
            colors: [legendColor],
            fontWeight: '600',
            fontFamily: 'Public Sans',
          },
        },
        legend: { show: false },
        tooltip: { enabled: true },
        xaxis: {
          categories: [
            "ร้านค้า1",
            "ร้านค้า2",
            "ร้านค้า3",
            "ร้านค้า4",
            "ร้านค้า5",
            "ร้านค้า6",
            "ร้านค้า7",
            "ร้านค้า8",
            "ร้านค้า9",
          ],
          axisBorder: {
            show: false,
            color: borderColor,
          },
        },
        yaxis: {
          labels: {
            offsetX: -15,
            formatter(val) {
              return `${ val / 1 }k`
            },
            style: {
              fontSize: '13px',
              colors: labelColor,
              fontFamily: 'Public Sans',
            },
            min: 0,
            max: 60000,
            tickAmount: 6,
          },
        },
        responsive: [
          {
            breakpoint: 1441,
            options: { plotOptions: { bar: { columnWidth: '41%' } } },
          },{
            breakpoint: 768, // ปรับขนาดสำหรับแท็บเล็ต
            options: {
              plotOptions: { bar: { columnWidth: '50%' } },
              yaxis: { labels: { show: true } },
              grid: {
                padding: {
                  right: 0,
                  left: -15,
                },
              },
              dataLabels: {
                style: {
                  fontSize: '12px',
                  fontWeight: '400',
                },
              },
            },
          },{
            breakpoint: 480, // ปรับขนาดสำหรับมือถือ
            options: {
              plotOptions: { bar: { columnWidth: '70%' } }, // เพิ่มความกว้างของ bar
              yaxis: { labels: { show: false } }, // ซ่อน Y-axis labels
              grid: {
                padding: {
                  right: 0,
                  left: 0,
                },
              },
              dataLabels: {
                style: {
                  fontSize: '9px', // ลดขนาด font สำหรับมือถือ
                  fontWeight: '400',
                },
              },
              xaxis: {
                labels: {
                  style: {
                    fontSize: '9px', // ลดขนาด font ของ X-axis
                  },
                },
              },
              tooltip: {
                style: {
                  fontSize: '9px', // ลดขนาด tooltip สำหรับมือถือ
                },
              },
            },
          },
        ],
      },
      series: [{
        name: "จำนวน",
        data: [
          28,
          10,
          45,
          38,
          15,
          30,
          35,
          30,
          8,
        ],
      }],
    }
  ]
})

const moreList = [
  {
    title: 'Filter',
    value: 'Filter',
  }
]
</script>

<template>
  <VCard
    title="12 WEEKS"
    subtitle=""
  >
    <template #append>
      <div class="mt-n4 me-n2">
        <MoreBtn
          size="small"
          :menu-list="moreList"
        />
      </div>
    </template>

    <VCardText>
      <VueApexCharts
        ref="refVueApexChart"
        :key="currentTab"
        :options="chartConfigs[Number(currentTab)].chartOptions"
        :series="chartConfigs[Number(currentTab)].series"
        class="mt-3"
      />
    </VCardText>
  </VCard>
</template>
