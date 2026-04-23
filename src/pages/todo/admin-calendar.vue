<script setup>
import { computed, ref } from 'vue'

// --- Mock Data & Constants ---
const BRANDS = ['Brand A', 'Brand B', 'Brand C']
const REPORT_TYPES = ['OOS & Stock', 'Offtake', '12 Weeks', 'Price & Promotion', 'Compliance']
const PRIORITY_LABELS = { 1: 'สูง', 2: 'กลาง', 3: 'น้อย' }
const PRIORITY_COLORS = { 1: '#EF4444', 2: '#F5A623', 3: '#3B82F6' }
const BRAND_STORES = {
  'Brand A': ['Store A1', 'Store A2'],
  'Brand B': ['Store B1', 'Store B2', 'Store B3'],
  'Brand C': ['Store C1']
}

const tasks = ref([
  { id: '1', name: 'เช็คสต็อกประจำวัน', reportType: 'OOS & Stock', scheduledDate: '2026-04-23', dueDate: '2026-04-23', priority: 1, targetBrands: ['Brand A'], targetStores: ['Store A1'], status: 'pending', description: 'ตรวจสอบหน้าชั้นวาง' },
  { id: '2', name: 'รายงาน Offtake ประจำสัปดาห์', reportType: 'Offtake', scheduledDate: '2026-04-24', dueDate: '2026-04-26', priority: 2, targetBrands: ['Brand B'], targetStores: ['Store B1'], status: 'submitted', description: '' },
])

// --- State Management ---
const filterBrand = ref('all')
const isAddModalVisible = ref(false)
const selectedDate = ref(null)
const viewDate = ref(new Date(2026, 3, 1))

const form = ref({
  name: '',
  reportType: REPORT_TYPES[0],
  priority: 1,
  targetBrands: [],
  targetStores: [],
  description: '',
  startDate: '',
  endDate: '',
})

// --- Calendar Logic ---
const DAYS_TH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
const MONTHS_TH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

const monthName = computed(() => `${MONTHS_TH[viewDate.value.getMonth()]} ${viewDate.value.getFullYear() + 543}`)

const calendarCells = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
})

const getTasksForDate = (day) => {
  if (!day) return []
  const dateStr = `2026-04-${String(day).padStart(2, '0')}`
  return tasks.value.filter(t => {
    const inRange = dateStr >= t.scheduledDate && dateStr <= t.dueDate
    return inRange && (filterBrand.value === 'all' || t.targetBrands.includes(filterBrand.value))
  })
}

// --- Form Logic ---
const availableStores = computed(() => form.value.targetBrands.flatMap(b => BRAND_STORES[b] || []))

const toggleBrand = (brand) => {
  const idx = form.value.targetBrands.indexOf(brand)
  idx > -1 ? form.value.targetBrands.splice(idx, 1) : form.value.targetBrands.push(brand)
  form.value.targetStores = form.value.targetStores.filter(s => availableStores.value.includes(s))
}

const toggleStore = (store) => {
  const idx = form.value.targetStores.indexOf(store)
  idx > -1 ? form.value.targetStores.splice(idx, 1) : form.value.targetStores.push(store)
}

const openAddModal = (date = '') => {
  form.value = {
    name: '', reportType: REPORT_TYPES[0], priority: 1,
    targetBrands: [], targetStores: [], description: '',
    startDate: date || '2026-04-23', endDate: date || '2026-04-23',
  }
  isAddModalVisible.value = true
}

const saveTask = () => {
  tasks.value.push({ ...form.value, id: String(Date.now()), status: 'pending' })
  isAddModalVisible.value = false
}
</script>

<template>
  <VCard class="pa-6">
    <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold mb-1">จัดการงาน (Admin)</h2>
        <p class="text-caption text-medium-emphasis mb-0">กำหนดตารางงานและความสำคัญสำหรับทีม</p>
      </div>
      <div class="d-flex align-center gap-3">
        <VSelect v-model="filterBrand" :items="['all', ...BRANDS]" density="compact" label="ทุก Brand/ร้านค้า" hide-details style="width: 220px;" />
        <VBtn color="warning" prepend-icon="tabler-plus" @click="openAddModal()">เพิ่มงาน</VBtn>
      </div>
    </div>

    <VRow>
      <VCol cols="12" xl="8">
        <VCard border elevation="0" class="pa-4" style="border-radius: 16px;">
          <div class="d-flex align-center justify-space-between mb-5 px-2">
            <VBtn icon="tabler-chevron-left" variant="tonal" size="small" @click="viewDate = new Date(2026, 2, 1)" />
            <h3 class="text-subtitle-1 font-weight-bold">{{ monthName }}</h3>
            <VBtn icon="tabler-chevron-right" variant="tonal" size="small" @click="viewDate = new Date(2026, 4, 1)" />
          </div>

          <div class="calendar-grid">
            <div v-for="(d, i) in DAYS_TH" :key="d" class="text-center text-xs font-weight-bold py-2" 
                 :style="{ color: i === 0 ? '#EF4444' : i === 6 ? '#3B82F6' : '#6B7280' }">{{ d }}</div>
            
            <div v-for="(day, idx) in calendarCells" :key="idx" 
                 class="calendar-day-cell border pa-1" 
                 :class="{ 'bg-light-warning': selectedDate === `2026-04-${String(day).padStart(2, '0')}` }"
                 @click="day && (selectedDate = `2026-04-${String(day).padStart(2, '0')}`)">
              <template v-if="day">
                <div class="day-number" :class="{ 'is-today': `2026-04-${String(day).padStart(2, '0')}` === '2026-04-23' }">{{ day }}</div>
                <div class="task-dots-container mt-1">
                  <div v-for="task in getTasksForDate(day).slice(0, 2)" :key="task.id" 
                       class="task-badge" :style="{ background: PRIORITY_COLORS[task.priority] }">
                    {{ PRIORITY_LABELS[task.priority] }} {{ task.name }}
                  </div>
                  <div v-if="getTasksForDate(day).length > 2" class="text-caption text-disabled" style="font-size: 10px;">+{{ getTasksForDate(day).length - 2 }} อื่นๆ</div>
                </div>
              </template>
            </div>
          </div>
        </VCard>
      </VCol>

      <VCol cols="12" xl="4">
        <VCard border elevation="0" class="pa-4 h-100" style="border-radius: 16px;">
          <div v-if="selectedDate">
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="d-flex align-center gap-2">
                <VIcon icon="tabler-calendar" color="primary" size="20" />
                <span class="font-weight-bold">{{ selectedDate }}</span>
              </div>
              <VBtn size="x-small" color="warning" icon="tabler-plus" @click="openAddModal(selectedDate)" />
            </div>
            <div class="d-flex flex-column gap-3">
              <VCard v-for="task in getTasksForDate(selectedDate.split('-')[2])" :key="task.id" border elevation="0" class="pa-3 bg-light-warning">
                <div class="d-flex align-center gap-2 mb-1">
                  <VChip :color="PRIORITY_COLORS[task.priority]" size="x-small" label class="text-white font-weight-bold">
                    {{ PRIORITY_LABELS[task.priority] }}
                  </VChip>
                  <span class="text-caption text-success font-weight-bold" v-if="task.status === 'submitted'">ส่งแล้ว</span>
                </div>
                <div class="text-subtitle-2 font-weight-bold">{{ task.name }}</div>
                <div class="text-caption">{{ task.reportType }}</div>
              </VCard>
            </div>
          </div>
          <div v-else class="text-center py-12 text-disabled">
            <VIcon icon="tabler-calendar-event" size="48" class="mb-2 opacity-25" />
            <p>เลือกวันที่เพื่อดูรายการงาน</p>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <VCard border elevation="0" class="mt-6" style="border-radius: 16px;">
      <VCardTitle class="pa-4 font-weight-bold text-subtitle-1">รายการงานทั้งหมด (เรียงตาม Priority)</VCardTitle>
      <VDataTable :items="tasks" :headers="[
        { title: 'Priority', key: 'priority' },
        { title: 'ชื่องาน', key: 'name' },
        { title: 'ประเภท', key: 'reportType' },
        { title: 'ช่วงวันที่', key: 'scheduledDate' },
        { title: 'สถานะ', key: 'status' }
      ]" class="text-no-wrap">
        <template #item.priority="{ item }">
          <VChip :color="PRIORITY_COLORS[item.priority]" size="small" class="text-white font-weight-bold" label>
            {{ PRIORITY_LABELS[item.priority] }}
          </VChip>
        </template>
        <template #item.status="{ item }">
          <VChip :color="item.status === 'submitted' ? 'success' : 'warning'" variant="tonal" size="small">
            {{ item.status === 'submitted' ? 'ส่งแล้ว' : 'รอดำเนินการ' }}
          </VChip>
        </template>
      </VDataTable>
    </VCard>

    <VDialog v-model="isAddModalVisible" max-width="650" scrollable>
      <VCard>
        <VToolbar color="primary" class="px-2">
          <VToolbarTitle class="text-white">เพิ่มงานใหม่</VToolbarTitle>
          <VBtn icon="tabler-x" color="white" @click="isAddModalVisible = false" />
        </VToolbar>
        <VCardText class="pa-6">
          <VRow>
            <VCol cols="12" sm="6"><AppTextField v-model="form.startDate" label="วันเริ่มต้น" type="date" /></VCol>
            <VCol cols="12" sm="6"><AppTextField v-model="form.endDate" label="วันสิ้นสุด" type="date" /></VCol>
            <VCol cols="12"><AppTextField v-model="form.name" label="ชื่องาน / รายงาน" placeholder="เช่น รายงานยอดขายประจำวัน" /></VCol>
            <VCol cols="12" sm="6"><AppSelect v-model="form.reportType" :items="REPORT_TYPES" label="ประเภทรายงาน" /></VCol>
            <VCol cols="12" sm="6">
              <p class="text-caption mb-1">ลำดับความสำคัญ</p>
              <VBtnToggle v-model="form.priority" mandatory color="primary" variant="outlined" class="w-100">
                <VBtn :value="1" class="flex-grow-1">สูง</VBtn>
                <VBtn :value="2" class="flex-grow-1">กลาง</VBtn>
                <VBtn :value="3" class="flex-grow-1">น้อย</VBtn>
              </VBtnToggle>
            </VCol>
            <VCol cols="12">
              <p class="text-subtitle-2 mb-2">กลุ่มเป้าหมาย (Brand)</p>
              <div class="d-flex flex-wrap gap-2">
                <VChip v-for="b in BRANDS" :key="b" filter @click="toggleBrand(b)" :color="form.targetBrands.includes(b) ? 'warning' : 'default'">{{ b }}</VChip>
              </div>
            </VCol>
            <VCol cols="12" v-if="availableStores.length > 0">
              <div class="pa-3 border rounded-lg bg-light-primary">
                <p class="text-subtitle-2 mb-2">สาขา</p>
                <div class="d-flex flex-wrap gap-2">
                  <VChip v-for="s in availableStores" :key="s" size="small" @click="toggleStore(s)" :color="form.targetStores.includes(s) ? 'primary' : 'default'">{{ s }}</VChip>
                </div>
              </div>
            </VCol>
            <VCol cols="12"><AppTextarea v-model="form.description" label="คำอธิบาย (ไม่บังคับ)" rows="2" /></VCol>
          </VRow>
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="tonal" color="secondary" @click="isAddModalVisible = false">ยกเลิก</VBtn>
          <VBtn color="warning" @click="saveTask">บันทึกงาน</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style scoped>
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); background-color: #eee; gap: 1px; border-radius: 8px; overflow: hidden; }
.calendar-day-cell { background: #fff; min-height: 110px; cursor: pointer; transition: 0.2s; }
.calendar-day-cell:hover { background: #fff9e6; }
.day-number { font-size: 12px; font-weight: 600; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
.is-today { background: #0B1464; color: white; border-radius: 50%; }
.task-badge { font-size: 9px; color: white; padding: 2px 4px; border-radius: 4px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bg-light-warning { background-color: #fff9e6 !important; }
.bg-light-primary { background-color: #f0f4ff !important; }
</style>
