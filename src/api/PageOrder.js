import request from "@/utils/request";
// 下达销售单
export function OneStepReleaseByOrder(data) {
  return request({
    url: "/APSAPI/OneStepReleaseByOrder",
    method: "POST",
    data,
  });
}
// 下达生产工单
export function MOPlanStep1(data) {
  return request({
    url: "/APSAPI/MOPlanStep1",
    method: "POST",
    data,
  });
}
