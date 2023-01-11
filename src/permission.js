//负责全局路由守卫和登录判断
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { constantRoutes } from '@/router'

NProgress.configure({ showSpinner: false }) // 封装的进度条

const whiteList = ['/login'] // 路由白名单列表，把路由添加到这个数组，不用登陆也可以访问

router.beforeEach(async (to, from, next) => {
  // 请求路由时进度条开始
  NProgress.start()

  // 设置标题
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果用户存在令牌的情况请求登录页面，就让用户直接跳转到首页，避免存在重复登录的情况
      // 直接跳转到首页，当然取决于你的路由重定向到哪里
      next({ path: '/' })
      //一定要关闭进度条
      NProgress.done()
    } else {
      if (store.getters.roles.length > 0) {
        //信息拿到后，用户请求哪就跳转哪
        next()
      } else {
        try {
          // 如果有令牌，但是没有用户信息，证明用户是第一次登录，通过Vuex设置用户信息
          await store.dispatch("user/userInfo", JSON.parse(localStorage.getItem('userInfo')));
          // await store.dispatch("user/getOrganizeData");
          store.dispatch('permission/GenerateRoutes').then(() => {
            router.addRoutes(store.state.permission.addRouters)
          }).catch(err => {
            router.addRoutes([]);
          })
	        // 登录成功或重新加载页面时，获取是动态配置首页渲染动态首页，否则取静态的
          let indexNum = -1
          indexNum = _.findIndex(store.getters.menus, function(o) { 
            if(o.ParentCode&&o.MenuName==='首页'){
                return o
            }
         })
          if(indexNum>-1){
            next({ path: store.getters.menus[indexNum].Url })
          }else{
            next({ ...to, replace: true })
          }

        } catch (error) {
          // 如果出错了，把令牌去掉，并让用户重新去到登录页面
          await store.dispatch('user/resetToken')
          Message.error(error.message || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }

    }
  } else {
    //这里是没有令牌的情况
    if (whiteList.indexOf(to.path) !== -1) {
      // 不是-1就证明存在白名单里，不管你有没有令牌，都直接去到白名单路由对应的页面
      next()
    } else {
      // 如果这个页面不在白名单里，直接跳转到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 每次请求结束后都需要关闭进度条
  NProgress.done()
})
