import axios from 'axios'

// สร้าง instance ของ axios พร้อม config กลาง
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL หลักของ API
  timeout: 600000, // กำหนด timeout เป็น 600,000 ms = 10 นาที สำหรับทุก request
})

export default {
  // ตัวอย่างการเรียก API
  login(data) {
    return apiClient.post('/api/backend/auth/login/', data)
  },
  get_all_user(data) {
    return apiClient.post('/api/backend/get_all_user', data)
  },
  get_all_user_filter(data) {
    return apiClient.post('/api/backend/get_all_user_filter', data)
  },
  get_all_store(data) {
    return apiClient.post('/api/backend/get_all_store', data)
  },
  get_all_store_user(data) {
    return apiClient.post('/api/backend/get_all_store_user', data)
  },
  get_all_store_user2(data) {
    return apiClient.post('/api/backend/get_all_store_user2', data)
  },
  get_group_name(data) {
    return apiClient.post('/api/backend/get_group_name', data)
  },
  get_group_name2(data) {
    return apiClient.post('/api/backend/get_group_name2', data)
  },
  get_all_account(data) {
    return apiClient.post('/api/backend/get_all_account', data)
  },
  get_all_account_filter(data) {
    return apiClient.post('/api/backend/get_all_account_filter', data)
  },
  get_all_account_filter_user(data) {
    return apiClient.post('/api/backend/get_all_account_filter_user', data)
  },
  get_all_product(data) {
    return apiClient.post('/api/backend/get_all_product', data)
  },
  get_all_group_customer(data) {
    return apiClient.post('/api/backend/get_all_group_customer', data)
  },
  get_all_group_customer_user(data) {
    return apiClient.post('/api/backend/get_all_group_customer_user', data)
  },
  get_all_group_name(data) {
    return apiClient.post('/api/backend/get_all_group_name', data)
  },
  get_all_PlacementPoint(data) {
    return apiClient.post('/api/backend/get_all_PlacementPoint', data)
  },
  get_all_MapUserStore(data) {
    return apiClient.post('/api/backend/get_all_MapUserStore', data)
  },
  get_all_MapProductStore_filter(data) {
    return apiClient.post('/api/backend/get_all_MapProductStore_filter', data)
  },
  get_store_for_report(data) {
    return apiClient.post('/api/backend/get_store_for_report', data)
  },
  get_all_MapUserArea(data) {
    return apiClient.post('/api/backend/get_all_MapUserArea', data)
  },
  get_all_MapProductStore(data) {
    return apiClient.post('/api/backend/get_all_MapProductStore', data)
  },
  get_all_MapProductStoreList(data) {
    return apiClient.get('/api/backend/get_all_MapProductStoreList', data)
  },
  get_all_Oos(data) {
    return apiClient.post('/api/backend/get_all_Oos', data)
  },
  get_all_Oos_first (data) {
    return apiClient.post('/api/backend/get_all_Oos_first ', data)
  },
  get_all_Offtake_first (data) {
    return apiClient.post('/api/backend/get_all_Offtake_first ', data)
  },
  get_all_PricePromotion_first (data) {
    return apiClient.post('/api/backend/get_all_PricePromotion_first ', data)
  },
  get_all_week_first (data) {
    return apiClient.post('/api/backend/get_all_week_first ', data)
  },
  delete_image_price (data) {
    return apiClient.post('/api/backend/delete_image_price ', data)
  },
  get_all_provinces (data) {
    return apiClient.get('/api/backend/get_all_provinces ', data)
  },
  get_all_PricePromotion(data) {
    return apiClient.post('/api/backend/get_all_PricePromotion', data)
  },
  create_new_PricePromotion(data) {
    return apiClient.post('/api/backend/create_new_PricePromotion', data)
  },
  create_new_PricePromotion2(data) {
    return apiClient.post('/api/backend/create_new_PricePromotion2', data)
  },
  get_all_area_manager(data) {
    return apiClient.post('/api/backend/get_all_area_manager', data)
  },
  get_all_area_manager_list(data) {
    return apiClient.post('/api/backend/get_all_area_manager_list', data)
  },
  get_all_area_supervisor(data) {
    return apiClient.post('/api/backend/get_all_area_supervisor', data)
  },
  get_all_area_supervisor_list(data) {
    return apiClient.post('/api/backend/get_all_area_supervisor_list', data)
  },
  get_account_type_by_accountid(data) {
    return apiClient.post(`/api/backend/get_account_type_by_accountid`, data)
  },
  get_all_account_type(data) {
    return apiClient.post(`/api/backend/get_all_account_type`, data)
  },
  get_all_channel(data) {
    return apiClient.post(`/api/backend/get_all_channel`, data)
  },
  get_all_category(data) {
    return apiClient.post(`/api/backend/get_all_category`, data)
  },
  get_all_sub_category(data) {
    return apiClient.post(`/api/backend/get_all_sub_category`, data)
  },
  get_all_store_to_account(data) {
    return apiClient.post('/api/backend/get_all_store_to_account', data)
  },
  get_all_promotion(data) {
    return apiClient.post('/api/backend/get_all_promotion', data)
  },
  get_product_by_groupcustomerid(id, data) {
    return apiClient.get(`/api/backend/get_product_by_groupcustomerid/${id}`, data)
  },
  create_product(data) {
    return apiClient.post('/api/backend/create_product', data)
  },
  create_rental_area_unit(data) {
    return apiClient.post('/api/backend/create_rental_area_unit', data)
  },
  import_excel(data) {
    return apiClient.post('/api/backend/import_excel', data)
  },
  import_store(data) {
    return apiClient.post('/api/backend/import_store', data)
  },
  import_storeaccount(data) {
    return apiClient.post('/api/backend/import_storeaccount', data)
  },
  import_productTostore(data) {
    return apiClient.post('/api/backend/import_productTostore', data)
  },
  import_productTocompliance(data) {
    return apiClient.post('/api/backend/import_productTocompliance', data)
  },
  import_user_store(data) {
    return apiClient.post('/api/backend/import_user_store', data)
  },
  import_PlacementPoint(data) {
    return apiClient.post('/api/backend/import_PlacementPoint', data)
  },
  import_MapUserStore(data) {
    return apiClient.post('/api/backend/import_MapUserStore', data)
  },
  import_userstore(data) {
    return apiClient.post('/api/backend/import_userstore', data)
  },
  import_user(data) {
    return apiClient.post('/api/backend/import_user', data)
  },
  import_MapUserArea(data) {
    return apiClient.post('/api/backend/import_MapUserArea', data)
  },
  import_RentalAreaUnit(data) {
    return apiClient.post('/api/backend/import_RentalAreaUnit', data)
  },
  import_reasonfornotgettingspace(data) {
    return apiClient.post('/api/backend/import_reasonfornotgettingspace', data)
  },
  import_reasonfornotgettingspace(data) {
    return apiClient.post('/api/backend/import_reasonfornotgettingspace', data)
  },
  import_promotion(data) {
    return apiClient.post('/api/backend/import_promotion', data)
  },
  get_all_MapProductStoreList_filter(data) {
    return apiClient.post('/api/backend/get_all_MapProductStoreList_filter', data)
  },
  get_all_rental_area_unit(data) {
    return apiClient.post('/api/backend/get_all_rental_area_unit', data)
  },
  get_all_rental_area_unit_n(data){
    return apiClient.post('/api/backend/get_all_rental_area_unit_n', data)
  },
  get_all_rental_area_unit_groupname(data) {
    return apiClient.post('/api/backend/get_all_rental_area_unit_groupname', data)
  },
  get_unit(data) {
    return apiClient.post('/api/backend/get_unit', data)
  },
  get_unit2(data) {
    return apiClient.post('/api/backend/get_unit2', data)
  },
  update_rental_area_unit(id, data) {
    return apiClient.put(`/api/backend/update_rental_area_unit/${id}`, data)
  },
  update_product(data) {
    return apiClient.post(`/api/backend/update_product`, data)
  },
  update_rental_area_unit_isActive(id, data) {
    return apiClient.put(`/api/backend/update_rental_area_unit_isActive/${id}`, data)
  },
  update_product_isActive(id, data) {
    return apiClient.put(`/api/backend/update_product_isActive/${id}`, data)
  },
  update_MapUserStore_isActive(id, data) {
    return apiClient.put(`/api/backend/update_MapUserStore_isActive/${id}`, data)
  },
  update_MapUserArea_isActive(id, data) {
    return apiClient.put(`/api/backend/update_MapUserArea_isActive/${id}`, data)
  },
  update_MapUserStore(id, data) {
    return apiClient.put(`/api/backend/update_MapUserStore/${id}`, data)
  },
  update_MapUserArea(id, data) {
    return apiClient.put(`/api/backend/update_MapUserArea/${id}`, data)
  },


  delete_MapProductStore(id, data) {
    return apiClient.put(`/api/backend/delete_MapProductStore/${id}`, data)
  },
  create_MapProductStore(data) {
    return apiClient.post('/api/backend/create_MapProductStore', data)
  },
  createOrUpdate_MapProductStoreList(data) {
    return apiClient.post('/api/backend/createOrUpdate_MapProductStoreList', data)
  },
  createOrUpdate_OosList(data) {
    return apiClient.post('/api/backend/createOrUpdate_OosList', data)
  },
  createOrUpdate_PricePromotionList(data) {
    return apiClient.post('/api/backend/createOrUpdate_PricePromotionList', data)
  },
  create_MapUserStore(data) {
    return apiClient.post('/api/backend/create_MapUserStore', data)
  },
  create_MapUserArea(data) {
    return apiClient.post('/api/backend/create_MapUserArea', data)
  },
  get_price_check_day(data) {
    return apiClient.post('/api/backend/get_price_check_day', data)
  },
  save_picture (data) {
    return apiClient.post('/api/backend/save_picture', data)
  },
  get_all_Oos_date (data) {
    return apiClient.post('/api/backend/get_all_Oos_date', data)
  },
  create_oos2 (data) {
    return apiClient.post('/api/backend/create_oos2', data)
  },
  get_all_week(data) {
    return apiClient.post('/api/backend/get_all_week', data)
  },
  create_week2(data) {
    return apiClient.post('/api/backend/create_week2', data)
  },
  get_all_week_date (data) {
    return apiClient.post('/api/backend/get_all_week_date', data)
  },
  createOrUpdate_weekList(data) {
    return apiClient.post('/api/backend/createOrUpdate_weekList', data)
  },
  get_all_PricePromotion_date(data) {
    return apiClient.post('/api/backend/get_all_PricePromotion_date', data)
  },
  create_PricePromotion2(data) {
    return apiClient.post('/api/backend/create_PricePromotion2', data)
  },
  get_all_reason(data) {
    return apiClient.post('/api/backend/get_all_reason', data)
  },
  get_all_reason_filter(data) {
    return apiClient.post('/api/backend/get_all_reason_filter', data)
  },
  get_all_Competitor_filter(data) {
    return apiClient.post('/api/backend/get_all_Competitor_filter', data)
  },
  get_all_posm_filter(data) {
    return apiClient.post('/api/backend/get_all_posm_filter', data)
  },
  get_all_product_filter(data) {
    return apiClient.post('/api/backend/get_all_product_filter', data)
  },

  // get_all_group_customer(data) {
  //   return apiClient.get('/api/backend/get_all_group_customer',data);
  // },
  update_reason_isActive(id, data) {
    return apiClient.put(`/api/backend/update_reason_isActive/${id}`, data)
  },
  update_reason(id, data) {
    return apiClient.put(`/api/backend/update_reason/${id}`, data)
  },
  create_reason(data) {
    return apiClient.post('/api/backend/create_reason', data)
  },
  get_all_Noteoosstock(data) {
    return apiClient.post('/api/backend/get_all_Noteoosstock', data)
  },
  update_Noteoosstock_isActive(id, data) {
    return apiClient.put(`/api/backend/update_Noteoosstock_isActive/${id}`, data)
  },
  update_Noteoosstock(id, data) {
    return apiClient.put(`/api/backend/update_Noteoosstock/${id}`, data)
  },
  create_Noteoosstock(data) {
    return apiClient.post('/api/backend/create_Noteoosstock', data)
  },
  import_Noteoosstock(data) {
    return apiClient.post('/api/backend/import_Noteoosstock', data)
  },
  get_all_Competitor(data) {
    return apiClient.post('/api/backend/get_all_Competitor', data)
  },
  update_Competitor_isActive(id, data) {
    return apiClient.put(`/api/backend/update_Competitor_isActive/${id}`, data)
  },
  update_Competitor(id, data) {
    return apiClient.put(`/api/backend/update_Competitor/${id}`, data)
  },
  create_Competitor(data) {
    return apiClient.post(`/api/backend/create_Competitor`, data)
  },
  import_Competitor(data) {
    return apiClient.post(`/api/backend/import_Competitor`, data)
  },
  get_all_posm(data) {
    return apiClient.post('/api/backend/get_all_posm', data)
  },
  update_posm_isActive(id, data) {
    return apiClient.put(`/api/backend/update_posm_isActive/${id}`, data)
  },
  update_posm(id, data) {
    return apiClient.put(`/api/backend/update_posm/${id}`, data)
  },
  create_posm(data) {
    return apiClient.post(`/api/backend/create_posm`, data)
  },
  import_posm(data) {
    return apiClient.post(`/api/backend/import_posm`, data)
  },

  get_all_Noteoosstock_filter(data) {
    return apiClient.post(`/api/backend/get_all_Noteoosstock_filter`, data)
  },

  get_all_position(data) {
    return apiClient.post(`/api/backend/get_all_position`, data)
  },
  update_position_isActive(id, data) {
    return apiClient.put(`/api/backend/update_position_isActive/${id}`, data)
  },
  update_position(id, data) {
    return apiClient.put(`/api/backend/update_position/${id}`, data)
  },
  create_position(data) {
    return apiClient.post(`/api/backend/create_position`, data)
  },
  import_position(data) {
    return apiClient.post(`/api/backend/import_position`, data)
  },

  get_all_Offtake(data) {
    return apiClient.post(`/api/backend/get_all_Offtake`, data)
  },
  create_Offtake2(data) {
    return apiClient.post(`/api/backend/create_Offtake2`, data)
  },
  createOrUpdate_OfftakeList(data) {
    return apiClient.post(`/api/backend/createOrUpdate_OfftakeList`, data)
  },
  get_all_Offtake_date(data) {
    return apiClient.post(`/api/backend/get_all_Offtake_date`, data)
  },

  get_all_Compliance(data) {
    return apiClient.post(`/api/backend/get_all_Compliance`, data)
  },
  create_Compliance(data) {
    return apiClient.post(`/api/backend/create_Compliance`, data)
  },
  create_Compliance2(data) {
    return apiClient.post(`/api/backend/create_Compliance2`, data)
  },
  createOrUpdate_ComplianceList(data) {
    return apiClient.post(`/api/backend/createOrUpdate_ComplianceList`, data)
  },
  get_all_Compliance_date(data) {
    return apiClient.post(`/api/backend/get_all_Compliance_date`, data)
  },
  get_all_Compliance_date2(data) {
    return apiClient.post(`/api/backend/get_all_Compliance_date2`, data)
  },
  readdata_Compliance(data) {
    return apiClient.post(`/api/backend/readdata_Compliance`, data)
  },
  create_MapStoreCompliance(data) {
    return apiClient.post('/api/backend/create_MapStoreCompliance', data)
  },
  MapStoreCompliancedata(data) {
    return apiClient.post('/api/backend/MapStoreCompliance/data-table', data)
  },
  get_all_MapStoreCompliance(data) {
    return apiClient.post('/api/backend/get_all_MapStoreCompliance', data)
  },
  get_MapStoreCompliance(id, data) {
    return apiClient.get(`/api/backend/get_MapStoreCompliance/${id}`, data)
  },
  update_MapStoreCompliance(id, data) {
    return apiClient.put(`/api/backend/update_MapStoreCompliance/${id}`, data)
  },
  update_MapStoreCompliance_isActive(id, data) {
    return apiClient.put(`/api/backend/update_MapStoreCompliance_isActive/${id}`, data)
  },
  delete_MapStoreCompliance(id, data) {
    return apiClient.put(`/api/backend/delete_MapStoreCompliance/${id}`, data)
  },
  get_all_MapStoreCompliance_filter(data) {
    return apiClient.post('/api/backend/get_all_MapStoreCompliance_filter', data)
  },
  get_all_group_name_compliance(data) {
    return apiClient.post('/api/backend/get_all_group_name_compliance', data)
  },
  create_MapStoreComplianceList(data) {
    return apiClient.post('/api/backend/create_MapStoreComplianceList', data)
  },
  createOrUpdate_MapStoreComplianceList(data) {
    return apiClient.post('/api/backend/createOrUpdate_MapStoreComplianceList', data)
  },
  MapStoreComplianceListdata(data) {
    return apiClient.post('/api/backend/MapStoreComplianceList/data-table', data)
  },
  get_all_MapStoreComplianceList(data) {
    return apiClient.get('/api/backend/get_all_MapStoreComplianceList', data)
  },
  get_all_MapStoreComplianceList_filter(data) {
    return apiClient.post('/api/backend/get_all_MapStoreComplianceList_filter', data)
  },
  get_MapStoreComplianceList(id, data) {
    return apiClient.get(`/api/backend/get_MapStoreComplianceList/${id}`, data)
  },
  update_MapStoreComplianceList(id, data) {
    return apiClient.put(`/api/backend/update_MapStoreComplianceList/${id}`, data)
  },
  update_MapStoreComplianceList_isActive(id, data) {
    return apiClient.put(`/api/backend/update_MapStoreComplianceList_isActive/${id}`, data)
  },
  get_all_produuct_store_compliance(data) {
    return apiClient.post('/api/backend/get_all_produuct_store_compliance', data)
  },
  del_MapProductStore(data) {
    return apiClient.post('/api/backend/del_MapProductStore', data)
  },
  complianceDetailsdeleteImage(data) {
    return apiClient.post('/api/backend/complianceDetailsdeleteImage', data)
  },
  get_all_product_filter2(data) {
    return apiClient.post('/api/backend/get_all_product_filter2', data)
  },
  get_all_Compliance2(data) {
    return apiClient.post('/api/backend/get_all_Compliance2', data)
  },
  updateOnlyComplianceList(data) {
    return apiClient.post('/api/backend/updateOnlyComplianceList', data)
  },
  createOrUpdate_ComplianceListExtra(data) {
    return apiClient.post('/api/backend/createOrUpdate_ComplianceListExtra', data)
  },
  get_all_filters(data) {
    return apiClient.post('/api/backend/get_all_filters', data)
  },
  get_all_filters_Store(data) {
    return apiClient.post('/api/backend/get_all_filters_Store', data)
  },
  get_all_filters_subBrands(data) {
    return apiClient.post('/api/backend/get_all_filters_subBrands', data)
  },
  get_all_filters_products(data) {
    return apiClient.post('/api/backend/get_all_filters_products', data)
  },
  get_all_filters_Brands(data) {
    return apiClient.post('/api/backend/get_all_filters_Brands', data)
  },
  get_all_filters_areaManagers(data) {
    return apiClient.post('/api/backend/get_all_filters_areaManagers', data)
  },
  get_all_filters_areaSupervisors(data) {
    return apiClient.post('/api/backend/get_all_filters_areaSupervisors', data)
  },
  get_all_filters_users(data) {
    return apiClient.post('/api/backend/get_all_filters_users', data)
  },
  get_all_filters_account(data) {
    return apiClient.post('/api/backend/get_all_filters_account', data)
  },
  get_all_filters_provinces(data) {
    return apiClient.post('/api/backend/get_all_filters_provinces', data)
  },
  dashboard_oos(data) {
    return apiClient.post('/api/backend/dashboard_oos', data)
  },
  dashboard_oos_test(data) {
    return apiClient.post('/api/backend/dashboard_oos_test', data)
  },
  dashboard_stock_test(data) {
    return apiClient.post('/api/backend/dashboard_stock_test', data)
  },
  dashboard_stock_table(data) {
    return apiClient.post('/api/backend/dashboard_stock_table', data)
  },
  dashboard_offtake(data) {
    return apiClient.post('/api/backend/dashboard_offtake', data)
  },
  dashboard_offtake_table(data) {
    return apiClient.post('/api/backend/dashboard_offtake_table', data)
  },
  dashboard_premium_test(data) {
    return apiClient.post('/api/backend/dashboard_premium_test', data)
  },







  

  changepassword(data) {
    return apiClient.post('/api/backend/changepassword', data)
  },
  get_all_user_one(data) {
    return apiClient.post('/api/backend/get_all_user_one', data)
  },
  edituser(data) {
    return apiClient.post('/api/backend/edituser', data)
  },
  delete_picture(data) {
    return apiClient.post('/api/backend/delete_picture', data)
  },
  master_product(data) {
    return apiClient.post('/api/backend/master_product', data)
  },
  master_subbrand(data) {
    return apiClient.post('/api/backend/master_subbrand', data)
  },
  master_subcategories(data) {
    return apiClient.post('/api/backend/master_subcategories', data)
  },
  master_brand(data) {
    return apiClient.post('/api/backend/master_brand', data)
  },
  get_all_brand(data) {
    return apiClient.post('/api/backend/get_all_brand', data)
  },
  get_all_sub_brand(data) {
    return apiClient.post('/api/backend/get_all_sub_brand', data)
  },
  master_store(data) {
    return apiClient.post('/api/backend/master_store', data)
  },
  get_all_filters_premium(data) {
    return apiClient.post('/api/backend/get_all_filters_premium', data)
  },
  get_all_filters_products_premium(data) {
    return apiClient.post('/api/backend/get_all_filters_products_premium', data)
  },

  // createPlacementPoint(data) {
  //   return apiClient.post('/api/backend/createPlacementPoint', data);
  // },
  // updatePlacementPoint(id, data) {
  //   return apiClient.put(`/api/backend/updatePlacementPoint/${id}`, data);
  // },

  create_store(data) {
    return apiClient.post('/api/backend/create_store', data)
  },

  update_store(id, data) {
    return apiClient.put(`/api/backend/update_store/${id}`, data)
  },

  get_all_job_position(data) {
    return apiClient.post('/api/backend/get_all_job_position', data)
  },

  create_account(data) {
    return apiClient.post('/api/backend/create_account', data)
  },

  update_account(id, data) {
    return apiClient.put(`/api/backend/update_account/${id}`, data)
  },
  update_account_type(id, data) {
    return apiClient.put(`/api/backend/update_account_type/${id}`, data)
  },
  create_account_type(data) {
    return apiClient.post(`/api/backend/create_account_type`, data)
  },
  update_area_manager(id, data) {
    return apiClient.put(`/api/backend/update_area_manager/${id}`, data)
  },
  create_area_manager(data) {
    return apiClient.post(`/api/backend/create_area_manager`, data)
  },
  update_area_manager_isActive(id, data) {
    return apiClient.put(`/api/backend/update_area_manager/${id}`, data)
  },
  update_account_isActive(id, data) {
    return apiClient.put(`/api/backend/update_account_isActive/${id}`, data)
  },
  update_account_type_isActive(id, data) {
    return apiClient.put(`/api/backend/update_account_type_isActive/${id}`, data)
  },
  update_area_supervisor_isActive(id, data) {
    return apiClient.put(`/api/backend/update_area_supervisor_isActive/${id}`, data)
  },
  update_area_supervisor(id, data) {
    return apiClient.put(`/api/backend/update_area_supervisor/${id}`, data)
  },
  create_area_supervisor(data) {
    return apiClient.post(`/api/backend/create_area_supervisor`, data)
  },

  update_brand_isActive(id, data) {
    return apiClient.put(`/api/backend/update_brand_isActive/${id}`, data)
  },
  create_brand(data) {
    return apiClient.post(`/api/backend/create_brand`, data)
  },
  update_brand(id, data) {
    return apiClient.put(`/api/backend/update_brand/${id}`, data)
  },
  update_sub_brand_isActive(id, data) {
    return apiClient.put(`/api/backend/update_sub_brand_isActive/${id}`, data)
  },
  create_sub_brand(data) {
    return apiClient.post(`/api/backend/create_sub_brand`, data)
  },
  update_sub_brand(id, data) {
    return apiClient.put(`/api/backend/update_sub_brand/${id}`, data)
  },
  update_channel_isActive(id, data) {
    return apiClient.put(`/api/backend/update_channel_isActive/${id}`, data)
  },
  create_channel(data) {
    return apiClient.post(`/api/backend/create_channel`, data)
  },
  update_channel(id, data) {
    return apiClient.put(`/api/backend/update_channel/${id}`, data)
  },
  update_group_customer_isActive(id, data) {
    return apiClient.put(`/api/backend/update_group_customer_isActive/${id}`, data)
  },
  update_group_customer(id, data) {
    return apiClient.put(`/api/backend/update_group_customer/${id}`, data)
  },
  create_group_customer(data) {
    return apiClient.post(`/api/backend/create_group_customer`, data)
  },
  update_job_position_isActive(id, data) {
    return apiClient.put(`/api/backend/update_job_position_isActive/${id}`, data)
  },
  update_job_position(id, data) {
    return apiClient.put(`/api/backend/update_job_position/${id}`, data)
  },
  create_job_position(data) {
    return apiClient.post(`/api/backend/create_job_position`, data)
  },
  update_promotion_isActive(id, data) {
    return apiClient.put(`/api/backend/update_promotion_isActive/${id}`, data)
  },
  update_promotion(id, data) {
    return apiClient.put(`/api/backend/update_promotion/${id}`, data)
  },
  create_promotion(data) {
    return apiClient.post(`/api/backend/create_promotion`, data)
  },
  update_posm_isActive(id, data) {
    return apiClient.put(`/api/backend/update_posm_isActive/${id}`, data)
  },
  update_category_isActive(id, data) {
    return apiClient.put(`/api/backend/update_category_isActive/${id}`, data)
  },
  update_category(id, data) {
    return apiClient.put(`/api/backend/update_category/${id}`, data)
  },
  create_category(data) {
    return apiClient.post(`/api/backend/create_category`, data)
  },
  update_subcategory_isActive(id, data) {
    return apiClient.put(`/api/backend/update_subcategory_isActive/${id}`, data)
  },
  update_sub_category(id, data) {
    return apiClient.put(`/api/backend/update_sub_category/${id}`, data)
  },
  create_sub_category(data) {
    return apiClient.post(`/api/backend/create_sub_category`, data)
  },
  update_provinces_isActive(id, data) {
    return apiClient.put(`/api/backend/update_provinces_isActive/${id}`, data)
  },
  create_provinces(data) {
    return apiClient.post(`/api/backend/create_provinces`, data)
  },
  update_provinces(id, data) {
    return apiClient.put(`/api/backend/update_provinces/${id}`, data)
  },
  update_PlacementPoint_isActive(id, data) {
    return apiClient.put(`/api/backend/update_PlacementPoint_isActive/${id}`, data)
  },
  create_PlacementPoint(data) {
    return apiClient.post(`/api/backend/create_PlacementPoint`, data)
  },
  update_PlacementPoint(id, data) {
    return apiClient.put(`/api/backend/update_PlacementPoint/${id}`, data)
  },
  update_store_isActive(id, data) {
    return apiClient.put(`/api/backend/update_store_isActive/${id}`, data)
  },
  create_users(data) {
    return apiClient.post(`/api/backend/create_user`, data)
  },
  update_user(data) {
    return apiClient.post(`/api/backend/update_user`, data)
  },
  dashboard_compliance(data) {
    return apiClient.post(`/api/backend/dashboard_compliance`, data)
  },
  get_all_filters_map(data) {
    return apiClient.post(`/api/backend/get_all_filters_map`, data)
  },
  dashboard_extra(data) {
    return apiClient.post(`/api/backend/dashboard_extra`, data)
  },
  createOrUpdate_ComplianceListExtraImage(data) {
    return apiClient.post(`/api/backend/createOrUpdate_ComplianceListExtraImage`, data)
  },
  complianceDetailsdeleteImageExtra(data) {
    return apiClient.post(`/api/backend/complianceDetailsdeleteImageExtra`, data)
  },
  update_user_isActive(id, data) {
    return apiClient.put(`/api/backend/update_user_isActive/${id}`, data)
  }, update_store_to_account_isActive(id, data) {
    return apiClient.put(`/api/backend/update_store_to_account_isActive/${id}`, data)
  },
  create_store_to_account(data) {
    return apiClient.post(`/api/backend/create_store_to_account`, data)
  },
  update_store_to_account(id, data) {
    return apiClient.put(`/api/backend/update_store_to_account/${id}`, data)
  },
  filter_all_area_manager(data) {
    return apiClient.post(`/api/backend/filter_all_area_manager`, data)
  },
  filter_all_area_supervisor(data) {
    return apiClient.post(`/api/backend/filter_all_area_supervisor`, data)
  },
  filter_all_position(data) {
    return apiClient.post(`/api/backend/filter_all_position`, data)
  },
  filter_all_job_position(data) {
    return apiClient.post(`/api/backend/filter_all_job_position`, data)
  },
  send_forgot_email(data) {
    return apiClient.post(`/api/backend/send_forgot_email`, data)
  },
  createOrUpdate_PricePromotionList_dup(data) {
    return apiClient.post(`/api/backend/createOrUpdate_PricePromotionList_dup`, data)
  },
  createOrUpdate_WeekList_dup(data) {
    return apiClient.post(`/api/backend/createOrUpdate_WeekList_dup`, data)
  },
  get_user_for_admin(data) {
    return apiClient.post(`/api/backend/get_user_for_admin`, data)
  },
  delete_ComplianceList(data) {
    return apiClient.post(`/api/backend/delete_ComplianceList`, data)
  },
  delete_ComplianceListExtra(data) {
    return apiClient.post(`/api/backend/delete_ComplianceListExtra`, data)
  },
  areaManagers(data) {
    return apiClient.post(`/api/backend/areaManagers`, data)
  },
  areaSupervisor(data) {
    return apiClient.post(`/api/backend/areaSupervisor`, data)
  },
  getBrands(data) {
    return apiClient.post(`/api/backend/getBrands`, data)
  },
  getBrandsOfftake(data) {
    return apiClient.post(`/api/backend/getBrandsOfftake`, data)
  },
  getTableProduct(data) {
    return apiClient.post(`/api/backend/getTableProduct`, data)
  },
  get_all_filters_channel(data) {
    return apiClient.post(`/api/backend/get_all_filters_channel`, data)
  },
  getTableProductOfftake(data) {
    return apiClient.post(`/api/backend/getTableProductOfftake`, data)
  },
  delete_MapComplianceList(data) {
    return apiClient.post(`/api/backend/delete_MapComplianceList`, data)
  },
  deleteUserPicture(data) {
    return apiClient.post('/api/backend/delete_picture', data)
  },
  renew_product_oos(data) {
    return apiClient.post('/api/backend/renew_product_oos', data)
  },
  renew_product_offtake(data) {
    return apiClient.post('/api/backend/renew_product_offtake', data)
  },
  renew_product_price(data) {
    return apiClient.post('/api/backend/renew_product_price', data)
  },
  renew_product_week(data) {
    return apiClient.post('/api/backend/renew_product_week', data)
  },

  save_all_ComplianceListExtra(formData) {
    return apiClient.post('/api/backend/save_all_ComplianceListExtra', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  get_account_by_user_position(data) {
    return apiClient.post('/api/backend/get_account_by_user_position', data)
  },
}
