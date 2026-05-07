<script setup>
import { ref, onMounted, computed } from 'vue'
import { $api } from '@/utils/api'

const isModalVisible = ref(false)
const pendingTasks = ref([])

// 🌟 1. เพิ่ม State สำหรับจัดการการลา
const isLeaveModalVisible = ref(false)
const leaveReason = ref('holiday') // ค่าเริ่มต้น
const isSubmittingLeave = ref(false)

const PRIORITY_LABELS = { 1: 'สูง', 2: 'กลาง', 3: 'น้อย', 'H': 'สูง', 'M': 'กลาง', 'L': 'น้อย' }
const PRIORITY_COLORS = { 1: '#EF4444', 2: '#F5A623', 3: '#3B82F6', 'H': '#EF4444', 'M': '#F5A623', 'L': '#3B82F6' }

const getTodayStr = () => {
  const d = new Date()
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().split('T')[0]
}

const getMostRecentResetTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()

  const today9am = new Date(year, month, date, 9, 0, 0).getTime()
  const today3pm = new Date(year, month, date, 15, 0, 0).getTime()
  const yesterday3pm = new Date(year, month, date - 1, 15, 0, 0).getTime()

  const currentTime = now.getTime()

  if (currentTime >= today3pm) return today3pm
  if (currentTime >= today9am) return today9am
  return yesterday3pm
}

const closeModal = () => {
  isModalVisible.value = false
  localStorage.setItem('taskNotificationDismissedAt', Date.now().toString())
}

// 🌟 2. เพิ่มฟังก์ชันกดยืนยันการลา (แก้ไขให้รองรับ ofetch แล้ว)
const submitLeave = async () => {
  try {
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : null
    
    if (!userData || !userData.id) return

    isSubmittingLeave.value = true

    // ส่ง Request ไปยัง API ด้วย ofetch
    await $api('/employee/tasks/leave-today', {
      method: 'POST',
      body: {
        userId: userData.id,
        reason: leaveReason.value
      }
    })

    // ปิด Modal ทั้งหมดและรีเฟรชข้อมูล
    isLeaveModalVisible.value = false
    isModalVisible.value = false
    await fetchNotifications()

  } catch (error) {
    console.error('Error submitting leave:', error)
    alert('เกิดข้อผิดพลาดในการบันทึกการลา')
  } finally {
    isSubmittingLeave.value = false
  }
}

const fetchNotifications = async () => {
  try {
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : null
    
    if (!userData || !userData.id) return

    const response = await $api(`/employee/my-tasks/${userData.id}`)
    const d = new Date()
    const localDate = new Date(d.getTime() + (7 * 60 * 60 * 1000))
    const todayStr = localDate.toISOString().split('T')[0]

    const todayPending = response.filter(item => {
      const taskDate = item.task_date ? String(item.task_date).split('T')[0] : ''
      return item.status === 'pending' && taskDate === todayStr
    })

    const uniqueTasks = []
    const seenNames = new Set()

    todayPending.forEach(item => {
      const taskName = item.task_detail?.name || 'ไม่ได้ระบุชื่องาน'
      if (!seenNames.has(taskName)) {
        seenNames.add(taskName)
        uniqueTasks.push({
          id: item.id,
          name: taskName,
          brand: item.task_detail?.target_brands ? String(item.task_detail.target_brands) : 'ทั่วไป',
          reportType: 'รายงาน '+item.task_detail?.report_type || 'General',
          priority: item.task_detail?.priority || 2 
        })
      }
    })

    pendingTasks.value = uniqueTasks

    if (uniqueTasks.length > 0) {
      const lastDismissed = localStorage.getItem('taskNotificationDismissedAt')
      const resetTime = getMostRecentResetTime()

      if (!lastDismissed || parseInt(lastDismissed) < resetTime) {
        isModalVisible.value = true
      }
    }

  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

onMounted(() => {
  fetchNotifications()
})

const currentDateTime = computed(() => {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  return `${timeStr} • ${dateStr}`
})
</script>

<template>
  <VBadge
    :content="pendingTasks.length"
    :model-value="pendingTasks.length > 0"
    color="error"
    offset-x="2"
    offset-y="2"
  >
    <VBtn icon variant="text" color="default" size="small" @click="isModalVisible = true">
      <VIcon icon="tabler-bell" size="24" />
    </VBtn>
  </VBadge>

  <!-- Modal แจ้งเตือนหลัก -->
  <VDialog v-model="isModalVisible" max-width="480">
    <VCard style="border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
      <div class="d-flex align-center justify-space-between px-6 py-4" style="background: #0B1464;">
        <div class="d-flex align-center gap-3">
          <div class="rounded-circle d-flex align-center justify-center" style="background: #F5A623; width: 36px; height: 36px;">
            <VIcon icon="tabler-bell" color="white" size="20" />
          </div>
          <div>
            <p class="text-white font-weight-bold text-subtitle-1 mb-0" style="line-height: 1.2;">แจ้งเตือนรายงาน</p>
            <p class="mb-0 text-caption" style="color: #cbd5e1;">{{ currentDateTime }}</p>
          </div>
        </div>
        <VBtn icon="tabler-x" variant="text" color="white" size="small" @click="closeModal" />
      </div>

      <VCardText class="pa-6">
        <div v-if="pendingTasks.length > 0">
          <div class="d-flex align-center gap-2 mb-4">
            <VIcon icon="tabler-alert-circle" color="error" size="18" />
            <span class="text-subtitle-2 font-weight-bold" style="color: #1f2937;">
              รายงานที่รอส่งวันนี้ ({{ pendingTasks.length }} รายการ)
            </span>
          </div>
          
          <div class="d-flex flex-column gap-3">
            <div 
              v-for="task in pendingTasks" 
              :key="task.id" 
              class="d-flex align-center gap-3 pa-3 rounded-lg" 
              style="background: #FFF9E6; border: 1px solid #FDE68A;"
            >
              <div class="flex-grow-1 overflow-hidden">
                <p class="font-weight-bold text-truncate mb-0" style="color: #1f2937; font-size: 14px;">{{ task.name }}</p>
                <p class="mb-0" style="color: #6b7280; font-size: 12px;">{{ task.reportType }}</p>
              </div>
              <span class="px-3 py-1 rounded-pill font-weight-bold flex-shrink-0" style="background: #FEF3C7; color: #92400E; font-size: 11px;">
                รอดำเนินการ
              </span>
            </div>
          </div>
        </div>
        
        <div v-else class="d-flex flex-column align-center justify-center py-8 text-center">
          <VIcon icon="tabler-bell-off" size="48" style="color: #E5E7EB;" class="mb-3" />
          <p class="text-body-2 text-medium-emphasis">ไม่มีรายงานที่รอส่งวันนี้</p>
        </div>
      </VCardText>

      <!-- 🌟 3. เพิ่มปุ่ม "ลา" ข้างๆ ปุ่ม "รับทราบ" -->
      <div class="px-6 pb-6 d-flex gap-3 w-100">
        <VBtn 
          v-if="pendingTasks.length > 0"
          variant="outlined" 
          color="error"
          @click="isLeaveModalVisible = true"
          class="flex-grow-1"
          style="border-radius: 8px; font-weight: bold;"
        >
          หยุด
        </VBtn>
        <VBtn 
          variant="elevated" 
          @click="closeModal" 
          class="flex-grow-1"
          style="background: #F5A623; color: white; border-radius: 8px; font-weight: bold;"
        >
          รับทราบ
        </VBtn>
      </div>
    </VCard>
  </VDialog>

  <!-- 🌟 4. Modal เลือกเหตุผลการลา (ซ้อนขึ้นมาเมื่อกดปุ่ม ลา) -->
  <VDialog v-model="isLeaveModalVisible" max-width="400">
    <VCard style="border-radius: 12px;">
      <VCardTitle class="text-center pt-6 pb-2 font-weight-bold">
        ระบุเหตุผล
      </VCardTitle>
      <VCardText>
        <VRadioGroup v-model="leaveReason">
          <VRadio label="วันหยุด" value="holiday" color="primary"></VRadio>
          <VRadio label="ลา" value="sick" color="error"></VRadio>
        </VRadioGroup>
      </VCardText>
      
      <!-- 🌟 แก้ไขการแสดงผลปุ่มตรงนี้ให้แบ่งครึ่งเท่าๆ กัน -->
      <VCardActions class="px-6 pb-6 pt-0 d-flex gap-3 w-100">
        <VBtn 
          class="flex-grow-1" 
          variant="tonal" 
          color="secondary" 
          @click="isLeaveModalVisible = false" 
          :disabled="isSubmittingLeave"
        >
          ยกเลิก
        </VBtn>
        <VBtn 
          class="flex-grow-1" 
          variant="elevated" 
          color="primary" 
          @click="submitLeave" 
          :loading="isSubmittingLeave"
        >
          ยืนยัน
        </VBtn>
      </VCardActions>
      
    </VCard>
  </VDialog>
</template>
