<script setup>
import { computed, ref, onMounted } from 'vue'
import { $api } from '@/utils/api'

// --- State Management ---
const rawSummaries = ref([])
const filterStore = ref('all')
const filterAccounts = ref([])
const selectedEmployee = ref(null)
const selectedEmployeeTasks = ref([])
const isModalVisible = ref(false)

const PRIORITY_LABELS = { 1: 'สูง', 2: 'กลาง', 3: 'น้อย', 'H': 'สูง', 'M': 'กลาง', 'L': 'น้อย' }
const PRIORITY_COLORS = { 1: '#EF4444', 2: '#F5A623', 3: '#3B82F6', 'H': '#EF4444', 'M': '#F5A623', 'L': '#3B82F6' }

// 🌟 สร้างวันที่ YYYY-MM-DD แบบไม่เพี้ยน Timezone 🌟
const getTodayStr = () => {
  const d = new Date()
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().split('T')[0]
}
const todayStr = getTodayStr()

// ✅ ปรับฟังก์ชัน fetchTeamSummary ให้รองรับการ Filter ด้วย
const fetchTeamSummary = async () => {
  try {
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : {}

    // เตรียม Params
    const params = {
      userId: userData.id,
      position_name: userData.position_name,
      group_customer_id: userData.group_customer_id
    }

    // ถ้าไม่ได้เลือก All ให้ส่ง account_name ไปให้ Backend กรอง
    if (filterStore.value !== 'all') {
      params.account_name = filterStore.value
    }

    const response = await $api('/admin/team-summary', { params })
    
    rawSummaries.value = response.summaries || []

    // ไม่ต้องดึง filterAccounts จากที่นี่แล้ว เพราะเรามี fetchFilterAccounts แยกต่างหากอยู่แล้ว
  } catch (error) {
    console.error('Error fetching team summary:', error)
  }
}

// 2. ดึงข้อมูล Account มาทำ Filter Dropdown
const fetchFilterAccounts = async () => {
  try {
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : {}

    const res = await $api('/get_account_by_user_position', {
      method: 'POST',
      body: {
        user_id: userData.id,
        position_name: userData.position_name,
        group_customer_id: userData.group_customer_id
      }
    })
    if (res && res.status === 'success') {
      filterAccounts.value = ['all', ...new Set(res.data.map(acc => acc.account.name))]
    }
  } catch (error) {
    console.error('Error fetching filter accounts:', error)
  }
}

// 3. ดึงงานรายบุคคลเมื่อกดปุ่ม "ดูรายการ"
const openDetail = async (summary) => {
  selectedEmployee.value = summary
  try {
    const tasks = await $api(`/admin/employee-tasks/${summary.employee.id}`)
    
    // 🌟 กรองเอาเฉพาะงานของ "วันนี้" เท่านั้นมาโชว์ใน Modal 🌟
    selectedEmployeeTasks.value = tasks
      .filter(item => {
        const taskDate = item.task_date ? String(item.task_date).split('T')[0] : ''
        return taskDate === todayStr
      })
      .map(item => ({
        status: { status: item.status, submittedAt: item.submitted_at },
        task: { 
          id: item.task_detail?.id, 
          name: item.task_detail?.name || 'ไม่ได้ระบุชื่องาน', 
          reportType: item.task_detail?.report_type || 'General', 
          brand: item.task_detail?.target_brands ? String(item.task_detail.target_brands) : 'ไม่ระบุ', 
          priority: item.task_detail?.priority || 'M' 
        }
      }))
    isModalVisible.value = true
  } catch (error) {
    console.error('Error fetching employee tasks details:', error)
  }
}

onMounted(() => {
  fetchTeamSummary()
  fetchFilterAccounts()
})

// --- Logic & Computed ---
const stores = computed(() => {
  return filterAccounts.value.length > 0 ? filterAccounts.value : ['all']
})

const filteredSummaries = computed(() => {
  return rawSummaries.value
})

const stats = computed(() => {
  const total = filteredSummaries.value.length
  const fullySubmitted = filteredSummaries.value.filter(s => s.pct === 100).length
  const avgPct = total > 0 ? Math.round(filteredSummaries.value.reduce((a, s) => a + s.pct, 0) / total) : 0
  
  return { total, fullySubmitted, avgPct }
})

const displayDateStr = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

// --- Chart Configuration (Donut Chart) ---
const chartSeries = computed(() => {
  const fullyDone = stats.value.fullySubmitted
  const notDone = stats.value.total - fullyDone
  return [fullyDone, notDone]
})

const chartOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: ['ส่งครบแล้ว (100%)', 'ยังไม่ครบ / ไม่ส่ง'],
  colors: ['#22C55E', '#F5A623'],
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex] + " คน"
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name: { show: true, fontSize: '14px', color: '#6b7280' },
          value: { show: true, fontSize: '24px', fontWeight: 'bold', formatter: (val) => `${val} คน` },
          total: {
            show: true,
            showAlways: true,
            label: 'พนักงานทั้งหมด',
            fontSize: '12px',
            formatter: () => `${stats.value.total} คน`
          }
        }
      }
    }
  },
  legend: { position: 'bottom', markers: { radius: 12 } },
  stroke: { width: 0 }
}))

// --- Export CSV ---
const handleExport = () => {
  // 1. เพิ่ม Header ใหม่ 2 คอลัมน์
  const headers = ['ชื่อพนักงาน', 'ร้านค้า/แอคเคาน์', 'งานทั้งหมด', 'ส่งแล้ว', 'รอส่ง', '% สำเร็จ', 'รายงานที่ทำแล้ว', 'รายงานที่ยังไม่ได้ทำ']
  
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""'
    const stringValue = String(value)
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  const rows = filteredSummaries.value.map(s => [
    escapeCSV(s.employee.name),
    escapeCSV(s.employee.store),
    s.total,
    s.submitted,
    s.pending,
    `${s.pct}%`,
    escapeCSV(s.submittedList), // 👈 ดึงรายชื่องานที่ทำแล้วมาใส่
    escapeCSV(s.pendingList)    // 👈 ดึงรายชื่องานที่รอส่งมาใส่
  ])
  
  const csvContent = "\ufeff" + [headers.map(escapeCSV), ...rows].map(e => e.join(",")).join("\n")
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `team-report-${todayStr}.csv`
  link.click()
}
</script>

<template>
  <VCard class="pa-6" style="background-color: whitesmoke;">
    <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold mb-1">ภาพรวมทีม (Supervisor)</h2>
        <p class="text-caption text-medium-emphasis mb-0">{{ displayDateStr }}</p>
      </div>
      <div class="d-flex align-center gap-3">
        <VSelect
          v-model="filterStore"
          :items="stores"
          density="compact"
          label="กรองข้อมูล (Account)"
          hide-details
          style="width: 200px;"
          @update:modelValue="fetchTeamSummary"
        />
        <VBtn color="secondary" variant="elevated" prepend-icon="tabler-download" @click="handleExport">
          Export
        </VBtn>
      </div>
    </div>

    <VRow class="mb-6">
      <VCol cols="12" md="4">
        <VCard border elevation="0" class="pa-5 d-flex align-center gap-4" style="border-radius: 16px;">
          <VAvatar color="primary" variant="tonal" rounded="lg"><VIcon icon="tabler-users" /></VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold">{{ stats.total }}</h3>
            <span class="text-caption text-medium-emphasis">พนักงานทั้งหมด</span>
          </div>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard border elevation="0" class="pa-5 d-flex align-center gap-4" style="border-radius: 16px;">
          <VAvatar color="success" variant="tonal" rounded="lg"><VIcon icon="tabler-circle-check" /></VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold text-success">{{ stats.fullySubmitted }}</h3>
            <span class="text-caption text-medium-emphasis">ส่งครบ 100%</span>
          </div>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard border elevation="0" class="pa-5 d-flex align-center gap-4" style="border-radius: 16px;">
          <VAvatar color="warning" variant="tonal" rounded="lg"><VIcon icon="tabler-trending-up" /></VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold text-warning">{{ stats.avgPct }}%</h3>
            <span class="text-caption text-medium-emphasis">เฉลี่ยทีม</span>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <VRow class="mb-6">
      <VCol cols="12" md="5">
        <VCard border elevation="0" class="pa-6 h-100" style="border-radius: 16px;">
          <h3 class="text-subtitle-1 font-weight-bold mb-6 text-center">สัดส่วนพนักงานที่ส่งงานวันนี้</h3>
          <div v-if="filteredSummaries.length === 0" class="d-flex justify-center align-center text-medium-emphasis h-100" style="min-height: 250px;">
            ไม่มีข้อมูลสำหรับแสดงผล
          </div>
          <VueApexCharts v-else type="donut" :options="chartOptions" :series="chartSeries" height="280" />
        </VCard>
      </VCol>

      <VCol cols="12" md="7">
        <VCard border elevation="0" class="h-100" style="border-radius: 16px;">
          <VDataTable
            :headers="[
              { title: 'พนักงาน', key: 'name' },
              { title: 'งานวันนี้', key: 'total', align: 'center' },
              { title: 'ส่งแล้ว', key: 'submitted', align: 'center' },
              { title: '% สำเร็จ', key: 'pct', align: 'center', width: '200px' },
              { title: 'จัดการ', key: 'actions', align: 'center', sortable: false }
            ]"
            :items="filteredSummaries"
            class="text-no-wrap"
          >
            <template #item.name="{ item }">
              <div class="d-flex align-center gap-3">
                <VAvatar size="32" color="primary" class="font-weight-bold text-white">
                  {{ item.employee?.name ? item.employee.name.charAt(0).toUpperCase() : '?' }}
                </VAvatar>
                <div>
                  <p class="text-subtitle-2 mb-0">{{ item.employee?.name || 'ไม่ระบุชื่อ' }}</p>
                  <p class="text-caption text-medium-emphasis mb-0">{{ item.employee?.store }}</p>
                </div>
              </div>
            </template>
            <template #item.submitted="{ item }">
              <span class="text-success font-weight-bold">{{ item.submitted }}</span>
            </template>
            <template #item.pct="{ item }">
              <div class="d-flex align-center gap-3 w-100" style="min-width: 140px;">
                <div class="flex-grow-1">
                  <VProgressLinear 
                    :model-value="item.pct" 
                    height="8" 
                    rounded 
                    :color="item.pct >= 80 ? 'success' : item.pct >= 50 ? 'warning' : 'error'" 
                  />
                </div>
                <span class="text-caption font-weight-bold" style="width: 35px; text-align: right;">{{ item.pct }}%</span>
              </div>
            </template>
            <template #item.actions="{ item }">
              <VBtn size="small" variant="tonal" color="primary" @click="openDetail(item)">ดูรายการ</VBtn>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>

    <VDialog v-model="isModalVisible" max-width="550" scrollable>
      <VCard v-if="selectedEmployee">
        <VToolbar style="background: rgb(11, 20, 100);" class="px-2">
          <VToolbarTitle class="text-white">{{ selectedEmployee.employee.name }}</VToolbarTitle>
          <VBtn icon="tabler-x" color="white" @click="isModalVisible = false" />
        </VToolbar>
        
        <VCardText class="pa-6">
          <VRow class="text-center mb-4 border-bottom pb-4">
            <VCol cols="4">
              <h4 class="text-h6 text-primary">{{ selectedEmployee.total }}</h4>
              <p class="text-caption">งานทั้งหมด</p>
            </VCol>
            <VCol cols="4">
              <h4 class="text-h6 text-success">{{ selectedEmployee.submitted }}</h4>
              <p class="text-caption">ส่งแล้ว</p>
            </VCol>
            <VCol cols="4">
              <h4 class="text-h6 text-warning">{{ selectedEmployee.pending }}</h4>
              <p class="text-caption">รอส่ง</p>
            </VCol>
          </VRow>

          <h4 class="text-subtitle-2 mb-3 text-uppercase">รายการรายงานวันนี้</h4>
          <div v-if="selectedEmployeeTasks.length === 0" class="text-center py-6 text-medium-emphasis">
            ไม่มีรายการงานของวันนี้
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <VCard 
              v-for="taskItem in selectedEmployeeTasks" 
              :key="taskItem.task.id" 
              border elevation="0" class="pa-3" 
              :style="{ 
                backgroundColor: taskItem.status.status === 'submitted' ? '#F0FDF4' : '#FFF9E6',
                borderColor: taskItem.status.status === 'submitted' ? '#BBF7D0' : '#FDE68A'
              }"
            >
              <div class="d-flex align-start gap-2">
                <VChip 
                  :color="PRIORITY_COLORS[taskItem.task.priority] || '#3B82F6'" 
                  size="x-small" 
                  label 
                  class="mt-1 font-weight-bold"
                >
                  {{ PRIORITY_LABELS[taskItem.task.priority] || taskItem.task.priority }}
                </VChip>

                <div class="flex-grow-1 overflow-hidden">
                  <p class="text-subtitle-2 mb-0 font-weight-bold text-truncate" style="color: #1F2937;">
                    {{ taskItem.task.name }}
                  </p>
                  <p class="text-caption mb-0" style="color: #4B5563;">
                    {{ taskItem.task.reportType }} {{ taskItem.status.submittedAt ? `- ส่งเมื่อ ${new Date(taskItem.status.submittedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}` : '' }}
                  </p>
                </div>

                <VIcon 
                  :icon="taskItem.status.status === 'submitted' ? 'tabler-circle-check' : 'tabler-clock'" 
                  :color="taskItem.status.status === 'submitted' ? '#22C55E' : '#F5A623'" 
                />
              </div>
            </VCard>
          </div>
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4">
          <VBtn block color="warning" variant="elevated" @click="isModalVisible = false">ปิดหน้าต่าง</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>
