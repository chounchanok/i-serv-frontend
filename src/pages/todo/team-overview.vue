<script setup>
import { computed, ref } from 'vue'

// --- Mock Data & Constants ---
const employees = ref([
  { id: 'e1', name: 'Champ Dev', store: 'Store A', position: 'Senior Full-stack' },
  { id: 'e2', name: 'Pum SEO', store: 'Store B', position: 'SEO Specialist' },
  { id: 'e3', name: 'Pon Model', store: 'Store A', position: 'Photographer' },
])

const PRIORITY_LABELS = { 1: 'สูง', 2: 'กลาง', 3: 'น้อย' }
const PRIORITY_COLORS = { 1: '#EF4444', 2: '#F5A623', 3: '#3B82F6' }

// จำลองฟังก์ชันดึงงาน (ในอนาคตเปลี่ยนเป็น AppStore หรือ API)
const getEmployeeTasks = (empId) => {
  if (empId === 'e1') return [
    { task: { id: 't1', name: 'Nginx Config', reportType: 'Server', brand: 'IT', priority: 1 }, status: { status: 'submitted', submittedAt: '10:30' } },
    { task: { id: 't2', name: 'Laravel Migration', reportType: 'DB', brand: 'Backend', priority: 2 }, status: { status: 'pending' } }
  ]
  return []
}

// --- State Management ---
const filterStore = ref('all')
const selectedEmployee = ref(null)
const isModalVisible = ref(false)

// --- Logic ---
const summaries = computed(() => {
  return employees.value.map(emp => {
    const tasks = getEmployeeTasks(emp.id)
    const submitted = tasks.filter(t => t.status.status === 'submitted').length
    const total = tasks.length
    return {
      employee: emp,
      total,
      submitted,
      pending: total - submitted,
      pct: total > 0 ? Math.round((submitted / total) * 100) : 0,
    }
  })
})

const stores = computed(() => ['all', ...new Set(employees.value.map(e => e.store))])

const filteredSummaries = computed(() => {
  return filterStore.value === 'all' 
    ? summaries.value 
    : summaries.value.filter(s => s.employee.store === filterStore.value)
})

const stats = computed(() => ({
  total: filteredSummaries.value.length,
  fullySubmitted: filteredSummaries.value.filter(s => s.pct === 100).length,
  avgPct: filteredSummaries.value.length > 0 
    ? Math.round(filteredSummaries.value.reduce((a, s) => a + s.pct, 0) / filteredSummaries.value.length) 
    : 0
}))

const todayStr = new Date().toLocaleDateString('th-TH', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

// --- Chart Configuration (ApexCharts) ---
const chartSeries = computed(() => [{
  name: '% สำเร็จ',
  data: filteredSummaries.value.map(s => s.pct)
}])

const chartOptions = computed(() => ({
  chart: { type: 'bar', height: 250, toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 6, columnWidth: '35%', distributed: true } },
  dataLabels: { enabled: false },
  colors: filteredSummaries.value.map(s => s.pct >= 80 ? '#22C55E' : s.pct >= 50 ? '#F5A623' : '#EF4444'),
  xaxis: { categories: filteredSummaries.value.map(s => s.employee.name.split(' ')[0]) },
  yaxis: { max: 100, labels: { formatter: val => `${val}%` } },
  tooltip: { y: { formatter: val => `${val}%` } }
}))

// --- Export CSV ---
const handleExport = () => {
  const headers = ['ชื่อพนักงาน', 'ร้านค้า', 'งานทั้งหมด', 'ส่งแล้ว', 'รอส่ง', '% สำเร็จ']
  const rows = filteredSummaries.value.map(s => [
    s.employee.name, s.employee.store, s.total, s.submitted, s.pending, `${s.pct}%`
  ])
  
  const csvContent = "\ufeff" + [headers, ...rows].map(e => e.join(",")).join("\n")
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `team-report-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

const openDetail = (summary) => {
  selectedEmployee.value = summary
  isModalVisible.value = true
}
</script>

<template>
  <VCard class="pa-6">
    <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold mb-1">ภาพรวมทีม (Supervisor)</h2>
        <p class="text-caption text-medium-emphasis mb-0">{{ todayStr }}</p>
      </div>
      <div class="d-flex align-center gap-3">
        <VSelect
          v-model="filterStore"
          :items="stores"
          density="compact"
          label="กรองตามร้านค้า"
          hide-details
          style="width: 200px;"
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

    <VCard border elevation="0" class="pa-6 mb-6" style="border-radius: 16px;">
      <h3 class="text-subtitle-1 font-weight-bold mb-4">% การส่งงานของแต่ละพนักงาน</h3>
      <VueApexCharts :options="chartOptions" :series="chartSeries" height="250" />
    </VCard>

    <VCard border elevation="0" style="border-radius: 16px;">
      <VDataTable
        :headers="[
          { title: 'พนักงาน', key: 'name' },
          { title: 'ร้านค้า', key: 'store' },
          { title: 'งานวันนี้', key: 'total', align: 'center' },
          { title: 'ส่งแล้ว', key: 'submitted', align: 'center' },
          { title: '% สำเร็จ', key: 'pct', align: 'center' },
          { title: 'จัดการ', key: 'actions', align: 'center', sortable: false }
        ]"
        :items="filteredSummaries"
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-3">
            <VAvatar size="32" color="primary" class="font-weight-bold text-white">{{ item.employee.name[0] }}</VAvatar>
            <span class="text-subtitle-2">{{ item.employee.name }}</span>
          </div>
        </template>
        <template #item.store="{ item }">
          <span class="text-body-2">{{ item.employee.store }}</span>
        </template>
        <template #item.submitted="{ item }">
          <span class="text-success font-weight-bold">{{ item.submitted }}</span>
        </template>
        <template #item.pct="{ item }">
          <div class="d-flex align-center gap-2" style="min-width: 120px;">
            <VProgressLinear :model-value="item.pct" height="8" rounded :color="item.pct >= 80 ? 'success' : item.pct >= 50 ? 'warning' : 'error'" />
            <span class="text-caption font-weight-bold">{{ item.pct }}%</span>
          </div>
        </template>
        <template #item.actions="{ item }">
          <VBtn size="small" variant="tonal" color="primary" @click="openDetail(item)">ดูรายการ</VBtn>
        </template>
      </VDataTable>
    </VCard>

    <VDialog v-model="isModalVisible" max-width="500">
      <VCard v-if="selectedEmployee">
        <VToolbar color="primary">
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
          <div class="d-flex flex-column gap-3">
            <VCard v-for="taskItem in getEmployeeTasks(selectedEmployee.employee.id)" :key="taskItem.task.id" border elevation="0" class="pa-3" 
                   :style="{ backgroundColor: taskItem.status.status === 'submitted' ? '#F0FDF4' : '#FFF9E6' }">
              <div class="d-flex align-start gap-2">
                <VChip :color="PRIORITY_COLORS[taskItem.task.priority]" size="x-small" label class="text-white">P{{ taskItem.task.priority }}</VChip>
                <div class="flex-grow-1">
                  <p class="text-subtitle-2 mb-0 font-weight-bold">{{ taskItem.task.name }}</p>
                  <p class="text-caption mb-0">{{ taskItem.task.reportType }} • {{ taskItem.task.brand }}</p>
                </div>
                <VIcon :icon="taskItem.status.status === 'submitted' ? 'tabler-circle-check' : 'tabler-clock'" 
                       :color="taskItem.status.status === 'submitted' ? 'success' : 'warning'" />
              </div>
            </VCard>
          </div>
        </VCardText>
        <VCardActions class="pa-4">
          <VBtn block color="warning" variant="elevated" @click="isModalVisible = false">ปิดหน้าต่าง</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>
