<template>
  <div class="navbar">
    <div class="head_left">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />

      <breadcrumb class="breadcrumb-container" />
    </div>
    <div class="head_right">
      <div class="content_icon usericon2">

        <a
          :href="`${apsurl}`+'/APS系统操作指南v1.pdf'"
          target="_blank"
          class="font_size_1"
        >操作指南</a>

      </div>
      <div class="content_icon">
        <el-tooltip
          class="item"
          effect="dark"
          content="全屏"
          placement="bottom"
        >
          <img
            src="../../assets/svg/enlarge.svg"
            @click="screen"
          />
        </el-tooltip>
      </div>
      <div class="content_icon">
        <el-tooltip
          class="item"
          effect="dark"
          content="主题色"
          placement="bottom"
        >
          <theme-picker @change="themeChange" />
        </el-tooltip>
      </div>
      <el-dropdown
        class="avatar-container"
        trigger="click"
      >
        <div
          class="content_icon usericon"
          @click.prevent
        >
          <img
            src="../../assets/imgs/user.png"
            style="width: 24px; height: 24px"
          />
          <span class="content_text">{{ UserName }}</span>
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <router-link to="/">
            <el-dropdown-item>回到首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item
            divided
            @click.native="editPwd"
          >修改密码</el-dropdown-item>
          <el-dropdown-item
            divided
            @click.native="logout"
          >
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <ComFormDialog
        ref="loginForm"
        :title="'修改密码'"
        :dialogShow="dialogShow"
        :formData="formData"
        :formRules="formRules"
        :formController="formController"
        @dialogBtnClick="dialogBtnClick"
      />
      <!-- <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            src="../../icons/editor_avatar.1040a009.gif"
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>回到首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <!-- 新增用户弹框 -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import screenfull from "screenfull";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ThemePicker from "@/components/ThemePicker";
import ComFormDialog from "@/components/ComFormDialog";
import { SaveData } from "@/api/Common.js";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ThemePicker,
    ComFormDialog,
  },
  data() {
    return {
      apsurl: "",
      userInfo: {},
      UserName: "",
      dialogShow: false,
      formData: {
        Account: "",
        Pwd: "",
        NewPwd: "",
        SurePwd: "",
      },
      formController: [
        { label: "账号", prop: "Account", type: "input", disabled: true },
        { label: "密码", prop: "Pwd", type: "input", disabled: true },
        {
          label: "新密码",
          prop: "NewPwd",
          type: "input",
          inputType: "password",
        },
        {
          label: "确认密码",
          prop: "SurePwd",
          type: "input",
          inputType: "password",
        },
      ],
      formRules: {
        NewPwd: [
          { required: true, message: "新密码为必填项", trigger: "blur" },
        ],
        SurePwd: [
          { required: true, message: "二次密码为必填项", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.apsurl = localStorage.getItem("apsurl");
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (this.userInfo) {
      this.UserName = this.userInfo.UserName;
    }
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    // 全屏
    screen() {
      screenfull.toggle();
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      window.localStorage.clear();
      window.location.reload();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    // 修改密码
    editPwd() {
      this.formData.Account = this.userInfo.Account;
      this.formData.Pwd = this.userInfo.Pwd;
      this.dialogShow = true;
    },
    // 确定修改密码
    async dialogBtnClick(val) {
      let newData = [];
      let obj = {};
      if (val) {
        if (this.formData.NewPwd != this.formData.SurePwd) {
          this.$message.error("两次输入的密码不一致！");
        } else {
        }
        obj["Account"] = this.formData.Account;
        obj["Pwd"] = this.formData.NewPwd;
        obj["dicID"] = 25;
        newData.push(obj);
        let res = await SaveData(newData);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.logout();
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
        this.dialogShow = false;
      } else {
        this.$refs.loginForm.$refs.formData.resetFields();
        this.dialogShow = false;
      }
    },
    themeChange(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: val,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.head_right {
  height: 100%;
  display: flex;
  min-width: 240px;
  align-items: center;
  .usericon {
    min-width: 120px !important;
    justify-content: left !important;
  }
  .usericon2 {
    min-width: 80px !important;
    justify-content: left !important;
  }
  .content_icon {
    display: flex !important;
    height: 48px;
    width: 48px;
    padding: 0 4px;
    font-size: 18px;
    justify-content: center;
    cursor: pointer;
    align-items: center;
  }
  .content_text {
    font-size: 14px;
    margin: 0 6px;
  }
  div:hover {
    background: #f5f4f4;
    cursor: pointer;
  }
}
.el-color-picker {
  height: 26px !important;
  line-height: 26px !important;
}
.navbar {
  height: 48px;
  line-height: 48px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

a,
a:focus,
a:hover {
  cursor: pointer;
  color: #0960bd;
  text-decoration: none;
}
</style>
