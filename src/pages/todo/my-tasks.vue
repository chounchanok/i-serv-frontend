<script setup>
import { ref, computed, onMounted } from 'vue'
import { $api } from '@/utils/api'

const myTasks = ref([])
const expandedId = ref(null)

const PRIORITY_LABELS = { 1: 'สูง', 2: 'กลาง', 3: 'น้อย', 'H': 'สูง', 'M': 'กลาง', 'L': 'น้อย' }
const PRIORITY_COLORS = { 1: '#EF4444', 2: '#F5A623', 3: '#3B82F6', 'H': '#EF4444', 'M': '#F5A623', 'L': '#3B82F6' }

const fetchTasks = async () => {
  try {
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : null
    
    if (!userData || !userData.id) {
      console.error('ไม่พบข้อมูลพนักงานในระบบ')
      return
    }

    const response = await $api(`/employee/my-tasks/${userData.id}`)
    
    myTasks.value = response.map(item => ({
      id: item.id,
      name: item.task_detail?.name || 'ไม่ได้ระบุชื่องาน',
      reportType: item.task_detail?.report_type || 'General',
      priority: item.task_detail?.priority || 'M',
      description: item.task_detail?.description || '',
      targetBrands: item.task_detail?.target_brands ? [String(item.task_detail.target_brands)] : [],
      status: item.status,
      
      // 🌟 หัวใจสำคัญ: ดึง task_date แล้วตัดตัวอักษร T และเวลาทิ้ง ให้เหลือแค่ 'YYYY-MM-DD' เพื่อใช้เทียบตรงๆ
      taskDate: item.task_date ? String(item.task_date).split('T')[0] : '', 

      submittedAt: item.submitted_at 
        ? new Date(item.submitted_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) 
        : ''
    }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

onMounted(() => {
  fetchTasks()
})

const submitTask = async (assignmentId) => {
  try {
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : {}

    await $api(`/employee/tasks/${assignmentId}/submit`, {
      method: 'POST',
      body: { userId: userData.id }
    })
    
    fetchTasks() 
  } catch (error) {
    console.error('Error submitting task:', error)
  }
}

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

// 🌟 สร้างวันที่ YYYY-MM-DD แบบไม่เพี้ยน Timezone 🌟
const getDateStr = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().split('T')[0]
}

const todayStr = getDateStr(0)
const tomorrowStr = getDateStr(1)

// 🌟 กรองให้แสดงเฉพาะงานที่ taskDate ตรงกับ "วันนี้" หรือ "พรุ่งนี้" เป๊ะๆ 🌟
const todayPending = computed(() => myTasks.value.filter(t => t.status === 'pending' && t.taskDate === todayStr))
const todaySubmitted = computed(() => myTasks.value.filter(t => t.status === 'submitted' && t.taskDate === todayStr))
const tomorrowTasks = computed(() => myTasks.value.filter(t => t.taskDate === tomorrowStr))

// สถิติความคืบหน้าของ "วันนี้" เท่านั้น
const totalTodayTasks = computed(() => todayPending.value.length + todaySubmitted.value.length)
const progressPct = computed(() => totalTodayTasks.value > 0 ? Math.round((todaySubmitted.value.length / totalTodayTasks.value) * 100) : 0)

const dateStr = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})
</script>

<template>
  <div class="d-flex flex-column gap-6" style="background-color: whitesmoke; padding: 20px; border-radius: 5px;">
    
    <div class="d-flex align-start justify-space-between">
      <div>
        <h1 class="text-h6 font-weight-bold" style="color: #1F2937;">รายการงานของฉัน</h1>
        <p class="text-caption mt-1" style="color: #6B7280;">{{ dateStr }}</p>
      </div>
      <div class="d-flex align-center gap-3 text-caption font-weight-bold">
        <span class="py-1" style="border-radius: 8px; padding: 2px; background: #F0FDF4; color: #22C55E;">
          ส่งแล้ว {{ todaySubmitted.length }}
        </span>
        <span class="py-1" style="border-radius: 8px; padding: 2px; background: #FFF9E6; color: #D97706;">
          รอดำเนินการ {{ todayPending.length }}
        </span>
      </div>
    </div>

    <div class="pa-5" style="background: white; border-radius: 16px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-subtitle-2 font-weight-medium" style="color: #374151;">ความคืบหน้าวันนี้</span>
        <span class="text-subtitle-2 font-weight-bold" style="color: #F5A623;">{{ progressPct }}%</span>
      </div>
      
      <div style="width: 100%; height: 12px; border-radius: 100px; background: #F3F4F6; overflow: hidden;">
        <div 
          style="height: 100%; border-radius: 100px; transition: all 0.5s ease; background: linear-gradient(to right, #F5A623, #22C55E);"
          :style="{ width: `${progressPct}%` }"
        ></div>
      </div>
      
      <div class="d-flex justify-space-between mt-2">
        <span class="text-caption" style="color: #9CA3AF;">{{ todaySubmitted.length }} รายการ</span>
        <span class="text-caption" style="color: #9CA3AF;">{{ totalTodayTasks }} รายการ</span>
      </div>
    </div>

    <div v-if="totalTodayTasks === 0" class="pa-12 text-center" style="background: white; border-radius: 16px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
      <VIcon icon="tabler-circle-check" size="48" color="success" class="mb-3" />
      <p style="color: #6B7280; margin: 0;">ไม่มีงานสำหรับวันนี้</p>
    </div>

    <div v-if="todayPending.length > 0">
      <div class="d-flex align-center gap-3 mb-3">
        <div style="width: 4px; height: 20px; border-radius: 100px; background: #F5A623;"></div>
        <h2 class="text-subtitle-2 font-weight-bold mb-0" style="color: #374151;">รอดำเนินการ (วันนี้)</h2>
        <span class="px-2 py-0 text-caption font-weight-bold" style="border-radius: 100px; background: rgba(245, 166, 35, 0.15); color: #F5A623;">
          {{ todayPending.length }}
        </span>
      </div>

      <div class="d-flex flex-column gap-3">
        <div 
          v-for="taskItem in todayPending" 
          :key="taskItem.id"
          class="overflow-hidden"
          style="background: white; border-radius: 16px; border: 1px solid #FDE68A; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);"
        >
          <div class="pa-4 d-flex align-start gap-4">
            <div class="flex-grow-1" style="min-width: 0;">
              <div class="d-flex align-start justify-space-between gap-2">
                <div>
                  <p class="text-subtitle-2 font-weight-bold mb-0" style="color: #1F2937;">{{ taskItem.name }}</p>
                  <p class="text-caption mb-0" style="color: #6B7280;">รายงาน {{ taskItem.reportType }}</p>
                </div>
                <span class="px-3 py-1 text-caption font-weight-bold flex-shrink-0" style="border-radius: 100px; background: #FEF3C7; color: #92400E;">
                  รอดำเนินการ
                </span>
              </div>

              <div v-if="expandedId === taskItem.id" class="mt-4 pt-3" style="border-top: 1px solid #F3F4F6;">
                <p v-if="taskItem.description" class="text-caption mb-2" style="color: #4B5563;">รายละเอียดเพิ่มเติม: {{ taskItem.description }}</p>
              </div>
            </div>

            <VBtn icon variant="text" size="small" color="secondary" class="mt-1" @click="toggleExpand(taskItem.id)">
              <VIcon :icon="expandedId === taskItem.id ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </div>

          <!-- <div class="px-4 pb-4 d-flex justify-end">
            <button 
              @click="submitTask(taskItem.id)"
              class="d-flex align-center gap-2 px-4 py-2 text-subtitle-2 font-weight-bold"
              style="border-radius: 12px; background: #F5A623; color: white; border: none; cursor: pointer; transition: opacity 0.2s;"
              onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'"
            >
              <VIcon icon="tabler-circle-check" size="18" /> ส่งรายงาน
            </button>
          </div> -->
        </div>
      </div>
    </div>

    <div v-if="todaySubmitted.length > 0">
      <div class="d-flex align-center gap-3 mb-3 mt-4">
        <div style="width: 4px; height: 20px; border-radius: 100px; background: #22C55E;"></div>
        <h2 class="text-subtitle-2 font-weight-bold mb-0" style="color: #374151;">ส่งแล้ว (วันนี้)</h2>
        <span class="px-2 py-0 text-caption font-weight-bold" style="border-radius: 100px; background: rgba(34, 197, 94, 0.15); color: #22C55E;">
          {{ todaySubmitted.length }}
        </span>
      </div>

      <div class="d-flex flex-column gap-3">
        <div 
          v-for="taskItem in todaySubmitted" 
          :key="taskItem.id"
          class="overflow-hidden"
          style="background: white; border-radius: 16px; border: 1px solid #BBF7D0; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);"
        >
          <div class="pa-4 d-flex align-start gap-4">
            <div class="flex-grow-1" style="min-width: 0;">
              <div class="d-flex align-start justify-space-between gap-2">
                <div>
                  <p class="text-subtitle-2 font-weight-bold mb-0" style="color: #1F2937;">{{ taskItem.name }}</p>
                  <p class="text-caption mb-0" style="color: #6B7280;">รายงาน {{ taskItem.reportType }}</p>
                </div>
                <span class="px-3 py-1 text-caption font-weight-bold flex-shrink-0" style="border-radius: 100px; background: #DCFCE7; color: #166534;">
                  ส่งแล้ว {{ taskItem.submittedAt }}
                </span>
              </div>

              <div v-if="expandedId === taskItem.id" class="mt-4 pt-3" style="border-top: 1px solid #F3F4F6;">
                <p v-if="taskItem.description" class="text-caption mb-2" style="color: #4B5563;">รายละเอียดเพิ่มเติม: {{ taskItem.description }}</p>
              </div>
            </div>

            <VBtn icon variant="text" size="small" color="secondary" class="mt-1" @click="toggleExpand(taskItem.id)">
              <VIcon :icon="expandedId === taskItem.id ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tomorrowTasks.length > 0" class="mt-4">
      <div class="d-flex align-center gap-3 mb-3">
        <div style="width: 4px; height: 20px; border-radius: 100px; background: #3B82F6;"></div>
        <h2 class="text-subtitle-2 font-weight-bold mb-0" style="color: #374151;">งานในวันพรุ่งนี้</h2>
        <span class="px-2 py-0 text-caption font-weight-bold" style="border-radius: 100px; background: rgba(59, 130, 246, 0.15); color: #3B82F6;">
          {{ tomorrowTasks.length }}
        </span>
      </div>

      <div class="d-flex flex-column gap-3 opacity-80">
        <div 
          v-for="taskItem in tomorrowTasks" 
          :key="'tomorrow-'+taskItem.id"
          class="overflow-hidden"
          style="background: #F8FAFC; border-radius: 16px; border: 1px dashed #CBD5E1;"
        >
          <div class="pa-4 d-flex align-start gap-4">
            <div class="flex-grow-1" style="min-width: 0;">
              <div class="d-flex align-start justify-space-between gap-2">
                <div>
                  <p class="text-subtitle-2 font-weight-bold mb-0" style="color: #4B5563;">{{ taskItem.name }}</p>
                  <p class="text-caption mb-0" style="color: #9CA3AF;">รายงาน {{ taskItem.reportType }}</p>
                </div>
                <span class="px-3 py-1 text-caption font-weight-bold flex-shrink-0" style="border-radius: 100px; background: #E2E8F0; color: #475569;">
                  รอทำพรุ่งนี้
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
