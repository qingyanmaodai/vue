import request from "@/utils/request";

// 下达工单
export function MOPlanStep1(data) {
  return request({
    url: "/APSAPI/MOPlanStep1",
    method: "POST",
    data
  });
}
// 进入分线列表
export function FSLMOPlanStep1(data) {
  return request({
    url: "/APSAPI/FSLMOPlanStep1",
    method: "POST",
    data
  });
}
// 计算完成期
export function MOPlanStep1Calculation(data) {
  return request({
    url: "/APSAPI/MOPlanStep1Calculation",
    method: "POST",
    data
  });
}
