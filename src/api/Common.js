import request from "@/utils/request";
// 获取表头
export function GetHeader(data, token) {
  let headers = {};
  if (token) {
    headers["token"] = token;
  }
  return request({
    url: "/APSAPI/GetConfig",
    method: "POST",
    data,
    headers
  });
}
// 获取有个性化头部带日期
export function GetHeaderTwo(data) {
  return request({
    url: "/APSAPI/GetJspreadsheetConfig",
    method: "POST",
    data,
  });
}
// 请求服务器时间
export function GetServerTime(data) {
  return request({
    url: "/APSAPI/GetServerTime",
    method: "POST",
    data,
  });
}
// 查询数据
export function GetSearchData(data, token) {
  let headers = {};
  if (token) {
    headers["token"] = token;
  }
  return request({
    url: "/APSAPI/APSData",
    method: "POST",
    data,
    headers,
  });
}

// 查询模糊的数据
export function GetFuzzySearchData(data) {
  return request({
    url: "/APSAPI/APSDataOR",
    method: "POST",
    data,
  });
}

// 导出数据
export function ExportData(data) {
  return request({
    url: "/APSAPI/APSDataExcel",
    method: "POST",
    data,
    responseType: "arraybuffer",
  });
}

// 保存数据
export function SaveData(data) {
  return request({
    url: "/APSAPI/SaveData",
    method: "POST",
    data,
  });
}

// 获取菜单
export function GetMenus(data) {
  return request({
    url: "/APSAPI/GetMenus",
    method: "POST",
    data,
  });
}

// 获取角色
export function GetRoles(data) {
  return request({
    url: "/APSAPI/GetRoles",
    method: "POST",
    data,
  });
}

// 获取角色下的菜单按钮
export function GetMenuRoleBtn(data) {
  return request({
    url: "/APSAPI/GetMenuRoleBtn",
    method: "POST",
    data,
  });
}
// 获取组织
export function GetOrgData(data) {
  return request({
    url: "/APSAPI/GetOrgData",
    method: "POST",
    data,
  });
}

// 配置工艺
export function UpdateProcess(data) {
  return request({
    url: "/APSAPI/UpdateProcess",
    method: "POST",
    data,
  });
}
///自定义查询

export function GetSearch(data, url) {
  return request({
    url: url,
    method: "POST",
    data,
  });
}

// 保存排班
export function SaveWorkingTimes(data) {
  return request({
    url: "/APSAPI/SaveWorkingTimes",
    method: "POST",
    data,
  });
}

// 获取订单BOM
export function GetOrderBomData(data) {
  return request({
    url: "/APSAPI/GetOrderBomData",
    method: "POST",
    data,
  });
}

// 导入BOM
export function ImportOrderBOM(data) {
  return request({
    url: "/APSAPI/ImportOrderBOM",
    method: "POST",
    data,
  });
}

// 获取班次
export function GetWorkTime(data) {
  return request({
    url: "/APSAPI/GetWorkTime",
    method: "POST",
    data,
  });
}

// 打印旧模板
export function printTemplateData(data) {
  return request({
    url: "/APSAPI/PrintTemplateData",
    method: "POST",
    data,
  });
}

// 打印新模板
export function GetPrintProgramCodes(params) {
  return request({
    url: "/BaseInfo/GetPrintProgramCodes",
    method: "GET",
    params,
  });
}

// 查询线别排班
export function GetWorkTimeData(data) {
  return request({
    url: "/APSAPI/getLineWorkDate",
    method: "POST",
    data,
  });
}

// 保存单月线别排班
export function SaveLineWorkingTimes(data) {
  return request({
    url: "/APSAPI/SaveLineWorkingTimes",
    method: "POST",
    data,
  });
}

// 同步更新采购员
export function UpdateOrderBomPOTracker(data) {
  return request({
    url: "/APSAPI/UpdateOrderBomPOTracker",
    method: "POST",
    data,
  });
}

// 解析产能
export function SysCapacity(data) {
  return request({
    url: "/APSAPI/ImportCapacity",
    method: "POST",
    data,
  });
}
// 更新产能
export function UpdateImportCapaticy(data) {
  return request({
    url: "/APSAPI/UpdateImportCapacity",
    method: "POST",
    data,
  });
}
