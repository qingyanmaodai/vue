import Vue from 'vue'


import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import 'xe-utils'
Vue.use(VXETable)


import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/utils/alertMsgBox'

import UmyUI from 'umy-ui';
import 'umy-ui/lib/theme-chalk/index.css';// 引入样式
import './assets/icon/iconfont.css'

import 'lib-flexible'
import '../rem'
import common from './utils/common'
import moment from 'moment'
import _ from 'lodash'
Vue.prototype.$moment = moment
Vue.prototype.$_ = _
Vue.prototype.$common = common

import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

// import 'default-passive-events'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(UmyUI);
// Vue.use(UXTableColumn);
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
/*
 * 重写时间的toJSON方法，因为在调用JSON.stringify的时候，时间转换就调用的toJSON，这样会导致少8个小时，所以重写它的toJSON方法
 */
Date.prototype.toJSON = function () {
  return this.format("yyyy-MM-dd hh:mm:ss"); // util.formatDate是自定义的个时间格式化函数
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
