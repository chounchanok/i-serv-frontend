<script setup>
import {
  onMounted,
  ref,
} from 'vue'

import apiService from '@/services/api'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'

const router = useRouter()
const isDialogVisible = ref(false)
const loading = ref(true)
const importmodal = ref(false)

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const accountlist = ref([])

const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')

const filtereddatalist = computed(() => {
  console.log(datalist.value)

  if (!searchQuery.value) return datalist.value

  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    
    return (
      item?.name?.toLowerCase().includes(searchText) ||
      item?.store?.store_code?.toLowerCase().includes(searchText) ||
      item?.store?.store_name?.toLowerCase().includes(searchText) ||
      item?.account?.name?.toLowerCase().includes(searchText) ||
      item?.accountType?.name?.toLowerCase().includes(searchText) ||
      item?.groupCustomer?.name?.toLowerCase().includes(searchText)
    )
  })
})

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

onMounted(() => {
  getall()
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

    await apiService.import_productTocompliance(formData)
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
    title: '',
    key: 'data-table-expand',
  },

  // {
  //   title: 'ชื่อรายการ',
  //   key: 'name',
  // },
  {
    title: 'Account',
    key: 'Account',
  },
  {
    title: 'Store Code',
    key: 'StoreCode',
  },
  {
    title: 'Store Name',
    key: 'StoreName',
  },
  {
    title: 'จัดการ',
    key: 'actions',
    sortable: false,
  },
]

const userData = useCookie('userData')

const getall = async () => {
  const form = {
    area_manager: userData.value.area_manager,
    area_supervisor: userData.value.area_supervisor,
    code: userData.value.code,
    position_id: userData.value.position_id,
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  }

  await apiService.get_all_MapStoreCompliance(form)
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.data.length
      datalist.value.forEach((item, index) => {
        datalist.value[index].Active = (item.isActive=='Y'?true:false)
        datalist.value[index].num = index+1

      // item.mapStoreComplianceList.forEach((item2, index2) => {
        // datalist.value[index].mapStoreComplianceList[index2].oos = (item2.oos=='Y'?true:false)
        // datalist.value[index].mapStoreComplianceList[index2].price = (item2.price=='Y'?true:false)
        // datalist.value[index].mapStoreComplianceList[index2].offtake = (item2.offtake=='Y'?true:false)
        // datalist.value[index].mapStoreComplianceList[index2].week = (item2.week=='Y'?true:false)
        // datalist.value[index].mapStoreComplianceList[index2].area = (item2.area=='Y'?true:false)
      // });
      })
    })
    .catch(error => {
      console.error('Error :', error)
    })
}

const get_all_account = async () => {
  await apiService.get_all_account()
    .then(response => {
      accountlist.value = response.data.data
    })
    .catch(error => {
      console.error('Error :', error)
    })
}

const update_store_isActive = async v => {
  try {
    const data = await $api("https://api-test.iservreport.com/api/backend/update_store_isActive/"+v.id, {
      method: "PUT",
      body: {
        isActive: v.Active ? "Y" : "N",
      },
    })

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
  const ids = [val.account_id, val.account_type_id, val.group_customer_id]

  router.push({ 
    path: '/pages/map-storecompliance', 
    query: { ids: val.id }, 

    // query: { ids: ids.join(',') } 
  })
}

const delete_MapStoreCompliance = async val => {
  await apiService.delete_MapStoreCompliance(val.id)
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

// const editdata = async val => {
//   // data_id.value = val.id;
//   // data_name.value = val.name;
//   const ids = [1, 2, 3];
//   this.$router.push({ 
//     path: '/pages/map-store', 
//     query: { ids: ids.join(',') } 
//   });
// }
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate()
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
        const data = await $api("https://api-test.iservreport.com/api/backend/update_store/"+data_id.value, {
          method: "PUT",
          body: {
            name: data_name.value,
          },
        })
      } else {
        const data = await $api("https://api-test.iservreport.com/api/backend/create_store/", {
          method: "POST",
          body: {
            name: data_name.value,
          },
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
 
  const data = []

  filtereddatalist.value.forEach((item, key) => {
    var MapUserStorelist = {
      user_code: '',
      user_name: '',
      user_lastname: '',
    }
    if(item.MapUserStorelist.length > 0){
      MapUserStorelist.user_code = item.MapUserStorelist[0].user_code
      MapUserStorelist.user_name = item.MapUserStorelist[0].user_name
      MapUserStorelist.user_lastname = item.MapUserStorelist[0].user_lastname
    }
    item.mapStoreComplianceList.forEach((item2, key2) => {
      data.push({
        'ลำดับ': key + 1,
        'กลุ่มลูกค้า': item.store.groupCustomer.name,
        'รหัสพนักงาน': MapUserStorelist.user_code,
        'ชื่อ': MapUserStorelist.user_name,
        'นามสกุล': MapUserStorelist.user_lastname,
        'Outlet': item.store.account.name,
        'รหัสสโตร์': item.store.store_code,
        'สาขา': item.store.store_name,
        'จังหวัด': item.store.provinces.name_in_thai,
        'Account Type': item.store.accountType.name,
        'Group Name': item.name,
        'ลำดับสินค้า': item.num,
        'สินค้า': item2.product.name,
        'ตำแหน่งที่วาง': item2.placementPoint.name,
        'พื้นที่เช่า': item2.rentalAreaUnit.name,
        'จำนวน': item2.qty,
        'หน่วย': item2.rentalAreaUnit.unit,
        'วันเริ่มต้น': item2.startdate,
        'วันสิ้นสุด': item2.enddate,
      })
    })
  })

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'MapStoreToCompliancelist.xlsx')
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
            Export
          </VBtn>
          <RouterLink
            to="/pages/map-storecompliance"
            class=""
          >
            <VBtn
              color="primary"
              prepend-icon="tabler-plus"
            >
              เพิ่ม
            </VBtn>
          </RouterLink>
        </VCol>
      </VRow>
    </VCardText>

    <!-- 👉 Data Table  -->
    <VDataTable
      :headers="headers"
      :items="filtereddatalist"
      :items-per-page="50"
      expand-on-click
    >
      <template #item.Account="{ item }">
        {{ item.store.account.name }}
      </template>
      <template #item.StoreCode="{ item }">
        {{ item.store.store_code }}
      </template>
      <template #item.StoreName="{ item }">
        {{ item.store.store_name }}
      </template>
    
      <!-- Expanded Row Data -->
      <template #expanded-row="slotProps">
        <tr
          class="v-data-table__tr"
          style="background-color: rgb(244 244 244);"
        >
          <td :colspan="headers.length">
            <!-- <div v-for="(v,i) in slotProps.item.mapStoreComplianceList" :key="i" > -->
            <div :style="'overflow: auto;height: '+(slotProps.item.mapStoreComplianceList.length == 1?'95px':(slotProps.item.mapStoreComplianceList.length == 2?'190px':(slotProps.item.mapStoreComplianceList.length == 3?'277px':(slotProps.item.mapStoreComplianceList.length >= 4?'375px':'auto'))))+';'">
              <div
                v-for="(v,i) in slotProps.item.mapStoreComplianceList"
                :key="i"
                style="border-block-end: 1px solid rgb(162 162 162);"
              >
                <div style="display: flex;align-items: center;justify-content: start;">
                  <VCol
                    cols="12"
                    md="5"
                  >
                    <VCol
                      cols="12"
                      md="12"
                    >
                      ชื่อรายการ:{{ v.mapStoreCompliance.name }} <br>
                      {{ v.product.name }}
                    </VCol>
                  </VCol>
                  <VCol
                    cols="12"
                    md="7"
                  >
                    <VRow>
                      <VCol
                        cols="12"
                        md="6"
                      >
                        ตำแหน่งที่วาง : {{ v.placementPoint.name }}
                      </VCol>
                        
                      <VCol
                        cols="6"
                        md="6"
                        class="d-flex align-self-end"
                      >
                        พื้นที่เช่า : {{ v.rentalAreaUnit.name }}
                      </VCol>
                      <VCol
                        cols="6"
                        md="3"
                        class="d-flex align-self-end"
                      >
                        จำนวน : {{ v.qty }}
                      </VCol>
                      <VCol
                        cols="6"
                        md="3"
                        class="d-flex align-self-end"
                      >
                        หน่วย : {{ v.rentalAreaUnit.unit }}
                      </VCol>
                      <VCol
                        cols="6"
                        md="3"
                      >
                        วันเริ่มต้น : {{ v.startdate }}
                      </VCol>
                      <VCol
                        cols="6"
                        md="3"
                      >
                        วันสิ้นสุด : {{ v.enddate }}
                      </VCol>
                    </VRow>
                  </VCol>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
    
      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon
            icon="tabler-edit"
            @click="editdata(item)"
          />
        </IconBtn>
        <IconBtn>
          <VIcon
            icon="tabler-trash"
            @click="delete_MapStoreCompliance(item)"
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
                <AppTextField
                  v-model="data_name"
                  label="พื้นที่"
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
                    href="/file_upload/mapstoretocompliance.xlsx"
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
