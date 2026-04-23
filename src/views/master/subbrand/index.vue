<script setup>

import apiService from '@/services/api';
import {
  ref
} from 'vue';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const isDialogVisible = ref(false)
const loading = ref(true)
const brand_id = ref(null)
const group_customer_id = ref(null)

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const brandlist = ref([])

const totalrecord = ref(0)
const refForm = ref()
const userData = useCookie('userData')

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    
    return (
      item.name.toLowerCase().includes(searchText) || 
      item.brand.name.toLowerCase().includes(searchText) || 
      item.brand.group_customer.name.toLowerCase().includes(searchText)
    )
  })
})
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
onMounted(() => {
  get_all_sub_brand();
  get_all_brand();
})
const get_all_sub_brand = async () => {
  loading.value = true
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_sub_brand(form)
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.data.length
      datalist.value.forEach((item, index) => {
        datalist.value[index].Active = (item.isActive=='Y'?true:false)
        datalist.value[index].num = index+1
      });
    })
    .catch(error => {
      console.error('Error :', error);
    });
  loading.value = false
}
const get_all_brand = async () => {
  loading.value = true
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_brand(form)
    .then(response => {
      brandlist.value = response.data.data
      totalrecord.value = response.data.data.length
      brandlist.value.forEach((item, index) => {
        brandlist.value[index].Active = (item.isActive=='Y'?true:false)
        brandlist.value[index].num = index+1
      });
    })
    .catch(error => {
      console.error('Error :', error);
    });
  loading.value = false
}

const exportToExcel = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'Brand': item.brand.name,
    'Sub Brand': item.name,
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No'
  }));

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'Master Sub Brand.xlsx');
};

const search = ref('')

const headers = [
  {
    title: 'id',
    key: 'num',
  },
  {
    title: 'กลุ่มลูกค้า',
    key: 'brand.group_customer',
  },
  {
    title: 'Brand',
    key: 'brand',
  },
  {
    title: 'Sub Brand',
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
const getall = async () => {
  loading.value = true
 
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_sub_brand(form)
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.data.length
      datalist.value.forEach((item, index) => {
        datalist.value[index].Active = (item.isActive=='Y'?true:false)
        datalist.value[index].num = index+1
      });
    })
    .catch(error => {
      console.error('Error :', error);
    });
  loading.value = false
}
const update_brand_isActive = async v => {
  try {
    
    await apiService.update_sub_brand_isActive(v.id, {isActive: v.Active ? "Y" : "N"})

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
  brand_id.value = val.brand_id;
  group_customer_id.value = val.group_customer_id;

  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  data_name.value = '';
  brand_id.value = null;
  group_customer_id.value = null;
  isDialogVisible.value = true
}
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
        

          await apiService.update_sub_brand(data_id.value, {name: data_name.value})
      } else {
       

          await apiService.create_sub_brand({brand_id: brand_id.value, name: data_name.value ,group_customer_id: group_customer_id.value})
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
const get_customer_id = async () => {
  // หา brand ที่ตรงกับ brand_id.value
  const selectedBrand = brandlist.value.find(brand => brand.id === brand_id.value);

  if (selectedBrand) {
    group_customer_id.value = selectedBrand.group_customer_id;
  } else {
    console.log("Brand not found.");
    return null;
  }
}
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
      :items="filtereddatalist || []"
      :search="search"
      :items-per-page="10"
      class="text-no-wrap"
    >
      <template #item.brand.group_customer="{ item }">
        {{ item.brand.group_customer.name }}
      </template>
      <template #item.brand="{ item }">
        {{ item.brand.name }}
      </template>

      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_brand_isActive(item)"
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
            >{{group_customer_id}}
              <AppAutocomplete
                  label="Brand"
                  v-model="brand_id"
                  :items="brandlist"
                  item-title="name"
                  item-value="id"
                  placeholder="Select"
                  :rules="[requiredValidator]"
                  @update:modelValue="get_customer_id()"
              />
            </VCol>
            <VCol
              cols="12"
              sm="12"
              md="12"
            >
              <AppTextField
                v-model="data_name"
                label="Sub Brand"
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
