<script setup>

    import apiService from '@/services/api';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

import AppSelect from '@/@core/components/app-form-elements/AppSelect.vue';
import {
  onMounted,
  ref,
} from 'vue';
    
    const isDialogVisible = ref(false)
    const importmodal = ref(false)
    const apiurl = ref(null)
    apiurl.value = import.meta.env.VITE_API_URL;
    const loading = ref(true)
    const isConfirmPasswordVisible = ref(false)
    
    const data_id = ref('')
    const data_name = ref('')
    const data_lastname = ref('')
    const code = ref('')
    const newpassword = ref('')
    const cnewpassword = ref('')
    const data_email = ref('')
    const data_picture = ref([])
    const data_prefix = ref('')
    const prefix = [
      'นาย',
      'นาง',
      'นางสาว',
    ]
    const data_job_position = ref('')
    const job_position = ref([])
    const data_position = ref('')
    const position = ref([])
    const data_area_supervisor = ref('')
    const area_supervisor = ref([])
    const data_area_manager = ref('')
    const area_manager = ref([])
    const datalist = ref([])
    const totalrecord = ref(0)
    const refForm = ref()
    const dataPic = ref(null)

    const group_customerlist = ref([])
    const group_customer_id = ref(null)

    const searchQuery = ref('')
    const filtereddatalist = computed(() => {
      if (!searchQuery.value) return datalist.value
      
      return datalist.value.filter(item => {
        const searchText = searchQuery.value.toLowerCase()
        return (
          item.name.toLowerCase().includes(searchText) || 
          item.groupCustomer.name.toLowerCase().includes(searchText)
        )
      })
    })
    const itemsPerPage = ref(10)
    const page = ref(1)
    const sortBy = ref()
    const orderBy = ref()
    
    onMounted(() => {
      getall();
      get_all_group_customer();
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
    
        await apiService.import_user(formData)
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
    const exportToExcel = (res) => {
      // แปลงข้อมูลให้เป็น array ของ object
      const data = filtereddatalist.value.map(item => ({
        'ID': item.id,
        'group_customer_id': item.groupCustomer.name,
        'email': item.email,
        'password': '',
        'code': item.code,
        'prefix': item.prefix,
        'name': item.name,
        'last_name': item.last_name,
        'job_position_id': item.jobPosition.name,
        'position_id': item.position.name,
        'area_supervisor': item.areaSupervisor.name,
        'area_manager': item.areaManager.name,
        'Is Active': item.isActive == 'Y' ? 'Yes' : 'No'
      }));

      // console.log(data);
      // สร้าง worksheet และ workbook
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      // เข้ารหัสไฟล์เป็น binary และดาวน์โหลด
      XLSX.writeFile(workbook, 'User.xlsx');
    };
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
        title: 'Email',
        key: 'email',
      },
      {
        title: 'ชื่อ-นามสกุล',
        key: 'name',
      },
      {
        title: 'รหัสพนักงาน',
        key: 'code',
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
    
    const getall = async () => {
      const form = {
        position_name: userData.value.position_name,
        user_id: userData.value.id,
        group_customer_id: userData.value.group_customer_id,
      };
      await apiService.get_all_user(form)
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

      await apiService.get_all_job_position(form)
      .then(response => {
        job_position.value = response.data.data
      })

      await apiService.get_all_position(form)
      .then(response => {
        position.value = response.data.data
      })

      await apiService.get_all_area_supervisor(form)
      .then(response => {
        area_supervisor.value = response.data.data
      })

      await apiService.get_all_area_manager(form)
      .then(response => {
        area_manager.value = response.data.data
      })
    }
    const filter = async () => {
      const form = {
        position_name: userData.value.position_name,
        user_id: userData.value.id,
        group_customer_id: group_customer_id.value,
      };

      await apiService.filter_all_job_position(form)
      .then(response => {
        job_position.value = response.data.data
      })

      await apiService.filter_all_position(form)
      .then(response => {
        position.value = response.data.data
      })

      await apiService.filter_all_area_supervisor(form)
      .then(response => {
        area_supervisor.value = response.data.data
      })

      await apiService.filter_all_area_manager(form)
      .then(response => {
        area_manager.value = response.data.data
      })
    }
    const update_user_isActive = async v => {
      try {
        // const data = await $api("https://api-test.iservreport.com/api/backend/update_user_isActive/"+v.id, {
        //     method: "PUT",
        //     body: {
        //       isActive: v.Active ? "Y" : "N",
        //     },
        // });

        await apiService.update_user_isActive(v.id,{isActive: v.Active ? "Y" : "N"})
        .then(response => {
          Swal.fire({
            title: 'Update successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          })
          getall();
        })

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
    }
    const editdata = async val => {
      data_id.value = val.id;
      group_customer_id.value = val.group_customer_id;
      data_name.value = val.name;
      data_lastname.value = val.last_name;
      data_email.value = val.email;
      data_prefix.value = val.prefix;
      data_job_position.value = val.job_position_id;
      data_position.value = val.position_id;
      data_area_supervisor.value = val.area_supervisor;
      data_area_manager.value = val.area_manager;
      code.value = val.code;
      // if(val.picture != null){
        dataPic.value = apiurl.value+val.picture;
      // }

      newpassword.value = '';
      cnewpassword.value = '';
      isDialogVisible.value = true
    }
    const openmodal = async () => {
      data_id.value = '';
      group_customer_id.value = '';
      data_name.value = '';
      data_email.value = '';
      newpassword.value = '';
      cnewpassword.value = '';
      prefix.value = '';
      data_job_position.value = '';
      data_position.value = '';
      data_area_supervisor.value = '';
      data_area_manager.value = '';
      code.value = '';
      data_lastname.value = '';
      data_picture.value = [];
      dataPic.value = null;

      isDialogVisible.value = true
    }
    const save = async () => {
      try {
        // ตรวจสอบการ validate ของฟอร์ม
        const isValid = await refForm.value?.validate();
        if (isValid.valid) {
          // ฟอร์มผ่านการ validate ให้ทำการบันทึกข้อมูล
          isDialogVisible.value = true
          if(data_id.value != ""){
              if(newpassword.value != cnewpassword.value){
                Swal.fire({
                  title: 'รหัสผ่านไม่ตรงกัน!',
                  icon: 'error',
                  confirmButtonText: 'OK'
                })
                newpassword.value = '';
                cnewpassword.value = '';
                
              }else{
                const formData = new FormData();
                if(data_picture.value.length > 0){
                  data_picture.value.forEach((preview) => {
                    formData.append('picture', data_picture.value[0].file);
                  });
                }else{
                  formData.append('picture', []);
                }
                formData.append('id', data_id.value);
                formData.append('name', data_name.value);
                formData.append('last_name', data_lastname.value);
                formData.append('email', data_email.value);
                formData.append('password', newpassword.value);
                formData.append('prefix', data_prefix.value);

                formData.append('job_position_id', data_job_position.value);
                formData.append('position_id', data_position.value);
                formData.append('area_supervisor', data_area_supervisor.value);
                formData.append('area_manager', data_area_manager.value);
                formData.append('code', code.value);
                formData.append('group_customer_id', group_customer_id.value);
                formData.append('isActive', 'Y');

                
                formData.append('data_picture', data_picture.value);
                // const form = {
                //   id : data_id.value,
                //   password:newpassword.value,
                //   name: data_name.value,
                //   last_name: data_lastname.value,
                //   email: data_email.value,
                //   prefix: data_prefix.value,
                //   job_position_id: data_job_position.value,
                //   position_id: data_position.value,
                //   area_supervisor: data_area_supervisor.value,
                //   area_manager: data_area_manager.value,
                //   code: code.value,
                //   group_customer_id: group_customer_id.value,
                // }
                await apiService.update_user(formData)
                .then(response => {
                  if(response.data.status == 'success'){
                    Swal.fire({
                      title: response.data.message,
                      icon: 'success',
                      confirmButtonText: 'OK'
                    })
                    getall(); // โหลดข้อมูลใหม่
                    isDialogVisible.value = false
                    return;
                  }else{
                    Swal.fire({
                      title: response.data.message,
                      icon: 'error',
                      confirmButtonText: 'OK'
                    })
                    return;
                  }
                })
                .catch(error => {
                  console.error('Error :', error);
                });
              }
          } else {
            const formData = new FormData();
            if(data_picture.value.length > 0){
              data_picture.value.forEach((preview) => {
                formData.append('picture', data_picture.value[0].file);
              });
            }else{
              formData.append('picture', []);
            }
            formData.append('name', data_name.value);
            formData.append('last_name', data_lastname.value);
            formData.append('email', data_email.value);
            formData.append('password', newpassword.value);
            formData.append('prefix', data_prefix.value);

            formData.append('job_position_id', data_job_position.value);
            formData.append('position_id', data_position.value);
            formData.append('area_supervisor', data_area_supervisor.value);
            formData.append('area_manager', data_area_manager.value);
            formData.append('code', code.value);
            formData.append('group_customer_id', group_customer_id.value);
            formData.append('isActive', 'Y');

            
            formData.append('data_picture', data_picture.value);
            await apiService.create_users(formData)
            .then(response => {
              if(response.data.status == 'success'){
                Swal.fire({
                  title: response.data.message,
                  icon: 'success',
                  confirmButtonText: 'OK'
                })
                getall(); // โหลดข้อมูลใหม่
                isDialogVisible.value = false
                return;
              }else{
                Swal.fire({
                  title: response.data.message,
                  icon: 'error',
                  confirmButtonText: 'OK'
                })
                return;
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
    function customFilter(itemTitle, queryText, item) {
      const textOne = item.raw.name.toLowerCase()
      const textTwo = item.raw.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
    
      return textOne.includes(searchText) || textTwo.includes(searchText)
    }
    const removePicture = async () => {
      try {
        // เรียก API ลบภาพ (ใช้ API endpoint เดิม)
        await apiService.deleteUserPicture({ userId: data_id.value });

        // อัปเดต dataPic ให้เป็น null
        dataPic.value = null;

        Swal.fire({ icon: 'success', title: 'ลบภาพสำเร็จ', timer: 1500, showConfirmButton: false });
      } catch (error) {
        console.error('Error deleting picture:', error);
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
      }
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
              v-if="userData.position_name == 'SuperAdmin' || userData.position_name == 'Admin'"
              cols="12"
              md="8"
              class="text-right"
            >
            
              <div style="margin-block-end: 10px;" >
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
          :items="datalist || []"
          :search="search"
          :items-per-page="10"
          class="text-no-wrap"
        >
          <template #item.groupCustomer="{ item }">
            {{ item.groupCustomer.name }}
          </template>
          <template #item.name="{ item }">
            {{item.prefix}} {{item.name}} {{item.last_name}}
          </template>
          <template #item.isActive="{ item }">
            <VSwitch
              v-model="item.Active"
              @change="update_user_isActive(item)"
              :disabled="userData.position_name != 'SuperAdmin' && userData.position_name != 'Admin' && userData.position_name != 'Supervisor'" 
            />
          </template>
        
    
          <template #item.actions="{ item }">
            <IconBtn v-if="userData.position_name == 'SuperAdmin' || userData.position_name == 'Supervisor' || userData.position_name == 'Admin' || userData.id == item.id">
              <VIcon icon="tabler-edit" @click="editdata(item)"/>
            </IconBtn>
          </template>
          
        </VDataTable>
    
        <VDialog
          v-model="isDialogVisible"
          max-width="800"
        >
          <!-- Dialog close btn -->
          <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />
    
          <!-- Dialog Content -->
          <VCard :title="data_id != '' ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'">
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
                  style="
                  align-items: center;
                  justify-content: center;gap: 10px;"
                > 
                  <div style="display: grid;align-items: center;justify-content: center;">
                    <img id="preview" :src="dataPic" style="display: block;border-radius: 50%;block-size: 100px;inline-size: 100px;" alt="preview" />
                    <!-- เพิ่มปุ่มลบภาพใน Dialog -->
                    <VBtn
                      v-if="dataPic"
                      color="error"
                      size="small"
                      class="mt-2"
                      @click="removePicture"
                    >
                      ลบภาพ
                    </VBtn>
                  </div>
                  
                   <input
                      type="file"
                      id="fileInput"
                      accept="image/png, image/jpeg, image/jpg, image/gif"
                      @change="handleFiles($event)"
                    />
                    <VRow>
                      <VCol cols="3" sm="3">
                        <AppSelect
                          v-model="data_prefix"
                          :items="prefix"
                          label="คำนำหน้า"
                          :rules="[requiredValidator]"
                        />
                      </VCol>
                      <VCol cols="5" sm="5" md="5">
                        <AppTextField
                          v-model="data_name"
                          label="ชื่อ"
                          :rules="[requiredValidator]"
                          />
                      </VCol>
                      <VCol cols="4" sm="4" md="4">
                        <AppTextField
                          v-model="data_lastname"
                          label="นามสกุล"
                          :rules="[requiredValidator]"
                          />
                      </VCol>
                      <VCol cols="6" sm="6" md="6" style="padding-block-start: 0;">
                        <AppTextField
                            v-model="data_email"
                            label="Email"
                            :rules="[requiredValidator]"
                          />
                      </VCol>
                      <VCol
                        cols="6" sm="6" md="6" style="padding-block-start: 0;"
                      >
                        <AppAutocomplete
                            label="กลุ่มลูกค้า"
                            v-model="group_customer_id"
                            :items="group_customerlist"
                            item-title="name"
                            item-value="id"
                            placeholder="Select"
                            :rules="[requiredValidator]"
                            @update:modelValue="filter()"
                        />
                      </VCol>
                      <VCol cols="6" sm="6" md="6" style="padding-block-start: 0;">
                          <AppSelect
                            v-model="data_job_position"
                            :items="job_position"
                            item-title="name"
                            item-value="id"
                            label="ตำแหน่งงาน"
                            :rules="[requiredValidator]"
                          />
                      </VCol>
                      <VCol cols="6" sm="6" md="6" style="padding-block-start: 0;">
                          <AppSelect
                            v-model="data_position"
                            :items="position"
                            item-title="name"
                            item-value="id"
                            label="ตำแหน่งพนักงาน"
                            :rules="[requiredValidator]"
                          />
                      </VCol>
                      <VCol cols="6" sm="6" md="6" style="padding-block-start: 0;">
                          <AppSelect
                            v-model="data_area_manager"
                            :items="area_manager"
                            item-title="name"
                            item-value="id"
                            label="เขต Manager"
                            :rules="[requiredValidator]"
                          />
                      </VCol>
                      <VCol cols="6" sm="6" md="6" style="padding-block-start: 0;">
                          <AppSelect
                            v-model="data_area_supervisor"
                            :items="area_supervisor"
                            item-title="name"
                            item-value="id"
                            label="เขต Supervisor"
                            :rules="[requiredValidator]"
                          />
                      </VCol>
                      
                      <VCol cols="6" sm="6" md="6" style="padding-block-start: 0;">
                        <AppTextField
                            v-model="code"
                            label="รหัสพนักงาน"
                            :rules="[requiredValidator]"
                          />
                      </VCol>
                      
                      
                      <VCol cols="6" sm="6" md="6" style="padding-block-start: 0;">
                        <AppTextField
                          v-model="newpassword"
                          :label="data_id != '' ? 'รหัสผ่านใหม่' : 'รหัสผ่าน'"
                          :type="isConfirmPasswordVisible ? 'text' : 'password'"
                          :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                          @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                        />
                      </VCol>
                      <VCol cols="6" sm="6" md="6" style="padding-block-start: 0;">
                        <AppTextField
                          v-if="data_id != ''"
                          v-model="cnewpassword"
                          label="ยืนยันรหัสผ่านใหม่อีกครั้ง" 
                          :type="isConfirmPasswordVisible ? 'text' : 'password'"
                          :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                          @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                        />
                      </VCol>
                    </VRow>
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
                  <VBtn variant="tonal" color="secondary" class="mr-2" :href="'/file_upload/user.xlsx'" download>
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
    <script>
    export default {
        data: () => ({
        }),
        methods: {
          
        },
        mounted(){
    
            this.$nextTick(function(){
              const vm = this;
           
            });
    
           
            
        }
    }
    </script>
