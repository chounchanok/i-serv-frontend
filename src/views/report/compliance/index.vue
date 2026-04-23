<script setup>
import {
  ref
} from 'vue';
const isDialogVisible = ref(false)
const isDialogVisible2 = ref(false)

const loading = ref(true)
const area_id = ref(null)

const data_id = ref('')
const data_name = ref('')
const datalist = ref([])
const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    return (
      item.brand_name.toLowerCase().includes(searchText) ||
      item.area_id.toString().toLowerCase().includes(searchText)
    )
  })
})
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

loading.value = true
const {
    data: datalistData,
    execute: fetchdatalist,
} = await $api("https://api-test.iservreport.com/api/backend/brand/data-table", {
    method: "POST",
});
datalist.value = datalistData.rows
totalrecord.value = datalistData.count
datalist.value.forEach((item, index) => {
  datalist.value[index].num = index+1
});
loading.value = false

const search = ref('')

const area_list = [
    { name: 'Area 1', id: 1 },
    { name: 'Area 2', id: 2 },
    { name: 'Area 3', id: 3 },
    { name: 'Area 4', id: 4 },
    { name: 'Area 5', id: 5 },
]
const brand_list = [
    { name: 'Brand 1', id: 1 },
    { name: 'Brand 2', id: 2 },
    { name: 'Brand 3', id: 3 },
    { name: 'Brand 4', id: 4 },
    { name: 'Brand 5', id: 5 },
]
const gen_list = [
    { name: 'Gen 1', id: 1 },
    { name: 'Gen 2', id: 2 },
    { name: 'Gen 3', id: 3 },
    { name: 'Gen 4', id: 4 },
    { name: 'Gen 5', id: 5 },
]
const headers = [
  {
    title: 'id',
    key: 'num',
  },
  {
    title: 'พื้นที่',
    key: 'area_id',
  },
  {
    title: 'ยี่ห้อ',
    key: 'brand_name',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]
const getall = async () => {
  loading.value = true
  const {
      data: datalistData,
      execute: fetchdatalist,
  } = await $api("https://api-test.iservreport.com/api/backend/brand/data-table", {
      method: "POST",
  });
  datalist.value = datalistData.rows
  totalrecord.value = datalistData.count
  datalist.value.forEach((item, index) => {
    datalist.value[index].num = index+1
  });
  loading.value = false
}
const deletedata = async id => {
  try {
    const data = await $api("https://api-test.iservreport.com/api/backend/brand/"+id, {
        method: "DELETE",
    });
    getall();
  } catch (err) {
    console.error(err)
  }
}
const editdata = async val => {
  data_id.value = val.id;
  area_id.value = val.area_id;
  data_name.value = val.brand_name;
  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  area_id.value = null;
  data_name.value = '';
  isDialogVisible.value = true
}
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
          const data = await $api("https://api-test.iservreport.com/api/backend/brand/"+data_id.value, {
            method: "PUT",
            body: {
              area_id: area_id.value,
              brand_name: data_name.value
            },
          });
      } else {
          const data = await $api("https://api-test.iservreport.com/api/backend/brand/", {
            method: "POST",
            body: {
              area_id: area_id.value,
              brand_name: data_name.value,
            },
          });
      }
      isDialogVisible.value = false
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
          >
            Export
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            @click="openmodal"
          >
            Add
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
      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-edit" @click="editdata(item)"/>
        </IconBtn>

        <IconBtn>
          <VIcon icon="tabler-dots-vertical" />
          <VMenu activator="parent">
            <VList>
              <VListItem
                value="delete"
                prepend-icon="tabler-trash"
                @click="deletedata(item.id)"
              >
                Delete
              </VListItem>
            </VList>
          </VMenu>
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
      <VCard title="Add/Edit">
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
                  label="พื้นที่"
                  v-model="area_id"
                  :items="area_list"
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
                label="ยี่ห้อ"
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
      v-model="isDialogVisible2"
      max-width="600"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible2 = !isDialogVisible2" />

      <!-- Dialog Content -->
      <VCard title="ภาพ">
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
