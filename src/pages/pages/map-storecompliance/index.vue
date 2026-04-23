<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4
          class="text-h4 font-weight-medium"
          style="color: white;"
        >
          Map Store to Compliance
        </h4>
        <!--
          <div class="text-body-1">
          Orders placed across your store
          </div> 
        -->
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <RouterLink
          to="/pages/map-storecompliance-list"
          class=""
        >
          <VBtn color="secondary">
            ย้อนกลับ
          </VBtn>
        </RouterLink>
        <VBtn
          :color="buttonColor"
          @click="create_MapStoreCompliance"
        >
          บันทึก
        </VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="12">
        <!-- 👉 Variants -->
        <VCard class="mb-6">
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="12"
              >
                <AppAutocomplete 
                  v-model="store_id" 
                  label="Store"
                  placeholder="เลือก Store" 
                  :items="storelist" 
                  item-title="store_name_report"
                  item-value="store_id"
                  clearable 
                  clear-icon="tabler-x"
                  chips
                  multiple
                  closable-chips
                  :disabled="ids2>0"
                  @update:model-value="get_all_MapStoreComplianceList_filter"
                />
              </VCol>
                
                
              <VCol
                cols="12"
                md="6"
              >
                <AppAutocomplete 
                  v-model="group_name_select" 
                  label="ชื่อรายการโปรโมชั่น"
                  placeholder="เลือก ชื่อรายการโปรโมชั่น" 
                  :items="groupnamelist" 
                  item-title="name"
                  item-value="id"
                  clearable 
                  clear-icon="tabler-x"
                  @update:model-value="set_groupname"
                  @click:clear="set_groupname"
                />
              </VCol>

              <VCol
                v-if="group_name_select==0"
                cols="12"
                md="6"
                style="display: flex;align-items: center;justify-content: center;"
              >
                <AppTextField
                  v-model="group_name"
                  placeholder=""
                  type="text"
                  label="ชื่อรายการโปรโมชั่น'"
                />
              </VCol>
            </VRow>
          </VCardText>
          <VDivider />


          <VCardText>
            <VCol
              v-if="group_name_select"
              cols="12"
              md="12"
            >
              <VBtn @click="addrow">
                เพิ่มสินค้า
              </VBtn>
            </VCol>
            <template
              v-for="(v,i) in MapStoreCompliance"
              :key="i"
            >
              <VRow :style="(i%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppAutocomplete 
                    v-model="v.product_id" 
                    label="Product"
                    placeholder="เลือก Product" 
                    :items="productlist" 
                    item-title="new_name"
                    item-value="id"
                    clear-icon="tabler-x"
                    clearable 
                    @update:model-value="change_product(i)"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="3"
                >
                  <AppAutocomplete 
                    v-model="v.placement_point_id" 
                    label="ตำแหน่งที่วาง"
                    placeholder="ตำแหน่งที่วาง" 
                    :items="PlacementPointlist" 
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                  />
                </VCol>
                  
                <VCol
                  cols="12"
                  md="2"
                  class="d-flex align-self-end"
                >
                  <AppAutocomplete 
                    v-model="v.rental_area_unit_id" 
                    label="พื้นที่เช่า"
                    placeholder="พื้นที่เช่า" 
                    :items="groupedRentalAreaUnit" 
                    item-title="display_name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    @update:model-value="get_unit(i)"
                  />
                </VCol>
                <VCol
                  cols="6"
                  md="1"
                  class="d-flex align-self-end"
                >
                  <AppTextField
                    v-model="v.qty"
                    type="text"
                    label="จำนวน"
                  />
                </VCol>
                <VCol
                  cols="6"
                  md="2"
                  class="d-flex align-self-end"
                >
                  <AppAutocomplete 
                    v-model="v.rental_area_unit_name" 
                    label="หน่วย"
                    placeholder="หน่วย" 
                    :items="v.user_list" 
                    item-title="unit"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                  />
                </VCol>
                <VCol
                  cols="6"
                  md="2"
                >
                  <AppDateTimePicker
                    v-model="v.startdate"
                    label="วันเริ่มต้น"
                    placeholder="Select วันเริ่มต้น"
                  />
                </VCol>
                <VCol
                  cols="6"
                  md="2"
                >
                  <AppDateTimePicker
                    v-model="v.enddate"
                    label="วันสิ้นสุด"
                    placeholder="Select วันสิ้นสุด"
                  />
                </VCol>
                <VCol
                  cols="1"
                  md="1"
                  style="display: flex;align-items: end;"
                >
                  <IconBtn>
                    <VIcon
                      icon="tabler-trash"
                      style="color: red;"
                      @click="delete_row_confirm(v,i)"
                    />
                  </IconBtn>
                </VCol>
              </VRow>
            </template>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import apiService from '@/services/api'
import Swal from 'sweetalert2'
import { useRoute } from 'vue-router'

export default {
  setup() {
    // เรียกใช้ useRoute() เพื่อรับข้อมูล route ปัจจุบัน
    const route = useRoute()

    return {
      route,
    }
  },
  data: () => ({
    setbtn: 0,
    select_store: '',
    breadcrumbs: [],
    date_start: new Date(),
    date_end: new Date(),
    rowdata: [{
      product_name: '',
      qty: '',
      oos: false,
      notsell: false,
      note: '',
    }, {
      product_name: '',
      qty: '',
      oos: false,
      notsell: false,
      note: '',
    }, {
      product_name: '',
      qty: '',
      oos: false,
      notsell: false,
      note: '',
    }],
    show_p: false,
    items: [
      {
        title: 'เลือก',
        value: '',
      },
      {
        title: 'ร้านค้า 1',
        value: '1',
      },
      {
        title: 'ร้านค้า 2',
        value: '2',
      },
      {
        title: 'ร้านค้า 3',
        value: '3',
      },
    ],
    account_id: null,
    account_type_id: null,
    group_customer_id: null,
    store_id: [],
    group_name: null,
    datalist: [],
    accountlist: [],
    accounttypelist: [],
    groupcustomerlist: [],
    storelist: [],
    groupnamelist: [],
    productlist: [],
    MapStoreCompliance: [],
    MapStoreCompliance_hide: [],
    rental_area_unitlist: [],
    unitlist: [],
    groupedRentalAreaUnit: [],
    PlacementPointlist: [],
    group_name_select: null,
    action: 'add',
    color_active: 0,
    ids2: 0,
    userData: {},
  }),
  computed: {
    buttonColor() {
      console.log(this.color_active)
      
      return this.color_active <= 0 ? 'secondary' : 'primary'
    },
  },
  mounted(){

    this.$nextTick(function(){
      const userData = useCookie('userData')

      this.userData = userData.value

      // const userData = this.getCookie('userData');
      // this.userData = userData;
      console.log(this.userData.group_customer_id)
      if (this.route && this.route.query) {
        const ids = this.route.query.ids
        if (ids) {
          this.ids2 = ids
          this.get_all_MapStoreCompliance_filter(ids)
            
        }else{
          console.log('No ids parameter provided in the URL.')
          this.get_all_store_user2()
          this.getall()
          this.action = 'add'
        }
      } else {
        console.log('Route or query parameters are not available.')
        this.get_all_store_user2()
        this.getall()
        this.action = 'add'
      }
    })

      
    // const ids = route.query.ids ? route.query.ids.split(',') : [];
    // console.log(ids);
    // if (ids.length > 0) {
    //   axios.post('/your-api-endpoint', { ids })
    //     .then(response => {
    //       console.log(response.data);
    //     })
    //     .catch(error => {
    //       console.error(error);
    //     });
    // }
  },
  methods: {
    get_notsell(k){
      console.log(this.rowdata[k].notsell)
      this.rowdata[k].qty = 0
    },
    addrow(){
      const vm = this

      this.MapStoreCompliance.push({
        id: null,
        map_product_id: null,
        product_id: null,
        placement_point_id: null,
        rental_area_unit_name: null,
        qty: null,
        rental_area_unit_id: null,
        startdate: null,
        enddate: null,
      })
      console.log(this.MapStoreCompliance)
      vm.color_active++
    },
    show_product(){
      console.log(this.select_store)
      if(this.select_store == null){
        this.select_store = ''
      }
      if(this.select_store == ''){
        this.show_p = false
      }else{
        this.show_p = true
      }
        
    },
    async getall(){
      try {
        const form = {
          area_manager: this.userData.area_manager,
          area_supervisor: this.userData.area_supervisor,
          code: this.userData.code,
          position_id: this.userData.position_id,
          position_name: this.userData.position_name,
          group_customer_id: this.userData.group_customer_id,
        }

        const response = await apiService.get_all_MapStoreCompliance(form)

        this.datalist = response.data.data
        this.totalrecord = response.data.data.length
        this.datalist.forEach((item, index) => {
          this.datalist[index].Active = item.isActive == 'Y' ? true : false
          this.datalist[index].num = index + 1
        })
      } catch (error) {
        console.error('Error:', error)
      }
    }, 
    async get_all_store_user2(){
      var form = {
        group_customer_id: this.userData.group_customer_id,
        user_id: this.userData.id,
        user_code: this.userData.code,
        position_name: this.userData.position_name,
      }
      const response = await apiService.get_all_store_user2(form)

      this.storelist = response.data.data.filter(x => x.isActive == 'Y')
      this.storelist.forEach((item, index) => {
        item.store_name_report = item.account_name+' '+item.store_code+' '+item.account_type_name+' '+item.store_name+' '+item.name_in_thai

        // item.store_name_report = item.account_name+item.branch_name+item.province_name;
      })
    }, 
    async get_all_store_edit() {
      const vm = this

      vm.action = 'edit'

      // โหลดข้อมูล storelist ก่อน (เหมือนเดิม)
      var form = {
        group_customer_id: this.userData.group_customer_id,
        user_id: this.userData.id,
        user_code: this.userData.code,
        position_name: this.userData.position_name,
      }
      const response = await apiService.get_all_store_user2(form)

      this.storelist = response.data.data
      this.storelist.forEach((item, index) => {
        item.store_name_report = `${item.account_name} ${item.store_code} ${item.account_type_name} ${item.store_name} ${item.name_in_thai}`
      })

      // --- ส่วนที่แก้ไข ---
      // 1. โหลดข้อมูลสำหรับ Dropdown ทั้งหมดให้เสร็จก่อน
      // ใช้ Promise.allSettled เพื่อให้โหลดพร้อมกันได้เลย จะเร็วกว่า
      try {
        console.log("Starting to load master data (rental areas, products, etc.)...")
        await Promise.allSettled([
          vm.get_all_rental_area_unit(),
          vm.get_product_by_groupcustomerid(vm.storelist, vm.store_id),
          vm.get_all_PlacementPoint(),
        ])
        console.log("Master data loaded successfully.")

        // 2. เมื่อข้อมูล Dropdown พร้อมแล้ว ค่อยเรียก set_groupname2 เพื่อโหลดข้อมูลหลัก
        await vm.set_groupname2()
        console.log("Main form data processed.")

      } catch (error) {
        console.error("Error during data loading sequence:", error)
      }
    },
    async get_unit(i) {
      const selectedItem = this.groupedRentalAreaUnit.find(
        item => item.id === this.MapStoreCompliance[i].rental_area_unit_id,
      )

      if (!selectedItem) {
        this.MapStoreCompliance[i].user_list = []
        this.MapStoreCompliance[i].rental_area_unit_name = null
        
        return
      }

      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          name: selectedItem.name,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_unit(form)

        this.MapStoreCompliance[i].user_list = response.data.data

        // --- บรรทัดนี้ต้องไม่มี ---
        // this.MapStoreCompliance[i].rental_area_unit_name = null;

      } catch (error) {
        console.error('Error:', error)
      }
    },
    async get_unit2(rental_area_unit_id, i){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          id: rental_area_unit_id,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_unit2(form)


        // this.unitlist = response.data.data;
        this.MapStoreCompliance[i].user_list = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_unit2bk(rental_area_unit_id){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          id: rental_area_unit_id,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_unit2(form)

        this.unitlist = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_all_PlacementPoint(){
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_all_PlacementPoint(form)

        this.PlacementPointlist = response.data.data.filter(x =>x.isActive == 'Y')
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    async get_all_rental_area_unit() {
      try {
        var form = {
          group_customer_id: this.userData.group_customer_id,
          position_name: this.userData.position_name,
          store_id: this.store_id,
        }
        const response = await apiService.get_all_rental_area_unit(form)

        this.rental_area_unitlist = response.data.data.filter(x => x.isActive == 'Y')

        this.groupedRentalAreaUnit = this.rental_area_unitlist.map(item => {
          return {
            ...item, // คัดลอก property เดิมมาทั้งหมด
            display_name: `${item.name} (${item.unit || 'ไม่มีหน่วย'})`, 
          }
        })
        
      } catch (error) {
        console.error('Error:', error)
      }
    },

    // async get_all_group_name_compliance(){
    //   try {
    //     const form = {
    //       store_id: vm.store_id,
    //     };
    //     const response = await apiService.get_all_group_name_compliance(form);
        
    //     this.groupnamelist = response.data.data;
    //     this.groupnamelist.push({
    //       id: '0',
    //       name: '+Add',
    //     });
    //     console.log(this.groupnamelist);
    //     // เรียงข้อมูลโดยให้ id: '0' อยู่ด้านบนเสมอ
    //     this.groupnamelist.sort((a, b) => {
    //       if (a.id === '0') return -1;  // ให้ a.id === '0' อยู่ด้านบน
    //       if (b.id === '0') return 1;   // ให้ b.id === '0' อยู่ด้านล่าง
    //       return 0; // ไม่มีการเปลี่ยนแปลงในกรณีที่ทั้งคู่ไม่ใช่ '0'
    //     });
    //     if(response.data.data.length == 0){
    //       this.group_name_select = null
    //     }
    //     this.setbtn = 1;
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
    // }, 
    removeDuplicateByName(arr) {
      const seen = new Map() // ใช้ Map เพื่อตรวจสอบค่า
      
      return arr.filter(item => {
        if (seen.has(item.name)) {
          return false // ถ้า name ซ้ำให้กรองออก
        }
        seen.set(item.name, true) // เพิ่ม name เข้า Map
        
        return true // ถ้าไม่ซ้ำให้เก็บไว้
      })
    },
    removeDuplicateByName2(arr) {
      const seen = new Map() // ใช้ Map เพื่อตรวจสอบค่า
      
      return arr.filter(item => {
        if (seen.has(item.product_id)) {
          return false // ถ้า product_id ซ้ำให้กรองออก
        }
        seen.set(item.product_id, true) // เพิ่ม product_id เข้า Map
        
        return true // ถ้าไม่ซ้ำให้เก็บไว้
      })
    },
    async get_all_MapStoreComplianceList_filter(){
      const vm = this
      if(vm.store_id > 0 || vm.store_id.length > 0){
        const form = {
          store_id: vm.store_id,
          name: vm.group_name,
          position_name: this.userData.position_name,
        }
          
        const response2 = await apiService.get_all_produuct_store_compliance(form)
        if(response2.data.data.length == 0){
          this.group_name_select = null
          this.groupnamelist = []
          this.groupnamelist.push({
            id: '0',
            name: '+Add',
          })
        }else{
          const uniqueData = this.removeDuplicateByName(response2.data.data)

          console.log(uniqueData)
          this.groupnamelist = uniqueData
            
          this.groupnamelist.push({
            id: '0',
            name: '+Add',
          })

          // เรียงข้อมูลโดยให้ id: '0' อยู่ด้านบนเสมอ
          this.groupnamelist.sort((a, b) => {
            if (a.id === '0') return -1  // ให้ a.id === '0' อยู่ด้านบน
            if (b.id === '0') return 1   // ให้ b.id === '0' อยู่ด้านล่าง
            
            return 0 // ไม่มีการเปลี่ยนแปลงในกรณีที่ทั้งคู่ไม่ใช่ '0'
          })
        }
        console.log(vm.storelist)
        console.log(vm.store_id)
        vm.get_product_by_groupcustomerid(vm.storelist, vm.store_id)
        vm.get_all_rental_area_unit()
        vm.get_all_PlacementPoint()
      }else{
        vm.groupnamelist = []
      }
    },
    async create_MapStoreCompliance(){
      const vm = this
      try {
        if(vm.store_id.length > 0 || vm.store_id > 0){
          const form = {
            store_id: vm.store_id,
            name: vm.group_name,
            group_name_select: vm.group_name_select,
          }

          console.log(form)

          const response = await apiService.create_MapStoreCompliance(form)

          console.log(response.data.data.id)

          const form2 = []

          response.data.data.forEach((item, index) => {
            vm.MapStoreCompliance.forEach((item2, index2) => {
              form2.push({
                id: vm.group_name_select==0 ? null:item2.id,
                map_product_id: item.id,
                product_id: item2.product_id,
                placement_point_id: item2.placement_point_id,
                rental_area_unit_name: item2.rental_area_unit_name,
                qty: item2.qty,
                rental_area_unit_id: item2.rental_area_unit_id,
                startdate: item2.startdate,
                enddate: item2.enddate,
                store_id: vm.store_id,
              })
            })
          })
          
          console.log(form2)

          const response2 = await apiService.createOrUpdate_MapStoreComplianceList(form2)

          Swal.fire({
            title: 'บันทึกสำเร็จ!',
            icon: 'success',
            confirmButtonText: 'OK',
          })
          if(vm.ids2 > 0){
            vm.get_all_MapStoreComplianceList_filter()
            setTimeout(() => {
              const group = vm.groupnamelist.find(item => item.name === vm.group_name)

              vm.group_name_select = group.id || null
            }, 200)
          }else{
            vm.get_all_MapStoreComplianceList_filter()
          }
        }else{

        }
        
        
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async set_groupname(){
      const vm = this
      
      if(vm.group_name_select == null){
        vm.group_name = ''
        vm.color_active++
        vm.MapStoreCompliance = []
        vm.MapStoreCompliance_hide = []
      }else if(vm.group_name_select == '0'){
        vm.group_name = ''
        vm.color_active++
        
        vm.get_product_by_groupcustomerid(vm.storelist, vm.store_id)
      }else{
        const group = this.groupnamelist.find(item => item.id === vm.group_name_select)

        vm.group_name = group.name
        vm.setbtn = 1
        if(vm.color_active > 0){
          vm.color_active--
        }
        
        const form = {
          store_id: vm.store_id,
          name: vm.group_name,
        }

        const response = await apiService.get_all_MapStoreComplianceList_filter(form)
        const uniqueData = this.removeDuplicateByName2(response.data.data)

        console.log(uniqueData)
        var MapStoreCompliance = uniqueData
        var MapStoreCompliance_old = uniqueData
        
        MapStoreCompliance.forEach((item, index) => {
          
          MapStoreCompliance[index].placement_point_id = (item.placement_point_id?item.placement_point_id:null)
          MapStoreCompliance[index].rental_area_unit_name = (item.rental_area_unit_name?item.rental_area_unit_name:null)
          MapStoreCompliance[index].qty = (item.qty?item.qty:null)
          MapStoreCompliance[index].rental_area_unit_id = (item.rental_area_unit_id?item.rental_area_unit_id:null)
          MapStoreCompliance[index].startdate = (item.startdate?item.startdate:null)
          MapStoreCompliance[index].enddate = (item.enddate?item.enddate:null)

          MapStoreCompliance[index].placement_point_id_old = (item.placement_point_id?item.placement_point_id:null)
          MapStoreCompliance[index].rental_area_unit_name_old = (item.rental_area_unit_name?item.rental_area_unit_name:null)
          MapStoreCompliance[index].qty_old = (item.qty?item.qty:null)
          MapStoreCompliance[index].rental_area_unit_id_old = (item.rental_area_unit_id?item.rental_area_unit_id:null)
          MapStoreCompliance[index].startdate_old = (item.startdate?item.startdate:null)
          MapStoreCompliance[index].enddate_old = (item.enddate?item.enddate:null)
            
            
          // vm.group_name = MapStoreCompliance[index]?.MapStoreCompliance?.name || '';
          // const group = vm.groupnamelist.find(item => item.name === vm.group_name);
          // vm.group_name_select = group.id || null;
        })
        vm.MapStoreCompliance = MapStoreCompliance
        vm.MapStoreCompliance_hide = MapStoreCompliance_old

        vm.MapStoreCompliance.forEach((item, index) => {
          
          vm.MapStoreCompliance[index].rental_area_unit_name = (item.rental_area_unit_name?item.rental_area_unit_name:null)
          vm.get_unit(index)
        })
        vm.get_product_by_groupcustomerid(vm.storelist, vm.store_id)
        console.log(vm.MapStoreCompliance_hide)
        
      }
    },
    async set_groupname2() {
      const vm = this

      const form = {
        store_id: vm.store_id,
        name: vm.group_name,
      }

      const response = await apiService.get_all_MapStoreComplianceList_filter(form)
      const uniqueData = this.removeDuplicateByName2(response.data.data)

      // สร้าง Array ใหม่เพื่อป้องกันปัญหา reactivity ของ Vue
      const newMapStoreCompliance = uniqueData.map(item => ({
        ...item, // คัดลอก property ทั้งหมดจาก item เดิม
        placement_point_id: item.placement_point_id || null,
        rental_area_unit_name: item.rental_area_unit_name || null,
        qty: item.qty || null,
        rental_area_unit_id: item.rental_area_unit_id || null,
        startdate: item.startdate || null,
        enddate: item.enddate || null,
            
        // เก็บค่าเก่าไว้เผื่อใช้เปรียบเทียบ
        placement_point_id_old: item.placement_point_id || null,
        rental_area_unit_name_old: item.rental_area_unit_name || null,
        qty_old: item.qty || null,
        rental_area_unit_id_old: item.rental_area_unit_id || null,
        startdate_old: item.startdate || null,
        enddate_old: item.enddate || null,

        user_list: [], // สร้าง property user_list ไว้รอเลย
      }))

      vm.MapStoreCompliance = newMapStoreCompliance
      vm.MapStoreCompliance_hide = JSON.parse(JSON.stringify(newMapStoreCompliance)) // Deep copy สำหรับเปรียบเทียบ

      // หลังจากกำหนดค่าให้ vm.MapStoreCompliance แล้ว
      // ให้วนลูปเพื่อดึงข้อมูล "หน่วย" (Unit) ของแต่ละแถว
      for (let i = 0; i < vm.MapStoreCompliance.length; i++) {
        const item = vm.MapStoreCompliance[i]
        if (item.rental_area_unit_id > 0) {
          // เราจะใช้ get_unit(i) แทน get_unit2 เพราะมันทำงานกับ index ของ MapStoreCompliance โดยตรง
          await vm.get_unit(i) 

          // ทำให้ค่า rental_area_unit_name ที่เคยโหลดมา ถูกเลือกใน dropdown หน่วยทันที
        }
      }

      console.log('Final MapStoreCompliance:', vm.MapStoreCompliance)
    },
    change_product(i){
      const vm = this

      console.log(vm.MapStoreCompliance_hide)
      console.log(vm.MapStoreCompliance)
      console.log(i)
      vm.MapStoreCompliance_hide.forEach((item, index) => {
        
        if(index == i){
          console.log(item.id)
          if(item.id){
            console.log(item.product.id+'==='+vm.MapStoreCompliance[i].product_id)
            if(item.product.id != vm.MapStoreCompliance[i].product_id){
              vm.color_active++
            }else{
              vm.color_active--
            }
          }
        }
      })
    },
    change_checkboxt(i) {
      const vm = this
      if (i < 0 || i >= vm.MapStoreCompliance_hide.length) return
      if (vm.MapStoreCompliance_hide[i].oos_old != vm.MapStoreCompliance[i].oos) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    change_checkboxt2(i) {
      const vm = this
      if (i < 0 || i >= vm.MapStoreCompliance_hide.length) return
      if (vm.MapStoreCompliance_hide[i].price_old != vm.MapStoreCompliance[i].price) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    change_checkboxt3(i) {
      const vm = this
      if (i < 0 || i >= vm.MapStoreCompliance_hide.length) return
      if (vm.MapStoreCompliance_hide[i].offtake_old != vm.MapStoreCompliance[i].offtake) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    change_checkboxt4(i) {
      const vm = this
      if (i < 0 || i >= vm.MapStoreCompliance_hide.length) return
      if (vm.MapStoreCompliance_hide[i].week_old != vm.MapStoreCompliance[i].week) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    change_checkboxt5(i) {
      const vm = this
      if (i < 0 || i >= vm.MapStoreCompliance_hide.length) return
      if (vm.MapStoreCompliance_hide[i].area_old != vm.MapStoreCompliance[i].area) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    change_checkboxt6(i) {
      const vm = this
      if (i < 0 || i >= vm.MapStoreCompliance_hide.length) return
      if (vm.MapStoreCompliance_hide[i].msl_old != vm.MapStoreCompliance[i].msl) {
        vm.color_active++
      }else{
        vm.color_active--
      }
    },
    async get_all_MapStoreCompliance_filter(id){
      const vm = this
      try {
        const form = {
          id: id,
        }

        const response = await apiService.get_all_MapStoreCompliance_filter(form)
        var data = response.data.data
        vm.store_id = data.store_id
        vm.group_name = data.name
        vm.group_name_select = data.name

        // console.log('store_id',vm.store_id);
        vm.get_all_store_edit()
        
       
        
        
        
      } catch (error) {
        console.error('Error:', error)
      }
    },  
    getCookie(name) {
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=')

        acc[key] = decodeURIComponent(value)
        
        return acc
      }, {})

      
      return cookies[name] || null // คืนค่า null หาก Cookie ไม่มีชื่อที่ค้นหา
    },
    getGroupCustomerId(storelist, selectedStoreIds) {
      console.log('storelist', storelist)
      console.log('selectedStoreIds', selectedStoreIds)

      const vm = this

      // ตรวจสอบและบังคับเป็น Array
      const storeIds = Array.isArray(selectedStoreIds) ? selectedStoreIds : [selectedStoreIds]

      // กรอง storelist ให้เหลือเฉพาะ store_id ที่ตรงกับ selectedStoreIds
      const filteredStores = storelist.filter(store => storeIds.includes(store.store_id))

      // ตรวจสอบว่า filteredStores มีข้อมูลหรือไม่
      if (filteredStores.length > 0) {
        // ดึงค่า group_customer_id ตัวแรกออกมา
        return filteredStores[0].group_customer_id
      }

      // ถ้าไม่พบค่าใดๆ
      return null

      // // กรอง storelist ให้เหลือเฉพาะ store_id ที่ตรงกับ selectedStoreIds
      // const filteredStores = storelist.filter(store => selectedStoreIds.includes(store.id));

      // // ตรวจสอบว่า filteredStores มีข้อมูลหรือไม่
      // if (filteredStores.length > 0) {
      //     // ดึงค่า group_customer_id ตัวแรกออกมา
      //     return filteredStores[0].group_customer_id;
      // }

      // // ถ้าไม่พบค่าใดๆ
      // return null;
    },
    async get_product_by_groupcustomerid(storelist, store_id){
      const vm = this

      console.log('storelist', storelist)
      console.log('store_id', store_id)


      // const store = this.storelist.find(item => item.id === this.store_id);
      const groupCustomerId = vm.getGroupCustomerId(storelist, store_id)

      console.log(groupCustomerId)

      // console.log('groupCustomerId',groupCustomerId);
      // console.log('storelist',this.storelist);
      // console.log('store_id',this.store_id);
      if(groupCustomerId){
        const response = await apiService.get_product_by_groupcustomerid(groupCustomerId)

        vm.productlist = response.data.data.filter(x => x.isActive == 'Y')
        vm.productlist.forEach((item, index) => {
          vm.productlist[index].new_name = item.name+(item.flavor?'('+item.flavor+')':'')
        })

        // this.get_all_account_filter();
        // this.get_all_MapProductStoreList_filter();
      }else{
        vm.productlist = []
        vm.MapStoreCompliance = []
      }
    },
    async delete_row_confirm(val, index){
      Swal.fire({
        title: "ยืนยันการลบ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
      }).then(result => {
        if (result.isConfirmed) {
          this.delete_row(val, index)
        }
      })
    },
    async delete_row(val, index){
      try {
        if(val.id){
          const form = {
            id: val.id,
          }

          const response2 = await apiService.delete_MapComplianceList(form)
        }
        
        Swal.fire({
          html: '<div style="font-size: 1.875em;font-weight: 600;display: flex;justify-content: center;">Very Good! <i class="tabler-thumb-up" style="font-size: 40px;"></i></div>',
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => Swal.showLoading(),
        })
        this.MapStoreCompliance.splice(index, 1)
      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },   
  },
}
</script>

<style lang="scss" scoped>
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }

  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;
    }

    .v-label.custom-input {
      border: none !important;
    }
  }
}

.v-checkbox.v-selection-control .v-label,
.v-checkbox-btn.v-selection-control .v-label {
  font-size: 14px;
}
</style>
