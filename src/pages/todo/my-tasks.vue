<script setup>
import { computed, ref } from 'vue'

// 1. Mock Data (จำลองข้อมูล รอการเชื่อมต่อ API ในอนาคต)
const myTasks = ref([
  { 
    id: 1, 
    name: 'อัปเดตการตั้งค่า Nginx Server', 
    brand: 'IT Infrastructure', 
    priority: 'H', 
    dueDate: '2026-04-25',
    status: { status: 'submitted' } 
  },
  { 
    id: 2, 
    name: 'รัน Laravel Migration สำหรับ Phase 2', 
    brand: 'Backend', 
    priority: 'M', 
    dueDate: '2026-04-26',
    status: { status: 'pending' } 
  },
  { 
    id: 3, 
    name: 'สรุปสเปกและราคา Cisco Catalyst', 
    brand: 'Network', 
    priority: 'L', 
    dueDate: '2026-04-27',
    status: { status: 'pending' } 
  },
  { 
    id: 4, 
    name: 'วางแผน Technical SEO', 
    brand: 'Client: Pum', 
    priority: 'H', 
    dueDate: '2026-04-28',
    status: { status: 'pending' } 
  },
])

const PRIORITY_LABELS = { H: 'สูง', M: 'กลาง', L: 'ต่ำ' }
const PRIORITY_COLORS = { H: 'error', M: 'warning', L: 'success' }

// 2. State สำหรับการกรอง (Filter) และค้นหา
const searchQuery = ref('')
const selectedStatus = ref('all') // 'all', 'pending', 'submitted'

// ตัวเลือกสำหรับ Dropdown
const statusOptions = [
  { title: 'ทั้งหมด', value: 'all' },
  { title: 'รอดำเนินการ', value: 'pending' },
  { title: 'ส่งแล้ว', value: 'submitted' }
]

// 3. Computed Logic สำหรับกรองข้อมูล
const filteredTasks = computed(() => {
  return myTasks.value.filter(task => {
    // กรองตามคำค้นหา
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          task.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // กรองตามสถานะ
    const matchesStatus = selectedStatus.value === 'all' || task.status.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

// ฟังก์ชันแปลงรูปแบบวันที่
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <VCard class="pa-6">
    <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center mb-6 gap-4">
      <div>
        <h2 class="text-h5 font-weight-bold text-high-emphasis mb-1">งานของฉัน</h2>
        <p class="text-body-2 text-medium-emphasis mb-0">รายการงานทั้งหมดที่คุณต้องรับผิดชอบ</p>
      </div>
    </div>

    <VRow class="mb-4">
      <VCol cols="12" md="8">
        <VTextField
          v-model="searchQuery"
          placeholder="ค้นหาชื่องาน หรือ หมวดหมู่..."
          prepend-inner-icon="tabler-search"
          variant="outlined"
          density="comfortable"
          hide-details
          style="max-width: 400px; border-radius: 8px;"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VSelect
          v-model="selectedStatus"
          :items="statusOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="tabler-filter"
        />
      </VCol>
    </VRow>

    <div v-if="filteredTasks.length === 0" class="d-flex flex-column align-center justify-center py-12 text-medium-emphasis">
      <VIcon icon="tabler-clipboard-x" size="48" class="mb-4 text-disabled" />
      <p class="text-h6 font-weight-medium mb-1">ไม่พบรายการงาน</p>
      <p class="text-caption">ลองปรับเปลี่ยนคำค้นหา หรือเงื่อนไขการกรองใหม่</p>
    </div>

    <div v-else class="d-flex flex-column gap-3 mt-4">
      <VCard
        v-for="item in filteredTasks"
        :key="item.id"
        elevation="0"
        border
        class="task-card d-flex align-center pa-4 transition-swing"
        :class="item.status.status === 'submitted' ? 'bg-light-success-subtle border-success-subtle' : 'bg-light-warning-subtle border-warning-subtle'"
        style="border-radius: 12px; cursor: pointer;"
      >
        <VAvatar 
          :color="PRIORITY_COLORS[item.priority] || 'warning'" 
          size="32" 
          class="text-white text-caption font-weight-bold me-4 elevation-1"
        >
          {{ PRIORITY_LABELS[item.priority] }}
        </VAvatar>
        
        <div class="flex-grow-1 overflow-hidden me-4">
          <p class="text-subtitle-1 font-weight-bold text-truncate mb-0 text-high-emphasis" :class="item.status.status === 'submitted' ? 'text-decoration-line-through text-medium-emphasis' : ''">
            {{ item.name }}
          </p>
          <div class="d-flex align-center text-caption text-medium-emphasis mt-1 gap-3">
            <span class="d-flex align-center">
              <VIcon icon="tabler-tag" size="14" class="me-1" />
              {{ item.brand }}
            </span>
            <span class="d-flex align-center">
              <VIcon icon="tabler-calendar-due" size="14" class="me-1" />
              {{ formatDate(item.dueDate) }}
            </span>
          </div>
        </div>

        <div class="d-flex align-center gap-2">
          <VChip
            :color="item.status.status === 'submitted' ? 'success' : 'warning'"
            size="small"
            variant="tonal"
            class="font-weight-medium d-none d-sm-flex"
          >
            {{ item.status.status === 'submitted' ? 'ส่งแล้ว' : 'รอดำเนินการ' }}
          </VChip>
          <VBtn
            icon
            variant="text"
            size="small"
            color="secondary"
          >
            <VIcon icon="tabler-dots-vertical" />
          </VBtn>
        </div>
      </VCard>
    </div>
  </VCard>
</template>

<style scoped>
/* เพิ่มสี Custom สำหรับ Background และ Border อ่อนๆ */
.bg-light-success-subtle {
  background-color: #F0FDF4 !important;
}
.border-success-subtle {
  border-color: #BBF7D0 !important;
}
.bg-light-warning-subtle {
  background-color: #FFF9E6 !important;
}
.border-warning-subtle {
  border-color: #FDE68A !important;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}
</style>
