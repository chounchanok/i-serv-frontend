<script setup>
import { computed, ref, onMounted } from 'vue'
import { $api } from '@/utils/api' // นำเข้า $api สำหรับยิง API

// 1. เปลี่ยน Mock Data เป็น Array ว่าง
const myTasks = ref([])

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

// 3. ฟังก์ชันดึงข้อมูล Task ของพนักงานจาก API
const fetchTasks = async () => {
  try {
    const response = await $api('/employee/my-tasks')
    
    // Map ข้อมูลให้ตรงกับโครงสร้างเดิมที่ UI ต้องการ
    myTasks.value = response.map(item => ({
      id: item.id, // assignment id
      name: item.task_detail?.name || 'ไม่ได้ระบุชื่องาน',
      brand: item.task_detail?.target_brands ? String(item.task_detail.target_brands) : 'ไม่มีระบุ',
      priority: item.task_detail?.priority || 'M',
      dueDate: item.task_detail?.end_date || '',
      status: { status: item.status }
    }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

// 4. ฟังก์ชันสำหรับกดส่งงาน (เรียก API POST)
const submitTask = async (assignmentId) => {
  try {
    await $api(`/employee/tasks/${assignmentId}/submit`, {
      method: 'POST'
    })
    
    // เมื่อส่งงานสำเร็จ ให้ดึงข้อมูลมาอัปเดตตารางใหม่
    fetchTasks()
  } catch (error) {
    console.error('Error submitting task:', error)
  }
}

// ดึงข้อมูลเมื่อ Component โหลด
onMounted(() => {
  fetchTasks()
})

// 5. Computed Logic สำหรับกรองข้อมูล
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
  if (!dateString) return 'ไม่มีกำหนด'
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
            v-if="item.status.status === 'pending'"
            color="success"
            size="small"
            variant="flat"
            @click="submitTask(item.id)"
          >
            <VIcon icon="tabler-check" class="me-1" size="16"/>
            ส่งงาน
          </VBtn>
          <VBtn
            v-else
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
