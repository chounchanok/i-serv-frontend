<script setup>
import Compliance from '@/views/dashboards/Compliance.vue';
import Coupon from '@/views/dashboards/Coupon.vue';
import Offtake from '@/views/dashboards/Offtake.vue';
import Oos from '@/views/dashboards/Oos.vue';
import Week from '@/views/dashboards/Week.vue';

const simpleStatisticsDemoCards = [
  {
    icon: 'tabler-credit-card',
    color: 'error',
    title: 'Total Profit',
    subTitle: 'Last week',
    stat: '1.28k',
    change: '-12.2%',
  },
  {
    icon: 'tabler-currency-dollar',
    color: 'success',
    title: 'Total Sales',
    subTitle: 'Last week',
    stat: '$4,673',
    change: '+25.2%',
  },
]
</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="6"
    >
      <Oos />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <Offtake />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <Week />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <Coupon />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <Compliance />
    </VCol>
  </VRow>
</template>
