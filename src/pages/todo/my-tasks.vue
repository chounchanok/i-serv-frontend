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
      brand: item.task_detail?.target_brands ? `Group ID: ${item.task_detail.target_brands}` : 'ทั่วไป',
      reportType: item.task_detail?.report_type || 'General',
      priority: item.task_detail?.priority || 'M',
      description: item.task_detail?.description || '',
      targetBrands: item.task_detail?.target_brands ? [String(item.task_detail.target_brands)] : [],
      status: item.status,
      // แปลงเวลาที่ส่งงานให้เป็น HH:mm (ถ้ามี)
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

// ฟังก์ชันกดส่งงาน
const submitTask = async (assignmentId) => {
  try {
    const userDataString = localStorage.getItem('userData')
    const userData = userDataString ? JSON.parse(userDataString) : {}

    await $api(`/employee/tasks/${assignmentId}/submit`, {
      method: 'POST',
      body: { userId: userData.id }
    })
    
    fetchTasks() // รีเฟรชข้อมูลใหม่
  } catch (error) {
    console.error('Error submitting task:', error)
  }
}

// ฟังก์ชันเปิด-ปิด Accordion รายละเอียดงาน
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

// ข้อมูลแบ่งกลุ่ม
const pending = computed(() => myTasks.value.filter(t => t.status === 'pending'))
const submitted = computed(() => myTasks.value.filter(t => t.status === 'submitted'))
const progressPct = computed(() => myTasks.value.length > 0 ? Math.round((submitted.value.length / myTasks.value.length) * 100) : 0)

const dateStr = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})
</script>

<template>
  <div class="d-flex flex-column gap-6" style="background-color: whitesmoke;padding: 20px;border-radius: 5px;">
    <div class="d-flex align-start justify-space-between">
      <div>
        <h1 class="text-h5 font-weight-bold" style="color: #1F2937;">รายการงานของฉัน</h1>
        <p class="text-caption mt-1" style="color: #6B7280;">{{ dateStr }}</p>
      </div>
      <div class="d-flex align-center gap-3 text-caption font-weight-bold">
        <span class="px-3 py-1" style="border-radius: 100px; background: #F0FDF4; color: #22C55E;">
          ส่งแล้ว {{ submitted.length }}
        </span>
        <span class="px-3 py-1" style="border-radius: 100px; background: #FFF9E6; color: #D97706;">
          รอดำเนินการ {{ pending.length }}
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
        <span class="text-caption" style="color: #9CA3AF;">0 รายการ</span>
        <span class="text-caption" style="color: #9CA3AF;">{{ myTasks.length }} รายการ</span>
      </div>
    </div>

    <div v-if="myTasks.length === 0" class="pa-12 text-center" style="background: white; border-radius: 16px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
      <VIcon icon="tabler-circle-check" size="48" color="success" class="mb-3" />
      <p style="color: #6B7280; margin: 0;">ไม่มีงานสำหรับวันนี้</p>
    </div>

    <div v-if="pending.length > 0">
      <div class="d-flex align-center gap-3 mb-3">
        <div style="width: 4px; height: 20px; border-radius: 100px; background: #F5A623;"></div>
        <h2 class="text-subtitle-2 font-weight-bold mb-0" style="color: #374151;">รอดำเนินการ</h2>
        <span class="px-2 py-0 text-caption font-weight-bold" style="border-radius: 100px; background: rgba(245, 166, 35, 0.15); color: #F5A623;">
          {{ pending.length }}
        </span>
      </div>

      <div class="d-flex flex-column gap-3">
        <div 
          v-for="taskItem in pending" 
          :key="taskItem.id"
          class="overflow-hidden"
          style="background: white; border-radius: 16px; border: 1px solid #FDE68A; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);"
        >
          <div class="pa-4 d-flex align-start gap-4">
            <div 
              class="d-flex align-center justify-center text-white flex-shrink-0 mt-1" 
              style="padding: 0 8px; height: 36px; border-radius: 12px; font-size: 12px; font-weight: bold;"
              :style="{ background: PRIORITY_COLORS[taskItem.priority] || '#F5A623' }"
            >
              {{ PRIORITY_LABELS[taskItem.priority] || taskItem.priority }}
            </div>

            <div class="flex-grow-1" style="min-width: 0;">
              <div class="d-flex align-start justify-space-between gap-2">
                <div>
                  <p class="text-subtitle-2 font-weight-bold mb-0" style="color: #1F2937;">{{ taskItem.name }}</p>
                  <p class="text-caption mb-0" style="color: #6B7280;">{{ taskItem.reportType }} • {{ taskItem.brand }}</p>
                </div>
                <span class="px-3 py-1 text-caption font-weight-bold flex-shrink-0" style="border-radius: 100px; background: #FEF3C7; color: #92400E;">
                  รอดำเนินการ
                </span>
              </div>

              <div v-if="expandedId === taskItem.id" class="mt-4 pt-3" style="border-top: 1px solid #F3F4F6;">
                <p v-if="taskItem.description" class="text-caption mb-2" style="color: #4B5563;">{{ taskItem.description }}</p>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="b in taskItem.targetBrands" :key="b" class="px-2 py-1 text-caption" style="border-radius: 100px; background: #F0F4FF; color: #3B5BDB;">
                    {{ b }}
                  </span>
                </div>
              </div>
            </div>

            <VBtn icon variant="text" size="small" color="secondary" class="mt-1" @click="toggleExpand(taskItem.id)">
              <VIcon :icon="expandedId === taskItem.id ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </div>

          <div class="px-4 pb-4 d-flex justify-end">
            <button 
              @click="submitTask(taskItem.id)"
              class="d-flex align-center gap-2 px-4 py-2 text-subtitle-2 font-weight-bold"
              style="border-radius: 12px; background: #F5A623; color: white; border: none; cursor: pointer; transition: opacity 0.2s;"
              onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'"
            >
              <VIcon icon="tabler-circle-check" size="18" /> ส่งรายงาน
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="submitted.length > 0">
      <div class="d-flex align-center gap-3 mb-3">
        <div style="width: 4px; height: 20px; border-radius: 100px; background: #22C55E;"></div>
        <h2 class="text-subtitle-2 font-weight-bold mb-0" style="color: #374151;">ส่งแล้ว</h2>
        <span class="px-2 py-0 text-caption font-weight-bold" style="border-radius: 100px; background: rgba(34, 197, 94, 0.15); color: #22C55E;">
          {{ submitted.length }}
        </span>
      </div>

      <div class="d-flex flex-column gap-3">
        <div 
          v-for="taskItem in submitted" 
          :key="taskItem.id"
          class="overflow-hidden"
          style="background: white; border-radius: 16px; border: 1px solid #BBF7D0; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);"
        >
          <div class="pa-4 d-flex align-start gap-4">
            <div 
              class="d-flex align-center justify-center text-white flex-shrink-0 mt-1" 
              style="padding: 0 8px; height: 36px; border-radius: 12px; font-size: 12px; font-weight: bold;"
              :style="{ background: PRIORITY_COLORS[taskItem.priority] || '#F5A623' }"
            >
              {{ PRIORITY_LABELS[taskItem.priority] || taskItem.priority }}
            </div>

            <div class="flex-grow-1" style="min-width: 0;">
              <div class="d-flex align-start justify-space-between gap-2">
                <div>
                  <p class="text-subtitle-2 font-weight-bold mb-0" style="color: #1F2937;">{{ taskItem.name }}</p>
                  <p class="text-caption mb-0" style="color: #6B7280;">{{ taskItem.reportType }} • {{ taskItem.brand }}</p>
                </div>
                <span class="px-3 py-1 text-caption font-weight-bold flex-shrink-0" style="border-radius: 100px; background: #DCFCE7; color: #166534;">
                  ส่งแล้ว {{ taskItem.submittedAt }}
                </span>
              </div>

              <div v-if="expandedId === taskItem.id" class="mt-4 pt-3" style="border-top: 1px solid #F3F4F6;">
                <p v-if="taskItem.description" class="text-caption mb-2" style="color: #4B5563;">{{ taskItem.description }}</p>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="b in taskItem.targetBrands" :key="b" class="px-2 py-1 text-caption" style="border-radius: 100px; background: #F0F4FF; color: #3B5BDB;">
                    {{ b }}
                  </span>
                </div>
              </div>
            </div>

            <VBtn icon variant="text" size="small" color="secondary" class="mt-1" @click="toggleExpand(taskItem.id)">
              <VIcon :icon="expandedId === taskItem.id ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </VBtn>
          </div>

          </div>
      </div>
    </div>
  </div>
</template>
