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

const getTodayStr = () => {
  const d = new Date()
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().split('T')[0]
}
const todayStr = getTodayStr()

const fetchTeamSummary = async () => {
  try {
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : {}

    const params = {
      userId: userData.id,
      position_name: userData.position_name,
      group_customer_id: userData.group_customer_id
    }

    if (filterStore.value !== 'all') {
      params.account_name = filterStore.value
    }

    const response = await $api('/admin/team-summary', { params })
    rawSummaries.value = response.summaries || []
  } catch (error) {
    console.error('Error fetching team summary:', error)
  }
}

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

const openDetail = async (summary) => {
  selectedEmployee.value = summary
  try {
    const tasks = await $api(`/admin/employee-tasks/${summary.employee.id}`)
    
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

const stores = computed(() => filterAccounts.value.length > 0 ? filterAccounts.value : ['all'])

const filteredSummaries = computed(() => rawSummaries.value)

// 🌟 อัปเดต Stats เพื่อนำ "พนักงานที่ลา" มาคำนวณแยก
const stats = computed(() => {
  const total = filteredSummaries.value.length
  const fullySubmitted = filteredSummaries.value.filter(s => s.pct === 100 && !s.isLeaved).length
  const onLeave = filteredSummaries.value.filter(s => s.isLeaved).length
  const activeTotal = total - onLeave // หักคนที่ลาออกจากการคิด % เฉลี่ยทีม
  const avgPct = activeTotal > 0 ? Math.round(filteredSummaries.value.filter(s => !s.isLeaved).reduce((a, s) => a + s.pct, 0) / activeTotal) : 0
  
  return { total, fullySubmitted, onLeave, avgPct }
})

const displayDateStr = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

// 🌟 เพิ่ม "ลา" ลงใน Donut Chart
const chartSeries = computed(() => {
  const fullyDone = stats.value.fullySubmitted
  const onLeave = stats.value.onLeave
  const notDone = stats.value.total - fullyDone - onLeave
  return [fullyDone, notDone, onLeave]
})

const chartOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: ['ส่งครบแล้ว (100%)', 'ยังไม่ครบ / ไม่ส่ง', 'ลา'],
  colors: ['#22C55E', '#F5A623', '#EF4444'], // สีเขียว, ส้ม, แดง
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

// 🌟 อัปเดต Export ให้มีข้อมูลการลา
const handleExport = () => {
  const headers = ['ชื่อพนักงาน', 'ร้านค้า/แอคเคาน์', 'สถานะ', 'งานทั้งหมด', 'ส่งแล้ว', 'รอส่ง', '% สำเร็จ', 'รายงานที่ทำแล้ว', 'รายงานที่ยังไม่ได้ทำ']
  
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""'
    const stringValue = String(value)
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  const rows = filteredSummaries.value.map(s => {
    // กำหนดสถานะ
    let statusText = 'ทำงาน'
    if (s.isLeaved) statusText = s.leaveReason === 'sick' ? 'ลา' : 'วันหยุด'

    return [
      escapeCSV(s.employee.name),
      escapeCSV(s.employee.store),
      statusText, // คอลัมน์ใหม่
      s.total,
      s.submitted,
      s.pending,
      s.isLeaved ? 'N/A' : `${s.pct}%`, // ถ้าลาไม่ต้องแสดง %
      escapeCSV(s.submittedList),
      escapeCSV(s.pendingList)
    ]
  })
  
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

    <!-- 🌟 แก้ไขเป็น 4 Columns เพื่อแสดงคนที่ลา -->
    <VRow class="mb-6">
      <VCol cols="12" md="3">
        <VCard border elevation="0" class="pa-5 d-flex align-center gap-4" style="border-radius: 16px;">
          <VAvatar color="primary" variant="tonal" rounded="lg"><VIcon icon="tabler-users" /></VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold">{{ stats.total }}</h3>
            <span class="text-caption text-medium-emphasis">ทั้งหมด</span>
          </div>
        </VCard>
      </VCol>
      <VCol cols="12" md="3">
        <VCard border elevation="0" class="pa-5 d-flex align-center gap-4" style="border-radius: 16px;">
          <VAvatar color="success" variant="tonal" rounded="lg"><VIcon icon="tabler-circle-check" /></VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold text-success">{{ stats.fullySubmitted }}</h3>
            <span class="text-caption text-medium-emphasis">ส่งครบ 100%</span>
          </div>
        </VCard>
      </VCol>
      <VCol cols="12" md="3">
        <VCard border elevation="0" class="pa-5 d-flex align-center gap-4" style="border-radius: 16px;">
          <VAvatar color="error" variant="tonal" rounded="lg"><VIcon icon="tabler-user-x" /></VAvatar>
          <div>
            <h3 class="text-h4 font-weight-bold text-error">{{ stats.onLeave }}</h3>
            <span class="text-caption text-medium-emphasis">หยุดวันนี้</span>
          </div>
        </VCard>
      </VCol>
      <VCol cols="12" md="3">
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
              { title: 'สถานะ', key: 'status', align: 'center' },
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
                <VAvatar size="32" :color="item.isLeaved ? 'error' : 'primary'" class="font-weight-bold text-white">
                  {{ item.employee?.name ? item.employee.name.charAt(0).toUpperCase() : '?' }}
                </VAvatar>
                <div>
                  <p class="text-subtitle-2 mb-0">{{ item.employee?.name || 'ไม่ระบุชื่อ' }}</p>
                  <p class="text-caption text-medium-emphasis mb-0">{{ item.employee?.store }}</p>
                </div>
              </div>
            </template>
            <!-- 🌟 แสดงสถานะการทำงาน/ลา -->
            <template #item.status="{ item }">
              <VChip v-if="item.isLeaved" color="error" size="small" variant="tonal" class="font-weight-bold">
                {{ item.leaveReason === 'sick' ? 'ลา' : 'วันหยุด' }}
              </VChip>
              <VChip v-else color="success" size="small" variant="tonal">ทำงาน</VChip>
            </template>
            <template #item.submitted="{ item }">
              <span class="text-success font-weight-bold" :class="{'opacity-50': item.isLeaved}">{{ item.submitted }}</span>
            </template>
            <template #item.pct="{ item }">
              <div v-if="item.isLeaved" class="text-medium-emphasis text-caption text-center">N/A</div>
              <div v-else class="d-flex align-center gap-3 w-100" style="min-width: 140px;">
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

    <!-- Modal (โค้ดเดิม) -->
    <VDialog v-model="isModalVisible" max-width="550" scrollable>
      <VCard v-if="selectedEmployee">
        <VToolbar :color="selectedEmployee.isLeaved ? 'error' : 'rgb(11, 20, 100)'" class="px-2">
          <VToolbarTitle class="text-white">{{ selectedEmployee.employee.name }}</VToolbarTitle>
          <VBtn icon="tabler-x" color="white" @click="isModalVisible = false" />
        </VToolbar>
        
        <VCardText class="pa-6">
          <div v-if="selectedEmployee.isLeaved" class="pa-4 mb-4 text-center" style="background: #FEF2F2; border-radius: 8px;">
            <VIcon icon="tabler-calendar-off" color="error" size="32" class="mb-2" />
            <p class="text-error font-weight-bold mb-0">พนักงานแจ้ง{{ selectedEmployee.leaveReason === 'sick' ? 'ลา' : 'วันหยุด' }}สำหรับวันนี้</p>
          </div>

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
                backgroundColor: taskItem.status.status === 'submitted' ? '#F0FDF4' : (taskItem.status.status === 'leaved' ? '#FEF2F2' : '#FFF9E6'),
                borderColor: taskItem.status.status === 'submitted' ? '#BBF7D0' : (taskItem.status.status === 'leaved' ? '#FECACA' : '#FDE68A')
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
                    {{ taskItem.task.reportType }} 
                    <span v-if="taskItem.status.status === 'leaved'" class="text-error font-weight-bold"> (ลา)</span>
                    {{ taskItem.status.submittedAt ? `- ส่งเมื่อ ${new Date(taskItem.status.submittedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}` : '' }}
                  </p>
                </div>

                <VIcon 
                  :icon="taskItem.status.status === 'submitted' ? 'tabler-circle-check' : (taskItem.status.status === 'leaved' ? 'tabler-calendar-off' : 'tabler-clock')" 
                  :color="taskItem.status.status === 'submitted' ? '#22C55E' : (taskItem.status.status === 'leaved' ? '#EF4444' : '#F5A623')" 
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
