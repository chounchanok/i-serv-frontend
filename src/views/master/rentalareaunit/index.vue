<script setup>

import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue';

import apiService from '@/services/api';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const isDialogVisible = ref(false)
const loading = ref(true)
const importmodal = ref(false)

const data_id = ref('')
const data_name = ref('')
const data_unit = ref('')
const group_customer_id = ref(null)
const search = ref('')
const datalist = ref([])
const group_customerlist = ref([])
const accountlist = ref([])
const account_id = ref('')

const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')

const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchText) || 
      item.unit.toLowerCase().includes(searchText) || 
      item.groupCustomer.name.toLowerCase().includes(searchText) 
    )
  })
})
// console.log('filtereddatalist:', filtereddatalist)

onMounted(() => {
  get_all_group_customer();
  get_all_account();
  getall();
})

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

    loading.value = true
    await apiService.import_RentalAreaUnit(formData)
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
    loading.value = false
    
  }
};
const selectFile = async () => {
importmodal.value = true
}
const selectFile2 = async () => {
fileupload.value.click();
}
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
    title: 'Account',
    key: 'account',
  },
  {
    title: 'ชื่อ',
    key: 'name',
  },
  // {
  //   title: 'Type',
  //   key: 'type',
  // },
  {
    title: 'หน่วย',
    key: 'unit',
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
  // await apiService.get_all_group_customer()
  // .then(response => {
  //   group_customerlist.value = response.data.data
  // })
  // .catch(error => {
  //   console.error('Error :', error);
  // });
}
const get_all_account = async () => {
  await apiService.get_all_account()
  .then(response => {
    accountlist.value = response.data.data
  })
  .catch(error => {
    console.error('Error :', error);
  });
}
const getall = async () => {
  loading.value = true
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_rental_area_unit_n(form)
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.length
      datalist.value.forEach((item, index) => {
        datalist.value[index].Active = (item.isActive=='Y'? true:false)
        datalist.value[index].num = index+1
      });
    })
    .catch(error => {
      console.error('Error :', error);
    });
  loading.value = false
}
const update_rental_area_unit_isActive = async v => {
  loading.value = true
  const form = {
    isActive: v.Active ? "Y" : "N",
  };
  await apiService.update_rental_area_unit_isActive(v.id,form)
    .then(response => {
      Swal.fire({
        title: 'Update successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      getall();
    })
    .catch(error => {
      console.error('Error :', error);
    });
  loading.value = false
}
const editdata = async val => {
  data_id.value = val.id;
  group_customer_id.value = val.group_customer_id;
  account_id.value = val.account_id;
  data_name.value = val.name;
  data_unit.value = val.unit;
  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  group_customer_id.value = null;
  account_id.value = '';
  data_name.value = '';
  data_unit.value = '';
  isDialogVisible.value = true
}
const isSaving = ref(false);
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    isSaving.value = true; // Disable ปุ่ม Save
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      const form = {
        group_customer_id: group_customer_id.value,
        account_id: account_id.value,
        name: data_name.value,
        unit: data_unit.value
      };
      if(data_id.value != ""){
        await apiService.update_rental_area_unit(data_id.value,form)
        .then(response => {
          Swal.fire({
            title: 'บันทึกสำเร็จ!',
            icon: 'success',
            confirmButtonText: 'OK'
          })
          getall();
          isDialogVisible.value = false
        })
        .catch(error => {
          console.error('Error :', error);
        });
        
      } else {
        await apiService.create_rental_area_unit(form)
        .then(response => {
          Swal.fire({
            title: 'บันทึกสำเร็จ!',
            icon: 'success',
            confirmButtonText: 'OK'
          })
          getall();
          isDialogVisible.value = false
        })
        .catch(error => {
          console.error('Error :', error);
        });
       
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    isSaving.value = false; // Enable ปุ่ม Save กลับ
  }
}
const exportToExcel = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'กลุ่มลูกค้า': item.groupCustomer.name,
    'Account': item.account_id==0?'ทั้งหมด':item.account?.name,
    'ชื่อ': item.name,
    'หน่วย': item.unit,
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No'
  }));

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'Master Rental Area Unit.xlsx');
};
const filteredAccountList = computed(() => {
  if (!group_customer_id.value) return accountlist.value
  return accountlist.value.filter(acc => acc.group_customer_id === group_customer_id.value)
})

watch(group_customer_id, () => {
  account_id.value = ''
})
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
        
        <div style="margin-block-end: 10px;">
            <input type="file" ref="fileupload" @change="handleFileUpload" style="display: none;">
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
        {{item.groupCustomer.name}}
      </template>
      <template #item.type="{ item }">
        {{item.type}}
      </template>
      <template #item.account="{ item }">
        {{(item.account_id==0?'ทั้งหมด':item.account?.name)}}
      </template>
      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_rental_area_unit_isActive(item)"
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
                  placeholder="เลือก"
                  :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              sm="12"
              md="12"
            >
              <AppAutocomplete
                  label="Account"
                  v-model="account_id"
                  :items="filteredAccountList"
                  item-title="name"
                  item-value="id"
                  placeholder="เลือก"
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
            <VCol
              cols="12"
              sm="12"
              md="12"
            >
              <AppTextField
                v-model="data_unit"
                label="หน่วย"
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
          <VBtn @click="save" :disabled="isSaving">
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
              <div style=" display: flex; align-items: center; justify-content: center;border: 2px dashed #ccc; block-size: 150px;">
                <VBtn variant="tonal" color="secondary"  class="mr-2" :href="'/file_upload/rentalareaunit.xlsx'" download> 
                  Download Template
                </VBtn>
              </div>
            </VCol>
            <VCol cols="6" sm="6" md="6">
              <div style=" display: flex; align-items: center; justify-content: center;border: 2px dashed #ccc; block-size: 150px;">
             
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

