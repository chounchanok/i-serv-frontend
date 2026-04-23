<script setup>

import apiService from '@/services/api';
import {
  ref
} from 'vue';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const isDialogVisible = ref(false)
const importmodal = ref(false)

const loading = ref(true)
const group_customer_id = ref(null)

const data_id = ref('')
const data_code = ref('')
const data_name = ref('')
const datalist = ref([])
const group_customer_list = ref([])

const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    
    return (
      item.code.toLowerCase().includes(searchText) || 
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

const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
await apiService.get_all_promotion(form)
.then(response => {
  datalist.value = response.data.data
  totalrecord.value = datalist.length
  datalist.value.forEach((item, index) => {
    datalist.value[index].Active = (item.isActive=='Y'?true:false)
    datalist.value[index].num = index+1
  });
})
.catch(error => {
  console.error('Error :', error);
});

await apiService.get_all_group_customer()
.then(response => {
  group_customer_list.value = response.data.data
  totalrecord.value = group_customer_list.length
  group_customer_list.value.forEach((item, index) => {
    group_customer_list.value[index].Active = (item.isActive=='Y'?true:false)
    group_customer_list.value[index].num = index+1
  });
})
.catch(error => {
  console.error('Error :', error);
});


const fileupload = ref(null);
const selectedFile = ref(null)
const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  console.log('Selected file:', selectedFile.value);
  setTimeout(() => {
    submitFile();
  }, 200);
  
};
const submitFile = async () => {
  console.log(selectedFile.value);
  if (!selectedFile.value) {
    alert("Please select a file first");
  } else {
    const formData = new FormData();
    formData.append('file_excel', selectedFile.value);

    let timerInterval;
    Swal.fire({
      title: "กำลัง Import กรุณารอสักครู่!",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });

    await apiService.import_promotion(formData)
    .then(response => {
      Swal.fire({
        title: 'Import successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      getall();
      fileupload.value = null
      selectedFile.value = null
    })
    .catch(error => {
      console.error('Error :', error);
    });
  }
};
const selectFile = async () => {
importmodal.value = true
}
const selectFile2 = async () => {
fileupload.value.click();
}

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
    title: 'Promotion Code',
    key: 'code',
  },
  {
    title: 'Promotion Name',
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
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_promotion(form)
  .then(response => {
    datalist.value = response.data.data
    totalrecord.value = datalist.length
    datalist.value.forEach((item, index) => {
      datalist.value[index].Active = (item.isActive=='Y'?true:false)
      datalist.value[index].num = index+1
    });
  })
  .catch(error => {
    console.error('Error :', error);
  });
}
const update_promotion_isActive = async v => {
  try {
    
    await apiService.update_promotion_isActive(v.id, {isActive: v.Active ? "Y" : "N"})
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
  data_code.value = val.code;
  data_name.value = val.name;
  group_customer_id.value = val.group_customer_id;
  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  data_code.value = '';
  data_name.value = '';
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
          
          await apiService.update_promotion(data_id.value, {
            group_customer_id: userData.value.group_customer_id,
            code: data_code.value,
            name: data_name.value
          })
      } else {
          
          await apiService.create_promotion({
            group_customer_id: userData.value.group_customer_id,
            code: data_code.value,
            name: data_name.value
          })
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
    'กลุ่มลูกค้า': item.group_customer.name,
    'Promotion Code': item.code,
    'Promotion Name': item.name,
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No'
  }));

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'Master Promotion.xlsx');
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
          <div style="margin-bottom:10px;">
            <input type="file" ref="fileupload" @change="handleFileUpload" style="display: none;">
          </div>
          <!-- <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
            class="mr-1"
            @click="selectFile"
          >
            Import
          </VBtn> -->
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
      <template #item.group_customer="{ item }">
        {{ item.group_customer.name }}
      </template>

      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_promotion_isActive(item)"
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
                  :items="group_customer_list"
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
                v-model="data_code"
                label="Promotion code"
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
                label="Promotion name"
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

    <VDialog v-model="importmodal" max-width="1000">
      <DialogCloseBtn @click="importmodal = !importmodal" />

      <!-- Dialog Content -->
      <VCard title="การ Import">
        <VForm
          ref="refForm"
          @submit.prevent="save"
        >
        <VCardText>
          <VRow>
            <VCol cols="6" sm="6" md="6">
              <div style="border: 2px dashed #ccc; height: 150px; display: flex; justify-content: center; align-items: center;">
                <VBtn variant="tonal" color="secondary"  class="mr-2" :href="'/file_upload/promotion.xlsx'" download> 
                  Download Template
                </VBtn>
              </div>
            </VCol>
            <VCol cols="6" sm="6" md="6">
              <div style="border: 2px dashed #ccc; height: 150px; display: flex; justify-content: center; align-items: center;">
             
                <VBtn variant="tonal" color="secondary" @click="selectFile2">
                  Import
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
        </VCardText>
        </VForm>
      </VCard>

    </VDialog>
  </VCard>
</template>
