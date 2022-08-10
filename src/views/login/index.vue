<template>
  <div
    class="login-container"
    v-loading="loading"
  >
    <div class="login_header">
      <div class="logoIcon"></div>
      <div class="barCode"></div>
    </div>
    <div class="login_content flex">
      <div class="content"></div>
      <div class="content flex">
        <div class="card flex">
          <div class="fill">
            <div
              class="label"
              @click="clickNum"
            >账号登录</div>
            <el-form
              :model="loginForm"
              :rules="loginRules"
              ref="loginForm"
            >
              <el-form-item prop="Account">
                <div class="input">
                  <el-input
                    v-model="loginForm.Account"
                    aria-placeholder="请输入账号"
                    @keyup.enter.native="login"
                    clearable
                  ></el-input>
                  <img src="../../assets/imgs/login_user.png" />
                </div>
              </el-form-item>
              <el-form-item prop="Pwd">
                <div class="input">
                  <el-input
                    v-model="loginForm.Pwd"
                    aria-placeholder="请输入密码"
                    show-password
                    @keyup.enter.native="login"
                    clearable
                  ></el-input>
                  <img src="../../assets/imgs/password.png" />
                </div>
              </el-form-item>
              <el-form-item
                prop="URL"
                :style="{ display: clickSign == 5 ? 'block' : 'none' }"
              >
                <div class="input">
                  <el-input
                    v-model="loginForm.URL"
                    aria-placeholder="请输入地址"
                    type="text"
                    @keyup.enter.native="login"
                  ></el-input>
                  <img src="../../assets/imgs/password.png" />
                </div>
              </el-form-item>
            </el-form>
            <div>
              <el-button
                class="btn"
                @click="login"
              >登录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="login_footer flex_row_spaceRound">
      <!-- <div class="text">系统管理员：</div>
      <div class="text">报障热线：</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      loginForm: {
        Account: "",
        Pwd: "",
        URL: "",
      },
      loginRules: {
        Account: [{ required: true, trigger: "blur", message: "账号为必填项" }],
        Pwd: [{ required: true, trigger: "blur", message: "密码为必填项" }],
      },
      loading: false,
      redirect: undefined,
      clickSign: 0,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {  
  },
  methods: {
    // 点击触发地址
    clickNum() {
      if (this.clickSign > 5) {
        this.clickSign = 0;
      } else {
        this.clickSign++;
      }
    },
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: "/" });
              this.loading = false;
            })
            .catch((error) => {
              this.$message.error(error.message);
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login_header {
  height: 109px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
}

.logoIcon {
  width: 126px;
  height: 82px;
  background: url(../../assets/imgs/logo.png);
  background-size: 100% 100%;
}
.barCode {
  width: 126px;
  height: 82px;
  background: url(../../assets/icon/APP.png);
  background-size: 100% 100%;
}

.login_content {
  height: calc(100vh - 218px);
  background: url(../../assets/imgs/BG.png);
  background-size: 100% 100%;
}

.login_footer {
  height: 109px;
  padding: 0 25%;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 50%;
  height: 100%;
}

.card {
  width: 380px;
  height: 400px;
  margin: auto;
  background: #fff;
  border-radius: 10px;
  padding: 28px;
}

.text {
  font-weight: 500;
  color: #555a64;
  font-size: 20px;
}

.label {
  height: 30px;
  font-size: 24px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #008cf5;
  margin-bottom: 30px;
}

.input {
  position: relative;
  ::v-deep .el-input__inner {
    padding: 0 40px !important;
  }
}

.input img {
  position: absolute;
  margin: auto;
  left: 7px;
  top: 12px;
}

.input .el-input__inner {
  height: 54px !important;
  border: 2px solid #6ea7fe;
  border-radius: 4px;
  margin-bottom: 26px;
  padding: 0 30px !important;
  font-size: 16px !important;
}
.el-input__icon {
  line-height: 54px !important;
  height: 54px !important;
}

.labelTwo {
  margin-bottom: 26px;
  text-align: right;
}

.editPwd {
  font-weight: 400;
  color: #fe0000;
  cursor: pointer;
}

.btn {
  width: 100%;
  height: 54px;
  background: #008cf5 !important;
  border-radius: 4px;
  font-weight: bold;
  color: #fff;
  font-size: 16px;
  letter-spacing: 2px;
}
.btn:hover {
  color: #fff !important;
}

.fill {
  width: 100%;
}
</style>
