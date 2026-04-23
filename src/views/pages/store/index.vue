<script setup>

import { computed, nextTick, ref, watch } from 'vue';

import apiService from '@/services/api';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const isDialogVisible = ref(false)
const importmodal = ref(false)

const loading = ref(true)

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const totalrecord = ref(0)
const refForm = ref()

const group_customer_id = ref(null)
const channel_id = ref(null)
const store_code = ref(null)
const store_name = ref(null)
const store_name_report = ref(null)
const account_id = ref(null)
const account_type_id = ref(null)
const provinces_id = ref(null)

const masterdata_channel = ref([])
const masterdata_account = ref([])
const masterdata_account_type = ref([])
const masterdata_provinces = ref([])
const group_customerlist = ref([])

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase();

    const nameMatch = item.name?.toLowerCase().includes(searchText) || false;

    const groupCustomer = item.groupCustomer?.name?.toLowerCase().includes(searchText) || false;
    const channel = item.channel?.name?.toLowerCase().includes(searchText) || false;
    const store_code = item.store_code?.toLowerCase().includes(searchText) || false;
    const store_name = item.store_name?.toLowerCase().includes(searchText) || false;
    const store_name_report = item.store_name_report?.toLowerCase().includes(searchText) || false;
    const account = item.account?.name?.toLowerCase().includes(searchText) || false;
    const accountType = item.accountType?.name?.toLowerCase().includes(searchText) || false;
    const provinces = item.provinces?.name?.toLowerCase().includes(searchText) || false;

    return nameMatch || groupCustomer || channel || store_code || store_name || store_name_report || account || accountType || provinces;
  });
})
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const userData = useCookie('userData')
onMounted(() => {
  get_all_store();
  get_all_group_customer();

  master_store();
})
const get_all_store = async () => {
  const form = {
      position_name: userData.value.position_name,
      group_customer_id: userData.value.group_customer_id,
    };
  await apiService.get_all_store(form)
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
const master_store = async () => {
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.master_store(form)
  .then(response => {
    masterdata_channel.value = response.data.masterData.channels
    masterdata_account.value = response.data.masterData.accounts
    masterdata_account_type.value = response.data.masterData.accountTypes
    masterdata_provinces.value = response.data.masterData.provinces
  })
  .catch(error => {
    console.error('Error :', error);
  });
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
  // await apiService.get_all_group_customer()
  // .then(response => {
  //   group_customerlist.value = response.data.data
  // })
  // .catch(error => {
  //   console.error('Error :', error);
  // });
}

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

    await apiService.import_store(formData)
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
    key: 'groupCustomer',
  },
  {
    title: 'Channel',
    key: 'channel',
  },
  {
    title: 'Store Code',
    key: 'store_code',
  },
  {
    title: 'Store name',
    key: 'store_name',
  },
  {
    title: 'Store name (for report)',
    key: 'store_name_report',
  },
  {
    title: 'Account',
    key: 'account',
  },
  {
    title: 'Account Type',
    key: 'accountType',
  },
  {
    title: 'Province',
    key: 'provinces',
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
  await apiService.get_all_store(form)
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
const update_store_isActive = async v => {
  try {
    
    await apiService.update_store_isActive(v.id, {
      isActive: v.Active ? "Y" : "N",
    });
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
  group_customer_id.value = val.group_customer_id;
  channel_id.value = val.channel_id;
  store_code.value = val.store_code;
  store_name.value = val.store_name;
  store_name_report.value = val.store_name_report;
  account_id.value = val.account_id;

  // รอให้ filtered_account_types อัปเดตก่อนค่อยเซ็ต account_type_id
  await nextTick();
  account_type_id.value = val.account_type_id;

  provinces_id.value = val.provinces_id;
  isDialogVisible.value = true;
}
const openmodal = async () => {
  data_id.value = '';
  group_customer_id.value = '';
  channel_id.value = '';
  store_code.value = '';
  store_name.value = '';
  store_name_report.value = '';
  account_id.value = '';
  account_type_id.value = '';
  provinces_id.value = '';
  isDialogVisible.value = true
}
const exportToExcel = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'ID': item.id,
    'group_customer_id': item.groupCustomer.name,
    'channel_id': item.channel.name,
    'store_code': item.store_code,
    'store_name': item.store_name,
    'store_name_report': item.store_name_report,
    'account_id': item.account.name,
    'account_type_id': item.accountType.name,
    'provinces_id': item.provinces.name_in_thai,
  }));

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'Store.xlsx');
};
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      
      if(data_id.value != ""){
        
          const form = {
              group_customer_id: group_customer_id.value,
              channel_id: channel_id.value,
              store_code: store_code.value,
              store_name: store_name.value,
              store_name_report: store_name_report.value,
              account_id: account_id.value,
              account_type_id: account_type_id.value,
              provinces_id: provinces_id.value,
            }

            await apiService.update_store(data_id.value, form)

      } else {
          const data = {
            group_customer_id: group_customer_id.value,
            channel_id: channel_id.value,
            store_code: store_code.value,
            store_name: store_name.value,
            store_name_report: store_name_report.value,
            account_id: account_id.value,
            account_type_id: account_type_id.value,
            provinces_id: provinces_id.value,
          };
          
          await apiService.create_store(data)
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
function customFilter(itemTitle, queryText, item) {
  const textOne = item.raw.name.toLowerCase()
  const textTwo = item.raw.abbr.toLowerCase()
  const searchText = queryText.toLowerCase()

  return textOne.includes(searchText) || textTwo.includes(searchText)
}

// ฟิลเตอร์ account_type ตาม account_id
const filtered_account_types = computed(() => {
  return masterdata_account_type.value.filter(
    item => item.account_id === account_id.value
  )
})

// รีเซ็ตค่า account_type_id เมื่อเปลี่ยน account_id
watch(account_id, () => {
  account_type_id.value = null
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
            prepend-icon="tabler-download"
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
        {{ item.groupCustomer.name }}
      </template>
      <template #item.channel="{ item }">
        {{ item.channel.name }}
      </template>

      <template #item.account="{ item }">
        {{ item.account.name }}
      </template>
      <template #item.accountType="{ item }">
        {{ item.accountType.name }}
      </template>
      <template #item.provinces="{ item }">
        {{ item.provinces.name_in_thai }}
      </template>
      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_store_isActive(item)"
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
            <VCol cols="12" sm="12" md="12">
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
            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                label="Channel"
                v-model="channel_id"
                :items="masterdata_channel"
                item-title="name"
                item-value="id"
                clearable 
                clear-icon="tabler-x"
                placeholder="เลือก"
                    
              />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                label="Store Code"
                v-model="store_code"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                label="Store name"
                v-model="store_name"
                :rules="[requiredValidator]"
                    
              />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                label="Store name (for report)"
                v-model="store_name_report"
                :rules="[requiredValidator]"
                    
              />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                label="Account"
                v-model="account_id"
                :items="masterdata_account"
                item-title="name"
                item-value="id"
                placeholder="เลือก"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                label="Account Type"
                v-model="account_type_id"
                :items="filtered_account_types"
                item-title="name"
                item-value="id"
                placeholder="เลือก"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                label="Province"
                v-model="provinces_id"
                :items="masterdata_provinces"
                item-title="name_in_thai"
                item-value="id"
                placeholder="เลือก"
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
              <div style=" display: flex; align-items: center; justify-content: center;border: 2px dashed #ccc; block-size: 150px;">
                <VBtn variant="tonal" color="secondary"  class="mr-2" :href="'/file_upload/store.xlsx'" download>
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
