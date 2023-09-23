<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import { CheckSSO } from '@/api/user';
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    // 单点登录
    async SignIn() {
      let res = await CheckSSO();
      const { result, url } = res.data;
      if (result) {
        window.location.href = url; // 替换成你想跳转的外部URL
      }
    },
    // 获取地址栏参数
    getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
    },
  },
  async created() {
    // await this.SignIn();
  },
};
</script>

<style lang="scss">
#app {
  // padding: 10px;
  color: #000000;
  font-size: 16px;
  height: 100%;
  background-color: #f0f2f5;
}
.customClass {
  position: fixed;
  margin-top: 0vh !important;
  width: 20% !important;
  top: 82px;
  bottom: 0;
  overflow: scroll;
  margin-left: 80%;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
input[type='number'] {
  -moz-appearance: textfield;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
}

.el-select-dropdown__item.selected {
  font-weight: normal;
}

.el-input.is-disabled .el-input__inner {
  color: #010000;
}

.el-input--mini .el-input__inner {
  height: 26px !important;
}
.el-textarea,
.el-input {
  vertical-align: middle !important;
}
.el-textarea__inner {
  min-height: 23px !important;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #fff !important;
}

.elx-table .el-input--mini .el-input__inner,
.vxe-table .el-input--mini .el-input__inner {
  line-height: 20px !important;
  min-height: 20px !important;
  margin: 1px 0;
}

.vxe-table--render-default {
  color: #151515 !important;
}
.el-input--mini .el-input__icon {
  line-height: 23px !important;
}
.el-textarea__inner {
  padding: 0 2px !important;
}
</style>
