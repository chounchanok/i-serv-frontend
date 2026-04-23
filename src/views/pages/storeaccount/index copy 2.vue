<script setup>

import {
  onMounted,
  ref,
} from 'vue';

import apiService from '@/services/api';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const isDialogVisible = ref(false)
const loading = ref(true)
const group_customer_id = ref(null)
const account_id = ref(null)
const account_type_id = ref(null)

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const group_customerlist = ref([])
const accountlist = ref([])
const accounttypelist = ref([])

const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()

    const groupCustomer = item.groupCustomer && item.groupCustomer.name ? item.groupCustomer.name.toLowerCase().includes(searchText) : false
    const account = item.account && item.account.name ? item.account.name.toLowerCase().includes(searchText) : false
    const accounttype = item.accounttype && item.accounttype.name ? item.accounttype.name.toLowerCase().includes(searchText) : false
    
    return groupCustomer || account || accounttype
  })
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

    await apiService.import_StoreToAccount(formData)
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
    title: 'Account',
    key: 'account',
  },
  {
    title: 'Account Type',
    key: 'accounttype',
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
  get_all_account();
  get_all_account_type();
})
const getall = async () => {
  loading.value = true
  await apiService.get_all_StoreToAccount()
    .then(response => {
      datalist.value = response.data.data
      totalrecord.value = response.data.length
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
const get_all_account_type = async () => {
  await apiService.get_all_account_type()
  .then(response => {
    accounttypelist.value = response.data.data
  })
  .catch(error => {
    console.error('Error :', error);
  });
}
const update_StoreToAccount_isActive = async v => {
  const form = {
    isActive: v.Active ? "Y" : "N",
  };
  await apiService.update_StoreToAccount_isActive(v.id,form)
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
}
const editdata = async val => {
  data_id.value = val.id;
  group_customer_id.value = val.group_customer_id;
  account_id.value = val.account_id;
  account_type_id.value = val.account_type_id;

  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  group_customer_id.value = null;
  account_id.value = null;
  account_type_id.value = null;

  isDialogVisible.value = true
}
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
        const form = {
          group_customer_id: group_customer_id.value,
          account_id: account_id.value,
          account_type_id: account_type_id.value,
        };
        await apiService.update_StoreToAccount(data_id.value,form)
        .then(response => {
          
        })
        .catch(error => {
          console.error('Error :', error);
        });
      } else {
        const form = {
          group_customer_id: group_customer_id.value,
          account_id: account_id.value,
          account_type_id: account_type_id.value,
        };
        await apiService.create_StoreToAccount(form)
        .then(response => {
          
        })
        .catch(error => {
          console.error('Error :', error);
        });
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

// ฟังก์ชันสำหรับส่งออกเป็น Excel
const exportToExcel = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'กลุ่มลูกค้า': item.groupCustomer.name,
    'Account': item.account.name,
    'Account Type': item.accounttype.name,
    'Is Active': item.isActive ? 'Yes' : 'No'
  }));

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'data.xlsx');
};
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
        {{item.groupCustomer.name}}
      </template>
      <template #item.account="{ item }">
        {{item.account.name}}
      </template>
      <template #item.accounttype="{ item }">
        {{item.accounttype.name}}
      </template>
      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_StoreToAccount_isActive(item)"
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
              <AppAutocomplete
                  label="Account"
                  v-model="account_id"
                  :items="accountlist"
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
                  label="Account Type"
                  v-model="account_type_id"
                  :items="accounttypelist"
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
  </VCard>
</template>
