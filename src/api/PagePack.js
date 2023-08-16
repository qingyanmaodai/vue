import request from "@/utils/request";
// 保存包装计划
export function SaveProcessPartMaterialDay(data) {
  return request({
    url: "/APSAPI/SaveProcessPartMaterialDay",
    method: "POST",
    data,
  });
}
// 保存工序计划
export function SalesPlanProcessMaterialDay(data) {
  return request({
    url: "/APSAPI/SalesPlanProcessMaterialDay",
    method: "POST",
    data,
  });
}

// 从销售更新
export function UpdateSale(data) {
  return request({
    url: "/APSAPI/OneStepRelease",
    method: "POST",
    data,
  });
}

// 抓取数据
export function WJDayPlan(data) {
  return request({
    url: "/APSAPI/WJDayPlan",
    method: "POST",
    data,
  });
}

// 发布日计划
export function WJToDayPlan(data) {
  return request({
    url: "/APSAPI/WJToDayPlan",
    method: "POST",
    data,
  });
}

// 保存新添加的计划
export function AddProcessPartMaterialDay(data) {
  return request({
    url: "/APSAPI/AddProcessPartMaterialDay",
    method: "POST",
    data,
  });
}

// 查询新增计划产品
export function SearchMaterialByLine(data) {
  return request({
    url: "/APSAPI/SearchMaterialByLine",
    method: "POST",
    data,
  });
}
