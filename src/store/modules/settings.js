import defaultSettings from "@/settings";
import variables from "@/styles/variables.scss";

const { showSettings, fixedHeader, sidebarLogo, tagsView } = defaultSettings;

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  tagsView: tagsView, // 控制tagsView导航标签栏是否显示
  theme: variables.theme || "#0960bd",
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
