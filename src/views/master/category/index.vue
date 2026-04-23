<script setup>

import {
    ref
} from 'vue';
import apiService from '@/services/api';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const isDialogVisible = ref(false)
const loading = ref(true)

const data_id = ref('')
const data_name = ref('')
const data_description = ref('')
const datalist = ref([])
const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchText) || 
      item.description.toLowerCase().includes(searchText)
    )
  })
})
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const userData = useCookie('userData')

onMounted(() => {
  get_all_category();
})
const get_all_category = async () => {
  loading.value = true
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_category(form)
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.data.length
      datalist.value = datalist.value
      .filter(item => item.id) // ✅ ลบรายการที่ไม่มี `id`
      .map((item, index) => ({
        ...item, // ✅ คงค่าเดิมไว้
        Active: item.isActive === 'Y', // ✅ แปลงเป็น `true` หรือ `false`
        num: index + 1 // ✅ กำหนดเลขลำดับ
      }));
      loading.value = false
    })
    .catch(error => {
      console.error('Error :', error);
      loading.value = false

    });
}

const search = ref('')

const headers = [
  {
    title: 'id',
    key: 'num',
  },
  {
    title: 'ชื่อ',
    key: 'name',
  },
  {
    title: 'รายละเอียด',
    key: 'description',
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
const getall = async () => {
  loading.value = true
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_category(form)
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.data.length
      datalist.value = datalist.value
      .filter(item => item.id) // ✅ ลบรายการที่ไม่มี `id`
      .map((item, index) => ({
        ...item, // ✅ คงค่าเดิมไว้
        Active: item.isActive === 'Y', // ✅ แปลงเป็น `true` หรือ `false`
        num: index + 1 // ✅ กำหนดเลขลำดับ
      }));
      loading.value = false
    })
    .catch(error => {
      console.error('Error :', error);
      loading.value = false

    });

  
  loading.value = false
}
const update_isActive = async v => {
  try {
   
    await apiService.update_category_isActive(v.id, {isActive: v.Active ? "Y" : "N"})
    Swal.fire({
      title: 'Update successfully!',
      icon: 'success',
      confirmButtonText: 'OK'
    })
    getall();
  } catch (err) {
    console.error(err)
  }
}
const editdata = async val => {
  data_id.value = val.id;
  data_name.value = val.name;
  data_description.value = val.description;
  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  data_name.value = '';
  data_description.value = '';
  isDialogVisible.value = true
}
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
          
          await apiService.update_category(data_id.value, {name: data_name.value,description: data_description.value})
      } else {
          
          await apiService.create_category({name: data_name.value,description: data_description.value,group_customer_id: userData.value.group_customer_id})
      }
      isDialogVisible.value = false
      Swal.fire({
        title: 'บันทึกสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      getall(); // โหลดข้อมูลใหม่
    }
  } catch (err) {
    console.error(err)
  }
}
const exportToExcel = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'ชื่อ': item.name,
    'รายละเอียด': item.description,
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No'
  }));

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'Master Category.xlsx');
};
function customFilter(itemTitle, queryText, item) {
  const textOne = item.raw.name.toLowerCase()
  const textTwo = item.raw.abbr.toLowerCase()
  const searchText = queryText.toLowerCase()

  return textOne.includes(searchText) || textTwo.includes(searchText)
}
</script>

<template>
  <VCard
    >
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
          @change="update_isActive(item)"
        />
      </template>
    

      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-edit" @click="editdata(item)"/>
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
                label="ชื่อ"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              sm="12"
              md="12"
            >
              <AppTextField
                v-model="data_description"
                label="รายละเอียด"
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
