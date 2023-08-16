import request from "@/utils/request";

//获取菜单信息
export function getMenuInfo(params) {
  return request({
    url: "Permission/GetMenuInfo",
    method: "get",
    params,
  });
}
//更新菜单信息(包括新增和更改)
export function UpdateMenuInfo(data) {
  return request({
    url: "Permission/UpdateMenuInfo",
    method: "post",
    data,
  });
}
//获取角色信息
export function getRoleInfo(params) {
  return request({
    url: "Permission/GetRoleInfo",
    method: "get",
    params,
  });
}
//更新菜单信息(包括新增和更改)
export function UpdateRoleInfo(data) {
  return request({
    url: "Permission/UpdateRoleInfo",
    method: "post",
    data,
  });
}

//获取角色用户配置信息
export function getUserRoleMapInfo(params) {
  return request({
    url: "Permission/GetUserRoleMapInfo",
    method: "get",
    params,
  });
}

//更新角色用户配置信息(包括新增和更改、删除)
export function updateUserRoleMapInfo(data) {
  return request({
    url: "Permission/UpdateUserRoleMapInfo",
    method: "post",
    data,
  });
}

//获取角色菜单配置信息
export function getRoleMenuMapInfo(params) {
  return request({
    url: "Permission/GetRoleMenuMapInfo",
    method: "get",
    params,
  });
}
//更新角色菜单配置信息(包括新增和更改、删除)
export function updateRoleMenuMapInfo(data) {
  return request({
    url: "Permission/UpdateRoleMenuMapInfo",
    method: "post",
    data,
  });
}
