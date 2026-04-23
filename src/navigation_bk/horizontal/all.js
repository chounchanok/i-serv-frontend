export default [
  { heading: 'Apps & Pages' },
  {
    title: 'Dashboards',
    icon: { icon: 'tabler-file' },
    to: 'dashboards-crm',
  },
  {
    title: 'Users',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Users',
        to: 'dashboards-analytics',
      },
      {
        title: 'Roles',
        to: 'dashboards-crm',
      },
      {
        title: 'Permissions',
        to: 'dashboards-ecommerce',
      }
    ]
  },
  {
    title: 'Customer',
    icon: { icon: 'tabler-file' },
    to: 'dashboards-ecommerce',
  },
  {
    title: 'Store',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Store',
        to: 'dashboards-analytics',
      },
      {
        title: 'Store to Account',
        to: 'dashboards-ecommerce',
      }
    ]
  },
  {
    title: 'Product & Stock',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Product',
        to: 'dashboards-analytics',
      },
      {
        title: 'Stock',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Map Store',
        to: 'dashboards-ecommerce',
      }
    ]
  },
  { heading: 'Apps & Pages' },
  {
    title: 'OOS & Stock',
    icon: { icon: 'tabler-file' },
    to: 'dashboards-academy',
  },
  {
    title: 'Offtake',
    icon: { icon: 'tabler-file' },
    to: 'dashboards-logistics',
  },
  {
    title: '12Weeks',
    icon: { icon: 'tabler-file' },
    to: 'pages-dialog-examples',
  },
  {
    title: 'Price & Promotion',
    icon: { icon: 'tabler-file' },
    to: 'apps-calendar',
  },
  {
    title: 'Compliance',
    icon: { icon: 'tabler-file' },
    to: 'apps-calendar',
  },
  { heading: 'Setting' },
  {
    title: 'Master',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Account',
        to: 'dashboards-analytics',
      },
      {
        title: 'Account Type',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Area Manager (VIP2)',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'เขต Supervisor',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Brand',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Sub Brand',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Channel',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'คู่แข่ง',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'กลุ่มลูกค้า',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'ตำแหน่งงาน',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Position',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Promotion',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'สาเหตุการไม่ได้พื้นที่',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'POSM',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'พื้นที่เช่า-หน่วย',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Category',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'Sub Category',
        to: 'dashboards-ecommerce',
      },
      {
        title: 'จังหวัด',
        to: 'dashboards-ecommerce',
      },
    ]
  },
]
