<script setup>
import {
  onMounted,
  ref,
} from 'vue'

import apiService from '@/services/api'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'

const isDialogVisible = ref(false)
const importmodal = ref(false)
const loading = ref(true)
const group_customer_id = ref(null)
const area_supervisor_id = ref(null)
const area_manager_id = ref(null)

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const group_customerlist = ref([])
const area_supervisorlist = ref([])
const area_managerlist = ref([])

const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')

const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()

    const groupCustomer = item.groupCustomer && item.groupCustomer.name ? item.groupCustomer.name.toLowerCase().includes(searchText) : false
    const areaSupervisor = item.areaSupervisor && item.areaSupervisor.name ? item.areaSupervisor.name.toLowerCase().includes(searchText) : false
    const areaManager = item.areaManager && item.areaManager.name ? item.areaManager.name.toLowerCase().includes(searchText) : false
    
    return groupCustomer || areaSupervisor || areaManager
  })
})

const fileupload = ref(null)
const selectedFile = ref(null)

const handleFileUpload = event => {
  selectedFile.value = event.target.files[0]
  console.log('Selected file:', selectedFile.value)
  setTimeout(() => {
    submitFile()
  }, 200)
  
}

const submitFile = async () => {
  console.log(selectedFile.value)
  if (!selectedFile.value) {
    alert("Please select a file first")
  } else {
    const formData = new FormData()

    formData.append('file_excel', selectedFile.value)

    let timerInterval
    Swal.fire({
      title: "กำลัง Import กรุณารอสักครู่!",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        clearInterval(timerInterval)
      },
    }).then(result => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer")
      }
    })

    await apiService.import_MapUserArea(formData)
      .then(response => {
        if(response.data.status != 'error'){
          Swal.fire({
            title: 'Import successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          })
          getall()
          fileupload.value = null
          selectedFile.value = null
        }else{
          Swal.fire({
            title: 'Import failed!',
            text: response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          })
        }
      })
      .catch(error => {
        console.error('Error :', error)
      })
  }
}

const selectFile = async () => {

  importmodal.value = true
}

const selectFile2 = async () => {

  fileupload.value.click()
}

const search = ref('')

const headers = [
  {
    title: 'id',
    key: 'num',
  },
  {
    title: 'กลุ่มลูกค้า',
    key: 'groupCustomer',
  },
  {
    title: 'เขต Supervisor',
    key: 'areaSupervisor',
  },
  {
    title: 'Area Manager',
    key: 'areaManager',
  },
  {
    title: 'สถานะ',
    key: 'isActive',
  },
  {
    title: 'จัดการ',
    key: 'actions',
    sortable: false,
  },
]

const userData = useCookie('userData')

onMounted(() => {
  getall()
  get_all_group_customer()
  get_all_area_supervisor()
  get_all_area_manager()
})

const getall = async () => {
  loading.value = true

  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  }

  await apiService.get_all_MapUserArea(form)
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.length
      datalist.value.forEach((item, index) => {
        datalist.value[index].Active = (item.isActive=='Y'?true:false)
        datalist.value[index].num = index+1
      })
    })
    .catch(error => {
      console.error('Error :', error)
    })
  loading.value = false
}

const get_all_group_customer = async () => {
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  }

  await apiService.get_all_group_customer(form)
    .then(response => {
      group_customerlist.value = response.data.data
    })
    .catch(error => {
      console.error('Error :', error)
    })

  // await apiService.get_all_group_customer()
  // .then(response => {
  //   group_customerlist.value = response.data.data
  // })
  // .catch(error => {
  //   console.error('Error :', error);
  // });
}

const get_all_area_supervisor = async () => {
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  }

  await apiService.get_all_area_supervisor(form)
    .then(response => {
      area_supervisorlist.value = response.data.data
    })
    .catch(error => {
      console.error('Error :', error)
    })
}

const get_all_area_manager = async () => {
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  }

  await apiService.get_all_area_manager(form)
    .then(response => {
      area_managerlist.value = response.data.data
    })
    .catch(error => {
      console.error('Error :', error)
    })
}

const update_MapUserArea_isActive = async v => {
  const form = {
    isActive: v.Active ? "Y" : "N",
  }

  await apiService.update_MapUserArea_isActive(v.id, form)
    .then(response => {
      Swal.fire({
        title: 'Update successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      })
      getall()
    })
    .catch(error => {
      console.error('Error :', error)
    })
}

const editdata = async val => {
  data_id.value = val.id
  group_customer_id.value = val.group_customer_id
  area_supervisor_id.value = val.area_supervisor_id
  area_manager_id.value = val.area_manager_id

  isDialogVisible.value = true
}

const openmodal = async () => {
  data_id.value = ''
  group_customer_id.value = null
  area_supervisor_id.value = null
  area_manager_id.value = null

  isDialogVisible.value = true
}

const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate()
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
        const form = {
          group_customer_id: group_customer_id.value,
          area_supervisor_id: area_supervisor_id.value,
          area_manager_id: area_manager_id.value,
        }

        await apiService.update_MapUserArea(data_id.value, form)
          .then(response => {
          
          })
          .catch(error => {
            console.error('Error :', error)
          })
      } else {
        const form = {
          group_customer_id: group_customer_id.value,
          area_supervisor_id: area_supervisor_id.value,
          area_manager_id: area_manager_id.value,
        }

        await apiService.create_MapUserArea(form)
          .then(response => {
          
          })
          .catch(error => {
            console.error('Error :', error)
          })
      }
      isDialogVisible.value = false
      Swal.fire({
        title: 'บันทึกสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'OK',
      })
      getall() // โหลดข้อมูลใหม่
    }
  } catch (err) {
    console.error(err)
  }
}

// ฟังก์ชันสำหรับส่งออกเป็น Excel
const exportToExcel = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'กลุ่มลูกค้า': item.groupCustomer.name,
    'เขต Supervisor': item.areaSupervisor.name,
    'Area Manager': item.areaManager.name,
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No',
  }))

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'data.xlsx')
}
</script>

<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <AppTextField
            v-model="searchQuery"
            placeholder="Search ..."
            append-inner-icon="tabler-search"
            single-line
            hide-details
            dense
            outlined
          />
        </VCol>
        <VCol
          cols="12"
          md="8"
          class="text-right"
        >
          <div style="margin-block-end: 10px;">
            <input
              ref="fileupload"
              type="file"
              style="display: none;"
              @change="handleFileUpload"
            >
          </div>
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
            class="mr-1"
            @click="selectFile"
          >
            Import
          </VBtn>
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
            class="mr-1"
            @click="exportToExcel"
          >
            Export to Excel
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            @click="openmodal"
          >
            เพิ่ม
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>

    <!-- 👉 Data Table  -->
    <VDataTable
      :headers="headers"
      :items="filtereddatalist || []"
      :search="search"
      :items-per-page="10"
      class="text-no-wrap"
    >
      <template #item.groupCustomer="{ item }">
        {{ item.groupCustomer.name }}
      </template>
      <template #item.areaSupervisor="{ item }">
        {{ item.areaSupervisor.name }}
      </template>
      <template #item.areaManager="{ item }">
        {{ item.areaManager.name }}
      </template>
      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_MapUserArea_isActive(item)"
        />
      </template>
    

      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon
            icon="tabler-edit"
            @click="editdata(item)"
          />
        </IconBtn>
      </template>
    </VDataTable>

    <VDialog
      v-model="isDialogVisible"
      max-width="600"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="เพิ่ม/แก้ไข">
        <VForm
          ref="refForm"
          @submit.prevent="save"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                sm="12"
                md="12"
              >
                <AppAutocomplete
                  v-model="group_customer_id"
                  label="กลุ่มลูกค้า"
                  :items="group_customerlist"
                  item-title="name"
                  item-value="id"
                  placeholder="Select"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                sm="12"
                md="12"
              >
                <AppAutocomplete
                  v-model="area_supervisor_id"
                  label="เขต Supervisor"
                  :items="area_supervisorlist"
                  item-title="name"
                  item-value="id"
                  placeholder="Select"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                sm="12"
                md="12"
              >
                <AppAutocomplete
                  v-model="area_manager_id"
                  label="Area Manager"
                  :items="area_managerlist"
                  item-title="name"
                  item-value="id"
                  placeholder="Select"
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn
              variant="tonal"
              color="secondary"
              @click="isDialogVisible = false"
            >
              Close
            </VBtn>
            <VBtn @click="save">
              Save
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VDialog>

    <VDialog
      v-model="importmodal"
      max-width="1000"
    >
      <DialogCloseBtn @click="importmodal = !importmodal" />

      <!-- Dialog Content -->
      <VCard title="การ Import">
        <VForm
          ref="refForm"
          @submit.prevent="save"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="6"
                sm="6"
                md="6"
              >
                <div style=" display: flex; align-items: center; justify-content: center;border: 2px dashed #ccc; block-size: 150px;">
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    class="mr-2"
                    href="/file_upload/usertoarea.xlsx"
                    download
                  >
                    Download Template
                  </VBtn>
                </div>
              </VCol>
              <VCol
                cols="6"
                sm="6"
                md="6"
              >
                <div style=" display: flex; align-items: center; justify-content: center;border: 2px dashed #ccc; block-size: 150px;">
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    @click="selectFile2"
                  >
                    Import
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3" />
        </VForm>
      </VCard>
    </VDialog>
  </VCard>
</template>
