<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { $api } from '@/utils/api' // นำเข้า $api เพื่อใช้ยิง API

// หากต้องการใช้ VueApexCharts ในไฟล์นี้ (ถ้าไม่ได้ลงทะเบียน Global ไว้)
// import VueApexCharts from 'vue3-apexcharts'

const router = useRouter()

// 1. เปลี่ยนจาก Mock Data เป็น Array ว่างเพื่อรอรับข้อมูลจาก API
const myTasks = ref([])

const PRIORITY_LABELS = { H: 'สูง', M: 'กลาง', L: 'ต่ำ' }
const PRIORITY_COLORS = { H: '#EF4444', M: '#F5A623', L: '#22C55E' }

// ฟังก์ชันสำหรับดึงข้อมูล Task จาก API
const fetchTasks = async () => {
  try {
    // 1. ดึงข้อมูล User จาก LocalStorage 
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : null
    
    if (!userData || !userData.id) {
      console.error('ไม่พบข้อมูลพนักงานในระบบ')
      return
    }

    // 2. ส่ง userId ไปทาง Query String (?userId=...)
    const response = await $api(`/employee/my-tasks?userId=${userData.id}`)
    
    // 3. Map ข้อมูล (อัปเดตตรง brand ให้แสดง Group แทน เพราะ Backend เราเซฟ Group ID ลงไปใน column target_brands)
    myTasks.value = response.map(item => ({
      id: item.id,
      name: item.task_detail?.name || 'ไม่ได้ระบุชื่องาน',
      brand: item.task_detail?.target_brands ? `Group ID: ${item.task_detail.target_brands}` : 'ทั่วไป',
      priority: item.task_detail?.priority || 'M',
      status: { status: item.status }
    }))
  } catch (error) {
    console.error('Error fetching employee tasks:', error)
  }
}

// 3. เรียกใช้ฟังก์ชันตอนโหลด Component
onMounted(() => {
  fetchTasks()
})

// 4. Computed Logic แบบเดิม
const submittedTasks = computed(() => myTasks.value.filter(t => t.status.status === 'submitted'))
const pendingTasks = computed(() => myTasks.value.filter(t => t.status.status === 'pending'))

const pct = computed(() => {
  if (myTasks.value.length === 0) return 0
  return Math.round((submittedTasks.value.length / myTasks.value.length) * 100)
})

// ดึงวันที่ปัจจุบันภาษาไทย
const dateStr = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

// 5. Chart Configuration 
const chartSeries = computed(() => [submittedTasks.value.length, pendingTasks.value.length])
const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'inherit',
  },
  labels: ['ส่งแล้ว', 'รอดำเนินการ'],
  colors: ['#22C55E', '#F5A623'],
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          name: { show: true, fontSize: '12px', color: '#6b7280' },
          value: {
            show: true,
            fontSize: '24px',
            fontWeight: 'bold',
            formatter: val => `${val} รายการ`
          },
          total: {
            show: true,
            showAlways: true,
            label: 'ส่งแล้ว',
            fontSize: '12px',
            color: '#6b7280',
            formatter: () => `${pct.value}%`
          }
        }
      }
    }
  },
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  legend: { 
    position: 'bottom',
    markers: { radius: 12 }
  }
}))
</script>

<template>
  <VCard class="pa-6" style="background-color: whitesmoke;">
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold text-high-emphasis mb-1">แดชบอร์ดพนักงาน</h2>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ dateStr }}</p>
    </div>

    <VRow class="mb-2">
      <VCol cols="12" sm="6" md="3">
        <VCard elevation="0" border class="d-flex align-center pa-5" style="border-radius: 16px;">
          <VAvatar rounded="lg" color="primary" variant="tonal" class="me-4" size="44">
            <VIcon icon="tabler-trending-up" size="24" />
          </VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold text-primary">{{ myTasks.length }}</h3>
            <span class="text-caption text-medium-emphasis">งานทั้งหมดวันนี้</span>
          </div>
        </VCard>
      </VCol>
      
      <VCol cols="12" sm="6" md="3">
        <VCard elevation="0" border class="d-flex align-center pa-5" style="border-radius: 16px;">
          <VAvatar rounded="lg" color="success" variant="tonal" class="me-4" size="44">
            <VIcon icon="tabler-circle-check" size="24" />
          </VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold text-success">{{ submittedTasks.length }}</h3>
            <span class="text-caption text-medium-emphasis">ส่งแล้ว</span>
          </div>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard elevation="0" border class="d-flex align-center pa-5" style="border-radius: 16px;">
          <VAvatar rounded="lg" color="warning" variant="tonal" class="me-4" size="44">
            <VIcon icon="tabler-clock" size="24" />
          </VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold text-warning">{{ pendingTasks.length }}</h3>
            <span class="text-caption text-medium-emphasis">รอดำเนินการ</span>
          </div>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard elevation="0" border class="d-flex align-center pa-5" style="border-radius: 16px;">
          <VAvatar 
            rounded="lg" 
            :color="pct >= 80 ? 'success' : pct >= 50 ? 'warning' : 'error'" 
            variant="tonal" 
            class="me-4" 
            size="44"
          >
            <VIcon icon="tabler-alert-triangle" size="24" />
          </VAvatar>
          <div>
            <h3 
              class="text-h4 font-weight-bold" 
              :class="pct >= 80 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-error'"
            >
              {{ pct }}%
            </h3>
            <span class="text-caption text-medium-emphasis">ความสำเร็จ</span>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="6">
        <VCard title="สัดส่วนการส่งงานวันนี้" elevation="0" border class="h-100" style="border-radius: 16px;">
          <VCardText>
            <div v-if="myTasks.length === 0" class="d-flex align-center justify-center text-medium-emphasis h-100" style="min-height: 220px;">
              ไม่มีงานสำหรับวันนี้
            </div>
            <div v-else class="mt-2 d-flex justify-center">
              <VueApexCharts
                type="donut"
                height="280"
                :options="chartOptions"
                :series="chartSeries"
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="6">
        <VCard elevation="0" border class="h-100" style="border-radius: 16px;">
          <VCardItem>
            <VCardTitle>รายการงานวันนี้</VCardTitle>
            <template #append>
              <VBtn 
                variant="text" 
                color="warning" 
                size="small" 
                append-icon="tabler-chevron-right"
                @click="router.push('/todo/my-tasks')"
              >
                ดูทั้งหมด
              </VBtn>
            </template>
          </VCardItem>

          <VCardText>
            <div v-if="myTasks.length === 0" class="d-flex align-center justify-center text-medium-emphasis" style="min-height: 200px;">
              ไม่มีงานสำหรับวันนี้
            </div>
            <div v-else class="d-flex flex-column gap-3 mt-2">
              <div 
                v-for="item in myTasks.slice(0, 5)" 
                :key="item.id"
                class="d-flex align-center pa-3"
                :style="{
                  background: item.status.status === 'submitted' ? '#F0FDF4' : '#FFF9E6',
                  border: `1px solid ${item.status.status === 'submitted' ? '#BBF7D0' : '#FDE68A'}`,
                  borderRadius: '12px'
                }"
              >
                <VAvatar 
                  :color="PRIORITY_COLORS[item.priority] || '#F5A623'" 
                  size="28" 
                  class="text-white text-caption font-weight-bold me-3"
                >
                  {{ PRIORITY_LABELS[item.priority] }}
                </VAvatar>
                
                <div class="flex-grow-1 overflow-hidden me-2">
                  <p class="text-subtitle-2 font-weight-bold text-truncate mb-0 text-high-emphasis">{{ item.name }}</p>
                  <p class="text-caption text-medium-emphasis mb-0">{{ item.brand }}</p>
                </div>

                <VIcon 
                  :icon="item.status.status === 'submitted' ? 'tabler-circle-check' : 'tabler-clock'" 
                  :color="item.status.status === 'submitted' ? '#22C55E' : '#F5A623'"
                  size="20"
                />
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VCard>
</template>
