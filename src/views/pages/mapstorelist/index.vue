<script setup>

import {
  onMounted,
  ref
} from 'vue';

import apiService from '@/services/api';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';

const router = useRouter();
const isDialogVisible = ref(false)
const importmodal = ref(false)

const loading = ref(true)

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const accountlist = ref([])

const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchText) || 
      item.account.name.toLowerCase().includes(searchText) || 
      item.accountType.name.toLowerCase().includes(searchText) || 
      item.groupCustomer.name.toLowerCase().includes(searchText)
    )
  })
})
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const userData = ref({})
onMounted(() => {
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

    await apiService.import_productTostore(formData)
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
    title: '',
    key: 'data-table-expand',
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
    title: 'Group name',
    key: 'name',
  },
  {
    title: 'กลุ่มลูกค้า',
    key: 'groupCustomer',
  },
  {
    title: 'จัดการ',
    key: 'actions',
    sortable: false,
  },
]
const getall = async () => {
  var userDatax = useCookie('userData')
  userData.value = userDatax._value
  
  var form = {
    code:userData.value.code,
    position_id:userData.value.position_id,
    position_name:userData.value.position_name,
    group_customer_id:userData.value.group_customer_id
  }
  console.log(form);
  await apiService.get_all_MapProductStore(form)
  .then(response => {
    datalist.value = response.data.data
    totalrecord.value = response.data.data.length
    datalist.value.forEach((item, index) => {
      datalist.value[index].Active = (item.isActive=='Y'?true:false)
      datalist.value[index].num = index+1
      item.mapProductStoreList.forEach((item2, index2) => {
        datalist.value[index].mapProductStoreList[index2].oos = (item2.oos=='Y'?true:false)
        datalist.value[index].mapProductStoreList[index2].price = (item2.price=='Y'?true:false)
        datalist.value[index].mapProductStoreList[index2].offtake = (item2.offtake=='Y'?true:false)
        datalist.value[index].mapProductStoreList[index2].week = (item2.week=='Y'?true:false)
        datalist.value[index].mapProductStoreList[index2].area = (item2.area=='Y'?true:false)
        datalist.value[index].mapProductStoreList[index2].msl = (item2.msl=='Y'?true:false)
        datalist.value[index].mapProductStoreList[index2].stock = (item2.stock=='Y'?true:false)

      });
    });
  })
  .catch(error => {
    console.error('Error :', error);
  });
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
const update_store_isActive = async v => {
  try {
    const data = await $api("https://api-test.iservreport.com/api/backend/update_store_isActive/"+v.id, {
        method: "PUT",
        body: {
          isActive: v.Active ? "Y" : "N",
        },
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
const editdata = async (val) => {
  const ids = [val.account_id, val.account_type_id, val.group_customer_id];
  router.push({ 
    path: '/pages/map-store', 
    query: { ids: val.id } 
    // query: { ids: ids.join(',') } 
  });
};
const delete_MapProductStore = async (val) => {
  await apiService.delete_MapProductStore(val.id)
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
};
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
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
          const data = await $api("https://api-test.iservreport.com/api/backend/update_store/"+data_id.value, {
            method: "PUT",
            body: {
              name: data_name.value
            },
          });
      } else {
          const data = await $api("https://api-test.iservreport.com/api/backend/create_store/", {
            method: "POST",
            body: {
              name: data_name.value,
            },
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
 
  const data = [];
// console.log(filtereddatalist.value);

  filtereddatalist.value.forEach((item, key) => {
    item.mapProductStoreList.filter(x => x.isActive == 'Y').forEach((item2, key2) => {
      data.push({
        'ลำดับ': key + 1,
        'กลุ่มลูกค้า': item.groupCustomer.name,
        'Account' : item.account_name,
        'จังหวัด' : item.province_name,
        'Account Type' : item.account_type_name,
        'Group Name' : item.name,
        'ลำดับสินค้า' : item.num,
        'สินค้า' : item2.product.name,
        'Product Flavor' : item2.product.flavor,
        'OOS' : item2.oos,
        'Stock' : item2.stock,
        'Price' : item2.price,
        'Offtake' : item2.offtake,
        '12Week' : item2.week,
        'พื้นที่' : item2.area,
        'MSL' : item2.msl,
      });
    });
  });


  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'MapProductToStoretlist.xlsx');
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
            Export
          </VBtn>
          <RouterLink
            to="/pages/map-store"
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
    <template #item.account="{ item }">
      {{ item.account.name }}
    </template>
    <template #item.accountType="{ item }">
      {{item.accountType.name}}
    </template>
    <template #item.name="{ item }">
      {{item.name}} 
    </template>
    <template #item.groupCustomer="{ item }">
      {{item.groupCustomer.name}} 
    </template>
    
    <!-- Expanded Row Data -->
    <template #expanded-row="slotProps">
      <tr class="v-data-table__tr" style="background-color: rgb(244 244 244);">
        <td :colspan="headers.length" >
          <!-- <div v-for="(v,i) in slotProps.item.mapProductStoreList" :key="i" > -->
            <div style="overflow: auto;height: 300px;">
              <div v-for="(v,i) in slotProps.item.mapProductStoreList.filter(x => x.isActive == 'Y')" :key="i">
                <div style="display: flex;align-items: center;justify-content: start;    border-bottom: 1px solid #000;">
                    <VCol cols="12" md="5">
                      <VCol cols="12" md="12">
                        {{v.product.name}} {{(v.product.flavor?'('+v.product.flavor+')':'')}} 
                      </VCol>
                    </VCol>
                    <VCol cols="12" md="7">
                      <VRow>
                        <VCol cols="6" md="2" class="d-flex align-self-center">
                          <v-checkbox v-model="v.oos" label="OOS" disabled=""></v-checkbox>
                        </VCol>
                        <VCol cols="6" md="2" class="d-flex align-self-center">
                          <v-checkbox v-model="v.stock" label="Stock" disabled=""></v-checkbox>
                        </VCol>
                        <VCol cols="6" md="2" class="d-flex align-self-center">
                          <v-checkbox v-model="v.price" label="Price" disabled=""></v-checkbox>
                        </VCol>
                        <VCol cols="6" md="3" class="d-flex align-self-center">
                          <v-checkbox v-model="v.offtake" label="Offtake" disabled=""></v-checkbox>
                        </VCol>
                        <VCol cols="6" md="3" class="d-flex align-self-center">
                          <v-checkbox v-model="v.week" label="12Week" disabled=""></v-checkbox>
                        </VCol>
                        <VCol cols="6" md="2" class="d-flex align-self-center">
                          <v-checkbox v-model="v.area" label="พื้นที่" disabled=""></v-checkbox>
                        </VCol>
                        <VCol cols="6" md="2" class="d-flex align-self-center">
                          <v-checkbox v-model="v.msl" label="MSL" disabled=""></v-checkbox>
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
        <VIcon icon="tabler-edit" @click="editdata(item)"/>
      </IconBtn>
      <IconBtn>
        <VIcon icon="tabler-trash" @click="delete_MapProductStore(item)"/>
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
                <VBtn variant="tonal" color="secondary"  class="mr-2" :href="'/file_upload/mapproducttostore.xlsx'" download> 
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
