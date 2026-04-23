<script setup>
import {
  ref,
} from 'vue'

import apiService from '@/services/api'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'


const isDialogVisible = ref(false)
const loading = ref(true)
const group_customer_id = ref(null)
const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const totalrecord = ref(0)
const refForm = ref()
const group_customerlist = ref([])

const searchQuery = ref('')

const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    
    return (
      item.name.toLowerCase().includes(searchText) || 
      item.group_customer.name.toLowerCase().includes(searchText)

    )
  })
})

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const userData = useCookie('userData')

onMounted(() => {
  get_all_group_customer()
  getall()
  group_customer_id.value = userData.value.group_customer_id

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

    try {
      Swal.fire({
        title: 'Import successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      })
      getall()
      console.log("Response data:", data)

    } catch (error) {
      console.error("Error submitting file:", error)
    }
  }
}

const selectFile = async () => {
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
    key: 'group_customer.name',
  },
  {
    title: 'Account',
    key: 'name',
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


// const getall = async () => {
//   loading.value = true
//   const {
//       data: datalistData,
//       execute: fetchdatalist,
//   } = await $api("https://api-test.iservreport.com/api/backend/get_all_account", {
//       method: "GET",
//   });
//   console.log(datalistData);
//   datalist.value = datalistData
//   totalrecord.value = datalistData.length
//   datalist.value.forEach((item, index) => {
//     datalist.value[index].Active = (item.isActive=='Y'?true:false)
//     datalist.value[index].num = index+1
//   });
//   loading.value = false
// }
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
}

const getall = async () => {
  loading.value = true

  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  }

  await apiService.get_all_account(form)
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.data.length
      datalist.value = datalist.value
        .filter(item => item.id) // ✅ ลบรายการที่ไม่มี `id`
        .map((item, index) => ({
          ...item, // ✅ คงค่าเดิมไว้
          Active: item.isActive === 'Y', // ✅ แปลงเป็น `true` หรือ `false`
          num: index + 1, // ✅ กำหนดเลขลำดับ
        }))
    })
    .catch(error => {
      console.error('Error :', error)
    })

  loading.value = false
}

const update_account_isActive = async v => {
  try {
    
    await apiService.update_account_isActive(v.id, { isActive: v.Active ? "Y" : "N" })
    Swal.fire({
      title: 'Update successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    })
    getall()
  } catch (err) {
    console.error(err)
  }
}

const editdata = async val => {
  data_id.value = val.id
  data_name.value = val.name
  group_customer_id.value = val.group_customer_id

  isDialogVisible.value = true
}

const openmodal = async () => {
  data_id.value = ''
  data_name.value = ''

  // group_customer_id.value = null;

  isDialogVisible.value = true
}

const save = async () => {
  try {
    let body = {
      group_customer_id: group_customer_id.value,
      name: data_name.value,
    }

    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate()
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
        await apiService.update_account(data_id.value, body)
      } else {
        await apiService.create_account(body)
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

function customFilter(itemTitle, queryText, item) {
  const textOne = item.raw.name.toLowerCase()
  const textTwo = item.raw.abbr.toLowerCase()
  const searchText = queryText.toLowerCase()

  return textOne.includes(searchText) || textTwo.includes(searchText)
}


// ฟังก์ชันสำหรับส่งออกเป็น Excel
const exportToExcel = () => {
  console.log(filtereddatalist.value)


  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'กลุ่มลูกค้า': item.group_customer.name,
    'Account': item.name,
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No',
  }))

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'Master Account.xlsx')
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
            v-model="search"
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
          <!--
            <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
            class="mr-1"
            @click="selectFile"
            >
            Import
            </VBtn> 
          -->
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
            class="mr-1"
            @click="exportToExcel"
          >
            Export
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
      :items="datalist || []"
      :search="search"
      :items-per-page="10"
      class="text-no-wrap"
    >
      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_account_isActive(item)"
        />
      </template>
    

      <template #item.actions="{ item }">
        <IconBtn @click="editdata(item)">
          <VIcon icon="tabler-edit" />
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
                  :disabled="userData.position_name != 'SuperAdmin'"
                />
              </VCol>
              <VCol
                cols="12"
                sm="12"
                md="12"
              >
                <AppTextField
                  v-model="data_name"
                  label="ชื่อ"
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
  </VCard>
</template>
