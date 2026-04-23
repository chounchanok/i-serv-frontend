<script setup>

import apiService from '@/services/api';
import Swal from 'sweetalert2';
import {
  onMounted,
  ref,
} from 'vue';

const isDialogVisible = ref(false)
const loading = ref(true)
const isConfirmPasswordVisible = ref(false)
const apiurl = ref(null)
apiurl.value = import.meta.env.VITE_API_URL;
const data_id = ref('')
const data_name = ref('')
const newpassword = ref('')
const cnewpassword = ref('')
const data_email = ref('')
const data_picture = ref([])

const datalist = ref(null)
const totalrecord = ref(0)
const refForm = ref()
const dataPic = ref(null)

const searchQuery = ref('')
const filtereddatalist = computed(() => {
  if (!searchQuery.value) return datalist.value
  
  return datalist.value.filter(item => {
    const searchText = searchQuery.value.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchText)
    )
  })
})
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

onMounted(() => {
  getone();
})

const userData = useCookie('userData')

const getone = async () => {
  const form = {
    user_id: userData.value.id
  };
  await apiService.get_all_user_one(form)
  .then(response => {
    data_id.value = response.data.data.id
    data_name.value = response.data.data.name
    data_email.value = response.data.data.email
    dataPic.value = apiurl.value+response.data.data.picture
    console.log(response.data.data.name);
  })
  .catch(error => {
    console.error('Error :', error);
  });
}
const save = async () => {
  try {
    // ตรวจสอบการ validate ของฟอร์ม
    const isValid = await refForm.value?.validate();
    if (isValid.valid) {
      // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
      if(data_id.value != ""){
          // const data = await $api("https://api-test.iservreport.com/api/backend/update_user/"+data_id.value, {
          //   method: "PUT",
          //   body: {
          //     name: data_name.value,
          //   },
          // });
          // console.log(data_picture.value);

            if(newpassword.value != cnewpassword.value) {
              Swal.fire({
                title: 'รหัสผ่านไม่ตรงกัน!',
                icon: 'error',
                confirmButtonText: 'OK'
              })
              newpassword.value = '';
              cnewpassword.value = '';
              return;
            }

          const formData = new FormData();
          if(data_picture.value.length > 0){
            data_picture.value.forEach((preview) => {
              formData.append('picture', data_picture.value[0].file);
            });
          }else{
            formData.append('picture', []);
          }
          formData.append('id', data_id.value);
          formData.append('password', newpassword.value);
          formData.append('name', data_name.value);
          formData.append('email', data_email.value);
          formData.append('data_picture', data_picture.value);

          // var form = {
          //   id:data_id.value,
          //   password:newpassword.value,
          //   name: data_name.value,
          //   email: data_email.value,
          //   data_picture: data_picture.value,
          // }
          await apiService.edituser(formData)
          .then(response => {
            console.log(userData.value.picture);
            console.log(response.data.picture);
            userData.value.picture = response.data.picture
            useCookie('userData').value = userData.value
            Swal.fire({
                title: "บันทึกสำเร็จ",
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => Swal.showLoading(),
                willClose: () => window.location.reload()
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            
          })
          .catch(error => {
            console.error('Error :', error);
          });
      } else {
          const data = await $api("https://api-test.iservreport.com/api/backend/create_user/", {
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
      getone(); // โหลดข้อมูลใหม่
    }
  } catch (err) {
    console.error(err)
  }
}

const handleFiles = async event => {
  // ตรวจสอบว่ามี event และ target ก่อนใช้งาน
  if (event && event.target) {
    var selectedFiles = Array.from(event.target.files);
    previewImages(selectedFiles);
    // dataPic.value = event.target.files[0];
    let preview = document.getElementById('preview');
    if (preview){
      preview.style.display = 'block';
      preview.setAttribute('src',URL.createObjectURL(event.target.files[0]));
    }
  } else {
    console.error('Event หรือ event.target ไม่พร้อมใช้งาน');
  }
}
const previewImages = async files => {
  
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
</script>

<template>
  <VCard>
    <VCard title="แก้ไข">
      <VForm ref="refForm" @submit.prevent="save">
        <VCardText>
          <VRow>
            <VCol cols="12" sm="12" md="12" class="div-content">
              <div style="display: grid; align-items: center; justify-content: center;">
                <img id="preview" :src="dataPic" style="border-radius: 50%; block-size: 100px; inline-size: 100px;" alt="preview" />
                <VBtn v-if="dataPic" color="error" size="small" class="mt-2" type="button" @click="removePicture">
                  ลบภาพ
                </VBtn>
              </div>
              <input type="file" id="fileInput" multiple accept="image/png, image/jpeg, image/jpg, image/gif" @change="handleFiles" />
              <AppTextField v-model="data_name" label="ชื่อ" :rules="[requiredValidator]" readonly />
              <AppTextField v-model="data_email" label="Email" :rules="[requiredValidator]" />
              <AppTextField v-model="newpassword" label="เปลี่ยนรหัสผ่านใหม่" :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />

              <AppTextField v-if="data_id != ''" v-model="cnewpassword" label="ยืนยันรหัสผ่านใหม่อีกครั้ง"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn @click="save">
            Save
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VCard>
</template>

<script>

export default {
  data() {
    return {
      dataPic: null,
      userId: null,
      isConfirmPasswordVisible: false,
      data_name: '',
      data_email: '',
      newpassword: '',
      cnewpassword: '',
      data_id: '',
      refForm: null,
      userData: {}
    };
  },
  methods: {
    handleFiles(event) {
      const file = event.target.files[0];
      if (file) {
        this.dataPic = URL.createObjectURL(file);
      }
    },
    async removePicture() {
      try {
        // เรียก API ลบภาพ (ต้องมี endpoint ใน backend)
        const userData = useCookie('userData')
        const userId = userData.value.id;
        await apiService.deleteUserPicture({ userId: userId });

        // อัปเดต dataPic ให้เป็น null หรือ URL ภาพ default
        this.dataPic = null;

        Swal.fire({ icon: 'success', title: 'ลบภาพสำเร็จ', timer: 1500, showConfirmButton: false });
      } catch (error) {
        console.error('Error deleting picture:', error);
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
      }
    },
    async save() {
      // ... (โค้ด save ของคุณ)
    },
  },
  mounted() {
    this.getone();
  },
};
</script>

<style scoped>
.div-content {
  display: grid;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

@media (max-width: 380px) {
  .div-content {
    display: unset;
  }
}
</style>
