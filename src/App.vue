<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
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
    getAutoLogin(eipaulg) {
      let loginForm = { Account: "378102", Pwd: "824525", eipaulg: eipaulg };
      this.$store
        .dispatch("user/autoLogin", loginForm)
        .then(() => {
          this.$router.push({ path: "/" });
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.message);
          this.loading = false;
        });
    },
    // 获取地址栏参数
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
    },
  },
  created() {
    let eipaulg = this.getQueryString("eipaulg");
    if (eipaulg) {
      this.getAutoLogin(eipaulg);
    }
    // 在页面加载时读取sessionStorage
    if (sessionStorage.getItem("tokenExpire")) {
      this.$store.commit(
        "user/SET_TokenExpire",
        sessionStorage.getItem("tokenExpire")
      );
    }
  },
};
</script>

<style lang="scss">
#app {
  // padding: 10px;
  color: #000000d9;
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
input[type="number"] {
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

ul li .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}

.el-tree-node__label {
  font-weight: normal;
}

.el-tree .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.el-input.is-disabled .el-input__inner {
  color: #010000;
}
.el-tree .is-current .el-tree-node__children .el-tree-node__label {
  color: #606206;
  font-weight: normal;
}
.el-tree-node {
  position: relative;
  padding-left: 15px;
}

.el-tree-node__children {
  padding-left: 15px;
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
.el-tree-node::before {
  content: "";
  height: 100%;
  width: 1px;
  position: absolute;
  left: -3px;
  top: -26px;
  border-width: 1px;
  border-left: 1px dashed #82858a !important;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #fff !important;
}
.el-tree-node:last-child::before {
  height: 44px;
}

.elx-table .el-input--mini .el-input__inner,
.vxe-table .el-input--mini .el-input__inner {
  line-height: 20px !important;
  min-height: 20px !important;
  margin: 1px 0;
}

.vxe-table--header-wrapper {
  // background-color: #e8eaec !important;
}
.vxe-table--render-default {
  color: #151515 !important;
}
// .el-input--mini .el-input__inner,
// .el-input--mini .el-input__icon,
// .el-textarea__inner {
//   line-height: 22px !important;
//   height: 22px !important;
// }
.el-input--mini .el-input__icon {
  line-height: 23px !important;
}
.el-textarea__inner {
  padding: 0 2px !important;
}
.el-tree-node::after {
  content: "";
  width: 24px;
  height: 20px;
  position: absolute;
  left: -3px;
  top: 17px;
  border-width: 1px;
  border-top: 1px dashed #82858a;
}

.el-tree > .el-tree-node:after {
  border-top: none !important;
}

.el-tree > .el-tree-node::before {
  border-left: none !important;
}

.el-tree-node__expand-icon {
  font-size: 16px;
}

.el-tree-node__expand-icon.is-leaf {
  color: transparent;
}
</style>
