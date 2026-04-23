<script setup>

import apiService from '@/services/api';
import {
  ref
} from 'vue';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


const isDialogVisible = ref(false)
const loading = ref(true)

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const totalrecord = ref(0)
const refForm = ref()
const group_customerlist = ref([])
const group_customer_id = ref(null)

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


const search = ref('')

const headers = [
  {
    title: 'id',
    key: 'num',
  },
  {
    title: 'กลุ่มลูกค้า',
    key: 'group_customer',
  },
  {
    title: 'ชื่อ',
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
onMounted(() => {
  getall();
  get_all_group_customer();
})
const getall = async () => {
  loading.value = true
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_brand(form)
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
    })
    .catch(error => {
      console.error('Error :', error);
    });

 
  loading.value = false
}
const get_all_group_customer = async () => {
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_group_customer(form)
    .then(response => {
      group_customerlist.value = response.data.data
    })
    .catch(error => {
      console.error('Error :', error);
    });
}
const update_isActive = async v => {
  try {
    
    await apiService.update_brand_isActive(v.id, {isActive: v.Active ? "Y" : "N"})

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
  group_customer_id.value = val.group_customer_id;
  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  data_name.value = '';
  group_customer_id.value = '';
  isDialogVisible.value = true
}
const save = async () => {
  try {
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      if (data_id.value != '') {
        // มี id แสดงว่าเป็นการแก้ไข
        await apiService.update_brand(data_id.value, {
          name: data_name.value,
          group_customer_id: group_customer_id.value
        })
      } else {
        // ไม่มี id แสดงว่าเป็นการเพิ่มใหม่
        await apiService.create_brand({
          name: data_name.value,
          group_customer_id: group_customer_id.value
        })
      }
      isDialogVisible.value = false
      Swal.fire({
        title: 'บันทึกสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      getall(); // reload ข้อมูล
    }
  } catch (err) {
    console.error(err)
  }
}
const exportToExcel = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'Group Customer': item.group_customer.name,
    'Brand': item.name,
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No'
  }));

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'Master Brand.xlsx');
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
    <template #item.group_customer="{ item }">
        {{ item.group_customer.name }}
      </template>

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
              <AppAutocomplete
                  label="กลุ่มลูกค้า"
                  v-model="group_customer_id"
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
