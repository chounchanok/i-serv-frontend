<script setup>
import {
  ref
} from 'vue';
const isDialogVisible = ref(false)
const area_id = ref(null)
const brand_id = ref('')
const brand_name = ref('')
const brands = ref([])
const totalrecord = ref(0)
const area_list = [
    { name: 'Test 1', id: 1 },
    { name: 'Test 2', id: 2 },
    { name: 'Test 3', id: 3 },
    { name: 'Test 4', id: 4 },
    { name: 'Test 5', id: 5 },
]
const items2 = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']
const headers = [
  {
    title: 'id',
    key: 'id',
  },
  {
    title: 'พื้นที่',
    key: 'area_id',
  },
  {
    title: 'Brand name',
    key: 'brand_name',
    sortable: false,
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref()
const searchQuery = ref('')

const status = ref([
  {
    title: 'Scheduled',
    value: 'Scheduled',
  },
  {
    title: 'Publish',
    value: 'Published',
  },
  {
    title: 'Inactive',
    value: 'Inactive',
  },
])

const categories = ref([
  {
    title: 'Accessories',
    value: 'Accessories',
  },
  {
    title: 'Home Decor',
    value: 'Home Decor',
  },
  {
    title: 'Electronics',
    value: 'Electronics',
  },
  {
    title: 'Shoes',
    value: 'Shoes',
  },
  {
    title: 'Office',
    value: 'Office',
  },
  {
    title: 'Games',
    value: 'Games',
  },
])

const stockStatus = ref([
  {
    title: 'In Stock',
    value: true,
  },
  {
    title: 'Out of Stock',
    value: false,
  },
])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const resolveCategory = category => {
  if (category === 'Accessories')
    return {
      color: 'error',
      icon: 'tabler-device-watch',
    }
  if (category === 'Home Decor')
    return {
      color: 'info',
      icon: 'tabler-home',
    }
  if (category === 'Electronics')
    return {
      color: 'primary',
      icon: 'tabler-device-imac',
    }
  if (category === 'Shoes')
    return {
      color: 'success',
      icon: 'tabler-shoe',
    }
  if (category === 'Office')
    return {
      color: 'warning',
      icon: 'tabler-briefcase',
    }
  if (category === 'Games')
    return {
      color: 'primary',
      icon: 'tabler-device-gamepad-2',
    }
}

const resolveStatus = statusMsg => {
  if (statusMsg === 'Scheduled')
    return {
      text: 'Scheduled',
      color: 'warning',
    }
  if (statusMsg === 'Published')
    return {
      text: 'Publish',
      color: 'success',
    }
  if (statusMsg === 'Inactive')
    return {
      text: 'Inactive',
      color: 'error',
    }
}

const getall = async () => {
    const {
        data: brandsData,
        execute: fetchBrands,
    } = await $api("https://api-test.iservreport.com/api/backend/brand/data-table", {
        method: "POST",
        body: {
            q: searchQuery.value,
            stock: selectedStock,
            category: selectedCategory.value,
            status: selectedStatus.value,
            page:page.value,
            itemsPerPage:itemsPerPage.value,
            sortBy:sortBy.value,
            orderBy:orderBy.value,
        },
    });
    brands.value = brandsData.rows
    console.log(brands);
    totalrecord.value = brandsData.count
}
const {
    data: brandsData,
    execute: fetchBrands,
} = await $api("https://api-test.iservreport.com/api/backend/brand/data-table", {
    method: "POST",
    body: {
        q: searchQuery.value,
        stock: selectedStock,
        category: selectedCategory.value,
        status: selectedStatus.value,
        page:page.value,
        itemsPerPage:itemsPerPage.value,
        sortBy:sortBy.value,
        orderBy:orderBy.value,
    },
});
brands.value = brandsData.rows
totalrecord.value = brandsData.count


const deleteBrand = async id => {
    try {
        const data = await $api("https://api-test.iservreport.com/api/backend/brand/"+id, {
            method: "DELETE",
        });
        getall();
    } catch (err) {
        console.error(err)
    }
}
const editBrand = async val => {
    // isDialogVisible = true
    console.log(val);
    brand_id.value = val.id;
    brand_name.value = val.brand_name;
    isDialogVisible.value = true
}
const saveBrand = async () => {
    try {
        if(brand_id.value != ""){
            const data = await $api("https://api-test.iservreport.com/api/backend/brand/"+brand_id.value, {
                method: "PUT",
                body: {
                    area_id: area_id.value,
                    brand_name: brand_name.value
                },
            });
        }else{
            const data = await $api("https://api-test.iservreport.com/api/backend/brand/", {
                method: "POST",
                body: {
                    area_id: area_id.value,
                    brand_name: brand_name.value,
                },
            });
        }
        isDialogVisible.value = false
        getall();
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
  <div>
    <!-- 👉 products -->
    <VCard
      title="Brand"
      class="mb-6"
    >
      <!-- <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStatus"
              placeholder="Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedCategory"
              placeholder="Category"
              :items="categories"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStock"
              placeholder="Stock"
              :items="stockStatus"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
        </VRow>
      </VCardText> -->

      <VDivider />

      <div class="d-flex flex-wrap gap-4 ma-6">
        <div class="d-flex align-center">
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Product"
            style="inline-size: 200px;"
            class="me-3"
            @keyup="getall"
          />
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <AppSelect
            v-model="itemsPerPage"
            :items="[5, 10, 20, 25, 50]"
          />
          <!-- 👉 Export button -->
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
          >
            Export
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            @click="isDialogVisible=true"
          >
            Add
          </VBtn>
        </div>
      </div>

      <VDivider class="mt-4" />

      <!-- 👉 Datatable  -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="brands"
        :items-length="totalrecord"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        
        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn>
            <VIcon icon="tabler-edit" @click="editBrand(item)"/>
          </IconBtn>

          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="delete"
                  prepend-icon="tabler-trash"
                  @click="deleteBrand(item.id)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalrecord"
          />
        </template>
      </VDataTableServer>
    </VCard>

    <VDialog
    v-model="isDialogVisible"
    max-width="600"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Add/Edit">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="12"
            md="12"
          >
            <AppAutocomplete
                label="States"
                v-model="area_id"
                :items="area_list"
                :custom-filter="customFilter"
                item-title="name"
                item-value="id"
                placeholder="Select"
            />
          </VCol>
          <VCol
            cols="12"
            sm="12"
            md="12"
          >
            <AppTextField
              v-model="brand_name"
              label="Brand Name"
            />
          </VCol>
          

        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <input type="hidden" v-model="brand_id">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isDialogVisible = false"
        >
          Close
        </VBtn>
        <VBtn @click="saveBrand">
          Save
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  </div>
</template>
