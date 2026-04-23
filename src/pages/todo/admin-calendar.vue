<script setup>
import { computed, ref, onMounted } from 'vue'
import { $api } from '@/utils/api'

// --- Constants ---
const REPORT_TYPES = ['OOS', 'Stock', 'Offtake', '12 Weeks', 'Price', 'Promotion', 'Compliance', 'Extra Compliance']
const PRIORITY_LABELS = { 1: 'สูง', 2: 'กลาง', 3: 'น้อย', 'H': 'สูง', 'M': 'กลาง', 'L': 'น้อย' }
const PRIORITY_COLORS = { 1: '#EF4444', 2: '#F5A623', 3: '#3B82F6', 'H': '#EF4444', 'M': '#F5A623', 'L': '#3B82F6' }

// --- State Management ---
const GROUPS = ref([])    // รับ GroupCustomer จาก API
const ACCOUNTS = ref([])  // รับ Account จาก API
const tasks = ref([])

const filterGroup = ref('all') // เปลี่ยนตัวกรองมุมขวาบนให้เป็น Group
const isAddModalVisible = ref(false)
const selectedDate = ref(null)
const viewDate = ref(new Date()) 

const form = ref({
  name: '',
  reportType: REPORT_TYPES[0],
  priority: 1,
  targetGroups: [],   // เก็บ ID ของ Group ที่เลือก
  targetAccounts: [], // เก็บ ID ของ Account ที่เลือก
  description: '',
  startDate: '',
  endDate: '',
})

const todayStr = new Date().toISOString().split('T')[0]

// --- API Calls ---

const fetchMasterData = async () => {
  try {
    // ดึงค่าสิทธิ์ผู้ใช้จาก localStorage เพื่อส่งไป Query ใน API (เปลี่ยน Key ตามที่คุณใช้จริง)
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : {}
    const userPayload = { 
      position_name: userData.position_name || 'SuperAdmin', 
      user_id: userData.id 
    }

    // 1. โหลด GroupCustomer
    const groupsRes = await $api('/get_all_group_customer_user', { 
      method: 'POST', body: userPayload 
    })
    if (groupsRes && groupsRes.data) {
      GROUPS.value = groupsRes.data // [{id: 1, name: 'Group A'}, ...]
    }

    // 2. โหลด Account
    const accRes = await $api('/get_all_account', { 
      method: 'POST', body: userPayload 
    })
    if (accRes && accRes.data) {
      ACCOUNTS.value = accRes.data // [{id: 1, name: 'Account A', group_customer_id: 1}, ...]
    }

  } catch (error) {
    console.error('Error fetching master data:', error)
  }
}

const fetchTasks = async () => {
  try {
    const response = await $api('/admin/tasks')
    const responseData = Array.isArray(response) ? response : (response?.data || [])

    tasks.value = responseData.map(t => ({
      id: t.id,
      name: t.name,
      reportType: t.report_type,
      scheduledDate: t.start_date ? t.start_date.split('T')[0] : '',
      dueDate: t.end_date ? t.end_date.split('T')[0] : '',
      priority: t.priority,
      targetGroups: t.target_groups || [], 
      targetAccounts: t.target_accounts || [],
      status: 'assigned', 
      description: t.description
    }))
  } catch (error) {
    console.error('Error fetching admin tasks:', error)
  }
}

const saveTask = async () => {
  try {
    await $api('/admin/tasks', {
      method: 'POST',
      body: {
        name: form.value.name,
        reportType: form.value.reportType,
        priority: form.value.priority,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        description: form.value.description,
        targetGroups: form.value.targetGroups,
        targetAccounts: form.value.targetAccounts
      }
    })

    isAddModalVisible.value = false
    fetchTasks()
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

onMounted(() => {
  fetchMasterData()
  fetchTasks()
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
  const year = viewDate.value.getFullYear()
  const month = String(viewDate.value.getMonth() + 1).padStart(2, '0')
  const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`
  
  return tasks.value.filter(t => {
    const inRange = dateStr >= t.scheduledDate && dateStr <= t.dueDate
    const matchGroup = filterGroup.value === 'all' || (t.targetGroups && t.targetGroups.includes(filterGroup.value))
    return inRange && matchGroup
  })
}

// --- Form Group / Account Mapping Logic ---

// คำนวณรายชื่อ Account ที่โชว์ เฉพาะใน Group ที่ถูกเลือกไว้ (ถ้าไม่ได้เลือก Group เลยให้แสดงทั้งหมด)
const availableAccounts = computed(() => {
  if (form.value.targetGroups.length === 0) return ACCOUNTS.value
  return ACCOUNTS.value.filter(a => form.value.targetGroups.includes(a.group_customer_id))
})

const toggleGroup = (groupId) => {
  const idx = form.value.targetGroups.indexOf(groupId)
  idx > -1 ? form.value.targetGroups.splice(idx, 1) : form.value.targetGroups.push(groupId)
  
  // รีเซ็ต Account ที่เผลอเลือกไว้ แต่ไม่ได้อยู่ใน Group แล้ว
  const validAccountIds = availableAccounts.value.map(a => a.id)
  form.value.targetAccounts = form.value.targetAccounts.filter(id => validAccountIds.includes(id))
}

const toggleAccount = (accountId) => {
  const idx = form.value.targetAccounts.indexOf(accountId)
  idx > -1 ? form.value.targetAccounts.splice(idx, 1) : form.value.targetAccounts.push(accountId)
}

const openAddModal = (date = '') => {
  const defaultDate = date || todayStr
  form.value = {
    name: '', reportType: REPORT_TYPES[0], priority: 1,
    targetGroups: [], targetAccounts: [], description: '',
    startDate: defaultDate, endDate: defaultDate,
  }
  isAddModalVisible.value = false // สลับเพื่อเคลียร์ component ถ้าต้องการ
  setTimeout(() => { isAddModalVisible.value = true }, 50)
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
        <VSelect 
          v-model="filterGroup" 
          :items="[{ title: 'ทั้งหมด', value: 'all' }, ...GROUPS.map(g => ({ title: g.name, value: g.id }))]" 
          item-title="title"
          item-value="value"
          density="compact" 
          label="กรองตามกลุ่มลูกค้า" 
          hide-details 
          style="width: 220px;" 
        />
        <VBtn color="warning" prepend-icon="tabler-plus" @click="openAddModal()">เพิ่มงาน</VBtn>
      </div>
    </div>

    <VRow>
      <VCol cols="12" xl="8">
        <VCard border elevation="0" class="pa-4" style="border-radius: 16px;">
          <div class="d-flex align-center justify-space-between mb-5 px-2">
            <VBtn icon="tabler-chevron-left" variant="tonal" size="small" @click="viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)" />
            <h3 class="text-subtitle-1 font-weight-bold">{{ monthName }}</h3>
            <VBtn icon="tabler-chevron-right" variant="tonal" size="small" @click="viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)" />
          </div>

          <div class="calendar-grid">
            <div v-for="(d, i) in DAYS_TH" :key="d" class="text-center text-xs font-weight-bold py-2" 
                 :style="{ color: i === 0 ? '#EF4444' : i === 6 ? '#3B82F6' : '#6B7280' }">{{ d }}</div>
            
            <div v-for="(day, idx) in calendarCells" :key="idx" 
                 class="calendar-day-cell border pa-1" 
                 :class="{ 'bg-light-warning': selectedDate === `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` }"
                 @click="day && (selectedDate = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)">
              <template v-if="day">
                <div class="day-number" :class="{ 'is-today': `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` === todayStr }">{{ day }}</div>
                <div class="task-dots-container mt-1">
                  <div v-for="task in getTasksForDate(day).slice(0, 2)" :key="task.id" 
                       class="task-badge" :style="{ background: PRIORITY_COLORS[task.priority] || '#F5A623' }">
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
              <div v-if="getTasksForDate(selectedDate.split('-')[2]).length === 0" class="text-center py-4 text-medium-emphasis">
                ไม่มีงานสำหรับวันนี้
              </div>
              <VCard v-else v-for="task in getTasksForDate(selectedDate.split('-')[2])" :key="task.id" border elevation="0" class="pa-3 bg-light-warning">
                <div class="d-flex align-center gap-2 mb-1">
                  <VChip :color="PRIORITY_COLORS[task.priority] || 'warning'" size="x-small" label class="text-white font-weight-bold">
                    {{ PRIORITY_LABELS[task.priority] || task.priority }}
                  </VChip>
                </div>
                <div class="text-subtitle-2 font-weight-bold">{{ task.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ task.reportType }}</div>
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
      <VCardTitle class="pa-4 font-weight-bold text-subtitle-1">รายการงานทั้งหมด</VCardTitle>
      <VDataTable :items="tasks" :headers="[
        { title: 'Priority', key: 'priority' },
        { title: 'ชื่องาน', key: 'name' },
        { title: 'ประเภท', key: 'reportType' },
        { title: 'วันที่เริ่มต้น', key: 'scheduledDate' },
        { title: 'วันที่สิ้นสุด', key: 'dueDate' }
      ]" class="text-no-wrap">
        <template #item.priority="{ item }">
          <VChip :color="PRIORITY_COLORS[item.priority] || 'warning'" size="small" class="text-white font-weight-bold" label>
            {{ PRIORITY_LABELS[item.priority] || item.priority }}
          </VChip>
        </template>
        <template #item.scheduledDate="{ item }">
          {{ item.scheduledDate || 'ไม่ระบุ' }}
        </template>
        <template #item.dueDate="{ item }">
          {{ item.dueDate || 'ไม่ระบุ' }}
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
              <p class="text-subtitle-2 mb-2">กลุ่มลูกค้า (Group Customer)</p>
              <div v-if="GROUPS.length === 0" class="text-caption text-disabled">กำลังดึงข้อมูล...</div>
              <div v-else class="d-flex flex-wrap gap-2">
                <VChip 
                  v-for="g in GROUPS" :key="g.id" filter 
                  @click="toggleGroup(g.id)" 
                  :color="form.targetGroups.includes(g.id) ? 'warning' : 'default'">
                  {{ g.name }}
                </VChip>
              </div>
            </VCol>
            
            <VCol cols="12" v-if="availableAccounts.length > 0">
              <div class="pa-3 border rounded-lg bg-light-primary">
                <p class="text-subtitle-2 mb-2">แอคเคาน์ (Account)</p>
                <div class="d-flex flex-wrap gap-2">
                  <VChip 
                    v-for="a in availableAccounts" :key="a.id" size="small" 
                    @click="toggleAccount(a.id)" 
                    :color="form.targetAccounts.includes(a.id) ? 'primary' : 'default'">
                    {{ a.name }}
                  </VChip>
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
