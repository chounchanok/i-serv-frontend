<script setup>
import { ref, onMounted, computed } from 'vue'
import { $api } from '@/utils/api'

const isModalVisible = ref(false)
const pendingTasks = ref([])

const PRIORITY_LABELS = { 1: 'สูง', 2: 'กลาง', 3: 'น้อย', 'H': 'สูง', 'M': 'กลาง', 'L': 'น้อย' }
const PRIORITY_COLORS = { 1: '#EF4444', 2: '#F5A623', 3: '#3B82F6', 'H': '#EF4444', 'M': '#F5A623', 'L': '#3B82F6' }

// 🌟 ฟังก์ชันหาวันที่ปัจจุบัน (YYYY-MM-DD) โดยไม่เพี้ยน Timezone 🌟
const getTodayStr = () => {
  const d = new Date()
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().split('T')[0]
}

// 🌟 ฟังก์ชันหา "รอบเวลาแจ้งเตือนล่าสุด" (09.00 หรือ 15.00) 🌟
const getMostRecentResetTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()

  // สร้าง Timestamp ของรอบเวลาต่างๆ
  const today9am = new Date(year, month, date, 9, 0, 0).getTime()
  const today3pm = new Date(year, month, date, 15, 0, 0).getTime()
  const yesterday3pm = new Date(year, month, date - 1, 15, 0, 0).getTime()

  const currentTime = now.getTime()

  // เช็คว่าตอนนี้ผ่านรอบไหนมาล่าสุด
  if (currentTime >= today3pm) return today3pm
  if (currentTime >= today9am) return today9am
  return yesterday3pm
}

// 🌟 ฟังก์ชันกดปิด Modal พร้อมบันทึกเวลา 🌟
const closeModal = () => {
  isModalVisible.value = false
  // บันทึกเวลาที่กดปิดล่าสุดลง localStorage
  localStorage.setItem('taskNotificationDismissedAt', Date.now().toString())
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

    // 2. ป้องกันข้อมูลซ้ำ (กรณี Backend บังเอิญส่งมาซ้ำ) โดยยึดจากชื่อ Task 
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

    // 3. กำหนดค่าลงตัวแปร
    pendingTasks.value = uniqueTasks

    // 🌟 4. ตรวจสอบเงื่อนไขการโชว์ Popup อัตโนมัติ
    if (uniqueTasks.length > 0) {
      const lastDismissed = localStorage.getItem('taskNotificationDismissedAt')
      const resetTime = getMostRecentResetTime()

      // จะโชว์ก็ต่อเมื่อ "ไม่เคยกดปิดเลย" หรือ "กดปิดไปก่อนที่รอบล่าสุดจะมาถึง"
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
    <!-- กดไอคอนกระดิ่งด้วยตัวเองเพื่อดูเมื่อไหร่ก็ได้ -->
    <VBtn icon variant="text" color="default" size="small" @click="isModalVisible = true">
      <VIcon icon="tabler-bell" size="24" />
    </VBtn>
  </VBadge>

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
        <!-- 🌟 เปลี่ยนมาใช้ฟังก์ชัน closeModal แทนการเซ็ตค่าธรรมดา -->
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

      <div class="px-6 pb-6">
        <!-- 🌟 เปลี่ยนมาใช้ฟังก์ชัน closeModal เช่นกัน -->
        <VBtn 
          block 
          variant="elevated" 
          @click="closeModal" 
          style="background: #F5A623; color: white; border-radius: 8px; font-weight: bold;"
        >
          รับทราบ
        </VBtn>
      </div>
    </VCard>
  </VDialog>
</template>
