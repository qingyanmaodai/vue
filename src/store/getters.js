const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  tokenExpire: (state) => state.user.tokenExpire,
  roles: (state) => state.user.roles,
  menus: (state) => state.user.menus,
  userInfo: (state) => state.user.userInfo,
  btns: (state) => state.user.btns,
  account: (state) => state.user.account,
  routers: (state) => state.permission.routers,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  orgTreeData: (state) => state.user.orgTreeData,
  reduceHeight: (state) => state.user.reduceHeight,
  apsurl: (state) => state.app.apsurl,
};
export default getters;
