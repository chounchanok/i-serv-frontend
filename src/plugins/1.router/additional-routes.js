const emailRouteComponent = () => import('@/pages/apps/email/index.vue')

// 👉 Redirects
export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie('userData')
      const position_name = userData.value?.position_name
      if(userData){
        if(userData.value){
          if(position_name =='พนักงาน'){
            return { name: 'apps-dashboardoos-list' }
          }else if(position_name =='Supervisor'){
            return { name: 'apps-dashboardoos-list' }
          }else if(position_name =='Assistant Management'){
            return { name: 'apps-dashboardoos-list' }
          }else if(position_name =='Management'){
            return { name: 'apps-dashboardoos-list' }
          }else if(position_name =='Admin'){
            return { name: 'apps-dashboardoos-list' }
          }else if(position_name =='SuperAdmin'){
            return { name: 'apps-dashboardoos-list' }
          }else{
            return { name: 'apps-dashboardoos-list' }
          }
        }else{
          return { name: 'login' }
        }
      }else{
        return { name: 'login' }
      }
      
      // if (position_name === 'พนักงาน')
      //   return { name: 'report-oos-add' }
      // if (position_name === 'Supervisor')
      //   return { name: 'report-oos-add' }
      // if (position_name === 'Assistant Management')
      //   return { name: 'report-oos-add' }
      // if (position_name === 'Management')
      //   return { name: 'report-oos-add' }
      // if (position_name === 'Admin')
      //   return { name: 'apps-dashboardoos-list' }
      // if (position_name === 'SuperAdmin')
      //   return { name: 'apps-dashboardoos-list' }
      // else
      //   return { name: 'apps-dashboardoos-list' }
      
      // return { name: 'login', query: to.query }
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
]
export const routes = [
  // Email filter
  {
    path: '/apps/email/filter/:filter',
    name: 'apps-email-filter',
    component: emailRouteComponent,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },

  // Email label
  {
    path: '/apps/email/label/:label',
    name: 'apps-email-label',
    component: emailRouteComponent,
    meta: {
      // contentClass: 'email-application',
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },
  {
    path: '/dashboards/logistics',
    name: 'dashboards-logistics',
    component: () => import('@/pages/apps/logistics/dashboard.vue'),
  },
  {
    path: '/dashboards/academy',
    name: 'dashboards-academy',
    component: () => import('@/pages/apps/academy/dashboard.vue'),
  },
  {
    path: '/apps/ecommerce/dashboard',
    name: 'apps-ecommerce-dashboard',
    component: () => import('@/pages/dashboards/ecommerce.vue'),
  },
]
