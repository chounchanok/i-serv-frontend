export default [
  { heading: 'Apps & Pages' },
  {
    title: 'To-Do List',
    icon: { icon: 'tabler-list-check' },
    children: [
      {
        title: 'แดชบอร์ดพนักงาน',
        to: 'todo-employee-dashboard', // **จุดสำคัญ:** ตรงนี้ต้องใส่ชื่อ Route ที่ระบบสร้างให้ (อ่านคำอธิบายด้านล่าง)
      },
    ],
  },
  {
    title: 'Dashboards',
    icon: { icon: 'tabler-file' },
    children: [
      {
        title: 'OOS',
        to: 'apps-dashboardoos-list',
      },
      {
        title: 'Stock',
        to: 'apps-dashboardstock-list',
      },
      {
        title: 'Offtake',
        to: 'apps-dashboardofftake-list',
      },
      {
        title: 'Premium & Coupon',
        to: 'apps-dashboardpremium-list',
      },
      {
        title: 'Compliance Display',
        to: 'apps-dashboardcompliance-list',
      },
      {
        title: 'Extra Display',
        to: 'apps-dashboardextra-list',
      },
    ],
  },

  // {
  //   title: 'Dashboards',
  //   icon: { icon: 'tabler-file' },
  //   to: 'dashboards',
  // },
  {
    title: 'Users',
    icon: { icon: 'tabler-smart-home' },
    to: 'apps-user-list',
  },

  // {
  //   title: 'Users',
  //   icon: { icon: 'tabler-smart-home' },
  //   children: [
  //     {
  //       title: 'Users',
  //       to: 'apps-user-list',
  //     },
  //     // {
  //     //   title: 'Roles',
  //     //   to: 'apps-roles',
  //     // },
  //     // {
  //     //   title: 'Permissions',
  //     //   to: 'apps-permissions',
  //     // },
  //   ]
  // },
  // {
  //   title: 'Customer',
  //   icon: { icon: 'tabler-file' },
  //   to: 'apps-ecommerce-customer-list',
  // },
  // {
  //   title: 'Store',
  //   icon: { icon: 'tabler-smart-home' },
  //   to: 'apps-store-list',
  // },
  // {
  //   title: 'Product',
  //   icon: { icon: 'tabler-smart-home' },
  //   to: 'pages-product',
  // },
  // {
  //   title: 'Product',
  //   icon: { icon: 'tabler-smart-home' },
  //   children: [
  //     {
  //       title: 'Product',
  //       to: 'pages-product',
  //     },
  //     // {
  //     //   title: 'Stock',
  //     //   to: 'pages-stock',
  //     // }
  //   ]
  // },
  // {
  //   title: 'Map',
  //   icon: { icon: 'tabler-smart-home' },
  //   children: [
  //     {
  //       title: 'User to Store',
  //       to: 'apps-userstore-list',
  //     },
  //     {
  //       title: 'User to Area',
  //       to: 'apps-userarea-list',
  //     },
  //     {
  //       title: 'Store to Account',
  //       to: 'pages-store-to-account',
  //     },
  //     {
  //       title: 'Product to Store',
  //       to: 'pages-map-store',
  //     },
  //     {
  //       title: 'Product to Store List',
  //       to: 'pages-map-store-list',
  //     },
  //     {
  //       title: 'Store to Compliance',
  //       to: 'pages-map-storecompliance',
  //     },
  //     {
  //       title: 'Store to Compliance List',
  //       to: 'pages-map-storecompliance-list',
  //     }
  //   ]
  // },
  { heading: 'Report' },
  {
    title: 'OOS & Stock',
    icon: { icon: 'tabler-file' },
    to: 'report-oos-add',
  },
  {
    title: 'Offtake',
    icon: { icon: 'tabler-file' },
    to: 'report-offtake-add',
  },
  
  {
    title: 'Price & Promotion',
    icon: { icon: 'tabler-file' },
    to: 'report-price-add',
  },
  {
    title: 'Compliance',
    icon: { icon: 'tabler-file' },
    to: 'report-compliance-list',
  },
  {
    title: '12 Weeks',
    icon: { icon: 'tabler-file' },
    to: 'report-weeks-add',
  },

  // { heading: 'Setting' },
  // {
  //   title: 'Master',
  //   icon: { icon: 'tabler-smart-home' },
  //   children: [
  //     {
  //       title: 'Account',
  //       to: 'master-account',
  //     },
  //     {
  //       title: 'Account Type',
  //       to: 'master-accounttype',
  //     },
  //     {
  //       title: 'Area Manager (VIP2)',
  //       to: 'master-areamanager',
  //     },
  //     {
  //       title: 'เขต Supervisor',
  //       to: 'master-areasupervisor',
  //     },
  //     {
  //       title: 'Brand',
  //       to: 'master-brand',
  //     },
  //     {
  //       title: 'Sub Brand',
  //       to: 'master-subbrand',
  //     },
  //     {
  //       title: 'Channel',
  //       to: 'master-channel',
  //     },
  //     {
  //       title: 'คู่แข่ง',
  //       to: 'master-competitor',
  //     },
  //     {
  //       title: 'กลุ่มลูกค้า',
  //       to: 'master-groupcustomer',
  //     },
  //     {
  //       title: 'ตำแหน่งงาน',
  //       to: 'master-jobposition',
  //     },
  //     {
  //       title: 'Position',
  //       to: 'master-position',
  //     },
  //     {
  //       title: 'Promotion',
  //       to: 'master-promotion',
  //     },
  //     {
  //       title: 'สาเหตุการไม่ได้พื้นที่',
  //       to: 'master-reasonfornotgettingspace',
  //     },
  //     {
  //       title: 'POSM',
  //       to: 'master-posm',
  //     },
  //     {
  //       title: 'พื้นที่เช่า-หน่วย',
  //       to: 'master-rentalareaunit',
  //     },
  //     {
  //       title: 'Category',
  //       to: 'master-category',
  //     },
  //     {
  //       title: 'Sub Category',
  //       to: 'master-subcategory',
  //     },
  //     {
  //       title: 'จังหวัด',
  //       to: 'master-provinces',
  //     },
  //     {
  //       title: 'บริเวณพื้นที่',
  //       to: 'master-placementpoint',
  //     },
  //     {
  //       title: 'เหตุผล OOS กับ Stock',
  //       to: 'master-noteoosstock',
  //     },
  //   ]
  // },
]
