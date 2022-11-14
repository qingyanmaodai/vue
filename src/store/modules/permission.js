import store from '@/store'
import Layout from '@/layout'
import { constantRoutes } from '@/router'


function GetMenuList(data, ParentCode) {
    const returnedItem = []
    var find = function (arr, id) {
        const menus = []
        if (!id) {
            var newArr = arr.filter(m => m.ParentCode == id || m.ParentCode == null);
        } else {
            var newArr = arr.filter(m => m.ParentCode == id);
        }
        newArr.sort(function (a, b) {
            if (a.ViewSort == null) {
                a.ViewSort = 0
            }
            if (b.ViewSort == null) {
                b.ViewSort = 0
            }
            return a.ViewSort - b.ViewSort
        })
        newArr.some((item, o) => {
            let component = item.Component == 'Layout' ? Layout : function component(resolve) {
                require([`@/views/${item.Component}.vue`], resolve)
            }
            let allBtns = [];
            let newBtns = store.getters.btns.filter(x => { return x.MenuCode == item.MenuCode });
            newBtns.forEach(x => {
                if (allBtns.findIndex(y => { return y.ButtonCode == x.ButtonCode }) == -1) {
                    allBtns.push(x)
                }
            })
            let childmodel = {
                path: item.Url,
                component: component,
                redirect: item.Redirect,
                alwaysShow: true,
                name: item.Name,
                hidden: item.Hidden,
                meta: { title: item.MenuName, icon: item.Ico, noCache: item.keepAlive, btns: allBtns, dicID: item.Remark2, index: o,IsOpenWindow:item.IsOpenWindow }
            }
            var child = []
            var childlist = []
            child = findMenu(data, item.MenuCode)
            if (child.length > 0) {
                childmodel.children = []

                childlist = find(child, item.MenuCode)
                if (childlist != null) {
                    childmodel.children = childlist
                }
            } else {
                childmodel = {
                    path: item.Url,
                    component: function component(resolve) {
                        require([`@/views/${item.Component}`], resolve)
                    },
                    hidden: item.Hidden,
                    name: item.Name,
                    meta: { title: item.MenuName, icon: item.Ico, noCache: item.keepAlive, btns: allBtns, dicID: item.Remark2, index: -1 ,IsOpenWindow:item.IsOpenWindow}
                }
            }
            menus.push(childmodel)
        })
        return menus
    }
    var menu = null
    returnedItem.push(find(data, ParentCode))

    return returnedItem[0]
}

function findMenu(data, ParentCode) {
    var returnedItem = []
    var find = function (arr, id) {
        arr.forEach((item) => {
            if (item.ParentCode == id) {
                returnedItem.push(item)
            }
        })
    }
    find(data, ParentCode)
    returnedItem.sort(function (a, b) {
        if (a.ViewSort == null) {
            a.ViewSort = 0
        }
        if (b.ViewSort == null) {
            b.ViewSort = 0
        }
        return a.ViewSort - b.ViewSort
    })
    return returnedItem
}

const defaultBtn = [{
    BtnName: "查询",
    Type: "primary",
    Size: "small",
    Icon: "SearchOutlined",
    Methods: "dataSearch",
},
{
    BtnName: "重置",
    Type: "info",
    Size: "small",
    Icon: "",
    Methods: "dataReset",
},
{
    BtnName: "保存",
    Type: "success",
    Ghost: true,
    Size: "small",
    Methods: "dataSave",
    Icon: "",
}]
const systemSetting = [{
    path: '/ConfigPermission',
    component: Layout,
    meta: { title: '权限配置', icon: 'el-icon-s-shop', index: 2 },
    children: [{
        path: 'MenuInfo',
        name: 'MenuInfo',
        component: () => import('@/views/ConfigPermission/MenuInfo/index'),
        meta: { title: '菜单权限', icon: 'el-icon-s-operation', btns: [], index: -1 }
    }, {
        path: 'RoleInfo',
        name: 'RoleInfo',
        component: () => import('@/views/ConfigPermission/RoleInfo/index'),
        meta: { title: '角色权限', icon: 'el-icon-user', btns: [], index: -1 }
    }, {
        path: 'BtnInfo',
        name: 'BtnInfo',
        component: () => import('@/views/ConfigPermission/BtnInfo/index'),
        meta: { title: '按钮权限', icon: 'el-icon-thumb', btns: [], index: -1 }
    }, {
        path: 'DataInfo',
        name: 'DataInfo',
        component: () => import('@/views/ConfigPermission/DataInfo/index'),
        meta: { title: '数据权限', icon: 'el-icon-bell', btns: [], index: -1 }
    }
    ]
},

    // {
    //     path: '/PageSale',
    //     component: Layout,
    //     meta: { title: '销售排程', icon: 'el-icon-s-marketing', btns: [] },
    //     children: [
    //         {
    //             path: 'SaleOrder',
    //             name: 'SaleOrder',
    //             component: () => import('@/views/PageSale/SaleOrder/index'),
    //             meta: { title: '销售订单下达', icon: 'el-icon-position', btns: [] }
    //         },
    //         {
    //             path: 'SaleScheduling',
    //             name: 'SaleScheduling',
    //             component: () => import('@/views/PageSale/SaleScheduling/index'),
    //             meta: { title: '当月销售计划', icon: 'el-icon-notebook-1', btns: [] }
    //         },
    //         {
    //             path: 'DemandTrans',
    //             name: 'DemandTrans',
    //             component: () => import('@/views/PageSale/DemandTrans/index'),
    //             meta: { title: '客户需求转换', icon: 'el-icon-sort', btns: [] }
    //         }]
    // }
]

const state = {
    routers: [], //全部的路由
    addRouters: [] //添加的路由
}
const mutations = {
    SET_ROUTERS: (state, routers) => {
        state.addRouters = routers
        state.routers = constantRoutes.concat(routers)
    }
}
const actions = {
    GenerateRoutes({ commit }) {
        let role = store.getters.roles;
        //管理员身份
        let asyncRouterMapNew = [];
        if (role.findIndex(r => { return (r.Account == 'admin' || r.Account == '378102') }) != -1) {
            // console.log(asyncRouterMap)
            asyncRouterMapNew = asyncRouterMapNew.concat(systemSetting);
        }
        // 菜单
        asyncRouterMapNew = asyncRouterMapNew.concat(GetMenuList(store.getters.menus, ''));
        // console.log(asyncRouterMapNew)
        commit('SET_ROUTERS', asyncRouterMapNew)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
