<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium" style="color:white;">
          Map Product to Store
        </h4>
        <!-- <div class="text-body-1">
          Orders placed across your store
        </div> -->
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <RouterLink
          to="/pages/map-store-list"
          class=""
        >
        <VBtn
          color="secondary"
        >
          ย้อนกลับ
        </VBtn>
        </RouterLink>
        <VBtn :color="buttonColor" @click="create_MapProductStore">บันทึก</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="12">

        <!-- 👉 Variants -->
        <VCard class="mb-6">

            <VCardText>
              <VRow>
                <VCol cols="12" md="2">
                  <AppAutocomplete 
                    v-model="group_customer_id" 
                    label="กลุ่มลูกค้า"
                    placeholder="เลือก กลุ่มลูกค้า" 
                    :items="groupcustomerlist" 
                    item-title="name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="get_all_account_filter"/>
                </VCol>
                <VCol cols="12" md="2">
                  <AppAutocomplete 
                    v-model="account_id" 
                    label="Account"
                    placeholder="เลือก Account" 
                    :items="accountlist" 
                    item-title="account.name"
                    item-value="account_id"
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="get_account_type_by_accountid_select"
                    @click:clear="get_account_type_by_accountid_select" />
                </VCol>
                <VCol cols="12" md="2">
                  <AppAutocomplete 
                    v-model="account_type_id" 
                    label="Account Type"
                    placeholder="เลือก Account Type" 
                    :items="accounttypelist" 
                    item-title="accountType.name"
                    item-value="accountType.id"
                    clearable 
                    clear-icon="tabler-x" 
                    @update:modelValue="get_all_MapProductStoreList_filter"
                    @click:clear="get_all_MapProductStoreList_filter"/>
                </VCol>
                
                <VCol cols="12" md="2">
                  <AppAutocomplete 
                    v-model="group_name_select" 
                    label="Group name"
                    placeholder="เลือก Group name" 
                    :items="groupnamelist" 
                    item-title="new_name"
                    item-value="id"
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="set_groupname"
                    @click:clear="set_groupname" />
                </VCol>

                <VCol v-if="group_name_select==0" cols="12" md="2" style="display: flex;align-items: center;justify-content: center;">
                  <AppTextField v-model="group_name"  placeholder="" type="text" label="Group name'"  />
                </VCol>
                
                
                
              </VRow>
            </VCardText>
            <VDivider />


            <VCardText>
              <VCol v-if="group_name_select" cols="12" md="12">
                <VBtn @click="addrow">เพิ่มสินค้า</VBtn>
              </VCol>
              <template v-for="(v,i) in Mapproductlist" :key="i">
                <VRow :style="(i%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                  <VCol cols="12" md="5">
                    <VCol cols="12" md="12">
                    
                      <AppAutocomplete 
                      v-model="v.product_id" 
                      label="Product"
                      placeholder="เลือก Product" 
                      :items="productlist" 
                      item-title="new_name"
                      item-value="id"
                      clear-icon="tabler-x"
                      clearable 
                      @update:modelValue="change_product(i)"
                       />
                       <VBtn color="error" @click="confirmdelrow(Mapproductlist[i].id)" style="margin-top: 5px;">ลบ</VBtn>
                    </VCol>
                  </VCol>
                  <VCol cols="12" md="7">
                    <VRow :style="(i%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                      <VCol cols="12" md="12" style="text-align: center;">
                        <h2 v-if="i==0">ประเภทฟอร์มบันทึกรายงาน</h2> 
                      </VCol>
                      <VCol cols="6" md="3" class="d-flex align-self-center">
                        <v-checkbox v-model="Mapproductlist[i].oos" label="OOS" @change="change_checkboxt(i)"></v-checkbox>
                      </VCol>
                      <VCol cols="6" md="3" class="d-flex align-self-center">
                        <v-checkbox v-model="Mapproductlist[i].stock" label="Stock" @change="change_checkboxt1(i)"></v-checkbox>
                      </VCol>
                      <VCol cols="6" md="3" class="d-flex align-self-center">
                        <v-checkbox v-model="Mapproductlist[i].price" label="Price" @change="change_checkboxt2(i)"></v-checkbox>
                      </VCol>
                      <VCol cols="6" md="3" class="d-flex align-self-center">
                        <v-checkbox v-model="Mapproductlist[i].offtake" label="Offtake" @change="change_checkboxt3(i)"></v-checkbox>
                      </VCol>
                      <VCol cols="6" md="3" class="d-flex align-self-center">
                        <v-checkbox v-model="Mapproductlist[i].week" label="12Week" @change="change_checkboxt4(i)"></v-checkbox>
                      </VCol>
                      <VCol cols="6" md="3" class="d-flex align-self-center">
                        <v-checkbox v-model="Mapproductlist[i].area" label="พื้นที่" @change="change_checkboxt5(i)"></v-checkbox>
                      </VCol>
                      <VCol cols="6" md="3" class="d-flex align-self-center">
                        <v-checkbox v-model="Mapproductlist[i].msl" label="MSL" @change="change_checkboxt6(i)"></v-checkbox>
                      </VCol>
                    </VRow>
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

import apiService from '@/services/api';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';

export default {
  setup() {
    // เรียกใช้ useRoute() เพื่อรับข้อมูล route ปัจจุบัน
    const route = useRoute();

    return {
      route
    };
  },
  data: () => ({
    main_id:0,
    userData:{},
    setbtn:0,
    select_store:'',
    breadcrumbs:[],
    date_start:new Date(),
    date_end:new Date(),
    rowdata:[{
        product_name:'',
        qty:'',
        oos:false,
        stock:false,
        notsell:false,
        note:''
      },{
        product_name:'',
        qty:'',
        oos:false,
        stock:false,
        notsell:false,
        note:''
      },{
        product_name:'',
        qty:'',
        oos:false,
        stock:false,
        notsell:false,
        note:''
      }],
    show_p:false,
    items:[
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
    account_id:null,
    account_type_id:null,
    group_customer_id:null,
    group_name:null,
    datalist:[],
    accountlist:[],
    accounttypelist:[],
    groupcustomerlist:[],
    groupnamelist:[],
    productlist:[],
    Mapproductlist:[],
    Mapproductlist_hide:[],
    group_name_select:null,
    action:'add',
    color_active:0,
    ids2:0
  }),
  methods: {
    get_notsell(k){
        console.log(this.rowdata[k].notsell)
        this.rowdata[k].qty = 0;
    },
    addrow(){
      const vm = this;
        this.Mapproductlist.push({
          id:null,
          map_product_id:null,
          product_id:null,
          oos:false,
          stock:false,
          price:false,
          offtake:false,
          week:false,
          area:false,
          msl:false
        });
        console.log(this.Mapproductlist)
        vm.color_active++;
    },
    show_product(){
      console.log(this.select_store)
      if(this.select_store == null){
        this.select_store = '';
      }
      if(this.select_store == ''){
        this.show_p = false
      }else{
        this.show_p = true
      }
        
    },
    async getall(){
      try {
        const response = await apiService.get_all_MapProductStore();
        this.datalist = response.data.data;
        this.totalrecord = response.data.data.length;
        this.datalist.forEach((item, index) => {
          this.datalist[index].Active = item.isActive == 'Y' ? true : false;
          this.datalist[index].num = index + 1;
        });
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async get_all_account_filter(){
      try {
        const form = {
          group_customer_id: this.group_customer_id,
          user_id: this.userData.id,
          user_code: this.userData.code,
          position_name: this.userData.position_name,
        };
        const response = await apiService.get_all_account_filter_user(form);
        this.accountlist = response.data.data;
        this.get_product_by_groupcustomerid();
      } catch (error) {
        console.error('Error:', error);
      }
    },  
    async get_all_group_customer(){
      try {
        const form = {
          position_name: this.userData.position_name,
          group_customer_id: this.userData.group_customer_id
        };
        const response = await apiService.get_all_group_customer_user(form);
        this.groupcustomerlist = response.data.data;
      } catch (error) {
        console.error('Error:', error);
      }
    },  
    async get_all_group_name(){
      try {
        const form = {
          account_id: this.account_id,
          account_type_id: this.account_type_id,
          group_customer_id: this.group_customer_id,
        };
        const response = await apiService.get_all_group_name(form);
        
        this.groupnamelist = response.data.data;
        this.groupnamelist.forEach((item, index) => {
          this.groupnamelist[index].new_name = item.name+(item.branch_name?'('+item.branch_name+')':'');
        });
        this.groupnamelist.push({
          id: '0',
          new_name: '+Add',
        });
        console.log(this.groupnamelist);
        // เรียงข้อมูลโดยให้ id: '0' อยู่ด้านบนเสมอ
        this.groupnamelist.sort((a, b) => {
          if (a.id === '0') return -1;  // ให้ a.id === '0' อยู่ด้านบน
          if (b.id === '0') return 1;   // ให้ b.id === '0' อยู่ด้านล่าง
          return 0; // ไม่มีการเปลี่ยนแปลงในกรณีที่ทั้งคู่ไม่ใช่ '0'
        });
        if(response.data.data.length == 0){
          this.group_name_select = null
        }
        this.setbtn = 1;
      } catch (error) {
        console.error('Error:', error);
      }
    }, 
    async get_account_type_by_accountid_select(){
      try {
        this.account_type_id = null;
        this.accounttypelist = [];
        this.Mapproductlist = [];
        
        if(this.account_id){
          const form = {
            account_id: this.account_id,
            group_customer_id: this.group_customer_id,
            user_id: this.userData.id,
            user_code: this.userData.code,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_account_type_by_accountid(form);
          this.accounttypelist = response.data.data;
          this.get_all_MapProductStoreList_filter();
          
        }else{
          this.account_type_id = null;
          this.accounttypelist = [];
          this.Mapproductlist = [];
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async get_account_type_by_accountid(){
      try {
        if(this.account_id){
          const form = {
            account_id: this.account_id,
            group_customer_id: this.group_customer_id,
            user_id: this.userData.id,
            user_code: this.userData.code,
            position_name: this.userData.position_name,
          };
          const response = await apiService.get_account_type_by_accountid(form);
          this.accounttypelist = response.data.data;
          this.get_all_MapProductStoreList_filter();
          
        }else{
          this.account_type_id = null;
          this.accounttypelist = [];
          this.Mapproductlist = [];
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async get_product_by_groupcustomerid(){
      try {
        if(this.group_customer_id){
          const response = await apiService.get_product_by_groupcustomerid(this.group_customer_id);
          this.productlist = response.data.data.filter(x => x.isActive == 'Y');
          this.productlist.forEach((item, index) => {
            this.productlist[index].new_name = item.name+(item.flavor?'('+item.flavor+')':'');
          });
          // this.get_all_account_filter();
          // this.get_all_MapProductStoreList_filter();
        }else{
          this.productlist = [];
          this.Mapproductlist = [];
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async get_all_MapProductStoreList_filter(){
      const vm = this;
      
      try {
        if(vm.account_id && vm.account_type_id && vm.group_customer_id){
        //   const group = this.groupnamelist.find(item => item.id === vm.group_name_select);
        // vm.group_name = group.name;
          const form = {
            account_id: vm.account_id,
            account_type_id: vm.account_type_id,
            group_customer_id: vm.group_customer_id,
            name: vm.group_name,
            // branch_name: group.branch_name
          };
          const response2 = await apiService.get_all_group_name(form);
          if(response2.data.data.length == 0){
            this.group_name_select = null
            this.groupnamelist = [];
            this.groupnamelist.push({
              id: '0',
              new_name: '+Add',
            });
            console.log(this.groupnamelist);
          }else{
            this.groupnamelist = response2.data.data;
            this.groupnamelist.push({
              id: '0',
              name: '+Add',
            });
            
            // เรียงข้อมูลโดยให้ id: '0' อยู่ด้านบนเสมอ
            this.groupnamelist.sort((a, b) => {
              if (a.id === '0') return -1;  // ให้ a.id === '0' อยู่ด้านบน
              if (b.id === '0') return 1;   // ให้ b.id === '0' อยู่ด้านล่าง
              return 0; // ไม่มีการเปลี่ยนแปลงในกรณีที่ทั้งคู่ไม่ใช่ '0'
            });
            this.groupnamelist.forEach((item, index) => {
              this.groupnamelist[index].new_name = item.name+(item.branch_name?'('+item.branch_name+')':'');
            });
            console.log(this.groupnamelist);
            // alert(vm.main_id);
            if(vm.main_id > 0){
              // const group = vm.groupnamelist.find(item => item.id === data.id);
              // vm.group_name_select = group.id || null;
              // alert(vm.group_name_select);
            }
            // vm.group_name_select = vm.groupnamelist[1].id
            vm.set_groupname();
          }
        }else{
          vm.groupnamelist = [];
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async create_MapProductStore(){
      const vm = this;
      try {
        Swal.fire({
          title: "Uploading...",
          text: "Please wait a moment",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        // const group = this.groupnamelist.find(item => item.id === vm.group_name_select);
        // vm.group_name = group.name;
        const form = {
          account_id: vm.account_id,
          account_type_id: vm.account_type_id,
          group_customer_id: vm.group_customer_id,
          name:vm.group_name,
          group_name_select:vm.group_name_select,
          user_code:vm.userData.code,
          // branch_name: group.branch_name
        };
        
        const response = await apiService.create_MapProductStore(form);
        // console.log(response.data.data.id);
        const form2 = [];
        vm.Mapproductlist.forEach((item, index) => {
          form2.push({
            id:vm.group_name_select==0 ? null:item.id,
            map_product_id:response.data.data.id,
            product_id:item.product_id,
            oos:(item.oos==true?'Y':'N'),
            stock:(item.stock==true?'Y':'N'),
            price:(item.price==true?'Y':'N'),
            offtake:(item.offtake==true?'Y':'N'),
            week:(item.week==true?'Y':'N'),
            area:(item.area==true?'Y':'N'),
            msl:(item.msl==true?'Y':'N'),
            account_id: vm.account_id,
            account_type_id: vm.account_type_id,
            group_customer_id: vm.group_customer_id,
          });
        });
        // console.log(form2);
        
        const response2 = await apiService.createOrUpdate_MapProductStoreList(form2);
        if(response2){
          Swal.close()
          Swal.fire({
            title: 'บันทึกสำเร็จ!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              vm.$router.push('map-store-list');
            }
          });
        }
        
        if(vm.ids2 > 0){
          vm.get_all_MapProductStoreList_filter();
          setTimeout(() => {
            const group = vm.groupnamelist.find(item => item.name === vm.group_name);
            vm.group_name_select = null;
            vm.group_name = '';
            vm.color_active++;
            vm.Mapproductlist = [];
            vm.Mapproductlist_hide = [];
          }, 200);
        }else{
          vm.get_all_MapProductStoreList_filter();
        }
        
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async set_groupname(){
      const vm = this;
      if(vm.group_name_select == null){
        vm.group_name = '';
        vm.color_active++;
        vm.Mapproductlist = [];
        vm.Mapproductlist_hide = [];
      }else if(vm.group_name_select == 0){
        vm.group_name = '';
        vm.color_active++;
        vm.Mapproductlist = [];
        vm.Mapproductlist_hide = [];
      }else{
        const group = this.groupnamelist.find(item => item.id === vm.group_name_select);
        vm.group_name = group.name;
        vm.setbtn = 1;
        if(vm.color_active > 0){
          vm.color_active--;
        }
        const form = {
          account_id: vm.account_id,
          account_type_id: vm.account_type_id,
          group_customer_id: vm.group_customer_id,
          name: vm.group_name,
          branch_name: group.branch_name
        };
        const response = await apiService.get_all_MapProductStoreList_filter(form);
        var Mapproductlist = response.data.data;
        var Mapproductlist_old = response.data.data;
        
        Mapproductlist.forEach((item, index) => {
          console.log(item.oos);
            Mapproductlist[index].oos = (item.oos=='Y'?true:false)
            Mapproductlist[index].stock = (item.stock=='Y'?true:false)
            Mapproductlist[index].price = (item.price=='Y'?true:false)
            Mapproductlist[index].offtake = (item.offtake=='Y'?true:false)
            Mapproductlist[index].week = (item.week=='Y'?true:false)
            Mapproductlist[index].area = (item.area=='Y'?true:false)
            Mapproductlist[index].msl = (item.msl=='Y'?true:false)

            Mapproductlist[index].oos_old = item.oos
            Mapproductlist[index].stock_old = item.stock
            Mapproductlist[index].price_old = item.price
            Mapproductlist[index].offtake_old = item.offtake
            Mapproductlist[index].week_old = item.week
            Mapproductlist[index].area_old = item.area
            Mapproductlist[index].msl_old = item.msl
            
            vm.group_name = Mapproductlist[index]?.mapProductStore?.name || '';
            const group = vm.groupnamelist.find(item => item.name === vm.group_name);
            // vm.group_name_select = group.id || null;
        });
        vm.Mapproductlist = Mapproductlist;
        vm.Mapproductlist_hide = Mapproductlist_old;
        console.log(vm.Mapproductlist_hide);
      }
    },
    async set_groupname2(){
      const vm = this;
      // const group = this.groupnamelist.find(item => item.id === vm.group_name_select);
      //   vm.group_name = group.name;
      const group = this.groupnamelist.find(item => item.id === vm.group_name_select);
      const form = {
        account_id: vm.account_id,
        account_type_id: vm.account_type_id,
        group_customer_id: vm.group_customer_id,
        name: vm.group_name,
        branch_name: group.branch_name
      };
      const response = await apiService.get_all_MapProductStoreList_filter(form);
      var Mapproductlist = response.data.data;
      var Mapproductlist_old = response.data.data;
      
      Mapproductlist.forEach((item, index) => {
        console.log(item.oos);
          Mapproductlist[index].oos = (item.oos=='Y'?true:false)
          Mapproductlist[index].stock = (item.stock=='Y'?true:false)

          Mapproductlist[index].price = (item.price=='Y'?true:false)
          Mapproductlist[index].offtake = (item.offtake=='Y'?true:false)
          Mapproductlist[index].week = (item.week=='Y'?true:false)
          Mapproductlist[index].area = (item.area=='Y'?true:false)
          Mapproductlist[index].msl = (item.msl=='Y'?true:false)

          Mapproductlist[index].oos_old = item.oos
          Mapproductlist[index].stock_old = item.stock

          Mapproductlist[index].price_old = item.price
          Mapproductlist[index].offtake_old = item.offtake
          Mapproductlist[index].week_old = item.week
          Mapproductlist[index].area_old = item.area
          Mapproductlist[index].msl_old = item.msl
          
          vm.group_name = Mapproductlist[index]?.mapProductStore?.name || '';
          const group = vm.groupnamelist.find(item => item.name === vm.group_name);
          vm.group_name_select = group.id || null;

          if(vm.main_id > 0){
              // const group = vm.groupnamelist.find(item => item.id === data.id);
              // vm.group_name_select = group.id || null;
              // alert(vm.group_name_select);
            }
      });
      vm.Mapproductlist = Mapproductlist;
      vm.Mapproductlist_hide = Mapproductlist_old;
      console.log(vm.Mapproductlist_hide);
    },
    change_product(i){
      const vm = this;
      console.log(vm.Mapproductlist_hide);
      console.log(vm.Mapproductlist);
      console.log(i);
      vm.Mapproductlist_hide.forEach((item, index) => {
        
        if(index == i){
          console.log(item.id);
          if(item.id){
            console.log(item.product.id+'==='+vm.Mapproductlist[i].product_id);
            if(item.product.id != vm.Mapproductlist[i].product_id){
              vm.color_active++;
            }else{
              vm.color_active--;
            }
          }
        }
      });
    },
    change_checkboxt(i) {
      const vm = this;
      if (i < 0 || i >= vm.Mapproductlist_hide.length) return;
      if (vm.Mapproductlist_hide[i].oos_old != vm.Mapproductlist[i].oos) {
        vm.color_active++;
      }else{
        vm.color_active--;
      }
    },
    change_checkboxt1(i) {
      const vm = this;
      if (i < 0 || i >= vm.Mapproductlist_hide.length) return;
      if (vm.Mapproductlist_hide[i].stock_old != vm.Mapproductlist[i].stock) {
        vm.color_active++;
      }else{
        vm.color_active--;
      }
    },
    change_checkboxt2(i) {
      const vm = this;
      if (i < 0 || i >= vm.Mapproductlist_hide.length) return;
      if (vm.Mapproductlist_hide[i].price_old != vm.Mapproductlist[i].price) {
        vm.color_active++;
      }else{
        vm.color_active--;
      }
    },
    change_checkboxt3(i) {
      const vm = this;
      if (i < 0 || i >= vm.Mapproductlist_hide.length) return;
      if (vm.Mapproductlist_hide[i].offtake_old != vm.Mapproductlist[i].offtake) {
        vm.color_active++;
      }else{
        vm.color_active--;
      }
    },
    change_checkboxt4(i) {
      const vm = this;
      if (i < 0 || i >= vm.Mapproductlist_hide.length) return;
      if (vm.Mapproductlist_hide[i].week_old != vm.Mapproductlist[i].week) {
        vm.color_active++;
      }else{
        vm.color_active--;
      }
    },
    change_checkboxt5(i) {
      const vm = this;
      if (i < 0 || i >= vm.Mapproductlist_hide.length) return;
      if (vm.Mapproductlist_hide[i].area_old != vm.Mapproductlist[i].area) {
        vm.color_active++;
      }else{
        vm.color_active--;
      }
    },
    change_checkboxt6(i) {
      const vm = this;
      if (i < 0 || i >= vm.Mapproductlist_hide.length) return;
      if (vm.Mapproductlist_hide[i].msl_old != vm.Mapproductlist[i].msl) {
        vm.color_active++;
      }else{
        vm.color_active--;
      }
    },
    async get_all_MapProductStore_filter(id){
      const vm = this;
      try {
        const form = {
          id: id
        };
        const response = await apiService.get_all_MapProductStore_filter(form);
        var data = response.data.data;
        
        // vm.get_all_account_filter();
        vm.get_all_group_customer();
        vm.group_customer_id = data.group_customer_id;
        vm.get_all_account_filter();
        vm.account_id = data.account_id;
        vm.get_account_type_by_accountid();
        vm.account_type_id = data.account_type_id;
        vm.group_name = data.name;
        vm.main_id = data.id;
        vm.get_all_MapProductStoreList_filter();
        vm.get_product_by_groupcustomerid();
        vm.group_name_select = data.id;
        setTimeout(() => {
          console.log(vm.groupnamelist);
          
          
          
          
          vm.set_groupname2()
        }, 400);
        
        vm.action = 'edit';
      } catch (error) {
        console.error('Error:', error);
      }
    },  
    async confirmdelrow(id){
      const vm = this;
      Swal.fire({
        title: "ยืนยันการลบข้อมูล",
        // text: "ก่อนกดส่ง",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน"
      }).then((result) => {
        if (result.isConfirmed) {
          vm.delrow(id);
        }
      });
    },  
    async delrow(id){
      const vm = this;
      const form = {
        id: id
      };
      const response = await apiService.del_MapProductStore(form);
       Swal.fire({
            title: "ลบสำเร็จ!",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => Swal.showLoading(),
            willClose: () => window.location.reload()
        });
    },  
    
  },
  computed: {
    buttonColor() {
      console.log(this.color_active);
      return this.color_active <= 0 ? 'secondary' : 'primary';
    }
  },
  mounted(){

      this.$nextTick(function(){
        const userData = useCookie('userData')
        this.userData = userData.value;
        console.log(this.userData);
        if (this.route && this.route.query) {
          const ids = this.route.query.ids;
          if (ids) {
            this.ids2 = ids;
            this.get_all_MapProductStore_filter(ids);
            
          }else{
            console.log('No ids parameter provided in the URL.');
            // this.get_all_account_filter();
            this.get_all_group_customer();
            // this.getall();
            this.action = 'add';
          }
        } else {
          console.log('Route or query parameters are not available.');
          // this.get_all_account_filter();
          this.get_all_group_customer();
          // this.getall();
          this.action = 'add';
        }
      });

      
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
  }
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
.v-checkbox.v-selection-control .v-label, .v-checkbox-btn.v-selection-control .v-label {
    font-size: 14px;
}
</style>
