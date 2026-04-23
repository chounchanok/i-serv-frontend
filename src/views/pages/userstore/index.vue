<script setup>

import {
  onMounted,
  ref,
} from 'vue';

import apiService from '@/services/api';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const isDialogVisible = ref(false)
const importmodal = ref(false)

const showDialog = ref(false)

const loading = ref(true)
const group_customer_id = ref(null)
const user_ids = ref([])
const store_ids = ref([])

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const group_customerlist = ref([])
const userlist = ref([])
const storelist = ref([])

const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value

  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()

    const nameMatch = item.route_name?.toLowerCase().includes(searchText) || false
    const groupCustomer = item.groupCustomer?.name?.toLowerCase().includes(searchText) || false
    const usercode = item.users?.[0]?.code?.includes(searchQuery.value) || false
    const username = item.users?.[0]?.name?.includes(searchQuery.value) || false
    const userlast_name = item.users?.[0]?.last_name?.includes(searchQuery.value) || false
    const store = item.store?.store_name_report?.toLowerCase().includes(searchText) || false

    return nameMatch || groupCustomer || usercode || username || userlast_name || store
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

    await apiService.import_userstore(formData)
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
    title: 'ชื่อ Route',
    key: 'route_name',
  },
  {
    title: 'กลุ่มลูกค้า',
    key: 'groupCustomer',
  },
  {
    title: 'User',
    key: 'users',
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
console.log(userData.value.position_name);

onMounted(() => {
  getall();
  get_all_group_customer();
  // get_all_user_filter();
  // get_all_store();
})
const getall = async () => {
  loading.value = true
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.get_all_MapUserStore(form)
    .then(response => {
      var data = response.data.data
      totalrecord.value = response.data.length
      var store_ids = [];
      var check_route = [];
      var num = 0;
      data.forEach((item, index) => {
        if(check_route[item.group_customer_id] == undefined){
          store_ids[item.group_customer_id] = [];
          check_route[item.group_customer_id] = [];
        }
        if(check_route[item.group_customer_id][item.user_id] == undefined){
          store_ids[item.group_customer_id][item.user_id] = [];
          check_route[item.group_customer_id][item.user_id] = [];
        }
        if(check_route[item.group_customer_id][item.user_id][item.route_name] == undefined){
          store_ids[item.group_customer_id][item.user_id][item.route_name] = [];
          check_route[item.group_customer_id][item.user_id][item.route_name] = index;
        }
        store_ids[item.group_customer_id][item.user_id][item.route_name].push(item.store_id)        
        var i = check_route[item.group_customer_id][item.user_id][item.route_name];
        data[i].store_ids = store_ids[item.group_customer_id][item.user_id][item.route_name];
        if(check_route[item.group_customer_id][item.user_id][item.route_name] == index){
          item.user = item.users[0];
          item.Active = (item.isActive=='Y'?true:false)
          item.num = num+1;
          num++;
        }else{
          data[i].stores = data[i].stores.concat(item.stores);
        }
      });
      datalist.value = data.filter(item => item.store_ids !== undefined);
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
  // await apiService.get_all_group_customer()
  // .then(response => {
  //   group_customerlist.value = response.data.data
  // })
  // .catch(error => {
  //   console.error('Error :', error);
  // });
}
const get_all_user_filter = async () => {
  var form = {
    group_customer_id: group_customer_id.value
  }
  await apiService.get_all_user_filter(form)
  .then(response => {
    userlist.value = response.data.data
    get_all_store();
  })
  .catch(error => {
    console.error('Error :', error);
  });
}
const formattedUserList = computed(() =>
  userlist.value.map(user => ({
    ...user,
    displayName: `${user.code}, ${user.name}, ${user.areaSupervisor.name}, ${user.areaManager.name}`, // รวม name และ code
  }))
);

const get_all_store = async () => {
  var form = {
    group_customer_id: group_customer_id.value,
    position_name: userData.value.position_name,
  }
  await apiService.get_all_store(form)
  .then(response => {
    storelist.value = response.data.data.filter(x => x.isActive == 'Y')
  })
  .catch(error => {
    console.error('Error :', error);
  });
}
const formattedstorelist = computed(() =>
  storelist.value.map(store => ({
    ...store,
    displayName: `${store.account.name} ${store.store_code} ${store.store_name}, ${store.provinces.name_in_thai}`, // รวม name และ code
  }))
);
const update_MapUserStore_isActive = async v => {
  const form = {
    isActive: v.Active ? "Y" : "N",
  };
  await apiService.update_MapUserStore_isActive(v.id,form)
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
  data_name.value = val.route_name;
  group_customer_id.value = val.group_customer_id;
  if(val.group_customer_id > 0){
    get_all_user_filter();
    user_ids.value = val.user_id;
    store_ids.value = val.store_ids;
  }
  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  data_name.value = '';
  group_customer_id.value = null;
  user_ids.value = [];
  store_ids.value = [];

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
          user_ids: user_ids.value,
          store_ids: store_ids.value,
          route_name: data_name.value
        };
        await apiService.update_MapUserStore(data_id.value,form)
        .then(response => {
          Swal.fire({
            title: response.data.message,
            icon: response.data.status,
            confirmButtonText: 'OK'
          })
          if(response.data.status == 'success'){
            isDialogVisible.value = false
            getall(); // โหลดข้อมูลใหม่
          }
        })
        .catch(error => {
          console.error('Error :', error);
        });
      } else {
        const form = {
          group_customer_id: group_customer_id.value,
          user_ids: user_ids.value,
          store_ids: store_ids.value,
          route_name: data_name.value,
        };
        await apiService.create_MapUserStore(form)
        .then(response => {
          Swal.fire({
            title: response.data.message,
            icon: response.data.status,
            confirmButtonText: 'OK'
          })
          if(response.data.status == 'success'){
            isDialogVisible.value = false
            getall(); // โหลดข้อมูลใหม่
          }
        })
        .catch(error => {
          console.error('Error :', error);
        });
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// ฟังก์ชันสำหรับส่งออกเป็น Excel
const exportToExcel = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'ชื่อ Route':item.route_name,
    'กลุ่มลูกค้า': item.groupCustomer.name,
    'รหัส User' : item.user.code,
    'ชื่อ User': item.user.name,
    'นามสกุล User': item.user.last_name,
    'ชื่อ Store': item.stores.map((x) => x.store_name_report).join(", "),
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No'
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
      expand-on-click
    >
      <template #item.groupCustomer="{ item }">
        {{item.groupCustomer.name}}
      </template>
      <template #item.users="{ item }">
        <VRow style="padding: 1em;">
          <VCol
            v-for="(user, index) in item.users.slice(0, 3)"
            :key="index"
            cols="12"
            md="12"
            style="padding: 0;"
          >
            {{ user.code }} {{ user.name }} {{ user.last_name }}
          </VCol>

          <!-- แสดง (+จำนวนที่เหลือ) หากจำนวน user เกิน 3 -->
          <VCol v-if="item.users.length > 3" cols="12" md="12" style="padding: 0;">
            <a href="#" @click.prevent="showDialog = true">
              (+{{ item.users.length - 3 }})
            </a>
          </VCol>
        </VRow>

        <!-- VDialog สำหรับแสดง users ทั้งหมด -->
        <VDialog
          v-model="showDialog"
          max-width="600"
        >
          <!-- Dialog close btn -->
          <DialogCloseBtn @click="showDialog = !showDialog" />

          <!-- Dialog Content -->
          <VCard title="All Users">
            <VCardText>
              <VList>
                <VListItem
                  v-for="(user, index) in item.users"
                  :key="index"
                >
                  {{ user.code }} {{ user.name }} {{ user.last_name }}
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VDialog>
        
      </template>

      <!-- Expanded Row Data -->
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr" style="background-color: rgb(244 244 244);">
          <td :colspan="headers.length" >
            <!-- <div v-for="(v,i) in slotProps.item.mapProductStoreList" :key="i" > -->
              <!-- <div v-for="(v,i) in slotProps.item.stores" :key="i">
                <div style="display: flex;align-items: center;justify-content: start;"> -->
                <VRow style="padding: 1em;">
                    <VCol v-for="(v,i) in slotProps.item.stores" :key="i" cols="6" md="6">
                      {{v.store_name_report_full}}
                    </VCol>
                </VRow>
                <!-- </div>
              </div> -->
          </td>
        </tr>
      </template>
      
      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_MapUserStore_isActive(item)"
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
                label="ชื่อ Route"
                :rules="[requiredValidator]"
              />
            </VCol>
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
                  @update:modelValue="get_all_user_filter"
              />
            </VCol>
            <VCol
              cols="12"
              sm="12"
              md="12"
            >
              <AppAutocomplete
                  label="ชื่อ User"
                  v-model="user_ids"
                  :items="formattedUserList"
                  item-title="displayName"
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
              label="ชื่อ Store"
              v-model="store_ids"
              :items="formattedstorelist"
              item-title="displayName"
              item-value="id"
              placeholder="Select"
              :rules="[requiredValidator]"
              multiple
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
                <VBtn variant="tonal" color="secondary"  class="mr-2" :href="'/file_upload/usertostore.xlsx'" download>
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
