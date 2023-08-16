import request from "@/utils/request";

// 获取首页数据
export function wjBoardData_1(params) {
  return request({
    url: "/APSAPI/wjBoardData_1",
    method: "get",
    params,
  });
}
