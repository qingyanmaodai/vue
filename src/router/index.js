import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-shop', affix: true }
    }]
  },
  {
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }
  // {
  //   path: '/PurchasingModule',
  //   component: Layout,
  //   name: 'PurchasingModule',
  //   meta: { title: '采购模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       // 请购单
  //       path: 'Requisition',
  //       name: 'Requisition',
  //       component: () => import('@/views/PurchasingModule/Requisition/index'),
  //       meta: { title: '请购单', icon: 'table' }
  //     },
  //     {
  //       // 查看请购单
  //       path: 'RequisitionDetails',
  //       name: 'RequisitionDetails',
  //       component: () => import('@/views/PurchasingModule/Requisition/RequisitionDetails.vue'),
  //       meta: { title: '查看请购单', icon: 'tree' },
  //       hidden: true
  //     },
  //     {
  //       // 采购订单
  //       path: 'PurchaseOrder',
  //       name: 'PurchaseOrder',
  //       component: () => import('@/views/PurchasingModule/PurchaseOrder/index'),
  //       meta: { title: '采购订单', icon: 'tree' }
  //     },
  //     // {
  //     //   // 查看采购订单
  //     //   path: 'PurchaseOrderDetail',
  //     //   name: 'PurchaseOrderDetail',
  //     //   component: () => import('@/views/PurchasingModule/PurchaseOrder/OrderDetail.vue'),
  //     //   meta: { title: '采购订单信息', icon: 'tree' },
  //     //   hidden: true
  //     // },
  //     {
  //       // 采购单
  //       path: 'PurchaseOrderDoc',
  //       name: 'PurchaseOrderDoc',
  //       component: () => import('@/views/PurchasingModule/PurchaseOrderDoc/index'),
  //       meta: { title: '采购单', icon: 'tree' }
  //     },
  //     // {
  //     //   // 查看采购单
  //     //   path: 'PurchaseOrderDocDetail',
  //     //   name: 'PurchaseOrderDocDetail',
  //     //   component: () => import('@/views/PurchasingModule/PurchaseOrderDoc/OrderDetail.vue'),
  //     //   meta: { title: '采购单信息', icon: 'tree' },
  //     //   hidden: true
  //     // },
  //     {
  //       // 采购退货单
  //       path: 'PurchaseReturnOrder',
  //       name: 'PurchaseReturnOrder',
  //       component: () => import('@/views/PurchasingModule/PurchaseReturnOrder/index'),
  //       meta: { title: '采购退货单', icon: 'tree' }
  //     },
  //     // {
  //     //   // 查看采购退货单
  //     //   path: 'PurchaseReturnOrderDetail',
  //     //   name: 'PurchaseReturnOrderDetail',
  //     //   component: () => import('@/views/PurchasingModule/PurchaseReturnOrder/OrderDetail.vue'),
  //     //   meta: { title: '采购退货单信息', icon: 'tree' },
  //     //   hidden: true
  //     // },
  //     {
  //       // 入库单
  //       path: 'WarehouseEnter',
  //       name: 'WarehouseEnter',
  //       component: () => import('@/views/Stock/WarehouseEnter/index'),
  //       meta: { title: '入库单', icon: 'table' }
  //     },
  //     {
  //       // 出库单
  //       path: 'WarehouseOut',
  //       name: 'WarehouseOut',
  //       component: () => import('@/views/Stock/WarehouseOut/index'),
  //       meta: { title: '出库单', icon: 'table' }
  //     },
  //     {
  //       // 查看/编辑 出库单/待出库单
  //       path: 'warehouseOrderDetail',
  //       name: 'warehouseOrderDetail',
  //       component: () => import('@/views/Stock/WarehouseOut/warehouseOrderDetail.vue'),
  //       meta: { title: '出库单信息', icon: 'table' },
  //       hidden: true
  //     },
  //   ]
  // },
  // {
  //   path: '/BasicConfiguration',
  //   name: 'BasicConfiguration',
  //   component: Layout,
  //   meta: { title: '基础配置', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       // 商品管理
  //       path: 'GoodsInformation',
  //       name: 'GoodsInformation',
  //       component: () => import('@/views/BasicConfiguration/GoodsInformation'),
  //       meta: { title: '商品管理', icon: 'tree' },
  //     },
  //     {
  //       // 供应商管理
  //       path: 'Supplier',
  //       name: 'Supplier',
  //       component: () => import('@/views/BasicConfiguration/Supplier'),
  //       meta: { title: '供应商管理', icon: 'tree' }
  //     },
  //     {
  //       // 客户管理
  //       path: 'Custom',
  //       name: 'Custom',
  //       component: () => import('@/views/BasicConfiguration/Custom'),
  //       meta: { title: '客户管理', icon: 'tree' }
  //     },
  //     {
  //       // 仓库管理
  //       path: 'Warehouse',
  //       name: 'Warehouse',
  //       component: () => import('@/views/BasicConfiguration/Warehouse/index'),
  //       meta: { title: '仓库管理', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export const asyncRouterMap = [];

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
