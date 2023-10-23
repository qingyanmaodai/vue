import { NEWLOGIN, OrgData } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { Message } from "element-ui";
// import { formatDate } from '@/utils/formatDate'

const getDefaultState = () => {
  return {
    token: getToken(),
    menus: [], //动态路由
    roles: [], //用户角色
    btns: [], // 菜单按钮
    userInfo: {},
    account: "", //判断是不是第一次登录进来
    tokenExpire: "", //token过期时间
    orgTreeData: [],
    reduceHeight: 183,
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_MENU: (state, menus) => {
    state.menus = menus;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_BUTTON: (state, roles) => {
    state.btns = roles;
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  SET_TokenExpire: (state, tokenExpire) => {
    state.tokenExpire = tokenExpire;
  },
  SET_ACCOUNT(state, account) {
    state.account = account;
  },
  SET_ORGDATA(state, orgData) {
    state.orgTreeData = orgData;
  },
  SET_REDUCEHEIGHT(state, reduceHeight) {
    state.reduceHeight = reduceHeight;
  },
};

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { Pwd, Account } = userInfo;
    return new Promise((resolve, reject) => {
      NEWLOGIN({ Pwd: Pwd, Account: Account, eipaulg: "" })
        .then((res) => {
          if (res.data.result) {
            let obj = {
              Pwd: res.data.dev_Account.Pwd,
              Account: res.data.dev_Account.Account,
              UserName: res.data.Name,
              MFGOrganizeID: res.data.dev_Account.CenterID,
            };
            localStorage.setItem("userInfo", JSON.stringify(obj));
            commit("SET_TOKEN", res.data.token);
            setToken(res.data.token);
            //获取动态菜单，动态渲染首页
            commit("SET_MENU", res.data.dev_Account.MenuVue);
            if (res.data.ValidityDays <= 30) {
              Message({
                message: "软件即将在" + res.data.ValidityDays + "天后（" + res.data.ValidityDate + "）到期，请联系软件供应商，谢谢！",
                type: 'error',
                duration: 0,
                dangerouslyUseHTMLString: true,
                showClose: true,
              })
            }

          } else {
            Message.error(res.data.msg);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 单点登录
  autoLogin({ commit }, userInfo) {
    const { Pwd, Account, eipaulg } = userInfo;
    return new Promise((resolve, reject) => {
      NEWLOGIN({ Pwd: Pwd, Account: Account, eipaulg: eipaulg })
        .then((res) => {
          if (res.data.result) {
            let obj = {
              Pwd: res.data.dev_Account.Pwd,
              Account: res.data.dev_Account.Account,
              UserName: res.data.Name,
              MFGOrganizeID: res.data.dev_Account.CenterID,
            };
            localStorage.setItem("userInfo", JSON.stringify(obj));
            commit("SET_TOKEN", res.data.token);
            setToken(res.data.token);
          } else {
            Message.error(res.data.msg);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  exportData({ commit }, data) {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
    });
    // 生成文件路径
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, "数据表");
    } else {
      var a = document.createElement("a");
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "数据表";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  },
  // 退出登录
  logout({ commit, state }) {
    commit("SET_TOKEN", "");
    commit("SET_ROLES", []);
    removeToken(); // must remove  token  first
    resetRouter();
    commit("RESET_STATE");

    // return new Promise((resolve, reject) => {
    //   logout(state.token).then((response) => {
    //     // console.log(response)
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  //请求刷新Token（以旧换新）
  refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      refreshToken(state.token)
        .then((response) => {
          const { code, Result } = response;
          if (code == 20000) {
            commit("SET_TOKEN", Result.Token);

            let date = new Date();
            date.setSeconds(date.getSeconds() + Result.TokenExpire);

            sessionStorage.setItem(
              "tokenExpire",
              formatDate() + " " + date.toTimeString().split(" ")[0]
            );

            //设置过期时间
            commit("SET_TokenExpire", sessionStorage.getItem("tokenExpire"));

            setToken(res.Token);
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
  // 获取用户信息
  userInfo({ commit, dispatch }, userInfo) {
    const { Pwd, Account } = userInfo;
    return new Promise((resolve, reject) => {
      NEWLOGIN({ Pwd: Pwd, Account: Account })
        .then((res) => {
          commit("SET_USERINFO", res.data.dev_Account);
          if (res.data.dev_Account.RoleMap.length == 0) {
            Message.error("没有权限登录！");
            return;
          }
          commit("SET_ROLES", res.data.dev_Account.RoleMap);
          commit("SET_BUTTON", res.data.dev_Account.ButtonMenuRoleMap);
          commit("SET_MENU", res.data.dev_Account.MenuVue);
          // let homeHeight = document.documentElement.clientWidth;
          // if (homeHeight <= 1440) {
          //   commit('SET_REDUCEHEIGHT', 138);
          // } else {
          //   commit('SET_REDUCEHEIGHT', 183);
          // }

          const scale = document.documentElement.clientWidth / 1920;
          commit("SET_REDUCEHEIGHT", Math.ceil(183 * scale));

          dispatch("getOrganizeData", { root: true });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 获取组织信息 共享
  getOrganizeData({ commit }) {
    return new Promise((resolve, reject) => {
      OrgData()
        .then((res) => {
          commit("SET_ORGDATA", res.data.datas);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
