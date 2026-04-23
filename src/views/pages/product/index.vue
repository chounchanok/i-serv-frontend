<script setup>

import {
  onMounted,
  ref,
} from 'vue';

import AppTextField from '@/@core/components/app-form-elements/AppTextField.vue';
import apiService from '@/services/api';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


const apiurl = ref(null)
apiurl.value = import.meta.env.VITE_API_URL;
// console.log(apiurl.value);
const isDialogVisible = ref(false)
const importmodal = ref(false)

const loading = ref(true)
const group_customer_id = ref(null)
const categoryId = ref(null)
const subcategoryId = ref(null)

const brand_id = ref(null)
const sub_brand_id = ref(null)
const flavor = ref(null)
const variant = ref(null)
const product_size = ref(null)
const unit = ref(null)

const product_barcode = ref(null)
const pack_size = ref(null)

const competitor_id = ref(null)
const picture = ref([])
const promotion_id = ref(null)
const price = ref(0)
const qty = ref(0)

const data_id = ref('')
const data_name = ref('')
const search = ref('')
const datalist = ref([])
const group_customerlist = ref([])
const data_picture = ref(null)
const master = ref([])
const masterdata_brand = ref([])
const masterdata_subbrand = ref([])
const masterdata_categories = ref([])
const masterdata_subcategories = ref([])
const masterdata_competitors = [
  { id: 8, name: 'สินค้าบริษัท' },
  { id: 9, name: 'สินค้าคู่แข่ง' }
]
const masterdata_productPromotions = [
  { id: 2, name: 'Sampling' },
  { id: 1, name: 'Premium' },
  { id: 3, name: 'Coupon' }
]

const totalrecord = ref(0)
const refForm = ref()

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  // console.log(datalist.value);
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    const nameMatch = item.name.toLowerCase().includes(searchText)

    const groupCustomer = item.groupCustomer && item.groupCustomer.name ? item.groupCustomer.name.toLowerCase().includes(searchText) : false
    const category = item.category && item.category.name ? item.category.name.toLowerCase().includes(searchText) : false
    const brand = item.brand && item.brand.name ? item.brand.name.toLowerCase().includes(searchText) : false
    const subBrand = item.subBrand && item.subBrand.name ? item.subBrand.name.toLowerCase().includes(searchText) : false

    const flavor = item.flavor ? item.flavor.toLowerCase().includes(searchText) : false
    const variant = item.variant ? item.variant.toLowerCase().includes(searchText) : false
    const product_size = item.product_size ? item.product_size.toLowerCase().includes(searchText) : false
    const product_barcode = item.product_barcode ? item.product_barcode.toLowerCase().includes(searchText) : false
    const pack_size = item.pack_size ? item.pack_size.toLowerCase().includes(searchText) : false
    const Promotion = item.productPromotion && item.productPromotion.name ? item.productPromotion.name.toLowerCase().includes(searchText) : false

    return nameMatch || groupCustomer || category || brand || subBrand || flavor || variant || product_size || product_barcode || pack_size || Promotion 
  })
})

onMounted(() => {
  getall();
  get_all_group_customer();
  master_product();
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
    await apiService.import_excel(formData)
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
    title: 'สถานะ',
    key: 'isActive',
  },
  {
    title: 'จัดการ',
    key: 'actions',
    sortable: false,
  },
  {
    title: 'กลุ่มลูกค้า',
    key: 'groupCustomer',
  },
  {
    title: 'Category',
    key: 'category',
  },
  {
    title: 'Sub Category',
    key: 'subCategory',
  },
  {
    title: 'Brand',
    key: 'brand',
  },
  {
    title: 'Sub brand',
    key: 'subBrand',
  },
  {
    title: 'Product name',
    key: 'name',
  },
  {
    title: 'Product Flavor',
    key: 'flavor',
  },
  {
    title: 'variant',
    key: 'variant',
  },
  {
    title: 'Product Size',
    key: 'product_size',
  },
  {
    title: 'Units (หน่วย)',
    key: 'unit',
  },
  {
    title: 'Product Barcode',
    key: 'product_barcode',
  },
  {
    title: 'Pack Size (Text)',
    key: 'pack_size',
  },
  {
    title: 'บริษัท ( สินค้าบริษัท, คู่แข่ง1, คู่แข่ง2 )',
    key: 'competitor',
  },
  {
    title: 'ภาพสินค้า',
    key: 'picture',
  },
  {
    title: 'ส่งเสริมการขาย (คูปองส่วนลด, ของพรีเมี่ยม)',
    key: 'productPromotion',
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
const master_product = async () => {
  const form = {
    position_name: userData.value.position_name,
    group_customer_id: userData.value.group_customer_id,
  };
  await apiService.master_product(form)
  .then(response => {
    // master.value = response.data.masterData
    masterdata_brand.value = response.data.masterData.brands.filter(item => item.id != null)
    masterdata_subbrand.value = response.data.masterData.subBrands.filter(item => item.id != null)
    masterdata_categories.value = response.data.masterData.categories.filter(item => item.id != null)
    masterdata_subcategories.value = response.data.masterData.subCategories.filter(item => item.id != null)
    masterdata_competitors.value = response.data.masterData.competitors.filter(item => item.id != null)
    masterdata_productPromotions.value = response.data.masterData.productPromotions.filter(item => item.id != null)
  })
  .catch(error => {
    console.error('Error :', error);
  });
}
const master_subbrand = async () => {
  const form = {
    position_name: userData.value.position_name,
    brand_id: brand_id.value,
  };
  await apiService.master_subbrand(form)
  .then(response => {
    sub_brand_id.value = null
    masterdata_subbrand.value = response.data.data
  })
  .catch(error => {
    console.error('Error :', error);
  });
}
const master_subcategories = async () => {
  const form = {
    position_name: userData.value.position_name,
    categoryId: categoryId.value,
  };
  await apiService.master_subcategories(form)
  .then(response => {
    subcategoryId.value = null
    masterdata_subcategories.value = response.data.data
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
  await apiService.get_all_product(form)
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
const update_product_isActive = async v => {
  loading.value = true
  const form = {
    isActive: v.Active ? "Y" : "N",
  };
  await apiService.update_product_isActive(v.id,form)
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
  data_name.value = val.name;
  data_picture.value = val.picture;


  categoryId.value = val.categoryId;
  subcategoryId.value = val.sub_category_id;

  brand_id.value = val.brand_id;
  sub_brand_id.value = val.sub_brand_id;
  flavor.value = val.flavor;
  variant.value = val.variant;
  product_size.value = val.product_size;
  unit.value = val.unit;

  product_barcode.value = (val.product_barcode == "null"?null:val.product_barcode);
  pack_size.value = (val.pack_size == "null"?null:val.pack_size);

  competitor_id.value = val.competitor_id;
  promotion_id.value = val.promotion_id;

  isDialogVisible.value = true
}
const openmodal = async () => {
  data_id.value = '';
  group_customer_id.value = null;
  data_name.value = '';

  categoryId.value = null;
  subcategoryId.value = null;

  brand_id.value = null;
  sub_brand_id.value = null;
  flavor.value = null;
  variant.value = null;
  product_size.value = null;
  unit.value = null;

  product_barcode.value = null;
  pack_size.value = null;

  competitor_id.value = null;
  promotion_id.value = null;
  isDialogVisible.value = true
}
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      const form = {
        group_customer_id: group_customer_id.value,
        name: data_name.value,
      };
      loading.value = true
      if(data_id.value != ""){
        // console.log(data_picture.value);
        const formData = new FormData();
        // if(data_picture.value){
        //   if(data_picture.value.length > 0){
        //     data_picture.value.forEach((preview) => {
        //       formData.append('picture', data_picture.value[0].file);
        //     });
        //   }else{
        //     formData.append('picture', []);
        //   }
        // }else{
        //   formData.append('picture', []);
        // }
        
        formData.append('id', data_id.value);
        formData.append('group_customer_id', group_customer_id.value);
        formData.append('name', data_name.value);

        formData.append('categoryId', categoryId.value);
        formData.append('subcategoryId', subcategoryId.value);

        formData.append('brand_id', brand_id.value);
        formData.append('sub_brand_id', sub_brand_id.value);
        formData.append('flavor', flavor.value);
        formData.append('variant', variant.value);
        formData.append('product_size', product_size.value);
        formData.append('unit', unit.value);

        formData.append('product_barcode', product_barcode.value);
        formData.append('pack_size', pack_size.value);

        formData.append('competitor_id', competitor_id.value);
        formData.append('promotion_id', promotion_id.value);
        
        await apiService.update_product(formData)
        .then(response => {
          Swal.fire({
            title: 'บันทึกสำเร็จ!',
            icon: 'success',
            confirmButtonText: 'OK'
          })
          getall();
          isDialogVisible.value = false
          loading.value = false
        })
        .catch(error => {
          console.error('Error :', error);
        });
      } else {
        const formData = new FormData();
        formData.append('group_customer_id', group_customer_id.value);
        formData.append('name', data_name.value);

        formData.append('categoryId', categoryId.value);
        formData.append('subcategoryId', subcategoryId.value);

        formData.append('brand_id', brand_id.value);
        formData.append('sub_brand_id', sub_brand_id.value);
        formData.append('flavor', flavor.value);
        formData.append('variant', variant.value);
        formData.append('product_size', product_size.value);
        formData.append('unit', unit.value);

        formData.append('product_barcode', product_barcode.value);
        formData.append('pack_size', pack_size.value);

        formData.append('competitor_id', competitor_id.value);
        formData.append('promotion_id', promotion_id.value);
        formData.append('price', price.value);
        formData.append('qty', qty.value);
        

        await apiService.create_product(formData)
        .then(response => {
          Swal.fire({
            title: 'บันทึกสำเร็จ!',
            icon: 'success',
            confirmButtonText: 'OK'
          })
          getall();
          isDialogVisible.value = false
          loading.value = false
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
const exportToExcel = () => {
  const header = [
    'ID','กลุ่มลูกค้า', 'Category', 'Sub Category', 'Brand', 'Sub brand',
    'Product name', 'Product Flavor', 'variant', 'Product Size',
    'Units (หน่วย)', 'Product Barcode', 'Pack Size (Text)', 
    'บริษัท ( สินค้าบริษัท, คู่แข่ง1, คู่แข่ง2 )', 'ภาพสินค้า', 'ส่งเสริมการขาย (คูปองส่วนลด, ของพรีเมี่ยม)', 'Is Active'
  ];

  const rows = filtereddatalist.value.map(item => {
    const imageLink = item.picture
      ? {
          f: `HYPERLINK("${apiurl.value + item.picture}", "คลิกดูไฟล์")`
        }
      : '';

    return [
      item.id,
      item.groupCustomer?.name || '',
      item.category?.name || '',
      item.subCategory?.name || '',
      item.brand?.name || '',
      item.subBrand?.name || '',
      item.name,
      item.flavor,
      item.variant,
      item.product_size,
      item.unit,
      item.product_barcode,
      item.pack_size,
      item.competitor?.name || '',
      imageLink,
      item.productPromotion?.name || '',
      item.isActive === 'Y' ? 'Yes' : 'No'
    ];
  });

  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // บันทึกไฟล์
  XLSX.writeFile(workbook, 'Product.xlsx');
};
const exportToExcel_old = () => {
  // แปลงข้อมูลให้เป็น array ของ object
  const data = filtereddatalist.value.map(item => ({
    'ID': item.id ? item.id : '',
    'กลุ่มลูกค้า': item.groupCustomer ? item.groupCustomer.name : '',
    'Category': item.category ? item.category.name : '',
    'Sub Category': item.subCategory ? item.subCategory.name : '',
    'Brand': item.brand ? item.brand.name : '',
    'Sub brand': item.subBrand ? item.subBrand.name : '',
    'Product name': item.name,
    'Product Flavor': item.flavor,
    'variant': item.variant,
    'Product Size': item.product_size,
    'Units (หน่วย)': item.unit,
    'Product Barcode': item.product_barcode,
    'Pack Size (Text)': item.pack_size,
    'บริษัท ( สินค้าบริษัท, คู่แข่ง1, คู่แข่ง2 )': item.competitor ? item.competitor.name : '',
    'ภาพสินค้า': item.picture ? `=HYPERLINK("${apiurl.value + item.picture}", "คลิกดูไฟล์")` : '',
    // 'ภาพสินค้า': item.picture,
    'ส่งเสริมการขาย (คูปองส่วนลด, ของพรีเมี่ยม)': item.productPromotion ? item.productPromotion.name : '',
    'Is Active': item.isActive == 'Y' ? 'Yes' : 'No'
  }));

  // สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
  XLSX.writeFile(workbook, 'Product.xlsx');
};
// Picture
const handleFiles = async (event, i) => {
  if (event && event.target) {
    var selectedFiles = Array.from(event.target.files);
    const files = selectedFiles;
    previewImages(files,i);
  } else {
    console.error('Event หรือ event.target ไม่พร้อมใช้งาน');
  }
}
const  selectFiles = async (i) => {
  document.querySelector('#fileInput'+i).click();
}
const save_picture = async (i) => {
  const indexx = datalist.value.findIndex(item => item.id === i);
  if (indexx !== -1) {
    
    const formData = new FormData();
    if (datalist.value[indexx].picture_cut && datalist.value[indexx].picture_cut[0].file) {
      // ส่งไฟล์ไปที่ API
      console.log(datalist.value[indexx].picture_cut[0].file);
      formData.append('picture', datalist.value[indexx].picture_cut[0].file);
    } else {
      console.log('No files found in picture');
    }
    formData.append('id', i);
    
    console.log(formData);
    await apiService.save_picture(formData)
    .then(response => {
      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        showConfirmButton: false,
        timer: 2000
      });
      setTimeout(() => {
        getall();
      }, 2000);
    })
    .catch(error => {
      console.error('Error :', error);
      Swal.fire({
        icon: "warning",
        title: "บันทึกไม่สำเร็จกรุณาติดต่อผู้ดูแลระบบ",
        showConfirmButton: false,
        timer: 2000
      });
    });
  }
}
const  previewImages = async (files,i) => {
  
    Array.from(files).forEach((file) => {
        // if (datalist.value[i].length >= 1) return; // Limit to 40 images
          const reader = new FileReader();
          reader.onload = (e) => {
          const newItem = { id: i, picture: {
            name: file.name,
            file: file, // เก็บไฟล์ไว้เพื่อส่งให้ API
            url: e.target.result,
          }};
          const index = datalist.value.findIndex(item => item.id === newItem.id);
          if (index !== -1) {
            datalist.value[index].picture_cut[0] = newItem.picture;

            // Trigger ตัวกรองข้อมูลใหม่
            if (filtereddatalist.value) {
              filtereddatalist.value = [...datalist.value]; // อัปเดต computed
              
            }
            save_picture(i);
          }
        };
        reader.readAsDataURL(file);
    });

    
    
    console.log(datalist.value);
}



const handleFiles_edit = async event => {
  // ตรวจสอบว่ามี event และ target ก่อนใช้งาน
  if (event && event.target) {
    var selectedFiles = Array.from(event.target.files);
    previewImages_edit(selectedFiles);
  } else {
    console.error('Event หรือ event.target ไม่พร้อมใช้งาน');
  }
}
const previewImages_edit = async files => {
  
    Array.from(files).forEach((file) => {
        if (data_picture.value.length >= 40) return; // Limit to 40 images
          const reader = new FileReader();
          reader.onload = (e) => {
          data_picture.value.push({
              name: file.name,
              file: file, // เก็บไฟล์ไว้เพื่อส่งให้ API
              url: e.target.result,
          });
        };
        reader.readAsDataURL(file);
    });
    console.log(data_picture.value);
}

const confirm_delete_picture = async () => {
  Swal.fire({
    title: "ยืนยันการลบ?",        
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ยืนยัน"
  }).then((result) => {
    if (result.isConfirmed) {
      delete_picture()
    }
  });
}
const delete_picture = async () => {
  const form = {
    id: data_id.value
  };
  await apiService.delete_picture(form)
    .then(response => {
      Swal.fire({
          title: "ลบสำเร็จ",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading(),
      });
      setTimeout(() => {
        data_picture.value = null
        getall()
        isDialogVisible.value = true
      }, 2000);
    })
    .catch(error => {
      console.error('Error :', error);
    });
} 
// Picture
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
      item-value="id"
      class="text-no-wrap"
    >
      <template #item.isActive="{ item }">
        <VSwitch
          v-model="item.Active"
          @change="update_product_isActive(item)"
        />
      </template>
      <template #item.actions="{ item }">
        <IconBtn @click="editdata(item)">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn :key="`${item.id}`" @click="selectFiles(item.id)">
          <VIcon icon="tabler-photo-edit" />
        </IconBtn>
        <input
            type="file"
            :key="`${item.id}`"
            :id="'fileInput'+item.id"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/gif"
            style="display: none;"
            @change="(event) => handleFiles(event, item.id)"
        />
      </template>
      <template #item.groupCustomer="{ item }">
        {{(item.groupCustomer?item.groupCustomer.name:'')}}
      </template>
      <template #item.category="{ item }">
        {{(item.category?item.category.name:'')}}
      </template>
      <template #item.subCategory="{ item }">
        {{(item.subCategory?item.subCategory.name:'')}}
      </template>
      <template #item.brand="{ item }">
        {{(item.brand?item.brand.name:'')}}
      </template>
      <template #item.subBrand="{ item }">
        {{(item.subBrand?item.subBrand.name:'')}}
      </template>
      <template #item.competitor="{ item }">
        {{(item.competitor?item.competitor.name:'')}}
      </template>
      <template #item.productPromotion="{ item }">
        {{(item.productPromotion?item.productPromotion.name:'')}}
      </template>
      <template #item.product_barcode="{ item }">
        {{(item.product_barcode == "null"?null:item.product_barcode)}}
      </template>
      <template #item.pack_size="{ item }">
        {{(item.pack_size == "null"?null:item.pack_size)}}
      </template>
      <template #item.picture="{ item }">
        <a v-if="item.picture" :data-fancybox="'booklet-gal'+item.id" :href="apiurl+item.picture" style="display: flex;align-items: center;justify-content: center;">
            <div class="img-width">
                <img :src="apiurl+item.picture" class="card-img-top" :alt="apiurl+item.picture" style="block-size: 50px;inline-size: 50px;"/>
            </div>
        </a>
        <!-- <a v-if="item.picture_base.length > 0" :data-fancybox="'booklet-gal'+item.id" :href="item.picture_base[0].url" style="display: flex;align-items: center;justify-content: center;">
            <div class="img-width">
                <img :src="item.picture_base[0].url" class="card-img-top" :alt="item.picture_base[0].name" style="width: 50px;height: 50px;"/>
            </div>
        </a> -->
        
        <!-- <VImg v-if="item.picture" :src="item.picture.url" style="width: 50px;height: 50px;"/> -->
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
              <div v-if="data_id != ''" style="display: grid;align-items: center;justify-content: center;margin-block-end: 16px;">
                <a v-if="data_picture" :data-fancybox="'booklet-gal'+data_picture" :href="apiurl+data_picture" style="display: flex;align-items: center;justify-content: center;">
                    <div class="img-width">
                        <img :src="apiurl+data_picture" class="card-img-top" :alt="apiurl+data_picture" style="block-size: 50px;inline-size: 50px;"/>
                    </div>
                </a>
                <span v-if="data_picture" @click="confirm_delete_picture" style="color: red;cursor: pointer;margin-block: 16px 16px;"> ลบไฟล์เก่า</span>

                <!-- <input
                    type="file"
                    id="fileInput"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    @change="(event) => handleFiles_edit(event)"
                    style="width: 100%;margin-bottom: 16px;"
                /> -->
              </div>

              <AppAutocomplete
                  label="กลุ่มลูกค้า"
                  v-model="group_customer_id"
                  :items="group_customerlist"
                  item-title="name"
                  item-value="id"
                  placeholder="เลือก"
                  :rules="[requiredValidator]"
                  @update:modelValue="master_product"
              />
            </VCol>
            <VCol
              cols="12"
              sm="12"
              md="12"
            >
              <AppAutocomplete
                  label="Category"
                  v-model="categoryId"
                  :items="masterdata_categories"
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  placeholder="เลือก"
                  @update:modelValue="master_subcategories"
                  @click:clear="categoryId=null"
              />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                    label="Sub Category"
                    v-model="subcategoryId"
                    :items="masterdata_subcategories"
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    placeholder="เลือก"
                    @click:clear="subcategoryId=null"
                />
            </VCol>



            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                    label="Brand"
                    v-model="brand_id"
                    :items="masterdata_brand"
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    placeholder="เลือก"
                    @update:modelValue="master_subbrand"
                    @click:clear="brand_id=null"
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                    label="Sub brand"
                    v-model="sub_brand_id"
                    :items="masterdata_subbrand"
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    placeholder="เลือก"
                    @click:clear="sub_brand_id=null"
                />
            </VCol>
            <VCol
              cols="12"
              sm="12"
              md="12"
            >
              <AppTextField
                v-model="data_name"
                label="ชื่อสินค้า"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                    label="Product Flavor"
                    v-model="flavor"
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                    label="variant"
                    v-model="variant"
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                    label="Product Size"
                    v-model="product_size"
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                    label="Units (หน่วย)"
                    v-model="unit"
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
                <AppTextField
                  label="price"
                  v-model="price"
                  type="number"
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                    label="Quantity"
                    v-model="qty"
                    type="number"
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                    label="Product Barcode"
                    v-model="product_barcode"
                    
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppTextField
                    label="Pack Size (Text)"
                    v-model="pack_size"
                    
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                    label="บริษัท ( สินค้าบริษัท, คู่แข่ง1, คู่แข่ง2 )"
                    v-model="competitor_id"
                    :items="masterdata_competitors"
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    placeholder="เลือก"
                    @click:clear="competitor_id=null"
                />
            </VCol>
            <VCol cols="12" sm="12" md="12">
              <AppAutocomplete
                    label="ส่งเสริมการขาย (คูปองส่วนลด, ของพรีเมี่ยม)"
                    v-model="promotion_id"
                    :items="masterdata_productPromotions"
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    placeholder="เลือก"
                    @click:clear="promotion_id=null"
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
          <VBtn @click="save" :disabled="loading">
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
                <VBtn variant="tonal" color="secondary"  class="mr-2" :href="'/file_upload/product.xlsx'" download>
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

<style scoped>
.swal2-container,
.fancybox__container {
  z-index: 9999 !important;
}

</style>
