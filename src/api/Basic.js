import request from "@/utils/request";
// 获取产品类别信息
export function GetGoodsInfo(params) {
  return request({
    url: "/BaseInfo/GetProductCategories",
    method: "get",
    params,
  });
}
// 新增-1 修改-1 删除-2产品类别信息 (DataList)
export function UpdateGoodsInfo(data) {
  return request({
    url: "/BaseInfo/UpdateProductCategories",
    method: "post",
    data,
  });
}
// 获取产品信息
export function GetGoodsData(params) {
  return request({
    url: "/BaseInfo/GetProducts",
    method: "get",
    params,
  });
}
// 新增-1 修改-1 删除-2产品信息 （Data , DetailData)
export function UpdateGoodsData(data) {
  return request({
    url: "/BaseInfo/UpdateProducts",
    method: "post",
    data,
  });
}

// 获取供应商类别信息-1 客户类别信息-2 生产线组织-3
export function GetContactUnitInfo(params) {
  return request({
    url: "/BaseInfo/GetUnitCategory",
    method: "get",
    params,
  });
}
// 新增 修改 删除 供应商类别信息 客户类别信息 生产线组织
export function UpdateContactUnitInfo(data) {
  return request({
    url: "/BaseInfo/UpdateUnitCategory",
    method: "post",
    data,
  });
}
// 获取供应商信息 客户信息 生产线详情
export function GetContactUnitData(params) {
  return request({
    url: "/BaseInfo/GetUnits",
    method: "get",
    params,
  });
}
// 新增 修改 删除 供应商信息 客户信息 生产线
export function UpdateContactUnitData(data) {
  return request({
    url: "/BaseInfo/UpdateUnits",
    method: "post",
    data,
  });
}

// 获取仓库信息
export function GetWarehouseInfo(params) {
  return request({
    url: "/BaseInfo/GetWarehouse",
    method: "get",
    params,
  });
}
// 新增 修改 删除仓库信息
export function UpdateWarehouseInfo(data) {
  return request({
    url: "/GetCustomInfo",
    method: "post",
    data,
  });
}
// 获取货架信息
export function GetShelvesData(params) {
  return request({
    url: "/BaseInfo/GetShelves",
    method: "get",
    params,
  });
}
// 新增 修改 删除 货架信息
export function UpdateShelvesData(data) {
  return request({
    url: "/BaseInfo/UpdateShelves",
    method: "post",
    data,
  });
}
// 获取储位信息
export function GetStorageData(params) {
  return request({
    url: "/BaseInfo/GetStorage",
    method: "get",
    params,
  });
}
// 新增 修改 删除储位信息
export function UpdateStorageData(data) {
  return request({
    url: "/BaseInfo/UpdateStorage",
    method: "post",
    data,
  });
}

// 更新往来单位信息
export function UpdateUnits(data) {
  return request({
    url: "/BaseInfo/UpdateUnits",
    method: "post",
    data,
  });
}

// 更新往来单位类别
export function UpdateUnitCategory(data) {
  return request({
    url: "/BaseInfo/UpdateUnitCategory",
    method: "post",
    data,
  });
}
